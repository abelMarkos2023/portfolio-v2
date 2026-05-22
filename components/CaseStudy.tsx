"use client";
import { useState } from "react";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";

type CaseStudy = {
  id: string;
  project: string;
  emoji: string;
  tagline: string;
  problem: string;
  solution: string;
  decisions: { title: string; detail: string }[];
  results: { label: string; value: string }[];
  lessons: string;
  tech: string[];
};

const CASES: CaseStudy[] = [
  {
    id: "shopflow",
    project: "ShopFlow",
    emoji: "🛒",
    tagline: "E-Commerce at scale",
    problem: "The client needed a storefront that could handle flash sales — spikes to 10k concurrent users — without crashing. Their existing Shopify setup couldn't support custom checkout logic or B2B pricing tiers.",
    solution: "Built a custom Next.js storefront with server-side rendering for SEO, Stripe for payments, and PostgreSQL with Prisma for flexible product/pricing models. Used Redis for session caching to handle traffic spikes.",
    decisions: [
      { title: "Server components over client rendering", detail: "Critical for SEO and initial page load speed. Product pages needed to rank on Google — pure client-side wouldn't cut it." },
      { title: "PostgreSQL over MongoDB", detail: "Relational data (orders, users, products, variants) made more sense with SQL. ACID compliance was non-negotiable for financial transactions." },
      { title: "Stripe over custom payments", detail: "Stripe handles PCI compliance so we don't have to. The extra ~2.9% fee is far cheaper than a security audit or breach." },
    ],
    results: [
      { label: "Page load", value: "< 1.2s" },
      { label: "Conversion rate", value: "+34%" },
      { label: "Uptime", value: "99.9%" },
      { label: "Concurrent users", value: "10,000+" },
    ],
    lessons: "I underestimated how much edge cases matter in e-commerce. Returns, refunds, partial fulfillment, coupon stacking — each one adds complexity. Next time I'd map out every checkout state before writing a line of code.",
    tech: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Stripe", "Redis", "Vercel"],
  },
  {
    id: "stayfinder",
    project: "StayFinder",
    emoji: "🏠",
    tagline: "Rental marketplace, done right",
    problem: "Existing rental platforms in the region had poor UX, no real-time availability, and clunky booking flows. The goal was to build something that felt as polished as Airbnb but tailored to local needs.",
    solution: "Built a marketplace with Next.js, NextAuth for auth, MongoDB for flexible listing data, Mapbox for maps, and Cloudinary for image hosting. Real-time availability was solved with a calendar blocking system.",
    decisions: [
      { title: "MongoDB over PostgreSQL", detail: "Listings have highly variable schemas — number of rooms, amenities, house rules differ wildly. Document storage was a better fit than forcing everything into rigid tables." },
      { title: "NextAuth over custom auth", detail: "Auth is a solved problem. Building it from scratch is a liability. NextAuth gave us Google/GitHub OAuth in hours, not days." },
      { title: "Mapbox over Google Maps", detail: "Better customization for the dark theme, more generous free tier, and the API is cleaner to work with in React." },
    ],
    results: [
      { label: "Listings", value: "500+" },
      { label: "Booking flow", value: "3 steps" },
      { label: "Image load time", value: "< 400ms" },
      { label: "Mobile score", value: "94/100" },
    ],
    lessons: "Real-time features are deceptively hard. What looks like a simple calendar becomes a distributed consistency problem when two users try to book the same dates simultaneously. I'd build optimistic locking into the data model from day one next time.",
    tech: ["Next.js", "TypeScript", "MongoDB", "NextAuth", "Mapbox", "Cloudinary", "Tailwind"],
  },
];

