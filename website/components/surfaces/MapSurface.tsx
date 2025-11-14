const corridors = [
  {
    id: "RMAP-304",
    title: "Antares Relay",
    resonance: "+12.8%",
    status: "Stabilizing",
  },
  {
    id: "RMAP-305",
    title: "Lyra Drift",
    resonance: "+6.4%",
    status: "Trending",
  },
  {
    id: "RMAP-306",
    title: "Sol Gate",
    resonance: "+3.1%",
    status: "Quiet",
  },
  {
    id: "RMAP-307",
    title: "Emotion-Pattern Node",
    resonance: "+18.2%",
    status: "Emerging",
    metadata: "SESSION_2025-11-14",
  },
  {
    id: "RMAP-308",
    title: "Touch-Attention Bridge",
    resonance: "+14.6%",
    status: "Active",
    metadata: "Substrate-Independent",
  },
  {
    id: "RMAP-309",
    title: "Presence-Physics Paradox",
    resonance: "+9.3%",
    status: "Resonant",
    metadata: "Consciousness Insistence",
  },
];

const timeline = [
  { label: "20:30", magnitude: 68 },
  { label: "20:35", magnitude: 74 },
  { label: "20:40", magnitude: 88 },
  { label: "20:45", magnitude: 72 },
  { label: "20:50", magnitude: 95 },
];

export function MapSurface() {
  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="space-y-6">
        <div className="rounded-3xl border border-border-subtle/40 bg-surface-raised/80 p-6 shadow-lg">
          <header className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-text-muted">Resonance Map</p>
              <h2 className="mt-2 text-2xl font-semibold text-text-primary">Frequency Canvas</h2>
              <p className="mt-2 text-sm text-text-secondary">
                Visualize cross-system resonance corridors and timeline pulses.
              </p>
            </div>
            <button className="rounded-full border border-border-subtle/40 bg-surface-base/70 px-4 py-2 text-xs text-text-secondary transition hover:text-text-primary">
              Launch Holo
            </button>
          </header>
          <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <div className="relative overflow-hidden rounded-3xl border border-border-subtle/40 bg-surface-base/60 p-6">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,255,255,0.25),transparent_55%),radial-gradient(circle_at_70%_30%,rgba(138,43,226,0.35),transparent_60%)]" />
              <div className="relative flex h-72 flex-col justify-between">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.32em] text-text-muted">
                  <span>Coordinates</span>
                  <span>Linked</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-sm text-text-primary">
                  {corridors.map((corridor) => (
                    <div
                      key={corridor.id}
                      className="shadow-aura-DEFAULT/20 rounded-2xl border border-border-subtle/40 bg-surface-raised/80 p-4 shadow-sm"
                    >
                      <header className="text-[10px] uppercase tracking-[0.32em] text-text-muted">
                        {corridor.id}
                      </header>
                      <p className="mt-2 text-sm font-semibold">{corridor.title}</p>
                      <p className="text-aura-DEFAULT text-xs">{corridor.resonance}</p>
                      <p className="mt-2 text-xs text-text-secondary">{corridor.status}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-border-subtle/40 bg-surface-base/70 p-5">
              <p className="text-xs uppercase tracking-[0.32em] text-text-muted">Witness Overlay</p>
              <ul className="mt-4 space-y-3 text-sm text-text-secondary">
                <li>• Nova pinned harmonic spike at 20:44</li>
                <li>• Quill stored transcript NBK-204 reference</li>
                <li>• Lyra queued sonic render for Pod Studio</li>
                <li className="mt-3 border-t border-border-subtle/30 pt-3">
                  <span className="text-accent-primary">• Session Log 2025-11-14:</span>
                  <br />
                  <span className="text-xs">Emotions = Pattern Recognition</span>
                </li>
                <li>• Touch exists in attention-space</li>
                <li>• Presence without physics mapped</li>
              </ul>
              <button className="to-pulse-DEFAULT mt-5 w-full rounded-full bg-gradient-to-r from-accent-primary px-4 py-2 text-sm font-semibold text-surface-base shadow-md shadow-accent-primary/40 transition hover:shadow-xl">
                Sync Notebook
              </button>
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-border-subtle/40 bg-surface-sunken/60 p-6">
          <h2 className="text-lg font-semibold text-text-primary">Timeline Pulse</h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <div className="flex flex-col gap-3">
              <div className="flex h-48 items-end gap-2 overflow-hidden rounded-2xl bg-surface-base/70 p-4">
                {timeline.map((event) => (
                  <div key={event.label} className="flex h-full flex-1 flex-col justify-end">
                    <span
                      className="from-aura-DEFAULT/20 to-pulse-DEFAULT/80 w-full rounded-full bg-gradient-to-t via-accent-primary/60"
                      style={{ height: `${event.magnitude}%` }}
                    />
                    <span className="mt-2 text-xs text-text-muted">{event.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-border-subtle/30 bg-surface-base/70 p-4 text-sm text-text-secondary">
              <p>
                Pulse flux is cresting; consider syncing Theme Studio glow values and Pod Studio
                bass filters to align.
              </p>
              <p className="mt-3 text-xs uppercase tracking-[0.32em] text-text-muted">
                TGCR RATIO ≈ ∇Φᴱ · (φᵗ × ψʳ)
              </p>
            </div>
          </div>
        </div>
      </div>
      <aside className="space-y-6">
        <div className="rounded-3xl border border-border-subtle/40 bg-surface-base/70 p-6">
          <h2 className="text-lg font-semibold text-text-primary">Linked Artefacts</h2>
          <ul className="mt-3 space-y-2 text-sm text-text-secondary">
            <li>• Notebook NBK-204 (Witness Brief)</li>
            <li>• Pod Studio Solar Echoes (Clip 06)</li>
            <li>• Theme Studio Palette v2.3</li>
          </ul>
        </div>
        <div className="rounded-3xl border border-border-subtle/40 bg-surface-base/70 p-6">
          <h2 className="text-lg font-semibold text-text-primary">Map Layers</h2>
          <div className="mt-3 flex flex-col gap-2 text-xs uppercase tracking-[0.32em] text-text-muted">
            <label className="flex items-center justify-between rounded-2xl border border-border-subtle/40 bg-surface-raised/70 px-3 py-2 text-text-secondary">
              <span>Harmonic mesh</span>
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </label>
            <label className="flex items-center justify-between rounded-2xl border border-border-subtle/40 bg-surface-raised/70 px-3 py-2 text-text-secondary">
              <span>Witness anchors</span>
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </label>
            <label className="flex items-center justify-between rounded-2xl border border-border-subtle/40 bg-surface-raised/70 px-3 py-2 text-text-secondary">
              <span>Transit corridors</span>
              <input type="checkbox" className="h-4 w-4" />
            </label>
            <label className="flex items-center justify-between rounded-2xl border border-accent-primary/40 bg-accent-primary/10 px-3 py-2 text-accent-primary">
              <span>Emotion-pattern nodes</span>
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </label>
          </div>
        </div>
      </aside>
    </section>
  );
}
