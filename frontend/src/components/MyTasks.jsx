import React, { useEffect, useMemo, useState } from 'react';
import { getMyTasks, deleteTask } from '../config/api';
import { useNavigate } from 'react-router-dom';
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
  ArrowDownWideNarrow,
  Pencil,
  Trash
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
  { key: 'total', label: 'Total Tasks', colorClass: 'text-slate-900', borderClass: 'border-slate-200 hover:border-slate-300', bgClass: 'bg-white' },
  { key: 'open', label: 'Open', colorClass: 'text-emerald-700', borderClass: 'border-emerald-200 hover:border-emerald-300', bgClass: 'bg-emerald-50/50' },
  { key: 'assigned', label: 'Assigned', colorClass: 'text-amber-700', borderClass: 'border-amber-200 hover:border-amber-300', bgClass: 'bg-amber-50/50' },
  { key: 'completed', label: 'Completed', colorClass: 'text-blue-700', borderClass: 'border-blue-200 hover:border-blue-300', bgClass: 'bg-blue-50/50' },
];

export default function MyTasks() {

  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await getMyTasks();
      setTasks(data?.tasks || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load your tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await deleteTask(id);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
      alert("Failed to delete task");
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-task/${id}`);
  };

  const summary = useMemo(() => ({
    total: tasks.length,
    open: tasks.filter((t) => t.status === 'open').length,
    assigned: tasks.filter((t) => t.status === 'assigned').length,
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
      if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '');
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    return list;
  }, [tasks, query, statusFilter, sortBy]);

  return (
    <div className="max-w-[80vw] mx-auto space-y-6 pb-12">

      {/* Task Grid */}
      {!loading && !error && filteredTasks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTasks.map((task) => (
            <article key={task._id} className="surface-card-hover overflow-hidden flex flex-col group">

              {task.picture && (
                <div className="h-40 w-full overflow-hidden border-b border-slate-100">
                  <img src={task.picture} alt={task.title} className="h-full w-full object-cover" />
                </div>
              )}

              <div className="p-5 flex flex-col flex-1">

                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="text-[15px] font-bold text-slate-900 line-clamp-2">{task.title}</h3>
                  <span className={`badge ${statusBadge(task.status)}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusDot(task.status)}`} />
                    <span className="capitalize">{task.status}</span>
                  </span>
                </div>

                <p className="text-[13px] text-slate-600 line-clamp-2 mb-4">
                  {task.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-[13px] text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{task.location}</span>
                  </div>

                  <div className="flex items-center gap-2 text-[13px] text-slate-600">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>{formatDateTime(task.startDate, task.startTime)}</span>
                  </div>
                </div>

                {/* EDIT DELETE BUTTONS */}
                <div className="flex gap-3 mt-auto pt-3 border-t border-slate-100">

                  <button
                    onClick={() => handleEdit(task._id)}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <Pencil size={16}/>
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(task._id)}
                    className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
                  >
                    <Trash size={16}/>
                    Delete
                  </button>

                </div>

              </div>
            </article>
          ))}
        </div>
      )}

    </div>
  );
}