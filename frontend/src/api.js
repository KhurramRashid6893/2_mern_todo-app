// import axios from 'axios';

// // Set the base API URL
// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// // Create axios instance
// const apiClient = axios.create({
//   baseURL: API_URL
// });

import axios from 'axios';

// ✅ Hardcoded Render backend URL
const API_URL = 'https://mern-todo-backend-zt8l.onrender.com';

// ✅ Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ✅ Automatically attach token if present
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default apiClient;
