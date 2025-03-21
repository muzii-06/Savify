const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Seller = require('../models/Seller');
const mongoose = require("mongoose");
// ✅ Route 1: Place a new order
router.post('/place-order', async (req, res) => {
  try {
    const { buyerId, items, paymentMethod } = req.body;

    console.log("📌 Received Order Request:", req.body);

    // ✅ Validate Buyer ID
    if (!mongoose.Types.ObjectId.isValid(buyerId)) {
      return res.status(400).json({ message: "Invalid Buyer ID format" });
    }

    // ✅ Fetch Buyer
    const buyer = await User.findById(buyerId);
    if (!buyer) {
      return res.status(404).json({ message: 'Buyer not found' });
    }

    // ✅ Process Items and Group by Seller
    const sellerMap = {}; // { sellerId: [items] }

    for (const item of items) {
      const product = await Product.findById(item.productId).populate('seller', 'storeName');

      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }

      if (product.quantity < item.quantity) {
        throw new Error(`Insufficient stock for product "${product.name}". Only ${product.quantity} left.`);
      }
    
      product.quantity -= item.quantity;
      await product.save();

      const sellerId = product.seller?._id?.toString() || 'UNKNOWN_SELLER';

      const formattedItem = {
        productId: product._id,
        name: product.name,
        image: `http://localhost:5000/${product.images[0].replace(/\\/g, "/")}`,
        price: product.price,
        quantity: item.quantity,
        seller: {
          _id: product.seller?._id || 'UNKNOWN_SELLER',
          storeName: product.seller?.storeName || 'Unknown Store',
        },
      };

      if (!sellerMap[sellerId]) {
        sellerMap[sellerId] = [];
      }

      sellerMap[sellerId].push(formattedItem);
    }

    // ✅ Create separate order for each seller
    const createdOrders = [];

    for (const sellerId in sellerMap) {
      const sellerItems = sellerMap[sellerId];
      const totalAmount = sellerItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      const newOrder = new Order({
        buyer: {
          _id: buyer._id,
          username: buyer.username,
          email: buyer.email,
          address: buyer.address,
          contactNumber: buyer.contactNumber,
        },
        items: sellerItems,
        totalAmount,
        paymentMethod,
        status: 'Pending',
      });

      await newOrder.save();
      createdOrders.push(newOrder);
    }

    res.status(201).json({
      message: '✅ Orders placed successfully',
      orders: createdOrders,
    });

  } catch (error) {
    console.error('❌ Error placing multi-vendor order:', error);
    res.status(500).json({
      message: 'Failed to place multi-vendor order',
      error: error.message,
    });
  }
});

// ✅ Route 2: Get all orders for a Buyer (Manage Orders - User Panel)
router.get('/buyer/:buyerId', async (req, res) => {
  try {
    const orders = await Order.find({ 'buyer._id': req.params.buyerId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching buyer orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// ✅ Route 3: Get all orders for a Seller (Manage Orders - Seller Panel)
router.get('/seller/:sellerId', async (req, res) => {
  try {
    const orders = await Order.find({ 'items.seller._id': req.params.sellerId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching seller orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// ✅ Route 4: Update order status (Sellers can change order status)
router.put('/update-status/:orderId', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Shipped', 'Delivered'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order status updated', order: updatedOrder });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Failed to update order status' });
  }
});

module.exports = router;
