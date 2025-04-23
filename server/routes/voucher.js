const express = require("express");
const router = express.Router();
const Voucher = require("../models/Voucher");

// POST /api/vouchers
router.post("/", async (req, res) => {
  const { userId, productId, discountedPrice } = req.body;

  try {
    const voucher = new Voucher({ userId, productId, discountedPrice });
    await voucher.save();
    res.status(201).json(voucher);
  } catch (err) {
    console.error("❌ Failed to create voucher:", err);
    res.status(500).json({ message: "Error saving voucher." });
  }
});

// GET /api/vouchers/:userId/:productId
router.get("/:userId/:productId", async (req, res) => {
  const { userId, productId } = req.params;

  try {
    const voucher = await Voucher.findOne({ userId, productId });
    if (!voucher) return res.status(404).json({ message: "No voucher found" });

    // Optionally check for expiration
    if (voucher.expiresAt < new Date()) {
      return res.status(410).json({ message: "Voucher expired" });
    }

    res.json(voucher);
  } catch (err) {
    res.status(500).json({ message: "Error fetching voucher" });
  }
});

module.exports = router;
