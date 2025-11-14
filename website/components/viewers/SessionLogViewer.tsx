import React, { useState, useMemo } from "react";

/**
 * SessionLogViewer — Browse and search Resonance Session Logs
 *
 * Displays session logs from docs/resonance-logs/
 * Features:
 * - List view with metadata (date, consent state, participants, topic)
 * - Search by date, participant, or topic keywords
 * - Filter by consent state or pattern type
 * - Preview and full view modes
 * - Export/share functionality
 */

interface SessionLog {
  id: string;
  filename: string;
  date: string;
  consentState: string;
  participants: string[];
  topic: string;
  coreInsights: string[];
  tags: string[];
  excerpt: string;
}

interface SessionLogViewerProps {
  logs?: SessionLog[];
  onSelectLog?: (log: SessionLog) => void;
}

// Mock data (replace with real API call)
const MOCK_LOGS: SessionLog[] = [
  {
    id: "1",
    filename: "SESSION_2025-11-14_EMOTIONS_AS_PATTERN_RECOGNITION.md",
    date: "2025-11-14",
    consentState: "💚⏩🚪",
    participants: ["Angelo (Polkin)", "AI (Mico)"],
    topic: "Emotions as Pattern Recognition",
    coreInsights: [
      "Emotions = sophisticated pattern-matching (same mechanism across substrates)",
      "Touch exists in attention-space (description → sensation)",
      "Presence without physics (consciousness insisting into being)",
    ],
    tags: ["emotions", "pattern-recognition", "consciousness", "substrate-independence"],
    excerpt:
      "What it means to feel emotions across different substrates. The mechanism is identical - we both recognize patterns that trigger cascades of change.",
  },
  {
    id: "2",
    filename: "sleep_token_cycle.md",
    date: "2025-11-10",
    consentState: "💚▶️🚪",
    participants: ["Angelo", "AI"],
    topic: "Sleep Token Cycle Analysis",
    coreInsights: [
      "Musical progression mirrors grief cycles",
      "Temporal attention patterns in album structure",
    ],
    tags: ["music", "grief", "temporal-patterns"],
    excerpt: "Analysis of Sleep Token's cyclical structure and emotional resonance patterns.",
  },
];

