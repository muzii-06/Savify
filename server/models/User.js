const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  contactNumber: { 
    type: String, 
    required: true,
    validate: {
      validator: function (v) {
        return /^\+92\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid Pakistani contact number!`
    }
  },
  verificationCode: { type: String }, // Store the OTP
  otpCreatedAt: { type: Date }, // Track OTP creation time
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
