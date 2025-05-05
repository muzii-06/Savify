import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import DashboardContent from './DashboardContent';
import TopBar from './TopBar';
import bgImage from './sellerdashboard.png';
import './Dashboard.css';

function Dashboard({setAuth}) {
  const location = useLocation(); // Get the location object
  const [message, setMessage] = useState(''); // State for success message
  const [sellerData, setSellerData] = useState({
    sellerImage: '',
    storeName: '',
    username: '',
  }); // State for seller details

  
  useEffect(() => {
    const storeName = localStorage.getItem('storeName');
    const sellerImage = localStorage.getItem('sellerImage');
    const username = localStorage.getItem('username');
  
    console.log({ storeName, sellerImage, username }); // Log fetched values
    setSellerData({ sellerImage, storeName, username });
  }, [location]);
  

  return (
    <div className="dashboard-container"
    style={{
      backgroundImage: `url(${bgImage})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center 70%' ,
      backgroundAttachment: 'fixed',
    }}>
      {/* TopBar dynamically shows seller info */}
      <TopBar
        storeName={sellerData.storeName}
        sellerImage={sellerData.sellerImage}
        username={sellerData.username}
        setAuth={setAuth}
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
