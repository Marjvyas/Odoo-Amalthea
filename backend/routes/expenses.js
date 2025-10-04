const express = require('express');
const multer = require('multer');
const path = require('path');
const { check, validationResult } = require('express-validator');
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/receipts/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'receipt-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and PDF files are allowed'));
    }
  }
});

// ROUTE 1: Submit a new expense (POST /api/expenses/submit)
router.post('/submit',
  authMiddleware,
  upload.single('receipt'),
  [
    check('description', 'Description is required').not().isEmpty(),
    check('amount', 'Amount must be a positive number').isFloat({ min: 0.01 }),
    check('category', 'Category is required').not().isEmpty(),
    check('expenseDate', 'Valid expense date is required').isDate(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { description, amount, category, expenseDate, notes } = req.body;
    const userId = req.user.id;
    const receiptUrl = req.file ? `/uploads/receipts/${req.file.filename}` : null;

    try {
      const [result] = await db.query(
        'INSERT INTO expenses (user_id, description, amount, category, expense_date, receipt_url, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [userId, description, parseFloat(amount), category, expenseDate, receiptUrl, notes || null]
      );

      console.log(`💰 NEW EXPENSE SUBMITTED:`);
      console.log(`   User ID: ${userId}`);
      console.log(`   Description: ${description}`);
      console.log(`   Amount: ₹${amount}`);
      console.log(`   Category: ${category}`);
      console.log(`   Date: ${expenseDate}`);
      console.log(`   Receipt: ${receiptUrl || 'No receipt'}`);
      console.log(`   Expense ID: ${result.insertId}`);
      console.log('----------------------------------------');

      res.status(201).json({
        message: 'Expense submitted successfully',
        expenseId: result.insertId,
        receiptUrl: receiptUrl
      });

    } catch (err) {
      console.error('Error submitting expense:', err.message);
      res.status(500).json({ message: 'Server error while submitting expense' });
    }
  }
);

// ROUTE 2: Get user's expenses (GET /api/expenses/my-expenses)
router.get('/my-expenses', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { status, limit = 50, offset = 0 } = req.query;

  try {
    let query = `
      SELECT e.*, u.name as approver_name 
      FROM expenses e 
      LEFT JOIN users u ON e.approved_by = u.id 
      WHERE e.user_id = ?
    `;
    let queryParams = [userId];

    if (status && status !== 'all') {
      query += ' AND e.status = ?';
      queryParams.push(status);
    }

    query += ' ORDER BY e.submitted_at DESC LIMIT ? OFFSET ?';
    queryParams.push(parseInt(limit), parseInt(offset));

    const [expenses] = await db.query(query, queryParams);

    res.json({
      expenses: expenses,
      count: expenses.length
    });

  } catch (err) {
    console.error('Error fetching expenses:', err.message);
    res.status(500).json({ message: 'Server error while fetching expenses' });
  }
});

// ROUTE 3: Get expenses for approval (Manager/Admin) (GET /api/expenses/pending-approvals)
router.get('/pending-approvals', authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    // Get user role
    const [userResult] = await db.query('SELECT role FROM users WHERE id = ?', [userId]);
    const userRole = userResult[0]?.role;

    if (!['Manager', 'Admin'].includes(userRole)) {
      return res.status(403).json({ message: 'Access denied. Manager or Admin role required.' });
    }

    let query = `
      SELECT e.*, u.name as employee_name, u.email as employee_email
      FROM expenses e
      JOIN users u ON e.user_id = u.id
      WHERE e.status = 'pending'
    `;

    // If Manager, only show expenses from their team members
    if (userRole === 'Manager') {
      query += ' AND u.manager_id = ?';
      const [expenses] = await db.query(query, [userId]);
      res.json({ expenses });
    } else {
      // Admin can see all pending expenses
      const [expenses] = await db.query(query);
      res.json({ expenses });
    }

  } catch (err) {
    console.error('Error fetching pending approvals:', err.message);
    res.status(500).json({ message: 'Server error while fetching pending approvals' });
  }
});

// ROUTE 4: Approve or reject an expense (PUT /api/expenses/:id/approve)
router.put('/:id/approve', 
  authMiddleware,
  [
    check('action', 'Action must be either approve or reject').isIn(['approve', 'reject']),
    check('rejectionReason', 'Rejection reason is required when rejecting').optional()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const expenseId = req.params.id;
    const { action, rejectionReason } = req.body;
    const approverId = req.user.id;

    try {
      // Check if user has permission to approve
      const [userResult] = await db.query('SELECT role FROM users WHERE id = ?', [approverId]);
      const userRole = userResult[0]?.role;

      if (!['Manager', 'Admin'].includes(userRole)) {
        return res.status(403).json({ message: 'Access denied. Manager or Admin role required.' });
      }

      // Get expense details
      const [expenseResult] = await db.query('SELECT * FROM expenses WHERE id = ?', [expenseId]);
      if (expenseResult.length === 0) {
        return res.status(404).json({ message: 'Expense not found' });
      }

      const expense = expenseResult[0];
      if (expense.status !== 'pending') {
        return res.status(400).json({ message: 'Expense has already been processed' });
      }

      // Update expense status
      if (action === 'approve') {
        await db.query(
          'UPDATE expenses SET status = ?, approved_by = ?, approved_at = NOW() WHERE id = ?',
          ['approved', approverId, expenseId]
        );

        console.log(`✅ EXPENSE APPROVED:`);
        console.log(`   Expense ID: ${expenseId}`);
        console.log(`   Approved by: ${approverId}`);
        console.log(`   Amount: ₹${expense.amount}`);
        console.log('----------------------------------------');

        res.json({ message: 'Expense approved successfully' });
      } else {
        await db.query(
          'UPDATE expenses SET status = ?, approved_by = ?, rejected_at = NOW(), rejection_reason = ? WHERE id = ?',
          ['rejected', approverId, rejectionReason, expenseId]
        );

        console.log(`❌ EXPENSE REJECTED:`);
        console.log(`   Expense ID: ${expenseId}`);
        console.log(`   Rejected by: ${approverId}`);
        console.log(`   Reason: ${rejectionReason}`);
        console.log(`   Amount: ₹${expense.amount}`);
        console.log('----------------------------------------');

        res.json({ message: 'Expense rejected successfully' });
      }

    } catch (err) {
      console.error('Error processing expense approval:', err.message);
      res.status(500).json({ message: 'Server error while processing approval' });
    }
  }
);

// ROUTE 5: Get expense statistics (GET /api/expenses/stats)
router.get('/stats', authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const [stats] = await db.query(`
      SELECT 
        COUNT(*) as total_expenses,
        SUM(CASE WHEN status = 'approved' THEN amount ELSE 0 END) as approved_amount,
        SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as pending_amount,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_count,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
        COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_count
      FROM expenses 
      WHERE user_id = ?
    `, [userId]);

    res.json(stats[0]);

  } catch (err) {
    console.error('Error fetching expense stats:', err.message);
    res.status(500).json({ message: 'Server error while fetching stats' });
  }
});

module.exports = router;