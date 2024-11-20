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
        return /^\+92\d{10}$/.test(v); // Validate +92 followed by exactly 10 digits
      },
      message: props => `${props.value} is not a valid Pakistani contact number!`
    }
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
