import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword } from '../config/api';

export default function ForgotPassword() {
  const [email, setEmail]     = useState('');
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!email) { setError('Please enter your email address.'); return; }
    setLoading(true);
    try {
      await forgotPassword({ email_id: email });
      setSuccess('OTP sent! Check your inbox. Redirecting...');
      setTimeout(() => navigate('/reset-password', { state: { email } }), 1800);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[440px] page-enter">

        {/* Icon */}
        <div className="flex justify-center mb-7">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center" style={{ boxShadow: 'var(--shadow-md)' }}>
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" className="w-8 h-8 stroke-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Forgot your password?</h1>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed max-w-xs mx-auto">
            No worries. Enter your registered email and we&apos;ll send you a reset code.
          </p>
        </div>

        {/* Card */}
        <div className="surface-card px-7 py-7 space-y-5">

          {error && (
            <div className="alert-error">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" className="w-4 h-4 flex-shrink-0 stroke-red-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="alert-success">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" className="w-4 h-4 flex-shrink-0 stroke-emerald-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="input-group">
              <label htmlFor="forgot-email" className="input-label">Email Address</label>
              <div className="relative">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 stroke-slate-400 pointer-events-none">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <input
                  id="forgot-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-[15px]"
            >
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" />
                  </svg>
                  Sending reset code...
                </span>
              ) : 'Send Reset Code →'}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Remember your password?{' '}
          <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
            Back to Sign In
          </Link>
        </p>

      </div>
    </div>
  );
}
