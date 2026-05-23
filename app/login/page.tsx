"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me").then(r => { if (r.ok) router.replace("/dashboard"); else setChecking(false); });
  }, []);

  const login = async () => {
    if (!password.trim()) return;
    setLoading(true); setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.ok) router.push("/dashboard");
    else setError(data.error || "Invalid password");
  };

  if (checking) return (
    <div style={{ minHeight: "100vh", background: "#080b12", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 32, height: 32, border: "2px solid #6ee7b7", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#080b12", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, position: "relative", overflow: "hidden" }}>
      {/* Background */}
      <div style={{ position: "absolute", width: 400, height: 400, background: "radial-gradient(circle, rgba(110,231,183,0.06) 0%, transparent 70%)", top: "20%", left: "60%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 300, height: 300, background: "radial-gradient(circle, rgba(129,140,248,0.06) 0%, transparent 70%)", bottom: "20%", left: "20%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)", backgroundSize: "60px 60px", opacity: 0.15, pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 2 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 900, fontSize: 48, background: "linear-gradient(135deg, #6ee7b7, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 8 }}>A</div>
          <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 14, color: "#64748b", letterSpacing: "0.2em" }}>PORTFOLIO ADMIN</div>
        </div>

        {/* Card */}
        <div style={{ background: "#111827", border: "1px solid #1e293b", borderRadius: 16, padding: "36px 32px" }}>
          <h1 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 24, color: "#f1f5f9", marginBottom: 6, textAlign: "center" }}>Welcome back</h1>
          <p style={{ color: "#64748b", fontSize: 14, textAlign: "center", marginBottom: 28 }}>Enter your password to access the dashboard</p>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: "0.1em", color: "#64748b", marginBottom: 8 }}>PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && login()}
              autoFocus
              placeholder="••••••••"
              style={{ width: "100%", background: "#0d1120", border: `1px solid ${error ? "#f87171" : "#1e293b"}`, borderRadius: 10, padding: "13px 16px", color: "#f1f5f9", fontFamily: "DM Sans, sans-serif", fontSize: 15, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
              onFocus={e => !error && ((e.target as HTMLInputElement).style.borderColor = "#6ee7b7")}
              onBlur={e => !error && ((e.target as HTMLInputElement).style.borderColor = "#1e293b")}
            />
            {error && <p style={{ color: "#f87171", fontSize: 13, marginTop: 8, fontFamily: "DM Sans, sans-serif" }}>{error}</p>}
          </div>

          <button
            onClick={login}
            disabled={loading || !password.trim()}
            style={{ width: "100%", background: loading ? "#374151" : "linear-gradient(135deg, #6ee7b7, #818cf8)", color: "#000", border: "none", borderRadius: 10, padding: "14px", fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 15, cursor: loading ? "not-allowed" : "pointer", transition: "opacity 0.2s", letterSpacing: "0.02em" }}>
            {loading ? "Signing in..." : "Sign In →"}
          </button>

          <p style={{ color: "#374151", fontSize: 12, textAlign: "center", marginTop: 20, fontFamily: "DM Sans, sans-serif" }}>
            First login creates your account with that password.
          </p>
        </div>

        <p style={{ textAlign: "center", marginTop: 24 }}>
          <a href="/" style={{ color: "#64748b", fontSize: 13, fontFamily: "Syne, sans-serif", fontWeight: 600, textDecoration: "none" }}>← Back to portfolio</a>
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
