import { useEffect, useState } from "react";
import "./Marketplace.css";
import { HeroSection } from "./components/HeroSection";
import { FlashBanner } from "./components/FlashBanner";
import { FilterBar } from "./components/FilterBar";
import { TrendingRow } from "./components/TrendingRow";
import { ProductSection } from "./components/ProductSection";
import { ProductCard } from "./components/ProductCard";
import { LoadingState } from "./components/LoadingState";
import { EmptyState } from "./components/EmptyState";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

function coinsFor(price) {
  return Math.floor(price / 10);
}

const FILTERS = ["All", "In Stock", "Limited", "Trending"];

export default function Marketplace() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(null);
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetch(`${API}/api/v1/marketplace/products`)
      .then((r) => r.json())
      .then((data) => setProducts(data.data?.products ?? []))
      .catch(() => showToast("error", "Could not load products."))
      .finally(() => setLoading(false));
  }, []);

  function showToast(type, text) {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  }

  async function handleBuy(product) {
    const token = localStorage.getItem("token");
    if (!token) { showToast("error", "Please log in to purchase."); return; }
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
        const coins = data.data?.coinsEarned ?? data.data?.order?.coinsEarned ?? coinsFor(product.price);
        showToast("success", `✅ Purchased! You earned ${coins} coins.`);
        setProducts((prev) => prev.map((p) => p._id === product._id ? { ...p, stock: p.stock - 1 } : p));
      } else {
        showToast("error", `❌ ${data.message || "Checkout failed."}`);
      }
    } catch {
      showToast("error", "❌ Network error. Try again.");
    } finally {
      setCheckingOut(null);
    }
  }

  const featured = products.filter(p => p.isLimitedEdition && p.stock > 0);
  const trending = products.filter(p => p.stock <= 20 && p.stock > 0 && !p.isLimitedEdition);
  const regular = products.filter(p => p.stock > 20);
  const heroProduct = featured[0] || products[0];

  const getFiltered = () => {
    if (filter === "In Stock") return products.filter(p => p.stock > 0);
    if (filter === "Limited") return products.filter(p => p.isLimitedEdition);
    if (filter === "Trending") return products.filter(p => p.stock <= 20 && p.stock > 0);
    return products;
  };

  const filtered = getFiltered();
  const showSections = filter === "All";

  return (
    <div className="mk-root">

      {/* Toast */}
      {toast && (
        <div className={`mk-toast ${toast.type === "success" ? "mk-toast-success" : "mk-toast-error"}`}>
          {toast.text}
        </div>
      )}

      {/* Hero */}
      {heroProduct && (
        <HeroSection
          heroProduct={heroProduct}
          onBuy={handleBuy}
          checkingOut={checkingOut}
          coinsFor={coinsFor}
        />
      )}

      {/* Flash banner */}
      <FlashBanner />

      {/* Filter bar */}
      <FilterBar filter={filter} onFilterChange={setFilter} filters={FILTERS} />

      {/* Loading */}
      {loading && <LoadingState />}

      {/* Empty */}
      {!loading && filtered.length === 0 && <EmptyState filter={filter} />}

      {/* Sectioned view */}
      {!loading && showSections && (
        <>
          <TrendingRow products={trending} onBuy={handleBuy} checkingOut={checkingOut} coinsFor={coinsFor} />
          <ProductSection title="Featured Drops" icon="⭐" products={featured} onBuy={handleBuy} checkingOut={checkingOut} startIndex={0} coinsFor={coinsFor} />
          <ProductSection title="Curated Marketplace" icon="🛍️" products={regular} onBuy={handleBuy} checkingOut={checkingOut} startIndex={featured.length} coinsFor={coinsFor} />
        </>
      )}

      {/* Filtered flat view */}
      {!loading && !showSections && filtered.length > 0 && (
        <div className="mk-grid">
          {filtered.map((product, i) => (
            <ProductCard key={product._id} product={product} index={i} onBuy={handleBuy} isBuying={checkingOut === product._id} coinsFor={coinsFor} />
          ))}
        </div>
      )}

    </div>
  );
}
