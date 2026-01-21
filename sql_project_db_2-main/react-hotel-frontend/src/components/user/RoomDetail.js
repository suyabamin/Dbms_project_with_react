import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../utils/api";
import { formatCurrency, auth } from "../../utils/helpers";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/RoomDetail.css";

function RoomDetail() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    checkIn: "",
    checkOut: "",
  });

  useEffect(() => {
    fetchRoomDetails();
  }, [roomId]);

  const fetchRoomDetails = async () => {
    try {
      const [roomResponse, bookingsResponse, reviewsResponse] = await Promise.all([
        API.getRoom(roomId),
        API.getBookings(),
        API.getReviews()
      ]);
      
      setRoom(roomResponse.data);
      setBookings(bookingsResponse.data);
      
      const roomReviews = reviewsResponse.data.filter(
        (r) => r.room_id === parseInt(roomId)
      );
      setReviews(roomReviews);
    } catch (err) {
      console.error("Error fetching room details:", err);
    } finally {
      setLoading(false);
    }
  };

  const getUpcomingBookings = () => {
    const today = new Date().toISOString().split('T')[0];
    return bookings.filter(booking => 
      booking.room_id === parseInt(roomId) && 
      booking.booking_status !== 'Cancelled' &&
      booking.check_out >= today
    ).sort((a, b) => new Date(a.check_in) - new Date(b.check_in));
  };

  const formatBookingDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleBooking = () => {
    const user = auth.getUser();
    if (!user) {
      navigate("/login");
      return;
    }

    if (!bookingData.checkIn || !bookingData.checkOut) {
      alert("Please select check-in and check-out dates");
      return;
    }

    navigate("/checkout", {
      state: {
        room,
        bookingData,
      },
    });
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

  if (!room) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">Room not found</div>
      </div>
    );
  }

  return (
    <div>
      <section className="page-header bg-light py-4">
        <div className="container">
          <h1>Room {room.room_number}</h1>
        </div>
      </section>

      <div className="container py-5">
        <div className="row">
          {/* Room Image & Details */}
          <div className="col-md-6 mb-4">
            <div className="room-detail-image">
              {room.image_url ? (
                <img 
                  src={room.image_url} 
                  alt={`Room ${room.room_number}`} 
                  style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : (
                <i className="fa fa-image fa-10x text-secondary"></i>
              )}
            </div>
            <div className="mt-4">
              <h4>Room Information</h4>
              <ul className="list-group">
                <li className="list-group-item">
                  <strong>Room Number:</strong> {room.room_number}
                </li>
                <li className="list-group-item">
                  <strong>Type:</strong>{" "}
                  <span className="badge bg-info">{room.room_type}</span>
                </li>
                <li className="list-group-item">
                  <strong>Status:</strong>{" "}
                  <span className="badge bg-success">{room.status}</span>
                </li>
                <li className="list-group-item">
                  <strong>Price:</strong> {formatCurrency(room.price)}/night
                </li>
              </ul>
              
              {/* Upcoming Bookings */}
              {getUpcomingBookings().length > 0 && (
                <div className="mt-4">
                  <h5>Upcoming Bookings</h5>
                  <div className="list-group">
                    {getUpcomingBookings().slice(0, 3).map((booking, index) => (
                      <div key={booking.booking_id} className="list-group-item">
                        <div className="d-flex justify-content-between align-items-center">
                          <span>
                            <i className="fa fa-calendar text-warning"></i>{" "}
                            Booked {formatBookingDate(booking.check_in)} - {formatBookingDate(booking.check_out)}
                          </span>
                          <span className={`badge ${booking.booking_status === 'Confirmed' ? 'bg-success' : 'bg-warning'}`}>
                            {booking.booking_status}
                          </span>
                        </div>
                      </div>
                    ))}
                    {getUpcomingBookings().length > 3 && (
                      <div className="list-group-item text-muted text-center">
                        +{getUpcomingBookings().length - 3} more bookings
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Booking Form */}
          <div className="col-md-6">
            <div className="card booking-card">
              <div className="card-body">
                <h3 className="card-title">
                  {formatCurrency(room.price)} <small>/night</small>
                </h3>
                <p className="text-muted mb-4">{room.description}</p>

                <h5 className="mb-3">Book This Room</h5>

                {/* Booking Warning */}
                {getUpcomingBookings().length > 0 && (
                  <div className="alert alert-warning mb-3">
                    <i className="fa fa-exclamation-triangle"></i>{" "}
                    This room has upcoming bookings. Please check availability before booking.
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label">Check-in Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={bookingData.checkIn}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        checkIn: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Check-out Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={bookingData.checkOut}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        checkOut: e.target.value,
                      })
                    }
                  />
                </div>

                <button
                  className="btn btn-primary w-100 btn-lg"
                  onClick={handleBooking}
                >
                  <i className="fa fa-calendar"></i> Proceed to Booking
                </button>

                <div className="alert alert-info mt-3">
                  <small>
                    <i className="fa fa-info-circle"></i> Select your dates and
                    proceed to payment
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="row mt-5">
          <div className="col-12">
            <h3 className="mb-4">Guest Reviews</h3>
            {reviews.length > 0 ? (
              reviews.map((review, idx) => (
                <div key={idx} className="card mb-3">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <h6 className="card-title">{review.user_name}</h6>
                      <div>
                        {[...Array(review.rating)].map((_, i) => (
                          <i key={i} className="fa fa-star text-warning"></i>
                        ))}
                      </div>
                    </div>
                    <p className="card-text">{review.comment}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted">No reviews yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomDetail;
