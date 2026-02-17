import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyOtp, resendOtp } from "../config/api";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError("Please enter OTP");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { data } = await verifyOtp({ email_id: email, otp });
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError("");
    setSuccess("");
    try {
      await resendOtp({ email_id: email });
      setSuccess("OTP resent successfully!");
      setCountdown(60);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf6e3] flex items-center justify-center px-4 py-10">

      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] w-full max-w-[480px] px-10 py-10 flex flex-col items-center">

        {/* ── Logo ── */}
        <div className="w-[68px] h-[68px] bg-[#f97316] rounded-[18px] flex items-center justify-center mb-6 flex-shrink-0">
          <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
          </svg>
        </div>

        {/* ── Heading ── */}
        <h1 className="text-[26px] font-bold text-[#1a1a1a] tracking-tight mb-1.5 text-center leading-tight">
          Verify Your Email
        </h1>
        <p className="text-sm text-[#7a8a99] text-center mb-1">
          Enter the 6-digit code sent to your email
        </p>
        {email && (
          <p className="text-sm text-[#7a8a99] text-center mb-7 font-medium">
            {email}
          </p>
        )}
        {!email && (
          <div className="mb-7" />
        )}

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
        <form onSubmit={handleVerify} className="w-full flex flex-col gap-5">

          {/* OTP Field */}
          <div className="flex flex-col items-center gap-2">
            <label htmlFor="otp" className="text-sm font-semibold text-[#1a1a1a] self-start">
              Verification Code
            </label>
            <input
              id="otp"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="w-full px-3.5 py-[11px] text-2xl font-semibold text-[#1a1a1a] bg-white border border-[#e2e8f0] rounded-lg outline-none transition-all duration-200 placeholder:text-[#c8d6e3] placeholder:text-2xl focus:border-[#2f80ed] focus:ring-[3px] focus:ring-[#2f80ed]/10 text-center tracking-[0.5em]"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-[13px] bg-[#2f80ed] hover:bg-[#1a6fd4] hover:shadow-[0_4px_14px_rgba(47,128,237,0.35)] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white text-[15px] font-semibold rounded-lg border-none cursor-pointer transition-all duration-200"
          >
            {loading ? "Verifying…" : "Verify Code"}
          </button>

        </form>

        {/* ── Resend Footer ── */}
        <p className="mt-6 text-sm text-[#7a8a99] text-center">
          Didn't receive the code?{" "}
          {countdown > 0 ? (
            <span className="text-[#9aacba] font-medium">
              Resend in {countdown}s
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="text-[#2f80ed] font-semibold bg-transparent border-none cursor-pointer hover:text-[#1a6fd4] hover:underline transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed p-0"
            >
              {resending ? "Sending…" : "Resend"}
            </button>
          )}
        </p>

      </div>
    </div>
  );
}