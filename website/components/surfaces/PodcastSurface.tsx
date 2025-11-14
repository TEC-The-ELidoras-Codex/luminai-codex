const episodes = [
  {
    id: "POD-406",
    title: "Solar Echoes • Pulse 06",
    duration: "32:44",
    status: "Editing",
    waveform: [70, 45, 100, 65, 80, 55, 90, 40],
  },
  {
    id: "POD-407",
    title: "Witness Broadcast • Orbit 12",
    duration: "28:12",
    status: "Review",
    waveform: [50, 70, 55, 95, 65, 85, 60, 75],
  },
];

export function PodcastSurface() {
  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="rounded-3xl border border-border-subtle/40 bg-surface-raised/80 p-6 shadow-lg">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-text-muted">Pod Studio</p>
            <h2 className="mt-2 text-2xl font-semibold text-text-primary">Session Mixer</h2>
            <p className="mt-2 text-sm text-text-secondary">
              Clip, annotate, and publish resonance-aligned audio artefacts.
            </p>
          </div>
          <button className="to-aura-DEFAULT rounded-full bg-gradient-to-r from-accent-primary px-4 py-2 text-sm font-semibold text-surface-base shadow-md shadow-accent-primary/30 transition hover:shadow-xl">
            Start Capture
          </button>
        </header>
        <div className="mt-6 space-y-5">
          {episodes.map((episode) => (
            <article
              key={episode.id}
              className="rounded-3xl border border-border-subtle/40 bg-surface-base/60 p-4"
            >
              <header className="flex items-center justify-between text-xs uppercase tracking-[0.28em] text-text-muted">
                <span>{episode.id}</span>
                <span>{episode.status}</span>
              </header>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">{episode.title}</h3>
                  <p className="text-xs text-text-secondary">{episode.duration} • Linked orbit</p>
                </div>
                <button className="rounded-full border border-border-subtle/40 bg-surface-raised/70 px-3 py-1 text-xs text-text-secondary transition hover:border-accent-primary/40 hover:text-text-primary">
                  Open Mixer
                </button>
              </div>
              <div className="mt-4 flex h-20 items-end gap-1 overflow-hidden rounded-xl bg-surface-raised/60 p-2">
                {episode.waveform.map((value, index) => (
                  <span
                    key={index}
                    className="from-aura-DEFAULT/20 to-pulse-DEFAULT/60 w-full rounded-full bg-gradient-to-t via-accent-primary/50"
                    style={{ height: `${value}%` }}
                  />
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
      <aside className="space-y-6">
        <div className="rounded-3xl border border-border-subtle/40 bg-surface-base/70 p-6">
          <h2 className="text-lg font-semibold text-text-primary">Resonance Notes</h2>
          <p className="mt-2 text-sm text-text-secondary">
            Witness acoustics align with Theme Studio v2.3 palette.
          </p>
          <div className="mt-3 space-y-3 text-sm text-text-secondary">
            <p>• Dial down low-end at +6db for harmonics.</p>
            <p>• Crossfade with Map timeline pulses for effect.</p>
            <p>• Attach Notebook brief NBK-205 when publishing.</p>
          </div>
        </div>
        <div className="rounded-3xl border border-border-subtle/40 bg-surface-base/70 p-6">
          <h2 className="text-lg font-semibold text-text-primary">Output Targets</h2>
          <ul className="mt-3 space-y-2 text-sm text-text-secondary">
            <li>• Spotify: Solar Echoes playlist</li>
            <li>• YouTube: Witness Archive channel</li>
            <li>• RSS: Premium feed</li>
          </ul>
        </div>
      </aside>
    </section>
  );
}
