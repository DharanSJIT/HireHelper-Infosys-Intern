import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../config/api';

function EyeIcon({ open }) {
  return open ? (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" className="w-4 h-4 stroke-current">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" className="w-4 h-4 stroke-current">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );
}

const passwordRules = [
  { id: 'len', label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { id: 'upper', label: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { id: 'lower', label: 'One lowercase letter', test: (p) => /[a-z]/.test(p) },
  { id: 'num', label: 'One number', test: (p) => /[0-9]/.test(p) },
  { id: 'sym', label: 'One special character', test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

export default function Signup() {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e) => {

    e.preventDefault();
    setError('');

    if (!firstName || !lastName || !phoneNumber || !email || !password || !confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!/^[0-9]{10}$/.test(phoneNumber)) {
      setError('Phone number must be exactly 10 digits.');
      return;
    }

    const failedRule = passwordRules.find((r) => !r.test(password));
    if (failedRule) {
      setError(`Password: ${failedRule.label.toLowerCase()}`);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {

      await register({
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        email_id: email,
        password
      });

      navigate('/verify-otp', { state: { email } });

    } catch (err) {

      setError(err.response?.data?.message || 'Registration failed. Please try again.');

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen auth-shell flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[640px] auth-card overflow-hidden">
        <section className="px-6 py-8 sm:px-10 sm:py-10 bg-white">
          <div className="max-w-xl mx-auto">
            <div className="mb-6">
              <div className="inline-flex w-11 h-11 bg-blue-600 rounded-xl items-center justify-center mb-4 shadow-[0_10px_20px_-12px_rgba(37,99,235,0.9)]">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" className="w-5 h-5 stroke-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create your account</h1>
              <p className="text-sm text-slate-500 mt-1.5">Join the HireHelper platform for free</p>
            </div>

            {error && <div className="alert-error mb-5">{error}</div>}

            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="input-group">
                  <label className="input-label">First Name *</label>
                  <input
                    type="text"
                    placeholder="First"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Last Name *</label>
                  <input
                    type="text"
                    placeholder="Last"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Email Address *</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="input-group">
                <label className="input-label">Phone Number *</label>
                <input
                  type="tel"
                  placeholder="0123456789"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="input-group">
                <label className="input-label">Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pr-11"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
                {passwordRules.map((rule) => {
                  const passed = rule.test(password);
                  return (
                    <div key={rule.id} className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${passed ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                      <span className={`text-xs ${passed ? 'text-emerald-700 font-medium' : 'text-slate-500'}`}>
                        {rule.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="input-group">
                <label className="input-label">Confirm Password *</label>

                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Repeat your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-field pr-11"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    <EyeIcon open={showConfirmPassword} />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 mt-1"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
