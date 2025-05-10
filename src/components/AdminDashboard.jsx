import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import ManageSeller from './ManageSeller';
import ManageBuyer from './ManageBuyer';
import ManageProducts_Admin from './ManageProducts_Admin';
import axios from 'axios';

const AdminDashboard = ({ onAuthChange }) => {
  const [activeSection, setActiveSection] = useState('home');
  const [stats, setStats] = useState({ buyers: 0, sellers: 0, products: 0 });

  const handleLogout = () => {
    localStorage.clear();
    onAuthChange();
  };

  // ✅ Fetch stats only when "home" is active
  useEffect(() => {
    if (activeSection === 'home') {
      axios.get('http://localhost:5000/api/admin/stats')
        .then(res => setStats(res.data))
        .catch(err => console.error('Failed to fetch admin stats:', err));
    }
  }, [activeSection]);

  const renderContent = () => {
    switch (activeSection) {
      case 'sellers':
        return <ManageSeller />;
      case 'buyers':
        return <ManageBuyer />;
      case 'products':
        return <ManageProducts_Admin />;
      default:
        return (
          <div className="dashboard-stats">
            <h2>📊 Platform Overview</h2>
            <div className="stats-grid">
              <div className="stat-card">👤 Total Buyers: {stats.buyers}</div>
              <div className="stat-card">🏬 Total Sellers: {stats.sellers}</div>
              <div className="stat-card">📦 Total Products: {stats.products}</div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="admin-container">
      <div className="sidebar">
        <h2 className='text-white'>Admin Panel</h2>
        <ul>
          <li onClick={() => setActiveSection('home')}>🏠 Home</li>
          <li onClick={() => setActiveSection('sellers')}>👥 Manage Sellers</li>
          <li onClick={() => setActiveSection('buyers')}>🧑‍💼 Manage Buyers</li>
          <li onClick={() => setActiveSection('products')}>📦 Manage Products</li>
          <li className="logout" onClick={handleLogout}>🚪 Logout</li>
        </ul>
      </div>
      <div className="content-area">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
