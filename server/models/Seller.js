// models/Seller.js
const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  storeName: { type: String, required: false }, // Optional: store name for sellers
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Seller', sellerSchema);
