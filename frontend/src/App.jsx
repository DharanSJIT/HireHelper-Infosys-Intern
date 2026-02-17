import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Signup from './pages/Signup'
import VerifyOtp from './components/VerifyOtp'
import ForgotPassword from './components/ForgotPassword'
import ResetPassword from './components/ResetPassword'
import Dashboard from './components/Dashboard'
import Feed from './components/Feed'
import MyTasks from './components/MyTasks'
import Requests from './components/Requests'
import MyRequests from './components/MyRequests'
import AddTask from './components/AddTask'
import Settings from './components/Settings'

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard/feed" />} />
          <Route path="feed" element={<Feed />} />
          <Route path="my-tasks" element={<MyTasks />} />
          <Route path="requests" element={<Requests />} />
          <Route path="my-requests" element={<MyRequests />} />
          <Route path="add-task" element={<AddTask />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
