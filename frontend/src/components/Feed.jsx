import React, { useEffect, useMemo, useState } from 'react';
import { getFeedTasks, requestTask } from '../config/api';

function formatDate(dateValue) {
  if (!dateValue) return '-';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function MetaRow({ icon, children }) {
  return (
    <div className="flex items-start gap-2 text-xs text-slate-600">
      <span className="flex-shrink-0 mt-0.5 text-slate-400">{icon}</span>
      <span className="leading-snug">{children}</span>
    </div>
  );
}

const LocationIcon = (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" className="w-3.5 h-3.5 stroke-current">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const CalendarIcon = (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" className="w-3.5 h-3.5 stroke-current">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const UserIcon = (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" className="w-3.5 h-3.5 stroke-current">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

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
    <div className="max-w-5xl mx-auto space-y-5">

      {/* Page Header */}
      <div className="surface-card p-5 md:p-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="page-title">Task Feed</h2>
          <p className="text-sm text-slate-500 mt-0.5">Browse open tasks and send a request to help out.</p>
        </div>
        {!loading && !error && (
          <span className="badge-blue text-sm font-semibold px-3 py-1">{tasks.length} tasks</span>
        )}
      </div>

      {/* Loading Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="surface-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="skeleton h-4 w-1/2" />
                <div className="skeleton h-5 w-16 rounded-full" />
              </div>
              <div className="skeleton h-3 w-full" />
              <div className="skeleton h-3 w-4/5" />
              <div className="skeleton h-3 w-3/5" />
              <div className="skeleton h-8 w-24 rounded-lg mt-2" />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="alert-error">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" className="w-4 h-4 stroke-red-600 flex-shrink-0 mt-0.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && tasks.length === 0 && (
        <div className="surface-card">
          <div className="empty-state">
            <div className="empty-icon">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" className="w-7 h-7 stroke-slate-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-slate-900">No open tasks right now</h3>
            <p className="text-sm text-slate-500 mt-1.5 max-w-xs">New tasks will appear here as soon as someone posts one. Check back soon!</p>
          </div>
        </div>
      )}

      {/* Task Grid */}
      {!loading && !error && tasks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tasks.map((task) => {
            const state = requestState[task._id] || { loading: false, error: '', success: '' };
            const isDisabled = state.loading || !!state.success || pendingIds.has(task._id);

            return (
              <article key={task._id} className="surface-card-hover overflow-hidden flex flex-col">
                {/* Task Image */}
                {task.picture && (
                  <div className="h-40 w-full overflow-hidden border-b border-slate-200">
                    <img
                      src={task.picture}
                      alt={task.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                <div className="p-5 flex flex-col flex-1">
                  {/* Title + Status */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">{task.title}</h3>
                    <span className="badge-green flex-shrink-0">{task.status}</span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">{task.description}</p>

                  {/* Meta */}
                  <div className="space-y-2 mb-4">
                    <MetaRow icon={UserIcon}>
                      {task.createdBy?.first_name || 'User'} {task.createdBy?.last_name || ''}
                    </MetaRow>
                    <MetaRow icon={LocationIcon}>{task.location}</MetaRow>
                    <MetaRow icon={CalendarIcon}>
                      {formatDate(task.startDate)}{task.startTime ? ` · ${task.startTime}` : ''}
                    </MetaRow>
                  </div>

                  {/* Category Tag */}
                  {task.category && (
                    <div className="mb-4">
                      <span className="badge-blue">{task.category}</span>
                    </div>
                  )}

                  {/* Feedback messages */}
                  {state.error && <p className="alert-error mb-3 text-xs">{state.error}</p>}
                  {state.success && <p className="alert-success mb-3 text-xs">{state.success}</p>}

                  {/* Request Button */}
                  <div className="mt-auto">
                    <button
                      type="button"
                      onClick={() => handleRequest(task._id)}
                      disabled={isDisabled}
                      className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors duration-150 cursor-pointer ${
                        state.success
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                          : 'btn-primary'
                      }`}
                    >
                      {state.loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Sending...
                        </span>
                      ) : state.success ? (
                        <span className="flex items-center justify-center gap-1.5">
                          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" className="w-4 h-4 stroke-emerald-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          Request Sent
                        </span>
                      ) : 'Send Request'}
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
