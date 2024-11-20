import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import DashboardContent from './DashboardContent';
import TopBar from './Topbar';
import './Dashboard.css';

function Dashboard() {
  const location = useLocation(); // Get the location object
  const [message, setMessage] = useState(''); // State for success message

  useEffect(() => {
    // Check if there's a message in the location state
    if (location.state && location.state.message) {
      setMessage(location.state.message);
      // Clear message after 3 seconds
      const timer = setTimeout(() => {
        setMessage('');
      }, 3000);

      // Cleanup timer on unmount
      return () => clearTimeout(timer);
    }
  }, [location]);

  return (
    <div className="dashboard-container">
      {/* TopBar remains at the top */}
      <TopBar
        sellerImage="https://marketplace.canva.com/EAFaFUz4aKo/2/0/1600w/canva-yellow-abstract-cooking-fire-free-logo-JmYWTjUsE-Q.jpg"
        storeName="Seller Store Name"
        username="Savify"
      />

      {/* Sidebar - Always visible */}
      <div className="sidebar">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="main-content">
        {/* Display success message if available */}
        {message && <div className="alert alert-success">{message}</div>}
        <DashboardContent />
      </div>
    </div>
  );
}

export default Dashboard;
