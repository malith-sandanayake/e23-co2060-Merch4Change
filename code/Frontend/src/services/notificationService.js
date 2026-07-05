const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const authHeaders = () => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const parseResponse = async (response) => {
  const data = await response.json();
  if (!response.ok && !data.success) {
    throw new Error(data.message || "Request failed.");
  }
  return data;
};

export const fetchNotifications = () =>
  fetch(`${API}/api/v1/notifications`, { headers: authHeaders() }).then(parseResponse);

export const markNotificationRead = (id) =>
  fetch(`${API}/api/v1/notifications/${id}/read`, {
    method: "PATCH",
    headers: authHeaders(),
  }).then(parseResponse);
