import React from 'react';
import { Link } from 'react-router-dom';

export default function Requests() {
  return (
    <div className="max-w-5xl mx-auto space-y-5">

      {/* Page Header */}
      <div className="surface-card p-5 md:p-6">
        <h2 className="page-title">Incoming Requests</h2>
        <p className="text-sm text-slate-500 mt-0.5">Review and manage helpers who have requested your tasks.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="stat-card border-l-4 border-l-amber-400">
          <p className="stat-value text-amber-700">0</p>
          <p className="stat-label">Pending Review</p>
        </div>
        <div className="stat-card border-l-4 border-l-emerald-500">
          <p className="stat-value text-emerald-700">0</p>
          <p className="stat-label">Accepted</p>
        </div>
        <div className="stat-card border-l-4 border-l-slate-300">
          <p className="stat-value text-slate-600">0</p>
          <p className="stat-label">Rejected</p>
        </div>
      </div>

      {/* Empty State */}
      <div className="surface-card">
        <div className="empty-state">
          <div className="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" className="w-7 h-7 stroke-slate-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-slate-900">No requests yet</h3>
          <p className="text-sm text-slate-500 mt-1.5 max-w-xs leading-relaxed">
            Once helpers discover and request your tasks, they will appear here for your review.
          </p>
          <Link to="/dashboard/add-task" className="btn-primary text-sm mt-5 px-5 py-2.5">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" className="w-4 h-4 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Post a New Task
          </Link>
        </div>
      </div>

    </div>
  );
}
