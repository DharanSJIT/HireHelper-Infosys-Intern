import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyOtp } from "../config/api";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError("Please enter OTP");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await verifyOtp({ email_id: email, otp });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5F2] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-semibold mb-6">Verify OTP</h1>
        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4">{error}</div>}
        <form onSubmit={handleVerify}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg mb-4"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#111] text-white py-3 rounded-lg disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>
      </div>
    </div>
  );
}
