import { ArcShell } from "@/components/layout/ArcShell";
import { MapSurface } from "@/components/surfaces/MapSurface";
import { ScreenSpecLink } from "@/components/surfaces/ScreenSpecLink";
import { GridBadge, PrimaryActions, ReferenceList } from "@/components/surfaces/ScreenView";
import { requireScreen } from "@/lib/screens";

const screen = requireScreen("/map");

export default function MapPage() {
  return (
    <div className="space-y-10">
      <ArcShell
        title={screen.name}
        subtitle={screen.summary}
        hero={<GridBadge screen={screen} />}
        actions={
          <>
            <PrimaryActions actions={screen.primary_actions} />
            <ScreenSpecLink route={screen.route} />
          </>
        }
        support={<MapSupport />}
      >
        <MapSurface />
      </ArcShell>
      <ReferenceList references={screen.references} />
    </div>
  );
}

function MapSupport() {
  return (
    <aside className="rounded-3xl border border-border-subtle/50 bg-surface-sunken/70 p-5 text-sm text-text-secondary shadow-lg shadow-surface-base/30">
      <h2 className="text-xs uppercase tracking-[0.32em] text-text-muted">Graph Hooks</h2>
      <p className="mt-3">
        Connect the graph canvas to your choice of graph library (Sigma, D3, or Kin) and project
        Harmony trace IDs onto nodes so cross-surface lookups stay consistent.
      </p>
      <p className="mt-3">
        Frequency panel should stream meter data every five seconds. Use the
        <code className="mx-1 rounded bg-surface-base/60 px-1.5 py-0.5 text-[0.65rem]">
          SendToChatButton
        </code>
        placeholder to fire curated nodes back into the chat composer or notebook export pipeline.
      </p>
    </aside>
  );
}
