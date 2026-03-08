import React, { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../config/api";

const EditProfile = () => {

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    email_id: ""
  });

  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {

      const res = await getProfile();

      setFormData({
        first_name: res.data.first_name || "",
        last_name: res.data.last_name || "",
        phone_number: res.data.phone_number || "",
        email_id: res.data.email_id || ""
      });

    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {

    try {

      await updateProfile({
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone_number: formData.phone_number
      });

      setEditMode(false);
      fetchProfile();

    } catch (error) {
      console.log(error);
    }

  };

  return (

    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow">

      <h2 className="text-xl font-bold mb-4">
        Edit Profile
      </h2>

      <div className="space-y-4">

        <input
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          disabled={!editMode}
          className="w-full border p-2 rounded"
          placeholder="First Name"
        />

        <input
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          disabled={!editMode}
          className="w-full border p-2 rounded"
          placeholder="Last Name"
        />

        <input
          type="email"
          value={formData.email_id}
          disabled
          className="w-full border p-2 rounded bg-gray-100"
        />

        <input
          type="text"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
          disabled={!editMode}
          className="w-full border p-2 rounded"
          placeholder="Phone Number"
        />

      </div>

      <div className="mt-4">

        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Edit Profile
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Save Changes
          </button>
        )}

      </div>

    </div>

  );
};

export default EditProfile;