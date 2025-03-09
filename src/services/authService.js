import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// Regular user authentication



export const signup = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, userData);
    return response.data;
  } catch (error) {
    console.error('Signup error:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};
export const login = (userData) => axios.post(`${API_URL}/login`, userData);

// Seller authentication
export const sellerSignup = (formData) =>
    axios.post(`${API_URL}/seller-signup`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Required for file upload
      },
    });
    export const sellerLogin = async ({ email, password, verificationCode }) => {
      try {
        const response = await axios.post('http://localhost:5000/api/auth/seller-login', {
          email,
          password,
          verificationCode
        });
    
        console.log('Seller login API response:', response.data); // ✅ Debug response
    
        return response;
      } catch (error) {
        console.error('Seller login error:', error.response?.data || error.message);
        throw error;
      }
    };

    // Add sellerRequestOtp function
    export const sellerRequestOtp = (data) => axios.post(`${API_URL}/seller-request-login-otp`, data);
