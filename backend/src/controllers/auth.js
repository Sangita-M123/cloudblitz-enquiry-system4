const bcrypt = require("bcryptjs");
const { User } = require("../models/User");
const { generateToken } = require("../utils/generateToken");

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      res.status(400).json({ ok: false, msg: "User with this email already exists" });
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user (role defaults to "user" if not provided)
    const user = await User.create({ 
      name, 
      email, 
      passwordHash, 
      role: role || "user" 
    });
    
    const token = generateToken(String(user._id), user.role);

    res.status(201).json({
      ok: true,
      msg: "User registered successfully",
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ ok: false, msg: "Invalid email or password" });
      return;
    }

    // Check if user is soft deleted
    if (user.deletedAt) {
      res.status(403).json({ ok: false, msg: "Account has been deactivated" });
      return;
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(400).json({ ok: false, msg: "Invalid email or password" });
      return;
    }

    const token = generateToken(String(user._id), user.role);
    
    res.json({ 
      ok: true, 
      msg: "Login successful", 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      }, 
      token 
    });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

const getMe = async (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ ok: false, msg: "Not authenticated" });
      return;
    }

    const user = await User.findById(req.user._id).select("-passwordHash");
    if (!user) {
      res.status(404).json({ ok: false, msg: "User not found" });
      return;
    }

    res.json({ 
      ok: true, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

module.exports = { registerUser, loginUser, getMe };
