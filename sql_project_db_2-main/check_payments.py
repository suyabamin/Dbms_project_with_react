import sqlite3

conn = sqlite3.connect("hotel_booking.db")
cursor = conn.cursor()

print("Payments table:")
cursor.execute("SELECT * FROM payments")
for row in cursor.fetchall():
    print(row)

print("\nBookings table:")
cursor.execute("SELECT booking_id, user_id, room_id, check_in, check_out, booking_status FROM bookings ORDER BY booking_id")
for row in cursor.fetchall():
    print(row)

conn.close()