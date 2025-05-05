import React, { useState } from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AddProductModal from './AddProductModal'; // Import AddProductModal
import { FaUser, FaBox, FaPlusCircle, FaShoppingCart, FaEnvelope } from 'react-icons/fa';

function Sidebar() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Nav className="flex-column p-3 sidebar shadow ">
        <h4>Seller Dashboard</h4>
        <Nav.Item >
          <Nav.Link  as={Link} to="/account-setting">
            <p className='text-white m-0 p-0'>
              <FaUser className="icon " />  Account Setting
              </p>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
  <Nav.Link as={Link} to="/products">
  <p className='text-white m-0 p-0'>
    <FaBox className="icon" /> Products
    </p>
  </Nav.Link>
</Nav.Item>
        <Nav.Item>
          <Nav.Link onClick={() => setShowModal(true)}>
          <p className='text-white m-0 p-0'>
            <FaPlusCircle className="icon" /> Add Product
            </p>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
  <Nav.Link as={Link} to="/seller/manage-orders">
  <p className='text-white m-0 p-0'>

    <FaShoppingCart className="icon" /> Manage Orders
  </p>
  </Nav.Link>
</Nav.Item>

        <Nav.Item>
  <Nav.Link as={Link} to="/manage-reviews">
  <p className='text-white m-0 p-0'>

    <FaEnvelope className="icon" /> Manage Reviews
  </p>
  </Nav.Link>
</Nav.Item>

        <Nav.Item>
          <Nav.Link as={Link} to="/manage-messages">
          <p className='text-white m-0 p-0'>

            <FaEnvelope className="icon" /> Manage Messages
          </p>
          </Nav.Link>
        </Nav.Item>
      </Nav>
      <AddProductModal show={showModal} handleClose={() => setShowModal(false)} />
    </>
  );
}

export default Sidebar;
