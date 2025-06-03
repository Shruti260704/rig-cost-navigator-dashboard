import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://g6w379cl-8000.inc1.devtunnels.ms/api';

// Create an axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // This ensures cookies are sent with every request
  headers: {
    'Content-Type': 'application/json',
  }
});

export default axiosInstance;