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
          <p className="text-sm text-slate-500 mt-1 max-w-lg leading-relaxed">
            Browse open tasks from people in your area. Find something you can help with and send a request!
          </p>
        </div>
        <div className="flex flex-col items-center gap-2">
          {!loading && !error && (
            <span className="inline-flex items-center justify-center bg-blue-50 text-blue-700 border border-blue-200 shadow-sm rounded-full text-sm font-bold px-4 py-1.5 tracking-wide">
              {tasks.length} {tasks.length === 1 ? 'Task' : 'Tasks'} Open
            </span>
          )}
        </div>
      </div>

      {/* Loading */}
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

      {/* Empty */}
      {!loading && !error && tasks.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mt-6">
          <div className="py-20 text-center">
            <Rss className="w-8 h-8 mx-auto text-slate-400 mb-4" />
            <h3 className="text-lg font-bold text-slate-900">No open tasks right now</h3>
            <p className="text-[15px] text-slate-500 mt-2 max-w-sm mx-auto">
              New tasks will appear here as soon as someone posts one.
            </p>
          </div>
        </div>
      )}

      {/* Task Grid */}
      {!loading && !error && tasks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => {
            const state = requestState[task._id] || { loading: false, error: '', success: '' };

            const isDisabled =
              state.loading ||
              !!state.success ||
              pendingIds.has(task._id) ||
              task.status?.toLowerCase() !== 'open';

            return (
              <article key={task._id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col group hover:border-blue-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">

                <div className="p-6 flex flex-col flex-1">

                  <div className="flex items-start justify-between gap-3 mb-4">
                    <h3 className="text-lg font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-blue-700 transition-colors">
                      {task.title}
                    </h3>
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase">
                      {task.status}
                    </span>
                  </div>

                  <p className="text-[14px] text-slate-600 mb-5 line-clamp-3">{task.description}</p>

                  <div className="mt-auto pt-2 border-t border-slate-100">

                    {state.error && (
                      <div className="mb-3 text-red-600 text-xs font-semibold">
                        {state.error}
                      </div>
                    )}

                    {state.success && (
                      <div className="mb-3 text-emerald-600 text-xs font-semibold">
                        {state.success}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => handleRequest(task._id)}
                      disabled={isDisabled}
                      className={`w-full py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                        state.success
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                          : task.status?.toLowerCase() !== 'open'
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed'
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
                      ) : task.status?.toLowerCase() !== 'open' ? (
                        'Task Closed'
                      ) : (
                        'Send Request to Help'
                      )}
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