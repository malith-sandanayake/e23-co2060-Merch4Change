import apiClient from "../api/apiClient";

export const submitCharityVerification = (payload) =>
  apiClient.post("/api/v1/charities/verify", payload).then((res) => res.data);

export const getMyCharity = () =>
  apiClient.get("/api/v1/charities/me").then((res) => res.data);

export const listVerifiedCharities = () =>
  apiClient.get("/api/v1/charities").then((res) => res.data);

export const listDonationProjects = () =>
  apiClient.get("/api/v1/donations/projects").then((res) => res.data);

export const uploadProofDocument = async (file, label = "") => {
  const formData = new FormData();
  formData.append("file", file);
  if (label) formData.append("label", label);

  // Don't set Content-Type — let the browser set the multipart boundary
  const response = await apiClient.post("/api/v1/charities/documents", formData);
  return response.data;
};

export const adminListCharities = (status = "pending") =>
  apiClient
    .get(`/api/v1/admin/charities?status=${status}`)
    .then((res) => res.data);

export const adminGetCharity = (id) =>
  apiClient.get(`/api/v1/admin/charities/${id}`).then((res) => res.data);

export const adminApprove = (id) =>
  apiClient
    .patch(`/api/v1/admin/charities/${id}/approve`)
    .then((res) => res.data);

export const adminReject = (id, reason) =>
  apiClient
    .patch(`/api/v1/admin/charities/${id}/reject`, { reason })
    .then((res) => res.data);
