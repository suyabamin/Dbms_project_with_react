from flask import Flask, request, jsonify
from flask_swagger_ui import get_swaggerui_blueprint
from flask_cors import CORS
import sqlite3
import requests
import json
import time

app = Flask(__name__)

# Enable CORS for all routes with explicit configuration
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003", "http://localhost:3004", "http://127.0.0.1:3000", "http://127.0.0.1:3001", "http://127.0.0.1:3002", "http://127.0.0.1:3003", "http://127.0.0.1:3004"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

DB_FILE = "hotel_booking.db"

# ---------------- Database Helper ----------------
def init_database():
    """Initialize database with proper error handling"""
    try:
        # Import and run database creation
        import create_database
        print("✅ Database initialized successfully!")
        return True
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
        return False

def get_db():
    """Get database connection with error handling"""
    try:
        conn = sqlite3.connect(DB_FILE, timeout=20)
        conn.row_factory = sqlite3.Row
        # Test connection
        conn.execute("SELECT 1")
        return conn
    except sqlite3.Error as e:
        print(f"❌ Database connection error: {e}")
        # Try to reinitialize database
        if init_database():
            try:
                conn = sqlite3.connect(DB_FILE, timeout=20)
                conn.row_factory = sqlite3.Row
                return conn
            except sqlite3.Error as retry_error:
                print(f"❌ Retry connection failed: {retry_error}")
                raise
        else:
            raise
    except Exception as e:
        print(f"❌ Unexpected database error: {e}")
        raise

# ---------------- Swagger Setup ----------------
SWAGGER_URL = "/swagger"
API_URL = "/static/swagger.json"  # You can provide swagger.json if needed

swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={"app_name": "Hotel Booking Management System"}
)
app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)

# ---------------- Health Check ----------------
@app.route("/health")
def health_check():
    """Health check endpoint to verify database connectivity"""
    try:
        db = get_db()
        db.execute("SELECT 1")
        db.close()
        return jsonify({"status": "healthy", "database": "connected"}), 200
    except Exception as e:
        return jsonify({"status": "unhealthy", "error": str(e)}), 500

# ---------------- Root ----------------
@app.route("/")
def home():
    return "<h2>Hotel Booking Management System API is running! Go to /swagger to see API docs.</h2>"

# ================== USERS ==================
@app.route("/users", methods=["GET", "POST"])
def users():
    db = get_db()
    if request.method == "GET":
        users = db.execute("SELECT * FROM users").fetchall()
        db.close()
        return jsonify([dict(u) for u in users])

    # POST - Add new user
    data = request.get_json()
    db.execute(
        "INSERT INTO users (name, email, password, phone, status) VALUES (?, ?, ?, ?, ?)",
        (data["name"], data["email"], data["password"], data.get("phone"), data.get("status", "active"))
    )
    db.commit()
    db.close()
    return jsonify({"message": "User added"}), 201

@app.route("/users/<int:user_id>", methods=["GET", "PUT", "DELETE"])
def user_detail(user_id):
    db = get_db()
    if request.method == "GET":
        user = db.execute("SELECT * FROM users WHERE user_id=?", (user_id,)).fetchone()
        db.close()
        if user:
            return jsonify(dict(user))
        return jsonify({"error": "User not found"}), 404

    elif request.method == "PUT":
        data = request.get_json()
        
        # Get current user to preserve existing values
        current_user = db.execute("SELECT * FROM users WHERE user_id=?", (user_id,)).fetchone()
        if not current_user:
            db.close()
            return jsonify({"error": "User not found"}), 404
        
        # Prepare update values, keeping existing values if not provided
        name = data.get("name", current_user["name"])
        email = data.get("email", current_user["email"])
        password = data.get("password", current_user["password"])
        phone = data.get("phone", current_user["phone"])
        status = data.get("status", current_user["status"])
        
        db.execute("""
            UPDATE users SET name=?, email=?, password=?, phone=?, status=? WHERE user_id=?
        """, (name, email, password, phone, status, user_id))
        db.commit()
        db.close()
        return jsonify({"message": "User updated"})

    elif request.method == "DELETE":
        db.execute("DELETE FROM users WHERE user_id=?", (user_id,))
        db.commit()
        db.close()
        return jsonify({"message": "User deleted"})

