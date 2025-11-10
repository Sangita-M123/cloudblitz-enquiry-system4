const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const { User } = require("../models/User");

const router = express.Router();

// GET /api/admin/users → fetch all users (admin only)
router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-passwordHash");
    res.json({ ok: true, users });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
});

// PUT /api/admin/users/:id/role → update user role
router.put("/users/:id/role", protect, adminOnly, async (req, res) => {
  try {
    const { role } = req.body;
    if (!role) {
      res.status(400).json({ ok: false, msg: "Role is required" });
      return;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-passwordHash");

    if (!user) {
      res.status(404).json({ ok: false, msg: "User not found" });
      return;
    }

    res.json({ ok: true, msg: "Role updated", user });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
});

// DELETE /api/admin/users/:id → delete user
router.delete("/users/:id", protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).json({ ok: false, msg: "User not found" });
      return;
    }

    res.json({ ok: true, msg: "User deleted" });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
});

module.exports = router;
