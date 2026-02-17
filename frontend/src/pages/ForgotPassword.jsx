import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "../config/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    setLoading(true);
    try {
      await forgotPassword({ email_id: email });
      setSuccess("OTP sent to your email!");
      setTimeout(() => navigate("/reset-password", { state: { email } }), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e8f0fe] flex items-center justify-center px-4 py-10">

      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] w-full max-w-[480px] px-10 py-10 flex flex-col items-center">

        {/* ── Logo ── */}
        <div className="w-[68px] h-[68px] bg-[#2f80ed] rounded-[18px] flex items-center justify-center mb-6 flex-shrink-0">
          <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
          </svg>
        </div>

        {/* ── Heading ── */}
        <h1 className="text-[26px] font-bold text-[#1a1a1a] tracking-tight mb-1.5 text-center leading-tight">
          Forgot Password?
        </h1>
        <p className="text-sm text-[#7a8a99] text-center mb-7 leading-relaxed max-w-[320px]">
          No worries! Enter your email and we'll send you a reset code.
        </p>

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

        {/* ── Success Banner ── */}
        {success && (
          <div className="w-full flex items-center gap-2.5 bg-[#f0fdf4] border border-green-200 border-l-[3px] border-l-green-500 rounded-lg px-3.5 py-2.5 mb-5 text-[13.5px] text-green-700">
            <svg viewBox="0 0 24 24" strokeWidth="1.8" className="w-[15px] h-[15px] stroke-green-600 fill-none flex-shrink-0">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {success}
          </div>
        )}

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">

          {/* Email Field */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-semibold text-[#1a1a1a]">
              Email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="w-full px-3.5 py-[11px] text-sm text-[#1a1a1a] bg-white border border-[#e2e8f0] rounded-lg outline-none transition-all duration-200 placeholder:text-[#b0bec5] focus:border-[#2f80ed] focus:ring-[3px] focus:ring-[#2f80ed]/10"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-[13px] mt-1 bg-[#2f80ed] hover:bg-[#1a6fd4] hover:shadow-[0_4px_14px_rgba(47,128,237,0.35)] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white text-[15px] font-semibold rounded-lg border-none cursor-pointer transition-all duration-200"
          >
            {loading ? "Sending OTP…" : "Send OTP"}
          </button>

        </form>

        {/* ── Divider ── */}
        <div className="w-full flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-[#e2e8f0]" />
          <span className="text-xs text-[#b0bec5] font-medium">or</span>
          <div className="flex-1 h-px bg-[#e2e8f0]" />
        </div>

        {/* ── Back to login ── */}
        <Link
          to="/login"
          className="w-full flex items-center justify-center gap-2 py-[11px] border border-[#e2e8f0] rounded-lg text-sm font-semibold text-[#4a5568] no-underline hover:bg-[#f8fafc] hover:border-[#c8d6e3] transition-all duration-200"
        >
          <svg viewBox="0 0 24 24" strokeWidth="2" className="w-4 h-4 stroke-current fill-none">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to Sign In
        </Link>

        {/* ── Footer ── */}
        <p className="mt-6 text-sm text-[#7a8a99] text-center">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-[#2f80ed] font-semibold no-underline hover:text-[#1a6fd4] hover:underline transition-colors duration-150"
          >
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
}