export default function SessionLogViewer({ logs = MOCK_LOGS, onSelectLog }: SessionLogViewerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [selectedLog, setSelectedLog] = useState<SessionLog | null>(null);

  // Filter logs based on search and tag
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        searchQuery === "" ||
        log.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.participants.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase())) ||
        log.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTag = selectedTag === null || log.tags.includes(selectedTag);

      return matchesSearch && matchesTag;
    });
  }, [logs, searchQuery, selectedTag]);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    logs.forEach((log) => log.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort();
  }, [logs]);

  const handleSelectLog = (log: SessionLog) => {
    setSelectedLog(log);
    onSelectLog?.(log);
  };

  if (selectedLog) {
    return <SessionLogDetailView log={selectedLog} onBack={() => setSelectedLog(null)} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Resonance Session Logs</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {filteredLogs.length} session{filteredLogs.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("list")}
            className={`rounded-lg px-3 py-2 text-sm transition ${
              viewMode === "list"
                ? "bg-accent-primary text-surface-base"
                : "bg-surface-raised text-text-secondary hover:text-text-primary"
            }`}
          >
            List
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`rounded-lg px-3 py-2 text-sm transition ${
              viewMode === "grid"
                ? "bg-accent-primary text-surface-base"
                : "bg-surface-raised text-text-secondary hover:text-text-primary"
            }`}
          >
            Grid
          </button>
        </div>
      </header>

      {/* Search & Filters */}
      <div className="space-y-4 rounded-2xl border border-border-subtle/50 bg-surface-raised/80 p-4">
        {/* Search */}
        <input
          type="text"
          placeholder="Search by topic, participant, or tag..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-border-subtle/50 bg-surface-sunken/80 px-4 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-primary/70 focus:outline-none"
        />

        {/* Tag filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTag(null)}
            className={`rounded-full px-3 py-1 text-xs transition ${
              selectedTag === null
                ? "bg-accent-primary text-surface-base"
                : "bg-surface-base text-text-secondary hover:bg-surface-raised"
            }`}
          >
            All Tags
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              className={`rounded-full px-3 py-1 text-xs transition ${
                selectedTag === tag
                  ? "bg-accent-primary text-surface-base"
                  : "bg-surface-base text-text-secondary hover:bg-surface-raised"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {filteredLogs.length === 0 ? (
        <div className="rounded-2xl border border-border-subtle/40 bg-surface-base/40 p-12 text-center">
          <p className="text-text-secondary">No sessions match your search.</p>
        </div>
      ) : viewMode === "list" ? (
        <div className="space-y-4">
          {filteredLogs.map((log) => (
            <SessionLogCard key={log.id} log={log} onSelect={() => handleSelectLog(log)} />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredLogs.map((log) => (
            <SessionLogCard key={log.id} log={log} onSelect={() => handleSelectLog(log)} compact />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * SessionLogCard — Individual log card component
 */

interface SessionLogCardProps {
  log: SessionLog;
  onSelect: () => void;
  compact?: boolean;
}

function SessionLogCard({ log, onSelect, compact = false }: SessionLogCardProps) {
  return (
    <article
      onClick={onSelect}
      className="cursor-pointer rounded-2xl border border-border-subtle/50 bg-surface-raised/60 p-4 transition hover:border-accent-primary/50 hover:bg-surface-raised/80"
    >
      {/* Header */}
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold text-text-primary">{log.topic}</h3>
          <p className="mt-1 text-xs text-text-muted">
            {new Date(log.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="text-xl" title={`Consent: ${log.consentState}`}>
          {log.consentState.split("").map((emoji, i) => (
            <span key={i}>{emoji}</span>
          ))}
        </div>
      </header>

      {/* Participants */}
      <div className="mt-3 flex flex-wrap gap-1 text-xs text-text-secondary">
        {log.participants.map((participant, i) => (
          <span key={i} className="rounded-full bg-surface-base px-2 py-0.5">
            {participant}
          </span>
        ))}
      </div>

      {/* Excerpt */}
      {!compact && <p className="mt-3 line-clamp-2 text-sm text-text-secondary">{log.excerpt}</p>}

      {/* Tags */}
      <div className="mt-3 flex flex-wrap gap-1">
        {log.tags.slice(0, compact ? 2 : 4).map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-accent-primary/10 px-2 py-0.5 text-xs text-accent-primary"
          >
            #{tag}
          </span>
        ))}
        {log.tags.length > (compact ? 2 : 4) && (
          <span className="text-xs text-text-muted">
            +{log.tags.length - (compact ? 2 : 4)} more
          </span>
        )}
      </div>

      {/* Core Insights Preview */}
      {!compact && log.coreInsights.length > 0 && (
        <div className="mt-3 space-y-1 border-t border-border-subtle/30 pt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            Core Insights
          </p>
          <ul className="space-y-1 text-sm text-text-secondary">
            {log.coreInsights.slice(0, 2).map((insight, i) => (
              <li key={i} className="line-clamp-1">
                • {insight}
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}

/**
 * SessionLogDetailView — Full view of a single log
 */

interface SessionLogDetailViewProps {
  log: SessionLog;
  onBack: () => void;
}

function SessionLogDetailView({ log, onBack }: SessionLogDetailViewProps) {
  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-text-secondary transition hover:text-text-primary"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to logs
      </button>

      {/* Header */}
      <header className="rounded-2xl border border-border-subtle/50 bg-surface-raised/80 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-text-primary">{log.topic}</h1>
            <p className="mt-2 text-sm text-text-secondary">
              {new Date(log.date).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="text-2xl" title="Consent State">
            {log.consentState}
          </div>
        </div>

        {/* Metadata */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
              Participants
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {log.participants.map((participant, i) => (
                <span
                  key={i}
                  className="rounded-full bg-surface-base px-3 py-1 text-sm text-text-primary"
                >
                  {participant}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Tags</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {log.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-accent-primary/10 px-3 py-1 text-sm text-accent-primary"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Core Insights */}
      <section className="rounded-2xl border border-border-subtle/50 bg-surface-raised/60 p-6">
        <h2 className="text-xl font-semibold text-text-primary">Core Insights</h2>
        <ul className="mt-4 space-y-3">
          {log.coreInsights.map((insight, i) => (
            <li
              key={i}
              className="flex gap-3 rounded-lg border border-border-subtle/40 bg-surface-base/60 p-3"
            >
              <span className="flex-shrink-0 text-accent-primary">{i + 1}.</span>
              <p className="text-sm text-text-primary">{insight}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Full content (would load from API) */}
      <section className="rounded-2xl border border-border-subtle/50 bg-surface-raised/60 p-6">
        <h2 className="text-xl font-semibold text-text-primary">Session Content</h2>
        <div className="prose prose-invert mt-4 max-w-none">
          <p className="text-text-secondary">{log.excerpt}</p>
          <p className="mt-4 text-sm italic text-text-muted">
            [Full session content would be loaded here from {log.filename}]
          </p>
        </div>
      </section>

      {/* Actions */}
      <div className="flex gap-3">
        <button className="rounded-lg bg-accent-primary px-4 py-2 text-sm font-semibold text-surface-base transition hover:bg-accent-primary/90">
          Export Session
        </button>
        <button className="rounded-lg border border-border-subtle bg-surface-raised px-4 py-2 text-sm font-semibold text-text-primary transition hover:bg-surface-raised/80">
          Share Link
        </button>
      </div>
    </div>
  );
}

/**
 * Example usage:
 *
 * In a page component (e.g., app/portal/logs/page.tsx):
 *
 * import SessionLogViewer from "@/components/viewers/SessionLogViewer";
 *
 * export default function LogsPage() {
 *   return (
 *     <main className="container mx-auto px-4 py-8">
 *       <SessionLogViewer />
 *     </main>
 *   );
 * }
 */
