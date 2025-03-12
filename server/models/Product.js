const mongoose = require('mongoose');

// Review Schema
const reviewSchema = new mongoose.Schema({
  user: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  images: [{ type: String, required: true }],
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  quantity: { type: Number, required: true },
  reviews: [reviewSchema],
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true }, // ✅ Reference Seller model
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', productSchema);
