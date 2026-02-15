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
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
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
    <div className="min-h-screen bg-[#F7F5F2] flex flex-col md:flex-row font-['DM_Sans'] text-[#1a1a1a]">
      <div className="w-full md:w-[45%] bg-[#111111] flex flex-col justify-between p-14 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full border border-white/[0.06]"></div>
        <div className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full border border-white/[0.05]"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 border border-white/90 rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" strokeWidth="1.5" className="w-[18px] h-[18px] stroke-white fill-none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-['DM_Sans'] font-medium text-sm tracking-[0.12em] uppercase text-white/90">HireHelper</span>
          </div>
        </div>

        <div className="relative z-10 hidden md:block">
          <h2 className="font-['Playfair_Display'] font-normal text-[clamp(32px,3.5vw,46px)] leading-[1.18] text-white mb-5 tracking-[-0.01em]">
            Create new<br />
            <em className="italic text-white/50">password.</em>
          </h2>
          <div className="w-10 h-px bg-white/30 mb-5"></div>
          <p className="text-sm font-light text-white/[0.45] leading-[1.7] max-w-[280px]">
            Enter the OTP sent to your email and create a new password.
          </p>
        </div>

        <div className="relative z-10 text-xs text-white/[0.20] tracking-[0.08em]">
          © 2025 HireHelper Inc. All rights reserved.
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center p-12">
        <div className="w-full max-w-[400px]">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-medium tracking-[0.06em] uppercase text-[#888] no-underline mb-12 hover:text-[#111] transition-colors duration-200">
            <svg viewBox="0 0 24 24" strokeWidth="2" className="w-3.5 h-3.5 stroke-current fill-none">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back to login
          </Link>

          <div className="mb-10">
            <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-[#999] mb-2.5">Password Recovery</p>
            <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl font-semibold text-[#111] tracking-[-0.02em] leading-[1.1]">
              Reset Password
            </h1>
          </div>

          {error && (
            <div className="flex items-center gap-2.5 bg-[#fff5f5] border border-[#ffd0d0] rounded-lg mb-6 p-3 text-sm text-[#c53030] border-l-[3px] border-l-[#e53e3e]">
              <svg viewBox="0 0 24 24" strokeWidth="1.8" className="w-[15px] h-[15px] stroke-current fill-none flex-shrink-0">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-[11px] font-medium tracking-[0.14em] uppercase mb-2.5 text-[#555]" htmlFor="otp">
                OTP Code
              </label>
              <input
                id="otp"
                type="text"
                className="w-full px-4 py-3.5 font-['DM_Sans'] text-base font-normal text-[#111] bg-white border border-[#e0ddd9] rounded-lg outline-none transition-all duration-200 placeholder:text-[#bbb] focus:border-[#111] focus:shadow-[0_0_0_3px_rgba(17,17,17,0.05)]"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label className="block text-[11px] font-medium tracking-[0.14em] uppercase mb-2.5 text-[#555]" htmlFor="newPassword">
                New Password
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3.5 pr-12 font-['DM_Sans'] text-base font-normal text-[#111] bg-white border border-[#e0ddd9] rounded-lg outline-none transition-all duration-200 placeholder:text-[#bbb] focus:border-[#111] focus:shadow-[0_0_0_3px_rgba(17,17,17,0.05)]"
                  placeholder="••••••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-1 text-[#999] hover:text-[#111] transition-colors duration-200"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  <svg viewBox="0 0 24 24" strokeWidth="1.8" className="w-[18px] h-[18px] stroke-current fill-none">
                    {showPassword ? (
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                    ) : (
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    )}
                    {showPassword && <line x1="1" y1="1" x2="23" y2="23" />}
                    {!showPassword && <circle cx="12" cy="12" r="3" />}
                  </svg>
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-[11px] font-medium tracking-[0.14em] uppercase mb-2.5 text-[#555]" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                className="w-full px-4 py-3.5 font-['DM_Sans'] text-base font-normal text-[#111] bg-white border border-[#e0ddd9] rounded-lg outline-none transition-all duration-200 placeholder:text-[#bbb] focus:border-[#111] focus:shadow-[0_0_0_3px_rgba(17,17,17,0.05)]"
                placeholder="••••••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 bg-[#111111] text-white border-none rounded-lg font-['DM_Sans'] text-sm font-medium tracking-[0.12em] uppercase cursor-pointer transition-all duration-200 mt-2 hover:bg-[#2a2a2a] hover:shadow-[0_6px_20px_rgba(0,0,0,0.18)] active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
