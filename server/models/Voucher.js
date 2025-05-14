const mongoose = require("mongoose");

const voucherSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  discountedPrice: { type: Number, required: true },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 24 * 60  * 60 * 1000) }, // 24hrs
});

module.exports = mongoose.model("Voucher", voucherSchema);
