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
