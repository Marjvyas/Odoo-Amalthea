const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Initialize the app
const app = express();

// --- Middleware ---
// Enable Cross-Origin Resource Sharing (CORS) so your frontend can communicate with this backend
app.use(cors());
// Enable the express app to parse JSON formatted request bodies
app.use(express.json());

// --- API Routes ---
// Tell the app to use your auth routes for any request to "/api/auth"
app.use('/api/auth', require('./routes/auth'));
// (You will add your expenses route here later)
// app.use('/api/expenses', require('./routes/expenses'));

// --- Server Activation ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));