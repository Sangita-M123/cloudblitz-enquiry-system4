const jwt = require("jsonwebtoken");
const { User } = require("../models/User");

/**
 * Protect middleware
 * Checks JWT token, verifies it, and attaches user to req.user.
 */
const protect = async (req, res, next) => {
  let token;

  // Extract token from Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401).json({ ok: false, msg: "No token provided" });
    return;
  }

  try {
    // Verify token and decode payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");

    // Find user in database
    const user = await User.findById(decoded.id).select("-passwordHash");

    if (!user) {
      res.status(404).json({ ok: false, msg: "User not found" });
      return;
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ ok: false, msg: "Invalid or expired token" });
  }
};

/**
 * Admin-only guard
 * Allows only admins to access specific routes.
 */
const adminOnly = (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ ok: false, msg: "Not authenticated" });
    return;
  }

  if (req.user.role !== "admin") {
    res.status(403).json({ ok: false, msg: "Access denied. Admins only." });
    return;
  }

  next();
};

module.exports = { protect, adminOnly };
