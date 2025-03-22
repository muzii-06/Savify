import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ManageOrdersBuyer.css';

const ManageOrdersBuyer = () => {
  const [orders, setOrders] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/orders/buyer/${userId}`);
        setOrders(response.data);
      } catch (error) {
        console.error("❌ Error fetching buyer orders:", error);
      }
    };

    if (userId) fetchOrders();
  }, [userId]);

  return (
    <div className="buyer-orders-container">
      <h2 className="page-title">🛒 My Orders</h2>
      {orders.length === 0 ? (
        <p className="no-orders">You haven't placed any orders yet.</p>
      ) : (
        orders.map((order, idx) => (
          <div key={idx} className="order-card">
            <div className="order-header">
              <h4>Order #{idx + 1}</h4>
              <span className={`order-status ${order?.status?.toLowerCase?.() || 'pending'}`}>
  {order?.status || 'Pending'}
</span>


              <span className="order-date">
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="order-items">
            {order.items.map((item, i) => (
  <div key={i} className="order-item">
    <img
      src={item.image}
      alt={item.name}
      className="order-item-img"
      onError={(e) => e.target.style.display = 'none'}
    />
    <div className="item-info">
      <p className="item-name">{item.name}</p>
      <p className="item-quantity">Qty: {item.quantity}</p>
      <p className="item-price">Rs. {item.price}</p>
      <p className="store-name">From: <strong>{item.seller?.storeName || 'Unknown Store'}</strong></p>
    </div>
  </div>
))}

            </div>
            <div className="order-footer">
              <p><strong>Total:</strong> Rs. {order.totalAmount}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ManageOrdersBuyer;
