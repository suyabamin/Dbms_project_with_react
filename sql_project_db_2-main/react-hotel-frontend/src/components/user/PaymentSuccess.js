import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import API from "../../utils/api";
import { auth } from "../../utils/helpers";
import { generateBookingPDF } from "../../utils/pdfGenerator";
import "bootstrap/dist/css/bootstrap.min.css";

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const user = auth.getUser();
  
  const bookingId = searchParams.get("booking_id");
  const method = searchParams.get("method") || "bKash/Nagad";
  
  const [booking, setBooking] = useState(null);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId) {
        navigate("/");
        return;
      }
      
      try {
        const bookingResponse = await API.getBooking(bookingId);
        setBooking(bookingResponse.data);
        
        if (bookingResponse.data?.room_id) {
          const roomResponse = await API.getRoom(bookingResponse.data.room_id);
          setRoom(roomResponse.data);
        }
      } catch (err) {
        console.error("Error fetching booking:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookingDetails();
  }, [bookingId, navigate]);

  const handleDownloadReceipt = () => {
    if (booking && room && user) {
      generateBookingPDF(booking, room, user);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow text-center">
            <div className="card-body py-5">
              <div className="mb-4">
                <span style={{fontSize: "80px"}}>✅</span>
              </div>
              
              <h2 className="text-success mb-3">Payment Successful!</h2>
              
              <p className="lead text-muted mb-4">
                Your payment via <strong>{method}</strong> has been received successfully.
              </p>
              
              <div className="bg-light p-4 rounded mb-4">
                <h5 className="mb-3">Booking Details</h5>
                <p className="mb-1"><strong>Booking ID:</strong> #{bookingId}</p>
                {booking && (
                  <>
                    <p className="mb-1"><strong>Status:</strong> <span className="badge bg-success">Confirmed</span></p>
                    <p className="mb-1"><strong>Check-in:</strong> {booking.check_in}</p>
                    <p className="mb-0"><strong>Check-out:</strong> {booking.check_out}</p>
                  </>
                )}
              </div>
              
              <div className="alert alert-info">
                <i className="fa fa-info-circle me-2"></i>
                Payment received to <strong>01516512119</strong> (bKash/Nagad)
              </div>
              
              <div className="d-grid gap-2">
                <button 
                  className="btn btn-success btn-lg"
                  onClick={handleDownloadReceipt}
                >
                  <i className="fa fa-download me-2"></i>
                  Download Receipt
                </button>
                
                <Link to="/my-bookings" className="btn btn-primary">
                  <i className="fa fa-list me-2"></i>
                  View My Bookings
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

export default PaymentSuccess;
