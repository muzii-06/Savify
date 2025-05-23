import React, { useState } from 'react';
import { signup } from '../services/authService';
import { Link, useNavigate } from 'react-router-dom';
import savifylogo from './Savify logo.png';
import './Auth.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    dateOfBirth: '',
    gender: '',
    contactNumber: '+92', // Pre-fill with +92
  });
 
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Enforce numeric input and +92 prefix for contact number
    if (name === 'contactNumber') {
      const sanitizedValue = value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
      if (sanitizedValue.length <= 12) {
        // Ensure total length does not exceed 12 (2 for '+92' and 10 digits)
        setFormData({ ...formData, contactNumber: '+92' + sanitizedValue.slice(2) });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validation for passwords matching
    if (formData.password !== formData.confirmPassword) {
      toast.error('❌ Passwords do not match');
      return;
    }
  
    // Validation for contact number length (must be exactly 11 digits excluding +92)
    const contactWithoutPrefix = formData.contactNumber.replace('+92', '');
    if (contactWithoutPrefix.length !== 10) {
      toast.error('❌ Contact number must be exactly 11 digits (excluding +92)');
      return;
    }
  
    try {
      await signup(formData); // Submit form data
      toast.success('🎉 Signup Successful');
      navigate('/login', { replace: true });
    } catch (error) {
      toast.error(`❌ Signup Failed: ${error.response?.data?.message || error.message}`);
    }
  };
  
  return (
    <div className="wrap">
      <img className="m-auto d-block" width="50%"  src={savifylogo} alt="Logo" />
      <div className="auth-container">
        <h2> Customer Sign Up</h2>
        <form onSubmit={handleSubmit}>
          
          <input 
            type="text" 
            name="username" 
            placeholder="Username" 
            value={formData.username} 
            onChange={handleInputChange} 
            required 
          />
          <input 
            type="email" 
            name="email" 
            placeholder="Email" 
            value={formData.email} 
            onChange={handleInputChange} 
            required 
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            value={formData.password} 
            onChange={handleInputChange} 
            required 
          />
          <input 
            type="password" 
            name="confirmPassword" 
            placeholder="Confirm Password" 
            value={formData.confirmPassword} 
            onChange={handleInputChange} 
            required 
          />
          <input 
            type="text" 
            name="address" 
            placeholder="Address" 
            value={formData.address} 
            onChange={handleInputChange} 
            required 
          />
          <input 
            type="date" 
            name="dateOfBirth" 
            placeholder="Date of Birth" 
            value={formData.dateOfBirth} 
            onChange={handleInputChange} 
            required 
          />
          <select className='gen rounded-2 w-100 p-2'
            name="gender" 
            value={formData.gender} 
            onChange={handleInputChange} 
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input 
            type="text" 
            name="contactNumber" 
            placeholder="Contact Number" 
            value={formData.contactNumber} 
            onChange={handleInputChange} 
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
