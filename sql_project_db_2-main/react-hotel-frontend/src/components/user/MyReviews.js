import React, { useState, useEffect } from "react";
import API from "../../utils/api";
import { auth } from "../../utils/helpers";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/MyReviews.css";

function MyReviews() {
  const user = auth.getUser();
  const [reviews, setReviews] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    roomId: "",
    rating: 5,
    comment: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [reviewsRes, roomsRes, bookingsRes] = await Promise.all([
        API.getReviews(),
        API.getRooms(),
        API.getBookings(),
      ]);

      const userReviews = reviewsRes.data.filter(
        (r) => r.user_id === user.user_id
      );
      const userBookings = bookingsRes.data.filter(
        (b) => b.user_id === user.user_id
      );

      setReviews(userReviews);
      setRooms(roomsRes.data);
      setBookings(userBookings);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.createReview({
        user_id: user.user_id,
        room_id: parseInt(formData.roomId),
        rating: parseInt(formData.rating),
        comment: formData.comment,
      });

      setFormData({ roomId: "", rating: 5, comment: "" });
      setShowForm(false);
      fetchData();
      alert("Review posted successfully!");
    } catch (err) {
      alert("Failed to post review");
    }
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm("Delete this review?")) {
      try {
        await API.deleteReview(reviewId);
        fetchData();
        alert("Review deleted");
      } catch (err) {
        alert("Failed to delete review");
      }
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border"></div>
      </div>
    );
  }

  const bookedRoomIds = bookings
    .filter((b) => b.booking_status === "Confirmed")
    .map((b) => b.room_id);
  const reviewableRooms = rooms.filter((r) => bookedRoomIds.includes(r.room_id));

  return (
    <div>
      <section className="page-header bg-light py-4">
        <div className="container">
          <h1>My Reviews</h1>
        </div>
      </section>

      <div className="container py-5">
        <div className="row">
          <div className="col-md-8">
            <h4 className="mb-4">My Reviews</h4>
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.review_id} className="card mb-3">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h6 className="card-title">{review.room_number}</h6>
                        <div className="mb-2">
                          {[...Array(review.rating)].map((_, i) => (
                            <i
                              key={i}
                              className="fa fa-star text-warning"
                            ></i>
                          ))}
                        </div>
                      </div>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(review.review_id)}
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </div>
                    <p className="card-text">{review.comment}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted">No reviews yet</p>
            )}
          </div>

          <div className="col-md-4">
            {reviewableRooms.length > 0 && (
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title">Add a Review</h6>

                  {!showForm ? (
                    <button
                      className="btn btn-primary w-100"
                      onClick={() => setShowForm(true)}
                    >
                      <i className="fa fa-plus"></i> Write a Review
                    </button>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label className="form-label">Room</label>
                        <select
                          className="form-select"
                          value={formData.roomId}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              roomId: e.target.value,
                            })
                          }
                          required
                        >
                          <option value="">Select a room</option>
                          {reviewableRooms.map((room) => (
                            <option key={room.room_id} value={room.room_id}>
                              Room {room.room_number}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Rating</label>
                        <div className="rating">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              className={`btn btn-sm ${
                                formData.rating >= star
                                  ? "text-warning"
                                  : "text-muted"
                              }`}
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  rating: star,
                                })
                              }
                            >
                              <i className="fa fa-star"></i>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Comment</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          value={formData.comment}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              comment: e.target.value,
                            })
                          }
                          required
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        className="btn btn-primary btn-sm w-100 mb-2"
                      >
                        Post Review
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm w-100"
                        onClick={() => setShowForm(false)}
                      >
                        Cancel
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyReviews;
