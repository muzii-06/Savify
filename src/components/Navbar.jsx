import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaSearch, FaShoppingCart } from 'react-icons/fa';
import './Navbar.css'; // Custom styles
import savifylogo from './Savify logo.png';
import { Link } from 'react-router-dom';

const Navbar = ({ username, isAuthenticated, cart = [] }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    // Clear the token and username from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('sellerToken'); // In case of seller

    // Redirect to the home page
    window.location.href = '/'; // Redirects to the home page
  };

  // Safely calculate total items in the cart
  const cartItemCount = cart?.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="navbar navbar-expand-lg navbar-light custom-navbar p-3 flex-column">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Logo */}
        <Link className="navbar-brand" to="/">
          <img width={100} height={100} src={savifylogo} alt="Logo" />
        </Link>

        {/* Links and User Actions */}
        <div className="m-0 p-0 ms-auto navbar-nav d-flex align-items-center justify-content-end fw-bolder">
          <Link to="/help" className="nav-link">
            HELP & SUPPORT
          </Link>
          {!isAuthenticated ? (
            <>
              <Link to="/seller-login" className="nav-link">
                SELL ON SAVIFY
              </Link>
              <Link to="/login" className="nav-link">
                LOGIN
              </Link>
              <Link to="/signup" className="nav-link">
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

      {/* Search Bar and Cart */}
      <div className="container-fluid mt-2">
        <div className="d-flex justify-content-center align-items-center w-100">
          <form className="d-flex w-75 justify-content-center align-items-center gap-3">
            {/* Search Input */}
            <input
              className="form-control me-2 search-input w-50  fw-bold rounded-5"
              type="search"
              placeholder="Search in Savify"
              aria-label="Search"
            />
            <button className="btn btn-outline-secondary" type="submit">
              <FaSearch />
            </button>

            {/* Cart Icon */}
            <Link to="/cart" className="nav-link cart-icon position-relative">
              <FaShoppingCart />
              {cartItemCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
