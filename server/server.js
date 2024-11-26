const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes'); // Import the routes

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files for product images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Import order routes


// Register routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', productRoutes); // Make sure this is registered


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
