import React, { useEffect, useState } from 'react';
import './AdminTable.css'; // Make sure this exists

const ManageProducts_Admin = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/products');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
      });
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="admin-table-container">
      <h2>Manage Products</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Qty</th>
            <th>Total Reviews</th>
            <th>Avg Rating</th>
            <th>Seller Store</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p._id}>
              <td>
                <img
                  src={`http://localhost:5000/${p.image}`}
                  alt={p.name}
                  width="60"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default-product.png"; // fallback image
                  }}
                />
              </td>
              <td>{p.name}</td>
              <td>{p.quantity}</td>
              <td>{p.totalReviews}</td>
              <td>{p.averageRating || "N/A"}</td>
              <td>{p.storeName}</td>
              <td>
                <button className="delete-btn" onClick={() => handleDelete(p._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageProducts_Admin;
