const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  // Get the token from the request header (e.g., "Authorization: Bearer <token>")
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ msg: 'Token format is incorrect, authorization denied' });
    }
    
    // Verify the token using your JWT_SECRET from the .env file
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user's payload (which contains the user ID) to the request object
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = authMiddleware;