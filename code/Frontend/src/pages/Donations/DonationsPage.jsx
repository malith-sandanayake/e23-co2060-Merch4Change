import React, { useState, useEffect } from "react";
import TopNavbar from "../../components/TopNavbar/TopNavbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import DonationModal from "../../components/donations/DonationModal";
import "../Home/Home.css";
import "./Donations.css";
import { getDonationStats } from "../../api/donationsService";
import { Search, ArrowRight, ShieldCheck, Heart, Leaf, BookOpen, Stethoscope, Droplets, Wifi, ChevronRight } from "lucide-react";
import axios from "axios";

const CHARITIES = [
  {
    id: 1, tag: "Nature", TagIcon: Leaf, tagColor: "#166534", tagBg: "#DCFCE7",
    name: "Green Canopy Initiative",
    desc: "Restoring native forests across Sri Lanka's central highlands while empowering local farming communities.",
    raised: 4900000, goal: 12000000, percent: 75,
    gradient: "linear-gradient(135deg, #064e3b 0%, #059669 100%)",
    img: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80",
  },
  {
    id: 2, tag: "Education", TagIcon: BookOpen, tagColor: "#92400e", tagBg: "#FEF3C7",
    name: "Future Scholars Fund",
    desc: "Scholarships and vocational training for underprivileged youth across every province in Sri Lanka.",
    raised: 12000000, goal: 30000000, percent: 40,
    gradient: "linear-gradient(135deg, #78350f 0%, #d97706 100%)",
    img: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80",
  },
  {
    id: 3, tag: "Health", TagIcon: Stethoscope, tagColor: "#0c4a6e", tagBg: "#E0F2FE",
    name: "Mobile Medics Network",
    desc: "Deploying mobile clinics with full diagnostic capability to villages without any healthcare access.",
    raised: 890000, goal: 1000000, percent: 92,
    gradient: "linear-gradient(135deg, #0c4a6e 0%, #0284c7 100%)",
    img: "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=800&q=80",
  },
];

