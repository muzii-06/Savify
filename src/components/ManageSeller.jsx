import React, { useEffect, useState } from 'react';
import './ManageSeller.css';

const ITEMS_PER_PAGE = 10;

const ManageSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchSellers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/sellers');
      const data = await res.json();
      setSellers(data);
    } catch (err) {
      console.error('Error fetching sellers:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this seller?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/admin/seller/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      alert(data.message);
      const updated = sellers.filter(s => s._id !== id);
      setSellers(updated);

      const lastPage = Math.ceil(updated.length / ITEMS_PER_PAGE);
      if (currentPage > lastPage) setCurrentPage(lastPage);
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const totalPages = Math.ceil(sellers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentSellers = sellers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="manage-sellers-container">
      <h2 className="sellers-heading">🏬 Manage Sellers</h2>
      <div className="table-wrapper">
        <table className="seller-table">
          <thead>
            <tr>
              <th>S#</th>
              <th>Store Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Warehouse Address</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentSellers.map((seller, index) => (
              <tr key={seller._id}>
                <td>{startIndex + index + 1}</td>
                <td>{seller.storeName}</td>
                <td>{seller.email}</td>
                <td>{seller.contactNumber}</td>
                <td>{seller.warehouseAddress}</td>
                <td>
                  <button className="delete-btn" onClick={() => handleDelete(seller._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {sellers.length === 0 && (
              <tr>
                <td colSpan="6" className="no-data">No sellers found.</td>
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

export default ManageSellers;
