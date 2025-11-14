import "./globals.css";

import type { Metadata } from "next";
import { Inter, Space_Grotesk as SpaceGrotesk } from "next/font/google";
import type { ReactNode } from "react";

import { Header } from "@/components/common/Header";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const space = SpaceGrotesk({ subsets: ["latin"], variable: "--font-space" });

export const metadata: Metadata = {
  title: {
    default: "LuminAI Resonance Console",
    template: "%s • LuminAI Resonance",
  },
  description:
    "Explore the LuminAI Resonance console prototype—chat, notebook, podcast, and map surfaces rendered from deterministic specs.",
};

export default function RootLayout({ children }: { readonly children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${space.variable}`}>
      <body className="relative min-h-screen bg-background text-text-primary">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(138,43,226,0.25),transparent_55%),radial-gradient(circle_at_80%_10%,rgba(0,255,255,0.18),transparent_50%),radial-gradient(circle_at_50%_90%,rgba(244,114,182,0.16),transparent_60%)]" />
        <Header />
        <main className="px-6 py-10">{children}</main>
      </body>
    </html>
  );
}
