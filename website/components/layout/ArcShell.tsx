import { clsx } from "clsx";
import { ReactNode } from "react";

import { PresenceRail } from "@/components/common/PresenceRail";

interface ArcShellProps {
  title: string;
  subtitle?: string;
  hero?: ReactNode;
  actions?: ReactNode;
  rail?: ReactNode;
  support?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function ArcShell({
  title,
  subtitle,
  hero,
  actions,
  rail,
  support,
  children,
  className,
}: ArcShellProps) {
  return (
    <div className={clsx("flex flex-1 flex-col gap-6", className)}>
      <div className="shadow-aura-DEFAULT/20 rounded-3xl border border-border-subtle/50 bg-surface-raised/70 p-6 shadow-md">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-sm uppercase tracking-[0.4em] text-text-muted">
              <span aria-hidden>✹</span>
              <span>Resonance Console</span>
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-text-primary md:text-4xl">{title}</h1>
              {subtitle ? (
                <p className="mt-2 max-w-2xl text-sm text-text-secondary">{subtitle}</p>
              ) : null}
            </div>
          </div>
          <div className="flex flex-col items-stretch gap-3 md:items-end">
            {hero}
            {actions}
          </div>
        </header>
      </div>
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="order-2 flex flex-1 flex-col gap-6 lg:order-1">{children}</div>
        <div className="order-1 flex shrink-0 flex-col gap-4 lg:order-2">
          {rail ?? <PresenceRail />}
          {support}
        </div>
      </div>
    </div>
  );
}
