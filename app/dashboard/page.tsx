"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Settings, Layout, User, Folder, Eye, Save, Plus, Trash2, ChevronLeft, Palette, Award, Code2, LogOut, Key, Menu, X } from "lucide-react";
import { DEFAULT_DATA, SiteData } from "@/lib/store";

type Tab = "hero" | "bio" | "theme" | "projects" | "certificates" | "skills" | "github" | "terminal" | "learning" | "settings";

type Cert = { id?: number; title: string; issuer: string; date: string; credential_url: string; skills: string };
type SkillEntry = { label: string; value: number };
type LearningTopic = { id: string; name: string; icon: string; status: string; progress: number; desc: string; why: string };
type GitHubCommit = { repo: string; message: string; date: string };

const TABS: { id: Tab; icon: React.ReactNode; label: string }[] = [
  { id: "hero",         icon: <Layout size={15} />,  label: "Hero" },
  { id: "bio",          icon: <User size={15} />,    label: "About & Bio" },
  { id: "theme",        icon: <Palette size={15} />, label: "Theme" },
  { id: "projects",     icon: <Folder size={15} />,  label: "Projects" },
  { id: "certificates", icon: <Award size={15} />,   label: "Certificates" },
  { id: "skills",       icon: <Code2 size={15} />,   label: "Skill Radar" },
  { id: "github",       icon: <Code2 size={15} />,   label: "GitHub Activity" },
  { id: "terminal",     icon: <Code2 size={15} />,   label: "Terminal" },
  { id: "learning",     icon: <Code2 size={15} />,   label: "Learning" },
  { id: "settings",     icon: <Settings size={15} />, label: "Settings" },
];

const inp: React.CSSProperties = { width: "100%", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px", color: "var(--text)", fontFamily: "var(--font-body)", fontSize: 14, outline: "none", boxSizing: "border-box" };
const ta: React.CSSProperties = { ...inp, minHeight: 90, resize: "vertical" as const };
const lbl: React.CSSProperties = { display: "block", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 11, letterSpacing: "0.1em", color: "var(--muted)", marginBottom: 6 };
const field: React.CSSProperties = { marginBottom: 18 };
const sectionTitle = (t: string, sub: string) => (
  <div style={{ marginBottom: 28 }}>
    <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 26, marginBottom: 4 }}>{t}</h2>
    <p style={{ color: "var(--muted)", fontSize: 13 }}>{sub}</p>
  </div>
);

