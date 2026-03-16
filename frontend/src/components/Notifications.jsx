import React, { useMemo, useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  CheckCircle2,
  Clock3,
  Inbox,
  Loader2,
  MessageSquareWarning,
  UserRound,
  XCircle,
} from "lucide-react";
import { useNotifications } from "../context/NotificationContext";

function formatDate(dateValue) {
  if (!dateValue) return "-";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "-";

  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: now.getFullYear() === date.getFullYear() ? undefined : "numeric",
  });
}

const TYPE_META = {
  new_request: {
    icon: Inbox,
    iconWrap: "bg-blue-50 text-blue-700 border-blue-200",
    badge: "New Request",
    badgeClass: "badge-blue",
  },
  request_accepted: {
    icon: CheckCircle2,
    iconWrap: "bg-emerald-50 text-emerald-700 border-emerald-200",
    badge: "Accepted",
    badgeClass: "badge-green",
  },
  request_rejected: {
    icon: XCircle,
    iconWrap: "bg-rose-50 text-rose-700 border-rose-200",
    badge: "Rejected",
    badgeClass: "badge-red",
  },
};

export default function Notifications() {
  const { notifications, unreadCount, loading, error, markOneRead, markAllRead } = useNotifications();
  const [actionError, setActionError] = useState("");

  const readCount = useMemo(
    () => notifications.reduce((count, item) => (item.isRead ? count + 1 : count), 0),
    [notifications],
  );

  const handleMarkRead = async (notificationId) => {
    try {
      setActionError("");
      await markOneRead(notificationId);
    } catch (err) {
      setActionError(err.response?.data?.message || "Failed to mark notification as read.");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      setActionError("");
      await markAllRead();
    } catch (err) {
      setActionError(err.response?.data?.message || "Failed to mark all notifications as read.");
    }
  };

  return (
    <section className="max-w-5xl mx-auto space-y-5 page-enter">
      <div className="surface-card p-5 md:p-6 bg-gradient-to-r from-blue-50 via-white to-sky-50 border-blue-100">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] uppercase text-blue-700">Notification Center</p>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">Activity Updates</h2>
            <p className="text-sm text-slate-600 mt-1">
              Live updates from requests, task activity, and response decisions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="badge-blue px-3 py-1.5">{unreadCount} unread</span>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead} className="btn-secondary text-sm px-4 py-2">
                <CheckCheck className="w-4 h-4" />
                Mark all read
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5">
          <div className="bg-white/90 border border-slate-200 rounded-lg px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Total</p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">{notifications.length}</p>
          </div>

          <div className="bg-white/90 border border-slate-200 rounded-lg px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Unread</p>
            <p className="text-xl font-bold text-blue-700 mt-0.5">{unreadCount}</p>
          </div>

          <div className="bg-white/90 border border-slate-200 rounded-lg px-4 py-3 col-span-2 sm:col-span-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Read</p>
            <p className="text-xl font-bold text-emerald-700 mt-0.5">{readCount}</p>
          </div>
        </div>
      </div>

      {loading && (
        <div className="surface-card p-10 flex items-center justify-center gap-2 text-slate-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm font-medium">Loading notifications...</span>
        </div>
      )}

      {(error || actionError) && (
        <div className="alert-error">
          <MessageSquareWarning className="w-5 h-5" />
          <p className="font-medium">{actionError || error}</p>
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
              As soon as someone requests a task or responds, live updates will appear here.
            </p>
          </div>
        </div>
      )}

      {!loading && !error && notifications.length > 0 && (
        <div className="space-y-3">
          {notifications.map((notif) => {
            const meta = TYPE_META[notif.type] || TYPE_META.new_request;
            const EventIcon = meta.icon;

            return (
              <article
                key={notif._id}
                className={`surface-card p-4 sm:p-5 transition-all ${
                  notif.isRead ? "" : "border-blue-200 bg-blue-50/40"
                }`}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${meta.iconWrap}`}
                  >
                    <EventIcon className="w-5 h-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm sm:text-[15px] font-semibold text-slate-900">{notif.title}</h4>
                          <span className={meta.badgeClass}>{meta.badge}</span>
                          {!notif.isRead && <span className="badge-blue">Unread</span>}
                        </div>

                        <p className="text-sm text-slate-600 mt-1">{notif.message}</p>
                      </div>

                      {!notif.isRead && (
                        <button
                          onClick={() => handleMarkRead(notif._id)}
                          className="btn-ghost text-xs sm:text-sm self-start"
                        >
                          <Check className="w-4 h-4" />
                          Mark read
                        </button>
                      )}
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <Clock3 className="w-3.5 h-3.5" />
                        {formatDate(notif.createdAt)}
                      </span>

                      {notif.actor?.first_name && (
                        <span className="inline-flex items-center gap-1">
                          <UserRound className="w-3.5 h-3.5" />
                          {notif.actor.first_name} {notif.actor.last_name}
                        </span>
                      )}

                      {notif.task?.title && <span className="badge-slate">{notif.task.title}</span>}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
