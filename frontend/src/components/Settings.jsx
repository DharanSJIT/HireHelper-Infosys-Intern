import React, { useEffect, useState } from 'react';
import { getProfile, updateProfilePicture } from '../config/api';

export default function Settings() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

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
      alert('Image size should be less than 5MB');
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
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height && width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }

          if (height >= width && height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const compressedImage = canvas.toDataURL('image/jpeg', 0.7);

          try {
            const { data } = await updateProfilePicture({ profilePicture: compressedImage });
            setUser(data);
          } catch (error) {
            console.error('Failed to upload image:', error);
            alert('Failed to upload image');
          } finally {
            setUploading(false);
          }
        };
      } catch (error) {
        console.error('Failed to process image:', error);
        alert('Failed to process image');
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl border border-blue-100 p-8 flex items-center justify-center text-sm text-slate-600">
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white rounded-xl border border-blue-100 p-6">
        <h2 className="text-2xl font-semibold text-slate-900">Account Settings</h2>
        <p className="text-sm text-slate-600 mt-1">Manage your profile details and account status.</p>
      </div>

      <div className="bg-white rounded-xl border border-blue-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-5">
          <div className="w-24 h-24">
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt="Profile" className="w-24 h-24 rounded-xl object-cover border border-blue-100" />
            ) : (
              <div className="w-24 h-24 bg-blue-50 rounded-xl flex items-center justify-center text-blue-700 text-2xl font-semibold border border-blue-100">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </div>
            )}
          </div>

          <div className="flex-1">
            <h3 className="text-xl font-semibold text-slate-900">{user?.first_name} {user?.last_name}</h3>
            <p className="text-sm text-slate-600 mt-1">{user?.email_id}</p>
            <label className="inline-flex items-center mt-3 px-3 py-1.5 rounded-lg border border-blue-200 text-xs font-medium text-blue-700 cursor-pointer hover:bg-blue-50">
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
              {uploading ? 'Uploading...' : 'Change Profile Photo'}
            </label>
            <span className={`inline-flex items-center mt-3 px-3 py-1 rounded-full text-xs font-medium border ${
              user?.isVerified ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              {user?.isVerified ? 'Verified Account' : 'Pending Verification'}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-blue-100 overflow-hidden">
        <div className="border-b border-blue-100 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-900">Profile Information</h3>
        </div>
        <div className="p-6 grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-slate-500 mb-2">First Name</label>
            <input type="text" value={user?.first_name || ''} readOnly className="w-full px-3 py-2.5 text-sm text-slate-900 bg-slate-50 border border-blue-100 rounded-lg" />
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-slate-500 mb-2">Last Name</label>
            <input type="text" value={user?.last_name || ''} readOnly className="w-full px-3 py-2.5 text-sm text-slate-900 bg-slate-50 border border-blue-100 rounded-lg" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium uppercase tracking-wide text-slate-500 mb-2">Email Address</label>
            <input type="email" value={user?.email_id || ''} readOnly className="w-full px-3 py-2.5 text-sm text-slate-900 bg-slate-50 border border-blue-100 rounded-lg" />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-blue-100 p-5">
          <p className="text-2xl font-semibold text-slate-900">0</p>
          <p className="text-sm text-slate-600">Tasks Posted</p>
        </div>
        <div className="bg-white rounded-xl border border-blue-100 p-5">
          <p className="text-2xl font-semibold text-slate-900">0</p>
          <p className="text-sm text-slate-600">Completed</p>
        </div>
        <div className="bg-white rounded-xl border border-blue-100 p-5">
          <p className="text-2xl font-semibold text-slate-900">0</p>
          <p className="text-sm text-slate-600">Requests</p>
        </div>
      </div>
    </div>
  );
}
