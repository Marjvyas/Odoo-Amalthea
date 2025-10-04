const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Initialize the app
const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads', 'receipts');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Created uploads/receipts directory');
}

// --- Middleware ---
// Enable Cross-Origin Resource Sharing (CORS) so your frontend can communicate with this backend
app.use(cors());
// Enable the express app to parse JSON formatted request bodies
app.use(express.json());
// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- API Routes ---
// Tell the app to use your auth routes for any request to "/api/auth"
app.use('/api/auth', require('./routes/auth'));
// Expense management routes
app.use('/api/expenses', require('./routes/expenses'));
// User management routes
app.use('/api/users', require('./routes/users'));

// --- Health Check Route ---
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'ExpenseFlow API Server is running',
    timestamp: new Date().toISOString()
  });
});

// --- Server Activation ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('🚀 ExpenseFlow API Server Started');
  console.log(`   Port: ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Database: MySQL (expense_tracker)`);
  console.log('   Available Routes:');
  console.log('   - GET  /api/health');
  console.log('   - POST /api/auth/login');
  console.log('   - POST /api/auth/signup');
  console.log('   - POST /api/expenses/submit');
  console.log('   - GET  /api/expenses/my-expenses');
  console.log('   - GET  /api/expenses/pending-approvals');
  console.log('   - PUT  /api/expenses/:id/approve');
  console.log('   - GET  /api/expenses/stats');
  console.log('   - GET  /api/users/pending-roles');
  console.log('   - PUT  /api/users/:id/assign-role');
  console.log('   - GET  /api/users/all');
  console.log('   - GET  /api/users/managers');
  console.log('   - PUT  /api/users/profile');
  console.log('========================================');
});