import React, { useEffect, useMemo, useState } from 'react';
import { getFeedTasks, requestTask } from '../config/api';
import { 
  MapPin, 
  Calendar as CalendarIcon, 
  User, 
  AlertCircle, 
  Inbox, 
  Loader2, 
  CheckCircle2, 
  Rss,
  Clock
} from 'lucide-react';

function formatDate(dateValue) {
  if (!dateValue) return '-';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function MetaRow({ icon, children }) {
  return (
    <div className="flex items-start gap-2.5 text-[13px] text-slate-600 font-medium">
      <span className="flex-shrink-0 mt-0.5 text-slate-400">{icon}</span>
      <span className="leading-snug">{children}</span>
    </div>
  );
}

export default function Feed() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [requestState, setRequestState] = useState({});

  useEffect(() => {
    const loadFeed = async () => {
      try {
        setLoading(true);
        setError('');
        const { data } = await getFeedTasks();
        setTasks(data?.tasks || []);
      } catch (err) {
        setError(err.response?.data?.message || err.response?.data?.error || 'Failed to load feed.');
      } finally {
        setLoading(false);
      }
    };
    loadFeed();
  }, []);

  const pendingIds = useMemo(
    () => new Set(Object.keys(requestState).filter((id) => requestState[id]?.loading)),
    [requestState],
  );

  const handleRequest = async (taskId) => {
    setRequestState((prev) => ({ ...prev, [taskId]: { loading: true, error: '', success: '' } }));
    try {
      const { data } = await requestTask(taskId);
      setRequestState((prev) => ({
        ...prev,
        [taskId]: { loading: false, error: '', success: data?.message || 'Request sent!' },
      }));
    } catch (err) {
      setRequestState((prev) => ({
        ...prev,
        [taskId]: {
          loading: false,
          success: '',
          error: err.response?.data?.message || err.response?.data?.error || 'Failed to send request.',
        },
      }));
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">

      {/* Page Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Task Feed</h2>
          <p className="text-sm text-slate-500 mt-1 max-w-lg leading-relaxed">Browse open tasks from people in your area. Find something you can help with and send a request!</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          {!loading && !error && (
            <span className="inline-flex items-center justify-center bg-blue-50 text-blue-700 border border-blue-200 shadow-sm rounded-full text-sm font-bold px-4 py-1.5 tracking-wide">
              {tasks.length} {tasks.length === 1 ? 'Task' : 'Tasks'} Open
            </span>
          )}
        </div>
      </div>

      {/* Loading Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="skeleton h-5 w-2/3 rounded-md" />
                <div className="skeleton h-5 w-16 rounded-full" />
              </div>
              <div className="space-y-2 mt-3">
                <div className="skeleton h-3.5 w-full rounded-sm" />
                <div className="skeleton h-3.5 w-4/5 rounded-sm" />
                <div className="skeleton h-3.5 w-3/5 rounded-sm" />
              </div>
              <div className="skeleton h-10 w-full rounded-lg mt-4" />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 shadow-sm mt-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm font-medium leading-relaxed">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && tasks.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mt-6">
          <div className="empty-state py-20">
            <div className="w-20 h-20 rounded-full bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center mb-5 text-slate-400 ring-4 ring-slate-50">
              <Rss className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">No open tasks right now</h3>
            <p className="text-[15px] text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed text-center">New tasks will appear here as soon as someone posts one. Check back soon!</p>
          </div>
        </div>
      )}

      {/* Task Grid */}
      {!loading && !error && tasks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => {
            const state = requestState[task._id] || { loading: false, error: '', success: '' };
            const isDisabled = state.loading || !!state.success || pendingIds.has(task._id);

            return (
              <article key={task._id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col group hover:border-blue-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                {/* Task Image */}
                {task.picture && (
                  <div className="h-44 w-full overflow-hidden border-b border-slate-100 relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent z-10 pointer-events-none" />
                    <img
                      src={task.picture}
                      alt={task.title}
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    />
                  </div>
                )}

                <div className="p-6 flex flex-col flex-1">
                  {/* Title + Status */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <h3 className="text-lg font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-blue-700 transition-colors">{task.title}</h3>
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase flex-shrink-0">
                      {task.status}
                    </span>
                  </div>

                  {/* Description */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 mb-5 shadow-inner">
                    <p className="text-[14px] text-slate-600 line-clamp-3 leading-relaxed">{task.description}</p>
                  </div>

                  {/* Meta */}
                  <div className="space-y-3 mb-6 bg-white p-2 rounded-lg">
                    <MetaRow icon={<User className="w-4 h-4" />}>
                      {task.createdBy?.first_name || 'Anonymous'} {task.createdBy?.last_name || ''}
                    </MetaRow>
                    <MetaRow icon={<MapPin className="w-4 h-4" />}>
                      {task.location}
                    </MetaRow>
                    <MetaRow icon={<CalendarIcon className="w-4 h-4" />}>
                      {formatDate(task.startDate)}{task.startTime ? ` · ${task.startTime}` : ''}
                    </MetaRow>
                  </div>

                  {/* Category Tag */}
                  {task.category && (
                    <div className="mb-5 flex flex-wrap gap-2">
                      <span className="inline-flex items-center justify-center px-3 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100 shadow-sm">{task.category}</span>
                    </div>
                  )}

                  <div className="mt-auto pt-2 border-t border-slate-100">
                    {/* Feedback messages */}
                    {state.error && (
                      <div className="mb-4 bg-red-50 text-red-700 border border-red-200 rounded-lg p-2.5 flex items-center gap-2 text-xs font-semibold shadow-sm">
                        <AlertCircle className="w-4 h-4" />
                        {state.error}
                      </div>
                    )}
                    {state.success && (
                      <div className="mb-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg p-2.5 flex items-center gap-2 text-xs font-semibold shadow-sm">
                        <CheckCircle2 className="w-4 h-4" />
                        {state.success}
                      </div>
                    )}

                    {/* Request Button */}
                    <button
                      type="button"
                      onClick={() => handleRequest(task._id)}
                      disabled={isDisabled}
                      className={`w-full py-3 rounded-xl text-sm font-bold shadow-sm transition-all duration-200 cursor-pointer ${
                        state.success
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 cursor-default opacity-100'
                          : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed'
                      }`}
                    >
                      {state.loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending...
                        </span>
                      ) : state.success ? (
                        <span className="flex items-center justify-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          Request Sent
                        </span>
                      ) : 'Send Request to Help'}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
