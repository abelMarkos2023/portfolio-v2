"use client";
import { useEffect, useState, useRef } from "react";

type Cert = {
  id: number; title: string; issuer: string; date: string;
  credential_url: string; image_url: string; skills: string[];
};

const ISSUER_COLORS: Record<string, { bg: string; accent: string; icon: string }> = {
  Coursera:   { bg: "rgba(0,86,210,0.12)",   accent: "#0056d2", icon: "🎓" },
  Udacity:    { bg: "rgba(2,155,222,0.12)",   accent: "#029bde", icon: "🚀" },
  Udemy:      { bg: "rgba(168,47,207,0.12)",  accent: "#a82fcf", icon: "📚" },
  Meta:       { bg: "rgba(24,119,242,0.12)",  accent: "#1877f2", icon: "⚡" },
  Google:     { bg: "rgba(234,67,53,0.12)",   accent: "#ea4335", icon: "🔍" },
  Educative:  { bg: "rgba(255,163,0,0.12)",   accent: "#ffa300", icon: "💡" },
  freeCodeCamp:{ bg: "rgba(6,150,171,0.12)", accent: "#0696ab", icon: "🔥" },
  default:    { bg: "rgba(110,231,183,0.08)", accent: "#6ee7b7", icon: "🏅" },
};

function getIssuerStyle(issuer: string) {
  const key = Object.keys(ISSUER_COLORS).find(k => issuer.includes(k));
  return key ? ISSUER_COLORS[key] : ISSUER_COLORS.default;
}

function formatDate(d: string) {
  const [y, m] = d.split("-");
  return new Date(parseInt(y), parseInt(m) - 1).toLocaleString("en", { month: "short", year: "numeric" });
}

export default function Certificates() {
  const [certs, setCerts] = useState<Cert[]>([]);
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const autoRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch("/api/certificates").then(r => r.json()).then(d => { if (Array.isArray(d)) setCerts(d); });
  }, []);

  const startAuto = () => {
    stopAuto();
    autoRef.current = setInterval(() => setActive(a => (a + 1) % (certs.length || 1)), 4000);
  };
  const stopAuto = () => { if (autoRef.current) clearInterval(autoRef.current); };

  useEffect(() => { if (certs.length > 1) startAuto(); return stopAuto; }, [certs.length]);

  const go = (dir: number) => {
    stopAuto();
    setActive(a => (a + dir + certs.length) % certs.length);
    startAuto();
  };

  const onPointerDown = (e: React.PointerEvent) => { setDragging(true); setStartX(e.clientX); stopAuto(); };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragging) return;
    setDragging(false);
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    else startAuto();
  };

  if (certs.length === 0) return null;

  const cert = certs[active];
  const style = getIssuerStyle(cert.issuer);

  return (
    <section id="certificates" style={{ padding: "100px 24px", background: "var(--bg)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <p style={{ color: "var(--accent)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, letterSpacing: "0.15em", marginBottom: 12 }}>CREDENTIALS</p>
        <h2 style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 8 }}>Certificates</h2>
        <p style={{ color: "var(--muted)", fontSize: 15, marginBottom: 48 }}>Courses and certifications I've earned along the way.</p>

        {/* Main card */}
        <div ref={trackRef} onPointerDown={onPointerDown} onPointerUp={onPointerUp} style={{ userSelect: "none", cursor: dragging ? "grabbing" : "grab" }}>
          <div style={{ background: "var(--bg-card)", border: `1px solid ${style.accent}40`, borderRadius: 20, overflow: "hidden", transition: "all 0.4s ease" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }} className="cert-split">
              {/* Left — visual */}
              <div style={{ background: style.bg, padding: "48px 40px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 320, position: "relative", overflow: "hidden" }}>
                {/* Decorative rings */}
                <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", border: `1px solid ${style.accent}20`, top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
                <div style={{ position: "absolute", width: 220, height: 220, borderRadius: "50%", border: `1px solid ${style.accent}30`, top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
                <div style={{ fontSize: 72, marginBottom: 16, position: "relative", zIndex: 2 }}>{style.icon}</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: style.accent, textAlign: "center", position: "relative", zIndex: 2 }}>
                  {cert.issuer.split(" / ")[0]}
                </div>
                <div style={{ marginTop: 12, padding: "4px 14px", background: `${style.accent}20`, border: `1px solid ${style.accent}40`, borderRadius: 100, fontSize: 12, color: style.accent, fontFamily: "var(--font-display)", fontWeight: 700, position: "relative", zIndex: 2 }}>
                  CERTIFIED
                </div>
              </div>

              {/* Right — content */}
              <div style={{ padding: "40px 36px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, letterSpacing: "0.1em", color: "var(--muted)" }}>
                      {formatDate(cert.date)}
                    </div>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, letterSpacing: "0.1em", color: style.accent }}>
                      {String(active + 1).padStart(2, "0")} / {String(certs.length).padStart(2, "0")}
                    </div>
                  </div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(18px,2.5vw,26px)", lineHeight: 1.2, color: "var(--text)", marginBottom: 12 }}>
                    {cert.title}
                  </h3>
                  <div style={{ color: "var(--muted)", fontSize: 14, marginBottom: 24 }}>{cert.issuer}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
                    {cert.skills.map(s => (
                      <span key={s} style={{ background: `${style.accent}12`, border: `1px solid ${style.accent}30`, color: style.accent, padding: "4px 12px", borderRadius: 100, fontSize: 11, fontFamily: "var(--font-display)", fontWeight: 600 }}>{s}</span>
                    ))}
                  </div>
                </div>
                {cert.credential_url && (
                  <a href={cert.credential_url} target="_blank" rel="noopener noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: 8, color: style.accent, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, textDecoration: "none", borderBottom: `1px solid ${style.accent}40`, paddingBottom: 4, width: "fit-content" }}>
                    View Credential →
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, marginTop: 28 }}>
          <button onClick={() => go(-1)} style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--muted)", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)"; (e.currentTarget as HTMLElement).style.color = "var(--accent)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.color = "var(--muted)"; }}>←</button>

          <div style={{ display: "flex", gap: 8 }}>
            {certs.map((_, i) => (
              <button key={i} onClick={() => { stopAuto(); setActive(i); startAuto(); }}
                style={{ width: i === active ? 28 : 8, height: 8, borderRadius: 100, background: i === active ? "var(--accent)" : "var(--border)", border: "none", cursor: "pointer", transition: "all 0.3s", padding: 0 }} />
            ))}
          </div>

          <button onClick={() => go(1)} style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--muted)", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)"; (e.currentTarget as HTMLElement).style.color = "var(--accent)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.color = "var(--muted)"; }}>→</button>
        </div>

        {/* Thumbnail strip */}
        <div style={{ display: "flex", gap: 10, marginTop: 24, overflowX: "auto", paddingBottom: 8, justifyContent: "center", flexWrap: "wrap" }}>
          {certs.map((c, i) => {
            const s = getIssuerStyle(c.issuer);
            return (
              <button key={c.id} onClick={() => { stopAuto(); setActive(i); startAuto(); }}
                style={{ flexShrink: 0, padding: "10px 14px", borderRadius: 10, border: `1px solid ${i === active ? s.accent : "var(--border)"}`, background: i === active ? s.bg : "var(--bg-card)", cursor: "pointer", transition: "all 0.2s", textAlign: "left", minWidth: 120 }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 11, color: i === active ? s.accent : "var(--muted)", letterSpacing: "0.05em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 110 }}>{c.title}</div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
