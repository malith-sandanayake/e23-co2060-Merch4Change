import React, { useEffect, useState } from "react";
import { Coins } from "lucide-react";
import apiClient from "../../api/apiClient";

export default function CoinBalance() {
  const [coinBalance, setCoinBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoinBalance = async () => {
      try {
        const response = await apiClient.get(`/api/v1/profile/me`);

        if (response.data?.data?.user?.coinBalance !== undefined) {
          setCoinBalance(response.data.data.user.coinBalance);
        }
      } catch (error) {
        console.error("Failed to fetch coin balance:", error);
        setCoinBalance(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCoinBalance();
  }, []);

  return (
    <div className="lum-coin-balance">
      <Coins size={18} className="lum-coin-icon" />
      <span className="lum-coin-value">
        {loading ? "..." : coinBalance.toLocaleString()}
      </span>
    </div>
  );
}