const PROJECTS = [
  { id: 1, Icon: Droplets, name: "Clean Water Wells (District 4)", desc: "Solar-powered wells providing potable water to 300+ rural families.", raised: 4100000, goal: 4500000, img: "https://images.unsplash.com/photo-1541848756149-e3843fcbbde0?w=400&q=80" },
  { id: 2, Icon: Wifi, name: "Empowerment Hubs", desc: "Community digital literacy centers with internet connectivity and skills training.", raised: 2200000, goal: 5000000, img: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&q=80" },
];

const pct = (r, g) => Math.round((r / g) * 100);
const lkrM = (n) => n >= 1000000 ? `LKR ${(n / 1000000).toFixed(1)}M` : `LKR ${n.toLocaleString()}`;

function CharityCard({ c, onSelect }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: "#fff", border: "1px solid #E2DAD0", borderRadius: "20px", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: hov ? "0 20px 60px rgba(13,107,94,0.12)" : "0 2px 8px rgba(0,0,0,0.04)", transition: "all 0.3s ease", transform: hov ? "translateY(-4px)" : "translateY(0)" }}>
      {/* Image */}
      <div style={{ position: "relative", height: "200px", overflow: "hidden" }}>
        <img src={c.img} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease", transform: hov ? "scale(1.06)" : "scale(1)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)" }} />
        <span style={{ position: "absolute", top: "14px", left: "14px", backgroundColor: c.tagBg, color: c.tagColor, fontFamily: "'DM Sans',sans-serif", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", padding: "4px 12px", borderRadius: "20px", letterSpacing: "0.5px", display: "flex", alignItems: "center", gap: "4px" }}>
          <c.TagIcon size={10} /> {c.tag}
        </span>
        <div style={{ position: "absolute", bottom: "14px", left: "14px", right: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'DM Sans',sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.9)", marginBottom: "6px" }}>
            <span>{lkrM(c.raised)} raised</span><span style={{ fontWeight: 600, color: "#FDE68A" }}>{c.percent}%</span>
          </div>
          <div style={{ height: "5px", background: "rgba(255,255,255,0.3)", borderRadius: "4px" }}>
            <div style={{ height: "100%", width: `${c.percent}%`, background: "#FDE68A", borderRadius: "4px" }} />
          </div>
        </div>
      </div>
      {/* Body */}
      <div style={{ padding: "20px", flex: 1 }}>
        <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "18px", color: "#1A1A1A", marginBottom: "8px", lineHeight: 1.3 }}>{c.name}</h3>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", color: "#6B6560", lineHeight: 1.6, marginBottom: "0" }}>{c.desc}</p>
      </div>
      {/* Footer */}
      <div style={{ padding: "16px 20px", borderTop: "1px solid #F0EBE1", display: "flex", gap: "10px" }}>
        <button onClick={() => onSelect(c.name)}
          style={{ flex: 1, background: "#0D6B5E", color: "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: "13px", fontWeight: 500, padding: "11px 16px", borderRadius: "10px", border: "none", cursor: "pointer", transition: "background 0.2s" }}
          onMouseEnter={e => e.target.style.background = "#085048"} onMouseLeave={e => e.target.style.background = "#0D6B5E"}>
          Select cause
        </button>
        <button style={{ width: "40px", height: "40px", background: "#F0EBE1", border: "none", borderRadius: "10px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#6B6560", flexShrink: 0 }}>
          <Heart size={16} />
        </button>
      </div>
    </div>
  );
}

function ProjectCard({ p, onDonate }) {
  const [hov, setHov] = useState(false);
  const progress = pct(p.raised, p.goal);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: "#fff", border: "1px solid #E2DAD0", borderRadius: "16px", overflow: "hidden", display: "flex", gap: "0", boxShadow: hov ? "0 12px 40px rgba(0,0,0,0.08)" : "none", transition: "all 0.3s ease" }}>
      <img src={p.img} alt={p.name} style={{ width: "120px", flexShrink: 0, objectFit: "cover" }} />
      <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <h4 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "16px", color: "#1A1A1A", marginBottom: "6px" }}>{p.name}</h4>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "12px", color: "#6B6560", lineHeight: 1.5, marginBottom: "12px" }}>{p.desc}</p>
          <div style={{ height: "5px", background: "#F0EBE1", borderRadius: "4px", marginBottom: "8px" }}>
            <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg, #D4820A, #f59e0b)", borderRadius: "4px" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'DM Sans',sans-serif", fontSize: "12px" }}>
            <span style={{ color: "#6B6560" }}>{lkrM(p.raised)} raised of {lkrM(p.goal)}</span>
            <span style={{ color: "#D4820A", fontWeight: 600 }}>{progress}%</span>
          </div>
        </div>
        <button onClick={() => onDonate(p.name)}
          style={{ marginTop: "12px", background: "transparent", border: "1.5px solid #0D6B5E", color: "#0D6B5E", fontFamily: "'DM Sans',sans-serif", fontSize: "13px", fontWeight: 500, padding: "8px 16px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", width: "fit-content" }}
          onMouseEnter={e => { e.currentTarget.style.background = "#0D6B5E"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#0D6B5E"; }}>
          Donate to project <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

export default function DonationsPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [profileData, setProfileData] = useState({});
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [prefilledCharity, setPrefilledCharity] = useState("");
  const [prefilledProject, setPrefilledProject] = useState("");
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) return;
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const res = await axios.get(`${apiUrl}/api/v1/profile/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.data?.success) setProfileData(res.data.data.user);
      } catch {}
    };
    fetchProfile();
  }, []);

  const openModal = (charity = "", project = "") => { setPrefilledCharity(charity); setPrefilledProject(project); setModalOpen(true); };
  const handleSuccess = (name) => { setModalOpen(false); setSuccessMsg(`✓ Donation successful! Thank you for supporting ${name}.`); setTimeout(() => setSuccessMsg(null), 5000); };

  const filtered = CHARITIES.filter(c => c.name.toLowerCase().includes(query.toLowerCase()) || c.desc.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className={`luminous-app ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <TopNavbar profileData={profileData} isSidebarCollapsed={isSidebarCollapsed} setIsSidebarCollapsed={setIsSidebarCollapsed} />
      <div className="lum-layout">
        <Sidebar profileData={profileData} setIsSidebarCollapsed={setIsSidebarCollapsed} />
        <main className="donations-main">

          {/* ── HERO ─────────────────────────────────────────────────── */}
          <div style={{ background: "linear-gradient(160deg, #052e22 0%, #0D6B5E 55%, #0a8a6e 100%)", padding: "80px 24px 0", position: "relative", overflow: "hidden" }}>
            {/* Decorative circles */}
            <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "400px", height: "400px", borderRadius: "50%", background: "rgba(255,255,255,0.03)" }} />
            <div style={{ position: "absolute", bottom: "40px", left: "-60px", width: "280px", height: "280px", borderRadius: "50%", background: "rgba(212,130,10,0.08)" }} />

            <div style={{ maxWidth: "720px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
              <span style={{ display: "inline-block", background: "rgba(212,130,10,0.2)", color: "#FDE68A", fontFamily: "'DM Sans',sans-serif", fontSize: "12px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", padding: "6px 16px", borderRadius: "20px", marginBottom: "24px", border: "1px solid rgba(212,130,10,0.3)" }}>
                100% transparent giving
              </span>
              <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "clamp(32px,5vw,56px)", color: "#FFFFFF", lineHeight: 1.15, marginBottom: "20px" }}>
                Give directly to<br /><em style={{ color: "#FDE68A" }}>causes you believe in</em>
              </h1>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "16px", color: "rgba(255,255,255,0.75)", lineHeight: 1.7, maxWidth: "500px", margin: "0 auto 44px" }}>
                Track every cent from your wallet to the final beneficiary with real-time impact reporting and zero platform fees.
              </p>

              {/* Stats row */}
              <div style={{ display: "flex", justifyContent: "center", gap: "0", marginBottom: "48px" }}>
                {[{ v: "LKR 12M+", l: "Total donated" }, { v: "4.2K", l: "Active donors" }, { v: "84", l: "Charities" }].map((s, i) => (
                  <div key={s.l} style={{ textAlign: "center", padding: "0 32px", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.15)" : "none" }}>
                    <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: "28px", color: "#FDE68A", fontWeight: 400 }}>{s.v}</div>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.6)", marginTop: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.l}</div>
                  </div>
                ))}
              </div>

              {/* Search */}
              <div style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", borderRadius: "16px", padding: "6px 6px 6px 20px", display: "flex", alignItems: "center", gap: "12px", boxShadow: "0 24px 64px rgba(0,0,0,0.2)", marginBottom: "0" }}>
                <Search size={18} color="#6B6560" style={{ flexShrink: 0 }} />
                <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search for causes, charities, or projects..."
                  style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontFamily: "'DM Sans',sans-serif", fontSize: "14px", color: "#1A1A1A", padding: "10px 0" }} />
                <button onClick={() => openModal()}
                  style={{ background: "#D4820A", color: "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: "14px", fontWeight: 500, padding: "12px 24px", borderRadius: "12px", border: "none", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}
                  onMouseEnter={e => e.target.style.background = "#be7509"} onMouseLeave={e => e.target.style.background = "#D4820A"}>
                  Donate Now
                </button>
              </div>
            </div>

            {/* Wave divider */}
            <svg viewBox="0 0 1440 60" style={{ display: "block", marginTop: "48px", width: "100%" }} preserveAspectRatio="none">
              <path d="M0,40 C360,80 1080,0 1440,40 L1440,60 L0,60 Z" fill="#FAF7F2" />
            </svg>
          </div>

          {/* ── SUCCESS BANNER ────────────────────────────────────────── */}
          {successMsg && (
            <div style={{ maxWidth: "960px", margin: "24px auto 0", padding: "0 24px" }}>
              <div style={{ background: "#E1F5EE", border: "1px solid #0D6B5E", borderRadius: "12px", padding: "14px 20px", fontFamily: "'DM Sans',sans-serif", fontSize: "14px", color: "#0D6B5E" }}>{successMsg}</div>
            </div>
          )}

          <div style={{ padding: "48px 40px 80px" }}>

            {/* ── TOP CHARITIES ─────────────────────────────────────── */}
            <div style={{ marginBottom: "64px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
                <div>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "12px", fontWeight: 600, color: "#D4820A", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Featured</div>
                  <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "28px", color: "#1A1A1A", margin: 0 }}>Top Charities</h2>
                </div>
                <button style={{ display: "flex", alignItems: "center", gap: "6px", background: "transparent", border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: "14px", color: "#D4820A", fontWeight: 500 }}>
                  View all <ArrowRight size={14} />
                </button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: "24px" }}>
                {filtered.map(c => <CharityCard key={c.id} c={c} onSelect={name => openModal(name)} />)}
                {!filtered.length && <p style={{ gridColumn: "1/-1", fontFamily: "'DM Sans',sans-serif", color: "#6B6560", fontSize: "14px" }}>No results found.</p>}
              </div>
            </div>

            {/* ── ONGOING PROJECTS ──────────────────────────────────── */}
            <div style={{ marginBottom: "64px" }}>
              <div style={{ marginBottom: "32px" }}>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "12px", fontWeight: 600, color: "#D4820A", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Needs Funding</div>
                <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "28px", color: "#1A1A1A", margin: "0 0 6px" }}>Ongoing Projects</h2>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "14px", color: "#6B6560", margin: 0 }}>Specific infrastructure initiatives requiring immediate support.</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px,1fr))", gap: "20px" }}>
                {PROJECTS.map(p => <ProjectCard key={p.id} p={p} onDonate={name => openModal("", name)} />)}
              </div>
            </div>

            {/* ── TRUST SECTION ─────────────────────────────────────── */}
            <div style={{ background: "linear-gradient(135deg, #052e22 0%, #0D6B5E 100%)", borderRadius: "24px", padding: "56px 40px", textAlign: "center", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
              <div style={{ position: "absolute", bottom: "-60px", left: "-60px", width: "240px", height: "240px", borderRadius: "50%", background: "rgba(212,130,10,0.08)" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ width: "64px", height: "64px", background: "rgba(255,255,255,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  <ShieldCheck size={30} color="#FDE68A" />
                </div>
                <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "28px", color: "#FFFFFF", marginBottom: "14px" }}>Secure &amp; Transparent</h3>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "15px", color: "rgba(255,255,255,0.75)", maxWidth: "480px", margin: "0 auto 36px", lineHeight: 1.7 }}>
                  100% of your donation goes directly to the mission. Operational costs are covered by our institutional partners. Every transaction is publicly auditable.
                </p>
                <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "24px" }}>
                  {["201-4b Accredited", "Tax Deductible", "Public Ledger"].map(b => (
                    <span key={b} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.85)", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ width: "20px", height: "20px", background: "rgba(253,230,138,0.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#FDE68A", fontSize: "11px" }}>✓</span>
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── FOOTER ────────────────────────────────────────────────── */}
          <footer style={{ borderTop: "1px solid #E2DAD0", padding: "48px 24px", backgroundColor: "#FAF7F2" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "40px" }}>
              <div>
                <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: "18px", color: "#1A1A1A", marginBottom: "10px" }}>Merch4Change</div>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", color: "#6B6560", lineHeight: 1.7 }}>High-trust institutional giving for a better world. Every donation tracked, every impact measured.</p>
              </div>
              {[{ h: "Navigation", links: ["About Us", "Transparency", "Impact Stories"] }, { h: "Governance", links: ["Privacy Policy", "Terms", "Tax Deductibility"] }, { h: "Connect", links: ["Colombo, Sri Lanka"] }].map(col => (
                <div key={col.h}>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", fontWeight: 700, color: "#1A1A1A", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "14px" }}>{col.h}</div>
                  <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                    {col.links.map(l => <li key={l} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", color: "#6B6560", cursor: "pointer" }} onMouseEnter={e => e.target.style.color = "#0D6B5E"} onMouseLeave={e => e.target.style.color = "#6B6560"}>{l}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </footer>
        </main>
      </div>

      <DonationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSuccess={handleSuccess} initialProject={prefilledProject} />
    </div>
  );
}
