const express = require('express');
const router = express.Router();
const Seller = require('../models/Seller');
const User = require('../models/User');
const Product = require('../models/Product');

// GET all sellers
router.get('/admin/sellers', async (req, res) => {
  try {
    const sellers = await Seller.find().select('-password');
    res.json(sellers);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE seller by ID
router.delete('/admin/seller/:id', async (req, res) => {
  try {
    await Seller.findByIdAndDelete(req.params.id);
    res.json({ message: 'Seller deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting seller' });
  }
});
router.get('/admin/users', async (req, res) => {
    try {
      const users = await User.find().select('-password');
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: 'Server error while fetching buyers' });
    }
  });
  
  // DELETE buyer by ID
  router.delete('/admin/user/:id', async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.json({ message: 'Buyer deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting buyer' });
    }
  });
  // ✅ FIXED: Add /admin prefix
// GET /api/admin/products
router.get('/admin/products', async (req, res) => {
    try {
      const products = await Product.find().populate('seller', 'storeName').lean();
  
      const formatted = products.map(product => {
        const totalReviews = product.reviews.length;
        const averageRating = totalReviews > 0
          ? (product.reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
          : null;
  
        return {
          _id: product._id,
          name: product.name,
          quantity: product.quantity,
          image: product.images?.[0] || '',
          storeName: product.seller?.storeName || 'Unknown',
          totalReviews,
          averageRating,
        };
      });
  
      res.status(200).json(formatted);
    } catch (err) {
      console.error('❌ Error fetching admin products:', err);
      res.status(500).json({ message: 'Failed to fetch products' });
    }
  });
  
  
  
  router.delete('/admin/products/:id', async (req, res) => {
    try {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ message: 'Product deleted successfully.' });
    } catch (err) {
      res.status(500).json({ message: 'Failed to delete product.' });
    }
  });
  
  // Fix this line
router.get('/admin/stats', async (req, res) => {
  try {
    const buyers = await User.countDocuments();
    const sellers = await Seller.countDocuments();
    const products = await Product.countDocuments();
    res.json({ buyers, sellers, products });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

  

module.exports = router;
