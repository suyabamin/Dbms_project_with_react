import axios from "axios";

const API_BASE = "http://127.0.0.1:5000";

// API client with auth token support
const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      alert('Server timeout. Please check if the backend is running.');
    } else if (error.response?.status === 500) {
      if (error.response?.data?.error?.includes('database')) {
        alert('Database connection error. The system will try to reconnect automatically.');
      } else {
        alert('Server error occurred. Please try again.');
      }
    } else if (!error.response) {
      alert('Cannot connect to server. Please make sure the backend is running on port 5000.');
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const API = {
  // Auth
  login: (email, password) => apiClient.post("/login", { email, password }),
  register: (data) => apiClient.post("/users", data),

  // Users
  getUsers: () => apiClient.get("/users"),
  getUser: (id) => apiClient.get(`/users/${id}`),
  updateUser: (id, data) => apiClient.put(`/users/${id}`, data),
  deleteUser: (id) => apiClient.delete(`/users/${id}`),
  banUser: (id) => apiClient.put(`/users/${id}`, { status: "banned" }),
  unbanUser: (id) => apiClient.put(`/users/${id}`, { status: "active" }),

  // Rooms
  getRooms: () => apiClient.get("/rooms"),
  getRoom: (id) => apiClient.get(`/rooms/${id}`),
  createRoom: (data) => apiClient.post("/rooms", data),
  updateRoom: (id, data) => apiClient.put(`/rooms/${id}`, data),
  deleteRoom: (id) => apiClient.delete(`/rooms/${id}`),

  // Bookings
  getBookings: () => apiClient.get("/bookings"),
  getBooking: (id) => apiClient.get(`/bookings/${id}`),
  createBooking: (data) => apiClient.post("/bookings", data),
  updateBooking: (id, data) => apiClient.put(`/bookings/${id}`, data),
  deleteBooking: (id) => apiClient.delete(`/bookings/${id}`),

  // Payments
  getPayments: () => apiClient.get("/payments"),
  getPayment: (id) => apiClient.get(`/payments/${id}`),
  createPayment: (data) => apiClient.post("/payments", data),
  updatePayment: (id, data) => apiClient.put(`/payments/${id}`, data),
  deletePayment: (id) => apiClient.delete(`/payments/${id}`),

  // Reviews
  getReviews: () => apiClient.get("/reviews"),
  createReview: (data) => apiClient.post("/reviews", data),
  deleteReview: (id) => apiClient.delete(`/reviews/${id}`),

  // Features
  getFeatures: () => apiClient.get("/features"),
  createFeature: (data) => apiClient.post("/features", data),
  deleteFeature: (id) => apiClient.delete(`/features/${id}`),

  // Services
  getServices: () => apiClient.get("/services"),
  createService: (data) => apiClient.post("/services", data),
  deleteService: (id) => apiClient.delete(`/services/${id}`),
};

export default API;
