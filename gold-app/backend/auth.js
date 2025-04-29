const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = require("express").Router();

router.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    if (user.role === "admin") {
      return res.status(403).json({ error: "Admins must use /admin-login" });
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, "your-secret-key");
    res.json({ token, role: user.role });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/admin-login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Only admins can use this endpoint" });
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, "your-secret-key");
    res.json({ token, role: user.role });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
