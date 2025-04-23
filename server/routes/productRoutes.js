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
// Route: Fetch all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().populate("seller", "storeName _id"); // ✅ ADD THIS
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
    }).populate('seller', 'storeName _id');
    

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

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      console.error("❌ Invalid product ID received:", id);
      return res.status(400).json({ message: 'Invalid product ID.' });
  }

  try {
      const product = await Product.findById(id).populate('seller', 'storeName _id email contactNumber');

      if (!product) {
          return res.status(404).json({ message: 'Product not found.' });
      }

      if (!product.seller || !product.seller._id) {
          console.warn("⚠️ Warning: Seller ID missing in fetched product:", product.name);
      }

      console.log("📌 Product Sent from Backend:", product); // ✅ Log backend response
      res.status(200).json(product);
  } catch (error) {
      console.error('❌ Error fetching product:', error);
      res.status(500).json({ message: 'Failed to fetch product.' });
  }
});






// ✅ Fetch products by seller ID
router.get('/seller/:sellerId', async (req, res) => {
  const { sellerId } = req.params;

  try {
    const products = await Product.find({ seller: sellerId });
    res.status(200).json(products);
  } catch (error) {
    console.error('❌ Error fetching seller products:', error);
    res.status(500).json({ message: 'Failed to fetch seller products.' });
  }
});

// ✅ Update a product by ID
// ✅ Update product details (excluding images)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price, description, category, subcategory, quantity } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, price, description, category, subcategory, quantity },
      { new: true } // ✅ Return updated product
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('❌ Error updating product:', error);
    res.status(500).json({ message: 'Failed to update product.' });
  }
});

router.put('/:id/images', upload.array('images', 5), async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // ✅ Replace existing images with new ones
    const imagePaths = req.files.map((file) => file.path);
    product.images = imagePaths;

    await product.save();
    res.status(200).json({ message: "Product images updated successfully.", images: imagePaths });
  } catch (error) {
    console.error("❌ Error updating product images:", error);
    res.status(500).json({ message: "Failed to update product images." });
  }
});

// ✅ Delete a product by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    res.status(200).json({ message: 'Product deleted successfully.' });
  } catch (error) {
    console.error('❌ Error deleting product:', error);
    res.status(500).json({ message: 'Failed to delete product.' });
  }
});

router.get("/seller/:sellerId/reviews", async (req, res) => {
  const { sellerId } = req.params;

  try {
    const products = await Product.find({ seller: sellerId }, "name images reviews");
    const reviews = products.flatMap((product) =>
      product.reviews.map((review) => ({
        ...review.toObject(),
        productName: product.name,
        productImage: product.images[0] || "", // ✅ Get first product image
        productId: product._id,
      }))
    );

    res.status(200).json(reviews);
  } catch (error) {
    console.error("❌ Error fetching reviews:", error);
    res.status(500).json({ message: "Failed to fetch reviews." });
  }
});

// ✅ Delete a Review
router.delete("/:productId/reviews/:reviewId", async (req, res) => {
  const { productId, reviewId } = req.params;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found." });

    product.reviews = product.reviews.filter((review) => review._id.toString() !== reviewId);
    await product.save();

    res.status(200).json({ message: "Review deleted successfully." });
  } catch (error) {
    console.error("❌ Error deleting review:", error);
    res.status(500).json({ message: "Failed to delete review." });
  }
});

// ✅ Reply to a Review
router.put("/:productId/reviews/:reviewId/reply", async (req, res) => {
  const { productId, reviewId } = req.params;
  const { reply } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found." });

    const review = product.reviews.find((review) => review._id.toString() === reviewId);
    if (!review) return res.status(404).json({ message: "Review not found." });

    review.reply = reply;
    await product.save();

    res.status(200).json({ message: "Reply added successfully.", review });
  } catch (error) {
    console.error("❌ Error adding reply:", error);
    res.status(500).json({ message: "Failed to add reply." });
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
    }).populate('seller', 'storeName _id'); // ✅ ADD THIS

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ message: 'Failed to fetch products by category.' });
  }
});


// Route: Fetch a single product by ID


// Add a new product
// Add a new product
router.post("/", upload.array("images", 5), async (req, res) => {
  const {
    name,
    price,
    description,
    category,
    subcategory,
    quantity,
    sellerId,
    bargainRounds,
    maxDiscountPercent,
  } = req.body;

  if (!name || !price || !description || !category || !subcategory || !quantity || !sellerId) {
    return res.status(400).json({ message: "All fields, including sellerId, are required." });
  }

  try {
    // ✅ Validate Seller ID
    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ message: "Seller not found." });
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
      seller: sellerId,
      bargainRounds: Number(bargainRounds) || 0,            // ✅ Add Bargaining Logic
      maxDiscountPercent: Number(maxDiscountPercent) || 0,  // ✅ Add Max Discount Logic
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("❌ Error adding product:", error);
    res.status(500).json({ message: "Failed to add product." });
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