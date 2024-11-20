const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  images: [{ type: String }], // Array of image URLs
  keywords: [{ type: String, maxLength: 3 }],
  seller_name: { type: String, required: true },
  reviews: [
    {
      user: { type: String },
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', ProductSchema);