export default function Dashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("hero");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [data, setData] = useState<SiteData>(DEFAULT_DATA);
  const [certs, setCerts] = useState<Cert[]>([]);
  const [skills, setSkills] = useState<SkillEntry[]>([
    { label: "Frontend", value: 88 }, { label: "Backend", value: 78 },
    { label: "Mobile", value: 42 }, { label: "DevOps", value: 55 },
    { label: "Architecture", value: 65 }, { label: "UI/UX", value: 60 },
  ]);
  const [commits, setCommits] = useState<GitHubCommit[]>([
    { repo: "shopflow", message: "feat: add stripe webhook handler", date: "2 hours ago" },
    { repo: "stayfinder", message: "fix: resolve booking overlap bug", date: "1 day ago" },
    { repo: "portfolio", message: "chore: add terminal easter egg", date: "2 days ago" },
  ]);
  const [learningTopics, setLearningTopics] = useState<LearningTopic[]>([
    { id: "rn", name: "React Native", icon: "📱", status: "active", progress: 38, desc: "Cross-platform mobile apps", why: "Full-stack means mobile." },
    { id: "sysdesign", name: "System Design", icon: "🏗️", status: "active", progress: 62, desc: "Scalable architectures", why: "The gap between junior and senior." },
    { id: "docker", name: "Docker + DevOps", icon: "🐳", status: "done", progress: 100, desc: "Containerization & CI/CD", why: "Solved works-on-my-machine permanently." },
  ]);
  const [terminalCmds, setTerminalCmds] = useState<Record<string, string>>({
    whoami: "Abel — Full-Stack Developer based in Cairo, Egypt.",
    skills: "Next.js · React · TypeScript · Node.js · PostgreSQL · MongoDB",
    contact: "abel@example.com | github.com/abel | linkedin.com/in/abel",
    hire: "Open to full-time roles and freelance projects.",
  });
  const [ghStats, setGhStats] = useState({ totalContribs: 847, streak: 14, repos: 18 });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwMsg, setPwMsg] = useState("");
  const [newCert, setNewCert] = useState<Cert>({ title: "", issuer: "", date: "", credential_url: "", skills: "" });
  const [editingCert, setEditingCert] = useState<number | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [editingProject, setEditingProject] = useState<number | null>(null);
  const [newProject, setNewProject] = useState({ title: "", description: "", tech: "", live_url: "", github_url: "", image: "💻", featured: false });

  useEffect(() => {
    Promise.all([
      fetch("/api/auth/me").then(r => { if (!r.ok) router.replace("/login"); return r.json(); }),
      fetch("/api/site-data").then(r => r.json()),
      fetch("/api/certificates").then(r => r.json()),
      fetch("/api/projects").then(r => r.json()),
    ]).then(([, sd, cl, pl]) => {
      if (sd) setData({ ...DEFAULT_DATA, ...sd, hero: { ...DEFAULT_DATA.hero, ...sd.hero }, bio: { ...DEFAULT_DATA.bio, ...sd.bio }, theme: { ...DEFAULT_DATA.theme, ...sd.theme } });
      if (Array.isArray(cl)) setCerts(cl.map((c: any) => ({ ...c, skills: Array.isArray(c.skills) ? c.skills.join(", ") : c.skills })));
      if (Array.isArray(pl)) setProjects(pl.map((p: any) => ({ ...p, tech: Array.isArray(p.tech) ? p.tech.join(", ") : p.tech })));
      setLoading(false);
    }).catch(() => router.replace("/login"));
  }, []);

  const save = async () => {
    setSaving(true);
    await fetch("/api/site-data", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    setSaved(true); setSaving(false);
    setTimeout(() => setSaved(false), 2000);
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const updateH = (k: string, v: string) => setData(d => ({ ...d, hero: { ...d.hero, [k]: v } }));
  const updateB = (k: string, v: string) => setData(d => ({ ...d, bio: { ...d.bio, [k]: v } }));
  const updateT = (k: string, v: string) => setData(d => ({ ...d, theme: { ...d.theme, [k]: v } }));

  const saveProject = async (proj: any) => {
    const method = proj.id ? "PUT" : "POST";
    const projToSave = {
      ...proj,
      tech: proj.tech.split(",").map((s: string) => s.trim()).filter(Boolean)
    };
    await fetch("/api/projects", { 
      method, 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify(projToSave) 
    });
    const updated = await fetch("/api/projects").then(r => r.json());
    if (Array.isArray(updated)) {
      setProjects(updated.map((p: any) => ({ ...p, tech: Array.isArray(p.tech) ? p.tech.join(", ") : p.tech })));
    } else {
      console.error("Failed to fetch updated projects:", updated);
    }
    setEditingProject(null);
    setNewProject({ title: "", description: "", tech: "", live_url: "", github_url: "", image: "💻", featured: false });
  };

  const deleteProject = async (id: number) => {
    await fetch("/api/projects", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setProjects(p => p.filter(x => x.id !== id));
  };

  const saveCert = async (cert: Cert) => {
    const method = cert.id ? "PUT" : "POST";
    // Convert skills string back to array for the API
    const certToSave = {
      ...cert,
      skills: cert.skills.split(",").map(s => s.trim()).filter(Boolean)
    };
    await fetch("/api/certificates", { 
      method, 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify(certToSave) 
    });
    const updated = await fetch("/api/certificates").then(r => r.json());
    setCerts(updated.map((c: any) => ({ ...c, skills: Array.isArray(c.skills) ? c.skills.join(", ") : c.skills })));
    setEditingCert(null);
    setNewCert({ title: "", issuer: "", date: "", credential_url: "", skills: "" });
  };

  const deleteCert = async (id: number) => {
    await fetch("/api/certificates", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setCerts(c => c.filter(x => x.id !== id));
  };

  const changePassword = async () => {
    if (pwForm.next !== pwForm.confirm) { setPwMsg("New passwords don't match"); return; }
    const r = await fetch("/api/auth/change-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.next }) });
    const d = await r.json();
    setPwMsg(d.ok ? "Password changed!" : d.error || "Error");
    if (d.ok) setPwForm({ current: "", next: "", confirm: "" });
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 32, height: 32, border: "2px solid var(--accent)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const CertForm = ({ cert, onSave, onCancel }: { cert: Cert; onSave: (c: Cert) => void; onCancel: () => void }) => {
    const [local, setLocal] = useState(cert);
    const u = (k: keyof Cert, v: string) => setLocal(c => ({ ...c, [k]: v }));
    return (
      <div style={{ background: "var(--bg)", border: "1px solid var(--accent)", borderRadius: 10, padding: 20, marginTop: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          <div><label style={lbl}>TITLE</label><input style={inp} value={local.title} onChange={e => u("title", e.target.value)} /></div>
          <div><label style={lbl}>ISSUER (Coursera, Udacity…)</label><input style={inp} value={local.issuer} onChange={e => u("issuer", e.target.value)} /></div>
          <div><label style={lbl}>DATE (YYYY-MM)</label><input style={inp} placeholder="2024-03" value={local.date} onChange={e => u("date", e.target.value)} /></div>
          <div><label style={lbl}>CREDENTIAL URL</label><input style={inp} value={local.credential_url} onChange={e => u("credential_url", e.target.value)} /></div>
        </div>
        <div style={{ marginBottom: 12 }}><label style={lbl}>SKILLS (comma separated)</label><input style={inp} value={local.skills} onChange={e => u("skills", e.target.value)} /></div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => onSave(local)} style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))", color: "#000", border: "none", borderRadius: 8, padding: "9px 18px", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Save Certificate</button>
          <button onClick={onCancel} style={{ background: "var(--bg-card)", color: "var(--muted)", border: "1px solid var(--border)", borderRadius: 8, padding: "9px 18px", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Cancel</button>
        </div>
      </div>
    );
  };

  const ProjectForm = ({ project, onSave, onCancel }: { project: any; onSave: (p: any) => void; onCancel: () => void }) => {
    const [local, setLocal] = useState(project);
    const u = (k: string, v: any) => setLocal((c: any) => ({ ...c, [k]: v }));
    return (
      <div style={{ background: "var(--bg)", border: "1px solid var(--accent)", borderRadius: 12, padding: 24, marginTop: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "70px 1fr", gap: 12, marginBottom: 12 }}>
          <div><label style={lbl}>ICON</label><input style={{ ...inp, textAlign: "center", fontSize: 22 }} value={local.image} onChange={e => u("image", e.target.value)} /></div>
          <div><label style={lbl}>TITLE</label><input style={inp} value={local.title} onChange={e => u("title", e.target.value)} /></div>
        </div>
        <div style={field}><label style={lbl}>DESCRIPTION</label><textarea style={ta} value={local.description} onChange={e => u("description", e.target.value)} /></div>
        <div style={field}><label style={lbl}>TECH STACK (comma separated)</label><input style={inp} value={local.tech} onChange={e => u("tech", e.target.value)} /></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          <div><label style={lbl}>LIVE URL</label><input style={inp} value={local.live_url} onChange={e => u("live_url", e.target.value)} /></div>
          <div><label style={lbl}>GITHUB URL</label><input style={inp} value={local.github_url} onChange={e => u("github_url", e.target.value)} /></div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
          <input type="checkbox" checked={local.featured} onChange={e => u("featured", e.target.checked)} id="feat-check" style={{ accentColor: "var(--accent)" }} />
          <label htmlFor="feat-check" style={{ ...lbl, marginBottom: 0, cursor: "pointer" }}>FEATURED PROJECT</label>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => onSave(local)} style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))", color: "#000", border: "none", borderRadius: 8, padding: "10px 20px", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Save Project</button>
          <button onClick={onCancel} style={{ background: "var(--bg-card)", color: "var(--muted)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 20px", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Cancel</button>
        </div>
      </div>
    );
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header style={{ borderBottom: "1px solid var(--border)", padding: "0 16px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--bg-card)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => setSidebarOpen(o => !o)} style={{ display: "none", background: "none", border: "none", color: "var(--muted)", cursor: "pointer", padding: 4, className: "mob-menu" } as any}>
            <Menu size={20} />
          </button>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 20, background: "linear-gradient(135deg, var(--accent), var(--accent-2))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Dashboard</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <a href="/" target="_blank" style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--bg)", border: "1px solid var(--border)", color: "var(--muted)", padding: "7px 14px", borderRadius: 8, textDecoration: "none", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12 }}>
            <Eye size={13} /> <span style={{ display: "none" as any }} className="hide-mobile">Preview</span>
          </a>
          <button onClick={save} disabled={saving} style={{ display: "flex", alignItems: "center", gap: 6, background: saved ? "var(--accent)" : "linear-gradient(135deg, var(--accent), var(--accent-2))", color: "#000", border: "none", padding: "7px 16px", borderRadius: 8, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
            <Save size={13} /> {saved ? "Saved!" : saving ? "Saving…" : "Save"}
          </button>
          <button onClick={logout} style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", color: "var(--muted)", border: "1px solid var(--border)", padding: "7px 14px", borderRadius: 8, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
            <LogOut size={13} />
          </button>
        </div>
      </header>

      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        {/* Sidebar */}
        <aside style={{ width: 210, borderRight: "1px solid var(--border)", padding: "20px 12px", background: "var(--bg-card)", flexShrink: 0, overflowY: "auto" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); setSidebarOpen(false); }}
              style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "9px 12px", borderRadius: 8, border: "none", background: tab === t.id ? "rgba(110,231,183,0.1)" : "transparent", color: tab === t.id ? "var(--accent)" : "var(--muted)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, cursor: "pointer", marginBottom: 2, borderLeft: tab === t.id ? "2px solid var(--accent)" : "2px solid transparent", transition: "all 0.15s" }}>
              {t.icon} {t.label}
            </button>
          ))}
        </aside>

        {/* Main */}
        <main style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>
          <div style={{ maxWidth: 720 }}>

            {/* HERO */}
            {tab === "hero" && <>
              {sectionTitle("Hero Section", "The first thing visitors see.")}
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
                <div style={field}><label style={lbl}>NAME / DISPLAY TITLE</label><input style={inp} value={data.hero.title} onChange={e => updateH("title", e.target.value)} /></div>
                <div style={field}><label style={lbl}>SUBTITLE / ROLE</label><input style={inp} value={data.hero.subtitle} onChange={e => updateH("subtitle", e.target.value)} /></div>
                <div style={field}><label style={lbl}>TAGLINE</label><textarea style={ta} value={data.hero.tagline} onChange={e => updateH("tagline", e.target.value)} /></div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div style={field}><label style={lbl}>CTA BUTTON TEXT</label><input style={inp} value={data.hero.ctaLabel} onChange={e => updateH("ctaLabel", e.target.value)} /></div>
                  <div style={field}><label style={lbl}>CTA LINK</label><input style={inp} value={data.hero.ctaUrl} onChange={e => updateH("ctaUrl", e.target.value)} /></div>
                </div>
              </div>
            </>}

            {/* BIO */}
            {tab === "bio" && <>
              {sectionTitle("About & Bio", "Your personal info, bio text, and social links.")}
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 24, marginBottom: 16 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div style={field}><label style={lbl}>FULL NAME</label><input style={inp} value={data.bio.name} onChange={e => updateB("name", e.target.value)} /></div>
                  <div style={field}><label style={lbl}>ROLE</label><input style={inp} value={data.bio.role} onChange={e => updateB("role", e.target.value)} /></div>
                </div>
                <div style={field}><label style={lbl}>BIO / ABOUT</label><textarea style={{ ...ta, minHeight: 120 }} value={data.bio.about} onChange={e => updateB("about", e.target.value)} /></div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div style={field}><label style={lbl}>LOCATION</label><input style={inp} value={data.bio.location} onChange={e => updateB("location", e.target.value)} /></div>
                  <div style={field}><label style={lbl}>EMAIL</label><input style={inp} value={data.bio.email} onChange={e => updateB("email", e.target.value)} /></div>
                  <div style={field}><label style={lbl}>GITHUB URL</label><input style={inp} value={data.bio.github} onChange={e => updateB("github", e.target.value)} /></div>
                  <div style={field}><label style={lbl}>LINKEDIN URL</label><input style={inp} value={data.bio.linkedin} onChange={e => updateB("linkedin", e.target.value)} /></div>
                  <div style={field}><label style={lbl}>TWITTER / X URL</label><input style={inp} value={data.bio.twitter} onChange={e => updateB("twitter", e.target.value)} /></div>
                </div>
              </div>
            </>}

            {/* THEME */}
            {tab === "theme" && <>
              {sectionTitle("Theme", "Colors that define the entire site's look.")}
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
                {[{ k: "accent", l: "PRIMARY ACCENT", d: "Highlights, CTAs, tags" }, { k: "accent2", l: "SECONDARY ACCENT", d: "Gradients, shimmer text" }, { k: "bg", l: "BACKGROUND", d: "Main page background" }].map(({ k, l, d }) => (
                  <div key={k} style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                    <input type="color" value={(data.theme as any)[k]} onChange={e => updateT(k, e.target.value)} style={{ width: 52, height: 52, borderRadius: 8, border: "1px solid var(--border)", background: "none", cursor: "pointer", padding: 3, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13 }}>{l}</div>
                      <div style={{ color: "var(--muted)", fontSize: 12 }}>{d}</div>
                      <code style={{ fontSize: 11, color: "var(--accent)" }}>{(data.theme as any)[k]}</code>
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: 8, padding: 16, background: data.theme.bg, borderRadius: 8, border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "var(--font-display)", fontWeight: 700, letterSpacing: "0.1em", marginBottom: 10 }}>PREVIEW</div>
                  <span style={{ background: `linear-gradient(135deg, ${data.theme.accent}, ${data.theme.accent2})`, color: "#000", padding: "8px 16px", borderRadius: 8, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13 }}>Button</span>
                  <span style={{ marginLeft: 12, color: data.theme.accent, fontFamily: "var(--font-display)", fontWeight: 700 }}>Accent text</span>
                </div>
              </div>
            </>}

            {/* PROJECTS */}
            {tab === "projects" && <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div><h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 26, marginBottom: 4 }}>Projects</h2><p style={{ color: "var(--muted)", fontSize: 13 }}>Add and manage your showcase work.</p></div>
                {editingProject !== -1 && <button onClick={() => setEditingProject(-1)} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(110,231,183,0.1)", border: "1px solid var(--accent)", color: "var(--accent)", padding: "9px 14px", borderRadius: 8, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, cursor: "pointer" }}><Plus size={13} /> Add New</button>}
              </div>
              {editingProject === -1 && <ProjectForm project={newProject} onSave={saveProject} onCancel={() => setEditingProject(null)} />}
              {projects.map((p, i) => (
                <div key={p.id ?? i}>
                  <div style={{ background: "var(--bg-card)", border: `1px solid ${editingProject === i ? "var(--accent)" : "var(--border)"}`, borderRadius: 12, padding: "16px 20px", marginBottom: editingProject === i ? 0 : 10, display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ fontSize: 24 }}>{p.image}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14 }}>{p.title}</div>
                      <div style={{ color: "var(--muted)", fontSize: 12 }}>{p.tech.split(",").slice(0, 3).join(" · ")}</div>
                    </div>
                    {p.featured && <span style={{ fontSize: 10, background: "var(--accent)", color: "#000", padding: "2px 6px", borderRadius: 4, fontFamily: "var(--font-display)", fontWeight: 800 }}>FEATURED</span>}
                    <button onClick={() => setEditingProject(editingProject === i ? null : i)} style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--muted)", padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 11 }}>Edit</button>
                    <button onClick={() => p.id && deleteProject(p.id)} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}><Trash2 size={11} /></button>
                  </div>
                  {editingProject === i && <ProjectForm project={p} onSave={saveProject} onCancel={() => setEditingProject(null)} />}
                  {editingProject === i && <div style={{ marginBottom: 10 }} />}
                </div>
              ))}
              {projects.length === 0 && editingProject !== -1 && <div style={{ textAlign: "center", color: "var(--muted)", padding: 40, border: "1px dashed var(--border)", borderRadius: 12 }}>No projects yet — click "Add New" to get started.</div>}
            </>}

            {/* CERTIFICATES */}
            {tab === "certificates" && <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div><h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 26, marginBottom: 4 }}>Certificates</h2><p style={{ color: "var(--muted)", fontSize: 13 }}>Courses from Coursera, Udacity, Udemy, etc.</p></div>
                {editingCert !== -1 && <button onClick={() => setEditingCert(-1)} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(110,231,183,0.1)", border: "1px solid var(--accent)", color: "var(--accent)", padding: "9px 14px", borderRadius: 8, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, cursor: "pointer" }}><Plus size={13} /> Add New</button>}
              </div>
              {editingCert === -1 && <CertForm cert={newCert} onSave={saveCert} onCancel={() => setEditingCert(null)} />}
              {certs.map((c, i) => (
                <div key={c.id ?? i}>
                  <div style={{ background: "var(--bg-card)", border: `1px solid ${editingCert === i ? "var(--accent)" : "var(--border)"}`, borderRadius: 12, padding: "16px 20px", marginBottom: editingCert === i ? 0 : 10, display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14 }}>{c.title}</div>
                      <div style={{ color: "var(--muted)", fontSize: 12 }}>{c.issuer} · {c.date}</div>
                    </div>
                    <button onClick={() => setEditingCert(editingCert === i ? null : i)} style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--muted)", padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 11 }}>Edit</button>
                    <button onClick={() => c.id && deleteCert(c.id)} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}><Trash2 size={11} /></button>
                  </div>
                  {editingCert === i && <CertForm cert={c} onSave={saveCert} onCancel={() => setEditingCert(null)} />}
                  {editingCert === i && <div style={{ marginBottom: 10 }} />}
                </div>
              ))}
              {certs.length === 0 && editingCert !== -1 && <div style={{ textAlign: "center", color: "var(--muted)", padding: 40, border: "1px dashed var(--border)", borderRadius: 12 }}>No certificates yet — click "Add New" to get started.</div>}
            </>}

            {/* SKILLS RADAR */}
            {tab === "skills" && <>
              {sectionTitle("Skill Radar", "Adjust your skill levels shown in the radar chart.")}
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
                {skills.map((s, i) => (
                  <div key={i} style={{ marginBottom: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <input style={{ ...inp, width: 160, padding: "6px 10px", fontSize: 13 }} value={s.label} onChange={e => setSkills(sk => sk.map((x, j) => j === i ? { ...x, label: e.target.value } : x))} />
                      <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--accent)", fontSize: 18 }}>{s.value}%</span>
                    </div>
                    <input type="range" min={0} max={100} value={s.value} onChange={e => setSkills(sk => sk.map((x, j) => j === i ? { ...x, value: Number(e.target.value) } : x))} style={{ width: "100%", accentColor: "var(--accent)" }} />
                  </div>
                ))}
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button onClick={() => setSkills(s => [...s, { label: "New Skill", value: 50 }])} style={{ background: "rgba(110,231,183,0.1)", border: "1px solid var(--accent)", color: "var(--accent)", padding: "8px 14px", borderRadius: 8, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}><Plus size={12} /> Add Skill</button>
                  <button onClick={() => setSkills(s => s.slice(0, -1))} style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", padding: "8px 14px", borderRadius: 8, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>Remove Last</button>
                </div>
                <p style={{ color: "var(--muted)", fontSize: 12, marginTop: 12 }}>Note: Skill data is saved with site data. Hit "Save" in the header.</p>
              </div>
            </>}

            {/* GITHUB ACTIVITY */}
            {tab === "github" && <>
              {sectionTitle("GitHub Activity", "Stats shown in the GitHub Activity section.")}
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 24, marginBottom: 16 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
                  {[{ k: "totalContribs", l: "TOTAL CONTRIBUTIONS" }, { k: "streak", l: "CURRENT STREAK (days)" }, { k: "repos", l: "PUBLIC REPOS" }].map(({ k, l }) => (
                    <div key={k}><label style={lbl}>{l}</label><input type="number" style={inp} value={(ghStats as any)[k]} onChange={e => setGhStats(g => ({ ...g, [k]: Number(e.target.value) }))} /></div>
                  ))}
                </div>
                <div>
                  <label style={{ ...lbl, marginBottom: 12 }}>RECENT COMMITS</label>
                  {commits.map((c, i) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 8, marginBottom: 8, alignItems: "center" }}>
                      <input style={inp} placeholder="repo" value={c.repo} onChange={e => setCommits(cs => cs.map((x, j) => j === i ? { ...x, repo: e.target.value } : x))} />
                      <input style={inp} placeholder="commit message" value={c.message} onChange={e => setCommits(cs => cs.map((x, j) => j === i ? { ...x, message: e.target.value } : x))} />
                      <input style={inp} placeholder="2 hours ago" value={c.date} onChange={e => setCommits(cs => cs.map((x, j) => j === i ? { ...x, date: e.target.value } : x))} />
                      <button onClick={() => setCommits(cs => cs.filter((_, j) => j !== i))} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", padding: "8px 10px", borderRadius: 6, cursor: "pointer", fontSize: 14 }}>×</button>
                    </div>
                  ))}
                  <button onClick={() => setCommits(c => [...c, { repo: "", message: "", date: "" }])} style={{ background: "rgba(110,231,183,0.1)", border: "1px solid var(--accent)", color: "var(--accent)", padding: "8px 14px", borderRadius: 8, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}><Plus size={12} /> Add Commit</button>
                </div>
              </div>
            </>}

            {/* TERMINAL */}
            {tab === "terminal" && <>
              {sectionTitle("Terminal Commands", "Edit what each command returns in the interactive terminal.")}
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
                {Object.entries(terminalCmds).map(([cmd, val]) => (
                  <div key={cmd} style={field}>
                    <label style={lbl}>$ {cmd}</label>
                    <textarea style={ta} value={val} onChange={e => setTerminalCmds(t => ({ ...t, [cmd]: e.target.value }))} />
                  </div>
                ))}
                <p style={{ color: "var(--muted)", fontSize: 12 }}>Terminal command content is saved with site data.</p>
              </div>
            </>}

            {/* LEARNING */}
            {tab === "learning" && <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div><h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 26, marginBottom: 4 }}>Learning</h2><p style={{ color: "var(--muted)", fontSize: 13 }}>Topics shown in the Currently Learning section.</p></div>
                <button onClick={() => setLearningTopics(t => [...t, { id: Date.now().toString(), name: "New Topic", icon: "📖", status: "planned", progress: 0, desc: "", why: "" }])} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(110,231,183,0.1)", border: "1px solid var(--accent)", color: "var(--accent)", padding: "9px 14px", borderRadius: 8, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12, cursor: "pointer" }}><Plus size={13} /> Add Topic</button>
              </div>
              {learningTopics.map((t, i) => (
                <div key={t.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 20, marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
                    <button onClick={() => setLearningTopics(lt => lt.filter((_, j) => j !== i))} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", padding: "5px 10px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontFamily: "var(--font-display)", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}><Trash2 size={11} /> Remove</button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "60px 1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
                    <div><label style={lbl}>ICON</label><input style={{ ...inp, textAlign: "center", fontSize: 20 }} value={t.icon} onChange={e => setLearningTopics(lt => lt.map((x, j) => j === i ? { ...x, icon: e.target.value } : x))} /></div>
                    <div><label style={lbl}>NAME</label><input style={inp} value={t.name} onChange={e => setLearningTopics(lt => lt.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} /></div>
                    <div><label style={lbl}>STATUS</label>
                      <select style={inp} value={t.status} onChange={e => setLearningTopics(lt => lt.map((x, j) => j === i ? { ...x, status: e.target.value } : x))}>
                        <option value="active">Active</option><option value="done">Done</option><option value="planned">Planned</option>
                      </select>
                    </div>
                    <div><label style={lbl}>PROGRESS ({t.progress}%)</label><input type="range" min={0} max={100} value={t.progress} onChange={e => setLearningTopics(lt => lt.map((x, j) => j === i ? { ...x, progress: Number(e.target.value) } : x))} style={{ width: "100%", marginTop: 10, accentColor: "var(--accent)" }} /></div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div><label style={lbl}>DESCRIPTION</label><textarea style={ta} value={t.desc} onChange={e => setLearningTopics(lt => lt.map((x, j) => j === i ? { ...x, desc: e.target.value } : x))} /></div>
                    <div><label style={lbl}>WHY I'M LEARNING THIS</label><textarea style={ta} value={t.why} onChange={e => setLearningTopics(lt => lt.map((x, j) => j === i ? { ...x, why: e.target.value } : x))} /></div>
                  </div>
                </div>
              ))}
            </>}

            {/* SETTINGS */}
            {tab === "settings" && <>
              {sectionTitle("Settings", "Account and security.")}
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, letterSpacing: "0.1em", color: "var(--muted)", marginBottom: 16 }}>CHANGE PASSWORD</div>
                <div style={field}><label style={lbl}>CURRENT PASSWORD</label><input type="password" style={inp} value={pwForm.current} onChange={e => setPwForm(f => ({ ...f, current: e.target.value }))} /></div>
                <div style={field}><label style={lbl}>NEW PASSWORD</label><input type="password" style={inp} value={pwForm.next} onChange={e => setPwForm(f => ({ ...f, next: e.target.value }))} /></div>
                <div style={field}><label style={lbl}>CONFIRM NEW PASSWORD</label><input type="password" style={inp} value={pwForm.confirm} onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))} /></div>
                {pwMsg && <p style={{ color: pwMsg.includes("!") ? "var(--accent)" : "#f87171", fontSize: 13, marginBottom: 12 }}>{pwMsg}</p>}
                <button onClick={changePassword} style={{ display: "flex", alignItems: "center", gap: 6, background: "linear-gradient(135deg, var(--accent), var(--accent-2))", color: "#000", border: "none", padding: "10px 20px", borderRadius: 8, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, cursor: "pointer" }}><Key size={14} /> Update Password</button>
              </div>
            </>}

          </div>
        </main>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          aside { position: fixed; left: ${sidebarOpen ? "0" : "-220px"}; top: 60px; bottom: 0; z-index: 40; transition: left 0.3s; }
          main { padding: 20px 16px !important; }
          .mob-menu { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
