import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTaskById, updateTask } from "../config/api";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  MapPin,
  ImagePlus,
  Trash2,
  Calendar as CalendarIcon,
  Clock
} from "lucide-react";

const CATEGORIES = [
  "General",
  "Moving",
  "Cleaning",
  "Repairs",
  "Delivery",
  "Other",
];

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function EditTask() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    category: "General",
  });

  const [pictureFile, setPictureFile] = useState(null);
  const [existingImage, setExistingImage] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const minStartDate = useMemo(() => {
    return new Date().toISOString().split("T")[0];
  }, []);

  /* LOAD TASK */
  useEffect(() => {
    const loadTask = async () => {
      try {

        const { data } = await getTaskById(id);
        const task = data.task;

        setForm({
          title: task.title || "",
          description: task.description || "",
          location: task.location || "",
          startDate: task.startDate?.slice(0, 10) || "",
          startTime: task.startTime || "",
          endDate: task.endDate?.slice(0, 10) || "",
          endTime: task.endTime || "",
          category: task.category || "General",
        });

        setExistingImage(task.picture || "");

      } catch (err) {
        setError("Failed to load task");
      } finally {
        setLoading(false);
      }
    };

    loadTask();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* SAVE EDITED TASK */
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.title || !form.description || !form.location) {
      setError("Please fill required fields");
      return;
    }

    setSubmitting(true);

    try {

      let picture = existingImage;

      if (pictureFile) {
        picture = await fileToBase64(pictureFile);
      }

      await updateTask(id, {
        ...form,
        picture,
      });

      setSuccess("Task updated successfully");

      setTimeout(() => {
        navigate("/dashboard/my-tasks");
      }, 1200);

    } 
    catch (err) {
        console.log("UPDATE ERROR:", err.response?.data);
        setError(
            err.response?.data?.message ||
            "Failed to update task"
        );
    } 
    finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <Loader2 className="animate-spin w-8 h-8 mx-auto text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-[65vw] mx-auto space-y-6 pb-12">

      <h2 className="section-head">
        Edit Task
      </h2>

      {error && (
        <div className="alert-error">
          <AlertCircle className="w-4 h-4"/>
          {error}
        </div>
      )}

      {success && (
        <div className="alert-success">
          <CheckCircle2 className="w-4 h-4"/>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="surface-card p-8 space-y-6">

        {/* TITLE */}
        <div className="input-group">
          <label className="input-label">Title *</label>

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        {/* DESCRIPTION */}
        <div className="input-group">
          <label className="input-label">Description *</label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        {/* LOCATION */}
        <div className="input-group">
          <label className="input-label">Location *</label>

          <div className="relative">

            <MapPin className="w-4 h-4 absolute left-3 top-3 text-gray-400"/>

            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className="input-field pl-9"
            />

          </div>
        </div>

        {/* CATEGORY */}
        <div className="input-group">
          <label className="input-label">Category</label>

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="input-field"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* START DATE */}
        <div className="grid grid-cols-2 gap-4">

          <div>
            <label className="input-label">Start Date</label>

            <input
              type="date"
              name="startDate"
              value={form.startDate}
              min={minStartDate}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div>
            <label className="input-label">Start Time</label>

            <input
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              className="input-field"
            />
          </div>

        </div>

        {/* IMAGE */}
        <div>

          <label className="input-label">
            Image
          </label>

          {existingImage && !pictureFile && (
            <img
              src={existingImage}
              className="w-full h-48 object-cover rounded-lg mb-3"
              alt="task"
            />
          )}

          {pictureFile && (
            <img
              src={URL.createObjectURL(pictureFile)}
              className="w-full h-48 object-cover rounded-lg mb-3"
              alt="preview"
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e)=>setPictureFile(e.target.files[0])}
          />

        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin"/>
              Saving Changes...
            </>
          ) : "Save Changes"}
        </button>

      </form>

    </div>
  );
}