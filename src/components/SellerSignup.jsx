// src/components/SellerSignup.jsx
import React, { useState } from 'react';
import { sellerSignup } from '../services/authService';
import { Link, useNavigate } from 'react-router-dom';
import savifylogo from './Savify logo.png';
import './Auth.css';

const SellerSignup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [storeName, setStoreName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sellerSignup({ username, email, password, storeName });
      alert('Seller Signup Successful');
      navigate('/seller-login', { replace: true }); // Redirect to seller login page
    } catch (error) {
      alert('Signup Failed');
    }
  };

  return (
    <div className="wrap">
      <img className='m-auto d-block' width={'20%'} height={'20%'} src={savifylogo} alt="Logo" />
      <div className="auth-container">
        <h2>Seller Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <input 
            type="text" 
            placeholder="Store Name" 
            value={storeName} 
            onChange={(e) => setStoreName(e.target.value)} 
          />
          <button type="submit">Sign Up</button>
        </form>
        <Link to="/seller-login" className="auth-link">Already have a seller account? Login</Link>
      </div>
    </div>
  );
};

export default SellerSignup;
