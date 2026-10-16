const jwt = require('jsonwebtoken');

// Generate a JWT token containing user ID and role
function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    }
  );
}

module.exports = generateToken;
