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
const cartVoucher = location.state?.cartVoucher || JSON.parse(localStorage.getItem("cartVoucher"));

const cartItems = location.state?.items || (directBuy ? [directBuy] : cart);
const voucher = location.state?.voucher || cartVoucher;

const originalTotal = cartItems.reduce(
  (total, item) => total + item.price * item.quantity,
  0
);
const discountedTotal = directBuy?.price || voucher?.discountedTotal;
const discountPercent = directBuy?.discountPercent || voucher?.discountPercent;



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
  useEffect(() => {
    const fetchVoucher = async () => {
      if (!directBuy?.voucherApplied) return;
  
      try {
        const response = await axios.get(`http://localhost:5000/api/vouchers/${userId}/${directBuy._id}`);
        if (response.data) {
          setFinalPrice(response.data.discountedPrice);
        }
      } catch (err) {
        console.warn("⚠️ No voucher applied or it expired");
      }
    };
  
    fetchVoucher();
  }, []);
  

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
      const cartVouchers = JSON.parse(localStorage.getItem("cartVouchers")) || {};
      const orderData = {
        buyerId: buyer._id,
        items: orderItems,
        totalAmount: discountedTotal || originalTotal,

        
        paymentMethod: "Cash on Delivery",
        cartVouchers,
      };

      console.log("📦 ✅ Sending Order Data:", orderData);

      const response = await axios.post("http://localhost:5000/api/orders/place-order", orderData);
      if (response.status === 201) {
        alert("🎉 Order placed successfully!");
        if (!directBuy) {
          setCart([]);
          localStorage.removeItem("cart");
          localStorage.removeItem("cartVoucher"); // ✅ make sure this line exists
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
          <h4 className="text-success mb-2">Order Summary</h4>
          <ul className="order-items">
  {cartItems.map((item) => (
    <li key={item._id} className="order-item">
      <img src={item.image} alt={item.name} className="order-item-img" />
      <div className="ms-2 w-100">
        <div className="d-flex justify-content-between">
          <span>{item.name} (x{item.quantity})</span>
          {location.state?.directBuy?.voucherApplied ? (
            <>
             
              <span className="text-success fw-bold ms-2">
              Rs. {(item.originalPrice || item.price).toFixed(0)}
              </span>
            </>
          ) : (
            <span>Rs. {(item.price * item.quantity).toFixed(0)}</span>
          )}
        </div>
      </div>
    </li>
  ))}
</ul>

{discountedTotal && discountPercent ? (
  <>
    <p className="text-muted mt-3">
      <strong>Bargain Discount:</strong> {parseFloat(discountPercent).toFixed(2)}%
    </p>
    <h5 className="text-success">
      New Price: Rs. {Math.floor(discountedTotal)}
    </h5>
  </>
) : (
  <h5>
    Total: Rs. {originalTotal.toFixed(2)}
  </h5>
)}








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
