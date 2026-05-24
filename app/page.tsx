"use client";
import { useEffect, useState, useRef } from "react";
import { getSiteData, SiteData, DEFAULT_DATA } from "@/lib/store";
import { Mail, MapPin, ArrowRight, Globe, Menu, X } from "lucide-react";
import dynamic from "next/dynamic";
const Terminal = dynamic(() => import("@/components/Terminal"), { ssr: false });
const GitHubActivity = dynamic(() => import("@/components/GitHubActivity"), { ssr: false });
const SkillRadar = dynamic(() => import("@/components/SkillRadar"), { ssr: false });
const CaseStudies = dynamic(() => import("@/components/CaseStudy"), { ssr: false });
const StackPlayground = dynamic(() => import("@/components/StackPlayground"), { ssr: false });
const Learning = dynamic(() => import("@/components/Learning"), { ssr: false });
const Certificates = dynamic(() => import("@/components/Certificates"), { ssr: false });
const Github = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
);
const Linkedin = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
);
const Twitter = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.258 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>
);

export default function Portfolio() {
  const [data, setData] = useState<SiteData>(DEFAULT_DATA);
  const [projects, setProjects] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    // Fetch site data
    fetch("/api/site-data")
      .then(r => r.json())
      .then(sd => {
        if (sd) {
          setData(prev => ({ 
            ...prev, 
            ...sd, 
            hero: { ...prev.hero, ...sd.hero }, 
            bio: { ...prev.bio, ...sd.bio }, 
            theme: { ...prev.theme, ...sd.theme } 
          }));
          // Add custom properties if needed by child components
          (window as any).__SITE_DATA__ = sd;
        }
      })
      .catch(e => console.error("Failed to fetch site data:", e));

    // Fetch projects
    fetch("/api/projects")
      .then(r => r.json())
      .then(p => {
        if (Array.isArray(p)) setProjects(p);
      })
      .catch(e => console.error("Failed to fetch projects:", e));
    setMounted(true);

    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); }),
      { threshold: 0.3 }
    );
    document.querySelectorAll("section[id]").forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.style.setProperty("--accent", data.theme.accent);
    root.style.setProperty("--accent-2", data.theme.accent2);
    root.style.setProperty("--bg", data.theme.bg);
  }, [data.theme, mounted]);

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "projects", label: "Projects" },
    { id: "github", label: "Activity" },
    { id: "case-studies", label: "Case Studies" },
    { id: "learning", label: "Learning" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <div className="min-h-screen">
      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, backdropFilter: "blur(20px)", background: "rgba(8,11,18,0.8)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, background: "linear-gradient(135deg, var(--accent), var(--accent-2))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {data.bio.name}
          </span>
          <div className="desktop-links" style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {navLinks.map(l => (
              <a key={l.id} href={`#${l.id}`} style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, color: activeSection === l.id ? "var(--accent)" : "var(--muted)", textDecoration: "none", transition: "color 0.2s", letterSpacing: "0.05em" }}>
                {l.label}
              </a>
            ))}
          </div>
          <a href="/login" style={{ background: "var(--border)", color: "var(--accent)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, padding: "8px 16px", borderRadius: 6, textDecoration: "none", letterSpacing: "0.05em", border: "1px solid var(--accent)", transition: "background 0.2s" }}>
            ADMIN
          </a>
          <button className="mobile-menu-btn" onClick={() => setMobileNavOpen(o => !o)} style={{ display: "none", background: "none", border: "none", color: "var(--text)", cursor: "pointer", padding: 4 }}>
            {mobileNavOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section id="home" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", paddingTop: 64 }}>
        {/* Glows */}
        <div className="glow" style={{ width: 500, height: 500, background: "var(--accent)", opacity: 0.06, top: "10%", left: "60%", animationDuration: "8s" }} />
        <div className="glow animate-pulse-slow" style={{ width: 400, height: 400, background: "var(--accent-2)", opacity: 0.06, bottom: "10%", left: "20%", animationDuration: "10s" }} />

        {/* Grid lines */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)", backgroundSize: "60px 60px", opacity: 0.3 }} />

        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px", textAlign: "center", position: "relative", zIndex: 2 }}>
          <div className="animate-fadeUp" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(110,231,183,0.08)", border: "1px solid rgba(110,231,183,0.2)", borderRadius: 100, padding: "6px 16px", marginBottom: 32, color: "var(--accent)", fontSize: 13, fontFamily: "var(--font-display)", fontWeight: 600, letterSpacing: "0.1em" }}>
            <span style={{ width: 6, height: 6, background: "var(--accent)", borderRadius: "50%", display: "inline-block" }} />
            AVAILABLE FOR WORK
          </div>

          <h1 className="animate-fadeUp delay-100" style={{ fontSize: "clamp(56px, 10vw, 100px)", fontWeight: 800, lineHeight: 1, marginBottom: 12, letterSpacing: "-0.03em" }}>
            {data.hero.title}
          </h1>
          <h2 className="shimmer-text animate-fadeUp delay-200" style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 700, marginBottom: 24, fontFamily: "var(--font-display)" }}>
            {data.hero.subtitle}
          </h2>
          <p className="animate-fadeUp delay-300" style={{ fontSize: 18, color: "var(--muted)", maxWidth: 560, margin: "0 auto 40px", lineHeight: 1.7 }}>
            {data.hero.tagline}
          </p>

          <div className="animate-fadeUp delay-400" style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href={data.hero.ctaUrl} className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              {data.hero.ctaLabel} <ArrowRight size={16} />
            </a>
            <a href="#contact" className="btn-outline">Get In Touch</a>
          </div>

          <div className="animate-fadeUp delay-500" style={{ display: "flex", gap: 24, justifyContent: "center", marginTop: 48 }}>
            {[{ icon: Github, url: data.bio.github }, { icon: Linkedin, url: data.bio.linkedin }, { icon: Twitter, url: data.bio.twitter }, { icon: Mail, url: `mailto:${data.bio.email}` }].map(({ icon: Icon, url }, i) => (
              <a key={i} href={url} style={{ color: "var(--muted)", transition: "color 0.2s, transform 0.2s", display: "inline-block" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--accent)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--muted)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}>
                <Icon size={22} />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" style={{ padding: "100px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ marginBottom: 64 }}>
          <p style={{ color: "var(--accent)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, letterSpacing: "0.15em", marginBottom: 12 }}>SELECTED WORK</p>
          <h2 style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-0.02em" }}>Projects</h2>
        </div>

        <div className="projects-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(480px, 100%), 1fr))", gap: 24 }}>
          {projects.map((p, i) => (
            <div key={p.id} className="card" style={{ padding: 32, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -20, right: -20, fontSize: 120, opacity: 0.04, fontFamily: "var(--font-display)", fontWeight: 900, color: "var(--accent)" }}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <div style={{ fontSize: 48, marginBottom: 16 }}>{p.image}</div>
              <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12, letterSpacing: "-0.01em" }}>{p.title}</h3>
              <p style={{ color: "var(--muted)", lineHeight: 1.7, marginBottom: 20, fontSize: 15 }}>{p.description}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
                {p.tech.map((t: string) => (
                  <span key={t} style={{ background: "rgba(110,231,183,0.08)", border: "1px solid rgba(110,231,183,0.15)", color: "var(--accent)", padding: "4px 12px", borderRadius: 100, fontSize: 12, fontFamily: "var(--font-display)", fontWeight: 600, letterSpacing: "0.05em" }}>
                    {t}
                  </span>
                ))}
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <a href={p.live_url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--accent)", textDecoration: "none", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, letterSpacing: "0.05em" }}>
                  <Globe size={14} /> LIVE DEMO
                </a>
                <a href={p.github_url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--muted)", textDecoration: "none", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, letterSpacing: "0.05em" }}>
                  <Github size={14} /> SOURCE
                </a>
              </div>
            </div>
          ))}
          {projects.length === 0 && (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", color: "var(--muted)", padding: 60, border: "1px dashed var(--border)", borderRadius: 12 }}>
              No projects added yet. Add some in the dashboard!
            </div>
          )}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ padding: "100px 24px", background: "var(--bg-2)" }}>
        <div className="about-grid" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          <div>
            <p style={{ color: "var(--accent)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, letterSpacing: "0.15em", marginBottom: 12 }}>ABOUT ME</p>
            <h2 style={{ fontSize: "clamp(36px, 5vw, 52px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 24 }}>
              The dev behind the code
            </h2>
            <p style={{ color: "var(--muted)", lineHeight: 1.8, fontSize: 16, marginBottom: 24 }}>{data.bio.about}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--muted)", fontSize: 14 }}>
              <MapPin size={14} style={{ color: "var(--accent)" }} />
              {data.bio.location}
            </div>
          </div>
          <div className="skills-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { label: "Frontend", items: ["Next.js", "React", "TypeScript", "Tailwind CSS"] },
              { label: "Backend", items: ["Node.js", "Express", "PostgreSQL", "MongoDB"] },
              { label: "Tools", items: ["Git", "Docker", "Vercel", "Figma"] },
              { label: "Currently", items: ["System Design", "Microservices", "Web Perf", "Open Source"] },
            ].map(cat => (
              <div key={cat.label} className="card" style={{ padding: 20 }}>
                <div style={{ color: "var(--accent)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 11, letterSpacing: "0.15em", marginBottom: 12 }}>{cat.label}</div>
                {cat.items.map(it => (
                  <div key={it} style={{ color: "var(--text)", fontSize: 13, padding: "4px 0", borderBottom: "1px solid var(--border)" }}>{it}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ padding: "100px 24px", maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
        <p style={{ color: "var(--accent)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, letterSpacing: "0.15em", marginBottom: 12 }}>GET IN TOUCH</p>
        <h2 style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 16 }}>Let's work together</h2>
        <p style={{ color: "var(--muted)", lineHeight: 1.7, fontSize: 16, marginBottom: 40 }}>
          I'm open to full-time roles, freelance projects, and interesting collaborations. Drop me a message and I'll get back to you fast.
        </p>
        <a href={`mailto:${data.bio.email}`} className="btn-primary" style={{ fontSize: 16, display: "inline-flex", alignItems: "center", gap: 10 }}>
          <Mail size={18} /> {data.bio.email}
        </a>
        <div style={{ display: "flex", gap: 24, justifyContent: "center", marginTop: 40 }}>
          {[{ icon: Github, url: data.bio.github, label: "GitHub" }, { icon: Linkedin, url: data.bio.linkedin, label: "LinkedIn" }, { icon: Twitter, url: data.bio.twitter, label: "Twitter" }].map(({ icon: Icon, url, label }) => (
            <a key={label} href={url} style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--muted)", textDecoration: "none", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13, transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--accent)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--muted)"}>
              <Icon size={16} /> {label}
            </a>
          ))}
        </div>
      </section>

      <GitHubActivity />
      <SkillRadar />
      <CaseStudies />
      <Certificates />
      <StackPlayground />
      <Learning />
      <Terminal />

      {/* Mobile Nav Overlay */}
      {mobileNavOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 90, background: "rgba(8,11,18,0.97)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 32 }}>
          {navLinks.map(l => (
            <a key={l.id} href={`#${l.id}`} onClick={() => setMobileNavOpen(false)} style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 28, color: activeSection === l.id ? "var(--accent)" : "var(--text)", textDecoration: "none" }}>
              {l.label}
            </a>
          ))}
          <a href="/login" style={{ marginTop: 16, color: "var(--accent)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, textDecoration: "none", border: "1px solid var(--accent)", padding: "10px 24px", borderRadius: 8 }}>Admin</a>
        </div>
      )}

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "24px", textAlign: "center", color: "var(--muted)", fontSize: 13, fontFamily: "var(--font-display)" }}>
        © {new Date().getFullYear()} {data.bio.name} · Built with Next.js & ❤️
      </footer>
    </div>
  );
}
