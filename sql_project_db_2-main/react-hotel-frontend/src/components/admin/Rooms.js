import React, { useState, useEffect } from "react";
import Sidebar from "../common/Sidebar";
import API from "../../utils/api";
import { formatCurrency } from "../../utils/helpers";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/AdminLayout.css";

function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    roomNumber: "",
    roomType: "Single",
    price: "",
    status: "Available",
    description: "",
    imageUrl: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await API.getRooms();
      setRooms(response.data);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = {
        room_number: formData.roomNumber,
        room_type: formData.roomType,
        price: parseFloat(formData.price),
        status: formData.status,
        description: formData.description,
        image_url: formData.imageUrl,
      };

      if (editingId) {
        await API.updateRoom(editingId, data);
      } else {
        await API.createRoom(data);
      }

      fetchRooms();
      resetForm();
      alert(`Room ${editingId ? "updated" : "added"} successfully`);
    } catch (err) {
      alert(`Error ${editingId ? "updating" : "adding"} room`);
    }
  };

  const handleDelete = async (roomId) => {
    if (window.confirm("Delete this room?")) {
      try {
        await API.deleteRoom(roomId);
        fetchRooms();
        alert("Room deleted");
      } catch (err) {
        alert("Error deleting room");
      }
    }
  };

  const handleEdit = (room) => {
    setFormData({
      roomNumber: room.room_number,
      roomType: room.room_type,
      price: room.price,
      status: room.status,
      description: room.description,
      imageUrl: room.image_url || "",
    });
    setEditingId(room.room_id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      roomNumber: "",
      roomType: "Single",
      price: "",
      status: "Available",
      description: "",
      imageUrl: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let fieldName;
    
    // Convert snake_case to camelCase
    if (name === "room_number") {
      fieldName = "roomNumber";
    } else if (name === "room_type") {
      fieldName = "roomType";
    } else if (name === "image_url") {
      fieldName = "imageUrl";
    } else {
      fieldName = name;
    }
    
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  return (
    <div className="admin-layout">
      <div className="row g-0">
        <div className="col-md-3">
          <Sidebar />
        </div>
        <div className="col-md-9">
          <div className="admin-content p-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1>Manage Rooms</h1>
              <button
                className="btn btn-primary"
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
              >
                <i className="fa fa-plus"></i> Add Room
              </button>
            </div>

            {showForm && (
              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="card-title">
                    {editingId ? "Edit Room" : "Add New Room"}
                  </h5>
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Room Number</label>
                        <input
                          type="text"
                          className="form-control"
                          name="room_number"
                          value={formData.roomNumber}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Room Type</label>
                        <select
                          className="form-select"
                          name="room_type"
                          value={formData.roomType}
                          onChange={handleChange}
                        >
                          <option value="Single">Single</option>
                          <option value="Double">Double</option>
                          <option value="Deluxe">Deluxe</option>
                          <option value="Suite">Suite</option>
                        </select>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Price/Night</label>
                        <input
                          type="number"
                          className="form-control"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Status</label>
                        <select
                          className="form-select"
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                        >
                          <option value="Available">Available</option>
                          <option value="Occupied">Occupied</option>
                          <option value="Maintenance">Maintenance</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        name="description"
                        rows="3"
                        value={formData.description}
                        onChange={handleChange}
                      ></textarea>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Image URL</label>
                      <input
                        type="url"
                        className="form-control"
                        name="image_url"
                        placeholder="https://example.com/room-image.jpg"
                        value={formData.imageUrl}
                        onChange={handleChange}
                      />
                      {formData.imageUrl && (
                        <div className="mt-2">
                          <img 
                            src={formData.imageUrl} 
                            alt="Room Preview" 
                            style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                            onLoad={(e) => {
                              e.target.style.display = 'block';
                            }}
                          />
                        </div>
                      )}
                    </div>

                    <button type="submit" className="btn btn-success me-2">
                      {editingId ? "Update" : "Add"} Room
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={resetForm}
                    >
                      Cancel
                    </button>
                  </form>
                </div>
              </div>
            )}

            {loading ? (
              <div className="text-center">
                <div className="spinner-border"></div>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Room No.</th>
                      <th>Type</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Image</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.map((room) => (
                      <tr key={room.room_id}>
                        <td>{room.room_number}</td>
                        <td>{room.room_type}</td>
                        <td>{formatCurrency(room.price)}</td>
                        <td>
                          <span className="badge bg-info">{room.status}</span>
                        </td>
                        <td>
                          {room.image_url ? (
                            <img 
                              src={room.image_url} 
                              alt="Room" 
                              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                              onLoad={(e) => {
                                e.target.style.display = 'block';
                              }}
                            />
                          ) : (
                            'No Image'
                          )}
                        </td>
                        <td>{room.description?.substring(0, 30)}...</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => handleEdit(room)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(room.room_id)}
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

export default AdminRooms;
