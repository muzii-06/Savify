import React, { useState } from 'react';
import { sellerLogin, sellerRequestOtp } from '../services/authService'; // Import auth service functions
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import savifylogo from './Savify logo.png';
import './Auth.css';

const SellerLogin = ({ onAuthChange }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Handle OTP Request
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await sellerRequestOtp({ email });
      alert(response.data.message);
      setOtpSent(true); // Show OTP input field
    } catch (error) {
      alert(`Error requesting OTP: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Login Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !verificationCode) {
      alert('Please fill in all fields.');
      return;
    }
  
    try {
      const response = await sellerLogin({ email, password, verificationCode });
  
      console.log('Seller login final response:', response.data); // ✅ Debug final response
  
      if (response?.data?.sellerToken) {
        localStorage.setItem('sellerToken', response.data.sellerToken);
localStorage.setItem('sellerId', response.data.sellerId);
localStorage.setItem('storeName', response.data.storeName);
localStorage.setItem('username', response.data.username); 
localStorage.setItem('sellerImage', response.data.storeImage);

// 🚨 Remove buyer-related details if they exist
localStorage.removeItem('token');
localStorage.removeItem('userId');

        onAuthChange();
        navigate('/dashboard', { replace: true });
      } else {
        alert('Login Failed: Invalid response');
      }
    } catch (error) {
      console.error('Login Failed:', error.response?.data || error.message);
      alert(`Login Failed: ${error.response?.data?.message || 'Server error'}`);
    }
  };
  

  return (
    <div className="wrap">
      <div className="auth-container">
        <h2>Seller Login</h2>
        <form onSubmit={otpSent ? handleSubmit : handleRequestOtp}>
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
          {otpSent && (
            <input
              type="text"
              placeholder="Enter OTP"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
            />
          )}
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : otpSent ? 'Login' : 'Request OTP'}
          </button>
          
        </form>
        <button onClick={() => navigate('/login')} className="seller-dashboard-button">
          Buyer Account
        </button>
        <Link to="/seller-forgot-password" className="auth-link mt-2">
        Forgot Password?
      </Link>
        <Link to="/seller-signup" className="auth-link">
          Don't have a seller account? Sign up
        </Link>
      </div>
      <img className="m-auto d-block" width={'50%'} src={savifylogo} alt="Logo" />
    </div>
  );
};

export default SellerLogin;
