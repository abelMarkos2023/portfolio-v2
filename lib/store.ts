export type Project = {
  id: string;
  title: string;
  description: string;
  tech: string[];
  liveUrl: string;
  githubUrl: string;
  image: string;
  featured: boolean;
};

export type SiteData = {
  hero: { title: string; subtitle: string; tagline: string; ctaLabel: string; ctaUrl: string; };
  bio: { name: string; role: string; about: string; location: string; email: string; github: string; linkedin: string; twitter: string; };
  theme: { accent: string; accent2: string; bg: string; };
};

export const DEFAULT_DATA: SiteData = {
  hero: {
    title: "Abel",
    subtitle: "Full-Stack Developer",
    tagline: "I build scalable web apps that ship fast and look great.",
    ctaLabel: "View My Work",
    ctaUrl: "#projects",
  },
  bio: {
    name: "Abel",
    role: "Full-Stack Developer",
    about: "I'm a full-stack developer passionate about building products that combine great UX with solid engineering. I specialize in React, Next.js, and Node.js — and I care deeply about the details.",
    location: "Cairo, Egypt",
    email: "abel@example.com",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
  },
  theme: { accent: "#6ee7b7", accent2: "#818cf8", bg: "#080b12" },
};

const KEY = "portfolio_data";

export function getSiteData(): SiteData {
  if (typeof window === "undefined") return DEFAULT_DATA;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_DATA;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_DATA, ...parsed, hero: { ...DEFAULT_DATA.hero, ...parsed.hero }, bio: { ...DEFAULT_DATA.bio, ...parsed.bio }, theme: { ...DEFAULT_DATA.theme, ...parsed.theme } };
  } catch { return DEFAULT_DATA; }
}

export function setSiteData(data: SiteData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(data));
}
