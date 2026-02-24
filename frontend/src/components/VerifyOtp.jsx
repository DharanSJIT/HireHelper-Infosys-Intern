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
      setError('Please enter the verification code.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { data } = await verifyOtp({ email_id: email, otp });
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please check your code.');
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
      setSuccess('A new OTP has been sent to your email.');
      setCountdown(60);
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[440px]">

        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 bg-blue-600 rounded-xl items-center justify-center mb-4">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" className="w-6 h-6 stroke-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Verify your email</h1>
          <p className="text-sm text-slate-500 mt-1">
            Enter the 6-digit code sent to{' '}
            {email ? <span className="font-semibold text-slate-700">{email}</span> : 'your email'}
          </p>
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

          <form onSubmit={handleVerify} className="space-y-4">
            <div className="input-group">
              <label htmlFor="otp-code" className="input-label">Verification Code</label>
              <input
                id="otp-code"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="input-field text-center text-xl font-bold tracking-[0.4em] py-3"
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
                  Verifying…
                </>
              ) : 'Verify Code'}
            </button>
          </form>

          <div className="divider my-5" />

          <p className="text-center text-sm text-slate-500">
            Didn&apos;t receive the code?{' '}
            {countdown > 0 ? (
              <span className="font-semibold text-slate-400">Resend in {countdown}s</span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-150 disabled:opacity-50 cursor-pointer"
              >
                {resending ? 'Sending…' : 'Resend Code'}
              </button>
            )}
          </p>
        </div>

      </div>
    </div>
  );
}
