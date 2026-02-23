import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyOtp, resendOtp } from '../config/api';

export default function VerifyOtp() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError('Please enter OTP');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { data } = await verifyOtp({ email_id: email, otp });
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError('');
    setSuccess('');
    try {
      await resendOtp({ email_id: email });
      setSuccess('OTP resent successfully.');
      setCountdown(60);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="bg-white border border-blue-100 rounded-2xl w-full max-w-[460px] px-8 py-9">
        <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-5 mx-auto">
          <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
          </svg>
        </div>

        <h1 className="text-2xl font-semibold text-slate-900 text-center">Verify Your Email</h1>
        <p className="text-sm text-slate-600 text-center mt-1">Enter the 6-digit code sent to your email</p>
        {email ? <p className="text-sm text-slate-700 text-center mb-6 font-medium">{email}</p> : <div className="mb-6" />}

        {error && <div className="w-full bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4 text-sm text-red-700">{error}</div>}
        {success && <div className="w-full bg-green-50 border border-green-200 rounded-lg px-3 py-2 mb-4 text-sm text-green-700">{success}</div>}

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Verification Code</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="w-full mt-1 px-3 py-3 text-xl font-semibold text-slate-900 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-center tracking-[0.35em]"
            />
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg disabled:opacity-50">
            {loading ? 'Verifying...' : 'Verify Code'}
          </button>
        </form>

        <p className="mt-5 text-sm text-slate-600 text-center">
          Didn&apos;t receive the code?{' '}
          {countdown > 0 ? (
            <span className="text-slate-500 font-medium">Resend in {countdown}s</span>
          ) : (
            <button type="button" onClick={handleResend} disabled={resending} className="text-blue-600 font-medium hover:text-blue-700">
              {resending ? 'Sending...' : 'Resend'}
            </button>
          )}
        </p>
      </div>
    </div>
  );
}
