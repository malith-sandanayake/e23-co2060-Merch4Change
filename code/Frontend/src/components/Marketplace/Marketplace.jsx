import { useEffect, useState } from "react";
import "./Marketplace.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Coin calculation — matches backend logic: Math.floor(price / 10)
function coinsFor(price) {
  return Math.floor(price / 10);
}

function Marketplace() {
  const [products, setProducts]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [checkingOut, setCheckingOut] = useState(null); // productId currently processing
  const [toast, setToast]             = useState(null); // { type, text }
  const [filter, setFilter]           = useState("all"); // all | instock | trending

  // ── Fetch products on mount ───────────────────
  useEffect(() => {
    fetch(`${API}/api/v1/marketplace/products`)
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.data?.products ?? data.data ?? []);
      })
      .catch(() => showToast("error", "Could not load products."))
      .finally(() => setLoading(false));
  }, []);

  // ── Toast helper ──────────────────────────────
  function showToast(type, text) {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3000);
  }

  // ── Checkout handler ──────────────────────────
  async function handleBuy(product) {
    const token = localStorage.getItem("token");
    if (!token) {
      showToast("error", "Please log in to make a purchase.");
      return;
    }
    if (product.stock === 0) return;

    setCheckingOut(product._id);
    try {
      const res = await fetch(`${API}/api/v1/marketplace/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items: [{ productId: product._id, quantity: 1 }] }),
      });
      const data = await res.json();

      if (data.success) {
        // Pull coinsEarned from wherever the backend puts it
        const coins = data.data?.coinsEarned ?? data.data?.order?.coinsEarned ?? coinsFor(product.price);
        showToast("success", `✅ Purchased! You earned ${coins} coins.`);
        // Decrease stock locally so UI reflects the purchase immediately
        setProducts((prev) =>
          prev.map((p) => p._id === product._id ? { ...p, stock: p.stock - 1 } : p)
        );
      } else {
        showToast("error", `❌ ${data.message || "Checkout failed."}`);
      }
    } catch {
      showToast("error", "❌ Network error. Try again.");
    } finally {
      setCheckingOut(null);
    }
  }

  // ── Filter logic ──────────────────────────────
  const filtered = products.filter((p) => {
    if (filter === "instock")  return p.stock > 0;
    if (filter === "trending") return p.stock <= 20 && p.stock > 0; // low stock = trending
    return true;
  });

  // ── Stock label helper ────────────────────────
  function stockLabel(stock) {
    if (stock === 0)    return { text: "Sold out",       cls: "mk-stock-out" };
    if (stock <= 5)     return { text: `Only ${stock} left!`, cls: "mk-stock-low" };
    if (stock <= 20)    return { text: `${stock} left`,  cls: "mk-stock-low" };
    return               { text: `In stock`,             cls: "mk-stock-ok" };
  }

  return (
    <div className="mk-root">

      {/* ── Header ─────────────────────────────── */}
      <div className="mk-header">
        <div className="mk-header-left">
          <h2 className="mk-title">Marketplace</h2>
          <p className="mk-sub">Buy merch, earn coins, fund causes</p>
        </div>

        {/* Filter pills */}
        <div className="mk-filters">
          {["all", "instock", "trending"].map((f) => (
            <button
              key={f}
              className={`mk-filter-pill ${filter === f ? "mk-filter-active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "All" : f === "instock" ? "In Stock" : "🔥 Trending"}
            </button>
          ))}
        </div>
      </div>

      {/* ── Flash deal banner ──────────────────── */}
      <div className="mk-flash-banner">
        <span className="mk-flash-dot" />
        <span className="mk-flash-text">
          Flash deal — earn <strong>double coins</strong> on orders above $50 today only
        </span>
        <span className="mk-flash-end">Ends in 04:22:15</span>
      </div>

      {/* ── Toast ──────────────────────────────── */}
      {toast && (
        <div className={`mk-toast ${toast.type === "success" ? "mk-toast-success" : "mk-toast-error"}`}>
          {toast.text}
        </div>
      )}

      {/* ── Loading ────────────────────────────── */}
      {loading && (
        <div className="mk-loading">
          <div className="mk-spinner" />
          <p>Loading products...</p>
        </div>
      )}

      {/* ── Empty state ────────────────────────── */}
      {!loading && filtered.length === 0 && (
        <div className="mk-empty">
          <span className="mk-empty-icon">🛍️</span>
          <h3>No products found</h3>
          <p>{filter !== "all" ? "Try switching to All products." : "Check back soon."}</p>
        </div>
      )}

      {/* ── Product grid ───────────────────────── */}
      {!loading && filtered.length > 0 && (
        <div className="mk-grid">
          {filtered.map((product, i) => {
            const stock    = stockLabel(product.stock);
            const coins    = coinsFor(product.price);
            const isBuying = checkingOut === product._id;
            const soldOut  = product.stock === 0;

            return (
              <div
                className="mk-card"
                key={product._id}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {/* Product image / placeholder */}
                <div className="mk-card-img" style={{
                  background: `hsl(${(i * 47) % 360}, 60%, 92%)`
                }}>
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} />
                  ) : (
                    <span className="mk-img-placeholder">🛍️</span>
                  )}
                  {/* Coins badge on image */}
                  <span className="mk-coins-badge">🪙 +{coins} coins</span>
                  {/* Low stock tag */}
                  {product.stock > 0 && product.stock <= 10 && (
                    <span className="mk-hot-tag">🔥 Almost gone</span>
                  )}
                </div>

                {/* Card body */}
                <div className="mk-card-body">
                  <h4 className="mk-product-name">{product.name}</h4>

                  {product.description && (
                    <p className="mk-product-desc">{product.description}</p>
                  )}

                  <div className="mk-card-footer">
                    <div className="mk-price-row">
                      <span className="mk-price">${product.price?.toFixed(2)}</span>
                      <span className={`mk-stock ${stock.cls}`}>{stock.text}</span>
                    </div>

                    <button
                      className={`mk-buy-btn ${soldOut ? "mk-buy-soldout" : ""} ${isBuying ? "mk-buy-loading" : ""}`}
                      onClick={() => handleBuy(product)}
                      disabled={soldOut || isBuying}
                    >
                      {isBuying ? (
                        <>
                          <span className="mk-btn-spinner" />
                          Processing...
                        </>
                      ) : soldOut ? "Sold Out" : "Buy Now"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Marketplace;