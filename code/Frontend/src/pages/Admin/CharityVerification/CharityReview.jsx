// code/Frontend/src/pages/Admin/CharityVerification/CharityReview.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminGetCharity, adminApprove, adminReject } from "../../../services/charityApi";

export default function CharityReview() {
  const { id } = useParams();
  const nav = useNavigate();
  const [c, setC] = useState(null);
  const [reason, setReason] = useState("");

  useEffect(() => { adminGetCharity(id).then((r) => setC(r?.data?.charity)); }, [id]);
  if (!c) return <p>Loading...</p>;

  const approve = async () => { await adminApprove(id); nav("/admin/charities"); };
  const reject = async () => {
    if (!reason.trim()) return alert("Reason required");
    await adminReject(id, reason); nav("/admin/charities");
  };

  return (
    <div style={{ padding: 24, maxWidth: 800 }}>
      <h1>{c.publicName}</h1>
      <p><b>Legal:</b> {c.legalName}</p>
      <p><b>Reg #:</b> {c.registrationNumber}</p>
      <p><b>Category:</b> {c.category}</p>
      <p><b>Country:</b> {c.country}</p>
      <p><b>Owner:</b> {c.ownerUserId?.email}</p>
      <p>{c.description}</p>

      <h3>Proof documents</h3>
      <ul>
        {c.proofDocuments?.map((d, i) => (
          <li key={i}><a href={d.url} target="_blank" rel="noreferrer">{d.label}</a></li>
        ))}
      </ul>

      <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
        <button onClick={approve} style={{ background: "green", color: "white" }}>Approve</button>
        <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Rejection reason" />
        <button onClick={reject} style={{ background: "crimson", color: "white" }}>Reject</button>
      </div>
    </div>
  );
}
