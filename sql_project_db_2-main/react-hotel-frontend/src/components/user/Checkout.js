import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../utils/api";
import { formatCurrency, calculateNights, auth } from "../../utils/helpers";
import { generateBookingPDF } from "../../utils/pdfGenerator";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/Checkout.css";

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { room, bookingData } = location.state || {};
  const user = auth.getUser();

  const [paymentData, setPaymentData] = useState({
    paymentMethod: "Paytm",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!room || !bookingData || !user) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">Invalid booking data</div>
      </div>
    );
  }

  const nights = calculateNights(bookingData.checkIn, bookingData.checkOut);
  const totalAmount = room.price * nights;

  const handleCheckout = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Create booking
      const bookingResponse = await API.createBooking({
        user_id: user.user_id,
        room_id: room.room_id,
        check_in: bookingData.checkIn,
        check_out: bookingData.checkOut,
        booking_status: "Pending",
        arrival_status: "Not Arrived",
      });

      const bookingId = bookingResponse.data.booking_id || user.user_id;

      // Create payment
      await API.createPayment({
        booking_id: bookingId,
        amount: totalAmount,
        payment_method: paymentData.paymentMethod,
        payment_status: paymentData.paymentMethod === "Cash" ? "Pending" : "Completed",
      });

      // Fetch the complete booking data to generate PDF
      const completeBooking = await API.getBooking(bookingId);
      
      // Generate booking PDF
      generateBookingPDF(completeBooking.data, room, user);
      
      alert(paymentData.paymentMethod === "Cash" 
        ? "Booking confirmed! Please pay cash at reception upon check-in and download the receipt." 
        : "Booking confirmed! Check your email for confirmation and download the receipt.");
      
      navigate("/my-bookings");
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data?.error === "Room already booked for these dates") {
        setError("Room already booked for these dates. Please select different dates.");
      } else {
        setError("Checkout failed. Please try again.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="page-header bg-light py-4">
        <div className="container">
          <h1>Checkout</h1>
        </div>
      </section>

      <div className="container py-5">
        <div className="row">
          {/* Order Summary */}
          <div className="col-md-4 mb-4 order-md-2">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Order Summary</h5>

                <hr />

                <div className="mb-3">
                  <h6>Room {room.room_number}</h6>
                  <p className="text-muted mb-2">{room.room_type} Room</p>
                  <p className="text-muted">
                    <small>{room.description}</small>
                  </p>
                </div>

                <hr />

                <div className="mb-3">
                  <p className="mb-1">
                    <strong>Check-in:</strong> {bookingData.checkIn}
                  </p>
                  <p className="mb-3">
                    <strong>Check-out:</strong> {bookingData.checkOut}
                  </p>
                  <p className="mb-3">
                    <strong>Nights:</strong> {nights}
                  </p>
                </div>

                <hr />

                <div className="d-flex justify-content-between mb-2">
                  <span>Room Price ({nights} nights)</span>
                  <span>{formatCurrency(room.price * nights)}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Taxes & Fees</span>
                  <span>{formatCurrency(0)}</span>
                </div>

                <hr />

                <div className="d-flex justify-content-between">
                  <h5>Total Amount:</h5>
                  <h5 className="text-primary">{formatCurrency(totalAmount)}</h5>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="col-md-8 order-md-1">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Guest Information</h5>

                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={user.name}
                    disabled
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={user.email}
                    disabled
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={user.phone || ""}
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Payment Method</h5>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleCheckout}>
                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        id="cash"
                        name="paymentMethod"
                        value="Cash"
                        checked={paymentData.paymentMethod === "Cash"}
                        onChange={(e) =>
                          setPaymentData({
                            ...paymentData,
                            paymentMethod: e.target.value,
                          })
                        }
                      />
                      <label className="form-check-label" htmlFor="cash">
                        <i className="fa fa-money-bill-wave"></i> Cash (Pay at Reception)
                      </label>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        id="paytm"
                        name="paymentMethod"
                        value="Paytm"
                        checked={paymentData.paymentMethod === "Paytm"}
                        onChange={(e) =>
                          setPaymentData({
                            ...paymentData,
                            paymentMethod: e.target.value,
                          })
                        }
                      />
                      <label className="form-check-label" htmlFor="paytm">
                        <i className="fa fa-wallet"></i> Paytm Wallet
                      </label>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        id="card"
                        name="paymentMethod"
                        value="Credit Card"
                        onChange={(e) =>
                          setPaymentData({
                            ...paymentData,
                            paymentMethod: e.target.value,
                          })
                        }
                      />
                      <label className="form-check-label" htmlFor="card">
                        <i className="fa fa-credit-card"></i> Credit/Debit Card
                      </label>
                    </div>
                  </div>

                  <div className="alert alert-info">
                    <small>
                      <i className="fa fa-lock"></i> This is a demo booking. No
                      real payment will be charged.
                    </small>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 btn-lg"
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Complete Booking"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
