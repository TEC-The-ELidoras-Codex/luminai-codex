import { PresenceRail } from "@/components/common/PresenceRail";
import { ArcShell } from "@/components/layout/ArcShell";
import { DashboardSurface } from "@/components/surfaces/DashboardSurface";
import { ScreenSpecLink } from "@/components/surfaces/ScreenSpecLink";
import { GridBadge, PrimaryActions, ReferenceList } from "@/components/surfaces/ScreenView";
import { fetchDashboardPayload } from "@/lib/api-client";
import { requireScreen } from "@/lib/screens";

const screen = requireScreen("/dashboard");

export default async function DashboardPage() {
  const dashboardData = await fetchDashboardPayload();
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
        rail={<PresenceRail personas={dashboardData.personaPresence} />}
        support={<DashboardSupport />}
      >
        <DashboardSurface data={dashboardData} />
      </ArcShell>
      <ReferenceList references={screen.references} />
    </div>
  );
}

function DashboardSupport() {
  return (
    <aside className="rounded-3xl border border-border-subtle/50 bg-surface-sunken/70 p-5 text-sm text-text-secondary shadow-lg shadow-surface-base/30">
      <h2 className="text-xs uppercase tracking-[0.32em] text-text-muted">Integration Notes</h2>
      <p className="mt-3">
        The dashboard spec favors three hero CTAs across a full-width band. Map them directly to
        Harmony endpoint triggers: <strong>/chat</strong>,<strong>/pod</strong>, and{" "}
        <strong>/map</strong>. The session cards should hydrate from Codex Hub’s recent memory
        index, while recommendations pull from the curated ritual feed.
      </p>
      <p className="mt-3">
        Use the persona usage metrics as an asynchronous module-metric call so the sparkline
        animates independently of the hero render. The grid target here is 12×12 with generous
        margins, so tie Tailwind container padding to the exported {screen.grid.margin}px value if
        you build a responsive variant.
      </p>
    </aside>
  );
}
