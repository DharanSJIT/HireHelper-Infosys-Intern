import React, { useEffect, useState } from 'react';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../config/api';
import { Bell, CheckCircle, XCircle, Inbox, Loader2, AlertCircle } from 'lucide-react';

function formatDate(dateValue) {
  if (!dateValue) return '-';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return '-';
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await getNotifications();
      setNotifications(data?.notifications || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load notifications.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (notificationId) => {
    try {
      await markNotificationRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      // Silent fail
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      // Silent fail
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="surface-card p-5 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="page-title">Notifications</h2>
            <p className="text-sm text-slate-500 mt-0.5">Stay updated on your task requests and activities.</p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="btn-secondary text-sm px-4 py-2"
            >
              Mark all read
            </button>
          )}
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

      {!loading && !error && notifications.length === 0 && (
        <div className="surface-card">
          <div className="empty-state">
            <div className="empty-icon">
              <Bell className="w-7 h-7 text-slate-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">No notifications yet</h3>
            <p className="text-sm text-slate-500 mt-1.5 max-w-xs leading-relaxed">
              You'll see notifications here when there's activity on your tasks.
            </p>
          </div>
        </div>
      )}

      {!loading && !error && notifications.length > 0 && (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif._id}
              onClick={() => !notif.isRead && handleMarkRead(notif._id)}
              className={`surface-card p-4 cursor-pointer transition-all ${
                !notif.isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
            >
              <div className="flex gap-3">
                <div className="flex-shrink-0 mt-1">
                  {notif.type === 'new_request' && (
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Inbox className="w-5 h-5 text-blue-600" />
                    </div>
                  )}
                  {notif.type === 'request_accepted' && (
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    </div>
                  )}
                  {notif.type === 'request_rejected' && (
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                      <XCircle className="w-5 h-5 text-red-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{notif.title}</h4>
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-1.5" />
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{notif.message}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                    <span>{formatDate(notif.createdAt)}</span>
                    {notif.task?.title && (
                      <>
                        <span>•</span>
                        <span className="font-medium">{notif.task.title}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
