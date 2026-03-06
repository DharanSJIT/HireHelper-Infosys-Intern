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

export const createTask = (data) => TaskAPI.post('/create', data);
export const getMyTasks = () => TaskAPI.get('/my-tasks');
export const getFeedTasks = () => TaskAPI.get('/feed');
export const getTaskById = (id) => TaskAPI.get(`/${id}`);

const RequestAPI = axios.create({
  baseURL: 'http://localhost:3000/api/requests',
});

RequestAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const requestTask = (taskId) => RequestAPI.post(`/${taskId}`);
export const getRequestsForMyTasks = () => RequestAPI.get('/my-tasks');
export const getMyRequests = () => RequestAPI.get('/my-requests');
export const acceptRequest = (requestId) => RequestAPI.patch(`/${requestId}/accept`);
export const rejectRequest = (requestId) => RequestAPI.patch(`/${requestId}/reject`);
export const getNotifications = () => RequestAPI.get('/notifications');
export const markNotificationRead = (notificationId) => RequestAPI.patch(`/notifications/${notificationId}/read`);
export const markAllNotificationsRead = () => RequestAPI.patch('/notifications/read-all');
export const deleteTask = (id) => TaskAPI.delete(`/${id}`);
export const updateTask = (id, data) => TaskAPI.put(`/${id}`, data);

export default API;
