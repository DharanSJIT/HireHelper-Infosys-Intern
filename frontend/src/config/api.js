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
export const resendOtp = (data) => API.post('/resend-otp', data);
export const login = (data) => API.post('/login', data);
export const getProfile = () => API.get('/profile');
export const updateProfilePicture = (data) => API.put('/profile-picture', data);
export const forgotPassword = (data) => API.post('/forgot-password', data);
export const resetPassword = (data) => API.post('/reset-password', data);

const TaskAPI = axios.create({
  baseURL: 'http://localhost:3000/api/tasks',
});

TaskAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const createTask = (data) => TaskAPI.post('/', data);
export const getMyTasks = () => TaskAPI.get('/my-tasks');
export const getFeedTasks = () => TaskAPI.get('/feed');
export const getTaskById = (id) => TaskAPI.get(`/${id}`);

export default API;
