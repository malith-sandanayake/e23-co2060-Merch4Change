// code/Frontend/src/pages/Admin/CharityVerification/CharityQueue.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminListCharities } from "../../../services/charityApi";

export default function CharityQueue() {
  const [status, setStatus] = useState("pending");
  const [items, setItems] = useState([]);

  useEffect(() => {
    adminListCharities(status).then((r) => setItems(r?.data?.items || []));
  }, [status]);

  return (
    <div style={{ padding: 24 }}>
      <h1>Charity Verification Queue</h1>
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="pending">Pending</option>
        <option value="verified">Verified</option>
        <option value="rejected">Rejected</option>
      </select>
      <ul>
        {items.map((c) => (
          <li key={c._id}>
            <Link to={`/admin/charities/${c._id}`}>
              {c.publicName} — {c.ownerUserId?.email} ({c.category})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
