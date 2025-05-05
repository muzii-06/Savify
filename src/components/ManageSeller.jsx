import React, { useEffect, useState } from 'react';
import './ManageSeller.css';

const ManageSellers = () => {
  const [sellers, setSellers] = useState([]);

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
      setSellers(sellers.filter(s => s._id !== id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  return (
    <div className="manage-sellers-container">
      <h2>All Sellers</h2>
      <table className="seller-table">
        <thead>
          <tr>
            <th>Store Name</th>
            <th>Email</th>
            <th>Contact</th>
            <th>Warehouse Address</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sellers.map(seller => (
            <tr key={seller._id}>
              <td>{seller.storeName}</td>
              <td>{seller.email}</td>
              <td>{seller.contactNumber}</td>
              <td>{seller.warehouseAddress}</td>
              <td>
                <button onClick={() => handleDelete(seller._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageSellers;
