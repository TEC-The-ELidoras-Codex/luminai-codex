import { clsx } from "clsx";

import type { PersonaPresence } from "@/lib/types/resonance";

const fallbackPresence: PersonaPresence[] = [
  {
    id: "nova",
    label: "Nova",
    status: "online",
    frequency: "Solar",
    usage: { sessions: 0, uptimeMinutes: 0 },
    lastSeen: new Date().toISOString(),
  },
  {
    id: "quill",
    label: "Quill",
    status: "away",
    frequency: "Chronicle",
    usage: { sessions: 0, uptimeMinutes: 0 },
    lastSeen: new Date().toISOString(),
  },
];

interface PresenceRailProps {
  readonly className?: string;
  readonly personas?: readonly PersonaPresence[];
}

export function PresenceRail({ className, personas }: PresenceRailProps) {
  const records = personas && personas.length > 0 ? personas : fallbackPresence;
  return (
    <aside
      className={clsx(
        "flex w-56 flex-col gap-4 rounded-3xl border border-border-subtle/40 bg-surface-sunken/80 p-4 shadow-sm",
        className,
      )}
    >
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.32em] text-text-muted">
        <span>Witnesses</span>
        <span className="text-[10px] text-text-secondary">LIVE</span>
      </div>
      <ul className="flex flex-col gap-3">
        {records.map((persona) => (
          <li
            key={persona.id}
            className="flex items-center gap-3 rounded-full border border-border-subtle/40 bg-surface-raised/80 px-3 py-2 text-sm text-text-secondary transition hover:border-accent-primary/40 hover:text-text-primary"
          >
            <span className="from-aura-DEFAULT/60 to-pulse-DEFAULT/40 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br via-accent-primary/30 text-xs font-medium text-text-primary shadow-inner shadow-accent-primary/30">
              {persona.label.slice(0, 2)}
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium text-text-primary">{persona.label}</p>
              <p className="text-xs text-text-muted">
                {persona.status.toUpperCase()} · {persona.frequency}
              </p>
            </div>
            <span
              className={clsx(
                "h-2 w-2 rounded-full",
                persona.status === "online"
                  ? "animate-pulse bg-accent-primary"
                  : persona.status === "escalating"
                    ? "bg-flare-DEFAULT animate-pulse"
                    : "bg-border-subtle",
              )}
              aria-hidden
            />
          </li>
        ))}
      </ul>
    </aside>
  );
}
