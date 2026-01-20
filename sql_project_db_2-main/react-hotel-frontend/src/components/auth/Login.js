import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../utils/api";
import { auth } from "../../utils/helpers";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/Auth.css";

function Login() {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState("user"); // 'user' or 'admin'
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🔐 Login attempt started...");
    setError("");
    setLoading(true);

    try {
      console.log("📡 Checking backend connection...");
      // Check if backend is reachable
      try {
        const healthCheck = await fetch("http://127.0.0.1:5000/health", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          mode: "cors",
        });
        
        console.log("Health check response:", healthCheck.status);
        if (!healthCheck.ok) {
          throw new Error("Backend not responding");
        }
        console.log("✅ Backend health check passed");
      } catch (healthErr) {
        console.error("❌ Backend health check failed:", healthErr);
        setError("Cannot connect to server. Backend is not running on port 5000.");
        setLoading(false);
        return;
      }

      if (loginType === "admin") {
        console.log("👨‍💼 Attempting admin login...");
        // For admin login, we need to check admin credentials
        const response = await API.getUsers();
        console.log("👥 Users fetched:", response.data.length);
        const users = response.data;
        const user = users.find(
          (u) => u.email === formData.email && u.password === formData.password && u.role === "admin"
        );

        if (user) {
          console.log("✅ Admin found:", user.name);
          auth.setUser(user);
          auth.setToken(`token_${user.user_id}`);
          window.dispatchEvent(new Event("authChange"));
          navigate("/admin/dashboard");
        } else {
          console.log("❌ Invalid admin credentials");
          setError("Invalid admin credentials");
        }
      } else {
        console.log("👤 Attempting user login...");
        const response = await API.getUsers();
        console.log("👥 Users fetched:", response.data.length);
        const users = response.data;
        const user = users.find(
          (u) => u.email === formData.email && u.password === formData.password
        );

        if (user) {
          console.log("✅ User found:", user.name);
          auth.setUser(user);
          auth.setToken(`token_${user.user_id}`);
          window.dispatchEvent(new Event("authChange"));
          navigate("/");
        } else {
          console.log("❌ Invalid email or password");
          setError("Invalid email or password");
        }
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      if (err.message.includes('Network Error') || err.code === 'ECONNABORTED' || err.message === 'Failed to fetch') {
        setError("Cannot connect to server. Backend might be down. Check console for details.");
      } else if (err.response?.status === 500) {
        setError("Server error. Please try again.");
      } else if (err.message === 'Backend not responding') {
        setError("Backend server is not responding.");
      } else {
        setError("Login failed. Please check console for details.");
      }
    } finally {
      setLoading(false);
      console.log("🔐 Login attempt finished");
    }
  };

  const clearSession = () => {
    auth.logout();
    setFormData({ email: "", password: "" });
    setError("");
    alert("Session cleared successfully!");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="text-center mb-4">
          <i className="fa fa-hotel fa-3x text-primary"></i>
          <h2 className="mt-3">HotelBook</h2>
          <p className="text-muted">Sign in to your account</p>
        </div>

        {/* Login Type Selector */}
        <div className="mb-4">
          <div className="btn-group w-100" role="group" aria-label="Login type">
            <button
              type="button"
              className={`btn ${loginType === "user" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setLoginType("user")}
            >
              User Login
            </button>
            <button
              type="button"
              className={`btn ${loginType === "admin" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setLoginType("admin")}
            >
              Admin Login
            </button>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              {loginType === "admin" ? "Admin Email" : "Email Address"}
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 mb-2"
            disabled={loading}
          >
            {loading ? "Signing in..." : `${loginType === "admin" ? "Admin" : "User"} Sign In`}
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary w-100"
            onClick={clearSession}
          >
            Clear Session
          </button>
        </form>

        <hr />
        <p className="text-center">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary">
            Register here
          </Link>
        </p>
        
        <div className="alert alert-info mt-3">
          <small>
            <strong>Demo Credentials:</strong>
            <br />
            {loginType === "admin" ? (
              <>
                Admin Email: rahim@gmail.com<br />
                Password: pass123 (as admin)
              </>
            ) : (
              <>
                Email: rahim@gmail.com<br />
                Password: pass123
              </>
            )}
          </small>
        </div>
      </div>
    </div>
  );
}

export default Login;