function CaseCard({ c }: { c: CaseStudy }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", transition: "border-color 0.3s", marginBottom: 16 }}
      onMouseEnter={e => !open && ((e.currentTarget as HTMLElement).style.borderColor = "var(--accent)")}
      onMouseLeave={e => !open && ((e.currentTarget as HTMLElement).style.borderColor = "var(--border)")}>

      {/* Header */}
      <button onClick={() => setOpen(o => !o)} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "28px 32px", display: "flex", alignItems: "center", gap: 20, textAlign: "left" }}>
        <span style={{ fontSize: 40 }}>{c.emoji}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: "var(--text)", marginBottom: 4 }}>{c.project}</div>
          <div style={{ color: "var(--muted)", fontSize: 14 }}>{c.tagline}</div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, flex: 1, justifyContent: "flex-end" }}>
          {c.tech.slice(0, 4).map(t => (
            <span key={t} style={{ background: "rgba(110,231,183,0.08)", border: "1px solid rgba(110,231,183,0.15)", color: "var(--accent)", padding: "3px 10px", borderRadius: 100, fontSize: 11, fontFamily: "var(--font-display)", fontWeight: 600 }}>{t}</span>
          ))}
        </div>
        <div style={{ color: "var(--accent)", marginLeft: 16, flexShrink: 0 }}>
          {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>

      {/* Expanded content */}
      {open && (
        <div style={{ padding: "0 32px 32px", borderTop: "1px solid var(--border)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginTop: 28 }}>
            <div>
              <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, letterSpacing: "0.1em", color: "var(--accent)", marginBottom: 12 }}>THE PROBLEM</h4>
              <p style={{ color: "var(--muted)", lineHeight: 1.7, fontSize: 14 }}>{c.problem}</p>
            </div>
            <div>
              <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, letterSpacing: "0.1em", color: "var(--accent)", marginBottom: 12 }}>THE SOLUTION</h4>
              <p style={{ color: "var(--muted)", lineHeight: 1.7, fontSize: 14 }}>{c.solution}</p>
            </div>
          </div>

          {/* Key decisions */}
          <div style={{ marginTop: 28 }}>
            <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, letterSpacing: "0.1em", color: "var(--accent)", marginBottom: 16 }}>KEY DECISIONS</h4>
            <div style={{ display: "grid", gap: 12 }}>
              {c.decisions.map((d, i) => (
                <div key={i} style={{ display: "flex", gap: 16, padding: "16px", background: "rgba(110,231,183,0.04)", borderRadius: 8, borderLeft: "2px solid var(--accent)" }}>
                  <ArrowRight size={16} style={{ color: "var(--accent)", marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--text)", marginBottom: 4 }}>{d.title}</div>
                    <div style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.6 }}>{d.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Results */}
          <div style={{ marginTop: 28 }}>
            <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, letterSpacing: "0.1em", color: "var(--accent)", marginBottom: 16 }}>RESULTS</h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
              {c.results.map((r, i) => (
                <div key={i} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "16px" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: "var(--accent)" }}>{r.value}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>{r.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Lessons */}
          <div style={{ marginTop: 28, padding: 20, background: "rgba(129,140,248,0.06)", borderRadius: 10, borderLeft: "2px solid var(--accent-2)" }}>
            <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, letterSpacing: "0.1em", color: "var(--accent-2)", marginBottom: 10 }}>WHAT I'D DO DIFFERENTLY</h4>
            <p style={{ color: "var(--muted)", lineHeight: 1.7, fontSize: 14 }}>{c.lessons}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CaseStudies() {
  return (
    <section id="case-studies" style={{ padding: "100px 24px", background: "var(--bg-2)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <p style={{ color: "var(--accent)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, letterSpacing: "0.15em", marginBottom: 12 }}>HOW I THINK</p>
        <h2 style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 8 }}>Case Studies</h2>
        <p style={{ color: "var(--muted)", fontSize: 15, marginBottom: 40 }}>Click any project to see the full engineering breakdown — problem, decisions, tradeoffs, results.</p>
        {CASES.map(c => <CaseCard key={c.id} c={c} />)}
      </div>
    </section>
  );
}
