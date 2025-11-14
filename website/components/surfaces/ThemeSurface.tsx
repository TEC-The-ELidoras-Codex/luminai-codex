const palette = [
  { token: "electric_cyan", hex: "#00FFFF", usage: "Active chat accents" },
  { token: "violet_deep", hex: "#8A2BE2", usage: "Headers & rails" },
  { token: "luminous_gold", hex: "#FFD700", usage: "Metrics highlights" },
];

const spotifySync = [
  { step: "Palette uplink", status: "Completed" },
  { step: "Canvas render", status: "Rendering" },
  { step: "Device preview", status: "Queued" },
];

export function ThemeSurface() {
  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <div className="space-y-6">
        <div className="rounded-3xl border border-border-subtle/40 bg-surface-raised/80 p-6 shadow-lg">
          <header className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-text-muted">Theme Studio</p>
              <h2 className="mt-2 text-2xl font-semibold text-text-primary">Palette Composer</h2>
              <p className="mt-2 text-sm text-text-secondary">
                Tweak resonance chroma and broadcast across the Spotify skin.
              </p>
            </div>
            <button className="rounded-full bg-surface-base/70 px-3 py-1 text-xs text-text-secondary transition hover:text-text-primary">
              Export Tokens
            </button>
          </header>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {palette.map((swatch) => (
              <div
                key={swatch.token}
                className="group flex flex-col gap-3 rounded-2xl border border-border-subtle/30 bg-surface-base/80 p-4 transition hover:border-accent-primary/40"
              >
                <div
                  className="h-24 w-full rounded-2xl shadow-inner"
                  style={{ background: swatch.hex }}
                />
                <div className="space-y-1 text-sm">
                  <p className="font-medium text-text-primary">{swatch.token}</p>
                  <p className="text-xs uppercase tracking-[0.32em] text-text-muted">
                    {swatch.hex}
                  </p>
                  <p className="text-xs text-text-secondary">{swatch.usage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-border-subtle/40 bg-surface-sunken/60 p-6">
          <h2 className="text-lg font-semibold text-text-primary">Motion + Glow</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-border-subtle/40 bg-surface-base/70 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-text-muted">Hover Glow</p>
              <p className="mt-2 text-sm text-text-secondary">
                450ms • cubic-bezier(0.22, 1, 0.36, 1)
              </p>
              <div className="via-aura-DEFAULT/20 to-pulse-DEFAULT/30 mt-3 h-24 rounded-2xl bg-gradient-to-br from-accent-primary/30" />
            </div>
            <div className="rounded-2xl border border-border-subtle/40 bg-surface-base/70 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-text-muted">Parallax Depth</p>
              <p className="mt-2 text-sm text-text-secondary">18 layers engaged</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["depth-02", "depth-08", "depth-18"].map((depth) => (
                  <span
                    key={depth}
                    className="rounded-full border border-border-subtle/30 px-3 py-1 text-xs uppercase tracking-[0.28em] text-text-muted"
                  >
                    {depth}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <div className="rounded-3xl border border-border-subtle/40 bg-surface-raised/80 p-6">
          <h2 className="text-lg font-semibold text-text-primary">Spotify Sync</h2>
          <p className="mt-2 text-sm text-text-secondary">
            Real-time uplink from Theme Studio to device skins.
          </p>
          <ol className="mt-4 space-y-3 text-sm text-text-secondary">
            {spotifySync.map((step, index) => (
              <li
                key={step.step}
                className="rounded-2xl border border-border-subtle/30 bg-surface-base/60 p-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-raised/80 text-xs font-medium text-text-muted">
                      {index + 1}
                    </span>
                    <span className="font-medium text-text-primary">{step.step}</span>
                  </div>
                  <span className="text-aura-DEFAULT text-xs">{step.status}</span>
                </div>
              </li>
            ))}
          </ol>
          <button className="to-pulse-DEFAULT mt-5 w-full rounded-full bg-gradient-to-r from-accent-primary px-4 py-2 text-sm font-semibold text-surface-base shadow-md shadow-accent-primary/30 transition hover:shadow-xl">
            Push to Spotify
          </button>
        </div>
        <div className="rounded-3xl border border-border-subtle/40 bg-surface-sunken/70 p-6">
          <h2 className="text-lg font-semibold text-text-primary">Theme Notes</h2>
          <p className="mt-2 text-sm text-text-secondary">
            Tie your palette to Codex memories and Arcadia broadcasts.
          </p>
          <div className="mt-3 space-y-2 text-sm text-text-muted">
            <p>• Figma export linked 18 tokens.</p>
            <p>• Pod Studio using palette v2.3.</p>
            <p>• Witness briefs auto-update badges.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
