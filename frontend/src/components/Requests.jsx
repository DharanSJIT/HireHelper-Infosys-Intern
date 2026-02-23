import React from 'react';
import { Link } from 'react-router-dom';

export default function Requests() {
  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <section className="surface-card p-6">
        <h2 className="section-head">Incoming Requests</h2>
        <p className="section-sub mt-1">Review helper requests for tasks you created.</p>
      </section>

      <section className="surface-card p-5 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-lg border border-blue-100 p-4">
            <p className="text-xs text-slate-500">Pending</p>
            <p className="text-2xl font-semibold text-slate-900">0</p>
          </div>
          <div className="rounded-lg border border-emerald-200 p-4">
            <p className="text-xs text-emerald-700">Accepted</p>
            <p className="text-2xl font-semibold text-emerald-700">0</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-4">
            <p className="text-xs text-slate-600">Rejected</p>
            <p className="text-2xl font-semibold text-slate-700">0</p>
          </div>
        </div>
      </section>

      <section className="surface-card p-8 text-center">
        <h3 className="text-lg font-semibold text-slate-900">No requests yet</h3>
        <p className="text-sm text-slate-600 mt-2">Once helpers request your tasks, they will appear here for approval.</p>
        <Link to="/dashboard/add-task" className="btn-primary mt-5">Post a New Task</Link>
      </section>
    </div>
  );
}
