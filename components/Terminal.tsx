"use client";
import { useState, useRef, useEffect } from "react";

type Line = { type: "input" | "output" | "error"; text: string };

const COMMANDS: Record<string, string | string[]> = {
  help: [
    "Available commands:",
    "  whoami        — who is Abel?",
    "  skills        — tech stack",
    "  projects      — list projects",
    "  contact       — get in touch",
    "  education     — background",
    "  learning      — what I'm studying now",
    "  hire          — why hire me?",
    "  clear         — clear terminal",
  ],
  whoami: [
    "Abel — Full-Stack Developer based in Cairo, Egypt.",
    "I build scalable web apps with Next.js, Node.js, and modern tooling.",
    "Also an educator: I teach ICT and CS at multiple grade levels.",
    "Currently expanding into React Native for mobile development.",
  ],
  skills: [
    "┌─ Frontend ──────────────────────────────┐",
    "│  Next.js · React · TypeScript · Tailwind │",
    "├─ Backend ───────────────────────────────┤",
    "│  Node.js · Express · PostgreSQL · MongoDB│",
    "├─ Mobile ────────────────────────────────┤",
    "│  React Native (learning) · Expo          │",
    "├─ Tools ─────────────────────────────────┤",
    "│  Git · Docker · Vercel · Figma           │",
    "└──────────────────────────────────────────┘",
  ],
  projects: [
    "[ 1 ] ShopFlow — E-Commerce Platform",
    "      Stack: Next.js · TypeScript · Stripe · PostgreSQL",
    "      → Full-featured store with admin dashboard",
    "",
    "[ 2 ] StayFinder — Rental Marketplace",
    "      Stack: Next.js · MongoDB · Mapbox · NextAuth",
    "      → Airbnb-inspired platform with booking system",
  ],
  contact: [
    "📧  abel@example.com",
    "🐙  github.com/abel",
    "💼  linkedin.com/in/abel",
    "🐦  @abel on X",
    "",
    "→ Open to full-time roles & freelance projects.",
  ],
  education: [
    "🎓  Computer Science background",
    "📍  Cairo, Egypt",
    "👨‍🏫  Educator: teaches ICT/CS from Grade 3 to Grade 9",
    "📚  Self-studying System Design & Architecture",
  ],
  learning: [
    "Currently leveling up:",
    "",
    "  📱  React Native + Expo",
    "      → Building cross-platform mobile apps",
    "  🏗️   System Design",
    "      → Scalable architecture patterns",
    "  🔧  Microservices",
    "      → Distributed systems & API design",
    "",
    "Progress: [████████░░] 80% motivated, 20% caffeinated",
  ],
  hire: [
    "Why hire Abel?",
    "",
    "  ✓  Full-stack — ships frontend AND backend",
    "  ✓  Ships fast, cares about code quality",
    "  ✓  Educator mindset — writes clear docs & explains well",
    "  ✓  Self-driven learner — always leveling up",
    "  ✓  Cairo timezone — great for EU & MENA teams",
    "",
    "→ Run 'contact' to reach out.",
  ],
};

export default function Terminal() {
  const [lines, setLines] = useState<Line[]>([
    { type: "output", text: "Abel's terminal v1.0.0 — type 'help' to get started" },
    { type: "output", text: "" },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [commands, setCommands] = useState(COMMANDS);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Try to get dynamic commands from window object
    const sd = (window as any).__SITE_DATA__;
    if (sd && sd.terminalCmds) {
      setCommands(prev => ({ ...prev, ...sd.terminalCmds }));
    } else {
      fetch("/api/site-data")
        .then(r => r.json())
        .then(data => {
          if (data && data.terminalCmds) setCommands(prev => ({ ...prev, ...data.terminalCmds }));
        });
    }
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [lines]);

  const run = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    const newLines: Line[] = [...lines, { type: "input", text: `$ ${cmd}` }];

    if (!trimmed) { setLines(newLines); return; }

    if (trimmed === "clear") { setLines([]); return; }

    const result = commands[trimmed];
    if (result) {
      const outputs = Array.isArray(result) ? result : [result];
      outputs.forEach(t => newLines.push({ type: "output", text: t }));
    } else {
      newLines.push({ type: "error", text: `command not found: ${trimmed}. Try 'help'.` });
    }
    newLines.push({ type: "output", text: "" });
    setLines(newLines);
    setHistory(h => [cmd, ...h]);
    setHistIdx(-1);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") { run(input); setInput(""); }
    if (e.key === "ArrowUp") {
      const idx = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(idx);
      setInput(history[idx] ?? "");
    }
    if (e.key === "ArrowDown") {
      const idx = Math.max(histIdx - 1, -1);
      setHistIdx(idx);
      setInput(idx === -1 ? "" : history[idx]);
    }
  };

  return (
    <section id="terminal" style={{ padding: "100px 24px", maxWidth: 900, margin: "0 auto" }}>
      <p style={{ color: "var(--accent)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, letterSpacing: "0.15em", marginBottom: 12 }}>EASTER EGG</p>
      <h2 style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 8 }}>Interactive Terminal</h2>
      <p style={{ color: "var(--muted)", fontSize: 15, marginBottom: 32 }}>Type commands to explore. Start with <code style={{ color: "var(--accent)", background: "rgba(110,231,183,0.08)", padding: "2px 8px", borderRadius: 4 }}>help</code></p>

      <div
        onClick={() => inputRef.current?.focus()}
        style={{ background: "#0a0e17", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", fontFamily: "monospace", cursor: "text" }}
      >
        {/* Title bar */}
        <div style={{ background: "#111827", padding: "10px 16px", display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid var(--border)" }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840" }} />
          <span style={{ marginLeft: 12, color: "var(--muted)", fontSize: 12 }}>abel@portfolio:~</span>
        </div>

        {/* Output */}
        <div style={{ padding: "20px 24px", minHeight: 320, maxHeight: 420, overflowY: "auto" }}>
          {lines.map((l, i) => (
            <div key={i} style={{
              fontSize: 13, lineHeight: 1.8, whiteSpace: "pre",
              color: l.type === "input" ? "var(--accent)" : l.type === "error" ? "#f87171" : "#94a3b8"
            }}>{l.text}</div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding: "12px 24px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "var(--accent)", fontSize: 13, fontFamily: "monospace" }}>$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            autoFocus
            spellCheck={false}
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "var(--accent)", fontSize: 13, fontFamily: "monospace", caretColor: "var(--accent)" }}
            placeholder="type a command..."
          />
        </div>
      </div>
    </section>
  );
}
