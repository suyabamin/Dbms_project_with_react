import React, { useState, useEffect } from "react";
import Sidebar from "../common/Sidebar";
import API from "../../utils/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/AdminLayout.css";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await API.getUsers();
      setUsers(response.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (userId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "banned" : "active";
    try {
      await API.updateUser(userId, { status: newStatus });
      fetchUsers();
      alert(`User ${newStatus === "banned" ? "banned" : "unbanned"}`);
    } catch (err) {
      alert("Error updating user status");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Permanently delete this user?")) {
      try {
        await API.deleteUser(userId);
        fetchUsers();
        alert("User deleted");
      } catch (err) {
        alert("Error deleting user");
      }
    }
  };

  return (
    <div className="admin-layout">
      <div className="row g-0">
        <div className="col-md-3">
          <Sidebar />
        </div>
        <div className="col-md-9">
          <div className="admin-content p-5">
            <h1 className="mb-4">Manage Users</h1>

            {loading ? (
              <div className="text-center">
                <div className="spinner-border"></div>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>User ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.user_id}>
                        <td>#{user.user_id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.phone || "N/A"}</td>
                        <td>
                          <span
                            className={`badge bg-${
                              user.status === "active" ? "success" : "danger"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td>
                          <button
                            className={`btn btn-sm me-2 ${
                              user.status === "active"
                                ? "btn-outline-danger"
                                : "btn-outline-success"
                            }`}
                            onClick={() =>
                              handleBanUser(user.user_id, user.status)
                            }
                          >
                            {user.status === "active" ? "Ban" : "Unban"}
                          </button>
                          <button
                            className="btn btn-sm btn-outline-dark"
                            onClick={() => handleDeleteUser(user.user_id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminUsers;
