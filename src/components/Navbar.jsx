import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaShoppingCart, FaBars } from 'react-icons/fa';

import Categories from './Categories';
import savifylogo from './Savify logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';

const Navbar = ({ username, isAuthenticated, cart = [] }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // Search query state
  const navigate = useNavigate();

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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light custom-navbar p-3">
        <div className="container-fluid d-flex align-items-center justify-content-between">
          <Link className="navbar-brand" to="/">
            <img src={savifylogo} alt="Savify" width={100} />
          </Link>

          <div className="d-flex align-items-center">
            <button
              className="btn btn-dark rounded-circle me-3"
              onClick={() => setShowSidebar(true)}
            >
              <FaBars />
            </button>

            {/* Updated Search Bar */}
            <form className="d-flex align-items-center " onSubmit={handleSearch}>
              <input
                type="search "
                className="form-control border-none me-2 search-input rounded-5 navsearch"
                placeholder="Search in Savify"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="btn ">
                <FaSearch  size={30} />
              </button>
            </form>

            <Link to="/cart" className="nav-link position-relative ms-3">
              <FaShoppingCart size={30} />
              {cartItemCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>

          <div className="d-flex align-items-center">
            <Link to="/help" className="nav-link">
              HELP & SUPPORT
            </Link>
            {!isAuthenticated ? (
              <>
                <Link to="/seller-login" className="nav-link me-3 ">
                  SELL ON SAVIFY
                </Link>
                <Link to="/login" className="btn btn-dark rounded-pill btn-primary me-2">
                  LOGIN
                </Link>
                <Link to="/signup" className="btn btn-dark rounded-pill ">
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

      <div
        className={`sidebar-overlay ${showSidebar ? 'show' : ''}`}
        onClick={() => setShowSidebar(false)}
      >
        <div
          className={`sidebar-container ${showSidebar ? 'open' : ''}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sidebar-header d-flex justify-content-between align-items-center">
            <h5 className="text-center m-auto fw-bold">Categories</h5>
            <button
              className="btn-close"
              onClick={() => setShowSidebar(false)}
            ></button>
          </div>
          <Categories categories={categories} setShowSidebar={setShowSidebar} />
        </div>
      </div>
    </>
  );
};

export default Navbar;
