import React, { useState } from 'react';
import { sellerLogin } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import savifylogo from './Savify logo.png';
import './Auth.css';

const SellerLogin = ({ onAuthChange }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await sellerLogin({ email, password });
      if (response?.data?.token) {
        console.log('Seller Login Response:', response.data); // Log response
        
        localStorage.setItem('sellerToken', response.data.token);
        localStorage.setItem('storeName', response.data.storeName);
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('sellerImage', response.data.storeImage);
  
        onAuthChange();
        navigate('/dashboard', { replace: true });
      } else {
        alert('Login Failed: Invalid response');
      }
    } catch (error) {
      console.error('Seller login error:', error);
      alert('Login Failed: Invalid credentials or server error');
    }
  };
  

  return (
    <div className="wrap">
      <img className="m-auto d-block" width={'20%'} height={'20%'} src={savifylogo} alt="Logo" />
      <div className="auth-container">
        <h2>Seller Login</h2>
        <form onSubmit={handleSubmit}>
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
          <button type="submit">Login</button>
        </form>
        <button 
          onClick={() => navigate('/login')} 
          className="seller-dashboard-button"
        >
          Buyer Account
        </button>
        <Link to="/seller-signup" className="auth-link">Don't have a seller account? Sign up</Link>
      </div>
    </div>
  );
};

export default SellerLogin;
