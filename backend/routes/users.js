const express = require('express');
const { check, validationResult } = require('express-validator');
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// ROUTE 1: Get all users with pending roles (Admin only) (GET /api/users/pending-roles)
router.get('/pending-roles', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Check if user is admin
    const [userResult] = await db.query('SELECT role FROM users WHERE id = ?', [userId]);
    if (userResult[0]?.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    // Get all users with pending roles
    const [users] = await db.query(`
      SELECT u.id, u.name, u.email, u.role, u.created_at, c.company_name 
      FROM users u
      LEFT JOIN companies c ON u.company_id = c.id
      WHERE u.role = 'Pending'
      ORDER BY u.created_at DESC
    `);

    console.log(`📋 FETCHING PENDING ROLE ASSIGNMENTS:`);
    console.log(`   Found ${users.length} users with pending roles`);
    console.log('----------------------------------------');

    res.json({ users });

  } catch (err) {
    console.error('Error fetching pending roles:', err.message);
    res.status(500).json({ message: 'Server error while fetching pending roles' });
  }
});

// ROUTE 2: Assign role to user (Admin only) (PUT /api/users/:id/assign-role)
router.put('/:id/assign-role',
  authMiddleware,
  [
    check('role', 'Valid role is required').isIn(['Employee', 'Manager', 'Admin']),
    check('managerId', 'Manager ID must be valid').optional().isInt()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const targetUserId = req.params.id;
    const { role, managerId } = req.body;
    const adminId = req.user.id;

    try {
      // Check if requesting user is admin
      const [adminResult] = await db.query('SELECT role FROM users WHERE id = ?', [adminId]);
      if (adminResult[0]?.role !== 'Admin') {
        return res.status(403).json({ message: 'Access denied. Admin role required.' });
      }

      // Check if target user exists and has pending role
      const [targetUserResult] = await db.query('SELECT name, email, role FROM users WHERE id = ?', [targetUserId]);
      if (targetUserResult.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      const targetUser = targetUserResult[0];
      if (targetUser.role !== 'Pending') {
        return res.status(400).json({ message: 'User already has an assigned role' });
      }

      // If assigning Manager or Employee role, validate manager ID
      if (managerId && (role === 'Employee' || role === 'Manager')) {
        const [managerResult] = await db.query('SELECT role FROM users WHERE id = ?', [managerId]);
        if (managerResult.length === 0 || !['Manager', 'Admin'].includes(managerResult[0].role)) {
          return res.status(400).json({ message: 'Invalid manager ID' });
        }
      }

      // Update user role
      let updateQuery = 'UPDATE users SET role = ?, assigned_by = ?, role_assigned_at = NOW()';
      let updateParams = [role, adminId];

      if ((role === 'Employee' || role === 'Manager') && managerId) {
        updateQuery += ', manager_id = ?';
        updateParams.push(managerId);
      }

      updateQuery += ' WHERE id = ?';
      updateParams.push(targetUserId);

      await db.query(updateQuery, updateParams);

      // Log the role assignment
      console.log(`👥 ROLE ASSIGNED:`);
      console.log(`   User: ${targetUser.name} (${targetUser.email})`);
      console.log(`   New Role: ${role}`);
      console.log(`   Assigned by Admin ID: ${adminId}`);
      if (managerId) {
        console.log(`   Manager ID: ${managerId}`);
      }
      console.log('----------------------------------------');

      res.json({ 
        message: `Role '${role}' assigned successfully`,
        user: {
          id: targetUserId,
          name: targetUser.name,
          email: targetUser.email,
          role: role,
          managerId: managerId || null
        }
      });

    } catch (err) {
      console.error('Error assigning role:', err.message);
      res.status(500).json({ message: 'Server error while assigning role' });
    }
  }
);

// ROUTE 3: Get all users (Admin/Manager view) (GET /api/users/all)
router.get('/all', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Check user role
    const [userResult] = await db.query('SELECT role FROM users WHERE id = ?', [userId]);
    const userRole = userResult[0]?.role;

    if (!['Manager', 'Admin'].includes(userRole)) {
      return res.status(403).json({ message: 'Access denied. Manager or Admin role required.' });
    }

    let query = `
      SELECT u.id, u.name, u.email, u.role, u.created_at, u.role_assigned_at,
             c.company_name, m.name as manager_name
      FROM users u
      LEFT JOIN companies c ON u.company_id = c.id
      LEFT JOIN users m ON u.manager_id = m.id
    `;

    if (userRole === 'Manager') {
      // Managers can only see their team members
      query += ' WHERE u.manager_id = ? OR u.id = ?';
      const [users] = await db.query(query + ' ORDER BY u.created_at DESC', [userId, userId]);
      res.json({ users });
    } else {
      // Admins can see all users
      const [users] = await db.query(query + ' ORDER BY u.created_at DESC');
      res.json({ users });
    }

  } catch (err) {
    console.error('Error fetching all users:', err.message);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
});

// ROUTE 4: Get managers list (for role assignment dropdown) (GET /api/users/managers)
router.get('/managers', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Check if requesting user is admin
    const [userResult] = await db.query('SELECT role FROM users WHERE id = ?', [userId]);
    if (userResult[0]?.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    // Get all managers and admins
    const [managers] = await db.query(`
      SELECT id, name, email, role 
      FROM users 
      WHERE role IN ('Manager', 'Admin') 
      ORDER BY name ASC
    `);

    res.json({ managers });

  } catch (err) {
    console.error('Error fetching managers:', err.message);
    res.status(500).json({ message: 'Server error while fetching managers' });
  }
});

// ROUTE 5: Update user profile (PUT /api/users/profile)
router.put('/profile',
  authMiddleware,
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Valid email is required').isEmail()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    const { name, email } = req.body;

    try {
      // Check if email is already taken by another user
      const [existingUser] = await db.query('SELECT id FROM users WHERE email = ? AND id != ?', [email, userId]);
      if (existingUser.length > 0) {
        return res.status(400).json({ message: 'Email is already taken' });
      }

      // Update user profile
      await db.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, userId]);

      console.log(`📝 PROFILE UPDATED:`);
      console.log(`   User ID: ${userId}`);
      console.log(`   New Name: ${name}`);
      console.log(`   New Email: ${email}`);
      console.log('----------------------------------------');

      res.json({ message: 'Profile updated successfully', name, email });

    } catch (err) {
      console.error('Error updating profile:', err.message);
      res.status(500).json({ message: 'Server error while updating profile' });
    }
  }
);

module.exports = router;