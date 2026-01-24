import axios from "axios";

const API_BASE = "http://127.0.0.1:5000";

// API client with auth token support
const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

// Add token to requests if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error("API Error:", error.message, error.code);
    
    if (error.code === 'ECONNABORTED') {
      console.error('Server timeout');
      return Promise.reject(error);
    } else if (error.message === 'Network Error') {
      console.error('Network error - backend may not be running');
      return Promise.reject(error);
    } else if (error.response?.status === 500) {
      console.error('Server error:', error.response.data);
      return Promise.reject(error);
    } else if (!error.response && error.code !== 'ECONNABORTED') {
      console.error('Connection failed - check if backend is running');
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const API = {
  // Auth
  login: (email, password) => apiClient.post("/login", { email, password }),
  register: (data) => apiClient.post("/users", data),
  passwordReset: (email) => apiClient.post("/password-reset", { email }),

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
  getFeature: (id) => apiClient.get(`/features/${id}`),
  createFeature: (data) => apiClient.post("/features", data),
  updateFeature: (id, data) => apiClient.put(`/features/${id}`, data),
  deleteFeature: (id) => apiClient.delete(`/features/${id}`),

  // Settings
  getSettings: () => apiClient.get("/settings"),
  updateSettings: (data) => apiClient.post("/settings", data),

  // Contact Messages
  getContactMessages: () => apiClient.get("/contact-messages"),
  sendContactMessage: (data) => apiClient.post("/contact-messages", data),
  updateContactMessage: (id, data) => apiClient.put(`/contact-messages/${id}`, data),
  deleteContactMessage: (id) => apiClient.delete(`/contact-messages/${id}`),

  // SSLCommerz Payment Gateway
  initiateSSLPayment: (data) => apiClient.post("/initiate-ssl-payment", data),
  getSSLPaymentStatus: (transactionId) => apiClient.get(`/get-ssl-payment-status/${transactionId}`),
  simulatePaymentSuccess: (data) => apiClient.post("/simulate-payment-success", data),
  cancelUnpaidBooking: (data) => apiClient.post("/cancel-unpaid-booking", data),
};

export default API;
