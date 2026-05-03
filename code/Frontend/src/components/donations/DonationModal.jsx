import React, { useState, useEffect } from "react";
import { X, Coins } from "lucide-react";
import { createDonation } from "../../api/donationsService";

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
      setError({ field: "amount", message: "You do not have enough coins for this donation." });
      return;
    }
    if (availableCoins < 1) {
      setError({ field: "amount", message: "You have 0 coins. Earn coins from purchases before donating." });
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

  const inputStyle = {
    width: "100%",
    border: "1.5px solid #E2DAD0",
    borderRadius: "10px",
    padding: "12px 16px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "15px",
    color: "#1A1A1A",
    outline: "none",
    transition: "all 0.2s ease",
  };

  const focusStyle = (e) => {
    e.target.style.borderColor = "#D4820A";
    e.target.style.boxShadow = "0 0 0 3px rgba(212,130,10,0.1)";
  };

  const blurStyle = (e) => {
    e.target.style.borderColor = "#E2DAD0";
    e.target.style.boxShadow = "none";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div
        className="relative w-full max-w-[480px] bg-white overflow-y-auto"
        style={{ borderRadius: "16px", padding: "32px", maxHeight: "90vh" }}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 bg-transparent border-none cursor-pointer"
          style={{ color: "#6B6560" }}
        >
          <X size={24} />
        </button>

        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "28px", color: "#1A1A1A", marginBottom: "24px" }}>
          Donate Your Coins
        </h2>

        <div
          style={{
            background: "#F8FAFC",
            border: "1px solid #E2DAD0",
            borderRadius: "12px",
            padding: "10px 14px",
            marginBottom: "18px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "14px",
            color: "#1A1A1A",
          }}
        >
          <Coins size={16} color="#D4820A" />
          Available coins: <strong>{Number(availableCoins).toLocaleString()}</strong>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Charity Selector */}
          <div>
            <label style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#6B6560", marginBottom: "8px" }}>
              Choose a Charity
            </label>
            <select
              value={charity}
              onChange={(e) => setCharity(e.target.value)}
              style={inputStyle}
              onFocus={focusStyle}
              onBlur={blurStyle}
            >
              <option value="">Select charity (optional)...</option>
              <option value="Green Canopy Initiative">Green Canopy Initiative</option>
              <option value="Future Scholars Fund">Future Scholars Fund</option>
              <option value="Mobile Medics Network">Mobile Medics Network</option>
              <option value="Clean Water Wells">Clean Water Wells</option>
            </select>
          </div>

          {/* Project Input */}
          <div>
            <label style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#6B6560", marginBottom: "8px" }}>
              Project / Cause
            </label>
            <input
              type="text"
              value={project}
              onChange={(e) => setProject(e.target.value)}
              placeholder="e.g. Scholarship Drive"
              style={inputStyle}
              onFocus={focusStyle}
              onBlur={blurStyle}
            />
            {error?.field === "project" && (
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#C0392B", marginTop: "4px" }}>{error.message}</p>
            )}
          </div>

          {/* Amount Selection */}
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              {[25, 50, 100, 250].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleAmountClick(val)}
                  style={{
                    backgroundColor: amount === val ? "#D4820A" : "#FFFFFF",
                    color: amount === val ? "#FFFFFF" : "#1A1A1A",
                    border: amount === val ? "1.5px solid #D4820A" : "1.5px solid #E2DAD0",
                    borderRadius: "10px",
                    padding: "10px",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "14px",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {val} coins
                </button>
              ))}
            </div>

            <label style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#6B6560", marginBottom: "8px" }}>
              Or enter custom coin amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#6B6560", fontFamily: "'DM Sans', sans-serif" }}>
                🪙
              </span>
              <input
                type="number"
                value={customAmount}
                onChange={handleCustomAmountChange}
                placeholder="0"
                min="1"
                style={{ ...inputStyle, paddingLeft: "48px" }}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
            </div>
            {error?.field === "amount" && (
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#C0392B", marginTop: "4px" }}>{error.message}</p>
            )}
          </div>

          {error?.field === "global" && (
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#C0392B", textAlign: "center" }}>
              {error.message}
            </div>
          )}

          {/* Submit */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full transition-colors cursor-pointer disabled:opacity-70"
              style={{
                backgroundColor: "#D4820A",
                color: "#FFFFFF",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                padding: "16px",
                borderRadius: "10px",
                border: "none",
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = "#be7509")}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = "#D4820A")}
            >
              {loading ? "Processing..." : `Donate ${(amount || customAmount || 0).toLocaleString()} Coins`}
            </button>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#6B6560", textAlign: "center", marginTop: "12px" }}>
              Coins are deducted from your earned balance and transferred directly to this project.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DonationModal;
