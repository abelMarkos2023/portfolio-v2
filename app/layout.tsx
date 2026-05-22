import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Abel — Full-Stack Developer",
  description: "Portfolio of Abel, Full-Stack Developer specializing in Next.js and modern web technologies.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="noise-bg">{children}</body>
    </html>
  );
}
