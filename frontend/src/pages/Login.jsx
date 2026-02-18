import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../config/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await login({ email_id: email, password });
      localStorage.setItem("token", data.token);
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("savedEmail", email);
      } else {
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("savedEmail");
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (

  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4 py-8">

    {/* Card */}
    <div className="bg-white border border-blue-100 rounded-2xl shadow-[0_8px_30px_rgba(59,130,246,0.12)] w-full max-w-[480px] px-10 py-12 flex flex-col items-center">


      {/* Logo */}
      <div className="w-[68px] h-[68px] bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[18px] flex items-center justify-center mb-6 shadow-lg">
        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white">
          <path d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      </div>


      {/* Heading */}
      <h1 className="text-[26px] font-bold text-gray-900 mb-1.5 text-center">
        Welcome Back
      </h1>

      <p className="text-sm text-gray-600 text-center mb-8">
        Sign in to your Hire-a-Helper account
      </p>


      {/* Error */}
      {error && (
        <div className="w-full bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded mb-4">
          {error}
        </div>
      )}



      {/* Form */}
      <form onSubmit={handleLogin} className="w-full flex flex-col gap-5">


        {/* Email */}
        <div>

          <label className="text-sm text-gray-700 font-medium">
            Email address
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="w-full mt-1 px-3 py-3 bg-white border border-blue-200 text-gray-900 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
          />

        </div>



        {/* Password */}
        <div>

          <label className="text-sm text-gray-700 font-medium">
            Password
          </label>

          <div className="relative">

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              className="w-full mt-1 px-3 py-3 bg-white border border-blue-200 text-gray-900 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />


            <button
              type="button"
              onClick={()=>setShowPassword(!showPassword)}
              className="absolute right-3 top-4 text-gray-500 hover:text-blue-600 transition"
            >
              {showPassword ? "Hide" : "Show"}
            </button>


          </div>

        </div>



        {/* Remember */}
        <div className="flex justify-between items-center">

          <label className="text-gray-700 text-sm">

            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e)=>setRememberMe(e.target.checked)}
              className="mr-2"
            />

            Remember me

          </label>



          <Link
            to="/forgot-password"
            className="text-blue-600 text-sm hover:text-blue-700 hover:underline transition"
          >
            Forgot password?
          </Link>


        </div>



        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-lg font-semibold transition shadow-lg hover:shadow-xl disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>


      </form>



      {/* Footer */}
      <p className="mt-6 text-gray-600 text-sm">

        Don't have an account?

        <Link
          to="/signup"
          className="text-blue-600 ml-2 hover:text-blue-700 hover:underline transition"
        >
          Sign up
        </Link>

      </p>


    </div>

  </div>

);
}