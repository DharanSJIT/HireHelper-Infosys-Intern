import React, { useEffect, useMemo, useState } from "react";
import { getFeedTasks, requestTask } from "../config/api";
import {
  MapPin,
  Calendar as CalendarIcon,
  User,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Rss,
} from "lucide-react";

function formatDate(dateValue) {
  if (!dateValue) return "-";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
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
  const [error, setError] = useState("");
  const [requestState, setRequestState] = useState({});

  useEffect(() => {
    const loadFeed = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await getFeedTasks();
        setTasks(data?.tasks || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            "Failed to load tasks"
        );
      } finally {
        setLoading(false);
      }
    };

    loadFeed();
  }, []);

  const pendingIds = useMemo(() => {
    return new Set(
      Object.keys(requestState).filter((id) => requestState[id]?.loading)
    );
  }, [requestState]);

  const handleRequest = async (taskId) => {
    setRequestState((prev) => ({
      ...prev,
      [taskId]: { loading: true, error: "", success: "" },
    }));

    try {
      const { data } = await requestTask(taskId);

      setRequestState((prev) => ({
        ...prev,
        [taskId]: {
          loading: false,
          success: data?.message || "Request Sent Successfully",
          error: "",
        },
      }));
    } catch (err) {
      setRequestState((prev) => ({
        ...prev,
        [taskId]: {
          loading: false,
          success: "",
          error:
            err.response?.data?.message ||
            err.response?.data?.error ||
            "Request failed",
        },
      }));
    }
  };

  return (
    <div className="max-w-[80vw] mx-auto space-y-6 pb-12">
      {/* HEADER */}
      <div className="surface-card p-6 md:p-8 flex items-center justify-between gap-4">
        <div>
          <h2 className="section-head">Task Feed</h2>
          <p className="section-sub mt-1 max-w-lg">
            Browse open tasks posted by users and help them.
          </p>
        </div>

        {!loading && !error && (
          <span className="inline-flex items-center justify-center bg-blue-50 text-blue-700 border border-blue-200 shadow-sm rounded-full text-sm font-bold px-4 py-1.5">
            {tasks.length} {tasks.length === 1 ? "Task" : "Tasks"} Open
          </span>
        )}
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-center py-20">
          <Loader2 className="animate-spin w-8 h-8 mx-auto text-blue-600" />
          <p className="text-sm text-gray-500 mt-3">Loading tasks...</p>
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="alert-error mt-2 flex gap-2 items-center">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}

      {/* EMPTY */}
      {!loading && !error && tasks.length === 0 && (
        <div className="surface-card mt-6 text-center py-12">
          <Rss className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold">No open tasks</h3>
          <p className="text-sm text-gray-500 mt-2">
            New tasks will appear here soon.
          </p>
        </div>
      )}

      {/* TASK GRID */}
      {!loading && !error && tasks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => {
            const state = requestState[task._id] || {
              loading: false,
              error: "",
              success: "",
            };

            const isDisabled =
              state.loading ||
              !!state.success ||
              pendingIds.has(task._id) ||
              task.status !== "open";

            const userName = task.createdBy
              ? `${task.createdBy.first_name || ""} ${
                  task.createdBy.last_name || ""
                }`
              : "Anonymous";

            return (
              <article
                key={task._id}
                className="surface-card-hover overflow-hidden flex flex-col"
              >
                {/* IMAGE */}
                {task.picture && (
                  <div className="h-44 w-full overflow-hidden border-b">
                    <img
                      src={task.picture}
                      alt={task.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                <div className="p-6 flex flex-col flex-1">
                  {/* TITLE */}
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-slate-900">
                      {task.title}
                    </h3>

                    <span className="bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase">
                      {task.status}
                    </span>
                  </div>

                  {/* DESCRIPTION */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {task.description}
                  </p>

                  {/* META */}
                  <div className="space-y-2 mb-4">
                    <MetaRow icon={<User className="w-4 h-4" />}>
                      {userName || "Anonymous"}
                    </MetaRow>

                    <MetaRow icon={<MapPin className="w-4 h-4" />}>
                      {task.location}
                    </MetaRow>

                    <MetaRow icon={<CalendarIcon className="w-4 h-4" />}>
                      {formatDate(task.startDate)}{" "}
                      {task.startTime ? `• ${task.startTime}` : ""}
                    </MetaRow>
                  </div>

                  {/* CATEGORY */}
                  {task.category && (
                    <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-1 rounded mb-4">
                      {task.category}
                    </span>
                  )}

                  {/* REQUEST BUTTON */}
                  <div className="mt-auto">
                    {state.error && (
                      <p className="text-xs text-red-500 mb-2">{state.error}</p>
                    )}

                    {state.success && (
                      <p className="text-xs text-green-600 mb-2">
                        {state.success}
                      </p>
                    )}

                    <button
                      onClick={() => handleRequest(task._id)}
                      disabled={isDisabled}
                      className={`w-full py-2.5 rounded-lg text-sm font-semibold transition ${
                        state.success
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
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
                      ) : task.status !== "open" ? (
                        "Task Closed"
                      ) : (
                        "Send Request to Help"
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