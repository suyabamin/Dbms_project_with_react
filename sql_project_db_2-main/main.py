from flask import Flask, request, jsonify
from flask_swagger_ui import get_swaggerui_blueprint
from flask_cors import CORS
import sqlite3

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
    
    overlapping_bookings = db.execute("""
        SELECT * FROM bookings 
        WHERE room_id = ? 
        AND booking_status != 'Cancelled'
        AND check_in < ? AND check_out > ?
    """, (room_id, check_out, check_in)).fetchall()
    
    if overlapping_bookings:
        db.close()
        return jsonify({"error": "Room already booked for these dates"}), 400
    
    db.execute(
        "INSERT INTO bookings (user_id, room_id, check_in, check_out, booking_status, arrival_status) VALUES (?, ?, ?, ?, ?, ?)",
        (data["user_id"], data["room_id"], data["check_in"], data["check_out"], data.get("booking_status", "Pending"), data.get("arrival_status", "Not Arrived"))
    )
    db.commit()
    db.close()
    return jsonify({"message": "Booking created"}), 201

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
        
        # Prepare update values, keeping existing values if not provided
        user_id = data.get("user_id", current_booking["user_id"])
        room_id = data.get("room_id", current_booking["room_id"])
        check_in = data.get("check_in", current_booking["check_in"])
        check_out = data.get("check_out", current_booking["check_out"])
        booking_status = data.get("booking_status", current_booking["booking_status"])
        arrival_status = data.get("arrival_status", current_booking["arrival_status"])
        
        db.execute("""
            UPDATE bookings SET user_id=?, room_id=?, check_in=?, check_out=?, booking_status=?, arrival_status=? WHERE booking_id=?
        """, (user_id, room_id, check_in, check_out, booking_status, arrival_status, booking_id))
        db.commit()
        db.close()
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

# ================== RUN SERVER ==================
if __name__ == "__main__":
    app.run(debug=True)
