"use client";

import { useState } from "react";

import { ShadowConsentBanner } from "@/components/common/ShadowConsentBanner";
import { Skeleton } from "@/components/common/Skeleton";
import { useDataResource } from "@/hooks/useDataResource";
import { fetchNotebookPayload } from "@/lib/api-client";
import type { NotebookPayload } from "@/lib/types/resonance";

export function NotebookSurface() {
  const { data, loading, error, refresh } = useDataResource(fetchNotebookPayload);

  const entries = data?.entries ?? [];
  const [composeUnlocked, setComposeUnlocked] = useState(false);

  return (
    <section className="flex flex-col gap-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="rounded-3xl border border-border-subtle/40 bg-surface-raised/80 p-6 shadow-lg">
          <header className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-text-muted">Notebook Stack</p>
              <h2 className="mt-2 text-2xl font-semibold text-text-primary">
                Airth Research Guard
              </h2>
              <p className="mt-2 text-sm text-text-secondary">
                Draft, annotate, and sync witness knowledge across resonance nodes.
              </p>
            </div>
            <button
              className="rounded-full border border-border-subtle/40 bg-surface-base/80 px-3 py-1 text-xs text-text-secondary transition hover:border-accent-primary/40 hover:text-text-primary"
              onClick={refresh}
            >
              Refresh
            </button>
          </header>
          <ul className="mt-6 space-y-4">
            {loading && !data ? <NotebookSkeleton /> : null}
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="rounded-3xl border border-border-subtle/40 bg-surface-base/60 p-4 transition hover:border-accent-primary/50"
              >
                <header className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-text-muted">
                  <span>{entry.id}</span>
                  <span>
                    Updated{" "}
                    {new Date(entry.lastUpdated).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </header>
                <h3 className="mt-3 text-lg font-semibold text-text-primary">{entry.title}</h3>
                <p className="mt-2 text-sm text-text-secondary">{entry.summary}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-text-muted">
                  {entry.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border-subtle/40 bg-surface-raised/70 px-3 py-1 uppercase tracking-[0.28em]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </li>
            ))}
            {entries.length === 0 && !loading && (
              <li className="rounded-2xl border border-border-subtle/40 bg-surface-base/50 p-4 text-sm text-text-secondary">
                {loading ? "Loading notebook entries…" : "No entries found."}
              </li>
            )}
          </ul>
          {error ? (
            <p className="text-flare-DEFAULT mt-4 text-xs">
              Failed to load notebook: {error.message}
            </p>
          ) : null}
        </div>
        <div className="shadow-aura-DEFAULT/20 rounded-3xl border border-border-strong/30 bg-gradient-to-br from-surface-raised/80 via-surface-base/60 to-surface-sunken/70 p-6 shadow-inner">
          <h2 className="text-lg font-semibold text-text-primary">Research Pulse</h2>
          <p className="mt-2 text-sm text-text-secondary">
            Synced memories across Codex Hub and Resonance Engine autopopulate here.
          </p>
          <div className="mt-4 space-y-3 text-sm text-text-secondary">
            {(data?.researchPulse ?? []).map((pulse) => (
              <p key={pulse}>• {pulse}</p>
            ))}
            {loading && !data ? <p>• Loading telemetry…</p> : null}
          </div>
          {data?.trace ? <EquationBlock trace={data.trace} /> : null}
        </div>
      </div>
      <div className="rounded-3xl border border-border-subtle/40 bg-surface-sunken/70 p-6">
        <h2 className="text-lg font-semibold text-text-primary">Compose</h2>
        {composeUnlocked ? (
          <ComposeForm />
        ) : (
          <ShadowConsentBanner
            territory="taboo_emotions"
            onContinue={() => setComposeUnlocked(true)}
            onEscalate={() => alert("Shadow escalation routed to Airth Research Guard.")}
          />
        )}
      </div>
    </section>
  );
}

function EquationBlock({ trace }: { readonly trace?: NotebookPayload["trace"] }) {
  if (!trace) return null;
  return (
    <div className="mt-5 rounded-2xl border border-border-subtle/40 bg-surface-base/80 p-4">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-text-muted">
        <span>Equation Block</span>
        <span>Confidence {Math.round(trace.confidence * 100)}%</span>
      </div>
      <p className="mt-3 font-mono text-lg text-text-primary">{trace.equation}</p>
      <ul className="mt-4 space-y-2 text-sm text-text-secondary">
        {trace.variables.map((variable) => (
          <li key={variable.symbol} className="flex items-center justify-between">
            <span className="font-mono text-text-primary">{variable.symbol}</span>
            <span>{variable.value}</span>
            <span className="text-xs text-text-muted">{variable.meaning}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-text-secondary">{trace.recommendation}</p>
    </div>
  );
}

function NotebookSkeleton() {
  return (
    <>
      {[0, 1, 2].map((key) => (
        <li key={key}>
          <Skeleton className="h-28 w-full" />
        </li>
      ))}
    </>
  );
}

function ComposeForm() {
  return (
    <>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border-subtle/30 bg-surface-base/80 p-4">
          <label htmlFor="nbk-title" className="text-xs uppercase tracking-[0.3em] text-text-muted">
            Title
          </label>
          <input
            id="nbk-title"
            className="mt-2 w-full rounded-xl border border-border-subtle/40 bg-transparent px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-primary/60 focus:outline-none"
            placeholder="Name your witness brief"
          />
        </div>
        <div className="rounded-2xl border border-border-subtle/30 bg-surface-base/80 p-4">
          <label htmlFor="nbk-orbit" className="text-xs uppercase tracking-[0.3em] text-text-muted">
            Orbit Link
          </label>
          <input
            id="nbk-orbit"
            className="mt-2 w-full rounded-xl border border-border-subtle/40 bg-transparent px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-primary/60 focus:outline-none"
            placeholder="Attach resonance chat snippet"
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="nbk-body" className="text-xs uppercase tracking-[0.3em] text-text-muted">
            Body
          </label>
          <textarea
            id="nbk-body"
            className="mt-2 h-40 w-full rounded-2xl border border-border-subtle/40 bg-surface-base/80 p-4 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-primary/60 focus:outline-none"
            placeholder="Compose an artifact for your witnesses…"
          />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-text-muted">
          <span aria-hidden>◇</span>
          <span>Autosaves to Codex Hub every 12 seconds</span>
        </div>
        <button className="from-aura-DEFAULT to-pulse-DEFAULT shadow-aura-DEFAULT/40 rounded-full bg-gradient-to-r px-4 py-2 text-sm font-semibold text-surface-base shadow-md transition hover:shadow-xl">
          Publish to Witnesses
        </button>
      </div>
    </>
  );
}
