import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X, Coins, Sparkles } from "lucide-react";
import { createVerifiedDonation } from "../../api/donationsService";
import { listVerifiedCharities } from "../../services/charityApi";
import "./DonationModal.css";

function DonationModal({
  isOpen,
  onClose,
  onSuccess,
  initialCharityId = "",
  initialCharityName = "",
  initialProject = "",
  availableCoins = 0,
  onDonationCommitted,
}) {
  const [charities, setCharities] = useState([]);
  const [charityId, setCharityId] = useState(initialCharityId || "");
  const [project, setProject] = useState(initialProject || "");
  const [amount, setAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingCharities, setLoadingCharities] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    setCharityId(initialCharityId || "");
    setProject(initialProject || "");
    setAmount("");
    setCustomAmount("");
    setError(null);
    setLoadingCharities(true);

    listVerifiedCharities()
      .then((response) => {
        const items = response?.data?.items || [];
        setCharities(items);

        if (!initialCharityId && initialCharityName) {
          const match = items.find((item) => item.publicName === initialCharityName);
          if (match?._id) setCharityId(match._id);
        }
      })
      .finally(() => setLoadingCharities(false));
  }, [isOpen, initialCharityId, initialCharityName, initialProject]);

  if (!isOpen) return null;

  const handleAmountClick = (val) => {
    setAmount(String(val));
    setCustomAmount("");
  };

  const handleCustomAmountChange = (event) => {
    setCustomAmount(event.target.value);
    setAmount("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    const finalAmount = amount ? parseInt(amount, 10) : parseInt(customAmount, 10);

    if (!charityId) {
      setError({ field: "charity", message: "Please select a verified charity." });
      return;
    }
    if (!finalAmount || finalAmount < 1) {
      setError({ field: "amount", message: "Amount must be at least 1 coin." });
      return;
    }
    if (finalAmount > availableCoins) {
      setError({ field: "amount", message: "Insufficient balance for this donation." });
      return;
    }

    try {
      setLoading(true);
      const response = await createVerifiedDonation({ charityId, coinAmount: finalAmount });
      const selectedCharity = charities.find((item) => item._id === charityId);
      const remainingCoins = response?.data?.data?.coinBalance;

      if (typeof onDonationCommitted === "function") {
        onDonationCommitted(finalAmount, remainingCoins);
      }

      onSuccess(project || selectedCharity?.publicName || "the charity");
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to process donation.";
      setError({ field: "global", message: errMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="donation-modal-overlay" onClick={onClose}>
      <div className="donation-modal-content" onClick={(event) => event.stopPropagation()}>
        <button onClick={onClose} className="modal-close-btn" type="button">
          <X size={24} />
        </button>

        <h2>Donate Coins</h2>

        <div className="balance-card">
          <div className="icon-badge">
            <Coins size={28} color="#FDE68A" />
          </div>
          <div className="balance-info">
            <span className="balance-label">Your Wallet</span>
            <span className="balance-value">{Number(availableCoins).toLocaleString()} Coins</span>
          </div>
          <Sparkles size={20} className="ml-auto opacity-40" />
        </div>

        <form onSubmit={handleSubmit}>
          {error?.field === "global" && (
            <div className="global-error">{error.message}</div>
          )}

          <div className="form-group">
            <label className="form-label">Verified charity *</label>
            <select
              className="form-select"
              value={charityId}
              onChange={(event) => setCharityId(event.target.value)}
              disabled={loadingCharities}
            >
              <option value="">
                {loadingCharities ? "Loading charities..." : "Select a verified charity"}
              </option>
              {charities.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.publicName}
                </option>
              ))}
            </select>
            {error?.field === "charity" && <p className="error-msg">{error.message}</p>}
            {!loadingCharities && charities.length === 0 && (
              <p className="error-msg">No verified charities are available yet.</p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Project note (optional)</label>
            <input
              type="text"
              className="form-input"
              value={project}
              onChange={(event) => setProject(event.target.value)}
              placeholder="e.g. Clean Water for Village X"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Select Amount</label>
            <div className="amount-presets">
              {[25, 50, 100, 250].map((val) => (
                <button
                  key={val}
                  type="button"
                  className={`preset-btn ${amount === String(val) ? "active" : ""}`}
                  onClick={() => handleAmountClick(val)}
                >
                  {val}
                </button>
              ))}
            </div>

            <div className="custom-amount-wrapper">
              <span className="currency-icon">🪙</span>
              <input
                type="number"
                className="form-input with-icon"
                value={customAmount}
                onChange={handleCustomAmountChange}
                placeholder="Custom coin amount"
                min="1"
              />
            </div>
            {error?.field === "amount" && <p className="error-msg">{error.message}</p>}
          </div>

          <button type="submit" className="submit-btn" disabled={loading || charities.length === 0}>
            {loading ? "Processing..." : `Send ${(amount || customAmount || 0).toLocaleString()} Coins`}
          </button>

          <p className="donation-modal-footnote">
            100% of your donated coins go directly to verified charities.
          </p>
        </form>
      </div>
    </div>
  );
}

export default DonationModal;
