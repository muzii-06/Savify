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

    // Check OTP validity (if applicable)
    const now = new Date();
    const otpExpiryTime = new Date(user.otpCreatedAt);
    otpExpiryTime.setMinutes(otpExpiryTime.getMinutes() + 5);

    if (user.verificationCode !== verificationCode || now > otpExpiryTime) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    // Clear OTP after successful login
    user.verificationCode = undefined;
    user.otpCreatedAt = undefined;
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      token,
      username: user.username,  // Ensure username is included in response
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

  console.log('Received seller login request:', { email, password, verificationCode });

  try {
    if (!email || !password || !verificationCode) {
      return res.status(400).json({ message: 'Email, password, and OTP are required.' });
    }

    const seller = await Seller.findOne({ email });
    if (!seller) {
      console.log('Seller not found for email:', email);
      return res.status(404).json({ message: 'Seller not found.' });
    }

    // ✅ Verify Password
    const isPasswordMatch = await bcrypt.compare(password, seller.password);
    if (!isPasswordMatch) {
      console.log('Incorrect password for seller:', email);
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // ✅ Check OTP validity (valid for 5 minutes)
    const now = new Date();
    const otpExpiryTime = new Date(seller.otpCreatedAt);
    otpExpiryTime.setMinutes(otpExpiryTime.getMinutes() + 5);

    if (seller.verificationCode !== verificationCode || now > otpExpiryTime) {
      console.log('Invalid or expired OTP for seller:', email);
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    // ✅ Clear OTP after successful login
    seller.verificationCode = undefined;
    seller.otpCreatedAt = undefined;
    await seller.save();

    const token = jwt.sign({ id: seller._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // ✅ Debug Response
    console.log('Seller login successful:', {
      sellerToken: token,
      sellerId: seller._id,
      username: seller.username,
      storeName: seller.storeName,
      storeImage: seller.storeImage || '',
    });

    res.status(200).json({
      sellerToken: token,
      sellerId: seller._id,
      username: seller.username,
      storeName: seller.storeName,
      storeImage: seller.storeImage || '',
      message: 'Login successful!',
    });
  } catch (error) {
    console.error('Error during seller login:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// Get user data by ID
router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Server error while fetching user data.' });
  }
});
router.get('/seller/:id', async (req, res) => {
  try {
    console.log("Fetching seller data for ID:", req.params.id); // ✅ Debugging Log
    const seller = await Seller.findById(req.params.id);

    if (!seller) {
      console.log("Seller not found for ID:", req.params.id);
      return res.status(404).json({ message: 'Seller not found.' });
    }

    console.log("Seller found:", seller); // ✅ Log seller data
    res.status(200).json(seller);
  } catch (error) {
    console.error('Error fetching seller data:', error);
    res.status(500).json({ message: 'Server error while fetching seller data.' });
  }
});


// Update User Profile Route
router.put('/update-profile', async (req, res) => {
  const { userId, username, email, address, dateOfBirth, gender, contactNumber } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Update fields
    user.username = username || user.username;
    user.email = email || user.email;
    user.address = address || user.address;
    user.dateOfBirth = dateOfBirth || user.dateOfBirth;
    user.gender = gender || user.gender;
    user.contactNumber = contactNumber || user.contactNumber;

    await user.save();
    res.status(200).json({ message: 'Profile updated successfully.', user });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error while updating profile.' });
  }
});

router.put('/update-seller-profile', async (req, res) => {
  const { sellerId, storeName, gender, contactNumber, dateOfBirth, warehouseAddress } = req.body;

  try {
    const seller = await Seller.findById(sellerId);
    if (!seller) return res.status(404).json({ message: 'Seller not found.' });

    // Only update allowed fields
    seller.storeName = storeName || seller.storeName;
    seller.gender = gender || seller.gender;
    seller.contactNumber = contactNumber || seller.contactNumber;
    seller.dateOfBirth = dateOfBirth || seller.dateOfBirth;
    seller.warehouseAddress = warehouseAddress || seller.warehouseAddress;

    await seller.save();
    res.status(200).json({ message: 'Seller profile updated successfully.' });
  } catch (error) {
    console.error('Error updating seller profile:', error);
    res.status(500).json({ message: 'Server error while updating seller profile.' });
  }
});
router.put('/change-password', async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: 'Incorrect current password.' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: 'Password updated successfully!' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Server error while updating password.' });
  }
});

router.put('/seller-change-password', async (req, res) => {
  const { sellerId, oldPassword, newPassword } = req.body;

  try {
    const seller = await Seller.findById(sellerId);
    if (!seller) return res.status(404).json({ message: 'Seller not found.' });

    const isMatch = await bcrypt.compare(oldPassword, seller.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect current password.' });

    seller.password = await bcrypt.hash(newPassword, 10);
    await seller.save();

    res.status(200).json({ message: 'Password updated successfully!' });
  } catch (error) {
    console.error('Error changing seller password:', error);
    res.status(500).json({ message: 'Server error while updating password.' });
  }
});

router.post('/request-password-reset', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationCode = otp;
    user.otpCreatedAt = new Date();
    await user.save();

    // Send OTP via Email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: email,
      subject: 'Password Reset OTP',
      html: `<p>Your OTP for password reset is <strong>${otp}</strong></p>`,
    });

    res.status(200).json({ message: 'OTP sent to your email.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while sending OTP.' });
  }
});
router.post('/verify-reset-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.verificationCode !== otp) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    // Check if OTP is still valid (5 minutes expiry)
    const now = new Date();
    const otpExpiryTime = new Date(user.otpCreatedAt);
    otpExpiryTime.setMinutes(otpExpiryTime.getMinutes() + 5);

    if (now > otpExpiryTime) {
      return res.status(400).json({ message: 'OTP expired.' });
    }

    res.status(200).json({ message: 'OTP verified successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while verifying OTP.' });
  }
});
router.put('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    user.password = await bcrypt.hash(newPassword, 10);
    user.verificationCode = undefined;
    user.otpCreatedAt = undefined;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while resetting password.' });
  }
});









module.exports = router;
