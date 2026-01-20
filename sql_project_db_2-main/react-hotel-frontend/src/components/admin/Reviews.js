import React, { useState, useEffect } from "react";
import Sidebar from "../common/Sidebar";
import API from "../../utils/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/AdminLayout.css";

function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await API.getReviews();
      setReviews(response.data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("Delete this review?")) {
      try {
        await API.deleteReview(reviewId);
        fetchReviews();
        alert("Review deleted");
      } catch (err) {
        alert("Error deleting review");
      }
    }
  };

  return (
    <div className="admin-layout">
      <div className="row g-0">
        <div className="col-md-3">
          <Sidebar />
        </div>
        <div className="col-md-9">
          <div className="admin-content p-5">
            <h1 className="mb-4">Review Management</h1>

            {loading ? (
              <div className="text-center">
                <div className="spinner-border"></div>
              </div>
            ) : reviews.length > 0 ? (
              <div className="row">
                {reviews.map((review) => (
                  <div key={review.review_id} className="col-md-6 mb-4">
                    <div className="card">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6 className="card-title">
                              {review.user_name} - Room {review.room_number}
                            </h6>
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
                            onClick={() =>
                              handleDeleteReview(review.review_id)
                            }
                          >
                            Delete
                          </button>
                        </div>
                        <p className="card-text small">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted">No reviews yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminReviews;
