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
  if (status === 'open') {
    return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
  }
  if (status === 'assigned') {
    return 'bg-amber-100 text-amber-700 border border-amber-200';
  }
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
      if (sortBy === 'oldest') {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      }
      if (sortBy === 'title') {
        return (a.title || '').localeCompare(b.title || '');
      }
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    return next;
  }, [tasks, query, statusFilter, sortBy]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-white to-blue-50/70 shadow-sm p-6 md:p-7">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">My Tasks</h2>
            <p className="text-sm text-gray-600 mt-1">Track, filter, and manage the tasks you have posted.</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white border border-blue-100 px-3 py-1.5 text-xs font-medium text-blue-700">
            <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
            Workspace Overview
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="rounded-xl bg-white border border-gray-200 px-4 py-3">
            <p className="text-xs text-gray-500">Total</p>
            <p className="text-2xl font-semibold text-gray-900">{summary.total}</p>
          </div>
          <div className="rounded-xl bg-white border border-emerald-200 px-4 py-3">
            <p className="text-xs text-emerald-700">Open</p>
            <p className="text-2xl font-semibold text-emerald-700">{summary.open}</p>
          </div>
          <div className="rounded-xl bg-white border border-amber-200 px-4 py-3">
            <p className="text-xs text-amber-700">Assigned</p>
            <p className="text-2xl font-semibold text-amber-700">{summary.assigned}</p>
          </div>
          <div className="rounded-xl bg-white border border-slate-200 px-4 py-3">
            <p className="text-xs text-slate-600">Completed</p>
            <p className="text-2xl font-semibold text-slate-700">{summary.completed}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 md:p-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6">
            <label htmlFor="task-search" className="sr-only">Search tasks</label>
            <input
              id="task-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, description, location, or category"
              className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            />
          </div>
          <div className="md:col-span-3">
            <label htmlFor="status-filter" className="sr-only">Filter by status</label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            >
              <option value="all">All statuses</option>
              <option value="open">Open</option>
              <option value="assigned">Assigned</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="md:col-span-3">
            <label htmlFor="sort-by" className="sr-only">Sort tasks</label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
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
            <div key={item} className="bg-white rounded-2xl border border-gray-200 p-5 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-4" />
              <div className="h-3 bg-gray-200 rounded w-full mb-2" />
              <div className="h-3 bg-gray-200 rounded w-5/6 mb-4" />
              <div className="h-8 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      ) : null}

      {!loading && !error && tasks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-10 text-center text-sm text-gray-500">
          You haven&apos;t created any tasks yet.
        </div>
      ) : null}

      {!loading && !error && tasks.length > 0 && filteredTasks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-10 text-center text-sm text-gray-500">
          No tasks match your current search or filters.
        </div>
      ) : null}

      {!loading && !error && filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredTasks.map((task) => (
            <article
              key={task._id}
              className="group bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all hover:shadow-md hover:border-blue-200"
            >
              {task.picture ? (
                <div className="relative">
                  <img src={task.picture} alt={task.title} className="h-44 w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
                </div>
              ) : null}

              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="text-base font-semibold text-gray-900 leading-snug line-clamp-2">{task.title}</h3>
                  <span className={`text-[11px] font-semibold px-2 py-1 rounded-full uppercase tracking-wide ${statusStyles(task.status)}`}>
                    {task.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-3 min-h-[60px]">{task.description}</p>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="font-medium text-gray-800">Category:</span>
                    <span className="rounded-full bg-blue-50 text-blue-700 px-2 py-0.5 border border-blue-100">{task.category}</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-700">
                    <span className="font-medium text-gray-800">Location:</span>
                    <span className="line-clamp-1">{task.location}</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-700">
                    <span className="font-medium text-gray-800">Start:</span>
                    <span>{formatDateTime(task.startDate, task.startTime)}</span>
                  </div>
                  {(task.endDate || task.endTime) ? (
                    <div className="flex items-start gap-2 text-gray-700">
                      <span className="font-medium text-gray-800">End:</span>
                      <span>{formatDateTime(task.endDate, task.endTime)}</span>
                    </div>
                  ) : null}
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span>Created {formatDate(task.createdAt)}</span>
                  <span className="group-hover:text-blue-600 transition-colors">Task ID: {String(task._id).slice(-6)}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  );
}
