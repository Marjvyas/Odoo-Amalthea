const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
require('dotenv').config();

const router = express.Router();

// ROUTE 1: Register a new user and company (POST /api/auth/signup)
router.post('/signup', 
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
    check('companyName', 'Company name is required').not().isEmpty(),
    check('country', 'Country is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, companyName, country } = req.body;
    let connection;

    try {
      connection = await db.getConnection();
      const [users] = await connection.query('SELECT email FROM users WHERE email = ?', [email]);
      if (users.length > 0) {
        connection.release();
        return res.status(400).json({ errors: [{ msg: 'User with this email already exists' }] });
      }

      await connection.beginTransaction();
      const currency = "INR";
      const [companyResult] = await connection.query('INSERT INTO companies (name, country, currency) VALUES (?, ?, ?)', [companyName, country, currency]);
      const companyId = companyResult.insertId;
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      const [userResult] = await connection.query('INSERT INTO users (name, email, password_hash, role, company_id) VALUES (?, ?, ?, ?, ?)', [name, email, passwordHash, 'Admin', companyId]);
      await connection.commit();

      // Log successful registration
      console.log(`✅ NEW USER REGISTERED:`);
      console.log(`   Name: ${name}`);
      console.log(`   Email: ${email}`);
      console.log(`   Company: ${companyName}`);
      console.log(`   Country: ${country}`);
      console.log(`   User ID: ${userResult.insertId}`);
      console.log(`   Company ID: ${companyId}`);
      console.log(`   Time: ${new Date().toISOString()}`);
      console.log('----------------------------------------');

      const payload = { user: { id: userResult.insertId } };
      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
        if (err) throw err;
        res.status(201).json({ token });
      });

    } catch (err) {
      if (connection) await connection.rollback();
      console.error(err.message);
      res.status(500).send('Server error');
    } finally {
      if (connection) connection.release();
    }
  }
);

// ROUTE 2: Login user (POST /api/auth/login)
router.post('/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
        }
        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
        }

        // Log successful login
        console.log(`🔑 USER LOGIN:`);
        console.log(`   Name: ${user.name}`);
        console.log(`   Email: ${email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   User ID: ${user.id}`);
        console.log(`   Time: ${new Date().toISOString()}`);
        console.log('----------------------------------------');

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// ROUTE 3: Get current user data (GET /api/auth/me)
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const [users] = await db.query('SELECT id, name, email, role FROM users WHERE id = ?', [req.user.id]);
        if (users.length === 0) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(users[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;