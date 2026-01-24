import sqlite3

conn = sqlite3.connect("hotel_booking.db")
cursor = conn.cursor()

print("All bookings for room 4:")
cursor.execute("""
    SELECT booking_id, room_id, check_in, check_out, booking_status 
    FROM bookings 
    WHERE room_id = 4 
    ORDER BY booking_id
""")
for row in cursor.fetchall():
    print(row)

print("\nActive bookings for room 4 (non-cancelled):")
cursor.execute("""
    SELECT booking_id, room_id, check_in, check_out, booking_status 
    FROM bookings 
    WHERE room_id = 4 
    AND booking_status != 'Cancelled'
    ORDER BY booking_id
""")
for row in cursor.fetchall():
    print(row)

conn.close()