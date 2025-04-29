
const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

// دریافت همه کاربران (فقط برای مدیر)
router.get("/", authMiddleware(["admin"]), async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ایجاد کاربر جدید (فقط برای مدیر)
router.post("/", authMiddleware(["admin"]), async (req, res) => {
  const { phone, password, name, role } = req.body;
  try {
    if (!phone || !password || !name) {
      return res.status(400).json({ message: "Phone, password, and name are required" });
    }
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      phone,
      password: hashedPassword,
      name,
      role: role || "user"
    });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// حذف کاربر (فقط برای مدیر)
router.delete("/:id", authMiddleware(["admin"]), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role === "admin") {
      return res.status(403).json({ message: "Cannot delete admin user" });
    }
    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
