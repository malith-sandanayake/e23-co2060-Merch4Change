import { useEffect, useState } from "react";

export default function Home() {
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/v1/home-banners")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("Banner response:", data);
        const banners = Array.isArray(data) ? data : data.data;
        setBanner(banners[0]);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;
  if (!banner) return <div>No banner found</div>;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${banner.url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h1 style={{ color: "white", padding: "2rem" }}>Merch For Change</h1>
    </div>
  );
}
