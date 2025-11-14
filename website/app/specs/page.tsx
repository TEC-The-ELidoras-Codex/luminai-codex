import Link from "next/link";

import { PageShell } from "@/components/layout/PageShell";
import { listScreens, screenRouteToSlug } from "@/lib/screens";

export default function SpecsIndexPage() {
  const screens = listScreens();
  return (
    <PageShell
      title="Screen Specs"
      summary="Render the deterministic FigJam exports directly as layout references."
    >
      <div className="grid gap-6 md:grid-cols-2">
        {screens.map((screen) => (
          <Link
            key={screen.id}
            href={`/specs/${screenRouteToSlug(screen.route)}`}
            className="group rounded-3xl border border-border-subtle/60 bg-surface-raised/50 p-6 transition hover:border-accent-primary/50 hover:shadow-lg"
          >
            <p className="text-xs uppercase tracking-[0.32em] text-text-muted">{screen.route}</p>
            <h2 className="mt-3 text-2xl font-semibold text-text-primary">{screen.name}</h2>
            <p className="mt-2 text-sm text-text-secondary">{screen.summary}</p>
            <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.28em] text-text-muted">
              <span>{screen.sections.length} sections</span>
              <span>
                Grid {screen.grid.columns}×{screen.grid.rows}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
