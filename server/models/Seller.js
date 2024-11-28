const mongoose = require('mongoose'); // Ensure mongoose is imported

const sellerSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  storeName: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  contactNumber: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  warehouseAddress: { type: String, required: true },
  storeImage: { type: String }, // Store image path
  verificationCode: { type: String }, // OTP for verification
  otpCreatedAt: { type: Date }, // Timestamp for OTP expiration
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Seller', sellerSchema);
