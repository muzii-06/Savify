import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./Checkout.css";

const Checkout = ({ cart, setCart }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
const directBuy = location.state?.directBuy;


  // 🔄 Use directPurchase item or full cart
  const cartItems = directBuy ? [directBuy] : cart;


  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/auth/user/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error("❌ Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUserDetails();
  }, [userId]);

  useEffect(() => {
    console.log("📌 Cart at Checkout:", cartItems);
  }, [cartItems]);

  const handlePlaceOrder = async () => {
    const buyerId = localStorage.getItem("userId");
    if (!buyerId || !buyerId.match(/^[0-9a-fA-F]{24}$/)) {
      alert("❌ Invalid or missing user ID. Please re-login.");
      return;
    }

    try {
      const userResponse = await axios.get(`http://localhost:5000/api/auth/user/${buyerId}`);
      const buyer = {
        _id: userResponse.data._id,
        username: userResponse.data.username,
        email: userResponse.data.email,
        address: userResponse.data.address,
        contactNumber: userResponse.data.contactNumber,
      };

      const orderItems = cartItems.map((item) => ({
        productId: item._id,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        seller: {
          _id: item?.seller?._id || item?.sellerId || "UNKNOWN_SELLER",
        },
      }));
      

      if (orderItems.includes(null)) return;

      const orderData = {
        buyerId: buyer._id,
        items: orderItems,
        totalAmount: cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
        paymentMethod: "Cash on Delivery",
      };

      console.log("📦 ✅ Sending Order Data:", orderData);

      const response = await axios.post("http://localhost:5000/api/orders/place-order", orderData);
      if (response.status === 201) {
        alert("🎉 Order placed successfully!");
        if (!directBuy) {
          setCart([]);
          localStorage.removeItem("cart");
        }
        navigate("/order-success");
      }
    } catch (error) {
      console.error("❌ Error placing order:", error.response?.data || error.message);
      alert("❌ Failed to place order. Please try again.");
    }
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>

      {loading ? (
        <p>Loading...</p>
      ) : user ? (
        <div className="checkout-details">
          <div className="section">
            <h4>Shipping Details</h4>
            <p><strong>Name:</strong> {user.username}</p>
            <p><strong>Phone:</strong> {user.contactNumber || "Not Available"}</p>
            <p><strong>Address:</strong> {user.address || "Not Provided"}</p>
          </div>

          <div className="section">
            <h4>Order Summary</h4>
            <ul className="order-items">
            {cartItems.map((item) => (
  <li key={item._id} className="order-item">
    <img src={item.image} alt={item.name} className="order-item-img" />
    <span>{item.name} (x{item.quantity})</span>
    <span>Rs. {item.price * item.quantity}</span>
  </li>
))}

            </ul>
            <h4>Total: Rs. {cartItems.reduce((total, item) => total + item.price * item.quantity, 0)}</h4>

          </div>

          <div className="section">
            <h4>Payment Method</h4>
            <p>
              <input type="radio" name="payment" checked readOnly /> Cash on Delivery
            </p>
          </div>

          <button className="place-order-btn" onClick={handlePlaceOrder}>
            Place Order
          </button>
        </div>
      ) : (
        <p className="error-text">❌ Failed to load user details.</p>
      )}
    </div>
  );
};

export default Checkout;
