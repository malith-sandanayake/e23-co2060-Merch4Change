import React, { useEffect, useRef } from "react";
import { Heart, Hammer } from "lucide-react";

/* ─── Floating particle canvas ─────────────────────────────────────────────── */
function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let W = canvas.width = canvas.offsetWidth;
    let H = canvas.height = canvas.offsetHeight;

    const COLORS = ["rgba(13,107,94,", "rgba(212,130,10,", "rgba(255,255,255,"];
    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 3 + 1,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.4 + 0.1,
    }));

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of particles) {
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ")";
        ctx.fill();
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(13,107,94,${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    />
  );
}

/* ─── Main component ───────────────────────────────────────────────────────── */
export default function UnderConstruction({ title = "Something amazing\nis on the way." }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

        @keyframes float-logo {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50% { transform: translateY(-14px) rotate(2deg); }
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          14% { transform: scale(1.18); }
          28% { transform: scale(1); }
          42% { transform: scale(1.1); }
          56% { transform: scale(1); }
        }
        @keyframes spin-slow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(-360deg); }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow-ring {
          0%, 100% { box-shadow: 0 0 0 0 rgba(212,130,10,0.35); }
          50%       { box-shadow: 0 0 0 20px rgba(212,130,10,0); }
        }
        @keyframes badge-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.75; }
        }
      `}</style>

      <div style={{
        minHeight: "100vh", width: "100%",
        background: "linear-gradient(160deg, #021a12 0%, #0D6B5E 45%, #073d32 80%, #052e22 100%)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden", padding: "40px 20px",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <ParticleCanvas />

        {/* Decorative rings */}
        <div style={{ position: "absolute", width: "600px", height: "600px", borderRadius: "50%", border: "1px solid rgba(212,130,10,0.1)", top: "50%", left: "50%", animation: "spin-slow 40s linear infinite" }} />
        <div style={{ position: "absolute", width: "920px", height: "920px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.04)", top: "50%", left: "50%", animation: "spin-reverse 65s linear infinite" }} />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 1, maxWidth: "600px", width: "100%", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>

          {/* Logo mark */}
          <div style={{ marginBottom: "36px", animation: "float-logo 5s ease-in-out infinite" }}>
            <div style={{
              width: "96px", height: "96px", borderRadius: "50%",
              background: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)",
              border: "1.5px solid rgba(255,255,255,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 18px",
              animation: "glow-ring 3s ease-in-out infinite",
            }}>
              <Heart size={42} color="#D4820A" fill="#D4820A" style={{ animation: "heartbeat 2.5s ease-in-out infinite" }} />
            </div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "15px", color: "rgba(255,255,255,0.55)", letterSpacing: "3.5px", textTransform: "uppercase" }}>
              Merch4Change
            </div>
          </div>

          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(212,130,10,0.15)", border: "1px solid rgba(212,130,10,0.3)",
            color: "#FDE68A", borderRadius: "24px", padding: "7px 20px",
            fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 600,
            letterSpacing: "1px", textTransform: "uppercase",
            marginBottom: "32px",
            animation: "fade-up 0.6s ease both, badge-pulse 3s 1s ease-in-out infinite",
          }}>
            <Hammer size={13} /> Under Construction
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(34px, 6vw, 58px)",
            color: "#FFFFFF", lineHeight: 1.15,
            marginBottom: "0",
            animation: "fade-up 0.7s 0.15s ease both",
            whiteSpace: "pre-line",
          }}>
            {title}
          </h1>
        </div>

        {/* Footer */}
        <div style={{
          position: "absolute", bottom: "28px", left: "50%", transform: "translateX(-50%)",
          fontFamily: "'DM Sans', sans-serif", fontSize: "12px",
          color: "rgba(255,255,255,0.25)", textAlign: "center", whiteSpace: "nowrap",
        }}>
          © 2026 Merch4Change · Give directly to causes
        </div>
      </div>
    </>
  );
}
