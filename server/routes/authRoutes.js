const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Seller = require('../models/Seller'); // Import the Seller model

const router = express.Router();

// Helper function to generate JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// User signup route
router.post('/signup', async (req, res) => {
  const { username, email, password, address, dateOfBirth, gender, contactNumber } = req.body;

  try {
    // Validate required fields
    if (!username || !email || !password || !address || !dateOfBirth || !gender || !contactNumber) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate contact number format
    if (!/^\+92\d{10}$/.test(contactNumber)) {
      return res.status(400).json({ message: 'Contact number must start with +92 and contain exactly 10 digits.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      address,
      dateOfBirth,
      gender,
      contactNumber,
    });

    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Server error while creating user' });
  }
});



// User login route
// User login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id);

    // Include username in the response
    res.json({
      token,
      username: user.username, // Add the username here
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});


// Seller signup route
router.post('/seller-signup', async (req, res) => {
  const { username, email, password, storeName } = req.body;
  try {
    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newSeller = new Seller({ username, email, password: hashedPassword, storeName });
    await newSeller.save();
    res.status(201).json({ message: 'Seller created successfully' });
  } catch (error) {
    console.error('Error creating seller:', error);
    res.status(500).json({ message: 'Server error while creating seller' });
  }
});

// Seller login route
router.post('/seller-login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const seller = await Seller.findOne({ email });
    if (!seller) return res.status(404).json({ message: 'Seller not found' });

    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(seller._id);
    res.json({ token });
  } catch (error) {
    console.error('Seller login error:', error);
    res.status(500).json({ message: 'Server error during seller login' });
  }
});

module.exports = router;