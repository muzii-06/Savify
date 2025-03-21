import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageOrdersSeller = () => {
  const [orders, setOrders] = useState([]);
  const sellerId = localStorage.getItem("sellerId");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/orders/seller/${sellerId}`);
        setOrders(response.data);
      } catch (error) {
        console.error("❌ Error fetching seller orders:", error);
      }
    };

    if (sellerId) fetchOrders();
  }, [sellerId]);

  return (
    <div className="container mt-4">
      <h2>📦 Orders Received</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order, idx) => (
          <div key={idx} className="card my-3 shadow">
            <div className="card-body">
              <h5>Order #{idx + 1}</h5>
              <p><strong>Buyer:</strong> {order.buyer.username} ({order.buyer.email})</p>
              <p><strong>Shipping Address:</strong> {order.buyer.address}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <ul>
                {order.items
                  .filter(item => item.seller._id === sellerId)
                  .map((item, i) => (
                    <li key={i}>
                      <strong>{item.name}</strong> — {item.quantity} × Rs. {item.price}
                    </li>
                  ))}
              </ul>
              <p className="fw-bold">Total Order Value: Rs. {order.totalAmount}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ManageOrdersSeller;
