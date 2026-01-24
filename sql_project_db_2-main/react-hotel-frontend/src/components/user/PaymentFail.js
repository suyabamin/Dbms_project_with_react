import React, { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import API from "../../utils/api";
import "bootstrap/dist/css/bootstrap.min.css";

function PaymentFail() {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("booking_id");

  useEffect(() => {
    // Cancel the unpaid booking
    const cancelBooking = async () => {
      if (bookingId) {
        try {
          await API.cancelUnpaidBooking({ booking_id: bookingId });
        } catch (err) {
          console.error("Error cancelling booking:", err);
        }
      }
    };
    
    cancelBooking();
  }, [bookingId]);

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow text-center">
            <div className="card-body py-5">
              <div className="mb-4">
                <span style={{fontSize: "80px"}}>❌</span>
              </div>
              
              <h2 className="text-danger mb-3">Payment Failed</h2>
              
              <p className="lead text-muted mb-4">
                Unfortunately, your payment could not be processed. Your booking has been cancelled.
              </p>
              
              <div className="alert alert-warning">
                <i className="fa fa-exclamation-triangle me-2"></i>
                No amount has been deducted from your account.
              </div>
              
              <div className="d-grid gap-2">
                <Link to="/rooms" className="btn btn-primary btn-lg">
                  <i className="fa fa-redo me-2"></i>
                  Try Again
                </Link>
                
                <Link to="/" className="btn btn-outline-secondary">
                  <i className="fa fa-home me-2"></i>
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentFail;
