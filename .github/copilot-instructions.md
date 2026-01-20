# Hotel Booking Management System - AI Agent Instructions

## Architecture Overview

This is a **full-stack hotel booking system** with:
- **Backend**: Flask REST API (`sql_project_db_2-main/main.py`) running on `localhost:5000`
- **Frontend**: React SPA (`react-hotel-frontend/`) running on `localhost:3000`
- **Database**: SQLite3 (`hotel_booking.db`) with PRAGMA foreign_keys enabled
- **Documentation**: Swagger UI at `/swagger` endpoint

### Key Data Model
- **Users**: Guests and admin accounts with status (active/banned)
- **Rooms**: Hotel inventory with types (Single, Double, Deluxe, Suite) and features/services via mapping tables
- **Bookings**: Join users + rooms with check-in/out dates, booking_status (Pending/Confirmed/Cancelled), arrival_status (Not Arrived/Arrived/Departed)
- **Payments**: Linked to bookings, method defaults to "Paytm", status tracking
- **Reviews**: User ratings (1-5) + comments on rooms

## Critical Development Workflows

### Start Backend
```powershell
# From `sql_project_db_2-main/` directory
python main.py
# Flask runs on port 5000 with debug=True and CORS enabled for localhost:3000
```

### Start Frontend
```powershell
# From `react-hotel-frontend/` directory
npm start
# React dev server on port 3000
```

### Initialize Database
```powershell
# Fresh database setup (one-time)
python create_database.py  # Creates schema with FK constraints
python seed_data.py        # Populates test data
python check_tables.py     # Verify schema
```

## API Patterns & Routes

### RESTful Endpoints (All return JSON)
- **Pattern**: `GET /resource` (list), `POST /resource` (create), `GET /resource/<id>` (detail), `PUT /resource/<id>` (update), `DELETE /resource/<id>` (delete)
- **Core resources**: `/users`, `/rooms`, `/bookings`, `/payments`, `/reviews`, `/features`, `/services`, `/settings`
- **Complex queries**: Bookings and Reviews include JOINs (see main.py L130-135, L220-225)
- **Error handling**: Returns 404 with `{"error": "..."}` for not found, 201 on POST create

### Database Access Pattern
```python
db = get_db()  # sqlite3.connect() with Row factory
db.execute("SQL", params).fetchall()
db.commit()
db.close()
```
No ORM used - raw SQL everywhere. Always handle FK constraints and close connections.

## Frontend Structure & Conventions

### Component Organization
- **Admin pages**: `components/admin/` (Dashboard, Users, Rooms, Bookings, Reviews)
- **Common components**: `components/common/` (Navbar, Footer, Sidebar)
- **Auth pages**: `components/common/auth/` (Login, Register)
- **User pages**: `components/common/user/` (Home, Rooms, Booking, Checkout, Profile, Reviews)

### API Integration Pattern
- All requests go through `api.js` which defines `API_BASE = "http://127.0.0.1:5000"`
- React Router used for navigation (routes in `components/Routes.js`)
- Bootstrap 5.3 for styling, Font Awesome for icons

### App State Management
- `App.js` uses simple `useState(page)` for navigation - not Redux/Context
- Components directly fetch from API - no central state management
- No authentication state persistence visible yet

## Project-Specific Patterns

### Database Initialization
- Foreign keys must be explicitly enabled: `PRAGMA foreign_keys = ON` (see create_database.py L6, seed_data.py L7)
- Cascade deletes configured on mapping tables (room_feature_map, room_service_map)
- Default values in schema: `status` defaults to 'active'/'Available', timestamps use `CURRENT_TIMESTAMP`

### Status Fields & Enums
- **User**: status ∈ {active, banned}
- **Room**: status ∈ {Available, ...} (expandable)
- **Booking**: booking_status ∈ {Pending, Confirmed, Cancelled}, arrival_status ∈ {Not Arrived, Arrived, Departed}
- **Payment**: payment_status ∈ {Pending, ...}, method ∈ {Paytm, ...}

### Test Data Credentials
- Admin: username=`admin`, password=`admin123`
- Test user: email=`rahim@gmail.com`, password=`pass123`
- See `seed_data.py` for all 4 test users and 4 rooms

## Cross-Component Communication

### Frontend → Backend
- HTTP requests only (no WebSockets)
- CORS headers configured in main.py: `CORS(app)` - allows all origins
- All requests expect JSON responses

### Booking Workflow
1. User searches rooms (frontend)
2. POST `/bookings` with user_id, room_id, check_in, check_out
3. POST `/payments` with booking_id to record payment
4. PUT `/bookings/<id>` updates booking_status and arrival_status

### Room Features & Services
- Not directly exposed in main components yet
- Mapping tables exist (room_feature_map, room_service_map) for N-to-N relationships
- Endpoints ready: GET/POST `/features`, `/services`

## Known Limitations & TODO Areas

- **Authentication**: No JWT/session validation in API routes - admins and users handled same way
- **Input validation**: No schema validation (use Flask-Inputs or similar)
- **Empty components**: Navbar, Sidebar, Footer, most admin/user pages are skeleton files
- **Booking conflict**: No check-in/check-out overlap prevention
- **Error handling**: Generic error responses, no specific validation messages

## When Modifying Code

1. **Backend changes**: Update `/main.py` route, test with Swagger, ensure CORS compatible
2. **Database schema**: Update `create_database.py`, run `python create_database.py` to rebuild, re-seed with `python seed_data.py`
3. **Frontend components**: Follow existing pattern - fetch from `API_BASE`, parse JSON, render with Bootstrap classes
4. **New endpoints**: Add route to main.py, document in swagger.json, add frontend component in appropriate subfolder

## File Reference Map

- **Schema & setup**: [create_database.py](sql_project_db_2-main/create_database.py), [seed_data.py](sql_project_db_2-main/seed_data.py)
- **API core**: [main.py](sql_project_db_2-main/main.py#L1) (all endpoints)
- **React entry**: [App.js](sql_project_db_2-main/react-hotel-frontend/src/App.js), [api.js](sql_project_db_2-main/react-hotel-frontend/src/api.js)
