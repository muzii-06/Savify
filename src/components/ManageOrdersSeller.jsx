  import React, { useEffect, useState } from 'react';
  import axios from 'axios';
  import { FaTrash } from 'react-icons/fa';

  import './ManageOrdersSeller.css';
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
    const handleDeleteOrder = async (orderId) => {
      if (!window.confirm("Are you sure you want to delete this order?")) return;
    
      try {
        const response = await axios.delete(`http://localhost:5000/api/orders/${orderId}`);
        if (response.status === 200) {
          alert("🗑️ Order deleted successfully!");
          fetchOrders(); // Refresh list
        }
      } catch (error) {
        console.error("❌ Error deleting order:", error);
        alert("❌ Failed to delete order.");
      }
    };
    

    return (
      <div className="container-fluid mt-4">
        <h2 className='text-center'>📦 Orders Received</h2>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map((order, idx) => {
            const sellerItems = order.items.filter(item => item.seller._id === sellerId);
            return (
              <div key={idx} className="card my-3 shadow">
                <div className="card-body">
                <div className="d-flex justify-content-between">
  <h5>Order #{idx + 1}</h5>
  <FaTrash
    style={{ cursor: 'pointer', color: 'red' }}
    onClick={() => handleDeleteOrder(order._id)}
    title="Delete Order"
  />
</div>

                  
                  <p><strong>Username:</strong> {order.buyer.username} </p>
                  <p><strong>Email:</strong>  {order.buyer.email}  </p>
<p><strong>Contact:</strong> {order.buyer.contactNumber}</p>

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
                  <div className="d-flex align-items-center">
  <p className="fw-bold m-0 me-3">
    Total Order Value: Rs. {Math.floor(order.totalAmount)}
  </p>

  {(() => {
    const sellerItems = order.items.filter(item => item.seller._id === sellerId);
    const actualTotal = sellerItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const isBargained = Math.floor(order.totalAmount) < Math.floor(actualTotal);

    return isBargained ? (
      <span className="badge bg-success">💬 Bargained</span>
    ) : null;
  })()}
</div>


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
