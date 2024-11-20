import React, { useState } from 'react';
import { signup } from '../services/authService';
import { Link, useNavigate } from 'react-router-dom';
import savifylogo from './Savify logo.png';
import './Auth.css';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup({ username, email, password });
      alert('Signup Successful');
      navigate('/login', { replace: true }); // Redirect to login page
    } catch (error) {
      alert('Signup Failed');
    }
  };

  return (
    <div className="wrap">
       <img className='m-auto d-block' width={'20%'} height={'20%'} src={savifylogo} alt="Logo" />
      <div className="auth-container">
        <h2>Sign Up</h2>
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
          <button type="submit">Sign Up</button>
        </form>
        <Link to="/login" className="auth-link">Already have an account? Login</Link>
      </div>
    </div>
  );
};

export default Signup;