# ================== ROOMS ==================
@app.route("/rooms", methods=["GET", "POST"])
def rooms():
    db = get_db()
    if request.method == "GET":
        rooms = db.execute("SELECT * FROM rooms").fetchall()
        db.close()
        return jsonify([dict(r) for r in rooms])

    data = request.get_json()
    # Check if image_url exists in the request data
    image_url = data.get("image_url", None)
    if image_url:
        db.execute(
            "INSERT INTO rooms (room_number, room_type, price, status, description, image_url) VALUES (?, ?, ?, ?, ?, ?)",
            (data["room_number"], data["room_type"], data["price"], data.get("status", "Available"), data.get("description"), image_url)
        )
    else:
        db.execute(
            "INSERT INTO rooms (room_number, room_type, price, status, description) VALUES (?, ?, ?, ?, ?)",
            (data["room_number"], data["room_type"], data["price"], data.get("status", "Available"), data.get("description"))
        )
    db.commit()
    db.close()
    return jsonify({"message": "Room added"}), 201

@app.route("/rooms/<int:room_id>", methods=["GET", "PUT", "DELETE"])
def room_detail(room_id):
    db = get_db()
    if request.method == "GET":
        room = db.execute("SELECT * FROM rooms WHERE room_id=?", (room_id,)).fetchone()
        db.close()
        if room:
            return jsonify(dict(room))
        return jsonify({"error": "Room not found"}), 404

    elif request.method == "PUT":
        data = request.get_json()
        # Check if image_url exists in the request data
        image_url = data.get("image_url")
        if image_url is not None:
            db.execute("""
                UPDATE rooms SET room_number=?, room_type=?, price=?, status=?, description=?, image_url=? WHERE room_id=?
            """, (data["room_number"], data["room_type"], data["price"], data.get("status"), data.get("description"), image_url, room_id))
        else:
            db.execute("""
                UPDATE rooms SET room_number=?, room_type=?, price=?, status=?, description=? WHERE room_id=?
            """, (data["room_number"], data["room_type"], data["price"], data.get("status"), data.get("description"), room_id))
        db.commit()
        db.close()
        return jsonify({"message": "Room updated"})

    elif request.method == "DELETE":
        db.execute("DELETE FROM rooms WHERE room_id=?", (room_id,))
        db.commit()
        db.close()
        return jsonify({"message": "Room deleted"})

# ================== BOOKINGS ==================
@app.route("/bookings", methods=["GET", "POST"])
def bookings():
    db = get_db()
    if request.method == "GET":
        bookings = db.execute("""
            SELECT b.*, u.name as user_name, r.room_number
            FROM bookings b
            JOIN users u ON b.user_id=u.user_id
            JOIN rooms r ON b.room_id=r.room_id
        """).fetchall()
        db.close()
        return jsonify([dict(b) for b in bookings])

    data = request.get_json()
    
    # Check for overlapping bookings
    room_id = data["room_id"]
    check_in = data["check_in"]
    check_out = data["check_out"]
    
    # Debug logging
    print(f"Checking overlap for room {room_id} from {check_in} to {check_out}")
    
    # First, get all bookings for this room to understand what we're dealing with
    all_bookings = db.execute("""
        SELECT booking_id, booking_status, check_in, check_out 
        FROM bookings 
        WHERE room_id = ?
        ORDER BY booking_id
    """, (room_id,)).fetchall()
    
    print(f"All bookings for room {room_id}: {all_bookings}")
    
    # Get active (non-cancelled) bookings that could cause overlap
    overlapping_bookings = db.execute("""
        SELECT booking_id, booking_status, check_in, check_out FROM bookings 
        WHERE room_id = ? 
        AND booking_status != 'Cancelled'
        AND (
            (check_in <= ? AND check_out > ?) OR
            (check_in < ? AND check_out >= ?) OR
            (check_in >= ? AND check_out <= ?)
        )
    """, (room_id, check_out, check_in, check_out, check_in, check_in, check_out)).fetchall()
    
    if overlapping_bookings:
        print(f"Found overlapping active bookings: {overlapping_bookings}")
        # Return more detailed error message
        overlapping_details = []
        for booking in overlapping_bookings:
            overlapping_details.append(f"Booking #{booking[0]} ({booking[2]} to {booking[3]})")
        
        db.close()
        return jsonify({
            "error": "Room already booked for these dates",
            "details": f"Conflicts with: {', '.join(overlapping_details)}"
        }), 400
    else:
        print("No overlapping active bookings found")
    
    db.execute(
        "INSERT INTO bookings (user_id, room_id, check_in, check_out, booking_status, arrival_status) VALUES (?, ?, ?, ?, ?, ?)",
        (data["user_id"], data["room_id"], data["check_in"], data["check_out"], data.get("booking_status", "Pending"), data.get("arrival_status", "Not Arrived"))
    )
    db.commit()
    
    # Get the created booking to return its ID
    created_booking = db.execute("SELECT * FROM bookings WHERE rowid = last_insert_rowid()").fetchone()
    db.close()
    
    print(f"Booking created successfully with ID: {created_booking['booking_id']}")
    return jsonify(dict(created_booking)), 201

