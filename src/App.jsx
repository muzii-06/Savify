import React, { useEffect, useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import HomePage from './components/HomePage';
import Login from './components/Login';
import Signup from './components/Signup';
import Cart from './components/Cart'; // New Cart Component
import SellerLogin from './components/SellerLogin';
import SellerSignup from './components/SellerSignup';
import Dashboard from './components/Dashboard';
import Checkout from "./components/Checkout";
import OrderSuccess from "./components/OrderSuccess";
import ManageOrdersBuyer from './components/ManageOrdersBuyer';
import ShippingRatesAndPolicy from './components/Footer_Pages/ShippingRatesAndPolicy';
import ReturnsAndReplacementPolicy from './components/Footer_Pages/ReturnsAndReplacementPolicy';
import Help from './components/Footer_Pages/Help';
import ForgotPassword from './components/ForgotPassword';
import ManageProducts from "./components/ManageProducts"; // ✅ Import ManageProducts
// import EditProduct from "./components/EditProduct"; 
import EditSellerProfile from './components/EditSellerProfile'; // ✅ Import Seller Edit Profile
import ManageReviews from "./components/ManageReviews";
import ProductPage from './components/ProductPage';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import SearchResults from './components/SearchResults';
import ManageOrdersSeller from './components/ManageOrdersSeller';
import NegotiatePage  from './components/NegotiatePage';

import './App.css';
import CategoryPage from './components/CategoryPage';
import EditProfile from './components/EditProfile';
import SellerForgetPassword from './components/SellerForgetPassword';
import EditProductModal from './components/EditProductModal';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [username, setUsername] = useState(null); // Store the username
   // Cart state
  const [products, setProducts] = useState([]); // Products state
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
});
useEffect(() => {
  console.log("📌 Saving Cart to Local Storage:", cart); // ✅ Log cart before saving
  localStorage.setItem("cart", JSON.stringify(cart));
}, [cart]);

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
    const storedSellerId = localStorage.getItem('sellerId') || null;
  
    console.log('setAuth Debug:', { token, sellerToken, storedUsername, storedSellerId });
  
    if (sellerToken && storedSellerId) {
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
      window.location.href = "/login";
      return;
    }
  
    const sellerId = product?.seller?._id || product?.sellerId || "UNKNOWN_SELLER";
    console.log("🛒 Adding to cart | Product:", product.name);
    console.log("🧾 Seller ID:", sellerId);
  
    setCart((prevCart) => {
      const existingVouchers = JSON.parse(localStorage.getItem("cartVouchers") || "{}");
      console.log("📦 Existing Cart Vouchers:", existingVouchers);
  
      const isNewProduct = !prevCart.some(item => item._id === product._id);
      const sameSellerProducts = prevCart.filter(item =>
        (item?.seller?._id || item?.sellerId) === sellerId
      );
      console.log("🧾 Same Seller Products in Cart:", sameSellerProducts);
  
      let updatedCart;
  
      if (!isNewProduct) {
        toast.info(`${product.name} quantity updated in cart`);
        updatedCart = prevCart.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        );
      } else {
        toast.success(`${product.name} added to cart`);
        updatedCart = [
          ...prevCart,
          {
            ...product,
            quantity: product.quantity || 1,
            seller: {
              _id: sellerId,
              storeName: product.seller?.storeName || "Unknown Store",
            },
            sellerId,
            bargainRounds: product.bargainRounds || 1,
            maxDiscountPercent: product.maxDiscountPercent || 10,
            rating: product.rating || 4.5,
          },
        ];
      }
  
      // ✅ Always remove voucher if same seller had one and product is new
      if (isNewProduct && existingVouchers[sellerId]) {
        console.log("❌ Removing voucher for seller:", sellerId);
        delete existingVouchers[sellerId];
        localStorage.setItem("cartVouchers", JSON.stringify(existingVouchers));
        toast.warning(`⚠️ Voucher removed for seller: ${product.seller?.storeName || sellerId}`);
      } else {
        console.log("✅ No need to remove voucher");
      }
  
      return updatedCart;
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
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/seller-forgot-password" element={<SellerForgetPassword />} />
        <Route path="/manage-reviews" element={<ManageReviews />} />
        <Route path="/products" element={<ManageProducts />} /> {/* ✅ Route for managing products */}
        <Route path="/edit-product/:id" element={<EditProductModal />} /> {/* ✅ Route for editing a product */}
        <Route path="/checkout" element={<Checkout cart={cart} setCart={setCart} />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/manage-orders-buyer" element={<ManageOrdersBuyer />} />
        <Route path="/negotiate" element={<NegotiatePage />} />
        <Route path="/seller/manage-orders" element={<ManageOrdersSeller />} />
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
  path="/edit-seller-profile"
  element={
    isAuthenticated && isSeller ? (
      <EditSellerProfile />
    ) : (
      <Navigate to="/seller-login" replace />
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
    path="/category/:category"
    element={
      <CategoryPage
        handleAddToCart={handleAddToCart}
        username={username}
        isAuthenticated={isAuthenticated}
        handleLogout={handleLogout}
        cart={cart}
      />
    }
  />
 <Route
          path="/search"
          element={
            <SearchResults
              handleAddToCart={handleAddToCart}
              username={username}
              isAuthenticated={isAuthenticated}
              handleLogout={handleLogout}
              cart={cart}
            />
          }
        />
        <Route
  path="/product/:id"
  element={
    <ProductPage
      products={products}
      handleAddToCart={handleAddToCart}
      username={username}
      isAuthenticated={isAuthenticated}
      cart={cart}
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
      <ToastContainer 
  position="top-center" 
  autoClose={2000} 
  pauseOnHover 
/>
    </Router>
    
  );
};

export default App;