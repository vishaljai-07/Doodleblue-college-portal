// Reusable permission middleware to check user roles
const permissionMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        message: 'Unauthorized: User is not authenticated'
      });
    }

    // Check the user's role from the database record attached by auth.middleware
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Access denied'
      });
    }

    // User has the permitted role, proceed to next handler
    next();
  };
};

module.exports = permissionMiddleware;
module.exports.permissionMiddleware = permissionMiddleware;
module.exports.allowRoles = permissionMiddleware;
