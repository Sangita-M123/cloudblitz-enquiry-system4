/**
 * Role-based authorization middleware
 * Restricts access to specific user roles (e.g., 'admin', 'staff', etc.)
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401).json({ ok: false, msg: "Not authenticated" });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ ok: false, msg: "Access denied" });
      return;
    }

    next();
  };
};

module.exports = { authorizeRoles };