@app.route("/bookings/<int:booking_id>", methods=["GET", "PUT", "DELETE"])
def booking_detail(booking_id):
    db = get_db()
    if request.method == "GET":
        booking = db.execute("SELECT * FROM bookings WHERE booking_id=?", (booking_id,)).fetchone()
        db.close()
        if booking:
            return jsonify(dict(booking))
        return jsonify({"error": "Booking not found"}), 404

    elif request.method == "PUT":
        data = request.get_json()
        
        # Get current booking to preserve existing values
        current_booking = db.execute("SELECT * FROM bookings WHERE booking_id=?", (booking_id,)).fetchone()
        if not current_booking:
            db.close()
            return jsonify({"error": "Booking not found"}), 404
        
        print(f"Updating booking {booking_id} with data: {data}")
        
        # Prepare update values, keeping existing values if not provided
        user_id = data.get("user_id", current_booking["user_id"])
        room_id = data.get("room_id", current_booking["room_id"])
        check_in = data.get("check_in", current_booking["check_in"])
        check_out = data.get("check_out", current_booking["check_out"])
        booking_status = data.get("booking_status", current_booking["booking_status"])
        arrival_status = data.get("arrival_status", current_booking["arrival_status"])
        
        # If we're changing dates or room, check for overlaps (except when cancelling)
        if (room_id != current_booking["room_id"] or 
            check_in != current_booking["check_in"] or 
            check_out != current_booking["check_out"]) and booking_status != 'Cancelled':
            
            print(f"Checking for overlaps due to date/room change")
            overlapping_bookings = db.execute("""
                SELECT booking_id, booking_status, check_in, check_out FROM bookings 
                WHERE room_id = ? 
                AND booking_id != ?
                AND booking_status != 'Cancelled'
                AND (
                    (check_in <= ? AND check_out > ?) OR
                    (check_in < ? AND check_out >= ?) OR
                    (check_in >= ? AND check_out <= ?)
                )
            """, (room_id, booking_id, check_out, check_in, check_out, check_in, check_in, check_out)).fetchall()
            
            if overlapping_bookings:
                print(f"Overlap detected: {overlapping_bookings}")
                db.close()
                return jsonify({"error": "Room already booked for these dates"}), 400
        
        db.execute("""
            UPDATE bookings SET user_id=?, room_id=?, check_in=?, check_out=?, booking_status=?, arrival_status=? WHERE booking_id=?
        """, (user_id, room_id, check_in, check_out, booking_status, arrival_status, booking_id))
        db.commit()
        db.close()
        
        print(f"Booking {booking_id} updated successfully")
        return jsonify({"message": "Booking updated"})

    elif request.method == "DELETE":
        db.execute("DELETE FROM bookings WHERE booking_id=?", (booking_id,))
        db.commit()
        db.close()
        return jsonify({"message": "Booking deleted"})

