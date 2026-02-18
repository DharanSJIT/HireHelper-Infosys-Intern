import React, { useState, useEffect } from 'react';
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
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        // Compress image before upload
        const img = new Image();
        img.src = reader.result;
        img.onload = async () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
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
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3b82f6]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header Card */}
      <div className="bg-gradient-to-br from-[#3b82f6] to-[#2a2a2a] rounded-xl shadow-lg p-8 text-white relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full border border-white/10"></div>
        <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full border border-white/10"></div>
        
        <div className="relative z-10 flex items-center gap-6">
          <div className="relative group">
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt="Profile"
                className="w-24 h-24 rounded-2xl object-cover border-2 border-white/20 shadow-xl"
              />
            ) : (
              <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white text-3xl font-semibold border border-white/20 shadow-xl">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </div>
            )}
            <label className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
              {uploading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              ) : (
                <svg viewBox="0 0 24 24" strokeWidth="2" className="w-6 h-6 stroke-white fill-none">
                  <path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </label>
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-['Playfair_Display'] font-semibold mb-2">
              {user?.first_name} {user?.last_name}
            </h2>
            <p className="text-white/70 text-sm mb-3">{user?.email_id}</p>
            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${
              user?.isVerified 
                ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
            }`}>
              <svg viewBox="0 0 24 24" strokeWidth="2" className="w-4 h-4 stroke-current fill-none">
                {user?.isVerified ? (
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                ) : (
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                )}
              </svg>
              {user?.isVerified ? 'Verified Account' : 'Pending Verification'}
            </span>
          </div>
        </div>
      </div>

      {/* Profile Information Card */}
      <div className="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden">
        <div className="border-b border-blue-100 px-8 py-5">
          <h3 className="text-lg font-semibold text-gray-900 tracking-tight">Profile Information</h3>
          <p className="text-sm text-[#666] mt-1">Your personal details and account information</p>
        </div>
        
        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] font-medium tracking-[0.14em] uppercase text-[#555] mb-2.5">
                First Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={user?.first_name || ''}
                  readOnly
                  className="w-full px-4 py-3.5 font-['DM_Sans'] text-base text-gray-900 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-lg outline-none cursor-not-allowed"
                />
                <svg viewBox="0 0 24 24" strokeWidth="1.5" className="w-5 h-5 stroke-[#999] fill-none absolute right-4 top-1/2 -translate-y-1/2">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium tracking-[0.14em] uppercase text-[#555] mb-2.5">
                Last Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={user?.last_name || ''}
                  readOnly
                  className="w-full px-4 py-3.5 font-['DM_Sans'] text-base text-gray-900 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-lg outline-none cursor-not-allowed"
                />
                <svg viewBox="0 0 24 24" strokeWidth="1.5" className="w-5 h-5 stroke-[#999] fill-none absolute right-4 top-1/2 -translate-y-1/2">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-[11px] font-medium tracking-[0.14em] uppercase text-[#555] mb-2.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={user?.email_id || ''}
                  readOnly
                  className="w-full px-4 py-3.5 font-['DM_Sans'] text-base text-gray-900 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-lg outline-none cursor-not-allowed"
                />
                <svg viewBox="0 0 24 24" strokeWidth="1.5" className="w-5 h-5 stroke-[#999] fill-none absolute right-4 top-1/2 -translate-y-1/2">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Stats Card */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" strokeWidth="1.5" className="w-6 h-6 stroke-blue-600 fill-none">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">0</p>
              <p className="text-sm text-[#666]">Tasks Posted</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" strokeWidth="1.5" className="w-6 h-6 stroke-green-600 fill-none">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">0</p>
              <p className="text-sm text-[#666]">Completed</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" strokeWidth="1.5" className="w-6 h-6 stroke-purple-600 fill-none">
                <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">0</p>
              <p className="text-sm text-[#666]">Requests</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
