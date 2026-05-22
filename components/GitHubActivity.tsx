"use client";
import { useEffect, useState } from "react";

type CommitEvent = { repo: string; message: string; date: string };

function generateHeatmap() {
  const weeks = 52;
  const days = 7;
  const data: number[][] = [];
  for (let w = 0; w < weeks; w++) {
    const week: number[] = [];
    for (let d = 0; d < days; d++) {
      const rand = Math.random();
      week.push(rand > 0.45 ? Math.floor(rand * 8) : 0);
    }
    data.push(week);
  }
  return data;
}

const MOCK_COMMITS: CommitEvent[] = [
  { repo: "shopflow", message: "feat: add stripe webhook handler", date: "2 hours ago" },
  { repo: "stayfinder", message: "fix: resolve booking overlap bug", date: "1 day ago" },
  { repo: "portfolio", message: "chore: add terminal easter egg", date: "2 days ago" },
  { repo: "shopflow", message: "feat: implement product search with filters", date: "3 days ago" },
  { repo: "rn-experiments", message: "feat: first React Native screen", date: "4 days ago" },
  { repo: "stayfinder", message: "refactor: extract map component", date: "5 days ago" },
];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function GitHubActivity() {
  const [heatmap] = useState(generateHeatmap);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; val: number } | null>(null);

  const totalContribs = heatmap.flat().reduce((a, b) => a + b, 0);
  const streak = 14;

  const cellColor = (v: number) => {
    if (v === 0) return "var(--border)";
    if (v <= 2) return "rgba(110,231,183,0.25)";
    if (v <= 4) return "rgba(110,231,183,0.5)";
    if (v <= 6) return "rgba(110,231,183,0.75)";
    return "var(--accent)";
  };

  return (
    <section id="github" style={{ padding: "100px 24px", background: "var(--bg-2)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <p style={{ color: "var(--accent)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, letterSpacing: "0.15em", marginBottom: 12 }}>PROOF OF WORK</p>
        <h2 style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 8 }}>GitHub Activity</h2>
        <p style={{ color: "var(--muted)", fontSize: 15, marginBottom: 40 }}>I ship consistently — here's the evidence.</p>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32, maxWidth: 480 }}>
          {[
            { label: "Contributions this year", val: totalContribs },
            { label: "Day streak", val: streak },
            { label: "Public repos", val: 18 },
          ].map(s => (
            <div key={s.label} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: "16px 20px" }}>
              <div style={{ fontSize: "clamp(22px,4vw,32px)", fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--accent)" }}>{s.val}</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Heatmap */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 24, marginBottom: 24, overflowX: "auto" }}>
          <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
            {MONTHS.map((m, i) => (
              <div key={m} style={{ flex: i === MONTHS.length - 1 ? 1 : "0 0 calc(100%/12)", fontSize: 11, color: "var(--muted)", fontFamily: "var(--font-display)" }}>{m}</div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 3, position: "relative" }}>
            {heatmap.map((week, wi) => (
              <div key={wi} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {week.map((val, di) => (
                  <div
                    key={di}
                    onMouseEnter={e => setTooltip({ x: e.clientX, y: e.clientY, val })}
                    onMouseLeave={() => setTooltip(null)}
                    style={{ width: 12, height: 12, borderRadius: 2, background: cellColor(val), cursor: "default", transition: "transform 0.1s" }}
                    onMouseOver={e => (e.currentTarget.style.transform = "scale(1.3)")}
                    onMouseOut={e => (e.currentTarget.style.transform = "scale(1)")}
                  />
                ))}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12, justifyContent: "flex-end" }}>
            <span style={{ fontSize: 11, color: "var(--muted)" }}>Less</span>
            {[0,1,3,5,7].map(v => (
              <div key={v} style={{ width: 12, height: 12, borderRadius: 2, background: cellColor(v) }} />
            ))}
            <span style={{ fontSize: 11, color: "var(--muted)" }}>More</span>
          </div>
        </div>

        {/* Recent commits */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, letterSpacing: "0.08em", color: "var(--muted)" }}>
            RECENT COMMITS
          </div>
          {MOCK_COMMITS.map((c, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 24px", borderBottom: i < MOCK_COMMITS.length - 1 ? "1px solid var(--border)" : "none", transition: "background 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }} />
              <span style={{ fontFamily: "monospace", fontSize: 12, color: "var(--accent-2)", flexShrink: 0, minWidth: 120 }}>{c.repo}</span>
              <span style={{ fontFamily: "monospace", fontSize: 13, color: "var(--text)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.message}</span>
              <span style={{ fontSize: 12, color: "var(--muted)", flexShrink: 0 }}>{c.date}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