# ================== PAYMENTS ==================
@app.route("/payments", methods=["GET", "POST"])
def payments():
    db = get_db()
    if request.method == "GET":
        payments = db.execute("SELECT * FROM payments").fetchall()
        db.close()
        return jsonify([dict(p) for p in payments])

    data = request.get_json()
    db.execute(
        "INSERT INTO payments (booking_id, amount, payment_method, payment_status) VALUES (?, ?, ?, ?)",
        (data["booking_id"], data["amount"], data.get("payment_method", "Paytm"), data.get("payment_status", "Pending"))
    )
    db.commit()
    db.close()
    return jsonify({"message": "Payment added"}), 201

@app.route("/payments/<int:payment_id>", methods=["GET", "PUT", "DELETE"])
def payment_detail(payment_id):
    db = get_db()
    if request.method == "GET":
        payment = db.execute("SELECT * FROM payments WHERE payment_id=?", (payment_id,)).fetchone()
        db.close()
        if payment:
            return jsonify(dict(payment))
        return jsonify({"error": "Payment not found"}), 404

    elif request.method == "PUT":
        data = request.get_json()
        db.execute("""
            UPDATE payments SET booking_id=?, amount=?, payment_method=?, payment_status=? WHERE payment_id=?
        """, (data["booking_id"], data["amount"], data.get("payment_method"), data.get("payment_status"), payment_id))
        db.commit()
        db.close()
        return jsonify({"message": "Payment updated"})

    elif request.method == "DELETE":
        db.execute("DELETE FROM payments WHERE payment_id=?", (payment_id,))
        db.commit()
        db.close()
        return jsonify({"message": "Payment deleted"})

# ================== REVIEWS ==================
@app.route("/reviews", methods=["GET", "POST"])
def reviews():
    db = get_db()
    if request.method == "GET":
        reviews = db.execute("""
            SELECT r.*, u.name as user_name, rm.room_number
            FROM reviews r
            JOIN users u ON r.user_id=u.user_id
            JOIN rooms rm ON r.room_id=rm.room_id
        """).fetchall()
        db.close()
        return jsonify([dict(r) for r in reviews])

    data = request.get_json()
    db.execute(
        "INSERT INTO reviews (user_id, room_id, rating, comment) VALUES (?, ?, ?, ?)",
        (data["user_id"], data["room_id"], data["rating"], data.get("comment"))
    )
    db.commit()
    db.close()
    return jsonify({"message": "Review added"}), 201

# ================== FEATURES ==================
@app.route("/features", methods=["GET", "POST"])
def features():
    db = get_db()
    if request.method == "GET":
        features = db.execute("SELECT * FROM room_features").fetchall()
        db.close()
        return jsonify([dict(f) for f in features])

    data = request.get_json()
    db.execute("INSERT INTO room_features (feature_name, icon) VALUES (?, ?)", 
               (data["name"], data.get("icon", "fa-star")))
    db.commit()
    db.close()
    return jsonify({"message": "Feature added"}), 201

@app.route("/features/<int:feature_id>", methods=["GET", "PUT", "DELETE"])
def feature_detail(feature_id):
    db = get_db()
    if request.method == "GET":
        feature = db.execute("SELECT * FROM room_features WHERE feature_id=?", (feature_id,)).fetchone()
        db.close()
        if feature:
            return jsonify(dict(feature))
        return jsonify({"error": "Feature not found"}), 404

    elif request.method == "PUT":
        data = request.get_json()
        db.execute("""
            UPDATE room_features SET feature_name=?, icon=? WHERE feature_id=?
        """, (data["name"], data.get("icon", "fa-star"), feature_id))
        db.commit()
        db.close()
        return jsonify({"message": "Feature updated"})

    elif request.method == "DELETE":
        db.execute("DELETE FROM room_features WHERE feature_id=?", (feature_id,))
        db.commit()
        db.close()
        return jsonify({"message": "Feature deleted"})

