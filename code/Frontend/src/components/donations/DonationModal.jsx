import React, { useState, useEffect } from "react";
import { X, Coins, Sparkles } from "lucide-react";
import { createDonation } from "../../api/donationsService";
import "./DonationModal.css";

function DonationModal({ isOpen, onClose, onSuccess, initialProject, initialCharity, availableCoins = 0, onDonationCommitted }) {
  const [charity, setCharity] = useState(initialCharity || "");
  const [project, setProject] = useState(initialProject || "");
  const [amount, setAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setCharity(initialCharity || "");
      setProject(initialProject || "");
      setAmount("");
      setCustomAmount("");
      setError(null);
    }
  }, [isOpen, initialProject, initialCharity]);

  if (!isOpen) return null;

  const handleAmountClick = (val) => {
    setAmount(val);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e) => {
    setCustomAmount(e.target.value);
    setAmount("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const finalAmount = amount ? parseInt(amount, 10) : parseInt(customAmount, 10);

    if (!project) {
      setError({ field: "project", message: "Please enter a project or cause." });
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
      const response = await createDonation({ charity, project, amount: finalAmount });
      const remainingCoins = response?.data?.data?.coinBalance;
      if (typeof onDonationCommitted === "function") {
        onDonationCommitted(finalAmount, remainingCoins);
      }
      onSuccess(project || charity || "the project");
    } catch (err) {
      const errMsg = err.response?.data?.details?.[0]?.message || err.response?.data?.message || "Failed to process donation.";
      setError({ field: "global", message: errMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="donation-modal-overlay" onClick={onClose}>
      <div className="donation-modal-content" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="modal-close-btn">
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
            <label className="form-label">Recipient Charity</label>
            <select
              className="form-select"
              value={charity}
              onChange={(e) => setCharity(e.target.value)}
            >
              <option value="">General Support (Randomized)</option>
              <option value="Green Canopy Initiative">Green Canopy Initiative</option>
              <option value="Future Scholars Fund">Future Scholars Fund</option>
              <option value="Mobile Medics Network">Mobile Medics Network</option>
              <option value="Clean Water Wells">Clean Water Wells</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Specific Project</label>
            <input
              type="text"
              className="form-input"
              value={project}
              onChange={(e) => setProject(e.target.value)}
              placeholder="e.g. Clean Water for Village X"
            />
            {error?.field === "project" && <p className="error-msg">{error.message}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Select Amount</label>
            <div className="amount-presets">
              {[25, 50, 100, 250].map((val) => (
                <button
                  key={val}
                  type="button"
                  className={`preset-btn ${amount === val ? 'active' : ''}`}
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

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? "Processing..." : `Send ${(amount || customAmount || 0).toLocaleString()} Coins`}
          </button>
          
          <p style={{ 
            fontSize: '0.75rem', 
            color: '#6b7280', 
            textAlign: 'center', 
            marginTop: '1.25rem',
            lineHeight: '1.4'
          }}>
            100% of your donated coins go directly to the cause. <br />
            No platform fees, ever.
          </p>
        </form>
      </div>
    </div>
  );
}

export default DonationModal;
