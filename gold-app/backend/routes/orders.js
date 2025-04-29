const express = require("express");
const jwt = require("jsonwebtoken");
const Order = require("../models/Order");
const router = express.Router();

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    console.error("No token provided");
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }
  try {
    const decoded = jwt.verify(token, "my-super-secret-key-1234567890");
    console.log("Decoded token:", decoded); // برای دیباگ
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Invalid token:", error.message);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

router.get("/", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find().populate("userId").populate("marketId");
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admins only" });
    }
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(order);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;