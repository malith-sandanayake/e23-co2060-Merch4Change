import axios from "axios";

const BASE = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api`;

const instance = axios.create({ baseURL: BASE, timeout: 8000 });

function authHeader() {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Redirect on 401 to login
instance.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401) {
      try { window.location.href = "/login"; } catch (e) {}
    }
    return Promise.reject(err);
  },
);

export const searchAll = (query) =>
  instance.get(`/search?q=${encodeURIComponent(query)}`, { headers: authHeader() });

export default instance;
