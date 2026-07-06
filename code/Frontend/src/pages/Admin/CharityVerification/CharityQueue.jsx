import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../../../components/AppLayout/AppLayout";
import { adminListCharities } from "../../../services/charityApi";
import "./CharityVerification.css";

export default function CharityQueue() {
  const [status, setStatus] = useState("pending");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    adminListCharities(status)
      .then((response) => setItems(response?.data?.items || []))
      .finally(() => setLoading(false));
  }, [status]);

  return (
    <AppLayout>
      <div className="charity-admin-page">
        <h1>Charity Verification Queue</h1>
        <p className="charity-queue-meta">Review organization applications and approve or reject them.</p>

        <div className="charity-admin-toolbar">
          <label htmlFor="status-filter">Status</label>
          <select
            id="status-filter"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
            <option value="unsubmitted">Unsubmitted</option>
          </select>
        </div>

        {loading ? (
          <p className="charity-empty-state">Loading applications...</p>
        ) : items.length === 0 ? (
          <p className="charity-empty-state">No charities found for this status.</p>
        ) : (
          <ul className="charity-queue-list">
            {items.map((charity) => (
              <li className="charity-queue-item" key={charity._id}>
                <Link to={`/admin/charities/${charity._id}`}>
                  <div>
                    <div className="charity-queue-name">{charity.publicName}</div>
                    <div className="charity-queue-meta">
                      {charity.ownerUserId?.email} · {charity.category}
                    </div>
                  </div>
                  <div className="charity-queue-meta">
                    {charity.submittedAt
                      ? new Date(charity.submittedAt).toLocaleDateString()
                      : "Not submitted"}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppLayout>
  );
}
