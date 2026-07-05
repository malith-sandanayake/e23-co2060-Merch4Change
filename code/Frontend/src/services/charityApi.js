const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const authHeaders = () => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  return token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
};

const parseResponse = async (response) => {
  const data = await response.json();
  if (!response.ok && !data.success) {
    return {
      success: false,
      message: data.message || "Request failed.",
      error: data.error,
    };
  }
  return data;
};

export const submitCharityVerification = (payload) =>
  fetch(`${API}/api/v1/charities/verify`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  }).then(parseResponse);

export const getMyCharity = () =>
  fetch(`${API}/api/v1/charities/me`, {
    headers: authHeaders(),
  }).then(parseResponse);

export const listVerifiedCharities = () =>
  fetch(`${API}/api/v1/charities`, {
    headers: authHeaders(),
  }).then(parseResponse);

export const listDonationProjects = () =>
  fetch(`${API}/api/v1/donations/projects`, {
    headers: authHeaders(),
  }).then(parseResponse);

export const uploadProofDocument = async (file, label = "") => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  const formData = new FormData();
  formData.append("file", file);
  if (label) formData.append("label", label);

  const response = await fetch(`${API}/api/v1/charities/documents`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  return parseResponse(response);
};

export const adminListCharities = (status = "pending") =>
  fetch(`${API}/api/v1/admin/charities?status=${status}`, {
    headers: authHeaders(),
  }).then(parseResponse);

export const adminGetCharity = (id) =>
  fetch(`${API}/api/v1/admin/charities/${id}`, {
    headers: authHeaders(),
  }).then(parseResponse);

export const adminApprove = (id) =>
  fetch(`${API}/api/v1/admin/charities/${id}/approve`, {
    method: "PATCH",
    headers: authHeaders(),
  }).then(parseResponse);

export const adminReject = (id, reason) =>
  fetch(`${API}/api/v1/admin/charities/${id}/reject`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ reason }),
  }).then(parseResponse);
