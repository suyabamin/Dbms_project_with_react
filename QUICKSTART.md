# Quick Start Guide - Hotel Booking System

## Complete Setup in 5 Minutes

### Prerequisites
- Python 3.8+ installed
- Node.js 14+ and npm installed
- Git (optional)

---

## Step 1: Initialize Database (Backend)

```bash
cd sql_project_db_2-main

# Create fresh database with schema
python create_database.py

# Populate with test data
python seed_data.py

# Verify database
python check_tables.py
```

**Test Credentials Created:**
- User: rahim@gmail.com / pass123
- Admin: admin / admin123

---

## Step 2: Install Backend Dependencies

```bash
# You're already in sql_project_db_2-main/
pip install flask flask-cors flask-swagger-ui

# If not already installed
pip install sqlite3
```

---

## Step 3: Start Backend API

```bash
python main.py
```

**Backend is running at:** `http://localhost:5000`
**Swagger UI:** `http://localhost:5000/swagger`

---

## Step 4: Install Frontend Dependencies

```bash
# Open a NEW terminal/command prompt
cd sql_project_db_2-main/react-hotel-frontend

npm install
```

This will install:
- React, React Router
- Bootstrap, Font Awesome
- Axios
- And other dependencies

---

## Step 5: Start Frontend

```bash
# In the react-hotel-frontend directory
npm start
```

**Frontend is running at:** `http://localhost:3000`

The app will automatically open in your browser!

---

## 🎉 You're Ready!

### Access the Application

**Homepage:** `http://localhost:3000`

### Try These:

1. **Browse Rooms** - Click "Rooms" in navbar
2. **Login as User** - Email: `rahim@gmail.com`, Password: `pass123`
3. **Book a Room** - Select dates, proceed to checkout
4. **Admin Panel** - Login as admin, go to /admin/dashboard

---

## API Endpoints (Backend)

```
GET    /users              - List all users
GET    /rooms              - List all rooms
GET    /bookings           - List all bookings
GET    /payments           - List all payments
GET    /reviews            - List all reviews
GET    /features           - List room features
GET    /services           - List room services

POST   /users              - Create user
POST   /rooms              - Create room
POST   /bookings           - Create booking
POST   /payments           - Create payment
POST   /reviews            - Create review

PUT    /users/<id>         - Update user
PUT    /rooms/<id>         - Update room
PUT    /bookings/<id>      - Update booking

DELETE /users/<id>         - Delete user
DELETE /rooms/<id>         - Delete room
DELETE /bookings/<id>      - Delete booking
```

---

## Frontend Routes

### Public Pages
```
/                          - Home
/rooms                     - Browse rooms
/room/:roomId             - Room details
/facilities               - Facilities
/about                    - About us
/contact                  - Contact us
/login                    - User login
/register                 - User registration
```

### User Pages (Login Required)
```
/profile                  - User profile
/my-bookings             - My bookings
/my-reviews              - My reviews
/checkout                - Booking checkout
```

### Admin Pages (Admin Login Required)
```
/admin/dashboard         - Dashboard
/admin/rooms            - Room management
/admin/users            - User management
/admin/bookings         - Booking management
/admin/reviews          - Review management
```

---

## Project Structure

```
sql_project_db_2-main/
├── main.py                           # Flask backend
├── create_database.py                # Database schema
├── seed_data.py                      # Test data
├── check_tables.py                   # Database verification
└── react-hotel-frontend/
    ├── src/
    │   ├── components/
    │   │   ├── auth/                # Login/Register
    │   │   ├── admin/               # Admin pages
    │   │   ├── common/              # Navbar, Footer, Sidebar
    │   │   ├── user/                # User pages
    │   │   └── Routes.js            # React Router
    │   ├── utils/
    │   │   ├── api.js               # API client
    │   │   └── helpers.js           # Utilities
    │   ├── styles/                  # CSS files
    │   └── App.js                   # Main component
    └── package.json                 # Dependencies
```

---

## Common Issues & Solutions

### ❌ "Cannot connect to API"
**Solution:** Ensure backend is running with `python main.py`

### ❌ "npm: command not found"
**Solution:** Install Node.js from https://nodejs.org/

### ❌ "Port 3000 already in use"
**Solution:** Kill process on port 3000 or use `PORT=3001 npm start`

### ❌ "Database connection error"
**Solution:** Run `python create_database.py` again

### ❌ "Login fails with valid credentials"
**Solution:** Run `python seed_data.py` to populate test data

---

## Development Tips

### Hot Reload
Frontend automatically reloads when you save files (with `npm start`)

### Backend Restart
For backend changes, stop (Ctrl+C) and restart `python main.py`

### View Network Requests
Open browser DevTools (F12) → Network tab to see API calls

### Check Database
```bash
python check_tables.py    # View all tables and data
```

---

## Features Checklist

- ✅ User Registration & Login
- ✅ Browse & Search Rooms
- ✅ Book Hotels with Date Selection
- ✅ Checkout & Payment
- ✅ Manage Bookings
- ✅ Leave Reviews & Ratings
- ✅ Admin Dashboard
- ✅ User Management
- ✅ Room Management
- ✅ Booking Management
- ✅ Review Management

---

## Next Steps

1. **Customize** - Edit styles, colors, and branding
2. **Add Features** - Payment gateway, email notifications
3. **Deploy** - Use Vercel, Netlify, or your hosting
4. **Scale** - Add database backups, monitoring

---

## Documentation

- **Frontend:** See `FRONTEND_README.md`
- **Backend:** See `.github/copilot-instructions.md`

---

## Support

For detailed documentation, check:
- Backend README in `sql_project_db_2-main/`
- Frontend README in `react-hotel-frontend/`
- API Swagger docs at `http://localhost:5000/swagger`

---

**Happy Coding! 🚀**
