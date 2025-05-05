import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import savifylogo from './Savify logo.png';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ADMIN_EMAIL = 'curiohub.info@gmail.com';
const ADMIN_PASSWORD = 'admin123';

const Login = ({ onAuthChange }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const isAdmin = email === ADMIN_EMAIL && password === ADMIN_PASSWORD;

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    const otpUrl = isAdmin
      ? 'http://localhost:5000/api/auth/admin-request-login-otp'
      : 'http://localhost:5000/api/auth/request-login-otp';

    try {
      const response = await fetch(otpUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Request failed');

      toast.success(data.message);
      setOtpSent(true);
    } catch (error) {
      toast.error(`❌ ${error.message}`);
      console.error('Request OTP error:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
  
    // Use top-level isAdmin (already declared at component level)
    const loginUrl = isAdmin
      ? 'http://localhost:5000/api/auth/admin-login'
      : 'http://localhost:5000/api/auth/login';
  
    try {
      // ✅ Clear all previous session data
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('userId');
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('sellerToken');
      localStorage.removeItem('sellerId');
      localStorage.removeItem('storeName');
      localStorage.removeItem('sellerImage');
  
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, verificationCode }),
      });
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');
  
      toast.success(data.message);
  
      if (isAdmin) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('isAdmin', 'true'); // ✅ Store as string
        navigate('/admin-dashboard');
      } else {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        localStorage.setItem('userId', data.userId);
        navigate('/home');
      }
  
      onAuthChange(); // ✅ Trigger auth state update
  
    } catch (error) {
      toast.error(`❌ ${error.message}`);
      console.error('Login error:', error);
    }
  };
  
  
  return (
    <div className="wrap">
      <div className="auth-container">
        <form onSubmit={otpSent ? handleLogin : handleRequestOtp}>
          <h2>Login</h2>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          {otpSent && (
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter OTP"
              required
            />
          )}
          <button type="submit">{otpSent ? 'Login' : 'Request OTP'}</button>
        </form>
        <button onClick={() => navigate('/seller-login')} className="seller-dashboard-button">
          Seller Account?
        </button>
        <Link to="/forgot-password" className="auth-link mt-2">
          Forgot Password?
        </Link>
        <Link to="/signup" className="auth-link">
          Don't have a Buyer account? Sign up
        </Link>
      </div>
      <img className='m-auto d-block' width={'50%'} src={savifylogo} alt="Logo" />
    </div>
  );
};

export default Login;
