import { useEffect, useState } from "react";
import { getProfile, updateProfile, updateProfilePicture } from "../config/api";
import { Camera, User, Mail, Phone, Pencil, Check, X } from "lucide-react";

const Settings = () => {
  const [profile, setProfile] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError]     = useState("");

  const [form, setForm] = useState({
    first_name:   "",
    last_name:    "",
    email_id:     "",
    phone_number: "",
  });

  /* ─── Load ──────────────────────────────────────────────────── */
  const loadProfile = async () => {
    try {
      const res = await getProfile();
      setProfile(res.data.user);
      setForm({
        first_name:   res.data.user.first_name   || "",
        last_name:    res.data.user.last_name    || "",
        email_id:     res.data.user.email_id     || "",
        phone_number: res.data.user.phone_number || "",
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => { loadProfile(); }, []);

  /* ─── Input change ──────────────────────────────────────────── */
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  /* ─── Save ──────────────────────────────────────────────────── */
  const handleSave = async () => {
    setSaveLoading(true);
    setSaveError("");
    setSaveSuccess(false);
    try {
      const res = await updateProfile(form);
      setProfile(res.data.user);
      setEditMode(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setSaveError(err.response?.data?.message || "Failed to save changes.");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({
      first_name:   profile.first_name   || "",
      last_name:    profile.last_name    || "",
      email_id:     profile.email_id     || "",
      phone_number: profile.phone_number || "",
    });
    setEditMode(false);
    setSaveError("");
  };

  /* ─── Photo upload ──────────────────────────────────────────── */
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("profilePicture", file);
    try {
      await updateProfilePicture(formData);
      await loadProfile();
    } catch (err) {
      console.log(err);
    }
  };

  const fullName  = [profile.first_name, profile.last_name].filter(Boolean).join(" ") || "—";
  const initials  = [(profile.first_name || "")[0], (profile.last_name || "")[0]].filter(Boolean).join("").toUpperCase() || "U";

  const fields = [
    { id: "s-first",  name: "first_name",   label: "First Name",    icon: User,  type: "text",  placeholder: "First name" },
    { id: "s-last",   name: "last_name",     label: "Last Name",     icon: User,  type: "text",  placeholder: "Last name" },
    { id: "s-email",  name: "email_id",      label: "Email Address", icon: Mail,  type: "email", placeholder: "your@email.com", readOnly: true },
    { id: "s-phone",  name: "phone_number",  label: "Phone Number",  icon: Phone, type: "tel",   placeholder: "0123456789" },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 page-enter">

      {/* ── Page header ─────────────────────────────────────────── */}
      <div>
        <h1 className="section-head">Account Settings</h1>
        <p className="section-sub mt-1">Manage your profile, update your photo, and personalise your account.</p>
      </div>

      {/* ── Profile card ────────────────────────────────────────── */}
      <div className="surface-card p-6">
        <div className="flex items-center gap-5">

          {/* Avatar + upload */}
          <div className="relative flex-shrink-0">
            {profile.profilePicture ? (
              <img
                src={profile.profilePicture}
                alt={fullName}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-200"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center border-2 border-blue-700" style={{ boxShadow: 'var(--shadow-sm)' }}>
                <span className="text-white font-bold text-2xl">{initials}</span>
              </div>
            )}

            {/* Upload overlay button */}
            <label
              htmlFor="photo-upload"
              className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors"
              title="Change photo"
            >
              <Camera className="w-3.5 h-3.5 stroke-white" />
              <input id="photo-upload" type="file" accept="image/*" className="sr-only" onChange={handlePhotoUpload} />
            </label>
          </div>

          {/* Name / email / verified badge */}
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-slate-900 truncate">{fullName}</h2>
            <p className="text-sm text-slate-500 truncate mt-0.5">{profile.email_id || "—"}</p>
            <div className="flex items-center gap-2 mt-2.5 flex-wrap">
              <span className="badge-green px-3 py-1">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" className="w-3 h-3 stroke-emerald-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Verified Account
              </span>
              {profile.phone_number && (
                <span className="badge-blue px-3 py-1">
                  <Phone className="w-3 h-3" />
                  {profile.phone_number}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Success / Error feedback ─────────────────────────────── */}
      {saveSuccess && (
        <div className="alert-success">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" className="w-4 h-4 flex-shrink-0 stroke-emerald-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Changes saved successfully.</span>
        </div>
      )}
      {saveError && (
        <div className="alert-error">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" className="w-4 h-4 flex-shrink-0 stroke-red-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <span>{saveError}</span>
        </div>
      )}

      {/* ── Personal info form ───────────────────────────────────── */}
      <div className="surface-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[17px] font-bold text-slate-900">Personal Information</h2>
            <p className="text-xs text-slate-500 mt-0.5">Update your name and phone number.</p>
          </div>
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="btn-secondary text-sm px-4 py-2"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit Profile
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCancel}
                className="btn-ghost text-sm px-3 py-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saveLoading}
                className="btn-primary text-sm px-4 py-2"
              >
                {saveLoading ? (
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" />
                  </svg>
                ) : (
                  <Check className="w-4 h-4" />
                )}
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* Fields grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {fields.map((f) => {
            const Icon = f.icon;
            const isReadOnly = f.readOnly || !editMode;
            return (
              <div key={f.id} className="input-group">
                <label htmlFor={f.id} className="input-label">{f.label}</label>
                <div className="relative">
                  <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    id={f.id}
                    type={f.type}
                    name={f.name}
                    value={form[f.name]}
                    disabled={isReadOnly}
                    onChange={handleChange}
                    placeholder={f.placeholder}
                    className={`input-field pl-10 ${isReadOnly ? 'bg-slate-50 text-slate-500 cursor-default' : ''}`}
                  />
                </div>
                {f.readOnly && (
                  <p className="text-[11px] text-slate-400 mt-1">Email address cannot be changed.</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Account info strip ──────────────────────────────────── */}
      <div className="surface-card p-5">
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">Account Info</p>
        <div className="space-y-0 divide-y divide-slate-100">
          <div className="data-row">
            <span className="text-sm font-medium text-slate-600">Account type</span>
            <span className="badge-blue">Standard</span>
          </div>
          <div className="data-row">
            <span className="text-sm font-medium text-slate-600">Email verification</span>
            <span className="badge-green">Verified</span>
          </div>
          <div className="data-row">
            <span className="text-sm font-medium text-slate-600">Member since</span>
            <span className="text-sm text-slate-700 font-semibold">
              {profile.createdAt
                ? new Date(profile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
                : "—"}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Settings;
