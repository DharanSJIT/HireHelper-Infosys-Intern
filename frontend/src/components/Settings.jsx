import React, { useEffect, useState } from 'react';
import { getProfile, updateProfilePicture } from '../config/api';
import { 
  Camera, 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  CheckCircle2, 
  Loader2,
  Activity,
  ListTodo,
  CheckSquare,
  Send,
  UserCircle2,
  AlertCircle
} from 'lucide-react';

function StatCard({ icon, value, label, iconColorClass = 'text-blue-500', bgClass = 'bg-blue-50' }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col items-start gap-4 shadow-sm hover:shadow-md transition-shadow duration-200 group">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgClass} ${iconColorClass} shadow-sm group-hover:scale-105 transition-transform duration-300`}>
        {icon}
      </div>
      <div>
        <p className="text-3xl font-bold tracking-tight text-slate-900">{value}</p>
        <p className="text-[13px] font-bold uppercase tracking-wider text-slate-500 mt-1">{label}</p>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start md:items-center justify-between py-4 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors px-2 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
          {icon}
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
          <p className="text-[15px] font-semibold text-slate-800 mt-0.5">{value || 'Not provided'}</p>
        </div>
      </div>
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
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 flex items-center gap-6 shadow-sm">
          <div className="skeleton w-24 h-24 rounded-2xl" />
          <div className="flex-1 space-y-3">
            <div className="skeleton h-6 w-1/3 rounded-md" />
            <div className="skeleton h-4 w-1/4 rounded-sm" />
            <div className="skeleton h-8 w-32 rounded-lg mt-4" />
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-4 shadow-sm">
          <div className="skeleton h-5 w-1/4 rounded-md mb-6" />
          <div className="skeleton h-12 w-full rounded-lg" />
          <div className="skeleton h-12 w-full rounded-lg" />
          <div className="skeleton h-12 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  const initials = `${user?.first_name?.[0] || ''}${user?.last_name?.[0] || ''}`.toUpperCase();

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">

      {/* ── Page Header ──────────────────────────────────────── */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Account Settings</h2>
        <p className="text-[15px] text-slate-500 mt-1 max-w-xl leading-relaxed">Manage your personal profile, update your photo, and view your activity summary.</p>
      </div>

      {/* ── Profile Identity ─────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-6">Profile Card</h3>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 md:gap-8 bg-slate-50/50 rounded-2xl p-6 border border-slate-100 shadow-inner">

          {/* Avatar */}
          <div className="relative flex-shrink-0 group cursor-pointer">
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt="Profile"
                className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-md group-hover:shadow-lg transition-transform duration-300 group-hover:scale-[1.02]"
              />
            ) : (
              <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black tracking-wide border-4 border-white shadow-md group-hover:shadow-lg transition-transform duration-300 group-hover:scale-[1.02]">
                {initials || <UserCircle2 className="w-12 h-12 text-white/80" />}
              </div>
            )}
            
            {/* Upload Overlay */}
            <label
              htmlFor="avatar-upload"
              className="absolute -bottom-2 -right-2 w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center cursor-pointer shadow-md hover:bg-slate-50 hover:border-blue-400 hover:text-blue-600 transition-all duration-200 z-10"
              title="Change photo"
            >
              <Camera className="w-5 h-5 text-slate-500 hover:text-blue-600 transition-colors" />
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
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {user?.first_name} {user?.last_name}
            </h3>
            <p className="text-[15px] font-medium text-slate-500 mt-1">{user?.email_id}</p>

            <div className="flex items-center flex-wrap gap-3 mt-4">
              {/* Verification badge */}
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-wide shadow-sm
                ${user?.isVerified 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-emerald-100' 
                  : 'bg-amber-50 text-amber-700 border-amber-200 shadow-amber-100'}`}>
                {user?.isVerified ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                )}
                {user?.isVerified ? 'Verified Account' : 'Action Required'}
              </div>

              {/* Upload button */}
              <label
                htmlFor="avatar-upload-2"
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm font-bold shadow-sm cursor-pointer hover:bg-slate-50 hover:border-slate-400 hover:text-slate-900 transition-all duration-200"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4 text-slate-500" />
                    Change Photo
                  </>
                )}
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ── Profile Information ───────────────────────────────── */}
        <div className="lg:col-span-12">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 md:px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shadow-inner">
                <User className="w-4 h-4" />
              </div>
              <h3 className="text-[15px] font-bold text-slate-900 tracking-tight">Personal Information</h3>
            </div>

            <div className="p-4 md:p-6 lg:p-8 bg-white grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
              <InfoRow icon={<User className="w-4 h-4" />} label="First Name" value={user?.first_name} />
              <InfoRow icon={<User className="w-4 h-4" />} label="Last Name" value={user?.last_name} />
              <InfoRow icon={<Mail className="w-4 h-4" />} label="Email Address" value={user?.email_id} />
              <InfoRow icon={<Phone className="w-4 h-4" />} label="Phone Number" value={user?.phone_number} />
              <div className="md:col-span-2">
                <InfoRow 
                  icon={<ShieldCheck className={`w-4 h-4 ${user?.isVerified ? 'text-emerald-500' : 'text-amber-500'}`} />} 
                  label="Account Status" 
                  value={user?.isVerified ? 'Verified' : 'Pending Verification'} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Activity Summary ─────────────────────────────────── */}
        <div className="lg:col-span-12">
          <div className="flex items-center gap-3 mb-5 px-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-inner">
              <Activity className="w-4 h-4" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Activity Summary</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <StatCard 
              icon={<ListTodo className="w-6 h-6" />} 
              value="0" 
              label="Tasks Posted" 
              iconColorClass="text-blue-600" 
              bgClass="bg-blue-50"
            />
            <StatCard 
              icon={<CheckSquare className="w-6 h-6" />} 
              value="0" 
              label="Tasks Completed" 
              iconColorClass="text-emerald-600" 
              bgClass="bg-emerald-50"
            />
            <StatCard 
              icon={<Send className="w-6 h-6" />} 
              value="0" 
              label="Requests Sent" 
              iconColorClass="text-indigo-600" 
              bgClass="bg-indigo-50"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
