import React, { useEffect, useState } from 'react';
import './ManageBuyer.css';

const ITEMS_PER_PAGE = 10;

const ManageBuyer = () => {
  const [buyers, setBuyers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchBuyers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/users');
      const data = await res.json();
      setBuyers(data);
    } catch (err) {
      console.error('Error fetching buyers:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this buyer?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/admin/user/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      alert(data.message);
      const updated = buyers.filter(b => b._id !== id);
      setBuyers(updated);

      // Adjust current page if necessary after deletion
      const lastPage = Math.ceil(updated.length / ITEMS_PER_PAGE);
      if (currentPage > lastPage) setCurrentPage(lastPage);
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  useEffect(() => {
    fetchBuyers();
  }, []);

  const totalPages = Math.ceil(buyers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentBuyers = buyers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="manage-buyers-container">
      <h2 className="buyers-heading">👤 Manage Buyers</h2>
      <div className="table-wrapper">
        <table className="buyer-table">
          <thead>
            <tr>
              <th>S#</th>
              <th>Username</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Address</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentBuyers.map((buyer, index) => (
              <tr key={buyer._id}>
                <td>{startIndex + index + 1}</td>
                <td>{buyer.username}</td>
                <td>{buyer.email}</td>
                <td>{buyer.contactNumber}</td>
                <td>{buyer.address}</td>
                <td>
                  <button className="delete-btn" onClick={() => handleDelete(buyer._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {buyers.length === 0 && (
              <tr>
                <td colSpan="6" className="no-data">No buyers found.</td>
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

export default ManageBuyer;
