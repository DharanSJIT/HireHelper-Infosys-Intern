import React, { useEffect, useState } from 'react';
import { getMyTasks } from '../config/api';

function formatDate(dateValue) {
  if (!dateValue) return '-';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString();
}

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900">My Tasks</h2>
        <p className="text-sm text-gray-600 mt-1">Tasks you created.</p>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-sm text-gray-600">Loading tasks...</div>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      ) : null}

      {!loading && !error && tasks.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
          You haven&apos;t created any tasks yet.
        </div>
      ) : null}

      {!loading && !error && tasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {tasks.map((task) => (
            <article key={task._id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {task.picture ? (
                <img src={task.picture} alt={task.title} className="h-44 w-full object-cover" />
              ) : null}

              <div className="p-5">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <h3 className="text-base font-semibold text-gray-900 line-clamp-1">{task.title}</h3>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      task.status === 'open'
                        ? 'bg-emerald-100 text-emerald-700'
                        : task.status === 'assigned'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {task.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{task.description}</p>

                <div className="space-y-1.5 text-xs text-gray-600">
                  <p><span className="font-medium text-gray-800">Location:</span> {task.location}</p>
                  <p><span className="font-medium text-gray-800">Category:</span> {task.category}</p>
                  <p><span className="font-medium text-gray-800">Start:</span> {formatDate(task.startDate)} {task.startTime || ''}</p>
                  {(task.endDate || task.endTime) ? (
                    <p><span className="font-medium text-gray-800">End:</span> {formatDate(task.endDate)} {task.endTime || ''}</p>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  );
}
