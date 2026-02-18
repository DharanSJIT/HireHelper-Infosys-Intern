import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../config/api";

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      await register({
        first_name: firstName,
        last_name: lastName,
        email_id: email,
        password,
      });
      navigate("/verify-otp", { state: { email } });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  /* ── reusable eye-toggle icon ── */
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

  /* ── shared input classes ── */
  const inputCls =
    "w-full px-3.5 py-[11px] text-sm text-[#1a1a1a] bg-white border border-[#e2e8f0] rounded-lg outline-none transition-all duration-200 placeholder:text-[#b0bec5] focus:border-[#2f80ed] focus:ring-[3px] focus:ring-[#2f80ed]/10";

  const labelCls = "text-sm font-semibold text-[#1a1a1a] mb-1.5 block";

  return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4 py-10">

    <div className="bg-white border border-blue-100 rounded-2xl shadow-[0_8px_30px_rgba(59,130,246,0.12)] w-full max-w-[480px] px-10 py-10 flex flex-col items-center">


      {/* Logo */}
      <div className="w-[68px] h-[68px] bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[18px] flex items-center justify-center mb-5 flex-shrink-0 shadow-lg">
        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
        </svg>
      </div>


      {/* Heading */}
      <h1 className="text-[26px] font-bold text-gray-900 tracking-tight mb-1 text-center">
        Create Account
      </h1>

      <p className="text-sm text-gray-600 text-center mb-7">
        Join Hire-a-Helper community
      </p>



      {/* Error */}
      {error && (
        <div className="w-full flex items-center gap-2.5 bg-red-50 border border-red-200 border-l-[3px] border-l-red-500 rounded-lg px-3.5 py-2.5 mb-5 text-[13.5px] text-red-700">
          {error}
        </div>
      )}



      {/* Form */}
      <form onSubmit={handleSignup} className="w-full flex flex-col gap-4">


        {/* First + Last */}
        <div className="grid grid-cols-2 gap-3">

          <div>

            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
              First Name
            </label>

            <input
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e)=>setFirstName(e.target.value)}
              className="w-full px-3.5 py-[11px] text-sm text-gray-900 bg-white border border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
            />

          </div>


          <div>

            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
              Last Name
            </label>

            <input
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e)=>setLastName(e.target.value)}
              className="w-full px-3.5 py-[11px] text-sm text-gray-900 bg-white border border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
            />

          </div>

        </div>



        {/* Email */}
        <div>

          <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
            Email address
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="w-full px-3.5 py-[11px] text-sm text-gray-900 bg-white border border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
          />

        </div>



        {/* Phone */}
        <div>

          <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
            Phone Number
            <span className="text-gray-400 font-normal"> (Optional)</span>
          </label>

          <input
            type="tel"
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChange={(e)=>setPhoneNumber(e.target.value)}
            className="w-full px-3.5 py-[11px] text-sm text-gray-900 bg-white border border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
          />

        </div>



        {/* Password */}
        <div>

          <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
            Password
          </label>

          <div className="relative">

            <input
              type={showPassword ? "text":"password"}
              placeholder="Create password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              className="w-full px-3.5 py-[11px] text-sm text-gray-900 bg-white border border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition pr-11"
            />

            <button
              type="button"
              onClick={()=>setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition"
            >
              <EyeIcon visible={showPassword}/>
            </button>

          </div>

        </div>



        {/* Confirm */}
        <div>

          <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
            Confirm Password
          </label>

          <div className="relative">

            <input
              type={showConfirmPassword ? "text":"password"}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e)=>setConfirmPassword(e.target.value)}
              className="w-full px-3.5 py-[11px] text-sm text-gray-900 bg-white border border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition pr-11"
            />

            <button
              type="button"
              onClick={()=>setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition"
            >
              <EyeIcon visible={showConfirmPassword}/>
            </button>

          </div>

        </div>



        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-[13px] mt-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-[15px] font-semibold rounded-lg transition shadow-lg hover:shadow-xl disabled:opacity-50"
        >
          {loading ? "Creating account…" : "Create Account"}
        </button>


      </form>



      {/* Footer */}
      <p className="mt-6 text-sm text-gray-600 text-center">

        Already have an account?

        <Link
          to="/login"
          className="text-blue-600 font-semibold ml-2 hover:text-blue-700 hover:underline transition"
        >
          Sign in
        </Link>

      </p>


    </div>
  </div>
);
}