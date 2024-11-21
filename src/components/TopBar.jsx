import React from 'react';
import './TopBar.css'; // Assume you have some CSS styles for the TopBar

function TopBar({ sellerImage, storeName, username }) {
  console.log('TopBar Props:', { sellerImage, storeName, username }); // Log props

  return (
    <div className="top-bar">
      <div className="store-info">
        <h5>{storeName}</h5>
      </div>
      <div className="d-flex align-items-center justify-content-between gap-2">
        <div className="ms-auto d-flex flex-column">
          <p className="m-1 text-center p-0">Savify</p>
          <h6 className="text-center">{username}</h6>
        </div>
        
        <img 
  
  src={sellerImage || 'https://via.placeholder.com/150'} // Fallback image if sellerImage is missing
  alt="Store"
  className="store-image  "
/>
      </div>
    </div>
  );
}

export default TopBar;
