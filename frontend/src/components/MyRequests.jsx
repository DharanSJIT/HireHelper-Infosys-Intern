import React from 'react';
import { Link } from 'react-router-dom';

export default function MyRequests() {
  return (
    <div className="max-w-5xl mx-auto space-y-5">

      {/* Page Header */}
      <div className="surface-card p-5 md:p-6">
        <h2 className="page-title">My Sent Requests</h2>
        <p className="text-sm text-slate-500 mt-0.5">Track all task requests you have submitted and their current status.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="stat-card border-l-4 border-l-blue-500">
          <p className="stat-value text-blue-700">0</p>
          <p className="stat-label">Total Requests</p>
        </div>
        <div className="stat-card border-l-4 border-l-amber-400">
          <p className="stat-value text-amber-700">0</p>
          <p className="stat-label">Pending</p>
        </div>
        <div className="stat-card border-l-4 border-l-emerald-500">
          <p className="stat-value text-emerald-700">0</p>
          <p className="stat-label">Accepted</p>
        </div>
      </div>

      {/* Empty State */}
      <div className="surface-card">
        <div className="empty-state">
          <div className="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" className="w-7 h-7 stroke-slate-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-slate-900">No requests sent yet</h3>
          <p className="text-sm text-slate-500 mt-1.5 max-w-xs leading-relaxed">
            Browse the task feed and request tasks that match your skills and availability.
          </p>
          <Link to="/dashboard/feed" className="btn-secondary text-sm mt-5 px-5 py-2.5">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" className="w-4 h-4 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2" />
            </svg>
            Browse Task Feed
          </Link>
        </div>
      </div>

    </div>
  );
}
