import apiClient from "./apiClient";

export const searchAll = (query) =>
  apiClient.get(`/api/search?q=${encodeURIComponent(query)}`);

export default apiClient;
