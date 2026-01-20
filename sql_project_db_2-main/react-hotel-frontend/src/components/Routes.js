import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { auth } from "../utils/helpers";

// Auth
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import ForgotPassword from "../components/auth/ForgotPassword";

// User Pages
import Home from "../components/user/Home";
import Rooms from "../components/user/Rooms";
import RoomDetail from "../components/user/RoomDetail";
import Checkout from "../components/user/Checkout";
import Profile from "../components/user/Profile";
import MyBookings from "../components/user/MyBookings";
import MyReviews from "../components/user/MyReviews";
import Facilities from "../components/user/Facilities";
import About from "../components/user/About";
import Contact from "../components/user/Contact";

// Admin Pages
import AdminDashboard from "../components/admin/Dashboard";
import AdminRooms from "../components/admin/Rooms";
import AdminUsers from "../components/admin/Users";
import AdminBookings from "../components/admin/Bookings";
import AdminReviews from "../components/admin/Reviews";
import AdminFeatures from "../components/admin/Features";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(auth.getUser());

  useEffect(() => {
    const handleAuthChange = () => {
      setUser(auth.getUser());
    };

    window.addEventListener("authChange", handleAuthChange);
    return () => window.removeEventListener("authChange", handleAuthChange);
  }, []);

  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const [user, setUser] = useState(auth.getUser());

  useEffect(() => {
    const handleAuthChange = () => {
      setUser(auth.getUser());
    };

    window.addEventListener("authChange", handleAuthChange);
    return () => window.removeEventListener("authChange", handleAuthChange);
  }, []);

  return user?.role === "admin" ? children : <Navigate to="/" />;
};

function AppRoutes() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: "calc(100vh - 200px)" }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/room/:roomId" element={<RoomDetail />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* User Protected Routes */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-reviews"
            element={
              <ProtectedRoute>
                <MyReviews />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/rooms"
            element={
              <AdminRoute>
                <AdminRooms />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <AdminRoute>
                <AdminBookings />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/reviews"
            element={
              <AdminRoute>
                <AdminReviews />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/features"
            element={
              <AdminRoute>
                <AdminFeatures />
              </AdminRoute>
            }
          />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default AppRoutes;
