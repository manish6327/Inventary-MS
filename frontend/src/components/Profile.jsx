import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch profile
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("pos-token");

      if (!token) {
        setError("Please login first.");
        return;
      }

      const response = await axios.get(
        "http://localhost:3000/api/user/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        const userData = response.data.user;

        setUser(userData);
        setName(userData.name || "");
        setEmail(userData.email || "");
        setAddress(userData.address || "");
      }
    } catch (error) {
      console.error("Profile error:", error);

      setError(error.response?.data?.message || "Unable to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Edit profile
  const handleEdit = () => {
    setEditing(true);
    setSuccess("");
    setError("");
  };

  // Cancel editing
  const handleCancel = () => {
    setEditing(false);

    setName(user?.name || "");
    setEmail(user?.email || "");
    setAddress(user?.address || "");
    setPassword("");

    setError("");
    setSuccess("");
  };

  // Save profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("pos-token");

      const response = await axios.put(
        "http://localhost:3000/api/user/profile",
        {
          name,
          email,
          address,
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        const updatedUser = response.data.user;

        setUser(updatedUser);

        setName(updatedUser.name || "");
        setEmail(updatedUser.email || "");
        setAddress(updatedUser.address || "");

        setPassword("");
        setEditing(false);

        setSuccess("Profile updated successfully.");
      }
    } catch (error) {
      console.error("Update profile error:", error);

      setError(error.response?.data?.message || "Unable to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="mb-6 text-3xl font-bold text-gray-800">User Profile</h1>

        <div className="flex min-h-[300px] items-center justify-center rounded-xl bg-white shadow">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>

            <p className="text-gray-500">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Heading */}
      <h1 className="mb-6 text-3xl font-bold text-gray-800">User Profile</h1>

      {/* Messages */}
      {error && (
        <div className="mb-4 max-w-2xl rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 max-w-2xl rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-600">
          {success}
        </div>
      )}

      {/* Profile Card */}
      <div className="max-w-2xl rounded-xl bg-white p-7 shadow-md">
        {!editing ? (
          <>
            {/* Name */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Name
              </label>

              <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-700">
                {user?.name || "-"}
              </div>
            </div>

            {/* Email */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email
              </label>

              <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-700">
                {user?.email || "-"}
              </div>
            </div>

            {/* Address */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Address
              </label>

              <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-700">
                {user?.address || "-"}
              </div>
            </div>

            {/* Edit Button */}
            <button
              onClick={handleEdit}
              className="rounded-lg bg-yellow-500 px-6 py-3 font-semibold text-white transition hover:bg-yellow-600"
            >
              Edit Profile
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Email */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Address */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Address
              </label>

              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password (optional)"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-green-500 px-6 py-3 font-semibold text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="rounded-lg bg-gray-500 px-6 py-3 font-semibold text-white transition hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
