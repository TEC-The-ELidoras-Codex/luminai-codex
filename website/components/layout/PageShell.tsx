import type { ReactNode } from "react";

interface PageShellProps {
  readonly title: string;
  readonly summary?: string;
  readonly accent?: ReactNode;
  readonly actions?: ReactNode;
  readonly children: ReactNode;
}

export function PageShell({ title, summary, accent, actions, children }: PageShellProps) {
  return (
    <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 pb-16 pt-10">
      <div className="relative overflow-hidden rounded-3xl border border-border-subtle/60 bg-surface-raised/60 p-8 shadow-[0_0_0_1px_rgba(0,255,255,0.08)]">
        <div className="via-aura-DEFAULT/10 absolute inset-0 -z-10 bg-gradient-to-br from-accent-primary/20 to-transparent" />
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm uppercase tracking-wide text-text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-primary" aria-hidden />
              <span>Resonance Platform</span>
            </div>
            <h1 className="text-3xl font-semibold text-text-primary md:text-4xl">{title}</h1>
            {summary ? <p className="max-w-2xl text-base text-text-secondary">{summary}</p> : null}
          </div>
          <div className="flex shrink-0 flex-col items-stretch gap-3 md:items-end">
            {accent}
            {actions ? <div className="flex gap-2">{actions}</div> : null}
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
