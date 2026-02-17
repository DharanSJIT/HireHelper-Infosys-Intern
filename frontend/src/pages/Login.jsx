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
    <div className="min-h-screen bg-[#dce8f5] flex items-center justify-center px-4 py-8">

      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] w-full max-w-[480px] px-10 py-12 flex flex-col items-center">

        {/* ── Logo ── */}
        <div className="w-[68px] h-[68px] bg-[#2f80ed] rounded-[18px] flex items-center justify-center mb-6">
          <svg
            viewBox="0 0 24 24"
            className="w-8 h-8 fill-white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
        </div>

        {/* ── Heading ── */}
        <h1 className="text-[26px] font-bold text-[#1a1a1a] tracking-tight mb-1.5 text-center leading-tight">
          Welcome Back
        </h1>
        <p className="text-sm text-[#7a8a99] text-center mb-8">
          Sign in to your Hire-a-Helper account
        </p>

        {/* ── Error Banner ── */}
        {error && (
          <div className="w-full flex items-center gap-2.5 bg-[#fff5f5] border border-red-200 border-l-[3px] border-l-red-500 rounded-lg px-3.5 py-2.5 mb-5 text-[13.5px] text-red-700">
            <svg
              viewBox="0 0 24 24"
              strokeWidth="1.8"
              className="w-[15px] h-[15px] stroke-red-600 fill-none flex-shrink-0"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        {/* ── Form ── */}
        <form onSubmit={handleLogin} className="w-full flex flex-col gap-5">

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-sm font-semibold text-[#1a1a1a]"
            >
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

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-sm font-semibold text-[#1a1a1a]"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full px-3.5 py-[11px] pr-11 text-sm text-[#1a1a1a] bg-white border border-[#e2e8f0] rounded-lg outline-none transition-all duration-200 placeholder:text-[#b0bec5] focus:border-[#2f80ed] focus:ring-[3px] focus:ring-[#2f80ed]/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-1 text-[#9aacba] hover:text-[#4a5568] transition-colors duration-150 flex items-center justify-center"
              >
                {showPassword ? (
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
                )}
              </button>
            </div>
          </div>

          {/* Remember me + Forgot password */}
          <div className="flex items-center justify-between -mt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-sm font-medium text-[#1a1a1a]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border border-[#c8d6e3] accent-[#2f80ed] cursor-pointer"
              />
              Remember me
            </label>
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-[#2f80ed] no-underline hover:text-[#1a6fd4] hover:underline transition-colors duration-150"
            >
              Forgot your password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-[13px] mt-1 bg-[#2f80ed] hover:bg-[#1a6fd4] hover:shadow-[0_4px_14px_rgba(47,128,237,0.35)] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white text-[15px] font-semibold tracking-wide rounded-lg border-none cursor-pointer transition-all duration-200"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>

        </form>

        {/* ── Footer ── */}
        <p className="mt-7 text-sm text-[#7a8a99] text-center">
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