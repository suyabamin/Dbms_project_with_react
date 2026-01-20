import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import API from "../../utils/api";
import { auth } from "../../utils/helpers";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/AdminLayout.css";
import "../../styles/Features.css";

function AdminFeatures() {
  const navigate = useNavigate();
  const user = auth.getUser();
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFeature, setEditingFeature] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    icon: "fa-star"
  });
  const [error, setError] = useState("");

  // Common FontAwesome icons for features
  const commonIcons = [
    { value: "fa-wifi", label: "WiFi", icon: "fa-wifi" },
    { value: "fa-utensils", label: "Restaurant", icon: "fa-utensils" },
    { value: "fa-swimming-pool", label: "Pool", icon: "fa-swimming-pool" },
    { value: "fa-dumbbell", label: "Gym", icon: "fa-dumbbell" },
    { value: "fa-spa", label: "Spa", icon: "fa-spa" },
    { value: "fa-parking", label: "Parking", icon: "fa-parking" },
    { value: "fa-concierge-bell", label: "Concierge", icon: "fa-concierge-bell" },
    { value: "fa-shower", label: "Shower", icon: "fa-shower" },
    { value: "fa-bed", label: "Bed", icon: "fa-bed" },
    { value: "fa-tv", label: "TV", icon: "fa-tv" },
    { value: "fa-snowflake", label: "AC", icon: "fa-snowflake" },
    { value: "fa-coffee", label: "Coffee", icon: "fa-coffee" },
    { value: "fa-star", label: "Star", icon: "fa-star" }
  ];

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchFeatures();
  }, [user, navigate]);

  const fetchFeatures = async () => {
    try {
      const response = await API.getFeatures();
      setFeatures(response.data);
    } catch (err) {
      console.error("Error fetching features:", err);
      setError("Failed to load features");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Feature name is required");
      return;
    }

    try {
      if (editingFeature) {
        await API.updateFeature(editingFeature.feature_id, {
          name: formData.name,
          icon: formData.icon
        });
        alert("Feature updated successfully!");
      } else {
        await API.createFeature({
          name: formData.name,
          icon: formData.icon
        });
        alert("Feature added successfully!");
      }

      setShowModal(false);
      setEditingFeature(null);
      setFormData({ name: "", icon: "fa-star" });
      fetchFeatures();
    } catch (err) {
      console.error("Error saving feature:", err);
      setError(editingFeature ? "Failed to update feature" : "Failed to add feature");
    }
  };

  const handleEdit = (feature) => {
    setEditingFeature(feature);
    setFormData({
      name: feature.feature_name,
      icon: feature.icon || "fa-star"
    });
    setShowModal(true);
  };

  const handleDelete = async (featureId) => {
    if (window.confirm("Are you sure you want to delete this feature?")) {
      try {
        await API.deleteFeature(featureId);
        alert("Feature deleted successfully!");
        fetchFeatures();
      } catch (err) {
        console.error("Error deleting feature:", err);
        alert("Failed to delete feature");
      }
    }
  };

  const handleAddNew = () => {
    setEditingFeature(null);
    setFormData({ name: "", icon: "fa-star" });
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border"></div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <div className="row g-0">
        <div className="col-md-3">
          <Sidebar />
        </div>
        <div className="col-md-9">
          <div className="admin-content p-5">
            <div className="d-flex justify-content-between align-items-center mb-5">
              <h1>Manage Features</h1>
              <button className="btn btn-primary" onClick={handleAddNew}>
                <i className="fa fa-plus"></i> Add Feature
              </button>
            </div>
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row">
          {features.map((feature) => (
            <div key={feature.feature_id} className="col-md-4 mb-4">
              <div className="card feature-card">
                <div className="card-body text-center">
                  <div className="feature-icon mb-3">
                    <i className={`fa ${feature.icon || 'fa-star'} fa-3x text-primary`}></i>
                  </div>
                  <h5 className="card-title">{feature.feature_name}</h5>
                  <div className="mt-3">
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => handleEdit(feature)}
                    >
                      <i className="fa fa-edit"></i> Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(feature.feature_id)}
                    >
                      <i className="fa fa-trash"></i> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {features.length === 0 && (
          <div className="text-center py-5">
            <i className="fa fa-star fa-4x text-muted mb-3"></i>
            <h4>No features found</h4>
            <p className="text-muted">Start by adding your first feature</p>
            <button className="btn btn-primary" onClick={handleAddNew}>
              <i className="fa fa-plus"></i> Add First Feature
            </button>
          </div>
        )}
          </div>

          {/* Add/Edit Modal */}
          {showModal && (
            <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">
                      {editingFeature ? 'Edit Feature' : 'Add New Feature'}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowModal(false)}
                    ></button>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                      {error && <div className="alert alert-danger">{error}</div>}

                      <div className="mb-3">
                        <label className="form-label">Feature Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Enter feature name"
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Icon</label>
                        <select
                          className="form-select"
                          value={formData.icon}
                          onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                        >
                          {commonIcons.map((icon) => (
                            <option key={icon.value} value={icon.value}>
                              {icon.label}
                            </option>
                          ))}
                        </select>
                        <div className="mt-2">
                          <small className="text-muted">Preview: </small>
                          <i className={`fa ${formData.icon} fa-lg text-primary`}></i>
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowModal(false)}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        {editingFeature ? 'Update Feature' : 'Add Feature'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminFeatures;