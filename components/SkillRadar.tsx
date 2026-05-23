"use client";
import { useEffect, useRef, useState } from "react";

const SKILLS = [
  { label: "Frontend", value: 0.88 },
  { label: "Backend", value: 0.78 },
  { label: "Mobile", value: 0.42 },
  { label: "DevOps", value: 0.55 },
  { label: "Architecture", value: 0.65 },
  { label: "UI/UX", value: 0.60 },
];

function polarToCart(angle: number, r: number, cx: number, cy: number) {
  const rad = (angle - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export default function SkillRadar() {
  const [progress, setProgress] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !animated.current) {
        animated.current = true;
        let start = 0;
        const step = () => {
          start += 0.025;
          if (start >= 1) { setProgress(1); return; }
          setProgress(start);
          requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const cx = 200, cy = 200, r = 150;
  const n = SKILLS.length;
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  const polygonPoints = SKILLS.map((s, i) => {
    const angle = (360 / n) * i;
    const val = s.value * progress;
    return polarToCart(angle, r * val, cx, cy);
  });

  const polyStr = polygonPoints.map(p => `${p.x},${p.y}`).join(" ");

  return (
    <section id="skills-radar" style={{ padding: "100px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <p style={{ color: "var(--accent)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, letterSpacing: "0.15em", marginBottom: 12 }}>SKILL BREAKDOWN</p>
        <h2 style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 8 }}>Radar Chart</h2>
        <p style={{ color: "var(--muted)", fontSize: 15, marginBottom: 40 }}>An honest look at where I'm strong — and where I'm growing.</p>

        <div ref={ref} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }} className="radar-grid">
          {/* SVG Radar */}
          <svg viewBox="0 0 400 400" style={{ width: "100%", maxWidth: 400 }}>
            {/* Grid levels */}
            {levels.map(l => {
              const pts = SKILLS.map((_, i) => {
                const p = polarToCart((360 / n) * i, r * l, cx, cy);
                return `${p.x},${p.y}`;
              }).join(" ");
              return <polygon key={l} points={pts} fill="none" stroke="var(--border)" strokeWidth={1} />;
            })}

            {/* Axes */}
            {SKILLS.map((_, i) => {
              const end = polarToCart((360 / n) * i, r, cx, cy);
              return <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="var(--border)" strokeWidth={1} />;
            })}

            {/* Skill polygon */}
            <polygon points={polyStr} fill="rgba(110,231,183,0.15)" stroke="var(--accent)" strokeWidth={2} />

            {/* Dots */}
            {polygonPoints.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={hovered === i ? 7 : 5}
                fill={hovered === i ? "var(--accent)" : "var(--bg)"}
                stroke="var(--accent)" strokeWidth={2}
                style={{ cursor: "pointer", transition: "r 0.2s" }}
                onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} />
            ))}

            {/* Labels */}
            {SKILLS.map((s, i) => {
              const angle = (360 / n) * i;
              const lp = polarToCart(angle, r + 28, cx, cy);
              const isActive = hovered === i;
              return (
                <text key={i} x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="middle"
                  fontSize={isActive ? 14 : 12} fontWeight={isActive ? 700 : 500}
                  fill={isActive ? "var(--accent)" : "var(--muted)"}
                  fontFamily="var(--font-display)" style={{ transition: "fill 0.2s, font-size 0.2s" }}>
                  {s.label}
                </text>
              );
            })}
          </svg>

          {/* Legend bars */}
          <div>
            {SKILLS.map((s, i) => (
              <div key={i} style={{ marginBottom: 20 }}
                onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: hovered === i ? "var(--accent)" : "var(--text)", transition: "color 0.2s" }}>
                    {s.label}
                  </span>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--accent)" }}>
                    {Math.round(s.value * progress * 100)}%
                  </span>
                </div>
                <div style={{ height: 6, background: "var(--border)", borderRadius: 100, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${s.value * progress * 100}%`, background: `linear-gradient(90deg, var(--accent), var(--accent-2))`, borderRadius: 100, transition: "width 0.1s" }} />
                </div>
                {s.label === "Mobile" && (
                  <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4, fontStyle: "italic" }}>
                    📱 Currently learning React Native
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
