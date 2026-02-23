import React, { useEffect, useMemo, useState } from 'react';
import { getMyTasks } from '../config/api';

function formatDate(dateValue) {
  if (!dateValue) return '-';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateTime(dateValue, timeValue) {
  const datePart = formatDate(dateValue);
  return `${datePart}${timeValue ? `, ${timeValue}` : ''}`;
}

function statusBadge(status) {
  if (status === 'open')      return 'badge-green';
  if (status === 'assigned')  return 'badge-amber';
  return 'badge-slate';
}

function statusDot(status) {
  if (status === 'open')      return 'bg-emerald-500';
  if (status === 'assigned')  return 'bg-amber-500';
  return 'bg-slate-400';
}

const SUMMARY_CONFIG = [
  { key: 'total',     label: 'Total Tasks',  colorClass: 'text-slate-900', borderClass: 'border-slate-200' },
  { key: 'open',      label: 'Open',         colorClass: 'text-emerald-700', borderClass: 'border-emerald-200' },
  { key: 'assigned',  label: 'Assigned',     colorClass: 'text-amber-700',  borderClass: 'border-amber-200'  },
  { key: 'completed', label: 'Completed',    colorClass: 'text-blue-700',   borderClass: 'border-blue-200'   },
];

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        setError('');
        const { data } = await getMyTasks();
        setTasks(data?.tasks || []);
      } catch (err) {
        setError(err.response?.data?.message || err.response?.data?.error || 'Failed to load your tasks.');
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, []);

  const summary = useMemo(() => ({
    total:     tasks.length,
    open:      tasks.filter((t) => t.status === 'open').length,
    assigned:  tasks.filter((t) => t.status === 'assigned').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
  }), [tasks]);

  const filteredTasks = useMemo(() => {
    const search = query.trim().toLowerCase();
    let list = tasks.filter((task) => {
      const byStatus = statusFilter === 'all' || task.status === statusFilter;
      const haystack = `${task.title} ${task.description} ${task.location} ${task.category}`.toLowerCase();
      return byStatus && (!search || haystack.includes(search));
    });
    list = [...list].sort((a, b) => {
      if (sortBy === 'oldest') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      if (sortBy === 'title')  return (a.title || '').localeCompare(b.title || '');
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
    return list;
  }, [tasks, query, statusFilter, sortBy]);

  return (
    <div className="max-w-6xl mx-auto space-y-5">

      {/* ─── Page Header + Summary ─────────────────────────────── */}
      <div className="surface-card p-5 md:p-6">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h2 className="page-title">My Tasks</h2>
            <p className="text-sm text-slate-500 mt-0.5">Track, filter, and manage all tasks you have posted.</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {SUMMARY_CONFIG.map(({ key, label, colorClass, borderClass }) => (
            <div
              key={key}
              className={`rounded-lg border ${borderClass} bg-white px-4 py-3 cursor-pointer hover:shadow-sm transition-shadow duration-150`}
              onClick={() => key !== 'total' ? setStatusFilter(key) : setStatusFilter('all')}
            >
              <p className={`text-2xl font-bold tracking-tight stat-number ${colorClass}`}>
                {summary[key]}
              </p>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Filters ───────────────────────────────────────────── */}
      <div className="surface-card p-4 md:p-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search */}
          <div className="md:col-span-6 relative">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" className="w-4 h-4 stroke-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, location, category..."
              className="input-field pl-9"
            />
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="assigned">Assigned</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Sort */}
          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title A–Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* ─── Skeleton Loading ───────────────────────────────────── */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="surface-card p-5 space-y-3">
              <div className="skeleton h-4 w-2/3" />
              <div className="skeleton h-3 w-full" />
              <div className="skeleton h-3 w-5/6" />
              <div className="skeleton h-3 w-1/2" />
              <div className="flex gap-2 mt-2">
                <div className="skeleton h-5 w-16 rounded-full" />
                <div className="skeleton h-5 w-20 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── Error ─────────────────────────────────────────────── */}
      {error && (
        <div className="alert-error">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" className="w-4 h-4 stroke-red-600 flex-shrink-0 mt-0.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          {error}
        </div>
      )}

      {/* ─── Empty State (no tasks) ─────────────────────────────── */}
      {!loading && !error && tasks.length === 0 && (
        <div className="surface-card">
          <div className="empty-state">
            <div className="empty-icon">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" className="w-7 h-7 stroke-slate-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-slate-900">No tasks posted yet</h3>
            <p className="text-sm text-slate-500 mt-1.5 max-w-xs">Create your first task and helpers will be able to find and request it.</p>
          </div>
        </div>
      )}

      {/* ─── Empty State (filter mismatch) ─────────────────────── */}
      {!loading && !error && tasks.length > 0 && filteredTasks.length === 0 && (
        <div className="surface-card">
          <div className="empty-state">
            <div className="empty-icon">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" className="w-7 h-7 stroke-slate-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-slate-900">No tasks match your filters</h3>
            <p className="text-sm text-slate-500 mt-1.5">Try clearing the search or adjusting the status filter.</p>
            <button
              onClick={() => { setQuery(''); setStatusFilter('all'); }}
              className="btn-secondary text-sm mt-4 px-4 py-2"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* ─── Task Grid ─────────────────────────────────────────── */}
      {!loading && !error && filteredTasks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <article key={task._id} className="surface-card-hover overflow-hidden flex flex-col">
              {/* Task Image */}
              {task.picture && (
                <div className="h-36 w-full overflow-hidden border-b border-slate-200">
                  <img src={task.picture} alt={task.title} className="h-full w-full object-cover" />
                </div>
              )}

              <div className="p-5 flex flex-col flex-1">
                {/* Title + Status */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">{task.title}</h3>
                  <span className={`badge flex-shrink-0 ${statusBadge(task.status)}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusDot(task.status)}`} />
                    {task.status}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-4 min-h-[40px]">{task.description}</p>

                {/* Meta Info */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" className="w-3.5 h-3.5 stroke-slate-400 flex-shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="line-clamp-1">{task.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" className="w-3.5 h-3.5 stroke-slate-400 flex-shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{formatDateTime(task.startDate, task.startTime)}</span>
                  </div>
                </div>

                {/* Category */}
                {task.category && (
                  <div className="mb-4">
                    <span className="badge-blue">{task.category}</span>
                  </div>
                )}

                {/* Footer */}
                <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Added {formatDate(task.createdAt)}</span>
                  <span className="font-mono">#{String(task._id).slice(-6).toUpperCase()}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
