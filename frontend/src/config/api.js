import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api/auth',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = (data) => API.post('/register', data);
export const verifyOtp = (data) => API.post('/verify-otp', data);
export const login = (data) => API.post('/login', data);
export const getProfile = () => API.get('/profile');
export const updateProfilePicture = (data) => API.put('/profile-picture', data);

export default API;
