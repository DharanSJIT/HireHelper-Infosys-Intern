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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  /* ── Reusable eye-toggle icon ── */
  const EyeIcon = ({ visible }) =>
    visible ? (
      <svg viewBox="0 0 24 24" strokeWidth="1.8" className="w-[18px] h-[18px] stroke-current fill-none">
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    ) : (
      <svg viewBox="0 0 24 24" strokeWidth="1.8" className="w-[18px] h-[18px] stroke-current fill-none">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );

  /* ── Shared classes ── */
  const inputCls =
    "w-full px-3.5 py-[11px] text-sm text-[#1a1a1a] bg-white border border-[#e2e8f0] rounded-lg outline-none transition-all duration-200 placeholder:text-[#b0bec5] focus:border-[#2f80ed] focus:ring-[3px] focus:ring-[#2f80ed]/10";

  const labelCls = "text-sm font-semibold text-[#1a1a1a] mb-1.5 block";

  return (
    <div className="min-h-screen bg-[#e8f0fe] flex items-center justify-center px-4 py-10">

      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] w-full max-w-[480px] px-10 py-10 flex flex-col items-center">

        {/* ── Logo ── */}
        <div className="w-[68px] h-[68px] bg-[#2f80ed] rounded-[18px] flex items-center justify-center mb-6 flex-shrink-0">
          <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 1C8.676 1 6 3.676 6 7v1H4v15h16V8h-2V7c0-3.324-2.676-6-6-6zm0 2c2.276 0 4 1.724 4 4v1H8V7c0-2.276 1.724-4 4-4zm0 9a2 2 0 110 4 2 2 0 010-4z" />
          </svg>
        </div>

        {/* ── Heading ── */}
        <h1 className="text-[26px] font-bold text-[#1a1a1a] tracking-tight mb-1.5 text-center leading-tight">
          Reset Password
        </h1>
        <p className="text-sm text-[#7a8a99] text-center mb-1 leading-relaxed max-w-[320px]">
          Enter the OTP sent to your email and choose a new password.
        </p>
        {email && (
          <p className="text-sm font-semibold text-[#2f80ed] text-center mb-7">
            {email}
          </p>
        )}
        {!email && <div className="mb-7" />}

        {/* ── Error Banner ── */}
        {error && (
          <div className="w-full flex items-center gap-2.5 bg-[#fff5f5] border border-red-200 border-l-[3px] border-l-red-500 rounded-lg px-3.5 py-2.5 mb-5 text-[13.5px] text-red-700">
            <svg viewBox="0 0 24 24" strokeWidth="1.8" className="w-[15px] h-[15px] stroke-red-600 fill-none flex-shrink-0">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">

          {/* OTP Code */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="otp" className={labelCls}>
              OTP Code
            </label>
            <input
              id="otp"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className={`${inputCls} text-center tracking-[0.4em] text-lg font-semibold placeholder:tracking-normal placeholder:text-base placeholder:font-normal`}
            />
          </div>

          {/* New Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="newPassword" className={labelCls}>
              New Password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Create new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                className={`${inputCls} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-1 text-[#9aacba] hover:text-[#4a5568] transition-colors duration-150 flex items-center"
              >
                <EyeIcon visible={showPassword} />
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirmPassword" className={labelCls}>
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                className={`${inputCls} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-1 text-[#9aacba] hover:text-[#4a5568] transition-colors duration-150 flex items-center"
              >
                <EyeIcon visible={showConfirmPassword} />
              </button>
            </div>
          </div>

          {/* Password strength hint */}
          <p className="text-xs text-[#9aacba] -mt-1">
            Password must be at least 8 characters long.
          </p>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-[13px] mt-1 bg-[#2f80ed] hover:bg-[#1a6fd4] hover:shadow-[0_4px_14px_rgba(47,128,237,0.35)] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white text-[15px] font-semibold rounded-lg border-none cursor-pointer transition-all duration-200"
          >
            {loading ? "Resetting…" : "Reset Password"}
          </button>

        </form>

        {/* ── Divider ── */}
        <div className="w-full flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-[#e2e8f0]" />
          <span className="text-xs text-[#b0bec5] font-medium">or</span>
          <div className="flex-1 h-px bg-[#e2e8f0]" />
        </div>

        {/* ── Back to login button ── */}
        <Link
          to="/login"
          className="w-full flex items-center justify-center gap-2 py-[11px] border border-[#e2e8f0] rounded-lg text-sm font-semibold text-[#4a5568] no-underline hover:bg-[#f8fafc] hover:border-[#c8d6e3] transition-all duration-200"
        >
          <svg viewBox="0 0 24 24" strokeWidth="2" className="w-4 h-4 stroke-current fill-none">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to Sign In
        </Link>

      </div>
    </div>
  );
}