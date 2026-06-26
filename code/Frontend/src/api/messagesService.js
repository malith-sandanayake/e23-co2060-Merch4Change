import axios from "axios";

const BASE = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/v1/messages`;

const messagesApi = axios.create({
  baseURL: BASE,
});

messagesApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

messagesApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export const getMessagingContacts = async () => {
  const response = await messagesApi.get("/contacts");
  return response.data;
};

export const getConversationThread = async (conversationId) => {
  const response = await messagesApi.get(`/conversations/${conversationId}`);
  return response.data;
};

export const createMessagingConversation = async (participantUserId) => {
  const response = await messagesApi.post("/conversations", { participantUserId });
  return response.data;
};

export const sendConversationMessage = async (conversationId, body) => {
  const response = await messagesApi.post(`/conversations/${conversationId}/messages`, { body });
  return response.data;
};

export const markConversationRead = async (conversationId) => {
  const response = await messagesApi.patch(`/conversations/${conversationId}/read`);
  return response.data;
};

export default messagesApi;