import React, { useEffect, useState } from 'react';
import { getProfile, updateProfilePicture } from '../config/api';

function StatCard({ value, label, colorClass = 'text-slate-900' }) {
  return (
    <div className="stat-card flex flex-col gap-1">
      <p className={`stat-value ${colorClass}`}>{value}</p>
      <p className="stat-label">{label}</p>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="data-row">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      <p className="text-sm font-medium text-slate-900">{value || '—'}</p>
    </div>
  );
}

export default function Settings() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await getProfile();
      setUser(data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be smaller than 5MB');
      return;
    }
    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const img = new Image();
        img.src = reader.result;
        img.onload = async () => {
          const canvas = document.createElement('canvas');
          const MAX = 800;
          let { width, height } = img;
          if (width > height && width > MAX) { height *= MAX / width; width = MAX; }
          if (height >= width && height > MAX) { width *= MAX / height; height = MAX; }
          canvas.width = width;
          canvas.height = height;
          canvas.getContext('2d').drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.7);
          try {
            const { data } = await updateProfilePicture({ profilePicture: compressed });
            setUser(data);
          } catch (err) {
            console.error('Upload failed:', err);
            alert('Failed to upload image.');
          } finally {
            setUploading(false);
          }
        };
      } catch {
        alert('Failed to process image.');
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-5">
        <div className="surface-card p-6 flex items-center gap-5">
          <div className="skeleton w-20 h-20 rounded-xl" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-5 w-1/3" />
            <div className="skeleton h-3 w-1/4" />
            <div className="skeleton h-7 w-32 rounded-lg mt-1" />
          </div>
        </div>
        <div className="surface-card p-6 space-y-3">
          <div className="skeleton h-4 w-1/5" />
          <div className="skeleton h-3 w-full" />
          <div className="skeleton h-3 w-4/5" />
        </div>
      </div>
    );
  }

  const initials = `${user?.first_name?.[0] || ''}${user?.last_name?.[0] || ''}`;

  return (
    <div className="max-w-4xl mx-auto space-y-5">

      {/* ── Page Header ──────────────────────────────────────── */}
      <div className="surface-card p-5 md:p-6">
        <h2 className="page-title">Account Settings</h2>
        <p className="text-sm text-slate-500 mt-0.5">Manage your profile, photo, and account details.</p>
      </div>

      {/* ── Profile Identity ─────────────────────────────────── */}
      <div className="surface-card p-5 md:p-6">
        <p className="section-label mb-4">Profile</p>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">

          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt="Profile"
                className="w-20 h-20 rounded-xl object-cover border border-slate-200"
              />
            ) : (
              <div className="w-20 h-20 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-bold tracking-wide">
                {initials || 'U'}
              </div>
            )}
            {/* Upload Overlay */}
            <label
              htmlFor="avatar-upload"
              className="absolute -bottom-2 -right-2 w-7 h-7 bg-white border border-slate-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-slate-400 transition-colors duration-150"
              title="Change photo"
            >
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" className="w-3.5 h-3.5 stroke-slate-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
              </svg>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="sr-only"
              />
            </label>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-slate-900">
              {user?.first_name} {user?.last_name}
            </h3>
            <p className="text-sm text-slate-500 mt-0.5">{user?.email_id}</p>

            <div className="flex items-center flex-wrap gap-2 mt-3">
              {/* Verification badge */}
              <span className={`badge ${user?.isVerified ? 'badge-green' : 'badge-amber'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${user?.isVerified ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                {user?.isVerified ? 'Verified Account' : 'Pending Verification'}
              </span>

              {/* Upload button */}
              <label
                htmlFor="avatar-upload-2"
                className="btn-secondary text-xs px-3 py-1.5 cursor-pointer"
              >
                {uploading ? (
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Uploading...
                  </span>
                ) : 'Change Photo'}
                <input
                  id="avatar-upload-2"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="sr-only"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* ── Profile Information ───────────────────────────────── */}
      <div className="surface-card overflow-hidden">
        <div className="px-5 md:px-6 py-4 border-b border-slate-200 flex items-center gap-2">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" className="w-4 h-4 stroke-slate-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
          <h3 className="text-sm font-bold text-slate-900">Profile Information</h3>
        </div>

        <div className="px-5 md:px-6 py-2">
          <InfoRow label="First Name" value={user?.first_name} />
          <InfoRow label="Last Name" value={user?.last_name} />
          <InfoRow label="Email Address" value={user?.email_id} />
          {user?.phone_number && <InfoRow label="Phone Number" value={user.phone_number} />}
          <InfoRow label="Account Status" value={user?.isVerified ? 'Verified' : 'Pending Verification'} />
        </div>
      </div>

      {/* ── Activity Summary ─────────────────────────────────── */}
      <div>
        <p className="section-label px-1 mb-3">Activity Summary</p>
        <div className="grid grid-cols-3 gap-3">
          <StatCard value="0" label="Tasks Posted" colorClass="text-blue-700" />
          <StatCard value="0" label="Completed" colorClass="text-emerald-700" />
          <StatCard value="0" label="Requests Sent" colorClass="text-amber-700" />
        </div>
      </div>
    </div>
  );
}
