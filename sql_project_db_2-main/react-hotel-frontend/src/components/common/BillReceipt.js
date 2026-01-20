import React, { useState, useEffect, useRef } from "react";
import { formatDate, formatCurrency } from "../../utils/helpers";
import API from "../../utils/api";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/BillReceipt.css";

function BillReceipt({ booking, onClose }) {
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const receiptRef = useRef(null);

  useEffect(() => {
    fetchPaymentData();
  }, [booking]);

  const fetchPaymentData = async () => {
    try {
      const payments = await API.getPayments();
      const bookingPayment = payments.data.find(p => p.booking_id === booking.booking_id);
      setPayment(bookingPayment || null);
    } catch (error) {
      console.error("Error fetching payment data:", error);
      setPayment(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!receiptRef.current) return;

    try {
      // Create canvas from the receipt element
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: receiptRef.current.offsetWidth,
        height: receiptRef.current.offsetHeight
      });

      // Calculate PDF dimensions
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      let position = 0;

      // Add the image to PDF
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add new pages if content is longer than one page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download the PDF
      const fileName = `HotelBook_Receipt_${booking.booking_id}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  if (!booking) return null;
  if (loading) {
    return (
      <div className="bill-receipt-overlay" onClick={onClose}>
        <div className="bill-receipt-container text-center py-5">
          <div className="spinner-border"></div>
          <p className="mt-3">Loading receipt...</p>
        </div>
      </div>
    );
  }

  // Calculate booking duration and total
  const checkIn = new Date(booking.check_in);
  const checkOut = new Date(booking.check_out);
  const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

  const roomRate = booking.price || 0;
  const subtotal = roomRate * nights;
  const taxRate = 0.18; // 18% GST
  const taxAmount = subtotal * taxRate;
  const totalAmount = subtotal + taxAmount;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bill-receipt-overlay" onClick={onClose}>
      <div className="bill-receipt-container" ref={receiptRef} onClick={(e) => e.stopPropagation()}>
        <div className="bill-receipt-header">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="hotel-name">HotelBook</h2>
              <p className="hotel-address">123 Luxury Street, City Center<br />Phone: +1-234-567-8900</p>
            </div>
            <div className="text-end">
              <h4>RECEIPT</h4>
              <p className="receipt-number">#{booking.booking_id.toString().padStart(6, '0')}</p>
              <p className="receipt-date">Date: {formatDate(new Date())}</p>
            </div>
          </div>
        </div>

        <div className="bill-receipt-body">
          <div className="guest-info">
            <h5>Guest Information</h5>
            <div className="row">
              <div className="col-md-6">
                <p><strong>Name:</strong> {booking.user_name}</p>
                <p><strong>Booking ID:</strong> #{booking.booking_id}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Check-in:</strong> {formatDate(booking.check_in)}</p>
                <p><strong>Check-out:</strong> {formatDate(booking.check_out)}</p>
              </div>
            </div>
          </div>

          <div className="room-info">
            <h5>Room Details</h5>
            <div className="row">
              <div className="col-md-6">
                <p><strong>Room Number:</strong> {booking.room_number}</p>
                <p><strong>Room Type:</strong> {booking.room_type || 'Standard'}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Status:</strong> <span className={`badge bg-${booking.booking_status === 'Confirmed' ? 'success' : booking.booking_status === 'Pending' ? 'warning' : 'danger'}`}>{booking.booking_status}</span></p>
                <p><strong>Nights:</strong> {nights}</p>
              </div>
            </div>
          </div>

          <div className="billing-details">
            <h5>Charges Breakdown</h5>
            <table className="billing-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th className="text-center">Quantity</th>
                  <th className="text-center">Rate</th>
                  <th className="text-end">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Room Charge (Room {booking.room_number})</td>
                  <td className="text-center">{nights} nights</td>
                  <td className="text-center">{formatCurrency(roomRate)}</td>
                  <td className="text-end">{formatCurrency(subtotal)}</td>
                </tr>
                <tr className="tax-row">
                  <td>Tax (GST 18%)</td>
                  <td className="text-center">-</td>
                  <td className="text-center">-</td>
                  <td className="text-end">{formatCurrency(taxAmount)}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="total-row">
                  <td colSpan="3"><strong>Total Amount</strong></td>
                  <td className="text-end"><strong>{formatCurrency(totalAmount)}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="payment-info">
            <h5>Payment Information</h5>
            <div className="row">
              <div className="col-md-6">
                <p><strong>Payment Method:</strong> {payment?.payment_method || 'Cash'}</p>
                <p><strong>Payment Status:</strong> <span className={`badge ${payment?.payment_status === 'Completed' || payment?.payment_status === 'Paid' ? 'bg-success' : payment?.payment_status === 'Pending' ? 'bg-warning' : 'bg-secondary'}`}>{payment?.payment_status === 'Completed' ? 'Paid' : payment?.payment_status || 'Unpaid'}</span></p>
              </div>
              <div className="col-md-6">
                <p><strong>Booking Date:</strong> {formatDate(booking.created_at || new Date())}</p>
                <p><strong>Confirmation Number:</strong> HB{booking.booking_id.toString().padStart(6, '0')}</p>
                {payment?.payment_date && (
                  <p><strong>Payment Date:</strong> {formatDate(payment.payment_date)}</p>
                )}
              </div>
            </div>
          </div>

          <div className="terms-conditions">
            <h6>Terms & Conditions</h6>
            <ul className="small">
              <li>Check-in time: 2:00 PM, Check-out time: 12:00 PM</li>
              <li>Cancellation policy: Free cancellation up to 24 hours before check-in</li>
              <li>All rates are inclusive of applicable taxes</li>
              <li>This receipt serves as proof of booking</li>
              <li>Payment can be made via Cash, Paytm, or other accepted methods</li>
              {payment?.payment_method === 'Cash' && payment?.payment_status !== 'Completed' && payment?.payment_status !== 'Paid' && (
                <li><strong>For cash payments: Please pay at reception upon check-in</strong></li>
              )}
            </ul>
          </div>
        </div>

        <div className="bill-receipt-footer">
          <div className="d-flex justify-content-between">
            <div>
              <p className="thank-you">Thank you for choosing HotelBook!</p>
              <p className="contact-info">For inquiries, contact us at support@hotelbook.com</p>
              {(!payment || payment.payment_status === 'Pending') && (
                <div className="alert alert-warning mt-2 mb-0 py-2 px-3" style={{fontSize: '0.85rem'}}>
                  <i className="fa fa-exclamation-triangle"></i> 
                  <strong> Payment Required:</strong> {payment?.payment_method === 'Cash' ? 'Please pay cash at reception upon check-in.' : 'Please complete payment to confirm booking.'}
                </div>
              )}
            </div>
            <div className="action-buttons">
              <button className="btn btn-success me-2" onClick={handleDownloadPDF}>
                <i className="fa fa-download"></i> Download PDF
              </button>
              <button className="btn btn-primary me-2" onClick={handlePrint}>
                <i className="fa fa-print"></i> Print
              </button>
              <button className="btn btn-secondary" onClick={onClose}>
                <i className="fa fa-times"></i> Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BillReceipt;