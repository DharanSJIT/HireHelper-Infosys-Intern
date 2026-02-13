import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../config/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5F2] flex flex-col md:flex-row font-['DM_Sans'] text-[#1a1a1a]">
      {/* Left decorative panel */}
      <div className="w-full md:w-[45%] bg-[#111111] flex flex-col justify-between p-14 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full border border-white/[0.06]"></div>
        <div className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full border border-white/[0.05]"></div>

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 border border-white/90 rounded-lg flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                className="w-[18px] h-[18px] stroke-white fill-none"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-['DM_Sans'] font-medium text-sm tracking-[0.12em] uppercase text-white/90">
              HireHelper
            </span>
          </div>
        </div>

        {/* Tagline block */}
        <div className="relative z-10 hidden md:block">
          <h2 className="font-['Playfair_Display'] font-normal text-[clamp(32px,3.5vw,46px)] leading-[1.18] text-white mb-5 tracking-[-0.01em]">
            Your work,<br />
            <em className="italic text-white/50">elevated.</em>
          </h2>
          <div className="w-10 h-px bg-white/30 mb-5"></div>
          {/* FIX: text-white/45 is not a valid Tailwind step → use arbitrary bracket syntax */}
          <p className="text-sm font-light text-white/[0.45] leading-[1.7] max-w-[280px]">
            A platform built for professionals who demand precision, clarity, and control over every detail.
          </p>
        </div>

        {/* Footer — FIX: text-white/20 → text-white/[0.20] */}
        <div className="relative z-10 text-xs text-white/[0.20] tracking-[0.08em]">
          © 2025 HireHelper Inc. All rights reserved.
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-12">
        <div className="w-full max-w-[400px]">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium tracking-[0.06em] uppercase text-[#888] no-underline mb-12 hover:text-[#111] transition-colors duration-200"
          >
            <svg
              viewBox="0 0 24 24"
              strokeWidth="2"
              className="w-3.5 h-3.5 stroke-current fill-none"
            >
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back to home
          </Link>

          <div className="mb-10">
            <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-[#999] mb-2.5">
              Secure access
            </p>
            <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl font-semibold text-[#111] tracking-[-0.02em] leading-[1.1]">
              Sign in
            </h1>
          </div>

          {error && (
            <div className="flex items-center gap-2.5 bg-[#fff5f5] border border-[#ffd0d0] rounded-lg mb-6 p-3 text-sm text-[#c53030] border-l-[3px] border-l-[#e53e3e] animate-[errorIn_0.2s_ease]">
              <svg
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                className="w-[15px] h-[15px] stroke-current fill-none flex-shrink-0"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label
                className={`block text-[11px] font-medium tracking-[0.14em] uppercase mb-2.5 transition-colors duration-200 ${
                  focused === "email" ? "text-[#111]" : "text-[#555]"
                }`}
                htmlFor="email"
              >
                Email address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  className="w-full px-4 py-3.5 font-['DM_Sans'] text-base font-normal text-[#111] bg-white border border-[#e0ddd9] rounded-lg outline-none transition-all duration-200 placeholder:text-[#bbb] focus:border-[#111] focus:shadow-[0_0_0_3px_rgba(17,17,17,0.05)]"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused("")}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="mb-6">
              <label
                className={`block text-[11px] font-medium tracking-[0.14em] uppercase mb-2.5 transition-colors duration-200 ${
                  focused === "password" ? "text-[#111]" : "text-[#555]"
                }`}
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3.5 pr-12 font-['DM_Sans'] text-base font-normal text-[#111] bg-white border border-[#e0ddd9] rounded-lg outline-none transition-all duration-200 placeholder:text-[#bbb] focus:border-[#111] focus:shadow-[0_0_0_3px_rgba(17,17,17,0.05)]"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused("")}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-1 text-[#999] flex items-center hover:text-[#111] transition-colors duration-200"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 bg-[#111111] text-white border-none rounded-lg font-['DM_Sans'] text-sm font-medium tracking-[0.12em] uppercase cursor-pointer transition-all duration-200 mt-2 relative overflow-hidden hover:bg-[#2a2a2a] hover:shadow-[0_6px_20px_rgba(0,0,0,0.18)] active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Continue"}
            </button>
          </form>

          {/* <div className="flex items-center gap-3.5 my-7 text-[#ccc] text-xs tracking-[0.08em]">
            <div className="flex-1 h-px bg-[#e5e2de]"></div>
            <span>or</span>
            <div className="flex-1 h-px bg-[#e5e2de]"></div>
          </div> */}

          {/* <a
            href="#"
            className="w-full py-3 px-5 bg-transparent text-[#333] border border-[#ddd9d4] rounded-lg font-['DM_Sans'] text-sm font-normal cursor-pointer flex items-center justify-center gap-2.5 no-underline transition-all duration-200 hover:border-[#bbb] hover:bg-[#f9f8f7]"
            onClick={(e) => e.preventDefault()}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </a> */}

          <div className="mt-9 text-sm text-[#888] text-center">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-[#111] font-medium no-underline border-b border-[#111]/25 hover:border-[#111] transition-colors duration-200"
            >
              Create one
            </Link>
            {" · "}
            
          </div>
        </div>
      </div>

      {/* Custom keyframes */}
      <style>{`
        @keyframes errorIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}