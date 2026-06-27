// code/Frontend/src/pages/Charity/VerificationForm.jsx
import { useEffect, useState } from "react";
import { getMyCharity, submitCharityVerification } from "../../services/charityApi";

const empty = {
  publicName: "", legalName: "", description: "", logoUrl: "",
  contactEmail: "", website: "", registrationNumber: "",
  category: "other", country: "", address: "",
  proofDocuments: [{ label: "Registration Certificate", url: "" }],
};

export default function VerificationForm() {
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    getMyCharity().then((res) => {
      if (res?.data?.charity) {
        setForm({ ...empty, ...res.data.charity });
        setStatus(res.data.charity.verificationStatus);
      }
    });
  }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const setDoc = (i, k) => (e) => {
    const docs = [...form.proofDocuments];
    docs[i] = { ...docs[i], [k]: e.target.value };
    setForm({ ...form, proofDocuments: docs });
  };
  const addDoc = () =>
    setForm({ ...form, proofDocuments: [...form.proofDocuments, { label: "", url: "" }] });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("Submitting...");
    const res = await submitCharityVerification(form);
    if (res.success) { setStatus("pending"); setMsg("Submitted. Awaiting admin review."); }
    else setMsg(res?.error?.message || "Failed to submit.");
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: 24 }}>
      <h1>Charity Verification</h1>
      {status && <p>Status: <b>{status}</b></p>}
      {form.rejectionReason && status === "rejected" && (
        <p style={{ color: "crimson" }}>Reason: {form.rejectionReason}</p>
      )}

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <input required placeholder="Public name" value={form.publicName} onChange={set("publicName")} />
        <input placeholder="Legal name" value={form.legalName} onChange={set("legalName")} />
        <input required placeholder="Registration number" value={form.registrationNumber} onChange={set("registrationNumber")} />
        <select value={form.category} onChange={set("category")}>
          {["health","education","environment","humanitarian","animal","other"].map(c =>
            <option key={c} value={c}>{c}</option>)}
        </select>
        <input placeholder="Country" value={form.country} onChange={set("country")} />
        <input placeholder="Address" value={form.address} onChange={set("address")} />
        <input placeholder="Contact email" value={form.contactEmail} onChange={set("contactEmail")} />
        <input placeholder="Website" value={form.website} onChange={set("website")} />
        <textarea placeholder="Description" value={form.description} onChange={set("description")} />

        <h3>Proof documents</h3>
        {form.proofDocuments.map((d, i) => (
          <div key={i} style={{ display: "flex", gap: 8 }}>
            <input placeholder="Label" value={d.label} onChange={setDoc(i, "label")} />
            <input placeholder="URL" value={d.url} onChange={setDoc(i, "url")} style={{ flex: 1 }} />
          </div>
        ))}
        <button type="button" onClick={addDoc}>+ Add document</button>

        <button type="submit">Submit for verification</button>
        {msg && <p>{msg}</p>}
      </form>
    </div>
  );
}
