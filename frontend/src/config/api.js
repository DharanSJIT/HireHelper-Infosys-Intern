import axios from "axios";

/* =====================================================
   TOKEN HANDLER
===================================================== */

const addToken = (config) => {

  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};


/* =====================================================
   AUTH API
===================================================== */

const API = axios.create({
  baseURL: "http://localhost:3000/api/auth",
});

API.interceptors.request.use(addToken);


/* ================= AUTH FUNCTIONS ================= */

export const register = (data) =>
  API.post("/register", data);

export const verifyOtp = (data) =>
  API.post("/verify-otp", data);

export const resendOtp = (data) =>
  API.post("/resend-otp", data);

export const login = (data) =>
  API.post("/login", data);

export const getProfile = () =>
  API.get("/profile");

export const updateProfile = (data) =>
  API.put("/update-profile", data);

export const updateProfilePicture = (data) =>
  API.put("/profile-picture", data);

export const forgotPassword = (data) =>
  API.post("/forgot-password", data);

export const resetPassword = (data) =>
  API.post("/reset-password", data);


/* =====================================================
   TASK API
===================================================== */

const TaskAPI = axios.create({
  baseURL: "http://localhost:3000/api/tasks",
});

TaskAPI.interceptors.request.use(addToken);


/* ================= TASK FUNCTIONS ================= */

export const createTask = (data) =>
  TaskAPI.post("/create", data);

export const getMyTasks = () =>
  TaskAPI.get("/my-tasks");

export const getFeedTasks = () =>
  TaskAPI.get("/feed");

export const getAssignedTasks = () =>
  TaskAPI.get("/assigned");

export const getTaskById = (id) =>
  TaskAPI.get(`/${id}`);

export const updateTask = (id, data) =>
  TaskAPI.put(`/edit/${id}`, data);

export const deleteTask = (id) =>
  TaskAPI.delete(`/delete/${id}`);


/* =====================================================
   REQUEST API
===================================================== */

const RequestAPI = axios.create({
  baseURL: "http://localhost:3000/api/requests",
});

RequestAPI.interceptors.request.use(addToken);


/* ================= REQUEST FUNCTIONS ================= */

export const requestTask = (taskId) =>
  RequestAPI.post(`/${taskId}`);

export const getRequestsForMyTasks = () =>
  RequestAPI.get("/my-tasks");

export const getMyRequests = () =>
  RequestAPI.get("/my-requests");

export const acceptRequest = (requestId) =>
  RequestAPI.patch(`/${requestId}/accept`);

export const rejectRequest = (requestId) =>
  RequestAPI.patch(`/${requestId}/reject`);


/* =====================================================
   NOTIFICATION API
===================================================== */

export const getNotifications = () =>
  RequestAPI.get("/notifications");

export const markNotificationRead = (notificationId) =>
  RequestAPI.patch(`/notifications/${notificationId}/read`);

export const markAllNotificationsRead = () =>
  RequestAPI.patch("/notifications/read-all");


/* =====================================================
   EXPORT DEFAULT
===================================================== */

export default API;