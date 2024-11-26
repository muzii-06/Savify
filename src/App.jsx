import React, { useEffect, useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import Login from './components/Login';
import Signup from './components/Signup';
import Cart from './components/Cart'; // New Cart Component
import SellerLogin from './components/SellerLogin';
import SellerSignup from './components/SellerSignup';
import Dashboard from './components/Dashboard';
import ShippingRatesAndPolicy from './components/Footer_Pages/ShippingRatesAndPolicy';
import ReturnsAndReplacementPolicy from './components/Footer_Pages/ReturnsAndReplacementPolicy';
import Help from './components/Footer_Pages/Help';
import ProductPage from './components/ProductPage';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [username, setUsername] = useState(null); // Store the username
  const [cart, setCart] = useState([]); // Cart state
  const [products, setProducts] = useState([]); // Products state

  // Function to fetch products
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data); // Update products state
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Fetch products on app load
  useEffect(() => {
    fetchProducts();
  }, []);

  // Function to update authentication state
  const setAuth = useCallback(() => {
    const token = localStorage.getItem('token'); // Buyer token
    const sellerToken = localStorage.getItem('sellerToken'); // Seller token
    const storedUsername = localStorage.getItem('username') || null;

    console.log('setAuth Debug:', { token, sellerToken, storedUsername });

    if (sellerToken) {
      setIsAuthenticated(true);
      setIsSeller(true);
      setUsername(storedUsername);
    } else if (token) {
      setIsAuthenticated(true);
      setIsSeller(false);
      setUsername(storedUsername);
    } else {
      setIsAuthenticated(false);
      setIsSeller(false);
      setUsername(null); // Reset username when logged out
    }
  }, []);

  // Check token status when app loads
  useEffect(() => {
    setAuth();
  }, [setAuth]);

  // Logout handler: Clears localStorage and updates state
  const handleLogout = () => {
    localStorage.clear(); // Clear all stored data
    setIsAuthenticated(false);
    setIsSeller(false);
    setUsername(null); // Reset username
  };

  
  // Add to Cart Handler
  // Add to Cart Handler
  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      window.location.href = '/login'; // Redirect to login if not authenticated
      return;
    }
  
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id);
  
      if (existingItem) {
        // Update quantity of the existing product in the cart
        return prevCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        );
      } else {
        // Add the new product to the cart
        return [...prevCart, product];
      }
    });
  };
  
  

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              username={username}
              isAuthenticated={isAuthenticated}
              handleAddToCart={handleAddToCart}
              cart={cart}
              handleLogout={handleLogout} // Pass logout handler
            />
          }
        />
        <Route
          path="/home"
          element={
            isAuthenticated && !isSeller ? (
              <HomePage
                username={username}
                isAuthenticated={isAuthenticated}
                handleAddToCart={handleAddToCart} // Pass handleAddToCart here
                cart={cart}
                handleLogout={handleLogout} // Pass logout handler
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated && isSeller ? (
              <Dashboard setAuth={setAuth} /> // Pass setAuth to Dashboard
            ) : (
              <Navigate to="/seller-login" replace />
            )
          }
        />
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <Login onAuthChange={setAuth} />
            ) : (
              <Navigate to={isSeller ? '/dashboard' : '/home'} replace />
            )
          }
        />
        <Route
          path="/signup"
          element={
            !isAuthenticated ? (
              <Signup />
            ) : (
              <Navigate to={isSeller ? '/dashboard' : '/home'} replace />
            )
          }
        />
        <Route
          path="/seller-login"
          element={
            !isAuthenticated ? (
              <SellerLogin onAuthChange={setAuth} />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />
        <Route
          path="/cart"
          element={<Cart cart={cart} setCart={setCart} />}
        />
        <Route path="/seller-signup" element={<SellerSignup />} />
        <Route path="/shipping-rates-policy" element={<ShippingRatesAndPolicy />} />
        <Route path="/returns-replacement-policy" element={<ReturnsAndReplacementPolicy />} />
        <Route path="/help" element={<Help />} />
       

        <Route
  path="/product/:id"
  element={
    <ProductPage
      products={products}
      handleAddToCart={handleAddToCart}
      username={username}
      isAuthenticated={isAuthenticated}
      handleLogout={handleLogout}
    />
  }
/>


        <Route
          path="*"
          element={
            <Navigate to={isAuthenticated ? (isSeller ? '/dashboard' : '/home') : '/login'} replace />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
