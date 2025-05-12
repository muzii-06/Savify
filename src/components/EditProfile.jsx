import React, { useState, useEffect } from 'react';
import './EditProfile.css';

import axios from 'axios';

const EditProfile = () => {
  const [user, setUser] = useState({
    username: '',
    email: '',
    address: '',
    dateOfBirth: '',
    gender: '',
    contactNumber: '',
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchUser = async () => {
     

      try {
        console.log("Fetching user data for ID:", userId);
        const response = await axios.get(`http://localhost:5000/api/auth/user/${userId}`);
        console.log("Full user response:", response.data);
        console.log("Parsed dateOfBirth:", response.data.dateOfBirth?.split('T')[0]);
        console.log("Parsed gender:", response.data.gender);

        if (response.data) {
          setUser({
            username: response.data.username || '',
            email: response.data.email || '',
            address: response.data.address || '',
            contactNumber: response.data.contactNumber || '',
            dateOfBirth: response.data.dateOfBirth
              ? response.data.dateOfBirth.split('T')[0]
              : '',
            gender: response.data.gender || '',
          });
          
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data. Please try again.');
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    } else {
      setError("No userId found, cannot fetch user data.");
      setLoading(false);
    }
  }, [userId]);

  const handleChange = (e) => {
    setUser((prevUser) => ({
      ...prevUser,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const updatedData = {
        userId,
        address: user.address,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        contactNumber: user.contactNumber,
      };

      await axios.put('http://localhost:5000/api/auth/update-profile', updatedData);
      setMessage('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage('');

    if (newPassword !== confirmPassword) {
      setPasswordMessage('New passwords do not match.');
      return;
    }

    try {
      const response = await axios.put('http://localhost:5000/api/auth/change-password', {
        userId,
        oldPassword,
        newPassword,
      });

      setPasswordMessage(response.data.message);
      setShowChangePassword(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordMessage(error.response?.data?.message || 'Failed to change password.');
    }
  };

  if (loading) return <p>Loading profile data...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-5">
      <h2>Edit Profile</h2>
      {message && <p className="text-success">{message}</p>}
      {error && <p className="text-danger">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Username:</label>
          <input type="text" name="username" value={user.username} className="form-control" disabled />
        </div>

        <div className="mb-3">
          <label>Email:</label>
          <input type="email" name="email" value={user.email} className="form-control" disabled />
        </div>

        <div className="mb-3">
          <label>Address:</label>
          <input type="text" name="address" value={user.address} onChange={handleChange} className="form-control" required />
        </div>

        <div className="mb-3">
          <label>Date of Birth:</label>
          <input
  type="date"
  name="dateOfBirth"
  value={user.dateOfBirth}
  onChange={handleChange}
  className="form-control"
  required
/>
        </div>

        <div className="mb-3">
          <label>Gender:</label>
          <select
  name="gender"
  value={user.gender}
  onChange={handleChange}
  className="form-control"
  required
>
  <option value="">Select Gender</option>
  <option value="Male">Male</option>
  <option value="Female">Female</option>
  <option value="Other">Other</option>
</select>
        </div>

        <div className="mb-3">
          <label>Contact Number:</label>
          <input type="text" name="contactNumber" value={user.contactNumber} onChange={handleChange} className="form-control" required />
        </div>

        <button type="submit" className="btn btn-primary">Update Profile</button>
      </form>

      <button onClick={() => setShowChangePassword(true)} className="btn btn-warning mt-3">Change Password</button>

      {showChangePassword && (
        <form onSubmit={handleChangePassword} className="mt-4">
          <h3>Change Password</h3>
          {passwordMessage && <p className="text-danger">{passwordMessage}</p>}

          <div className="mb-3">
            <label>Current Password:</label>
            <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="form-control" required />
          </div>

          <div className="mb-3">
            <label>New Password:</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="form-control" required />
          </div>

          <div className="mb-3">
            <label>Confirm New Password:</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="form-control" required />
          </div>

          <button type="submit" className="btn btn-success">Update Password</button>
          <button type="button" className="btn btn-secondary ms-2" onClick={() => setShowChangePassword(false)}>Cancel</button>
        </form>
      )}
    </div>
  );
};

export default EditProfile;
