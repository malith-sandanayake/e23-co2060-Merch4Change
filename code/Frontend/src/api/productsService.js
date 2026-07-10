import apiClient from "./apiClient";

const PREFIX = "/api/v1/products";

export const createProduct = (formData) => {
  return apiClient.post(`${PREFIX}/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getUserProducts = (username) => {
  return apiClient.get(`${PREFIX}/user/${username}`);
};
