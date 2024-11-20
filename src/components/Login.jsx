import React, { useState } from 'react';
import { login } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import savifylogo from './Savify logo.png';
import './Auth.css';

const Login = ({ onAuthChange }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ email, password });
  
      if (response?.data?.token) {
        alert('Login Successful');
  
        // Save token and username to localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', response.data.username); // Ensure username is set correctly
  
        // Notify App to update auth state
        onAuthChange();
  
        // Redirect to home page
        navigate('/home', { replace: true });
      } else {
        alert('Unexpected response from server.');
      }
    } catch (error) {
      alert('Login failed. Please check your credentials.');
    }
  };
  return (
    <div className="wrap">
       <img className='m-auto d-block' width={'20%'} height={'20%'} src={savifylogo} alt="Logo" />
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
        <h2>Login to Savify</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Login</button>
       
        <Link to="/signup" className="auth-link"> Don't have an account? Sign Up</Link>
      </form>
    </div>
    </div>
  );
};

export default Login;
