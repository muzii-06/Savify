import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  // Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/request-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to send OTP');
      
      alert(data.message);
      setOtpSent(true);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-reset-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Invalid OTP');
      
      alert(data.message);
      setOtpVerified(true);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to reset password');
      
      alert(data.message);
      navigate('/login');
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="auth-container">
      <h2>Forgot Password</h2>
      {!otpSent ? (
        <form onSubmit={handleRequestOtp}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          <button type="submit">Request OTP</button>
        </form>
      ) : !otpVerified ? (
        <form onSubmit={handleVerifyOtp}>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            required
          />
          <button type="submit">Verify OTP</button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword}>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            required
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
          />
          <button type="submit">Reset Password</button>
        </form>
      )}
    </div>
  );
};

export default ForgetPassword;