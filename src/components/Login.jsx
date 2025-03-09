import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import savifylogo from './Savify logo.png';


const Login = ({ onAuthChange }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/request-login-otp', { // Match the backend route
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Request failed');
      }
  
      const data = await response.json();
      alert(data.message);
      setOtpSent(true);
    } catch (error) {
      alert(`Request OTP error: ${error.message}`);
      console.error('Request OTP error:', error);
    }
  };
  
  
  
 
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', { // Correct backend URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, verificationCode }),
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }
  
      const data = await response.json();
      alert(data.message);
      localStorage.setItem('token', data.token); // Save the token
      localStorage.setItem('username', data.username);
       // Save the username
       localStorage.setItem('userId', data.userId);
      onAuthChange(); // Notify the app about the login
      navigate('/home'); // Redirect to the home page
    } catch (error) {
      alert(`Login error: ${error.message}`);
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
