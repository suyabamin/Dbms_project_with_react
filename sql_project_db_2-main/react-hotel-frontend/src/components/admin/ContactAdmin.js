import React, { useState, useEffect } from "react";
import API from "../../utils/api";
import "bootstrap/dist/css/bootstrap.min.css";

function ContactAdmin() {
  const [settings, setSettings] = useState({});
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("settings");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [settingsResponse, messagesResponse] = await Promise.all([
        API.getSettings(),
        API.getContactMessages()
      ]);

      // Convert settings array to object
      const settingsObj = {};
      settingsResponse.data.forEach(setting => {
        settingsObj[setting.setting_key] = setting.setting_value;
      });

      setSettings(settingsObj);
      setMessages(messagesResponse.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = async () => {
    try {
      await API.updateSettings(settings);
      alert("Contact information updated successfully!");
    } catch (err) {
      console.error("Error updating settings:", err);
      alert("Failed to update contact information");
    }
  };

  const updateMessageStatus = async (messageId, status) => {
    try {
      await API.updateContactMessage(messageId, { status });
      setMessages(prev =>
        prev.map(msg =>
          msg.message_id === messageId ? { ...msg, status } : msg
        )
      );
    } catch (err) {
      console.error("Error updating message:", err);
    }
  };

  const deleteMessage = async (messageId) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
      await API.deleteContactMessage(messageId);
      setMessages(prev => prev.filter(msg => msg.message_id !== messageId));
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Contact Management</h2>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            Contact Information
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "messages" ? "active" : ""}`}
            onClick={() => setActiveTab("messages")}
          >
            Messages ({messages.length})
          </button>
        </li>
      </ul>

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div className="card">
          <div className="card-header">
            <h5>Edit Contact Information</h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Address Line 1</label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings.contact_address_line1 || ""}
                    onChange={(e) => handleSettingChange("contact_address_line1", e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Address Line 2</label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings.contact_address_line2 || ""}
                    onChange={(e) => handleSettingChange("contact_address_line2", e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings.contact_phone || ""}
                    onChange={(e) => handleSettingChange("contact_phone", e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    value={settings.contact_email || ""}
                    onChange={(e) => handleSettingChange("contact_email", e.target.value)}
                  />
                </div>
              </div>
            </div>
            <button className="btn btn-primary" onClick={saveSettings}>
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Messages Tab */}
      {activeTab === "messages" && (
        <div className="card">
          <div className="card-header">
            <h5>Contact Messages</h5>
          </div>
          <div className="card-body">
            {messages.length === 0 ? (
              <p className="text-muted">No messages received yet.</p>
            ) : (
              <div className="list-group">
                {messages.map((message) => (
                  <div key={message.message_id} className="list-group-item">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h6 className="mb-0">{message.subject || "No Subject"}</h6>
                          <div>
                            <span className={`badge me-2 ${
                              message.status === 'unread' ? 'bg-danger' : 'bg-success'
                            }`}>
                              {message.status}
                            </span>
                            <small className="text-muted">
                              {new Date(message.created_at).toLocaleString()}
                            </small>
                          </div>
                        </div>
                        <p className="mb-2"><strong>From:</strong> {message.name} ({message.email})</p>
                        {message.phone && <p className="mb-2"><strong>Phone:</strong> {message.phone}</p>}
                        <p className="mb-0">{message.message}</p>
                      </div>
                      <div className="ms-3">
                        {message.status === 'unread' && (
                          <button
                            className="btn btn-sm btn-success me-2"
                            onClick={() => updateMessageStatus(message.message_id, 'read')}
                          >
                            Mark Read
                          </button>
                        )}
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => deleteMessage(message.message_id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ContactAdmin;