import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaShoppingCart, FaBars } from 'react-icons/fa';
import Categories from './Categories';
import savifylogo from './Savify logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';

const Navbar = ({ username, isAuthenticated, cart = [] }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Sample categories data
  const categories = [
    {
      name: 'Electronics',
      subcategories: ['Mobile Phones', 'Laptops', 'Headphones', 'Cameras'],
    },
    {
      name: 'Fashion',
      subcategories: ['Men', 'Women', 'Kids', 'Accessories'],
    },
    {
      name: 'Home Appliances',
      subcategories: ['Kitchen', 'Living Room', 'Bedroom', 'Bathroom'],
    },
    {
      name: 'Books',
      subcategories: ['Fiction', 'Non-Fiction', 'Textbooks', 'Comics'],
    },
    {
      name: 'Toys',
      subcategories: ['Action Figures', 'Board Games', 'Puzzles', 'Dolls'],
    },
  ];

  const cartItemCount = cart?.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('sellerToken');
    window.location.href = '/';
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light custom-navbar p-3">
        <div className="container-fluid d-flex align-items-center justify-content-between">
          {/* Logo */}
          <Link className="navbar-brand" to="/">
            <img src={savifylogo} alt="Savify" width={100} />
          </Link>

          {/* Search and Cart Section */}
          <div className="d-flex align-items-center">
            {/* Categories Toggle Button */}
            <button
              className="btn btn-secondary rounded-circle me-3"
              onClick={() => setShowSidebar(true)}
            >
              <FaBars />
            </button>

            {/* Search Bar */}
            <form className="d-flex align-items-center">
              <input
                type="search"
                className="form-control me-2 search-input rounded-5 "
                placeholder="Search in Savify"
              />
              <button className="btn btn-outline-secondary">
                <FaSearch />
              </button>
            </form>

            {/* Cart Icon */}
            <Link to="/cart" className="nav-link position-relative ms-3">
              <FaShoppingCart size={24} />
              {cartItemCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>

          {/* User Links */}
          <div className="d-flex align-items-center">
          <Link to="/help" className="nav-link">
            HELP & SUPPORT
          </Link>
            {!isAuthenticated ? (
              <>
                <Link to="/seller-login" className="nav-link me-3">
                  SELL ON SAVIFY
                </Link>
                <Link to="/login" className="btn btn-primary me-2">
                  LOGIN
                </Link>
                <Link to="/signup" className="btn btn-outline-primary">
                  SIGN UP
                </Link>
              </>
            ) : (
              <div className="dropdown me-5">
              <span
                className="nav-link fw-bold text-primary dropdown-toggle d-flex align-items-center gap-1"
                onClick={() => setShowDropdown(!showDropdown)}
                style={{ cursor: 'pointer' }}
              >
                <p className="m-0 p-0 text-uppercase">{username}'s Account</p>
              </span>
              {showDropdown && (
                <ul className="dropdown-menu dropdown-menu-right show">
                  <li>
                    <Link className="dropdown-item" to="/edit-profile">
                      Edit Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/manage-orders">
                      Manage Orders
                    </Link>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              )}
                </div>
          )}
          </div>
        </div>
      </nav>

      {/* Sidebar for Categories */}
      <div
        className={`sidebar-overlay ${showSidebar ? 'show' : ''}`}
        onClick={() => setShowSidebar(false)}
      >
        <div
          className={`sidebar-container ${showSidebar ? 'open' : ''}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sidebar-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Categories</h5>
            <button
              className="btn-close"
              onClick={() => setShowSidebar(false)}
            ></button>
          </div>
          <Categories categories={categories} />
        </div>
      </div>
    </>
  );
};

export default Navbar;
