import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { verifyOtp, resendOtp } from "../config/api";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const [otp, setOtp]           = useState("");
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");
  const [loading, setLoading]   = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const email = location.state?.email;

  useEffect(() => { if (!email) navigate("/login"); }, [email, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown((p) => p - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) { setError("Please enter a valid 6-digit code."); return; }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const { data } = await verifyOtp({ email_id: email, otp });
      localStorage.setItem("token", data.token);
      setSuccess("Account verified! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed. Please check your code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    setError("");
    setSuccess("");
    try {
      await resendOtp({ email_id: email });
      setSuccess("A new code has been sent to your email.");
      setCountdown(60);
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend code.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[440px] page-enter">

        {/* Icon */}
        <div className="flex justify-center mb-7">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center" style={{ boxShadow: 'var(--shadow-md)' }}>
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" className="w-8 h-8 stroke-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Verify your email</h1>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            Enter the 6-digit code sent to{" "}
            <span className="font-semibold text-slate-700">{email || "your email"}</span>
          </p>
        </div>

        {/* Card */}
        <div className="surface-card px-7 py-7 space-y-5">

          {error && (
            <div className="alert-error">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" className="w-4 h-4 flex-shrink-0 stroke-red-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="alert-success">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" className="w-4 h-4 flex-shrink-0 stroke-emerald-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-4">
            <div className="input-group">
              <label className="input-label" htmlFor="otp-code">Verification Code</label>
              <input
                id="otp-code"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="0  0  0  0  0  0"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="input-field text-center text-2xl font-bold tracking-[0.5em] py-3.5"
                autoComplete="one-time-code"
              />
              <p className="text-xs text-slate-400 text-center mt-1">
                {otp.length}/6 digits entered
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="btn-primary w-full py-3 text-[15px]"
            >
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" />
                  </svg>
                  Verifying...
                </span>
              ) : "Verify Code →"}
            </button>
          </form>

          <div className="border-t border-slate-100 pt-4 text-center text-sm">
            <p className="text-slate-500 mb-2">Didn&apos;t receive the code?</p>
            {countdown > 0 ? (
              <p className="text-slate-400 text-sm">
                Resend available in{" "}
                <span className="font-semibold text-slate-600 tabular-nums">{countdown}s</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="font-bold text-blue-600 hover:text-blue-700 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {resending ? "Sending..." : "Resend Code"}
              </button>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Wrong email?{" "}
          <Link to="/signup" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
            Go back to signup
          </Link>
        </p>

      </div>
    </div>
  );
}