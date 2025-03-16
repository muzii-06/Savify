import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import "./Checkout.css";

const Checkout = ({ cart, setCart, userId }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // ✅ Ensure userId is available before making API call
  useEffect(() => {
    const fetchUserDetails = async () => {
        if (!userId) {
          console.error("User ID is missing!");
          return;
        }
      
        try {
          const response = await axios.get(`http://localhost:5000/api/user/${userId}`); // ✅ Ensure Correct API Path
          setUser(response.data);
        } catch (error) {
          console.error("Error fetching user data:", error.response ? error.response.data : error.message);
        }
      };
      

    fetchUserDetails();
  }, [userId]);

  // Calculate total price
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  // Handle order placement
  const handleOrder = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/orders/checkout", {
        userId,
        cartItems: cart,
      });

      if (response.data.success) {
        alert("Order placed successfully!");
        setCart([]); // Clear cart after order
        localStorage.removeItem("cart");
        navigate("/orders"); // Redirect to orders page
      }
    } catch (error) {
      console.error("Error placing order:", error.response ? error.response.data : error.message);
      alert("Failed to place order.");
    }
  };

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>

      {user ? (
        <div className="checkout-details">
          <h4>Shipping Address</h4>
          <p>{user.address}</p>

          <h4>Order Summary</h4>
          <div className="checkout-items">
            {cart.map((item) => (
              <div key={item._id} className="checkout-item">
                <p>
                  {item.name} × {item.quantity} - Rs {item.price * item.quantity}
                </p>
              </div>
            ))}
          </div>

          <h3>Total: Rs {totalPrice}</h3>

          <h4>Payment Method</h4>
          <p><strong>Cash on Delivery</strong> (Pay at your doorstep)</p>

          <button className="btn btn-success" onClick={handleOrder}>
            Confirm Order
          </button>
        </div>
      ) : (
        <p>Loading user details...</p>
      )}
    </div>
  );
};

export default Checkout;