# ================== SERVICES ==================
@app.route("/services", methods=["GET", "POST"])
def services():
    db = get_db()
    if request.method == "GET":
        services = db.execute("SELECT * FROM room_services").fetchall()
        db.close()
        return jsonify([dict(s) for s in services])

    data = request.get_json()
    db.execute("INSERT INTO room_services (service_name) VALUES (?)", (data["name"],))
    db.commit()
    db.close()
    return jsonify({"message": "Service added"}), 201

# ================== SETTINGS ==================
@app.route("/settings", methods=["GET"])
def settings():
    db = get_db()
    settings = db.execute("SELECT * FROM system_settings").fetchall()
    db.close()
    return jsonify([dict(s) for s in settings])

# ================== PASSWORD RESET ==================
@app.route("/password-reset", methods=["POST"])
def password_reset():
    """Request password reset - checks if user exists and sends reset instructions"""
    data = request.get_json()
    email = data.get("email")

    if not email:
        return jsonify({"error": "Email is required"}), 400

    try:
        db = get_db()
        user = db.execute("SELECT * FROM users WHERE email=?", (email,)).fetchone()
        db.close()

        if not user:
            # Don't reveal if email exists or not for security
            return jsonify({"message": "If an account with this email exists, password reset instructions have been sent."}), 200

        # In a real application, you would:
        # 1. Generate a secure reset token
        # 2. Store it in database with expiration
        # 3. Send email with reset link

        # For this demo, we just return success
        print(f"Password reset requested for user: {email}")
        return jsonify({"message": "Password reset instructions have been sent to your email."}), 200

    except Exception as e:
        print(f"Password reset error: {e}")
        return jsonify({"error": "Failed to process password reset request"}), 500

# ================== SYSTEM SETTINGS ==================
@app.route("/settings", methods=["GET", "POST"])
def system_settings():
    db = get_db()
    if request.method == "GET":
        settings = db.execute("SELECT * FROM system_settings").fetchall()
        db.close()
        return jsonify([dict(s) for s in settings])

    # POST - update settings
    data = request.get_json()
    for key, value in data.items():
        db.execute(
            "INSERT OR REPLACE INTO system_settings (setting_key, setting_value) VALUES (?, ?)",
            (key, value)
        )
    db.commit()
    db.close()
    return jsonify({"message": "Settings updated"}), 200

# ================== SSLCOMMERZ PAYMENT GATEWAY ==================
# SSLCommerz configuration - in production, these should be stored securely
SSLCOMMERZ_STORE_ID = "your_sslcommerz_store_id"  # Replace with actual store ID
SSLCOMMERZ_STORE_PASSWORD = "your_sslcommerz_store_password"  # Replace with actual store password
SSLCOMMERZ_BASE_URL = "https://sandbox.sslcommerz.com"

@app.route("/initiate-ssl-payment", methods=["POST"])
def initiate_ssl_payment():
    """Initiate SSLCommerz payment for a booking"""
    try:
        data = request.get_json()
        booking_id = data.get("booking_id")
        amount = data.get("amount")
        currency = data.get("currency", "BDT")
        
        # Validate input
        if not booking_id or not amount:
            return jsonify({"error": "booking_id and amount are required"}), 400
        
        # Get booking details to verify
        db = get_db()
        booking = db.execute("SELECT * FROM bookings WHERE booking_id=?", (booking_id,)).fetchone()
        if not booking:
            db.close()
            return jsonify({"error": "Booking not found"}), 404
        
        # Get user details
        user = db.execute("SELECT * FROM users WHERE user_id=?", (booking["user_id"],)).fetchone()
        db.close()
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # Prepare SSLCommerz payload
        ssl_payload = {
            "store_id": SSLCOMMERZ_STORE_ID,
            "store_passwd": SSLCOMMERZ_STORE_PASSWORD,
            "total_amount": float(amount),
            "currency": currency,
            "tran_id": f"BK_{booking_id}_{int(time.time())}",
            "success_url": f"http://localhost:3000/payment-success?booking_id={booking_id}",
            "fail_url": f"http://localhost:3000/payment-fail",
            "cancel_url": f"http://localhost:3000/checkout",
            "cus_name": user["name"],
            "cus_email": user["email"],
            "cus_phone": user.get("phone", "N/A"),
            "cus_addr1": "N/A",
            "cus_city": "N/A",
            "cus_country": "Bangladesh",
            "shipping_method": "NO",
            "product_name": f"Room Booking #{booking_id}",
            "product_category": "Hotel",
            "num_of_item": 1,
            "product_profile": "general"
        }
        
        # Make request to SSLCommerz
        response = requests.post(f"{SSLCOMMERZ_BASE_URL}/gwprocess/v4/api.php", data=ssl_payload)
        response_data = response.json()
        
        if response_data.get("status") == "FAILED":
            return jsonify({"error": response_data.get("failedreason", "SSLCommerz payment initiation failed")}), 400
        
        # Return payment gateway URL
        return jsonify({
            "status": "success",
            "payment_url": response_data.get("GatewayPageURL"),
            "transaction_id": response_data.get("tran_id")
        })
    
    except Exception as e:
        print(f"SSLCommerz initiation error: {str(e)}")
        return jsonify({"error": "Payment initiation failed"}), 500

