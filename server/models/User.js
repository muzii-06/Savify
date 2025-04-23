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

  // ✅ Fields for AI model
  totalOrders: {
    type: Number,
    default: 0,
  },
  // Note: accountAgeDays will be computed dynamically during bargaining
  // from the createdAt field

  verificationCode: { type: String },
  otpCreatedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
