import React, { useEffect, useMemo, useState } from "react";
import { getMyTasks, deleteTask } from "../config/api";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Clock,
  AlertCircle,
  Inbox,
  Pencil,
  Trash,
} from "lucide-react";

function formatDateTime(dateValue, timeValue) {
  if (!dateValue) return "-";
  const date = new Date(dateValue);

  const datePart = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return `${datePart}${timeValue ? `, ${timeValue}` : ""}`;
}

export default function MyTasks() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const DEFAULT_IMAGE =
    "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=800";

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await getMyTasks();
      setTasks(data?.tasks || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await deleteTask(id);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch {
      alert("Failed to delete task");
    }
  };

  const handleEdit = (id) => {
    navigate(`/dashboard/edit-task/${id}`);
  };

  const filteredTasks = useMemo(() => {
    const search = query.toLowerCase();

    return tasks.filter((task) =>
      `${task.title} ${task.description} ${task.location}`
        .toLowerCase()
        .includes(search)
    );
  }, [tasks, query]);

  return (
    <div className="max-w-[80vw] mx-auto space-y-6 pb-12">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Tasks</h1>
      </div>

      {/* SEARCH */}
      <div className="flex items-center gap-2 border rounded-lg px-3 py-2 w-full md:w-80">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search tasks..."
          className="outline-none w-full"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex justify-center py-20 text-gray-500">
          Loading tasks...
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="flex items-center gap-2 text-red-500">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* EMPTY */}
      {!loading && filteredTasks.length === 0 && (
        <div className="flex flex-col items-center py-20 text-gray-500">
          <Inbox size={40} />
          <p>No tasks found</p>
        </div>
      )}

      {/* TASK GRID */}
      {!loading && filteredTasks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

          {filteredTasks.map((task) => (

            <article
              key={task._id}
              className="border rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition"
            >

              {/* IMAGE (always visible) */}
              <div className="h-40 overflow-hidden">
                <img
                  src={task.picture || DEFAULT_IMAGE}
                  alt={task.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="p-5 flex flex-col">

                {/* TITLE */}
                <h3 className="font-bold text-lg mb-2">
                  {task.title}
                </h3>

                {/* DESCRIPTION */}
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {task.description}
                </p>

                {/* LOCATION */}
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <MapPin size={16} />
                  {task.location}
                </div>

                {/* DATE */}
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <Clock size={16} />
                  {formatDateTime(task.startDate, task.startTime)}
                </div>

                {/* ACTIONS */}
                <div className="flex gap-4 border-t pt-3 mt-auto">

                  <button
                    onClick={() => handleEdit(task._id)}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(task._id)}
                    className="flex items-center gap-1 text-red-600 hover:text-red-800"
                  >
                    <Trash size={16} />
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