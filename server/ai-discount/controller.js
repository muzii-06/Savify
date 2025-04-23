const { spawn } = require("child_process");
const path = require("path");
const mongoose = require("mongoose");

const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");

const runDiscountModel = async (req, res) => {
  const { userId, productId, max_discount } = req.body;

  try {
    console.log("📩 Incoming negotiation request:", req.body);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.log("❌ User not found in DB:", userId);
      return res.status(404).json({ error: "User not found" });
    }

    const accountAgeDays = Math.floor(
      (Date.now() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)
    );

    const totalOrders = await Order.countDocuments({ "buyer._id": userId });

    const product = await Product.findById(productId);
    if (!product) {
      console.log("❌ Product not found in DB:", productId);
      return res.status(404).json({ error: "Product not found" });
    }

    const allRatings = product.reviews.map((r) => r.rating);
    const productRating = allRatings.length
      ? allRatings.reduce((a, b) => a + b, 0) / allRatings.length
      : 4.5;

    console.log("📥 Running AI Bargain Model with:");
    console.log("👤 Buyer ID:", userId);
    console.log("📦 Product ID:", productId);
    console.log("📅 Account Age (days):", accountAgeDays);
    console.log("📈 Total Orders:", totalOrders);
    console.log("⭐ Product Avg Rating:", productRating);
    console.log("🔐 Max Discount (%):", max_discount);

    const pyProcess = spawn(
      "C:\\Users\\hp\\AppData\\Local\\Programs\\Python\\Python310\\python.exe",
      [path.join(__dirname, "predict.py")]
    );
    
    

    const inputPayload = {
      account_age_days: accountAgeDays,
      total_orders: totalOrders,
      product_rating: productRating,
      max_discount,
    };

    let result = "";
    pyProcess.stdin.write(JSON.stringify(inputPayload));
    pyProcess.stdin.end();

    pyProcess.stdout.on("data", (data) => {
      result += data.toString();
    });

    pyProcess.stderr.on("data", (data) => {
      console.error("❌ Python stderr:", data.toString());
    });

    pyProcess.on("close", () => {
      try {
        console.log("🔍 Raw model output:", result);
        const parsed = JSON.parse(result);
        if (parsed.error) {
          return res.status(500).json({ error: parsed.error });
        }
        console.log("✅ Final discount predicted:", parsed.discount);
        res.status(200).json({ discount: parsed.discount });
      } catch (e) {
        console.error("❌ JSON Parse Error:", result);
        res
          .status(500)
          .json({ error: "Failed to parse prediction result." });
      }
    });
  } catch (err) {
    console.error("❌ Error in AI discount controller:", err);
    res
      .status(500)
      .json({ error: "Server error in discount controller." });
  }
};

module.exports = { runDiscountModel };
