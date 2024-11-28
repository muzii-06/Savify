const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Seller = require('../models/Seller'); // Import the Seller model
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const router = express.Router();
const multer = require('multer');

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure the `uploads/` folder exists
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Helper function to generate JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Configure Nodemailer
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// ** Request Login OTP Route **
router.post('/request-login-otp', async (req, res) => {
  console.log('Request received at /request-login-otp'); // Log when route is hit
  const { email } = req.body;

  if (!email) {
    console.error('No email provided');
    return res.status(400).json({ message: 'Email is required.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.error(`User not found for email: ${email}`);
      return res.status(404).json({ message: 'User not found.' });
    }

    console.log(`Generating OTP for user: ${user.email}`);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationCode = otp;
    user.otpCreatedAt = new Date();
    await user.save();

    console.log(`OTP generated: ${otp}`);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log(`Sending OTP to email: ${email}`);
    await transporter.sendMail({
      to: email,
      subject: 'Your Login OTP',
      html: `<p>Your OTP is <strong>${otp}</strong></p>`,
    });

    console.log(`OTP email sent successfully to: ${email}`);
    res.status(200).json({ message: 'OTP sent to your email.' });
  } catch (error) {
    console.error('Error in /request-login-otp:', error);
    res.status(500).json({ message: 'Server error while processing OTP request.' });
  }
});


router.post('/seller-request-login-otp', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  try {
    const seller = await Seller.findOne({ email });
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found.' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    seller.verificationCode = otp;
    seller.otpCreatedAt = new Date();
    await seller.save();

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send OTP email
    await transporter.sendMail({
      to: email,
      subject: 'Your Seller Login OTP',
      html: `<p>Your OTP is <strong>${otp}</strong></p>`,
    });

    res.status(200).json({ message: 'OTP sent to your email.' });
  } catch (error) {
    console.error('Error in seller OTP request:', error);
    res.status(500).json({ message: 'Server error while processing OTP request.' });
  }
});




// ** User Signup Route **
router.post('/signup', async (req, res) => {
  console.log('Request body:', req.body); // Log the incoming request body

  const { username, email, password, address, dateOfBirth, gender, contactNumber } = req.body;

  try {
    if (!username || !email || !password || !address || !dateOfBirth || !gender || !contactNumber) {
      console.error('Missing required fields');
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!/^\+92\d{10}$/.test(contactNumber)) {
      console.error('Invalid contact number:', contactNumber);
      return res.status(400).json({ message: 'Contact number must start with +92 and contain exactly 10 digits.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.error('Email already in use:', email);
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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
    console.log('User created successfully:', newUser.email);
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});




// ** User Login Route **
router.post('/login', async (req, res) => {
  const { email, password, verificationCode } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Check if the OTP matches and is not expired (valid for 5 minutes)
    const now = new Date();
    const otpExpiryTime = new Date(user.otpCreatedAt);
    otpExpiryTime.setMinutes(otpExpiryTime.getMinutes() + 5);

    if (user.verificationCode !== verificationCode || now > otpExpiryTime) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    // OTP is valid, proceed with login
    user.verificationCode = undefined; // Clear the OTP after successful login
    user.otpCreatedAt = undefined;
    await user.save();

    const token = generateToken(user._id); // Replace with your token generation logic
    res.status(200).json({
      token,
      username: user.username,
      userId: user._id,
      message: 'Login successful!',
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});


// ** Seller Signup Route **
router.post('/seller-signup', upload.single('storeImage'), async (req, res) => {
  const { username, email, password, storeName, gender, contactNumber, dateOfBirth, warehouseAddress } = req.body;

  try {
    if (!username || !email || !password || !storeName || !gender || !contactNumber || !dateOfBirth || !warehouseAddress) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (!/^\+92\d{10}$/.test(contactNumber)) {
      return res.status(400).json({ message: 'Contact number must start with +92 and contain exactly 10 digits.' });
    }

    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      return res.status(400).json({ message: 'Email already in use.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newSeller = new Seller({
      username,
      email,
      password: hashedPassword,
      storeName,
      gender,
      contactNumber,
      dateOfBirth,
      warehouseAddress,
      storeImage: req.file?.path || '',
    });

    await newSeller.save();
    res.status(201).json({ message: 'Seller created successfully.' });
  } catch (error) {
    console.error('Error creating seller:', error);
    res.status(500).json({ message: 'Server error while creating seller.' });
  }
});

// ** Seller Login Route **
router.post('/seller-login', async (req, res) => {
  const { email, password, verificationCode } = req.body;

  try {
    const seller = await Seller.findOne({ email });
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found.' });
    }

    const isPasswordMatch = await bcrypt.compare(password, seller.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Check if OTP matches and is within validity period (5 minutes)
    const now = new Date();
    const otpExpiryTime = new Date(seller.otpCreatedAt);
    otpExpiryTime.setMinutes(otpExpiryTime.getMinutes() + 5);

    if (seller.verificationCode !== verificationCode || now > otpExpiryTime) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    // Clear OTP fields after successful login
    seller.verificationCode = undefined;
    seller.otpCreatedAt = undefined;
    await seller.save();

    const token = generateToken(seller._id);
    const storeImageUrl = `${req.protocol}://${req.get('host')}/${seller.storeImage.replace(/\\/g, '/')}`;

    res.status(200).json({
      token,
      storeName: seller.storeName,
      storeImage: storeImageUrl,
      username: seller.username,
      message: 'Login successful!',
    });
  } catch (error) {
    console.error('Error during seller login:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});


module.exports = router;
