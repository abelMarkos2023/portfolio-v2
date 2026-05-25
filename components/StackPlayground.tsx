"use client";
import { useState } from "react";

type Step = { question: string; options: { label: string; icon: string; next: string }[] };
type Result = { title: string; stack: { name: string; role: string; why: string }[]; note: string };

const STEPS: Record<string, Step> = {
  start: {
    question: "What are you building?",
    options: [
      { label: "Web App", icon: "🌐", next: "web-scale" },
      { label: "Mobile App", icon: "📱", next: "mobile-platform" },
      { label: "API / Backend", icon: "⚙️", next: "api-type" },
      { label: "E-Commerce", icon: "🛒", next: "result-ecom" },
    ],
  },
  "web-scale": {
    question: "What's the traffic expectation?",
    options: [
      { label: "Small / MVP", icon: "🌱", next: "result-web-mvp" },
      { label: "Medium Scale", icon: "📈", next: "result-web-mid" },
      { label: "High Traffic", icon: "🚀", next: "result-web-large" },
    ],
  },
  "mobile-platform": {
    question: "Which platforms?",
    options: [
      { label: "iOS + Android", icon: "📲", next: "result-rn" },
      { label: "iOS only", icon: "", next: "result-rn" },
      { label: "Android only", icon: "🤖", next: "result-rn" },
    ],
  },
  "api-type": {
    question: "What kind of API?",
    options: [
      { label: "REST API", icon: "🔗", next: "result-rest" },
      { label: "GraphQL", icon: "◈", next: "result-graphql" },
      { label: "Real-time", icon: "⚡", next: "result-realtime" },
    ],
  },
};

const RESULTS: Record<string, Result> = {
  "result-web-mvp": {
    title: "Perfect for an MVP",
    stack: [
      { name: "Next.js", role: "Frontend + API routes", why: "One repo, full-stack, deploy in minutes" },
      { name: "Tailwind CSS", role: "Styling", why: "Ship UI fast, no design system needed yet" },
      { name: "PlanetScale / Neon", role: "Database", why: "Serverless SQL, free tier is generous" },
      { name: "Vercel", role: "Hosting", why: "Zero config deploys, automatic previews" },
    ],
    note: "Get to users fast. Don't over-engineer before you have product-market fit.",
  },
  "result-web-mid": {
    title: "Production-ready setup",
    stack: [
      { name: "Next.js", role: "Frontend", why: "SSR, SSG, and API routes in one framework" },
      { name: "Node.js + Express", role: "API layer", why: "Separate when complexity warrants it" },
      { name: "PostgreSQL + Prisma", role: "Database", why: "Relational, type-safe, scales well" },
      { name: "Redis", role: "Caching / sessions", why: "Reduces DB load significantly at scale" },
    ],
    note: "Start separating concerns. You'll thank yourself when the team grows.",
  },
  "result-web-large": {
    title: "High-scale architecture",
    stack: [
      { name: "Next.js", role: "Frontend (CDN-cached)", why: "Edge rendering for global low latency" },
      { name: "Microservices", role: "Backend", why: "Scale individual services independently" },
      { name: "PostgreSQL + Read replicas", role: "Database", why: "Write/read separation for performance" },
      { name: "Message queue (BullMQ)", role: "Async tasks", why: "Decouple heavy operations from requests" },
    ],
    note: "Only go here when you need it. Premature scaling is expensive.",
  },
  "result-rn": {
    title: "Cross-platform mobile",
    stack: [
      { name: "React Native + Expo", role: "Mobile framework", why: "One codebase for iOS + Android, faster iteration" },
      { name: "React Navigation", role: "Routing", why: "The standard — well-maintained, great DX" },
      { name: "Zustand", role: "State management", why: "Simpler than Redux, more scalable than Context" },
      { name: "Supabase", role: "Backend + Auth", why: "Real-time, auth, storage — all included" },
    ],
    note: "I'm currently learning this stack. React Native reuses most React knowledge — the mental model transfers cleanly.",
  },
  "result-rest": {
    title: "REST API setup",
    stack: [
      { name: "Node.js + Express", role: "Server", why: "Mature ecosystem, huge community" },
      { name: "TypeScript", role: "Type safety", why: "Catch bugs at compile time, not runtime" },
      { name: "PostgreSQL + Prisma", role: "Database + ORM", why: "Type-safe queries, auto-migrations" },
      { name: "Zod", role: "Validation", why: "Schema validation that matches your TypeScript types" },
    ],
    note: "REST is still the right call for most APIs. GraphQL adds complexity you often don't need.",
  },
  "result-graphql": {
    title: "GraphQL API",
    stack: [
      { name: "Apollo Server", role: "GraphQL server", why: "Most battle-tested GraphQL implementation" },
      { name: "TypeGraphQL", role: "Schema-first types", why: "TypeScript decorators → auto schema generation" },
      { name: "PostgreSQL + Prisma", role: "Data layer", why: "Prisma's resolver pattern fits GraphQL well" },
      { name: "DataLoader", role: "Batching", why: "Solves the N+1 query problem — essential for GraphQL" },
    ],
    note: "Use GraphQL when your clients have very different data needs. Don't default to it.",
  },
  "result-realtime": {
    title: "Real-time backend",
    stack: [
      { name: "Socket.io", role: "WebSockets", why: "Handles reconnection, fallbacks, rooms out of the box" },
      { name: "Node.js", role: "Server", why: "Event-loop model is ideal for real-time connections" },
      { name: "Redis Pub/Sub", role: "Message broker", why: "Scales WebSockets across multiple server instances" },
      { name: "MongoDB", role: "Database", why: "Flexible schema suits chat/event data well" },
    ],
    note: "Real-time is harder than it looks. Plan for reconnection, message ordering, and offline states from day one.",
  },
  "result-ecom": {
    title: "E-Commerce stack",
    stack: [
      { name: "Next.js", role: "Storefront", why: "SSR is crucial for SEO on product pages" },
      { name: "Stripe", role: "Payments", why: "Handles PCI compliance, fraud detection, subscriptions" },
      { name: "PostgreSQL + Prisma", role: "Database", why: "Relational model fits orders, products, users perfectly" },
      { name: "Cloudinary", role: "Image hosting", why: "Auto-optimization and CDN for product images" },
    ],
    note: "I built ShopFlow with this exact stack. It handles flash sales, B2B pricing tiers, and custom checkout flows.",
  },
};

