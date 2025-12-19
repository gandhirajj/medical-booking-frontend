import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || 'https://medical-bookings-2.onrender.com';

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

export default api;
