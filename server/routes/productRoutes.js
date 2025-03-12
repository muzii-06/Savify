const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Seller = require('../models/Seller'); // ✅ Import Seller model

const multer = require('multer');
const path = require('path');

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Route: Fetch all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// Route: Search products
// Search products by name, description, or category
router.get('/search', async (req, res) => {
  const { query } = req.query;

  try {
    if (!query) {
      console.error('Search query is missing.');
      return res.status(400).json({ message: 'Search query is required.' });
    }

    console.log(`Received search query: "${query}"`);

    // Perform the database search
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
      ],
    });

    console.log(`Search results for "${query}":`, products);

    // Return an empty array or a specific message with 200 status
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching search results:', error);
    res.status(500).json({ message: 'Failed to fetch search results.', error: error.message });
  }
});



// Fetch a single product by ID
// Fetch a single product by ID with seller details
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid product ID.' });
    }

    // ✅ Populate seller details (storeName only)
    const product = await Product.findById(id).populate('seller', 'storeName');

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Failed to fetch product.' });
  }
});





// Route: Fetch products by category
router.get('/category/:category', async (req, res) => {
  const category = decodeURIComponent(req.params.category).toLowerCase();
  console.log('Requested Category:', category);

  try {
    const products = await Product.find({
      $or: [
        { category: { $regex: new RegExp(`^${category}$`, 'i') } },
        { subcategory: { $regex: new RegExp(`^${category}$`, 'i') } },
      ],
    });

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ message: 'Failed to fetch products by category.' });
  }
});

// Route: Fetch a single product by ID


// Add a new product
router.post('/', upload.array('images', 5), async (req, res) => {
  const { name, price, description, category, subcategory, quantity, sellerId } = req.body;

  if (!name || !price || !description || !category || !subcategory || !quantity || !sellerId) {
    return res.status(400).json({ message: 'All fields, including sellerId, are required.' });
  }

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'At least one product image is required.' });
  }

  try {
    // ✅ Verify Seller Exists
    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found.' });
    }

    const imagePaths = req.files.map((file) => file.path);

    const newProduct = new Product({
      name,
      price,
      description,
      category,
      subcategory,
      quantity: Number(quantity),
      images: imagePaths,
      seller: seller._id, // ✅ Store seller as ObjectId reference
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Failed to add product.' });
  }
});

// Route: Add a review to a product
router.post('/:id/reviews', async (req, res) => {
  const { id } = req.params;
  const { user, rating, comment } = req.body;

  if (!user || !rating || !comment) {
    return res.status(400).json({ message: 'User, rating, and comment are required' });
  }

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const newReview = { user, rating: Number(rating), comment };
    product.reviews.push(newReview);

    await product.save();
    res.status(201).json({ message: 'Review added successfully', review: newReview });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Failed to add review' });
  }
});

module.exports = router;
