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
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [username, setUsername] = useState(null); // Store the username
  const [cart, setCart] = useState([]); // Cart state

  // Function to update authentication state
  const setAuth = useCallback(() => {
    const token = localStorage.getItem('token');
    const sellerToken = localStorage.getItem('sellerToken');
    const storedUsername = localStorage.getItem('username') || null;

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
      setUsername(null);
    }
  }, []);

  // Check token status when app loads
  useEffect(() => {
    setAuth();
  }, [setAuth]);

  // Add to Cart Handler
  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      window.location.href = '/login'; // Redirect to login if not authenticated
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
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
      />
    ) : (
      <Navigate to="/" replace />
    )
  }
/>

  <Route
      path="/dashboard"
      element={
        isAuthenticated && isSeller ? <Dashboard /> : <Navigate to="/seller-login" replace />
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
