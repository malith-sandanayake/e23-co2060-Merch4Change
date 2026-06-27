import axios from "axios";

const BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/v1/posts`
  : "http://localhost:5000/api/v1/posts";

const postsApi = axios.create({
  baseURL: BASE,
});

postsApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

postsApi.interceptors.response.use(
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

/**
 * Create a new post.
 * Expected data is a FormData object containing:
 * - content: string
 * - images: up to 5 File objects
 */
export const createPost = (formData) => {
  return postsApi.post("/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getFeedPosts = () => {
  return postsApi.get("/");
};
