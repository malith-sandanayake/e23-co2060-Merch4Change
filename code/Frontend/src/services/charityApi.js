// code/Frontend/src/services/charityApi.js
const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const authHeaders = () => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const submitCharityVerification = (payload) =>
  fetch(`${API}/api/v1/charities/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  }).then((r) => r.json());

export const getMyCharity = () =>
  fetch(`${API}/api/v1/charities/me`, { headers: authHeaders() }).then((r) => r.json());

export const adminListCharities = (status = "pending") =>
  fetch(`${API}/api/v1/admin/charities?status=${status}`, { headers: authHeaders() })
    .then((r) => r.json());

export const adminGetCharity = (id) =>
  fetch(`${API}/api/v1/admin/charities/${id}`, { headers: authHeaders() }).then((r) => r.json());

export const adminApprove = (id) =>
  fetch(`${API}/api/v1/admin/charities/${id}/approve`, {
    method: "PATCH", headers: authHeaders(),
  }).then((r) => r.json());

export const adminReject = (id, reason) =>
  fetch(`${API}/api/v1/admin/charities/${id}/reject`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ reason }),
  }).then((r) => r.json());
