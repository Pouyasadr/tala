
const express = require("express");
const router = express.Router();
const Price = require("../models/Price");
const authMiddleware = require("../middleware/auth");
const Market = require("../models/Market");
const mongoose = require("mongoose");

// ثبت نرخ جدید (فقط برای مدیر)
router.post("/", authMiddleware(["admin"]), async (req, res) => {
  const { marketId, buyPrice, sellPrice } = req.body;
  try {
    // اعتبارسنجی ورودی‌ها
    if (!marketId || buyPrice === undefined || sellPrice === undefined) {
      return res.status(400).json({ message: "Market ID, buy price, and sell price are required" });
    }
    if (!mongoose.Types.ObjectId.isValid(marketId)) {
      return res.status(400).json({ message: "Invalid market ID format" });
    }
    if (isNaN(buyPrice) || isNaN(sellPrice) || Number(buyPrice) < 0 || Number(sellPrice) < 0) {
      return res.status(400).json({ message: "Buy price and sell price must be valid non-negative numbers" });
    }
    // چک کردن وجود بازار
    const market = await Market.findById(marketId);
    if (!market) {
      return res.status(404).json({ message: "Market not found" });
    }
    // ایجاد نرخ جدید
    const price = new Price({
      marketId,
      buyPrice: Number(buyPrice),
      sellPrice: Number(sellPrice)
    });
    await price.save();
    res.status(201).json(price);
  } catch (error) {
    console.error("Error creating price:", {
      message: error.message,
      stack: error.stack,
      requestBody: req.body,
      validationErrors: error.errors ? Object.values(error.errors).map(e => e.message) : null
    });
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation failed",
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// دریافت همه نرخ‌ها
router.get("/", async (req, res) => {
  try {
    const prices = await Price.find().populate("marketId");
    res.json(prices);
  } catch (error) {
    console.error("Error fetching prices:", {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
