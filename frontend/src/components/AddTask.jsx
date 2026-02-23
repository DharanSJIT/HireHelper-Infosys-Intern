import React, { useMemo, useState } from 'react';
import { createTask } from '../config/api';

const CATEGORIES = ['General', 'Moving', 'Cleaning', 'Repairs', 'Delivery', 'Other'];

const initialForm = {
  title: '',
  description: '',
  location: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  category: 'General',
};

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function FieldLabel({ htmlFor, children, optional }) {
  return (
    <label htmlFor={htmlFor} className="input-label">
      {children}
      {optional && <span className="normal-case font-normal text-slate-400 ml-1">(optional)</span>}
    </label>
  );
}

export default function AddTask() {
  const [form, setForm] = useState(initialForm);
  const [pictureFile, setPictureFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const minStartDate = useMemo(() => new Date().toISOString().split('T')[0], []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.title || !form.description || !form.location || !form.startDate || !form.startTime) {
      setError('Please fill in all required fields.');
      return;
    }

    if ((form.endDate && !form.endTime) || (!form.endDate && form.endTime)) {
      setError('End date and end time must be set together.');
      return;
    }

    const startsAt = new Date(`${form.startDate}T${form.startTime}`);
    if (Number.isNaN(startsAt.getTime())) {
      setError('Start date or time is invalid.');
      return;
    }

    if (form.endDate && form.endTime) {
      const endsAt = new Date(`${form.endDate}T${form.endTime}`);
      if (Number.isNaN(endsAt.getTime()) || endsAt <= startsAt) {
        setError('End date/time must be after start date/time.');
        return;
      }
    }

    setSubmitting(true);
    try {
      let picture = '';
      if (pictureFile) picture = await fileToBase64(pictureFile);
      await createTask({ ...form, picture });
      setSuccess('Task created successfully. Helpers can now find and request it.');
      setForm(initialForm);
      setPictureFile(null);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to create task.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5">

      {/* Page Header */}
      <div className="surface-card p-5 md:p-6">
        <h2 className="page-title">Post a Task</h2>
        <p className="text-sm text-slate-500 mt-0.5">Describe what you need done and helpers will send requests.</p>
      </div>

      {/* Form Card */}
      <div className="surface-card p-5 md:p-7">

        {/* Error / Success */}
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

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ── Section: Basic Info ──────────────────────────── */}
          <div>
            <p className="section-label">Basic Information</p>
            <div className="space-y-4">
              <div className="input-group">
                <FieldLabel htmlFor="title">Task Title *</FieldLabel>
                <input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Help move a sofa to the 3rd floor"
                  maxLength={120}
                  className="input-field"
                />
                <p className="text-[11px] text-slate-400 mt-0.5 text-right">{form.title.length}/120</p>
              </div>

              <div className="input-group">
                <FieldLabel htmlFor="description">Description *</FieldLabel>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe the work in detail — include any important notes, requirements, or tools needed."
                  rows={4}
                  className="input-field resize-none"
                />
              </div>
            </div>
          </div>

          {/* ── Section: Location & Category ─────────────────── */}
          <div>
            <p className="section-label">Location &amp; Category</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="input-group">
                <FieldLabel htmlFor="location">Location *</FieldLabel>
                <div className="relative">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" className="w-4 h-4 stroke-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <input
                    id="location"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="City / neighbourhood"
                    className="input-field pl-9"
                  />
                </div>
              </div>

              <div className="input-group">
                <FieldLabel htmlFor="category">Category *</FieldLabel>
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="input-field"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ── Section: Schedule ─────────────────────────────── */}
          <div>
            <p className="section-label">Schedule</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="input-group">
                <FieldLabel htmlFor="startDate">Start Date *</FieldLabel>
                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={handleChange}
                  min={minStartDate}
                  className="input-field"
                />
              </div>
              <div className="input-group">
                <FieldLabel htmlFor="startTime">Start Time *</FieldLabel>
                <input
                  id="startTime"
                  name="startTime"
                  type="time"
                  value={form.startTime}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              <div className="input-group">
                <FieldLabel htmlFor="endDate" optional>End Date</FieldLabel>
                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={form.endDate}
                  onChange={handleChange}
                  min={form.startDate || minStartDate}
                  className="input-field"
                />
              </div>
              <div className="input-group">
                <FieldLabel htmlFor="endTime" optional>End Time</FieldLabel>
                <input
                  id="endTime"
                  name="endTime"
                  type="time"
                  value={form.endTime}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* ── Section: Picture ──────────────────────────────── */}
          <div>
            <p className="section-label">Proof / Reference Image</p>
            <div className="form-section">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center flex-shrink-0 overflow-hidden bg-white">
                  {pictureFile ? (
                    <img
                      src={URL.createObjectURL(pictureFile)}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" className="w-6 h-6 stroke-slate-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <label
                    htmlFor="picture"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 cursor-pointer hover:bg-slate-50 hover:border-slate-400 transition-colors duration-150"
                  >
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" className="w-4 h-4 stroke-current">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    {pictureFile ? 'Change Image' : 'Upload Image'}
                  </label>
                  <input
                    id="picture"
                    name="picture"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPictureFile(e.target.files?.[0] || null)}
                    className="sr-only"
                  />
                  {pictureFile ? (
                    <p className="text-xs text-slate-600 mt-1.5 truncate">{pictureFile.name}</p>
                  ) : (
                    <p className="text-xs text-slate-400 mt-1.5">PNG, JPG up to 5MB</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Actions ───────────────────────────────────────── */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary px-6 py-2.5"
            >
              {submitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating Task...
                </>
              ) : 'Create Task'}
            </button>
            <button
              type="button"
              onClick={() => { setForm(initialForm); setPictureFile(null); setError(''); setSuccess(''); }}
              className="btn-ghost px-4 py-2.5"
            >
              Clear Form
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
