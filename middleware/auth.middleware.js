const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// Verify the token sent by the client and attach user to req.user
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if Authorization header is present and starts with 'Bearer '
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Authentication token is required. Format: Bearer <token>'
      });
    }

    // Extract the token string
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        message: 'Token is missing from Authorization header'
      });
    }

    // Verify token using secret key
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      return res.status(401).json({
        message: 'Invalid or expired token'
      });
    }

    // Fetch the current user from MongoDB using ID from token payload
    const user = await User.findById(decoded.id).select('-password');

    // Reject if user no longer exists in database
    if (!user) {
      return res.status(401).json({
        message: 'User belonging to this token no longer exists'
      });
    }

    // Reject inactive accounts
    if (!user.isActive) {
      return res.status(403).json({
        message: 'User account is inactive. Please contact administrator'
      });
    }

    // Attach authenticated user to req.user
    req.user = user;

    // Continue to next middleware or controller
    next();
  } catch (error) {
    return res.status(500).json({
      message: 'Authentication error: ' + error.message
    });
  }
};

module.exports = authMiddleware;
