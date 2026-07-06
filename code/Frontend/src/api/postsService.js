import apiClient from "./apiClient";

const PREFIX = "/api/v1/posts";

/**
 * Create a new post.
 * Expected data is a FormData object containing:
 * - content: string
 * - images: up to 5 File objects
 */
export const createPost = (formData) => {
  return apiClient.post(`${PREFIX}/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getFeedPosts = () => {
  return apiClient.get(`${PREFIX}/`);
};
