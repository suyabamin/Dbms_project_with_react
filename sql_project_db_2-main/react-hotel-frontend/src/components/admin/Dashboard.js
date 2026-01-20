import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import API from "../../utils/api";
import { auth } from "../../utils/helpers";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/AdminLayout.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const user = auth.getUser();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRooms: 0,
    totalBookings: 0,
    totalReviews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== "admin") {
      navigate("/");
      return;
    }
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [users, rooms, bookings, reviews] = await Promise.all([
        API.getUsers(),
        API.getRooms(),
        API.getBookings(),
        API.getReviews(),
      ]);

      setStats({
        totalUsers: users.data.length,
        totalRooms: rooms.data.length,
        totalBookings: bookings.data.length,
        totalReviews: reviews.data.length,
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
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
            <h1 className="mb-5">Admin Dashboard</h1>

            {loading ? (
              <div className="text-center">
                <div className="spinner-border"></div>
              </div>
            ) : (
              <div className="row">
                <div className="col-md-6 mb-4">
                  <div className="stat-card bg-primary text-white p-4 rounded">
                    <h6 className="opacity-75">Total Users</h6>
                    <h2 className="mb-0">{stats.totalUsers}</h2>
                  </div>
                </div>
                <div className="col-md-6 mb-4">
                  <div className="stat-card bg-success text-white p-4 rounded">
                    <h6 className="opacity-75">Total Rooms</h6>
                    <h2 className="mb-0">{stats.totalRooms}</h2>
                  </div>
                </div>
                <div className="col-md-6 mb-4">
                  <div className="stat-card bg-info text-white p-4 rounded">
                    <h6 className="opacity-75">Total Bookings</h6>
                    <h2 className="mb-0">{stats.totalBookings}</h2>
                  </div>
                </div>
                <div className="col-md-6 mb-4">
                  <div className="stat-card bg-warning text-white p-4 rounded">
                    <h6 className="opacity-75">Total Reviews</h6>
                    <h2 className="mb-0">{stats.totalReviews}</h2>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
