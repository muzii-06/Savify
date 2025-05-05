import React, { useEffect, useState } from 'react';
import './ManageBuyer.css';

const ManageBuyer = () => {
  const [buyers, setBuyers] = useState([]);

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
      setBuyers(buyers.filter(b => b._id !== id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  useEffect(() => {
    fetchBuyers();
  }, []);

  return (
    <div className="manage-buyers-container">
      <h2>All Buyers</h2>
      <table className="buyer-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Contact</th>
            <th>Address</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {buyers.map(buyer => (
            <tr key={buyer._id}>
              <td>{buyer.username}</td>
              <td>{buyer.email}</td>
              <td>{buyer.contactNumber}</td>
              <td>{buyer.address}</td>
              <td>
                <button onClick={() => handleDelete(buyer._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageBuyer;
