import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyOtp, resendOtp } from "../config/api";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const email = location.state?.email;

  /* ================= SAFETY CHECK ================= */
  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);

  /* ================= COUNTDOWN ================= */
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  /* ================= VERIFY OTP ================= */
  const handleVerify = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit verification code.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const { data } = await verifyOtp({
        email_id: email,
        otp,
      });

      // ✅ Save token
      localStorage.setItem("token", data.token);

      setSuccess("Account verified successfully!");

      // Small delay for better UX
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);

    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Verification failed. Please check your code."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= RESEND OTP ================= */
  const handleResend = async () => {
    if (!email) return;

    setResending(true);
    setError("");
    setSuccess("");

    try {
      await resendOtp({ email_id: email });

      setSuccess("A new OTP has been sent to your email.");
      setCountdown(60);

      setTimeout(() => {
        setSuccess("");
      }, 4000);

    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to resend OTP."
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[440px]">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Verify your email
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Enter the 6-digit code sent to{" "}
            <span className="font-semibold text-slate-700">
              {email || "your email"}
            </span>
          </p>
        </div>

        <div className="surface-card px-7 py-8">

          {/* Error */}
          {error && (
            <div className="mb-4 text-red-600 text-sm">{error}</div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-4 text-emerald-600 text-sm">{success}</div>
          )}

          <form onSubmit={handleVerify} className="space-y-4">

            <div>
              <label className="input-label">Verification Code</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, ""))
                }
                className="input-field text-center text-xl font-bold tracking-[0.4em] py-3"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5"
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>
          </form>

          <div className="my-5 border-t pt-4 text-center text-sm text-slate-500">

            {countdown > 0 ? (
              <span className="text-slate-400">
                Resend available in {countdown}s
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-50"
              >
                {resending ? "Sending..." : "Resend Code"}
              </button>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}