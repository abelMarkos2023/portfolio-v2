"use client";
import { useState,useEffect } from "react";

type Resource = { title: string; type: string; url: string };
type Topic = {
  id: string;
  name: string;
  icon: string;
  status: "active" | "planned" | "done";
  progress: number;
  desc: string;
  why: string;
  resources: Resource[];
  tag: string;
};

const TOPICS: Topic[] = [
  {
    id: "rn",
    name: "React Native",
    icon: "📱",
    status: "active",
    progress: 38,
    desc: "Building cross-platform mobile apps with the React I already know.",
    why: "Full-stack means nothing if you can't ship mobile. React Native lets me reuse 80% of my React knowledge — it was the obvious next step.",
    resources: [
      { title: "React Native docs", type: "docs", url: "https://reactnative.dev" },
      { title: "Expo", type: "tool", url: "https://expo.dev" },
      { title: "React Navigation", type: "library", url: "https://reactnavigation.org" },
    ],
    tag: "In Progress",
  },
  {
    id: "sysdesign",
    name: "System Design",
    icon: "🏗️",
    status: "active",
    progress: 62,
    desc: "How to architect systems that scale — load balancers, caching, databases at scale.",
    why: "I can build apps. I want to be able to design systems. The gap between junior and senior is usually here.",
    resources: [
      { title: "Designing Data-Intensive Apps", type: "book", url: "#" },
      { title: "System Design Primer", type: "repo", url: "https://github.com/donnemartin/system-design-primer" },
    ],
    tag: "In Progress",
  },
  {
    id: "docker",
    name: "Docker + DevOps",
    icon: "🐳",
    status: "done",
    progress: 100,
    desc: "Containerization, CI/CD pipelines, infrastructure as code.",
    why: "Every side project I ship uses Docker now. It ended the 'works on my machine' problem permanently.",
    resources: [
      { title: "Docker docs", type: "docs", url: "https://docs.docker.com" },
    ],
    tag: "Completed",
  },
  {
    id: "microservices",
    name: "Microservices",
    icon: "⚙️",
    status: "planned",
    progress: 15,
    desc: "Breaking monoliths into independently deployable services. Message queues, service discovery.",
    why: "Both my projects started as monoliths. Learning to know when and how to split them is next.",
    resources: [
      { title: "Building Microservices — Sam Newman", type: "book", url: "#" },
    ],
    tag: "Up Next",
  },
];

const STATUS_COLOR = {
  active: { bg: "rgba(110,231,183,0.1)", border: "rgba(110,231,183,0.3)", text: "var(--accent)" },
  done: { bg: "rgba(129,140,248,0.1)", border: "rgba(129,140,248,0.3)", text: "var(--accent-2)" },
  planned: { bg: "rgba(100,116,139,0.1)", border: "rgba(100,116,139,0.2)", text: "var(--muted)" },
};