@app.route("/ssl-payment-success", methods=["POST"])
def ssl_payment_success():
    """Handle successful SSLCommerz payment callback"""
    try:
        data = request.form  # SSLCommerz sends data as form data
        transaction_id = data.get("tran_id")
        val_id = data.get("val_id")
        amount = data.get("amount")
        card_type = data.get("card_type")
        
        # Extract booking ID from transaction ID
        booking_id = None
        if transaction_id.startswith("BK_"):
            booking_id = int(transaction_id.split("_")[1])
        
        if not booking_id:
            return jsonify({"error": "Invalid transaction ID"}), 400
        
        # Update payment status in database
        db = get_db()
        
        # Get existing booking
        booking = db.execute("SELECT * FROM bookings WHERE booking_id=?", (booking_id,)).fetchone()
        if not booking:
            db.close()
            return jsonify({"error": "Booking not found"}), 404
        
        # Update booking status to confirmed
        db.execute("UPDATE bookings SET booking_status='Confirmed' WHERE booking_id=?", (booking_id,))
        
        # Check if payment record already exists
        existing_payment = db.execute("SELECT * FROM payments WHERE booking_id=?", (booking_id,)).fetchone()
        if existing_payment:
            # Update existing payment
            db.execute("""UPDATE payments SET amount=?, payment_method='SSLCommerz', payment_status='Completed', 
                        transaction_id=?, card_type=? WHERE booking_id=?""",
                      (float(amount), val_id, card_type, booking_id))
        else:
            # Create new payment record
            db.execute("INSERT INTO payments (booking_id, amount, payment_method, payment_status, transaction_id, card_type) VALUES (?, ?, ?, ?, ?, ?)",
                      (booking_id, float(amount), "SSLCommerz", "Completed", val_id, card_type))
        
        db.commit()
        db.close()
        
        return jsonify({"status": "success", "message": "Payment successful and booking confirmed"})
    
    except Exception as e:
        print(f"SSLCommerz success callback error: {str(e)}")
        return jsonify({"error": "Error processing payment success"}), 500

