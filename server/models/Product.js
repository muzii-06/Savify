const mongoose = require('mongoose');

// Review Schema
const reviewSchema = new mongoose.Schema({
  user: { type: String, required: true }, // User who reviewed
  rating: { type: Number, required: true, min: 1, max: 5 }, // Star rating
  comment: { type: String, required: true }, // Review comment
  createdAt: { type: Date, default: Date.now }, // Date of the review
});

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  images: [{ type: String, required: true }], // Array of image paths
  reviews: [reviewSchema], // Array of reviews
  sellerName: { type: String, required: true }, // Seller's store name
  createdAt: { type: Date, default: Date.now }, // Date of creation
});

module.exports = mongoose.model('Product', productSchema);
