const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a connection pool using credentials from your .env file
// A pool is more efficient as it manages multiple connections
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;