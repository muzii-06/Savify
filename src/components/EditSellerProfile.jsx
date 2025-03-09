import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditSellerProfile = () => {
  const [seller, setSeller] = useState({
    username: '',
    email: '',
    storeName: '',
    gender: '',
    contactNumber: '',
    dateOfBirth: '',
    warehouseAddress: '',
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');

  // Password State
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const sellerId = localStorage.getItem('sellerId'); // Get seller ID from localStorage

  // ✅ Fetch Seller Profile
  useEffect(() => {
    const fetchSeller = async () => {
      if (!sellerId) {
        setError("No seller ID found. Cannot fetch seller data.");
        setLoading(false);
        return;
      }
  
      console.log("Fetching seller data for ID:", sellerId); // ✅ Debug log
  
      try {
        const response = await axios.get(`http://localhost:5000/api/auth/seller/${sellerId}`);
        console.log("Seller data received:", response.data); // ✅ Debug API response
  
        if (response.data) {
          setSeller({
            username: response.data.username || '',
            email: response.data.email || '',
            storeName: response.data.storeName || '',
            gender: response.data.gender || '',
            contactNumber: response.data.contactNumber || '',
            dateOfBirth: response.data.dateOfBirth ? response.data.dateOfBirth.split('T')[0] : '',
            warehouseAddress: response.data.warehouseAddress || '',
          });
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching seller data:', error.response ? error.response.data : error.message);
        setError('Failed to load seller data. Please try again.');
        setLoading(false);
      }
    };
  
    fetchSeller();
  }, [sellerId]);
  
  // ✅ Handle Profile Change
  const handleChange = (e) => {
    setSeller({ ...seller, [e.target.name]: e.target.value });
  };

  // ✅ Handle Password Change Inputs
  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  // ✅ Handle Profile Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const updatedData = {
        sellerId,
        storeName: seller.storeName,
        gender: seller.gender,
        contactNumber: seller.contactNumber,
        dateOfBirth: seller.dateOfBirth,
        warehouseAddress: seller.warehouseAddress,
      };

      await axios.put('http://localhost:5000/api/auth/update-seller-profile', updatedData);
      setMessage('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    }
  };

  // ✅ Handle Password Update
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage('New passwords do not match.');
      return;
    }

    try {
      const response = await axios.put('http://localhost:5000/api/auth/seller-change-password', {
        sellerId,
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });

      setPasswordMessage(response.data.message);
      setShowChangePassword(false);
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordMessage(error.response?.data?.message || 'Failed to change password.');
    }
  };

  if (loading) return <p>Loading profile data...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-5">
      <h2>Edit Seller Profile</h2>
      {message && <p className="alert alert-success">{message}</p>}
      {error && <p className="alert alert-danger">{error}</p>}

      {/* ✅ Profile Form */}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Username:</label>
          <input type="text" name="username" value={seller.username} className="form-control" disabled />
        </div>

        <div className="mb-3">
          <label>Email:</label>
          <input type="email" name="email" value={seller.email} className="form-control" disabled />
        </div>

        <div className="mb-3">
          <label>Store Name:</label>
          <input type="text" name="storeName" value={seller.storeName} onChange={handleChange} className="form-control" required />
        </div>

        <div className="mb-3">
          <label>Warehouse Address:</label>
          <input type="text" name="warehouseAddress" value={seller.warehouseAddress} onChange={handleChange} className="form-control" required />
        </div>

        <div className="mb-3">
          <label>Date of Birth:</label>
          <input type="date" name="dateOfBirth" value={seller.dateOfBirth} onChange={handleChange} className="form-control" required />
        </div>

        <div className="mb-3">
          <label>Gender:</label>
          <select name="gender" value={seller.gender} onChange={handleChange} className="form-control" required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="mb-3">
          <label>Contact Number:</label>
          <input type="text" name="contactNumber" value={seller.contactNumber} onChange={handleChange} className="form-control" required />
        </div>

        <button type="submit" className="btn btn-primary">Update Profile</button>
      </form>

      {/* ✅ Change Password Section */}
      <button onClick={() => setShowChangePassword(true)} className="btn btn-warning mt-3">Change Password</button>

      {showChangePassword && (
        <form onSubmit={handleChangePassword} className="mt-4">
          <h3>Change Password</h3>
          {passwordMessage && <p className={`alert ${passwordMessage.includes('Failed') ? 'alert-danger' : 'alert-success'}`}>{passwordMessage}</p>}

          <div className="mb-3">
            <label>Current Password:</label>
            <input type="password" name="oldPassword" value={passwordData.oldPassword} onChange={handlePasswordChange} className="form-control" required />
          </div>

          <div className="mb-3">
            <label>New Password:</label>
            <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className="form-control" required />
          </div>

          <div className="mb-3">
            <label>Confirm New Password:</label>
            <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} className="form-control" required />
          </div>

          <button type="submit" className="btn btn-success">Update Password</button>
          <button type="button" className="btn btn-secondary ms-2" onClick={() => setShowChangePassword(false)}>Cancel</button>
        </form>
      )}
    </div>
  );
};

export default EditSellerProfile;
