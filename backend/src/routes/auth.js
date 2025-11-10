const express = require("express");
const { registerUser, loginUser, getMe } = require("../controllers/auth");
const { validate } = require("../middlewares/validate");
const { registerSchema, loginSchema } = require("../validators/auth.validator");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// POST /api/auth/register - Register new user
router.post("/register", validate(registerSchema), registerUser);

// POST /api/auth/login - Login user
router.post("/login", validate(loginSchema), loginUser);

// GET /api/auth/me - Get current user info
router.get("/me", protect, getMe);

module.exports = router;
