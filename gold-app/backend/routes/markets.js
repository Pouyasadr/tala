const express = require("express");
const jwt = require("jsonwebtoken");
const Market = require("../models/Market");
const router = express.Router();

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, "my-super-secret-key-1234567890");
    if (decoded.role !== "admin") return res.status(403).json({ message: "Admins only" });
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

router.get("/", async (req, res) => {
  try {
    const markets = await Market.find();
    res.json(markets);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const market = new Market(req.body);
    await market.save();
    res.status(201).json(market);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { minAmount, maxAmount } = req.body;
    const market = await Market.findByIdAndUpdate(
      req.params.id,
      { minAmount, maxAmount },
      { new: true }
    );
    res.json(market);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Market.findByIdAndDelete(req.params.id);
    res.json({ message: "Market deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;