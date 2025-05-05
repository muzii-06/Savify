import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = ({ onAuthChange }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    onAuthChange(); // ✅ This must be passed from App.jsx
    navigate('/', { replace: true }); // ✅ Go to HomePage after logout
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="admin-dashboard-container">
      <h1 className="admin-heading">Welcome to Admin Panel</h1>
      <div className="admin-buttons">
        <button onClick={() => handleNavigation('/admin/manage-sellers')}>
          Manage Sellers
        </button>
        <button onClick={() => handleNavigation('/admin/manage-buyers')}>
          Manage Buyers
        </button>
        <button onClick={() => handleNavigation('/admin/manage-products')}>
          Manage Products
        </button>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
