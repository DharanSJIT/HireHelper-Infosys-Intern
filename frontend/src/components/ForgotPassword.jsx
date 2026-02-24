import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword } from '../config/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    setLoading(true);
    try {
      await forgotPassword({ email_id: email });
      setSuccess('OTP sent! Redirecting…');
      setTimeout(() => navigate('/reset-password', { state: { email } }), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[440px]">

        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 bg-blue-600 rounded-xl items-center justify-center mb-4">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" className="w-6 h-6 stroke-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Forgot your password?</h1>
          <p className="text-sm text-slate-500 mt-1">Enter your email and we'll send you a reset code.</p>
        </div>

        {/* Card */}
        <div className="surface-card px-7 py-8">

          {error && (
            <div className="alert-error mb-5">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" className="w-4 h-4 stroke-red-600 flex-shrink-0 mt-0.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              {error}
            </div>
          )}

          {success && (
            <div className="alert-success mb-5">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" className="w-4 h-4 stroke-emerald-600 flex-shrink-0 mt-0.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="input-group">
              <label htmlFor="forgot-email" className="input-label">Email Address</label>
              <input
                id="forgot-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 mt-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Sending OTP…
                </>
              ) : 'Send Reset Code'}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-sm text-slate-500">
          Remember your password?{' '}
          <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-150">
            Back to Sign In
          </Link>
        </p>

      </div>
    </div>
  );
}
