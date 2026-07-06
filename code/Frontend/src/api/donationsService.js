import apiClient from "./apiClient";

export const getMyDonations = (page = 1) =>
  apiClient.get(`/api/donations/my?page=${page}&limit=10`);

export const getDonationStats = () =>
  apiClient.get("/api/donations/my/stats");

export const createVerifiedDonation = async ({ charityId, coinAmount }) => {
  const response = await apiClient.post("/api/v1/donations", {
    charityId,
    coinAmount,
  });
  return response;
};
