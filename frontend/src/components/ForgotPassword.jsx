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
      setSuccess('OTP sent to your email.');
      setTimeout(() => navigate('/reset-password', { state: { email } }), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="bg-white border border-blue-100 rounded-2xl w-full max-w-[460px] px-8 py-9">
        <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-5 mx-auto">
          <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2z" />
          </svg>
        </div>

        <h1 className="text-2xl font-semibold text-slate-900 text-center">Forgot Password?</h1>
        <p className="text-sm text-slate-600 text-center mt-1 mb-6">Enter your email to receive a reset OTP.</p>

        {error && <div className="w-full bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4 text-sm text-red-700">{error}</div>}
        {success && <div className="w-full bg-green-50 border border-green-200 rounded-lg px-3 py-2 mb-4 text-sm text-green-700">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Email address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-3 py-3 text-sm border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            />
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg disabled:opacity-50">
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>

        <Link to="/login" className="w-full mt-4 block text-center py-3 border border-blue-200 rounded-lg text-sm font-medium text-blue-700 hover:bg-blue-50">Back to Sign In</Link>
      </div>
    </div>
  );
}
