import type { DashboardPayload } from "@/lib/types/resonance";

interface DashboardSurfaceProps {
  readonly data: DashboardPayload;
}

export function DashboardSurface({ data }: DashboardSurfaceProps) {
  return (
    <section className="flex flex-col gap-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {data.metrics.map((metric) => (
          <article
            key={metric.label}
            className="shadow-aura-DEFAULT/20 rounded-3xl border border-border-subtle/40 bg-surface-raised/80 p-6 shadow-md"
          >
            <header className="text-xs uppercase tracking-[0.32em] text-text-muted">
              {metric.label}
            </header>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-4xl font-semibold text-text-primary">{metric.value}</span>
              <span className="text-aura-DEFAULT text-xs">{metric.trend}</span>
            </div>
            <p className="mt-2 text-sm text-text-secondary">{metric.descriptor}</p>
          </article>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="rounded-3xl border border-border-subtle/40 bg-surface-raised/70 p-6 shadow-lg">
          <header className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-text-primary">Command Queue</h2>
              <p className="text-sm text-text-secondary">Prioritize resonance actions</p>
            </div>
            <button className="rounded-full border border-border-subtle/40 bg-surface-base/80 px-4 py-2 text-xs text-text-secondary transition hover:text-text-primary">
              Automate
            </button>
          </header>
          <ul className="mt-6 space-y-4">
            {data.queue.map((item) => (
              <li
                key={item.id}
                className="rounded-3xl border border-border-subtle/40 bg-surface-base/60 p-4"
              >
                <header className="flex items-center justify-between text-xs uppercase tracking-[0.28em] text-text-muted">
                  <span>{item.id}</span>
                  <span>{item.status}</span>
                </header>
                <h3 className="mt-3 text-lg font-semibold text-text-primary">{item.title}</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.actions.map((action) => (
                    <button
                      key={action}
                      className="rounded-full border border-border-subtle/40 bg-surface-raised/70 px-4 py-1 text-xs uppercase tracking-[0.32em] text-text-secondary transition hover:border-accent-primary/40 hover:text-text-primary"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-4">
          <div className="rounded-3xl border border-border-subtle/40 bg-surface-base/60 p-6">
            <h2 className="text-lg font-semibold text-text-primary">System Status</h2>
            <ul className="mt-3 space-y-2 text-sm text-text-secondary">
              {data.systemStatus.map((status) => (
                <li key={status}>• {status}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-border-subtle/40 bg-surface-base/60 p-6">
            <h2 className="text-lg font-semibold text-text-primary">Witness Feed</h2>
            <div className="mt-4 space-y-3 text-sm text-text-secondary">
              {data.witnessFeed.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
