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
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4 py-10">

    <div className="bg-white border border-gray-200 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] w-full max-w-[480px] px-10 py-10 flex flex-col items-center">


      {/* Logo */}
      <div className="w-[68px] h-[68px] bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[18px] flex items-center justify-center mb-6 flex-shrink-0">
        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
        </svg>
      </div>


      {/* Heading */}
      <h1 className="text-[26px] font-bold text-gray-900 mb-1.5 text-center">
        Verify Your Email
      </h1>

      <p className="text-sm text-gray-500 text-center mb-1">
        Enter the 6-digit code sent to your email
      </p>

      {email && (
        <p className="text-sm text-gray-500 text-center mb-7 font-medium">
          {email}
        </p>
      )}

      {!email && <div className="mb-7" />}


      {/* Error */}
      {error && (
        <div className="w-full bg-red-50 border border-red-200 border-l-[3px] border-l-red-500 rounded-lg px-3.5 py-2.5 mb-5 text-sm text-red-700">
          {error}
        </div>
      )}


      {/* Success */}
      {success && (
        <div className="w-full bg-green-50 border border-green-200 border-l-[3px] border-l-green-500 rounded-lg px-3.5 py-2.5 mb-5 text-sm text-green-700">
          {success}
        </div>
      )}



      {/* Form */}
      <form onSubmit={handleVerify} className="w-full flex flex-col gap-5">


        <div>

          <label className="text-sm font-semibold text-gray-900">
            Verification Code
          </label>

          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="000000"
            value={otp}
            onChange={(e)=>setOtp(e.target.value.replace(/\D/g,""))}
            className="w-full mt-1 px-3.5 py-[11px] text-2xl font-semibold text-gray-900 bg-white border border-gray-300 rounded-lg outline-none focus:border-blue-600 text-center tracking-[0.5em]"
          />

        </div>



        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-[13px] bg-gradient-to-br from-blue-600 to-indigo-600 hover:bg-gray-800 text-white text-[15px] font-semibold rounded-lg transition"
        >
          {loading ? "Verifying…" : "Verify Code"}
        </button>


      </form>



      {/* Resend */}
      <p className="mt-6 text-sm text-gray-500 text-center">

        Didn't receive the code?{" "}

        {countdown > 0 ? (

          <span className="text-gray-400 font-medium">
            Resend in {countdown}s
          </span>

        ) : (

          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="text-gray-900 font-semibold hover:underline"
          >
            {resending ? "Sending…" : "Resend"}
          </button>

        )}

      </p>


    </div>

  </div>
);
}