import React, { useEffect, useMemo, useState } from 'react';
import { getMyTasks } from '../config/api';

function formatDate(dateValue) {
  if (!dateValue) return '-';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString();
}

function formatDateTime(dateValue, timeValue) {
  const datePart = formatDate(dateValue);
  return `${datePart}${timeValue ? `, ${timeValue}` : ''}`;
}

function statusStyles(status) {
  if (status === 'open') return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
  if (status === 'assigned') return 'bg-amber-50 text-amber-700 border border-amber-200';
  return 'bg-slate-100 text-slate-700 border border-slate-200';
}

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

  const summary = useMemo(() => {
    const total = tasks.length;
    const open = tasks.filter((task) => task.status === 'open').length;
    const assigned = tasks.filter((task) => task.status === 'assigned').length;
    const completed = tasks.filter((task) => task.status === 'completed').length;
    return { total, open, assigned, completed };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    const search = query.trim().toLowerCase();

    let next = tasks.filter((task) => {
      const byStatus = statusFilter === 'all' || task.status === statusFilter;
      const haystack = `${task.title || ''} ${task.description || ''} ${task.location || ''} ${task.category || ''}`.toLowerCase();
      const bySearch = !search || haystack.includes(search);
      return byStatus && bySearch;
    });

    next = [...next].sort((a, b) => {
      if (sortBy === 'oldest') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '');
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    return next;
  }, [tasks, query, statusFilter, sortBy]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="rounded-xl border border-blue-100 bg-white p-6">
        <h2 className="text-2xl font-semibold text-slate-900">My Tasks</h2>
        <p className="text-sm text-slate-600 mt-1">Track, filter, and manage the tasks you have posted.</p>

        <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="rounded-lg bg-white border border-blue-100 px-4 py-3">
            <p className="text-xs text-slate-500">Total</p>
            <p className="text-2xl font-semibold text-slate-900">{summary.total}</p>
          </div>
          <div className="rounded-lg bg-white border border-emerald-200 px-4 py-3">
            <p className="text-xs text-emerald-700">Open</p>
            <p className="text-2xl font-semibold text-emerald-700">{summary.open}</p>
          </div>
          <div className="rounded-lg bg-white border border-amber-200 px-4 py-3">
            <p className="text-xs text-amber-700">Assigned</p>
            <p className="text-2xl font-semibold text-amber-700">{summary.assigned}</p>
          </div>
          <div className="rounded-lg bg-white border border-slate-200 px-4 py-3">
            <p className="text-xs text-slate-600">Completed</p>
            <p className="text-2xl font-semibold text-slate-700">{summary.completed}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-blue-100 p-4 md:p-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, description, location, or category"
              className="w-full rounded-lg border border-blue-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            />
          </div>
          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-lg border border-blue-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            >
              <option value="all">All statuses</option>
              <option value="open">Open</option>
              <option value="assigned">Assigned</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded-lg border border-blue-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white rounded-xl border border-blue-100 p-5">
              <div className="h-4 bg-slate-100 rounded w-2/3 mb-4" />
              <div className="h-3 bg-slate-100 rounded w-full mb-2" />
              <div className="h-3 bg-slate-100 rounded w-5/6 mb-4" />
              <div className="h-8 bg-slate-50 rounded" />
            </div>
          ))}
        </div>
      ) : null}

      {error ? <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}

      {!loading && !error && tasks.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-blue-200 p-10 text-center text-sm text-slate-500">
          You haven&apos;t created any tasks yet.
        </div>
      ) : null}

      {!loading && !error && tasks.length > 0 && filteredTasks.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-blue-200 p-10 text-center text-sm text-slate-500">
          No tasks match your current search or filters.
        </div>
      ) : null}

      {!loading && !error && filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredTasks.map((task) => (
            <article key={task._id} className="bg-white rounded-xl border border-blue-100 overflow-hidden">
              {task.picture ? <img src={task.picture} alt={task.title} className="h-44 w-full object-cover" /> : null}

              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="text-base font-semibold text-slate-900 leading-snug line-clamp-2">{task.title}</h3>
                  <span className={`text-[11px] font-semibold px-2 py-1 rounded-full uppercase tracking-wide ${statusStyles(task.status)}`}>
                    {task.status}
                  </span>
                </div>

                <p className="text-sm text-slate-600 mb-4 line-clamp-3 min-h-[60px]">{task.description}</p>

                <div className="space-y-2.5 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-800">Category:</span>
                    <span className="rounded-full bg-blue-50 text-blue-700 px-2 py-0.5 border border-blue-100">{task.category}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-medium text-slate-800">Location:</span>
                    <span className="line-clamp-1">{task.location}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-medium text-slate-800">Start:</span>
                    <span>{formatDateTime(task.startDate, task.startTime)}</span>
                  </div>
                  {(task.endDate || task.endTime) ? (
                    <div className="flex items-start gap-2">
                      <span className="font-medium text-slate-800">End:</span>
                      <span>{formatDateTime(task.endDate, task.endTime)}</span>
                    </div>
                  ) : null}
                </div>

                <div className="mt-4 pt-3 border-t border-blue-50 flex items-center justify-between text-xs text-slate-500">
                  <span>Created {formatDate(task.createdAt)}</span>
                  <span>Task ID: {String(task._id).slice(-6)}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  );
}
