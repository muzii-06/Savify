import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageOrdersSeller = () => {
  const [orders, setOrders] = useState([]);
  const sellerId = localStorage.getItem("sellerId");

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/orders/seller/${sellerId}`);
      setOrders(response.data);
    } catch (error) {
      console.error("❌ Error fetching seller orders:", error);
    }
  };

  useEffect(() => {
    if (sellerId) fetchOrders();
  }, [sellerId]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/orders/update-status/${orderId}`, {
        status: newStatus,
      });
      if (response.status === 200) {
        alert("✅ Order status updated!");
        fetchOrders(); // Refresh orders
      }
    } catch (error) {
      console.error("❌ Error updating status:", error);
      alert("❌ Failed to update order status.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>📦 Orders Received</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order, idx) => {
          const sellerItems = order.items.filter(item => item.seller._id === sellerId);
          return (
            <div key={idx} className="card my-3 shadow">
              <div className="card-body">
                <h5>Order #{idx + 1}</h5>
                <p><strong>Buyer:</strong> {order.buyer.username} ({order.buyer.email})</p>
                <p><strong>Shipping Address:</strong> {order.buyer.address}</p>

                <ul className="list-group mb-3">
                  {sellerItems.map((item, i) => (
                    <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', marginRight: '15px' }} />
                        <div>
                          <p className="mb-1 fw-bold">{item.name}</p>
                          <p className="mb-0">Qty: {item.quantity} × Rs. {item.price}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="d-flex justify-content-between align-items-center">
                  <p className="fw-bold">Total Order Value: Rs. {order.totalAmount}</p>

                  <div className="d-flex align-items-center">
                    <label className="me-2">Status:</label>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="form-select w-auto"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ManageOrdersSeller;
