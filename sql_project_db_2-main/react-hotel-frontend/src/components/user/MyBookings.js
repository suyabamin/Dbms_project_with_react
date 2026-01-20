import React, { useState, useEffect } from "react";
import API from "../../utils/api";
import { auth, formatDate } from "../../utils/helpers";
import BillReceipt from "../common/BillReceipt";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/MyBookings.css";

function MyBookings() {
  const user = auth.getUser();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptBooking, setReceiptBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await API.getBookings();
      const userBookings = response.data.filter(
        (b) => b.user_id === user.user_id
      );
      setBookings(userBookings);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await API.updateBooking(bookingId, {
          booking_status: "Cancelled",
        });
        fetchBookings();
        alert("Booking cancelled successfully");
      } catch (err) {
        alert("Failed to cancel booking");
      }
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      Pending: "warning",
      Confirmed: "success",
      Cancelled: "danger",
    };
    return colors[status] || "secondary";
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border"></div>
      </div>
    );
  }

  return (
    <div>
      <section className="page-header bg-light py-4">
        <div className="container">
          <h1>My Bookings</h1>
        </div>
      </section>

      <div className="container py-5">
        {bookings.length > 0 ? (
          <div className="row">
            {bookings.map((booking) => (
              <div key={booking.booking_id} className="col-md-6 mb-4">
                <div className="card booking-card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h5 className="card-title">
                        Room {booking.room_number}
                      </h5>
                      <span
                        className={`badge bg-${getStatusBadge(
                          booking.booking_status
                        )}`}
                      >
                        {booking.booking_status}
                      </span>
                    </div>

                    <div className="booking-details">
                      <p className="mb-2">
                        <strong>Check-in:</strong> {formatDate(booking.check_in)}
                      </p>
                      <p className="mb-2">
                        <strong>Check-out:</strong>{" "}
                        {formatDate(booking.check_out)}
                      </p>
                      <p className="mb-2">
                        <strong>Status:</strong> {booking.arrival_status}
                      </p>
                      <p className="mb-3">
                        <strong>Booking ID:</strong> #{booking.booking_id}
                      </p>
                    </div>

                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-success"
                        onClick={() => {
                          setReceiptBooking(booking);
                          setShowReceipt(true);
                        }}
                      >
                        <i className="fa fa-receipt"></i> Receipt
                      </button>
                      {booking.booking_status === "Pending" && (
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleCancel(booking.booking_id)}
                        >
                          <i className="fa fa-trash"></i> Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-info">
            <i className="fa fa-info-circle"></i> You haven't made any bookings
            yet. <a href="/rooms">Browse rooms</a> to get started!
          </div>
        )}
      </div>

      {/* Bill Receipt Modal */}
      {showReceipt && (
        <BillReceipt
          booking={receiptBooking}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </div>
  );
}

export default MyBookings;
