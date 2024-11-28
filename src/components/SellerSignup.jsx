import React, { useState } from 'react';
import { sellerSignup } from '../services/authService';
import { Link, useNavigate } from 'react-router-dom';
import savifylogo from './Savify logo.png';
import './Auth.css';

const SellerSignup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    storeName: '',
    gender: '',
    contactNumber: '',
    dateOfBirth: '',
    warehouseAddress: '',
    storeImage: null, // For file upload
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, storeImage: e.target.files[0] }); // Handle image upload
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
  
      console.log('Form Data:', [...data.entries()]); // Debugging
      await sellerSignup(data);
      alert('Seller Signup Successful');
      navigate('/seller-login', { replace: true });
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert('Signup Failed');
    }
  };
  
  return (
    <div className="wrap">
      <img className="m-auto d-block" width="50%" src={savifylogo} alt="Logo" />
      <div className="auth-container">
        <h2>Seller Sign Up</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
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
            type="text"
            name="storeName"
            placeholder="Store Name"
            value={formData.storeName}
            onChange={handleInputChange}
            required
          />
          <select className='rounded-2 w-100 p-2 gen'
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
            placeholder="Contact Number (+92XXXXXXXXXX)"
            value={formData.contactNumber}
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
          <input
            type="text"
            name="warehouseAddress"
            placeholder="Warehouse Address"
            value={formData.warehouseAddress}
            onChange={handleInputChange}
            required
          />
          <input
            type="file"
            name="storeImage"
            accept="image/*"
            onChange={handleFileChange}
          />
          <button type="submit">Sign Up</button>
        </form>
        <Link to="/seller-login" className="auth-link">
          Already have a seller account? Login
        </Link>
      </div>
    </div>
  );
};

export default SellerSignup;
