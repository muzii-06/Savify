import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// Regular user authentication
export const signup = (userData) => axios.post(`${API_URL}/signup`, userData);
export const login = (userData) => axios.post(`${API_URL}/login`, userData);

// Seller authentication
export const sellerSignup = (userData) => axios.post(`${API_URL}/seller-signup`, userData);
export const sellerLogin = (userData) => axios.post(`${API_URL}/seller-login`, userData);
