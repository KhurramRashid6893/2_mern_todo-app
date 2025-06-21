import axios from 'axios';

// Set the base API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL
});

export default apiClient;
