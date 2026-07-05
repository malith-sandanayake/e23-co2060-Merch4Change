import axios from "axios";

const BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/donations`
  : "http://localhost:5000/api/donations";

const V1_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const donationsApi = axios.create({ baseURL: BASE });

const withAuth = (config) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

donationsApi.interceptors.request.use(withAuth, (error) => Promise.reject(error));

donationsApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export const getMyDonations = (page = 1) => donationsApi.get(`/my?page=${page}&limit=10`);

export const getDonationStats = () => donationsApi.get("/my/stats");

export const createVerifiedDonation = async ({ charityId, coinAmount }) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  const response = await axios.post(
    `${V1_BASE}/api/v1/donations`,
    { charityId, coinAmount },
    {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    },
  );
  return response;
};
