import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "../../utils/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/Auth.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      // Use the password reset API endpoint
      const response = await API.passwordReset(email);
      setEmailSent(true);
      setMessage(response.data.message);

      // Log for demo purposes
      console.log(`Password reset requested for: ${email}`);

    } catch (err) {
      console.error("Password reset error:", err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Failed to process password reset request. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="text-center mb-4">
          <i className="fa fa-key fa-3x text-primary"></i>
          <h2 className="mt-3">Reset Password</h2>
          <p className="text-muted">Enter your email to receive password reset instructions</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        {!emailSent ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email address"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 mb-3"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Instructions"}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <div className="alert alert-info">
              <i className="fa fa-envelope"></i>
              <p className="mb-2">Check your email for password reset instructions.</p>
              <small className="text-muted">
                (In this demo, no actual email is sent. Use the demo credentials to login.)
              </small>
            </div>
          </div>
        )}

        <hr />
        <div className="text-center">
          <p>
            Remember your password?{' '}
            <Link to="/login" className="text-primary">
              Back to Login
            </Link>
          </p>
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="text-primary">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;