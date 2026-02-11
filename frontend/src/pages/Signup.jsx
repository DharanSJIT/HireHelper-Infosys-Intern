import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [focused, setFocused] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    console.log("Signup attempt:", { email, password });
    navigate("/");
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#F7F5F2] flex flex-col md:flex-row font-['DM_Sans'] text-[#1a1a1a]">

      {/* ── Left decorative panel ── */}
      <div className="w-full md:w-[45%] bg-[#111111] flex flex-col justify-between px-[52px] py-[56px] relative overflow-hidden min-h-[180px] md:min-h-0">
        {/* Decorative circles via pseudo-like divs */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full border border-white/[0.06] pointer-events-none" />
        <div className="absolute -bottom-[60px] -left-[60px] w-60 h-60 rounded-full border border-white/[0.05] pointer-events-none" />

        {/* Brand mark */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 border border-white/90 rounded-lg flex items-center justify-center" style={{ borderWidth: "1.5px" }}>
            <svg viewBox="0 0 24 24" strokeWidth="1.5" className="w-[18px] h-[18px] stroke-white fill-none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="font-['DM_Sans'] font-medium text-[15px] tracking-[0.12em] uppercase text-white/90">
            HireHelper
          </span>
        </div>

        {/* Tagline — hidden on mobile */}
        <div className="relative z-10 hidden md:block">
          <h2 className="font-['Playfair_Display'] font-normal text-[clamp(32px,3.5vw,46px)] leading-[1.18] text-white mb-5 tracking-[-0.01em]">
            Join our<br />
            <em className="italic text-white/50">community.</em>
          </h2>
          <div className="w-10 h-px bg-white/30 mb-5" />
          <p className="text-sm font-light text-white/[0.45] leading-[1.7] max-w-[280px]">
            Create your account and start your journey with professionals who value excellence and growth.
          </p>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-white/[0.20] tracking-[0.08em]">
          © 2025 HireHelper Inc. All rights reserved.
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col justify-center items-center px-7 py-10 md:px-12 md:py-[60px] overflow-y-auto">
        <div className="w-full max-w-[400px]">

          {/* Back link */}
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-[12.5px] font-medium tracking-[0.06em] uppercase text-[#888] no-underline mb-[52px] hover:text-[#111] transition-colors duration-200 group"
          >
            <svg
              viewBox="0 0 24 24"
              strokeWidth="2"
              className="w-3.5 h-3.5 stroke-current fill-none transition-transform duration-200 group-hover:-translate-x-[3px]"
            >
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back to home
          </Link>

          {/* Header */}
          <div className="mb-10">
            <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-[#999] mb-2.5">
              Get started
            </p>
            <h1 className="font-['Playfair_Display'] text-[36px] md:text-[36px] font-semibold text-[#111] tracking-[-0.02em] leading-[1.1]">
              Create account
            </h1>
          </div>

          {/* Error box */}
          {error && (
            <div className="flex items-center gap-2.5 bg-[#fff5f5] border border-[#ffd0d0] border-l-[3px] border-l-[#e53e3e] px-3.5 py-3 rounded-[6px] mb-6 text-[13.5px] text-[#c53030] animate-[errorIn_0.2s_ease]">
              <svg viewBox="0 0 24 24" strokeWidth="1.8" className="w-[15px] h-[15px] stroke-current fill-none flex-shrink-0">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSignup}>
            {/* Email */}
            <div className="mb-6">
              <label
                htmlFor="email"
                className={`block text-[11px] font-medium tracking-[0.14em] uppercase mb-2.5 transition-colors duration-200 ${
                  focused === "email" ? "text-[#111]" : "text-[#555]"
                }`}
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused("")}
                autoComplete="email"
                className="w-full px-4 py-[14px] font-['DM_Sans'] text-[15px] font-normal text-[#111] bg-white border border-[#e0ddd9] rounded-[6px] outline-none transition-all duration-200 placeholder:text-[#bbb] focus:border-[#111] focus:shadow-[0_0_0_3px_rgba(17,17,17,0.05)] appearance-none"
                style={{ borderWidth: "1.5px" }}
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <label
                htmlFor="password"
                className={`block text-[11px] font-medium tracking-[0.14em] uppercase mb-2.5 transition-colors duration-200 ${
                  focused === "password" ? "text-[#111]" : "text-[#555]"
                }`}
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused("")}
                  autoComplete="new-password"
                  className="w-full px-4 py-[14px] pr-12 font-['DM_Sans'] text-[15px] font-normal text-[#111] bg-white border border-[#e0ddd9] rounded-[6px] outline-none transition-all duration-200 placeholder:text-[#bbb] focus:border-[#111] focus:shadow-[0_0_0_3px_rgba(17,17,17,0.05)] appearance-none"
                  style={{ borderWidth: "1.5px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-1 text-[#999] flex items-center hover:text-[#111] transition-colors duration-200"
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" strokeWidth="1.8" className="w-[18px] h-[18px] stroke-current fill-none">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" strokeWidth="1.8" className="w-[18px] h-[18px] stroke-current fill-none">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className={`block text-[11px] font-medium tracking-[0.14em] uppercase mb-2.5 transition-colors duration-200 ${
                  focused === "confirmPassword" ? "text-[#111]" : "text-[#555]"
                }`}
              >
                Confirm password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={() => setFocused("confirmPassword")}
                  onBlur={() => setFocused("")}
                  autoComplete="new-password"
                  className="w-full px-4 py-[14px] pr-12 font-['DM_Sans'] text-[15px] font-normal text-[#111] bg-white border border-[#e0ddd9] rounded-[6px] outline-none transition-all duration-200 placeholder:text-[#bbb] focus:border-[#111] focus:shadow-[0_0_0_3px_rgba(17,17,17,0.05)] appearance-none"
                  style={{ borderWidth: "1.5px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-1 text-[#999] flex items-center hover:text-[#111] transition-colors duration-200"
                >
                  {showConfirmPassword ? (
                    <svg viewBox="0 0 24 24" strokeWidth="1.8" className="w-[18px] h-[18px] stroke-current fill-none">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" strokeWidth="1.8" className="w-[18px] h-[18px] stroke-current fill-none">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-[15px] px-6 mt-2 bg-[#111111] text-white border-none rounded-[6px] font-['DM_Sans'] text-[13.5px] font-medium tracking-[0.12em] uppercase cursor-pointer transition-all duration-200 hover:bg-[#2a2a2a] hover:shadow-[0_6px_20px_rgba(0,0,0,0.18)] active:scale-[0.99]"
            >
              Create Account
            </button>
          </form>

          {/* Footer */}
          <div className="mt-9 text-[13.5px] text-[#888] text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#111] font-medium no-underline border-b border-[#111]/25 hover:border-[#111] transition-colors duration-200"
            >
              Sign in
            </Link>
          </div>

        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes errorIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}