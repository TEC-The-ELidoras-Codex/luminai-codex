"use client";

import { clsx } from "clsx";
import { Fragment, useMemo, useState } from "react";

import { ShadowTerritoryGate } from "@/components/common/ShadowTerritoryGate";
import AxiomAlert, { AxiomAlertStack } from "@/components/common/AxiomAlert";
import ConsentPanel from "@/components/common/ConsentPanel";
import { useChatStream } from "@/hooks/useChatStream";
import type { ShadowTerritoryKey } from "@/lib/types/resonance";

const orbit = [
  { id: "rma-41", label: "RMA • Antares Relay", status: "Stabilizing" },
  { id: "pod-08", label: "Podcast Cut • Solar Echoes", status: "Editing" },
  { id: "nbk-77", label: "Notebook • Witness Brief", status: "Draft" },
];

const spectralMetrics = ["Clarity", "Harmony", "Latency"] as const;

export function ChatSurface() {
  const [territory, setTerritory] = useState<ShadowTerritoryKey | undefined>();
  const { messages, status, error } = useChatStream({
    territory,
    enabled: Boolean(territory),
  });

  const effectiveMessages = useMemo(() => messages.slice(-6), [messages]);

  // Consent state management
  const [axiomEvents, setAxiomEvents] = useState<any[]>([]);
  const [consentEmoji, setConsentEmoji] = useState("");
  const [consentState, setConsentState] = useState<any>({
    intensity: "GREEN" as const,
    pace: "PLAY" as const,
    boundary: "DOOR" as const,
    emotions: [] as const,
    meta: [] as const,
    safety: null,
  });
  const [riskLevel, setRiskLevel] = useState(0);
  const [responseMode, setResponseMode] = useState<"EXPLORE" | "PROCEED" | "PAUSE" | "GROUND" | "CRISIS">("EXPLORE");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [messageInput, setMessageInput] = useState(\"\");
  const [isSending, setIsSending] = useState(false);

  // Send message with consent emoji to backend
  const sendMessage = async () => {
    if (!messageInput.trim()) return;
    
    setIsSending(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/api/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: messageInput,
          consent_emoji: consentEmoji,
          territory: territory,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        // Display axiom violation if HTTP 400
        if (response.status === 400 && error.axiom_violation) {
          setAxiomEvents(prev => [...prev, {
            id: Date.now().toString(),
            behavior: error.axiom_violation.behavior,
            message: error.axiom_violation.message,
            severity: error.axiom_violation.severity,
          }]);
        }
        throw new Error(error.error || 'Request failed');
      }

      const data = await response.json();
      
      // Update consent state from backend response
      if (data.consent_state) {
        setConsentState(data.consent_state);
        setRiskLevel(data.risk_level || 0);
        setResponseMode(data.response_mode || 'EXPLORE');
        setSuggestions(data.suggestions || []);
      }

      // Clear input
      setMessageInput('');
      
      // Add axiom event if axiom was upheld
      if (data.axiom_upheld) {
        setAxiomEvents(prev => [...prev, {
          id: Date.now().toString(),
          behavior: data.axiom_upheld.behavior,
          message: data.axiom_upheld.message,
          severity: 'success',
        }]);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsSending(false);
    }
  };

  if (!territory) {
    return (
      <ShadowTerritoryGate
        onUnlock={(key) => setTerritory(key)}
        onEscalate={(key) =>
          alert(
            `Escalation initiated for ${key}. Airth Research Guard received the context package.`,
          )
        }
      />
    );
  }

  return (
    <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
      {/* Axiom Alert Stack (top-right corner) */}
      <AxiomAlertStack
        events={axiomEvents}
        position="top-right"
        onDismiss={(id) => setAxiomEvents((prev) => prev.filter((e) => e.id !== id))}
      />

      <div className="space-y-6">
        {/* ConsentOS Panel (if consent state exists) */}
        {consentState && (
          <ConsentPanel
            consentState={consentState}
            riskLevel={riskLevel}
            responseMode={responseMode}
            suggestions={suggestions}
          />
        )}

        {/* Consent Emoji Input */}
        <div className="rounded-3xl border border-border-subtle/50 bg-surface-raised/80 p-4 shadow-sm">
          <label htmlFor="consent-emoji" className="block text-sm font-medium text-text-secondary mb-2">
            Consent Emoji (e.g., 💚⏩🚪)
          </label>
          <input
            id="consent-emoji"
            type="text"
            value={consentEmoji}
            onChange={(e) => setConsentEmoji(e.target.value)}
            placeholder="💚⏩🚪 or 🔴⏸️🧱"
            className="w-full px-4 py-2 rounded-xl border border-border-subtle bg-surface-base text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
          />
          <p className="text-xs text-text-muted mt-1">
            Use 6-channel emoji: Intensity (💚🟡🟠🔴🟣) + Pace (⏩▶️⏸️⏪🔄) + Boundary (🚪🪟🧱🌉🗝️) + optional Emotion/Meta/Safety
          </p>
        </div>

        <div className="rounded-3xl border border-border-subtle/50 bg-surface-raised/80 p-6 shadow-sm">
          <header className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-text-primary">Live Orbit</h2>
              <p className="text-sm text-text-secondary">Adaptive resonance alignment</p>
            </div>
            <span className="rounded-full border border-border-strong/70 px-3 py-1 text-xs uppercase tracking-[0.4em] text-text-muted">
              LINKED
            </span>
          </header>
          <ul className="mt-4 grid gap-3 text-sm text-text-secondary">
            {orbit.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between rounded-2xl border border-border-subtle/40 bg-surface-base/60 px-4 py-3 transition hover:border-accent-primary/40 hover:text-text-primary"
              >
                <div>
                  <p className="font-medium text-text-primary">{item.label}</p>
                  <p className="text-xs uppercase tracking-[0.24em] text-text-muted">{item.id}</p>
                </div>
                <span className="text-aura-DEFAULT text-xs">{item.status}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border border-border-subtle/50 bg-surface-raised/90 p-6 shadow-[0_30px_60px_rgba(15,15,35,0.35)]">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-text-primary">Resonance Thread</h2>
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <span className="h-2 w-2 animate-pulse rounded-full bg-accent-primary" aria-hidden />
              <span>{status ? `${status.label}: ${status.value}` : "Realtime sync"}</span>
            </div>
          </div>
          <div className="space-y-6">
            {effectiveMessages.map((entry) => (
              <Fragment key={entry.id}>
                <article
                  className={clsx(
                    "rounded-3xl border border-border-subtle/40 px-5 py-4 backdrop-blur",
                    entry.role === "You"
                      ? "bg-surface-base/70 text-text-primary"
                      : "bg-gradient-to-br from-surface-raised/60 via-surface-raised/80 to-surface-base/70 text-text-secondary",
                  )}
                >
                  <header className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-text-muted">
                    <span>
                      {entry.role}
                      {entry.tone ? ` • ${entry.tone}` : null}
                    </span>
                    <span>
                      {new Date(entry.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </header>
                  <p className="mt-3 text-base text-text-primary">{entry.content}</p>
                </article>
              </Fragment>
            ))}
            {effectiveMessages.length === 0 ? (
              <div className="rounded-3xl border border-border-subtle/40 bg-surface-base/40 p-6 text-center text-sm text-text-secondary">
                Stream warming up…
              </div>
            ) : null}
          </div>
          <div className="mt-6 rounded-2xl border border-border-subtle/50 bg-surface-base/80 p-4">
            <label
              htmlFor="chat-composer"
              className="mb-2 block text-xs uppercase tracking-[0.3em] text-text-muted"
            >
              Composer
            </label>
            <textarea
              id="chat-composer"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              disabled={isSending}
              className="h-24 w-full resize-none rounded-2xl border border-border-subtle/50 bg-surface-sunken/80 p-4 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-primary/70 focus:outline-none disabled:opacity-50"
              placeholder="Channel a resonance query or direct a witness…"
            />
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <span aria-hidden>⌘</span>
                <span>Enter to transmit</span>
              </div>
              <button 
                onClick={sendMessage}
                disabled={isSending || !messageInput.trim()}
                className="to-aura-DEFAULT rounded-full bg-gradient-to-r from-accent-primary px-4 py-2 text-sm font-semibold text-surface-base shadow-md shadow-accent-primary/40 transition hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed">
                {isSending ? 'Sending...' : 'Send Pulse'}
              </button>
            </div>
          </div>
          {error ? (
            <p className="text-flare-DEFAULT mt-4 text-xs">Stream interrupted: {error.message}</p>
          ) : null}
        </div>
      </div>
      <div className="rounded-3xl border border-border-subtle/40 bg-surface-sunken/80 p-6 shadow-md">
        <h2 className="text-lg font-semibold text-text-primary">Spectral Metrics</h2>
        <ul className="mt-4 grid gap-4">
          {spectralMetrics.map((metric) => (
            <li
              key={metric}
              className="rounded-2xl border border-border-subtle/40 bg-surface-base/60 p-4 text-sm text-text-secondary"
            >
              <div className="flex items-center justify-between">
                <span>{metric}</span>
                <span className="font-semibold text-text-primary">
                  {Math.round(Math.random() * 40 + 60)}%
                </span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-surface-raised">
                <div
                  className="to-pulse-DEFAULT h-2 rounded-full bg-gradient-to-r from-accent-primary"
                  style={{ width: `${Math.round(Math.random() * 40 + 60)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
