import apiClient from "../api/apiClient";

export const fetchNotifications = () =>
  apiClient.get("/api/v1/notifications").then((res) => res.data);

export const markNotificationRead = (id) =>
  apiClient.patch(`/api/v1/notifications/${id}/read`).then((res) => res.data);
