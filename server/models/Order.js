const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  buyer: {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    contactNumber: { type: String, required: true },
  },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      name: { type: String, required: true },
      image: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      seller: {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true },
        storeName: String,
      },
    },
  ],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },

  // ✅ Add this field:
  status: {
    type: String,
    enum: ["Pending", "Shipped", "Delivered"],
    default: "Pending",
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
