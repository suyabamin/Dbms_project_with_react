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
    setError("");
    setLoading(true);

    try {
      if (loginType === "admin") {
        // For admin login, we need to check admin credentials
        // Since the backend doesn't have an explicit admin login endpoint,
        // we'll use the existing API to check if the user exists and has admin role
        const response = await API.getUsers();
        const users = response.data;
        const user = users.find(
          (u) => u.email === formData.email && u.password === formData.password && u.role === "admin"
        );

        if (user) {
          auth.setUser(user);
          auth.setToken(`token_${user.user_id}`);
          // Dispatch auth change event to update Navbar
          window.dispatchEvent(new Event("authChange"));
          navigate("/admin/dashboard");
        } else {
          setError("Invalid admin credentials");
        }
      } else {
        // For user login, check regular users
        const response = await API.getUsers();
        const users = response.data;
        const user = users.find(
          (u) => u.email === formData.email && u.password === formData.password
        );

        if (user) {
          auth.setUser(user);
          auth.setToken(`token_${user.user_id}`);
          // Dispatch auth change event to update Navbar
          window.dispatchEvent(new Event("authChange"));
          navigate("/");
        } else {
          setError("Invalid email or password");
        }
      }
    } catch (err) {
      if (err.message.includes('Network Error') || err.code === 'ECONNABORTED') {
        setError("Cannot connect to server. Please make sure the backend is running.");
      } else if (err.response?.status === 500) {
        setError("Server error. Please try again or contact administrator.");
      } else {
        setError("Login failed. Please try again.");
      }
      console.error("Login error:", err);
    } finally {
      setLoading(false);
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
