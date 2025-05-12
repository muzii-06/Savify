import React, { useEffect, useState } from 'react';
import '../styling/ManageProducts_Admin.css';

const ITEMS_PER_PAGE = 10;

const ManageProducts_Admin = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

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
      const updated = products.filter(p => p._id !== id);
      setProducts(updated);

      const lastPage = Math.ceil(updated.length / ITEMS_PER_PAGE);
      if (currentPage > lastPage) setCurrentPage(lastPage);
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = products.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="admin-table-container">
      <h2 className="table-heading">📦 Manage Products</h2>
      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>S#</th>
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
            {currentProducts.map((p, index) => (
              <tr key={p._id}>
                <td>{startIndex + index + 1}</td>
                <td>
                  <img
                    src={`http://localhost:5000/${p.image}`}
                    alt={p.name}
                    className="product-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/default-product.png";
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
            {products.length === 0 && (
              <tr>
                <td colSpan="8" className="no-data">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            ⬅ Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next ➡
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageProducts_Admin;
