import React, { useEffect, useMemo, useState } from 'react';
import { getMyTasks } from '../config/api';
import { 
  Search, 
  MapPin, 
  Calendar as CalendarIcon, 
  Clock, 
  XCircle, 
  LayoutList, 
  AlertCircle, 
  Inbox,
  Filter,
  ArrowDownWideNarrow
} from 'lucide-react';

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
  { key: 'total',     label: 'Total Tasks',  colorClass: 'text-slate-900', borderClass: 'border-slate-200 hover:border-slate-300', bgClass: 'bg-white' },
  { key: 'open',      label: 'Open',         colorClass: 'text-emerald-700', borderClass: 'border-emerald-200 hover:border-emerald-300', bgClass: 'bg-emerald-50/50' },
  { key: 'assigned',  label: 'Assigned',     colorClass: 'text-amber-700',  borderClass: 'border-amber-200 hover:border-amber-300', bgClass: 'bg-amber-50/50' },
  { key: 'completed', label: 'Completed',    colorClass: 'text-blue-700',   borderClass: 'border-blue-200 hover:border-blue-300', bgClass: 'bg-blue-50/50' },
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
    <div className="max-w-6xl mx-auto space-y-6 pb-12">

      {/* ─── Page Header + Summary ─────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">My Tasks</h2>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">Track, filter, and manage all tasks you have posted on HireHelper.</p>
          </div>
          <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shadow-sm">
            <LayoutList className="w-6 h-6" />
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {SUMMARY_CONFIG.map(({ key, label, colorClass, borderClass, bgClass }) => {
            const isActive = statusFilter === key || (statusFilter === 'all' && key === 'total');
            return (
              <div
                key={key}
                className={`relative rounded-xl border ${borderClass} ${bgClass} px-5 py-4 cursor-pointer transition-all duration-200 group overflow-hidden
                  ${isActive ? 'ring-2 ring-blue-500 ring-offset-1 shadow-sm' : 'hover:shadow-sm'}`}
                onClick={() => key !== 'total' ? setStatusFilter(key) : setStatusFilter('all')}
              >
                {isActive && <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 rounded-l-xl" />}
                <p className={`text-3xl font-bold tracking-tight stat-number ${colorClass}`}>
                  {summary[key]}
                </p>
                <p className="text-sm font-semibold text-slate-500 mt-1 uppercase tracking-wider">{label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Filters ───────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Search */}
          <div className="md:col-span-6 relative">
            <Search className="w-[18px] h-[18px] text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, location, description..."
              className="w-full rounded-lg border border-slate-300 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors shadow-sm hover:border-slate-400"
            />
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3 relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none rounded bg-slate-100 p-0.5 border border-slate-200">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white pl-10 pr-8 py-2.5 text-sm font-medium text-slate-700 cursor-pointer focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors shadow-sm hover:border-slate-400 appearance-none"
              style={{ backgroundImage: `url('data:image/svg+xml;utf8,<svg fill="none" viewBox="0 0 24 24" stroke="%2364748B" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>')`, backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1em' }}
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="assigned">Assigned</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Sort */}
          <div className="md:col-span-3 relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none rounded bg-slate-100 p-0.5 border border-slate-200">
              <ArrowDownWideNarrow className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white pl-10 pr-8 py-2.5 text-sm font-medium text-slate-700 cursor-pointer focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors shadow-sm hover:border-slate-400 appearance-none"
              style={{ backgroundImage: `url('data:image/svg+xml;utf8,<svg fill="none" viewBox="0 0 24 24" stroke="%2364748B" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>')`, backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1em' }}
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 border-t border-slate-100 pt-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-sm">
              <div className="skeleton h-5 w-3/4 rounded-md" />
              <div className="space-y-2 mt-3">
                <div className="skeleton h-3.5 w-full rounded-sm" />
                <div className="skeleton h-3.5 w-5/6 rounded-sm" />
                <div className="skeleton h-3.5 w-1/2 rounded-sm" />
              </div>
              <div className="flex gap-2 pt-2 border-t border-slate-50">
                <div className="skeleton h-5 w-16 rounded-full" />
                <div className="skeleton h-5 w-24 rounded-full" />
              </div>
              <div className="flex justify-between items-center mt-auto pt-2">
                <div className="skeleton h-3 w-1/3 rounded-sm" />
                <div className="skeleton h-3 w-1/4 rounded-sm" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── Error ─────────────────────────────────────────────── */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 shadow-sm mt-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm font-medium leading-relaxed">{error}</p>
        </div>
      )}

      {/* ─── Empty State (no tasks) ─────────────────────────────── */}
      {!loading && !error && tasks.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mt-6">
          <div className="empty-state py-20">
            <div className="w-20 h-20 rounded-full bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center mb-5 text-slate-400">
              <Inbox className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">No tasks posted yet</h3>
            <p className="text-[15px] text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">Create your first task and helpers nearby will be able to find and request it.</p>
          </div>
        </div>
      )}

      {/* ─── Empty State (filter mismatch) ─────────────────────── */}
      {!loading && !error && tasks.length > 0 && filteredTasks.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mt-6">
          <div className="empty-state py-16">
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 text-slate-400 ring-4 ring-slate-50">
              <XCircle className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No tasks match your filters</h3>
            <p className="text-[14px] text-slate-500 mt-1 mb-5">Try clearing the search query or adjusting the selected status.</p>
            <button
              onClick={() => { setQuery(''); setStatusFilter('all'); }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 hover:border-slate-400 transition-all shadow-sm"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}

      {/* ─── Task Grid ─────────────────────────────────────────── */}
      {!loading && !error && filteredTasks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTasks.map((task) => (
            <article key={task._id} className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col group hover:border-blue-300 hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5">
              {/* Task Image */}
              {task.picture && (
                <div className="h-40 w-full overflow-hidden border-b border-slate-100 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent z-10 pointer-events-none" />
                  <img src={task.picture} alt={task.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
                </div>
              )}

              <div className="p-5 flex flex-col flex-1">
                {/* Title + Status */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="text-[15px] font-bold text-slate-900 leading-snug line-clamp-2 title-hover group-hover:text-blue-700 transition-colors">{task.title}</h3>
                  <span className={`badge flex-shrink-0 self-start ${statusBadge(task.status)} shadow-sm`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusDot(task.status)}`} />
                    <span className="capitalize tracking-wide">{task.status}</span>
                  </span>
                </div>

                {/* Description */}
                <p className="text-[13px] text-slate-600 leading-relaxed line-clamp-2 mb-4 bg-slate-50 border border-slate-100 rounded-md p-2.5 shadow-inner">{task.description}</p>

                {/* Meta Info */}
                <div className="space-y-2 mb-4 pt-1">
                  <div className="flex items-center gap-2.5 text-[13px] text-slate-600 font-medium">
                    <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="line-clamp-1">{task.location}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-[13px] text-slate-600 font-medium">
                    <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span>{formatDateTime(task.startDate, task.startTime)}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-auto flex items-end justify-between pt-4 border-t border-slate-100">
                  {task.category ? (
                    <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100 shadow-sm">{task.category}</span>
                  ) : <div />}
                  <div className="text-right">
                    <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">#{String(task._id).slice(-6)}</span>
                    <span className="block text-[11px] text-slate-500 font-medium">Added {formatDate(task.createdAt)}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
