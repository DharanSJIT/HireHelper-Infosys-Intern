import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { resetPassword } from "../config/api";

export default function ResetPassword() {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!otp || !newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      await resetPassword({ email_id: email, otp, newPassword });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4 py-10">
      <div className="bg-white border border-blue-100 rounded-2xl shadow-[0_8px_30px_rgba(59,130,246,0.12)] w-full max-w-[480px] px-10 py-10">
        
        <div className="w-[68px] h-[68px] bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[18px] flex items-center justify-center mb-6 mx-auto shadow-lg">
          <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white">
            <path d="M12 1C8.676 1 6 3.676 6 7v1H4v15h16V8h-2V7c0-3.324-2.676-6-6-6zm0 2c2.276 0 4 1.724 4 4v1H8V7c0-2.276 1.724-4 4-4zm0 9a2 2 0 110 4 2 2 0 010-4z" />
          </svg>
        </div>

        <h1 className="text-[26px] font-bold text-gray-900 mb-2 text-center">Reset Password</h1>
        <p className="text-sm text-gray-600 text-center mb-6">Enter OTP and create new password</p>

        {error && (
          <div className="w-full bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">OTP Code</label>
            <input
              type="text"
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="w-full px-3.5 py-[11px] text-sm text-gray-900 bg-white border border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition text-center"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-[11px] text-sm text-gray-900 bg-white border border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3.5 py-[11px] text-sm text-gray-900 bg-white border border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-[13px] mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-[15px] font-semibold rounded-lg transition shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            {loading ? "Resetting…" : "Reset Password"}
          </button>
        </form>

        <Link
          to="/login"
          className="w-full block text-center py-3 mt-4 border border-blue-200 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 transition-all"
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}
