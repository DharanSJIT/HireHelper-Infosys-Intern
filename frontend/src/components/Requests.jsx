import React, { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { getRequestsForMyTasks, acceptRequest, rejectRequest } from '../config/api';
import { Inbox, User, Calendar, MapPin, CheckCircle, XCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { useConfirmDialog } from "../context/ConfirmDialogContext";

function formatDate(dateValue) {
  if (!dateValue) return '-';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function Requests() {
  const { sidebarOpen } = useOutletContext() || { sidebarOpen: true };
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionState, setActionState] = useState({});
  const { confirm } = useConfirmDialog();

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await getRequestsForMyTasks();
      setRequests(data?.requests || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load requests.');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId) => {
    setActionState((prev) => ({ ...prev, [requestId]: { loading: true, error: '' } }));
    try {
      await acceptRequest(requestId);
      await loadRequests();
      setActionState((prev) => ({ ...prev, [requestId]: { loading: false, error: '' } }));
    } catch (err) {
      setActionState((prev) => ({
        ...prev,
        [requestId]: { loading: false, error: err.response?.data?.message || 'Failed to accept.' },
      }));
    }
  };

  const handleReject = async (requestId) => {
    const confirmed = await confirm({
      title: "Reject Request",
      message: "You are about to reject this helper request. You can not auto-restore it later.",
      confirmText: "Reject Request",
      cancelText: "Cancel",
      tone: "danger",
    });

    if (!confirmed) return;

    setActionState((prev) => ({ ...prev, [requestId]: { loading: true, error: '' } }));
    try {
      await rejectRequest(requestId);
      await loadRequests();
      setActionState((prev) => ({ ...prev, [requestId]: { loading: false, error: '' } }));
    } catch (err) {
      setActionState((prev) => ({
        ...prev,
        [requestId]: { loading: false, error: err.response?.data?.message || 'Failed to reject.' },
      }));
    }
  };

  const stats = {
    pending: requests.filter((r) => r.status === 'pending').length,
    accepted: requests.filter((r) => r.status === 'accepted').length,
    rejected: requests.filter((r) => r.status === 'rejected').length,
  };

  return (
    <div className={`mx-auto space-y-6 pb-12 page-enter ${sidebarOpen ? 'w-full' : 'max-w-7xl'}`}>
      <div className="surface-card p-5 md:p-6">
        <h2 className="page-title">Incoming Requests</h2>
        <p className="text-sm text-slate-500 mt-0.5">Review and manage helpers who have requested your tasks.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="stat-card border-l-4 border-l-amber-400">
          <p className="stat-value text-amber-700">{stats.pending}</p>
          <p className="stat-label">Pending Review</p>
        </div>
        <div className="stat-card border-l-4 border-l-emerald-500">
          <p className="stat-value text-emerald-700">{stats.accepted}</p>
          <p className="stat-label">Accepted</p>
        </div>
        <div className="stat-card border-l-4 border-l-slate-300">
          <p className="stat-value text-slate-600">{stats.rejected}</p>
          <p className="stat-label">Rejected</p>
        </div>
      </div>

      {loading && (
        <div className="surface-card p-8 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      )}

      {error && (
        <div className="alert-error">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {!loading && !error && requests.length === 0 && (
        <div className="surface-card">
          <div className="empty-state">
            <div className="empty-icon">
              <Inbox className="w-7 h-7 text-slate-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">No requests yet</h3>
            <p className="text-sm text-slate-500 mt-1.5 max-w-xs leading-relaxed">
              Once helpers discover and request your tasks, they will appear here for your review.
            </p>
            <Link to="/dashboard/add-task" className="btn-primary text-sm mt-5 px-5 py-2.5">
              Post a New Task
            </Link>
          </div>
        </div>
      )}

      {!loading && !error && requests.length > 0 && (
        <div className="space-y-4">
          {requests.map((req) => {
            const state = actionState[req._id] || { loading: false, error: '' };
            const isPending = req.status === 'pending';
            return (
              <div key={req._id} className="surface-card p-5">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-base font-bold text-slate-900">{req.task?.title}</h3>
                      <span
                        className={`badge flex-shrink-0 ${
                          req.status === 'pending'
                            ? 'badge-amber'
                            : req.status === 'accepted'
                            ? 'badge-green'
                            : 'badge-red'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <User className="w-4 h-4" />
                      <span className="font-medium">
                        {req.requestedBy?.first_name} {req.requestedBy?.last_name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Requested {formatDate(req.createdAt)}</span>
                    </div>
                  </div>
                  {isPending && (
                    <div className="flex flex-col gap-2 md:w-40">
                      <button
                        onClick={() => handleAccept(req._id)}
                        disabled={state.loading}
                        className="btn-primary text-sm py-2 flex items-center justify-center gap-1.5"
                      >
                        {state.loading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(req._id)}
                        disabled={state.loading}
                        className="btn-secondary text-sm py-2 flex items-center justify-center gap-1.5 text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
                {state.error && (
                  <div className="mt-3 text-xs text-red-600 bg-red-50 p-2 rounded">{state.error}</div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
