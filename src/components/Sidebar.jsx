import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaUser, FaBox, FaPlusCircle, FaShoppingCart, FaEnvelope } from 'react-icons/fa';
import './Dashboard.css';

function Sidebar() {
  return (
    <Nav className="flex-column p-3 sidebar shadow">
      <h4>Seller Dashboard</h4>
      <Nav.Item>
        <Nav.Link as={Link} to="/account-setting">
          <FaUser className="icon" /> Account Setting
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} to="/products">
          <FaBox className="icon" /> Products
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} to="/add-product"> {/* Corrected casing */}
          <FaPlusCircle className="icon" /> Add Product
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} to="/orders">
          <FaShoppingCart className="icon" /> Manage Orders
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} to="/manage-messages">
          <FaEnvelope className="icon" /> Manage Messages
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} to="/manage-messages">
          <FaEnvelope className="icon" /> Chat with Savify
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
}

export default Sidebar;
