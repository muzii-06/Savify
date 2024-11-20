const express = require('express');
const multer = require('multer');
const Product = require('../models/Product'); // Import the Product model

const router = express.Router();

// Multer configuration for handling image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Folder for storing uploaded images
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Route: Add a new product
router.post('/', upload.array('images', 5), async (req, res) => {
  const { name, price, description, keywords, seller_name } = req.body;
  const imagePaths = req.files.map((file) => file.path); // Uploaded image paths

  try {
    const product = new Product({
      name,
      price,
      description,
      images: imagePaths,
      keywords: keywords.split(',').map((kw) => kw.trim()), // Convert keywords to array
      seller_name,
    });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add product', error });
  }
});

// Route: Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error });
  }
});

// Route: Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch product', error });
  }
});

// Route: Add a review to a product
router.post('/:id/review', async (req, res) => {
  const { user, rating, comment } = req.body;

  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.reviews.push({ user, rating, comment });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add review', error });
  }
});

module.exports = router;
