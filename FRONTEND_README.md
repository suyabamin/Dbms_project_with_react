# Hotel Booking Management System - React Frontend

A complete, production-ready React frontend for a hotel booking management system built with modern web technologies.

## Features

### User Features
- ✅ User Authentication (Login/Register)
- ✅ Browse and Search Rooms with Filters
- ✅ View Room Details and Reviews
- ✅ Book Rooms with Date Selection
- ✅ Checkout with Payment Options
- ✅ Manage Bookings (View, Cancel)
- ✅ User Profile Management
- ✅ Write and Read Reviews
- ✅ View Facilities and Services
- ✅ About Us & Contact Pages

### Admin Features
- ✅ Admin Dashboard with Statistics
- ✅ Room Management (CRUD)
- ✅ User Management (Ban/Unban)
- ✅ Booking Management and Status Updates
- ✅ Review Management
- ✅ Feature and Service Management

## Tech Stack

- **React** 19.2.3 - UI Framework
- **React Router** 7.12.0 - Client-side routing
- **Bootstrap** 5.3.8 - Responsive UI
- **Font Awesome** 4.7.0 - Icons
- **Axios** 1.7.0 - HTTP Client
- **CSS3** - Styling

## Project Structure

```
src/
├── components/
│   ├── auth/               # Login & Register
│   ├── admin/              # Admin pages
│   │   ├── Dashboard.js
│   │   ├── Rooms.js
│   │   ├── Users.js
│   │   ├── Bookings.js
│   │   └── Reviews.js
│   ├── common/             # Shared components
│   │   ├── Navbar.js
│   │   ├── Footer.js
│   │   └── Sidebar.js
│   ├── user/               # User pages
│   │   ├── Home.js
│   │   ├── Rooms.js
│   │   ├── RoomDetail.js
│   │   ├── Checkout.js
│   │   ├── Profile.js
│   │   ├── MyBookings.js
│   │   ├── MyReviews.js
│   │   ├── Facilities.js
│   │   ├── About.js
│   │   └── Contact.js
│   └── Routes.js           # Route configuration
├── utils/
│   ├── api.js              # API client & endpoints
│   └── helpers.js          # Utility functions
├── styles/                 # CSS files
└── App.js                  # Main app component
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Backend API running on `localhost:5000`

### Installation Steps

1. **Install Dependencies**
   ```bash
   cd react-hotel-frontend
   npm install
   ```

2. **Start the Development Server**
   ```bash
   npm start
   ```
   The app will open at `http://localhost:3000`

3. **Build for Production**
   ```bash
   npm run build
   ```

## Running the Complete System

### Terminal 1 - Start Backend
```bash
cd sql_project_db_2-main
python main.py
# Backend runs on http://localhost:5000
```

### Terminal 2 - Start Frontend
```bash
cd react-hotel-frontend
npm start
# Frontend runs on http://localhost:3000
```

## API Integration

All API calls are handled through `src/utils/api.js`:

```javascript
import API from "../utils/api";

// Users
await API.getUsers();
await API.getUser(id);
await API.updateUser(id, data);
await API.deleteUser(id);

// Rooms
await API.getRooms();
await API.getRoom(id);
await API.createRoom(data);
await API.updateRoom(id, data);

// Bookings
await API.getBookings();
await API.createBooking(data);
await API.updateBooking(id, data);

// And more...
```

## Authentication

Authentication uses simple token-based system stored in localStorage:

```javascript
import { auth } from "./utils/helpers";

// Login
auth.setUser(userData);
auth.setToken(token);

// Check if logged in
if (auth.isAuthenticated()) { ... }

// Get current user
const user = auth.getUser();

// Logout
auth.logout();
```

## Key Components & Pages

### Public Pages
- **Home** (`/`) - Landing page with features
- **Rooms** (`/rooms`) - Browse all rooms
- **Room Detail** (`/room/:roomId`) - Room information & booking
- **Facilities** (`/facilities`) - Hotel amenities
- **About** (`/about`) - About the hotel
- **Contact** (`/contact`) - Contact form
- **Login** (`/login`) - User login
- **Register** (`/register`) - User registration

### Protected User Pages
- **Profile** (`/profile`) - User profile management
- **My Bookings** (`/my-bookings`) - View & manage bookings
- **My Reviews** (`/my-reviews`) - View & write reviews
- **Checkout** (`/checkout`) - Booking checkout

### Admin Pages
- **Dashboard** (`/admin/dashboard`) - Statistics overview
- **Rooms** (`/admin/rooms`) - Room management
- **Users** (`/admin/users`) - User management
- **Bookings** (`/admin/bookings`) - Booking management
- **Reviews** (`/admin/reviews`) - Review management

## Demo Credentials

### User Login
- **Email:** rahim@gmail.com
- **Password:** pass123

### Admin Login
Create an admin account using the database setup, or use existing credentials from `seed_data.py`

## Features Implementation Details

### Room Filtering
- Filter by room type (Single, Double, Deluxe, Suite)
- Filter by price range (1000-10000)
- Only shows available rooms

### Booking System
1. Select dates on room detail page
2. Proceed to checkout
3. Enter guest information
4. Select payment method
5. Complete booking

### Review System
- Users can write reviews for booked rooms
- 5-star rating system
- Reviews appear on room detail page

### Admin Dashboard
- View total users, rooms, bookings, reviews
- Manage all entities (CRUD operations)
- Update booking and arrival status
- Ban/Unban users

## Styling

The app uses Bootstrap 5.3 for base styling with custom CSS for:
- Authentication pages
- Cards and hover effects
- Admin layout
- Responsive design
- Color scheme (Primary: #667eea, Secondary: #764ba2)

## Helper Functions

Located in `src/utils/helpers.js`:

```javascript
formatDate(dateString)          // Format dates
formatCurrency(amount)           // Format currency
calculateNights(checkIn, checkOut)  // Calculate stay duration
calculateTotal(price, nights)    // Calculate total price
```

## Error Handling

All API calls include try-catch with user-friendly error messages:

```javascript
try {
  await API.getRooms();
} catch (err) {
  console.error(err);
  setError("Failed to fetch rooms");
}
```

## Deployment

### Build for Production
```bash
npm run build
```

The `build/` folder is ready for deployment to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

### Environment Variables (if needed)
Create a `.env` file:
```
REACT_APP_API_URL=http://localhost:5000
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- [ ] Email notifications
- [ ] PDF invoice generation
- [ ] Advanced analytics
- [ ] Real-time room availability
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Progressive Web App (PWA)
- [ ] Payment gateway integration

## Troubleshooting

### Cannot connect to backend
- Ensure backend is running on `http://localhost:5000`
- Check CORS settings in Flask backend

### Rooms not loading
- Verify database is populated with seed data
- Check browser console for errors
- Ensure API endpoint is correct

### Login issues
- Clear browser cache/localStorage
- Verify user credentials in database
- Check if user status is "active"

## Support

For issues or questions, please refer to the backend documentation or create an issue in the repository.

## License

This project is open source and available under the MIT License.
