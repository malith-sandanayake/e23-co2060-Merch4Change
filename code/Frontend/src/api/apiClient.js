import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ── Module-level token store ─────────────────────────────────────────
// AuthContext syncs the current access token here via setAccessToken().
// This lets non-React service files (charityApi.js, etc.) access the token
// without needing React hooks.
let _accessToken = null;
let _logoutCallback = null; // AuthContext registers its logout() here

export const setAccessToken = (token) => {
  _accessToken = token;
};

export const getAccessToken = () => _accessToken;

export const setLogoutCallback = (fn) => {
  _logoutCallback = fn;
};

// ── Axios instance ───────────────────────────────────────────────────
const apiClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // always send cookies (refreshToken)
});

// ── Request interceptor: attach access token ─────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    if (_accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${_accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response interceptor: auto-refresh on 401 ───────────────────────
// When the access token expires (15 min), the first 401 triggers a
// refresh call. All concurrent failing requests are queued and retried
// once the new token arrives. This prevents multiple refresh calls.
let isRefreshing = false;
let failedQueue = []; // pending requests waiting for a new token

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh on 401 and not on the refresh endpoint itself
    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes("/auth/refresh") ||
      originalRequest.url?.includes("/auth/login")
    ) {
      return Promise.reject(error);
    }

    // If a refresh is already in progress, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post(
        `${API_BASE}/api/v1/auth/refresh`,
        {},
        { withCredentials: true },
      );

      const newToken = data?.data?.accessToken;

      if (!newToken) {
        throw new Error("No access token in refresh response");
      }

      _accessToken = newToken;
      processQueue(null, newToken);

      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      _accessToken = null;

      // Gracefully log the user out on the frontend
      if (typeof _logoutCallback === "function") {
        _logoutCallback();
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default apiClient;
