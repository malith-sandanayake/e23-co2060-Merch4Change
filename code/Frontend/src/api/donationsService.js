import axios from "axios";

const BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/donations`
  : "http://localhost:5000/api/donations";

// Create an axios instance specifically for donations
const donationsApi = axios.create({
  baseURL: BASE,
});

// Request interceptor to add token
donationsApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 Unauthorized
donationsApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const getMyDonations = (page = 1) => {
  return donationsApi.get(`/my?page=${page}&limit=10`);
};

export const getDonationStats = () => {
  return donationsApi.get("/my/stats");
};

export const createDonation = (data) => {
  return donationsApi.post("/", data);
};
