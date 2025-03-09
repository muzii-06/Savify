import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TopBar.css';

function TopBar({ sellerImage, storeName, username, setAuth }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('Before Logout:', localStorage); // Debug log

    // Clear all relevant local storage items
    localStorage.clear();

    // Call setAuth to reset authentication state in the App component
    if (setAuth) {
      setAuth();
    } else {
      console.error('setAuth is not defined'); // Debug log for missing setAuth
    }

    console.log('After Logout:', localStorage); // Debug log to confirm removal

    // Redirect to homepage
    navigate('/');
  };

  const handleEditProfile = () => {
    const sellerId = localStorage.getItem('sellerId');
    if (sellerId) {
      navigate('/edit-seller-profile'); // Redirect seller to seller profile
    } else {
      navigate('/edit-profile'); // Redirect user to normal profile
    }
  };

  return (
    <div className="top-bar position-relative">
      {/* Store Name */}
      <div className="store-info">
        <h5>{storeName}</h5>
      </div>

      <div className="d-flex align-items-center justify-content-between gap-2 position-relative">
        {/* Username */}
        <div className="ms-auto d-flex flex-column">
          <p className="m-1 text-center p-0">Savify</p>
          <h6 className="text-center">{username}</h6>
        </div>

        {/* Store Image with Dropdown */}
        <div className="position-relative" onClick={() => setShowDropdown(!showDropdown)} style={{ cursor: 'pointer' }}>
  <img
    src={sellerImage && sellerImage !== 'undefined' ? sellerImage : '/default-profile.png'} 
    alt="Store"
    className="store-image rounded-circle"
  />
</div>
          {showDropdown && (
            <div className="dropdown-menu dropdown-menu-end show">
              <button className="dropdown-item" onClick={() => navigate('/edit-seller-profile')}>
                Edit Profile
              </button>
              <button className="dropdown-item" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    
  );
}

export default TopBar;
