"use client";
import { useEffect, useState } from "react";
import { getSiteData, setSiteData, SiteData, DEFAULT_DATA, Project } from "@/lib/store";
import { Settings, Layout, User, Folder, Eye, Save, Plus, Trash2, ChevronLeft, Palette } from "lucide-react";
const Github = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
);

type Tab = "hero" | "bio" | "theme" | "projects";

export default function Dashboard() {
  const [data, setData] = useState<SiteData>(DEFAULT_DATA);
  const [tab, setTab] = useState<Tab>("hero");
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setData(getSiteData()); setMounted(true); }, []);

  const save = () => {
    setSiteData(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateHero = (k: string, v: string) => setData(d => ({ ...d, hero: { ...d.hero, [k]: v } }));
  const updateBio = (k: string, v: string) => setData(d => ({ ...d, bio: { ...d.bio, [k]: v } }));
  const updateTheme = (k: string, v: string) => setData(d => ({ ...d, theme: { ...d.theme, [k]: v } }));

  const updateProject = (id: string, k: keyof Project, v: string | boolean | string[]) =>
    setData(d => ({ ...d, projects: d.projects.map(p => p.id === id ? { ...p, [k]: v } : p) }));

  const addProject = () => {
    const newP: Project = {
      id: Date.now().toString(), title: "New Project", description: "Project description...",
      tech: ["Next.js"], liveUrl: "#", githubUrl: "#", image: "💻", featured: false,
    };
    setData(d => ({ ...d, projects: [...d.projects, newP] }));
  };

  const removeProject = (id: string) => setData(d => ({ ...d, projects: d.projects.filter(p => p.id !== id) }));

  const tabs: { id: Tab; icon: React.ReactNode; label: string }[] = [
    { id: "hero", icon: <Layout size={16} />, label: "Hero" },
    { id: "bio", icon: <User size={16} />, label: "About & Bio" },
    { id: "theme", icon: <Palette size={16} />, label: "Theme" },
    { id: "projects", icon: <Folder size={16} />, label: "Projects" },
  ];

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8,
    padding: "10px 14px", color: "var(--text)", fontFamily: "var(--font-body)", fontSize: 14,
    outline: "none", transition: "border-color 0.2s",
  };
  const labelStyle: React.CSSProperties = {
    display: "block", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 11,
    letterSpacing: "0.1em", color: "var(--muted)", marginBottom: 6,
  };
  const fieldStyle: React.CSSProperties = { marginBottom: 20 };

  if (!mounted) return null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header style={{ borderBottom: "1px solid var(--border)", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--bg-card)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--muted)", textDecoration: "none", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13, transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--accent)"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--muted)"}>
            <ChevronLeft size={16} /> Back to site
          </a>
          <span style={{ color: "var(--border)" }}>|</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Settings size={18} style={{ color: "var(--accent)" }} />
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 16 }}>Portfolio Dashboard</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <a href="/" target="_blank" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--bg)", border: "1px solid var(--border)", color: "var(--muted)", padding: "8px 16px", borderRadius: 8, textDecoration: "none", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13 }}>
            <Eye size={14} /> Preview
          </a>
          <button onClick={save} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: saved ? "var(--accent)" : "linear-gradient(135deg, var(--accent), var(--accent-2))", color: "#000", border: "none", padding: "8px 20px", borderRadius: 8, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.3s" }}>
            <Save size={14} /> {saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </header>

      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        <aside style={{ width: 220, borderRight: "1px solid var(--border)", padding: 24, background: "var(--bg-card)" }}>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 11, letterSpacing: "0.15em", color: "var(--muted)", marginBottom: 16 }}>SECTIONS</p>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 14px", borderRadius: 8, border: "none", background: tab === t.id ? "rgba(110,231,183,0.1)" : "transparent", color: tab === t.id ? "var(--accent)" : "var(--muted)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, cursor: "pointer", marginBottom: 4, transition: "all 0.2s", textAlign: "left", borderLeft: tab === t.id ? "2px solid var(--accent)" : "2px solid transparent" }}>
              {t.icon} {t.label}
            </button>
          ))}
        </aside>

        {/* Content */}
        <main style={{ flex: 1, padding: 40, overflowY: "auto" }}>
          <div style={{ maxWidth: 680 }}>

            {/* HERO TAB */}
            {tab === "hero" && (
              <div>
                <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 28, marginBottom: 8 }}>Hero Section</h2>
                <p style={{ color: "var(--muted)", marginBottom: 32, fontSize: 14 }}>The first thing visitors see — make it count.</p>

                <div className="card" style={{ padding: 28 }}>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>YOUR NAME / DISPLAY TITLE</label>
                    <input style={inputStyle} value={data.hero.title} onChange={e => updateHero("title", e.target.value)} placeholder="Abel" />
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>ROLE / SUBTITLE</label>
                    <input style={inputStyle} value={data.hero.subtitle} onChange={e => updateHero("subtitle", e.target.value)} placeholder="Full-Stack Developer" />
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>TAGLINE</label>
                    <textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} value={data.hero.tagline} onChange={e => updateHero("tagline", e.target.value)} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>CTA BUTTON LABEL</label>
                      <input style={inputStyle} value={data.hero.ctaLabel} onChange={e => updateHero("ctaLabel", e.target.value)} />
                    </div>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>CTA LINK</label>
                      <input style={inputStyle} value={data.hero.ctaUrl} onChange={e => updateHero("ctaUrl", e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* BIO TAB */}
            {tab === "bio" && (
              <div>
                <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 28, marginBottom: 8 }}>About & Bio</h2>
                <p style={{ color: "var(--muted)", marginBottom: 32, fontSize: 14 }}>Personal info and social links.</p>

                <div className="card" style={{ padding: 28, marginBottom: 20 }}>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>FULL NAME</label>
                    <input style={inputStyle} value={data.bio.name} onChange={e => updateBio("name", e.target.value)} />
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>ROLE</label>
                    <input style={inputStyle} value={data.bio.role} onChange={e => updateBio("role", e.target.value)} />
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>BIO</label>
                    <textarea style={{ ...inputStyle, minHeight: 120, resize: "vertical" }} value={data.bio.about} onChange={e => updateBio("about", e.target.value)} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>LOCATION</label>
                      <input style={inputStyle} value={data.bio.location} onChange={e => updateBio("location", e.target.value)} />
                    </div>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>EMAIL</label>
                      <input style={inputStyle} type="email" value={data.bio.email} onChange={e => updateBio("email", e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="card" style={{ padding: 28 }}>
                  <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, letterSpacing: "0.1em", color: "var(--muted)", marginBottom: 20 }}>SOCIAL LINKS</p>
                  {[{ key: "github", label: "GITHUB URL" }, { key: "linkedin", label: "LINKEDIN URL" }, { key: "twitter", label: "TWITTER URL" }].map(({ key, label }) => (
                    <div key={key} style={fieldStyle}>
                      <label style={labelStyle}>{label}</label>
                      <input style={inputStyle} value={(data.bio as Record<string, string>)[key]} onChange={e => updateBio(key, e.target.value)} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* THEME TAB */}
            {tab === "theme" && (
              <div>
                <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 28, marginBottom: 8 }}>Theme</h2>
                <p style={{ color: "var(--muted)", marginBottom: 32, fontSize: 14 }}>Customize the color palette of your portfolio.</p>

                <div className="card" style={{ padding: 28 }}>
                  {[
                    { key: "accent", label: "PRIMARY ACCENT COLOR", desc: "Used for highlights, tags, and CTAs" },
                    { key: "accent2", label: "SECONDARY ACCENT COLOR", desc: "Used for gradients and shimmer effects" },
                    { key: "bg", label: "BACKGROUND COLOR", desc: "Main page background" },
                  ].map(({ key, label, desc }) => (
                    <div key={key} style={{ ...fieldStyle, display: "flex", alignItems: "center", gap: 20 }}>
                      <input type="color" value={(data.theme as Record<string, string>)[key]} onChange={e => updateTheme(key, e.target.value)}
                        style={{ width: 56, height: 56, borderRadius: 8, border: "1px solid var(--border)", background: "none", cursor: "pointer", padding: 4 }} />
                      <div>
                        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{label}</div>
                        <div style={{ color: "var(--muted)", fontSize: 12 }}>{desc}</div>
                        <div style={{ fontFamily: "monospace", fontSize: 12, color: "var(--accent)", marginTop: 4 }}>{(data.theme as Record<string, string>)[key]}</div>
                      </div>
                    </div>
                  ))}

                  {/* Live preview */}
                  <div style={{ marginTop: 20, padding: 20, background: data.theme.bg, borderRadius: 8, border: "1px solid var(--border)" }}>
                    <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 11, letterSpacing: "0.1em", color: "var(--muted)", marginBottom: 12 }}>LIVE PREVIEW</p>
                    <div style={{ background: `linear-gradient(135deg, ${data.theme.accent}, ${data.theme.accent2})`, padding: "12px 20px", borderRadius: 8, display: "inline-block", color: "#000", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14 }}>
                      Primary Button
                    </div>
                    <span style={{ marginLeft: 12, color: data.theme.accent, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14 }}>Accent Text</span>
                  </div>
                </div>
              </div>
            )}

            {/* PROJECTS TAB */}
            {tab === "projects" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                  <div>
                    <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 28, marginBottom: 8 }}>Projects</h2>
                    <p style={{ color: "var(--muted)", fontSize: 14 }}>Add, edit, and reorder your showcase projects.</p>
                  </div>
                  <button onClick={addProject} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(110,231,183,0.1)", border: "1px solid var(--accent)", color: "var(--accent)", padding: "10px 16px", borderRadius: 8, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                    <Plus size={14} /> Add Project
                  </button>
                </div>

                {data.projects.map((p, idx) => (
                  <div key={p.id} className="card" style={{ padding: 24, marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                      <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, letterSpacing: "0.1em", color: "var(--accent)" }}>PROJECT {idx + 1}</span>
                      <button onClick={() => removeProject(p.id)} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", padding: "6px 10px", borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontFamily: "var(--font-display)", fontWeight: 700 }}>
                        <Trash2 size={12} /> Remove
                      </button>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: 16, marginBottom: 16 }}>
                      <div>
                        <label style={labelStyle}>ICON</label>
                        <input style={{ ...inputStyle, textAlign: "center", fontSize: 24 }} value={p.image} onChange={e => updateProject(p.id, "image", e.target.value)} />
                      </div>
                      <div>
                        <label style={labelStyle}>TITLE</label>
                        <input style={inputStyle} value={p.title} onChange={e => updateProject(p.id, "title", e.target.value)} />
                      </div>
                    </div>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>DESCRIPTION</label>
                      <textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} value={p.description} onChange={e => updateProject(p.id, "description", e.target.value)} />
                    </div>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>TECH STACK (comma separated)</label>
                      <input style={inputStyle} value={p.tech.join(", ")} onChange={e => updateProject(p.id, "tech", e.target.value.split(",").map(t => t.trim()).filter(Boolean))} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <div style={fieldStyle}>
                        <label style={labelStyle}>LIVE URL</label>
                        <input style={inputStyle} value={p.liveUrl} onChange={e => updateProject(p.id, "liveUrl", e.target.value)} />
                      </div>
                      <div style={fieldStyle}>
                        <label style={labelStyle}>GITHUB URL</label>
                        <input style={inputStyle} value={p.githubUrl} onChange={e => updateProject(p.id, "githubUrl", e.target.value)} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
