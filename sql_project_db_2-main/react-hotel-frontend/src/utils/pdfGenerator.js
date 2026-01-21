import { jsPDF } from "jspdf";

/**
 * Generate a booking confirmation PDF
 * @param {Object} booking - The booking object containing all booking details
 * @param {Object} room - The room object
 * @param {Object} user - The user object
 */
export const generateBookingPDF = async (booking, room, user) => {
  const doc = new jsPDF();

  // Add the hotel logo
  try {
    const logoUrl = "https://selective-gray-xhab2ktkpn.edgeone.app/6-01-removebg-preview.png";
    
    // Load the image and wait for it to load
    const imgData = await loadImage(logoUrl);
    
    // Add logo to the top left corner
    doc.addImage(imgData, 'PNG', 20, 10, 40, 20); // x, y, width, height
    
    // Title
    doc.setFontSize(22);
    doc.text("HOTEL BOOKING RECEIPT", 105, 20, null, null, "center");

    // Add logo/text space
    doc.setFontSize(12);
    doc.text("HotelBook", 70, 25); // Position text next to the larger logo

    // Draw line
    doc.line(20, 35, 190, 35);
    
    // Continue with the rest of the PDF content...
    addBookingDetails(doc, booking, room, user);
  } catch (error) {
    console.error('Error adding logo to PDF:', error);
    // If logo fails to load, continue without it
    // Title
    doc.setFontSize(22);
    doc.text("HOTEL BOOKING RECEIPT", 105, 20, null, null, "center");

    // Add logo/text space
    doc.setFontSize(12);
    doc.text("HotelBook", 20, 30);

    // Draw line
    doc.line(20, 35, 190, 35);
    
    // Continue with the rest of the PDF content...
    addBookingDetails(doc, booking, room, user);
  }
  
  // Save the PDF
  doc.save(`Booking_Receipt_${booking.booking_id}.pdf`);
};

// Helper function to load image
function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const dataUrl = canvas.toDataURL('image/png');
      resolve(dataUrl);
    };
    img.onerror = function() {
      reject(new Error('Failed to load image'));
    };
    img.src = url;
  });
}

// Helper function to add booking details to the PDF
function addBookingDetails(doc, booking, room, user) {

  // Booking Details
  doc.setFontSize(16);
  doc.text("Booking Confirmation", 20, 50);

  // Booking Information
  doc.setFontSize(12);
  doc.text(`Booking ID: #${booking.booking_id}`, 20, 65);
  doc.text(`Booking Date: ${new Date().toLocaleDateString()}`, 20, 72);
  doc.text(`Booking Status: ${booking.booking_status}`, 20, 79);

  // Guest Information
  doc.setFontSize(14);
  doc.text("Guest Information", 20, 95);
  
  doc.setFontSize(12);
  doc.text(`Name: ${user.name}`, 20, 105);
  doc.text(`Email: ${user.email}`, 20, 112);
  doc.text(`Phone: ${user.phone || 'N/A'}`, 20, 119);

  // Room Information
  doc.setFontSize(14);
  doc.text("Room Information", 20, 135);
  
  doc.setFontSize(12);
  doc.text(`Room Number: ${room.room_number}`, 20, 145);
  doc.text(`Room Type: ${room.room_type}`, 20, 152);
  doc.text(`Description: ${room.description || 'N/A'}`, 20, 159);

  // Dates
  doc.text(`Check-in: ${new Date(booking.check_in).toLocaleDateString()}`, 20, 166);
  doc.text(`Check-out: ${new Date(booking.check_out).toLocaleDateString()}`, 20, 173);

  // Calculate nights
  const checkIn = new Date(booking.check_in);
  const checkOut = new Date(booking.check_out);
  const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  doc.text(`Duration: ${nights} night(s)`, 20, 180);

  // Pricing
  doc.setFontSize(14);
  doc.text("Payment Information", 20, 195);
  
  doc.setFontSize(12);
  doc.text(`Room Rate: ${formatCurrency(room.price)} per night`, 20, 205);
  doc.text(`Nights: ${nights}`, 20, 212);
  doc.text(`Subtotal: ${formatCurrency(room.price * nights)}`, 20, 219);
  doc.text(`Tax/Fees: ${formatCurrency(0)}`, 20, 226);
  doc.text(`Total Amount: ${formatCurrency(room.price * nights)}`, 20, 233);

  // Thank you message
  doc.setFontSize(12);
  doc.text("Thank you for choosing HotelBook!", 20, 250);
  doc.text("We hope you enjoy your stay.", 20, 257);
}

// Helper function to format currency for the PDF
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};