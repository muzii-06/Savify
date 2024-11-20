import React from 'react';
import { FiAlignJustify } from 'react-icons/fi';
import { MdClose } from 'react-icons/md';
import './TopBar.css'; // Assume you have some CSS styles for the TopBar

function TopBar({ sellerImage, storeName, username, isSidebarOpen, toggleSidebar }) {
  return (
    <div className="top-bar">
      {/* Sidebar toggle button */}
     
      
      {/* Store Image and Name */}
      <div className="store-info">
          <h5>{storeName}</h5>
        
      </div>
      <div className="d-flex align-items-center justify-content-between gap-2">
      <div className="ms-auto d-flex flex-column">

      <p className='m-1 p-0'>{username}</p>
        <h6 className='text-center '>SELLER</h6>
      </div>
        <img width={100} src={sellerImage} alt="Store" className="store-image" />

      </div>
    </div>
  );
}

export default TopBar;