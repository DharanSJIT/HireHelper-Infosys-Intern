import React, { useEffect, useMemo, useState } from 'react';
import { getFeedTasks, requestTask } from '../config/api';

function formatDate(dateValue) {
  if (!dateValue) return '-';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString();
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
    setRequestState((prev) => ({
      ...prev,
      [taskId]: { loading: true, error: '', success: '' },
    }));

    try {
      const { data } = await requestTask(taskId);
      setRequestState((prev) => ({
        ...prev,
        [taskId]: { loading: false, error: '', success: data?.message || 'Request sent successfully.' },
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
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900">Task Feed</h2>
        <p className="text-sm text-gray-600 mt-1">Browse tasks posted by other users and send a request.</p>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-sm text-gray-600">Loading available tasks...</div>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      ) : null}

      {!loading && !error && tasks.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
          No open tasks available right now.
        </div>
      ) : null}

      {!loading && !error && tasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {tasks.map((task) => {
            const state = requestState[task._id] || { loading: false, error: '', success: '' };

            return (
              <article key={task._id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {task.picture ? (
                  <img src={task.picture} alt={task.title} className="h-44 w-full object-cover" />
                ) : null}

                <div className="p-5">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <h3 className="text-base font-semibold text-gray-900 line-clamp-1">{task.title}</h3>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
                      {task.status}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{task.description}</p>

                  <div className="space-y-1.5 text-xs text-gray-600 mb-4">
                    <p><span className="font-medium text-gray-800">Posted by:</span> {task.createdBy?.first_name || 'User'} {task.createdBy?.last_name || ''}</p>
                    <p><span className="font-medium text-gray-800">Location:</span> {task.location}</p>
                    <p><span className="font-medium text-gray-800">Category:</span> {task.category}</p>
                    <p><span className="font-medium text-gray-800">Start:</span> {formatDate(task.startDate)} {task.startTime || ''}</p>
                  </div>

                  {state.error ? (
                    <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-xs text-red-700 border border-red-200">{state.error}</p>
                  ) : null}

                  {state.success ? (
                    <p className="mb-3 rounded-md bg-emerald-50 px-3 py-2 text-xs text-emerald-700 border border-emerald-200">{state.success}</p>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => handleRequest(task._id)}
                    disabled={state.loading || !!state.success || pendingIds.has(task._id)}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {state.loading ? 'Sending...' : state.success ? 'Requested' : 'Request'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
