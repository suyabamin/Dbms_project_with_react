import React, { useState, useEffect } from "react";
import Sidebar from "../common/Sidebar";
import API from "../../utils/api";
import { formatDate } from "../../utils/helpers";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/AdminLayout.css";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await API.getBookings();
      setBookings(response.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, field, value) => {
    try {
      const booking = bookings.find((b) => b.booking_id === bookingId);
      const updateData = {
        ...booking,
        [field === "booking" ? "booking_status" : "arrival_status"]: value,
      };
      delete updateData.user_id;
      delete updateData.room_id;

      await API.updateBooking(bookingId, updateData);
      fetchBookings();
      alert("Booking updated");
    } catch (err) {
      alert("Error updating booking");
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      Pending: "warning",
      Confirmed: "success",
      Cancelled: "danger",
      "Not Arrived": "secondary",
      Arrived: "info",
      Departed: "success",
    };
    return colors[status] || "secondary";
  };

  return (
    <div className="admin-layout">
      <div className="row g-0">
        <div className="col-md-3">
          <Sidebar />
        </div>
        <div className="col-md-9">
          <div className="admin-content p-5">
            <h1 className="mb-4">Booking Management</h1>

            {loading ? (
              <div className="text-center">
                <div className="spinner-border"></div>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover table-sm">
                  <thead className="table-light">
                    <tr>
                      <th>Booking ID</th>
                      <th>Guest</th>
                      <th>Room</th>
                      <th>Check-in</th>
                      <th>Check-out</th>
                      <th>Booking Status</th>
                      <th>Arrival Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.booking_id}>
                        <td>#{booking.booking_id}</td>
                        <td>{booking.user_name}</td>
                        <td>{booking.room_number}</td>
                        <td>{formatDate(booking.check_in)}</td>
                        <td>{formatDate(booking.check_out)}</td>
                        <td>
                          <select
                            className="form-select form-select-sm"
                            value={booking.booking_status}
                            onChange={(e) =>
                              handleStatusChange(
                                booking.booking_id,
                                "booking",
                                e.target.value
                              )
                            }
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td>
                          <select
                            className="form-select form-select-sm"
                            value={booking.arrival_status}
                            onChange={(e) =>
                              handleStatusChange(
                                booking.booking_id,
                                "arrival",
                                e.target.value
                              )
                            }
                          >
                            <option value="Not Arrived">Not Arrived</option>
                            <option value="Arrived">Arrived</option>
                            <option value="Departed">Departed</option>
                          </select>
                        </td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary">
                            Invoice
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

export default AdminBookings;
