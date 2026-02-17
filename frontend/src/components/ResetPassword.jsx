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
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

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
      await resetPassword({
        email_id: email,
        otp,
        newPassword,
      });

      navigate("/login");

    } catch (err) {

      setError(
        err.response?.data?.message ||
          "Failed to reset password"
      );

    } finally {

      setLoading(false);

    }
  };



  /* Eye Icon */

  const EyeIcon = ({ visible }) =>
    visible ? (
      <svg
        viewBox="0 0 24 24"
        strokeWidth="1.8"
        className="w-[18px] h-[18px] stroke-current fill-none"
      >
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    ) : (
      <svg
        viewBox="0 0 24 24"
        strokeWidth="1.8"
        className="w-[18px] h-[18px] stroke-current fill-none"
      >
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );



  /* Theme Classes */

  const inputCls =
    "w-full px-3.5 py-[11px] text-sm text-[#1a1a1a] bg-white border border-[#e0ddd9] rounded-lg outline-none transition-all placeholder:text-gray-400 focus:border-black focus:ring-[3px] focus:ring-black/10";

  const labelCls =
    "text-sm font-semibold text-black mb-1.5 block";



  return (

    <div className="min-h-screen bg-[#F7F5F2] font-['DM_Sans'] flex items-center justify-center px-4 py-10">

      {/* Card */}

      <div className="bg-white border border-[#e0ddd9] rounded-xl shadow-sm w-full max-w-[480px] px-10 py-10 flex flex-col items-center">

        {/* Logo */}

        <div className="w-[60px] h-[60px] bg-black rounded-lg flex items-center justify-center mb-6">

          <span className="text-white text-xl font-semibold">
            H
          </span>

        </div>



        {/* Heading */}

        <h1 className="text-[28px] font-semibold text-black mb-2 text-center">

          Reset Password

        </h1>



        <p className="text-sm text-gray-600 text-center mb-1">

          Enter the OTP sent to your email

        </p>



        {email && (

          <p className="text-sm font-medium text-black mb-6">

            {email}

          </p>

        )}



        {/* Error */}

        {error && (

          <div className="w-full bg-[#f9f8f7] border border-[#e0ddd9] text-sm text-red-600 rounded-md px-3 py-2 mb-4">

            {error}

          </div>

        )}



        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-4"
        >

          {/* OTP */}

          <div>

            <label className={labelCls}>

              OTP Code

            </label>

            <input
              type="text"
              value={otp}
              maxLength={6}
              inputMode="numeric"
              onChange={(e) =>
                setOtp(
                  e.target.value.replace(/\D/g, "")
                )
              }
              placeholder="Enter OTP"
              className={`${inputCls} text-center tracking-[0.3em]`}
            />

          </div>



          {/* Password */}

          <div>

            <label className={labelCls}>

              New Password

            </label>

            <div className="relative">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(
                    e.target.value
                  )
                }
                placeholder="New password"
                className={`${inputCls} pr-10`}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >

                <EyeIcon
                  visible={showPassword}
                />

              </button>

            </div>

          </div>



          {/* Confirm Password */}

          <div>

            <label className={labelCls}>

              Confirm Password

            </label>

            <div className="relative">

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                placeholder="Confirm password"
                className={`${inputCls} pr-10`}
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >

                <EyeIcon
                  visible={
                    showConfirmPassword
                  }
                />

              </button>

            </div>

          </div>



          <p className="text-xs text-gray-500">

            Password must be at least 8 characters

          </p>



          {/* Button */}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 bg-black hover:bg-gray-800 text-white font-medium rounded-lg border border-black transition-all"
          >

            {loading
              ? "Resetting..."
              : "Reset Password"}

          </button>

        </form>



        {/* Divider */}

        <div className="w-full flex items-center gap-3 my-6">

          <div className="flex-1 h-px bg-[#e0ddd9]" />

          <span className="text-xs text-gray-500">

            or

          </span>

          <div className="flex-1 h-px bg-[#e0ddd9]" />

        </div>



        {/* Back */}

        <Link
          to="/login"
          className="w-full text-center py-3 border border-[#e0ddd9] rounded-lg text-sm font-medium text-black hover:bg-[#f9f8f7] transition-all"
        >

          Back to Sign In

        </Link>

      </div>

    </div>

  );
}
