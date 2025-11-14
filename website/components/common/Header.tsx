"use client";

import { clsx } from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

const routes: Array<{ href: string; label: string; emoji: string }> = [
  { href: "/dashboard", label: "Dashboard", emoji: "🛸" },
  { href: "/chat", label: "Resonance Chat", emoji: "🧠" },
  { href: "/notebook", label: "Notebook", emoji: "📓" },
  { href: "/theme", label: "Theme Studio", emoji: "🎨" },
  { href: "/pod", label: "Podcast", emoji: "🎙️" },
  { href: "/map", label: "Map", emoji: "🗺️" },
  { href: "/specs", label: "Screen Specs", emoji: "📐" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle backdrop-blur supports-[backdrop-filter]:bg-surface-base/70">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 text-lg font-semibold text-text-primary transition hover:text-accent-primary"
        >
          <span className="to-aura-DEFAULT relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-primary text-lg shadow-md shadow-accent-primary/40">
            ✶
          </span>
          <span className="leading-tight">
            LuminAI Resonance
            <span className="block text-sm font-normal text-text-muted">
              Cosmic Intelligence Console
            </span>
          </span>
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          {routes.map(({ href, label, emoji }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "group flex items-center gap-1 rounded-full px-4 py-2 transition",
                  active
                    ? "bg-accent-primary/15 text-accent-primary"
                    : "text-text-muted hover:bg-surface-raised/60 hover:text-text-primary",
                )}
              >
                <span aria-hidden>{emoji}</span>
                {label}
                <span
                  aria-hidden
                  className="ml-2 h-px w-8 rounded-full bg-gradient-to-r from-transparent via-accent-primary/40 to-transparent opacity-0 transition group-hover:opacity-100"
                />
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <button className="rounded-full border border-border-subtle/50 bg-surface-raised/60 px-4 py-2 text-sm text-text-secondary transition hover:border-accent-primary/60 hover:text-text-primary">
            Command Palette
          </button>
          <button className="to-aura-DEFAULT hover:shadow-pulse-DEFAULT/40 flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-primary px-4 py-2 text-sm font-semibold text-surface-base shadow-md shadow-accent-primary/50 transition hover:shadow-lg">
            <span>Launch Session</span>
            <span aria-hidden>↗</span>
          </button>
        </div>
      </div>
    </header>
  );
}
