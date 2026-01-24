import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../../utils/api";
import { formatCurrency, auth } from "../../utils/helpers";
import "bootstrap/dist/css/bootstrap.min.css";

function PaymentSimulation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const user = auth.getUser();
  
  const bookingId = searchParams.get("booking_id");
  const amount = searchParams.get("amount");
  const tranId = searchParams.get("tran_id");
  
  const [selectedMethod, setSelectedMethod] = useState("bKash");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // 1: Select method, 2: Enter details, 3: Confirm

  useEffect(() => {
    if (!bookingId || !amount) {
      navigate("/");
    }
  }, [bookingId, amount, navigate]);

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    setStep(2);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    if (!phoneNumber || phoneNumber.length < 11) {
      setError("Please enter a valid phone number");
      return;
    }
    
    if (!pin || pin.length < 4) {
      setError("Please enter a valid PIN");
      return;
    }
    
    setStep(3);
  };

  const handleConfirmPayment = async () => {
    setLoading(true);
    setError("");
    
    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Call the backend to confirm payment
      const response = await API.simulatePaymentSuccess({
        booking_id: bookingId,
        amount: amount,
        payment_method: selectedMethod,
        transaction_id: tranId
      });
      
      if (response.data.status === "success") {
        navigate(`/payment-success?booking_id=${bookingId}&method=${selectedMethod}`);
      } else {
        throw new Error("Payment failed");
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError("Payment failed. Please try again.");
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      await API.cancelUnpaidBooking({ booking_id: bookingId });
    } catch (err) {
      console.error("Cancel error:", err);
    }
    navigate("/rooms");
  };

  if (!user) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">Please login to continue</div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header bg-success text-white text-center">
              <h4 className="mb-0">
                <i className="fa fa-mobile-alt me-2"></i>
                Mobile Payment
              </h4>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              
              {/* Step 1: Select Payment Method */}
              {step === 1 && (
                <div>
                  <h5 className="text-center mb-4">Select Payment Method</h5>
                  <p className="text-center text-muted mb-4">
                    Amount: <strong className="text-success">{formatCurrency(parseFloat(amount))}</strong>
                  </p>
                  
                  <div className="d-grid gap-3">
                    <button 
                      className="btn btn-outline-danger btn-lg d-flex align-items-center justify-content-center"
                      onClick={() => handleMethodSelect("bKash")}
                    >
                      <span className="me-2" style={{fontSize: "24px"}}>📱</span>
                      <span>Pay with <strong>bKash</strong></span>
                    </button>
                    
                    <button 
                      className="btn btn-outline-warning btn-lg d-flex align-items-center justify-content-center"
                      onClick={() => handleMethodSelect("Nagad")}
                    >
                      <span className="me-2" style={{fontSize: "24px"}}>💳</span>
                      <span>Pay with <strong>Nagad</strong></span>
                    </button>
                    
                    <button 
                      className="btn btn-outline-primary btn-lg d-flex align-items-center justify-content-center"
                      onClick={() => handleMethodSelect("Card")}
                    >
                      <span className="me-2" style={{fontSize: "24px"}}>💳</span>
                      <span>Pay with <strong>Card</strong></span>
                    </button>
                  </div>
                  
                  <hr className="my-4" />
                  
                  <button 
                    className="btn btn-secondary w-100"
                    onClick={handleCancel}
                  >
                    Cancel Payment
                  </button>
                </div>
              )}
              
              {/* Step 2: Enter Details */}
              {step === 2 && (
                <div>
                  <div className="text-center mb-4">
                    <span style={{fontSize: "48px"}}>
                      {selectedMethod === "bKash" ? "📱" : selectedMethod === "Nagad" ? "💳" : "💳"}
                    </span>
                    <h5 className="mt-2">{selectedMethod} Payment</h5>
                    <p className="text-muted">
                      Amount: <strong className="text-success">{formatCurrency(parseFloat(amount))}</strong>
                    </p>
                    <p className="text-muted small">
                      Recipient: <strong>01516512119</strong>
                    </p>
                  </div>
                  
                  <form onSubmit={handlePaymentSubmit}>
                    <div className="mb-3">
                      <label className="form-label">
                        {selectedMethod === "Card" ? "Card Number" : `${selectedMethod} Number`}
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder={selectedMethod === "Card" ? "1234 5678 9012 3456" : "01XXXXXXXXX"}
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        maxLength={selectedMethod === "Card" ? 16 : 11}
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="form-label">
                        {selectedMethod === "Card" ? "CVV" : "PIN"}
                      </label>
                      <input
                        type="password"
                        className="form-control form-control-lg"
                        placeholder={selectedMethod === "Card" ? "123" : "****"}
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        maxLength={selectedMethod === "Card" ? 3 : 6}
                        required
                      />
                    </div>
                    
                    <div className="d-grid gap-2">
                      <button type="submit" className="btn btn-success btn-lg">
                        Continue to Pay {formatCurrency(parseFloat(amount))}
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary"
                        onClick={() => setStep(1)}
                      >
                        Back
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              {/* Step 3: Confirm Payment */}
              {step === 3 && (
                <div className="text-center">
                  {loading ? (
                    <div>
                      <div className="spinner-border text-success mb-3" style={{width: "3rem", height: "3rem"}} role="status">
                        <span className="visually-hidden">Processing...</span>
                      </div>
                      <h5>Processing Payment...</h5>
                      <p className="text-muted">Please wait while we process your {selectedMethod} payment</p>
                    </div>
                  ) : (
                    <div>
                      <h5 className="mb-4">Confirm Payment</h5>
                      <div className="bg-light p-3 rounded mb-4">
                        <p className="mb-1"><strong>Method:</strong> {selectedMethod}</p>
                        <p className="mb-1"><strong>Amount:</strong> {formatCurrency(parseFloat(amount))}</p>
                        <p className="mb-1"><strong>From:</strong> {phoneNumber}</p>
                        <p className="mb-0"><strong>To:</strong> 01516512119</p>
                      </div>
                      
                      <div className="d-grid gap-2">
                        <button 
                          className="btn btn-success btn-lg"
                          onClick={handleConfirmPayment}
                        >
                          Confirm & Pay
                        </button>
                        <button 
                          className="btn btn-outline-secondary"
                          onClick={() => setStep(2)}
                        >
                          Back
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="card-footer text-center text-muted small">
              <i className="fa fa-lock me-1"></i>
              Secure Payment - Your information is protected
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentSimulation;
