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
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4 py-10">

    <div className="bg-white border border-gray-200 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] w-full max-w-[480px] px-10 py-10 flex flex-col items-center">


      {/* Logo */}
      <div className="w-[68px] h-[68px] bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[18px] flex items-center justify-center mb-6">
        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white">
          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2z"/>
        </svg>
      </div>



      {/* Heading */}
      <h1 className="text-[26px] font-bold text-gray-900 mb-1.5 text-center">
        Forgot Password?
      </h1>

      <p className="text-sm text-gray-500 text-center mb-7 max-w-[320px]">
        No worries! Enter your email and we'll send you a reset code.
      </p>



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
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">


        <div>

          <label className="text-sm font-semibold text-gray-900">
            Email address
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="w-full mt-1 px-3.5 py-[11px] text-sm text-gray-900 bg-white border border-gray-300 rounded-lg outline-none focus:border-blue-600"
          />

        </div>



        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-[13px] bg-gradient-to-br from-blue-600 to-indigo-600 hover:bg-gray-800 text-white text-[15px] font-semibold rounded-lg transition"
        >
          {loading ? "Sending OTP…" : "Send OTP"}
        </button>


      </form>



      {/* Divider */}
      <div className="w-full flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-gray-300"/>
        <span className="text-xs text-gray-400 font-medium">or</span>
        <div className="flex-1 h-px bg-gray-300"/>
      </div>



      {/* Back */}
      <Link
        to="/login"
        className="w-full flex items-center justify-center gap-2 py-[11px] border border-gray-300 rounded-lg text-sm font-semibold text-gray-900 hover:bg-gray-50 transition"
      >
        Back to Sign In
      </Link>



      {/* Footer */}
      <p className="mt-6 text-sm text-gray-500 text-center">

        Don't have an account?{" "}

        <Link
          to="/signup"
          className="text-gray-900 font-semibold hover:underline"
        >
          Sign up
        </Link>

      </p>


    </div>

  </div>
);
}