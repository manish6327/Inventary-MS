import React, { useEffect, useState } from "react";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "",
  });

  // ==========================
  // Fetch Users
  // ==========================

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await axios.get("http://localhost:3000/api/user", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });

      if (response.data.success) {
        setUsers(response.data.users);
        setFilteredUsers(response.data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ==========================
  // Handle Input
  // ==========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // ==========================
  // Add User
  // ==========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/api/user/add",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
          },
        },
      );

      if (response.data.success) {
        alert("User added successfully");

        setFormData({
          name: "",
          email: "",
          password: "",
          address: "",
          role: "",
        });

        fetchUsers();
      }
    } catch (error) {
      console.error("Error adding user:", error);

      alert(
        error.response?.data?.message || "Error adding user. Please try again.",
      );
    }
  };

  // ==========================
  // Search User
  // ==========================

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();

    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(value) ||
        user.email.toLowerCase().includes(value) ||
        user.role.toLowerCase().includes(value),
    );

    setFilteredUsers(filtered);
  };

  // ==========================
  // Delete User
  // ==========================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?",
    );

    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `http://localhost:3000/api/user/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
          },
        },
      );

      if (response.data.success) {
        alert("User deleted successfully");

        fetchUsers();
      }
    } catch (error) {
      console.error("Error deleting user:", error);

      alert(
        error.response?.data?.message ||
          "Error deleting user. Please try again.",
      );
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Users Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ======================
            ADD USER FORM
        ====================== */}

        <div className="bg-white shadow rounded-lg p-5">
          <h2 className="text-2xl font-semibold mb-5">Add New User</h2>

          <form onSubmit={handleSubmit}>
            {/* User Name */}

            <label className="block mb-2 font-medium">User Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-4 py-3 mb-4"
            />

            {/* Email */}

            <label className="block mb-2 font-medium">User Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-4 py-3 mb-4"
            />

            {/* Password */}

            <label className="block mb-2 font-medium">Password</label>

            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-4 py-3 mb-4"
            />

            {/* Address */}

            <label className="block mb-2 font-medium">User Address</label>

            <input
              type="text"
              name="address"
              placeholder="Enter Address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-4 py-3 mb-4"
            />

            {/* Role */}

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-4 py-3 mb-5"
            >
              <option value="">Select Role</option>

              <option value="admin">admin</option>

              <option value="customer">customer</option>
            </select>

            {/* Add Button */}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
            >
              Add User
            </button>
          </form>
        </div>

        {/* ======================
            USERS TABLE
        ====================== */}

        <div className="lg:col-span-2">
          {/* Search */}

          <input
            type="text"
            placeholder="Search users..."
            onChange={handleSearch}
            className="w-full border border-gray-300 rounded px-4 py-3 mb-5"
          />

          {/* Table */}

          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left p-4">ID</th>

                    <th className="text-left p-4">Name</th>

                    <th className="text-left p-4">Email</th>

                    <th className="text-left p-4">Role</th>

                    <th className="text-left p-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                      <tr key={user._id} className="border-t">
                        <td className="p-4">{index + 1}</td>

                        <td className="p-4">{user.name}</td>

                        <td className="p-4">{user.email}</td>

                        <td className="p-4 capitalize">{user.role}</td>

                        <td className="p-4">
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center p-5">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;
