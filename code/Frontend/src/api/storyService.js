import apiClient from "./apiClient";

export const uploadStory = async (formData) => {
  const response = await apiClient.post("/api/v1/stories", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getStories = async () => {
  const response = await apiClient.get("/api/v1/stories");
  return response.data;
};

export const getUserCollections = async (username) => {
  const response = await apiClient.get(`/api/v1/collections/${username}`);
  return response.data;
};

export const createCollection = async (title, image) => {
  const response = await apiClient.post("/api/v1/collections", { title, image });
  return response.data;
};

export const saveStoryToCollection = async (collectionId, image) => {
  const response = await apiClient.put(`/api/v1/collections/${collectionId}/save`, { image });
  return response.data;
};
