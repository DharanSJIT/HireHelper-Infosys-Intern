import { useEffect, useState } from "react";
import { getProfile, updateProfile, updateProfilePicture } from "../config/api";

const Settings = () => {

  const [profile, setProfile] = useState({});
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email_id: "",
    phone_number: ""
  });

  const [photo, setPhoto] = useState(null);


  /* ================= LOAD PROFILE ================= */

  const loadProfile = async () => {
    try {
      const res = await getProfile();

      setProfile(res.data);

      setForm({
        first_name: res.data.first_name || "",
        last_name: res.data.last_name || "",
        email_id: res.data.email_id || "",
        phone_number: res.data.phone_number || ""
      });

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);


  /* ================= INPUT CHANGE ================= */

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };


  /* ================= SAVE PROFILE ================= */

  const handleSave = async () => {

    try {

      const res = await updateProfile(form);

      setProfile(res.data.user);

      setEditMode(false);

    } catch (err) {

      console.log(err);

    }

  };


  /* ================= PROFILE PHOTO ================= */

  const handlePhotoUpload = async (e) => {

    const file = e.target.files[0];

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = async () => {

      try {

        await updateProfilePicture({
          profilePicture: reader.result
        });

        loadProfile();

      } catch (err) {

        console.log(err);

      }

    };

  };


  return (

    <div className="p-8 max-w-5xl mx-auto">

      <h1 className="text-3xl font-bold mb-2">Account Settings</h1>

      <p className="text-gray-500 mb-8">
        Manage your personal profile, update your photo, and view your activity summary.
      </p>


      {/* ================= PROFILE CARD ================= */}

      <div className="bg-white shadow rounded-xl p-6 mb-8">

        <div className="flex items-center gap-6">

          <div className="relative">

            <img
              src={
                profile.profilePicture ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              className="w-24 h-24 rounded-xl object-cover"
            />

            <input
              type="file"
              onChange={handlePhotoUpload}
              className="absolute bottom-0 right-0 opacity-0 w-full h-full cursor-pointer"
            />

          </div>


          <div>

            <h2 className="text-xl font-semibold">
              {profile.first_name} {profile.last_name}
            </h2>

            <p className="text-gray-500">{profile.email_id}</p>

            <div className="flex gap-3 mt-2">

              <span className="bg-green-100 text-green-600 text-sm px-3 py-1 rounded-full">
                Verified Account
              </span>

            </div>

          </div>

        </div>

      </div>


      {/* ================= PERSONAL INFO ================= */}

      <div className="bg-white shadow rounded-xl p-6">

        <div className="flex justify-between mb-6">

          <h2 className="text-xl font-semibold">
            Personal Information
          </h2>

          <button
            onClick={() => setEditMode(!editMode)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            {editMode ? "Cancel" : "Edit Profile"}
          </button>

        </div>


        <div className="grid grid-cols-2 gap-6">

          {/* FIRST NAME */}

          <div>

            <label className="text-gray-500 text-sm">
              First Name
            </label>

            <input
              type="text"
              name="first_name"
              value={form.first_name}
              disabled={!editMode}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mt-1"
            />

          </div>


          {/* LAST NAME */}

          <div>

            <label className="text-gray-500 text-sm">
              Last Name
            </label>

            <input
              type="text"
              name="last_name"
              value={form.last_name}
              disabled={!editMode}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mt-1"
            />

          </div>


          {/* EMAIL */}

          <div>

            <label className="text-gray-500 text-sm">
              Email Address
            </label>

            <input
              type="email"
              name="email_id"
              value={form.email_id}
              disabled={!editMode}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mt-1"
            />

          </div>


          {/* PHONE */}

          <div>

            <label className="text-gray-500 text-sm">
              Phone Number
            </label>

            <input
              type="text"
              name="phone_number"
              value={form.phone_number}
              disabled={!editMode}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mt-1"
            />

          </div>

        </div>


        {editMode && (

          <button
            onClick={handleSave}
            className="mt-6 bg-green-600 text-white px-6 py-2 rounded-lg"
          >
            Save Changes
          </button>

        )}

      </div>

    </div>

  );

};

export default Settings;