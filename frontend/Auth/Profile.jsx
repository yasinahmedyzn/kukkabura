import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../src/context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Upload, Trash2 } from "lucide-react";

const Profile = () => {
  const { user, token, login, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    email: "",
    photo: null,
    photoUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Load user profile
  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setForm({
          fullName: `${res.data.firstName} ${res.data.lastName}`,
          phone: res.data.phone || "",
          address: res.data.address || "",
          email: res.data.email,
          photo: null,
          photoUrl: res.data.photo || "",
        });
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setForm((prev) => ({ ...prev, photo: e.target.files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const formData = new FormData();
      formData.append("fullName", form.fullName);
      formData.append("phone", form.phone);
      formData.append("address", form.address);
      if (form.photo) formData.append("photo", form.photo);

      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/auth/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage(res.data.message || "Profile updated successfully");
      login(res.data.user, token); // refresh AuthContext
      setForm((prev) => ({
        ...prev,
        photo: null,
        photoUrl: res.data.user.photo || prev.photoUrl,
      }));
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePhoto = async () => {
    if (!form.photoUrl) return;
    setDeleting(true);
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/auth/profile/photo`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message || "Photo deleted successfully");
      login({ ...user, photo: "" }, token);
      setForm((prev) => ({ ...prev, photoUrl: "" }));
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete photo");
    } finally {
      setDeleting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) return <p className="p-4 text-gray-600">Loading profile...</p>;

  return (
    <div className="flex flex-col md:flex-row max-w-6xl mx-auto p-4 gap-6">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 bg-white p-4 rounded shadow space-y-2">
        {user?.role === "admin" && (
          <button
            className="w-full text-left p-2 hover:bg-gray-100 rounded"
            onClick={() => navigate("/admin-dashboard")}
          >
            Dashboard
          </button>
        )}

        <button
          className="w-full text-left p-2 hover:bg-gray-100 rounded"
          onClick={() => navigate("/orders")}
        >
          My Orders
        </button>

        <button
          className="w-full text-left p-2 hover:bg-gray-100 rounded"
          onClick={() => navigate("/profile")}
        >
          Update Profile
        </button>

        <button
          className="w-full text-left p-2 hover:bg-gray-100 rounded"
          onClick={() => navigate("/change-password")}
        >
          Change Password
        </button>

        <button
          className="w-full text-left p-2 hover:bg-gray-100 rounded text-red-600"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Profile Form */}
      <div className="flex-1 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Update Profile</h2>

        {message && <p className="mb-4 text-green-600">{message}</p>}
        {error && <p className="mb-4 text-red-600">{error}</p>}

        {/* Photo Upload */}
        <div className="mb-6">
          <label className="block mb-2 font-medium">Profile Photo</label>

          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-red-400 transition">
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={handlePhotoChange}
              className="hidden"
              id="photo-upload"
            />
            <label htmlFor="photo-upload" className="cursor-pointer">
              <Upload className="w-10 h-10 text-red-500 mx-auto" />
              <p className="text-gray-600">Drag your image here</p>
              <p className="text-xs text-gray-400 mt-1">
                (Only *.jpeg and *.png images will be accepted)
              </p>
            </label>
          </div>

          {/* Profile Picture with Delete Option */}
          <div className="mt-4 flex justify-center relative w-24 h-24 mx-auto">
            {form.photo ? (
              <img
                src={URL.createObjectURL(form.photo)}
                alt="Profile Preview"
                className="w-24 h-24 rounded-full object-cover border shadow-sm"
              />
            ) : form.photoUrl ? (
              <img
                src={form.photoUrl}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border shadow-sm"
              />
            ) : (
              <div className="w-24 h-24 rounded-full border bg-gray-100 flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}

            {(form.photo || form.photoUrl) && (
              <button
                type="button"
                onClick={handleDeletePhoto}
                disabled={deleting}
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Form Fields */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div>
            <label className="block mb-1">Full Name</label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Your Address</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1">Phone/Mobile</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1">Email Address</label>
            <input
              name="email"
              value={form.email}
              disabled
              className="w-full border px-3 py-2 rounded bg-gray-100"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 w-full sm:w-auto"
            >
              {saving ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