export default function Learning() {
  const [active, setActive] = useState<string | null>("rn");
  const [topics, setTopics] = useState<Topic[]>(TOPICS);

  useEffect(() => {
    // Try to get dynamic topics from window object
    const sd = (window as any).__SITE_DATA__;
    if (sd && sd.learningTopics) {
      setTopics(sd.learningTopics.map((t: any) => ({
        ...t,
        resources: t.resources || [],
        tag: t.status === "active" ? "In Progress" : t.status === "done" ? "Completed" : "Up Next"
      })));
      if (sd.learningTopics.length > 0) setActive(sd.learningTopics[0].id);
    } else {
      fetch("/api/site-data")
        .then(r => r.json())
        .then(data => {
          if (data && data.learningTopics) {
            setTopics(data.learningTopics.map((t: any) => ({
              ...t,
              resources: t.resources || [],
              tag: t.status === "active" ? "In Progress" : t.status === "done" ? "Completed" : "Up Next"
            })));
            if (data.learningTopics.length > 0) setActive(data.learningTopics[0].id);
          }
        });
    }
  }, []);

  const selected = topics.find(t => t.id === active);

  return (
    <section id="learning" style={{ padding: "100px 24px", background: "var(--bg-2)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <p style={{ color: "var(--accent)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, letterSpacing: "0.15em", marginBottom: 12 }}>GROWTH MINDSET</p>
        <h2 style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 8 }}>Currently Learning</h2>
        <p style={{ color: "var(--muted)", fontSize: 15, marginBottom: 40 }}>I believe the best developers never stop being students.</p>

        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 24 }} className="learning-grid">
          {/* Topic list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {topics.map(t => {
              const sc = STATUS_COLOR[t.status as keyof typeof STATUS_COLOR] || STATUS_COLOR.planned;
              const isActive = active === t.id;
              return (
                <button key={t.id} onClick={() => setActive(t.id)}
                  style={{ textAlign: "left", padding: "16px 18px", borderRadius: 10, border: isActive ? `1px solid var(--accent)` : "1px solid var(--border)", background: isActive ? "rgba(110,231,183,0.06)" : "var(--bg-card)", cursor: "pointer", transition: "all 0.2s" }}
                  onMouseEnter={e => !isActive && ((e.currentTarget as HTMLElement).style.borderColor = "rgba(110,231,183,0.4)")}
                  onMouseLeave={e => !isActive && ((e.currentTarget as HTMLElement).style.borderColor = "var(--border)")}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 20 }}>{t.icon}</span>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: isActive ? "var(--accent)" : "var(--text)" }}>{t.name}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ flex: 1, height: 4, background: "var(--border)", borderRadius: 100, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${t.progress}%`, background: t.status === "done" ? "var(--accent-2)" : "var(--accent)", borderRadius: 100 }} />
                    </div>
                    <span style={{ fontSize: 10, fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--muted)" }}>{t.progress}%</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detail panel */}
          {selected && (
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 32 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <span style={{ fontSize: 48 }}>{selected.icon}</span>
                  <div>
                    <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 26, color: "var(--text)", marginBottom: 4 }}>{selected.name}</h3>
                    <span style={{ background: (STATUS_COLOR[selected.status as keyof typeof STATUS_COLOR] || STATUS_COLOR.planned).bg, border: `1px solid ${(STATUS_COLOR[selected.status as keyof typeof STATUS_COLOR] || STATUS_COLOR.planned).border}`, color: (STATUS_COLOR[selected.status as keyof typeof STATUS_COLOR] || STATUS_COLOR.planned).text, padding: "3px 12px", borderRadius: 100, fontSize: 11, fontFamily: "var(--font-display)", fontWeight: 700, letterSpacing: "0.05em" }}>
                      {selected.tag}
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 36, color: selected.status === "done" ? "var(--accent-2)" : "var(--accent)" }}>{selected.progress}%</div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>progress</div>
                </div>
              </div>

              <div style={{ height: 6, background: "var(--border)", borderRadius: 100, overflow: "hidden", marginBottom: 28 }}>
                <div style={{ height: "100%", width: `${selected.progress}%`, background: selected.status === "done" ? `linear-gradient(90deg, var(--accent-2), var(--accent))` : `linear-gradient(90deg, var(--accent), var(--accent-2))`, borderRadius: 100, transition: "width 0.8s ease" }} />
              </div>

              <p style={{ color: "var(--muted)", lineHeight: 1.7, fontSize: 15, marginBottom: 24 }}>{selected.desc}</p>

              <div style={{ padding: "16px 20px", background: "rgba(110,231,183,0.05)", borderRadius: 10, borderLeft: "2px solid var(--accent)", marginBottom: 24 }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 11, letterSpacing: "0.1em", color: "var(--accent)", marginBottom: 8 }}>WHY I'M LEARNING THIS</div>
                <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.6, margin: 0 }}>{selected.why}</p>
              </div>

              {selected.resources && selected.resources.length > 0 && (
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 11, letterSpacing: "0.1em", color: "var(--muted)", marginBottom: 12 }}>RESOURCES</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {selected.resources.map((r, i) => (
                      <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                        style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)", padding: "7px 14px", borderRadius: 8, fontSize: 13, textDecoration: "none", fontFamily: "var(--font-display)", fontWeight: 600, transition: "border-color 0.2s, color 0.2s" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)"; (e.currentTarget as HTMLElement).style.color = "var(--accent)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.color = "var(--text)"; }}>
                        <span style={{ fontSize: 10, background: "rgba(110,231,183,0.1)", color: "var(--accent)", padding: "2px 6px", borderRadius: 4, fontWeight: 700, letterSpacing: "0.05em" }}>{r.type.toUpperCase()}</span>
                        {r.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
