const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to save uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Generate a unique filename
  },
});

const upload = multer({ storage });

// Route: Fetch all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products); // Respond with fetched products
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// Route: Fetch a single product by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product); // Respond with the found product
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
});

// Route: Add a new product
router.post('/', upload.array('images', 5), async (req, res) => {
  const { name, price, description, sellerName } = req.body;

  // Ensure at least one image is uploaded
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'At least one product image is required' });
  }

  const imagePaths = req.files.map((file) => file.path); // Store file paths of uploaded images

  try {
    const newProduct = new Product({
      name,
      price,
      description,
      images: imagePaths,
      sellerName,
    });

    await newProduct.save(); // Save the new product to the database
    res.status(201).json(newProduct); // Respond with the newly created product
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Failed to add product' });
  }
});

// Route: Add a review to a product
// Route: Add a review to a product
// Route: Add a review to a product
router.post('/:id/reviews', async (req, res) => {
  const { id } = req.params;
  const { user, rating, comment } = req.body;

  // Validate required fields
  if (!user || !rating || !comment) {
    return res.status(400).json({ message: 'User, rating, and comment are required' });
  }

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const newReview = {
      user, // Dynamically assign user name
      rating: Number(rating),
      comment,
    };

    // Add the new review to the product's reviews array
    product.reviews.push(newReview);
    await product.save(); // Save the updated product to the database

    res.status(201).json({ message: 'Review added successfully', review: newReview });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Failed to add review' });
  }
});



module.exports = router;
