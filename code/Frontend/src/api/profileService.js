import apiClient from "./apiClient";

export const getSuggestedUsers = async () => {
  const response = await apiClient.get("/api/v1/profile/suggested");
  return response.data;
};

export const followUser = async (username) => {
  const response = await apiClient.post(`/api/v1/profile/${username}/follow`);
  return response.data;
};

export const unfollowUser = async (username) => {
  const response = await apiClient.post(`/api/v1/profile/${username}/unfollow`);
  return response.data;
};