export default function StackPlayground() {
  const [path, setPath] = useState<string[]>(["start"]);
  const [done, setDone] = useState(false);

  const current = path[path.length - 1];
  const step = STEPS[current];
  const result = done ? RESULTS[current] : null;

  const choose = (next: string) => {
    if (next.startsWith("result-")) {
      setPath(p => [...p, next]);
      setDone(true);
    } else {
      setPath(p => [...p, next]);
    }
  };

  const reset = () => { setPath(["start"]); setDone(false); };

  return (
    <section id="stack-playground" style={{ padding: "100px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <p style={{ color: "var(--accent)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, letterSpacing: "0.15em", marginBottom: 12 }}>OPINIONATED PICKS</p>
        <h2 style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 8 }}>Stack Playground</h2>
        <p style={{ color: "var(--muted)", fontSize: 15, marginBottom: 40 }}>Tell me what you are building — I'll tell you what I'd use and why.</p>

        {/* Breadcrumb */}
        {path.length > 1 && (
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 32, flexWrap: "wrap" }}>
            {path.filter(p => !p.startsWith("result-")).map((p, i) => (
              <span key={i} style={{ fontSize: 12, fontFamily: "var(--font-display)", fontWeight: 600, color: i === path.filter(p => !p.startsWith("result-")).length - 1 ? "var(--accent)" : "var(--muted)" }}>
                {i > 0 && <span style={{ marginRight: 8 }}>→</span>}
                {p.replace(/-/g, " ")}
              </span>
            ))}
          </div>
        )}

        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: "clamp(20px, 5vw, 40px)" }}>
          {!result ? (
            <>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(20px, 4vw, 24px)", marginBottom: 32, color: "var(--text)" }}>
                {step?.question}
              </h3>
              <div className="stack-options" style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {step?.options.map(o => (
                  <button key={o.label} onClick={() => choose(o.next)}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10, cursor: "pointer", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--text)", transition: "all 0.2s", flex: "1 1 auto", minWidth: "fit-content", justifyContent: "center" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)"; (e.currentTarget as HTMLElement).style.color = "var(--accent)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.color = "var(--text)"; }}>
                    <span style={{ fontSize: 24 }}>{o.icon}</span> {o.label}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, gap: 16, flexWrap: "wrap" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(20px, 4vw, 26px)", color: "var(--text)" }}>
                  My pick: {result.title}
                </h3>
                <button onClick={reset} style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--muted)", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, letterSpacing: "0.05em" }}>
                  RESET
                </button>
              </div>
              <div style={{ display: "grid", gap: 12, marginBottom: 24 }}>
                {result.stack.map((s, i) => (
                  <div key={i} className="stack-row" style={{ display: "grid", gridTemplateColumns: "160px 140px 1fr", gap: 16, padding: "16px 20px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10, alignItems: "center" }}>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 15, color: "var(--accent)" }}>{s.name}</span>
                    <span style={{ fontSize: 12, color: "var(--muted)", fontFamily: "var(--font-display)", fontWeight: 600 }}>{s.role}</span>
                    <span style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>{s.why}</span>
                  </div>
                ))}
              </div>
              <div style={{ padding: "16px 20px", background: "rgba(110,231,183,0.05)", borderRadius: 10, borderLeft: "2px solid var(--accent)" }}>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, color: "var(--accent)", letterSpacing: "0.1em" }}>MY TAKE  </span>
                <span style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>{result.note}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
