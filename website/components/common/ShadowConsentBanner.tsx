"use client";

import { useState } from "react";

import { getShadowTerritory } from "@/lib/shadow-territories";
import type { ShadowTerritoryKey } from "@/lib/types/resonance";

interface ShadowConsentBannerProps {
  readonly territory: ShadowTerritoryKey;
  readonly onContinue: () => void;
  readonly onEscalate?: () => void;
}

export function ShadowConsentBanner({
  territory,
  onContinue,
  onEscalate,
}: ShadowConsentBannerProps) {
  const spec = getShadowTerritory(territory);
  const [ackPurpose, setAckPurpose] = useState(false);
  const [ackBoundaries, setAckBoundaries] = useState(false);
  const ready = ackPurpose && ackBoundaries;

  return (
    <div className="space-y-4 rounded-2xl border border-border-subtle/60 bg-surface-base/70 p-5 text-sm text-text-secondary">
      <header>
        <p className="text-xs uppercase tracking-[0.32em] text-text-muted">Context Package</p>
        <h3 className="text-lg font-semibold text-text-primary">{spec.title}</h3>
        <p className="mt-1 text-sm">{spec.summary}</p>
      </header>
      <div className="grid gap-3 text-xs text-text-muted md:grid-cols-2">
        <div>
          <p className="uppercase tracking-[0.3em]">Purpose</p>
          <p className="mt-1 text-sm text-text-secondary">{spec.contextPackage.purpose}</p>
        </div>
        <div>
          <p className="uppercase tracking-[0.3em]">Memory Policy</p>
          <p className="mt-1 text-sm text-text-secondary">{spec.contextPackage.memoryPolicy}</p>
        </div>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-text-muted">Escalation Reminders</p>
        <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-text-secondary">
          {spec.contextPackage.escalation.map((step) => (
            <li key={step.label}>
              <strong className="text-text-primary">{step.label}:</strong> {step.guidance}
            </li>
          ))}
        </ul>
      </div>
      <div className="space-y-2 text-xs text-text-muted">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-border-subtle/60 bg-transparent"
            checked={ackPurpose}
            onChange={(event) => setAckPurpose(event.target.checked)}
          />
          <span>I understand the stated purpose + memory policy.</span>
        </label>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-border-subtle/60 bg-transparent"
            checked={ackBoundaries}
            onChange={(event) => setAckBoundaries(event.target.checked)}
          />
          <span>I will escalate when red lines appear.</span>
        </label>
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="to-aura-DEFAULT rounded-full bg-gradient-to-r from-accent-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-surface-base shadow-md shadow-accent-primary/40 transition hover:shadow-lg disabled:opacity-50"
          disabled={!ready}
          onClick={onContinue}
        >
          Begin Writing
        </button>
        <button
          type="button"
          className="rounded-full border border-border-subtle/50 px-4 py-2 text-xs uppercase tracking-[0.28em] text-text-secondary transition hover:border-accent-primary/60 hover:text-text-primary"
          onClick={onEscalate}
        >
          Escalate
        </button>
      </div>
    </div>
  );
}