@app.route("/ssl-payment-fail", methods=["POST"])
def ssl_payment_fail():
    """Handle failed SSLCommerz payment callback"""
    try:
        data = request.form
        transaction_id = data.get("tran_id")
        reason = data.get("reason", "Unknown error")
        
        # Extract booking ID from transaction ID
        booking_id = None
        if transaction_id.startswith("BK_"):
            booking_id = int(transaction_id.split("_")[1])
        
        if booking_id:
            # Update booking status to cancelled due to failed payment
            db = get_db()
            db.execute("UPDATE bookings SET booking_status='Cancelled' WHERE booking_id=?", (booking_id,))
            
            # Update or create payment record
            existing_payment = db.execute("SELECT * FROM payments WHERE booking_id=?", (booking_id,)).fetchone()
            if existing_payment:
                db.execute("UPDATE payments SET payment_status='Failed', failure_reason=? WHERE booking_id=?", (reason, booking_id))
            else:
                db.execute("INSERT INTO payments (booking_id, amount, payment_method, payment_status, failure_reason) 
                          VALUES (?, 0, 'SSLCommerz', 'Failed', ?)", (booking_id, reason))
            
            db.commit()
            db.close()
        
        return jsonify({"status": "failed", "message": f"Payment failed: {reason}"})
    
    except Exception as e:
        print(f"SSLCommerz fail callback error: {str(e)}")
        return jsonify({"error": "Error processing payment failure"}), 500

@app.route("/ssl-payment-cancel", methods=["POST"])
def ssl_payment_cancel():
    """Handle cancelled SSLCommerz payment callback"""
    try:
        data = request.form
        transaction_id = data.get("tran_id")
        
        # Extract booking ID from transaction ID
        booking_id = None
        if transaction_id.startswith("BK_"):
            booking_id = int(transaction_id.split("_")[1])
        
        if booking_id:
            # Update booking status to cancelled
            db = get_db()
            db.execute("UPDATE bookings SET booking_status='Cancelled' WHERE booking_id=?", (booking_id,))
            
            # Update or create payment record
            existing_payment = db.execute("SELECT * FROM payments WHERE booking_id=?", (booking_id,)).fetchone()
            if existing_payment:
                db.execute("UPDATE payments SET payment_status='Cancelled' WHERE booking_id=?", (booking_id,))
            else:
                db.execute("INSERT INTO payments (booking_id, amount, payment_method, payment_status) 
                          VALUES (?, 0, 'SSLCommerz', 'Cancelled')", (booking_id,))
            
            db.commit()
            db.close()
        
        return jsonify({"status": "cancelled", "message": "Payment cancelled by user"})
    
    except Exception as e:
        print(f"SSLCommerz cancel callback error: {str(e)}")
        return jsonify({"error": "Error processing payment cancellation"}), 500

@app.route("/get-ssl-payment-status/<transaction_id>")
def get_ssl_payment_status(transaction_id):
    """Get payment status from SSLCommerz"""
    try:
        # Prepare query to SSLCommerz
        query_params = {
            "store_id": SSLCOMMERZ_STORE_ID,
            "store_passwd": SSLCOMMERZ_STORE_PASSWORD,
            "tran_id": transaction_id
        }
        
        response = requests.post(f"{SSLCOMMERZ_BASE_URL}/validator/api/validationserverAPI.php", data=query_params)
        validation_data = response.json()
        
        return jsonify(validation_data)
    
    except Exception as e:
        print(f"SSLCommerz status check error: {str(e)}")
        return jsonify({"error": "Error checking payment status"}), 500

# ================== CONTACT MESSAGES ==================
@app.route("/contact-messages", methods=["GET", "POST"])
def contact_messages():
    db = get_db()
    if request.method == "GET":
        messages = db.execute("""
            SELECT * FROM contact_messages 
            ORDER BY created_at DESC
        """).fetchall()
        db.close()
        return jsonify([dict(m) for m in messages])

    # POST - create message
    data = request.get_json()
    db.execute(
        "INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)",
        (data["name"], data["email"], data.get("phone"), data.get("subject"), data["message"])
    )
    db.commit()
    db.close()
    return jsonify({"message": "Message sent successfully"}), 201

@app.route("/contact-messages/<int:message_id>", methods=["PUT", "DELETE"])
def contact_message_detail(message_id):
    db = get_db()
    
    if request.method == "PUT":
        data = request.get_json()
        db.execute(
            "UPDATE contact_messages SET status=? WHERE message_id=?",
            (data.get("status", "read"), message_id)
        )
        db.commit()
        db.close()
        return jsonify({"message": "Message updated"}), 200
    
    elif request.method == "DELETE":
        db.execute("DELETE FROM contact_messages WHERE message_id=?", (message_id,))
        db.commit()
        db.close()
        return jsonify({"message": "Message deleted"}), 200

# ================== RUN SERVER ==================
if __name__ == "__main__":
    app.run(debug=True)
