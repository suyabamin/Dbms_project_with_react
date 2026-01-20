import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../utils/api";
import { formatCurrency } from "../../utils/helpers";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/Rooms.css";

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    roomType: "",
    maxPrice: 10000,
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await API.getRooms();
      setRooms(response.data);
      setFilteredRooms(response.data);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const applyFilters = (filterObj) => {
    let filtered = rooms;

    if (filterObj.roomType) {
      filtered = filtered.filter(
        (room) => room.room_type === filterObj.roomType
      );
    }

    if (filterObj.maxPrice) {
      filtered = filtered.filter((room) => room.price <= filterObj.maxPrice);
    }

    filtered = filtered.filter((room) => room.status === "Available");
    setFilteredRooms(filtered);
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
    <div>
      {/* Header */}
      <section className="page-header bg-light py-4">
        <div className="container">
          <h1>Available Rooms</h1>
          <p className="text-muted">
            Find your perfect room from our collection
          </p>
        </div>
      </section>

      <div className="container py-5">
        <div className="row">
          {/* Filters */}
          <div className="col-md-3 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">
                  <i className="fa fa-filter"></i> Filters
                </h5>

                <div className="mb-3">
                  <label className="form-label">Room Type</label>
                  <select
                    className="form-select"
                    name="roomType"
                    value={filters.roomType}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Types</option>
                    <option value="Single">Single</option>
                    <option value="Double">Double</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Suite">Suite</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Max Price: {formatCurrency(filters.maxPrice)}
                  </label>
                  <input
                    type="range"
                    className="form-range"
                    min="1000"
                    max="10000"
                    step="500"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                  />
                </div>

                <button
                  className="btn btn-outline-primary w-100"
                  onClick={() => {
                    setFilters({ roomType: "", maxPrice: 10000 });
                    setFilteredRooms(rooms.filter(r => r.status === "Available"));
                  }}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Rooms List */}
          <div className="col-md-9">
            {filteredRooms.length > 0 ? (
              <div className="row">
                {filteredRooms.map((room) => (
                  <div key={room.room_id} className="col-md-6 mb-4">
                    <div className="card room-card">
                      <div className="room-image">
                        <i className="fa fa-image fa-5x text-secondary"></i>
                      </div>
                      <div className="card-body">
                        <h5 className="card-title">
                          Room {room.room_number}
                        </h5>
                        <p className="text-muted">
                          <span className="badge bg-info">
                            {room.room_type}
                          </span>
                        </p>
                        <p className="card-text text-truncate">
                          {room.description}
                        </p>
                        <div className="d-flex justify-content-between align-items-center">
                          <h4 className="text-primary mb-0">
                            {formatCurrency(room.price)}
                            <small className="text-muted fs-6">/night</small>
                          </h4>
                          <Link
                            to={`/room/${room.room_id}`}
                            className="btn btn-primary btn-sm"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="alert alert-info">
                <i className="fa fa-info-circle"></i> No rooms found matching
                your filters.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Rooms;
