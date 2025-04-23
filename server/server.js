const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes'); // Import the routes
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require("./routes/orderRoutes");
const discountRouter = require('./ai-discount/router');
const voucherRoutes = require("./routes/voucher");




 


dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// app.use(express.urlencoded({ extended: true }));

// Serve static files for product images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Import order routes


// Register routes
app.use('/api/auth', authRoutes);

app.use('/api/products', productRoutes); // Make sure this is registered
app.use("/api/orders", orderRoutes);

app.use('/api', discountRouter); // this maps POST /api/negotiate correctly
// ❌ Failing if router is not exported properly
app.use("/api/vouchers", voucherRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
