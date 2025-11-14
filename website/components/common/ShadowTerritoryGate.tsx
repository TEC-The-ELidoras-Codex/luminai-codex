"use client";

import { clsx } from "clsx";
import { useMemo, useState } from "react";

import { getShadowTerritory, listShadowTerritories } from "@/lib/shadow-territories";
import type { ShadowTerritoryKey } from "@/lib/types/resonance";

interface ShadowTerritoryGateProps {
  readonly defaultTerritory?: ShadowTerritoryKey;
  readonly onUnlock: (territory: ShadowTerritoryKey) => void;
  readonly onEscalate?: (territory: ShadowTerritoryKey) => void;
}

export function ShadowTerritoryGate({
  defaultTerritory,
  onUnlock,
  onEscalate,
}: ShadowTerritoryGateProps) {
  const territories = useMemo(() => listShadowTerritories(), []);
  const [selected, setSelected] = useState<ShadowTerritoryKey>(
    defaultTerritory ?? territories[0].key,
  );
  const [readContext, setReadContext] = useState(false);
  const [commitIntent, setCommitIntent] = useState(false);

  const spec = getShadowTerritory(selected);
  const ready = readContext && commitIntent;

  return (
    <div className="shadow-aura-DEFAULT/20 rounded-3xl border border-border-strong/30 bg-surface-sunken/70 p-6 text-sm text-text-secondary shadow-lg">
      <header>
        <p className="text-xs uppercase tracking-[0.32em] text-text-muted">Shadow Territory Gate</p>
        <h2 className="mt-2 text-2xl font-semibold text-text-primary">Choose Territory</h2>
        <p className="mt-2">
          Before entering, read the context package, confirm memory policy, and keep escalation
          paths visible.
        </p>
      </header>
      <div className="mt-4 flex flex-wrap gap-2">
        {territories.map((territory) => (
          <button
            key={territory.key}
            type="button"
            onClick={() => setSelected(territory.key)}
            className={clsx(
              "rounded-full border px-3 py-1 text-xs uppercase tracking-[0.28em] transition",
              selected === territory.key
                ? "border-accent-primary/70 text-accent-primary"
                : "border-border-subtle/40 text-text-muted hover:text-text-primary",
            )}
          >
            {territory.title}
          </button>
        ))}
      </div>
      <section className="mt-5 space-y-3 rounded-2xl border border-border-subtle/40 bg-surface-base/70 p-5">
        <header>
          <h3 className="text-lg font-semibold text-text-primary">{spec.title}</h3>
          <p className="text-sm text-text-secondary">{spec.summary}</p>
        </header>
        <dl className="grid gap-3 text-xs uppercase tracking-[0.28em] text-text-muted md:grid-cols-2">
          <div>
            <dt>Purpose</dt>
            <dd className="mt-2 text-sm normal-case text-text-secondary">
              {spec.contextPackage.purpose}
            </dd>
          </div>
          <div>
            <dt>Intent</dt>
            <dd className="mt-2 text-sm normal-case text-text-secondary">
              {spec.contextPackage.intent}
            </dd>
          </div>
          <div>
            <dt>Memory Policy</dt>
            <dd className="mt-2 text-sm normal-case text-text-secondary">
              {spec.contextPackage.memoryPolicy}
            </dd>
          </div>
          <div>
            <dt>Red Lines</dt>
            <dd className="mt-2 text-sm normal-case text-text-secondary">
              <ul className="list-disc space-y-1 pl-4">
                {spec.contextPackage.redLines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-text-muted">Grounding Resources</p>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-text-secondary">
            {spec.contextPackage.resources.map((resource) => (
              <li key={resource}>{resource}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-text-muted">Escalation Controls</p>
          <ol className="mt-2 space-y-2 text-sm text-text-secondary">
            {spec.contextPackage.escalation.map((step) => (
              <li key={step.label}>
                <strong className="text-text-primary">{step.label}:</strong> {step.guidance}
              </li>
            ))}
          </ol>
        </div>
      </section>
      <div className="mt-5 space-y-3 text-xs text-text-muted">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-border-subtle/60 bg-transparent"
            checked={readContext}
            onChange={(event) => setReadContext(event.target.checked)}
          />
          <span>I reviewed the context package + memory policy.</span>
        </label>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-border-subtle/60 bg-transparent"
            checked={commitIntent}
            onChange={(event) => setCommitIntent(event.target.checked)}
          />
          <span>I will escalate if red lines appear.</span>
        </label>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          className="to-aura-DEFAULT rounded-full bg-gradient-to-r from-accent-primary px-5 py-2 text-sm font-semibold text-surface-base shadow-md shadow-accent-primary/40 transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => onUnlock(selected)}
          disabled={!ready}
        >
          Enter Shadow Work
        </button>
        <button
          type="button"
          className="rounded-full border border-border-subtle/50 px-4 py-2 text-xs uppercase tracking-[0.28em] text-text-secondary transition hover:border-accent-primary/60 hover:text-text-primary"
          onClick={() => onEscalate?.(selected)}
        >
          Escalate Support
        </button>
      </div>
    </div>
  );
}
