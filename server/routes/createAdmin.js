const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

mongoose.connect('mongodb://127.0.0.1:27017/mern_auth');

const createAdmin = async () => {
  const email = 'curiohub.info@gmail.com';
  const plainPassword = 'admin123';

  const hashed = await bcrypt.hash(plainPassword, 10);

  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log('Admin already exists.');
    return mongoose.disconnect();
  }

  const admin = new Admin({ email, password: hashed });
  await admin.save();
  console.log('✅ Admin created');
  mongoose.disconnect();
};

createAdmin();
