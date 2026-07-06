import { useEffect, useState } from "react";
import AppLayout from "../../components/AppLayout/AppLayout";
import { getMyCharity, submitCharityVerification, uploadProofDocument } from "../../services/charityApi";
import { refreshStoredUser } from "../../utils/authStorage";
import "./VerificationForm.css";

const empty = {
  publicName: "",
  legalName: "",
  description: "",
  logoUrl: "",
  contactEmail: "",
  website: "",
  registrationNumber: "",
  category: "other",
  country: "",
  address: "",
  proofDocuments: [{ label: "Registration Certificate", url: "" }],
};

const CATEGORIES = ["health", "education", "environment", "humanitarian", "animal", "other"];

export default function VerificationForm() {
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState(null);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState(null);

  const isLocked = status === "pending" || status === "verified";

  useEffect(() => {
    getMyCharity()
      .then((res) => {
        if (res?.data?.charity) {
          const charity = res.data.charity;
          setForm({
            ...empty,
            ...charity,
            proofDocuments: charity.proofDocuments?.length
              ? charity.proofDocuments
              : empty.proofDocuments,
          });
          setStatus(charity.verificationStatus);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const set = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const setDoc = (index, key) => (event) => {
    const docs = [...form.proofDocuments];
    docs[index] = { ...docs[index], [key]: event.target.value };
    setForm((prev) => ({ ...prev, proofDocuments: docs }));
  };

  const addDoc = () =>
    setForm((prev) => ({
      ...prev,
      proofDocuments: [...prev.proofDocuments, { label: "", url: "" }],
    }));

  const removeDoc = (index) =>
    setForm((prev) => ({
      ...prev,
      proofDocuments: prev.proofDocuments.filter((_, i) => i !== index),
    }));

  const handleFileUpload = async (index, file) => {
    if (!file) return;
    setUploadingIndex(index);
    setMsg("");
    const response = await uploadProofDocument(file, form.proofDocuments[index]?.label);
    setUploadingIndex(null);

    if (!response.success) {
      setMsg(response.message || "Failed to upload document.");
      setMsgType("error");
      return;
    }

    const docs = [...form.proofDocuments];
    docs[index] = {
      label: response.data.label || docs[index]?.label || "Document",
      url: response.data.url,
    };
    setForm((prev) => ({ ...prev, proofDocuments: docs }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (isLocked) return;

    setSubmitting(true);
    setMsg("");
    setMsgType("");

    const res = await submitCharityVerification(form);
    setSubmitting(false);

    if (res.success) {
      setStatus("pending");
      setMsg("Submitted successfully. An admin will review your application.");
      setMsgType("success");
      await refreshStoredUser();
      return;
    }

    setMsg(res?.message || res?.error?.message || "Failed to submit verification.");
    setMsgType("error");
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="charity-verify-page">Loading...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="charity-verify-page">
        <div className="charity-verify-header">
          <h1>Charity Verification</h1>
          <p>Submit your organization details and proof documents for admin review.</p>
        </div>

        {status && <span className={`charity-status-badge ${status}`}>{status}</span>}

        {form.rejectionReason && status === "rejected" && (
          <div className="charity-rejection-box">
            <strong>Rejection reason:</strong> {form.rejectionReason}
          </div>
        )}

        {status === "pending" && (
          <p className="charity-form-message">Your application is under review. You cannot edit it until a decision is made.</p>
        )}

        <form className="charity-verify-form" onSubmit={onSubmit}>
          <div className="charity-form-grid">
            <div>
              <label htmlFor="publicName">Public name *</label>
              <input
                id="publicName"
                required
                disabled={isLocked}
                value={form.publicName}
                onChange={set("publicName")}
              />
            </div>
            <div>
              <label htmlFor="legalName">Legal name</label>
              <input
                id="legalName"
                disabled={isLocked}
                value={form.legalName}
                onChange={set("legalName")}
              />
            </div>
          </div>

          <div className="charity-form-grid">
            <div>
              <label htmlFor="registrationNumber">Registration number *</label>
              <input
                id="registrationNumber"
                required
                disabled={isLocked}
                value={form.registrationNumber}
                onChange={set("registrationNumber")}
              />
            </div>
            <div>
              <label htmlFor="category">Category</label>
              <select id="category" disabled={isLocked} value={form.category} onChange={set("category")}>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="charity-form-grid">
            <div>
              <label htmlFor="country">Country</label>
              <input id="country" disabled={isLocked} value={form.country} onChange={set("country")} />
            </div>
            <div>
              <label htmlFor="contactEmail">Contact email</label>
              <input
                id="contactEmail"
                type="email"
                disabled={isLocked}
                value={form.contactEmail}
                onChange={set("contactEmail")}
              />
            </div>
          </div>

          <div>
            <label htmlFor="address">Address</label>
            <input id="address" disabled={isLocked} value={form.address} onChange={set("address")} />
          </div>

          <div>
            <label htmlFor="website">Website</label>
            <input id="website" disabled={isLocked} value={form.website} onChange={set("website")} />
          </div>

          <div>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              disabled={isLocked}
              value={form.description}
              onChange={set("description")}
            />
          </div>

          <div className="charity-docs-section">
            <h3>Proof documents *</h3>
            <p className="charity-queue-meta">Upload files or paste document URLs for registration certificates.</p>
            {form.proofDocuments.map((doc, index) => (
              <div className="charity-doc-row" key={`doc-${index}`}>
                <div>
                  <label>Label</label>
                  <input
                    disabled={isLocked}
                    value={doc.label}
                    onChange={setDoc(index, "label")}
                    placeholder="Registration Certificate"
                  />
                </div>
                <div>
                  <label>Document URL</label>
                  <input
                    disabled={isLocked}
                    value={doc.url}
                    onChange={setDoc(index, "url")}
                    placeholder="https://..."
                  />
                  {!isLocked && (
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(event) => handleFileUpload(index, event.target.files?.[0])}
                      style={{ marginTop: 8 }}
                    />
                  )}
                  {uploadingIndex === index && (
                    <p className="charity-queue-meta">Uploading...</p>
                  )}
                </div>
                {!isLocked && form.proofDocuments.length > 1 && (
                  <button type="button" onClick={() => removeDoc(index)} aria-label="Remove document">
                    Remove
                  </button>
                )}
              </div>
            ))}
            {!isLocked && (
              <button type="button" className="charity-secondary-btn" onClick={addDoc}>
                + Add document
              </button>
            )}
          </div>

          {!isLocked && (
            <button type="submit" className="charity-submit-btn" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit for verification"}
            </button>
          )}

          {msg && <p className={`charity-form-message ${msgType}`}>{msg}</p>}
        </form>
      </div>
    </AppLayout>
  );
}
