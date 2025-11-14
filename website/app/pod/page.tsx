import { ArcShell } from "@/components/layout/ArcShell";
import { PodcastSurface } from "@/components/surfaces/PodcastSurface";
import { ScreenSpecLink } from "@/components/surfaces/ScreenSpecLink";
import { GridBadge, PrimaryActions, ReferenceList } from "@/components/surfaces/ScreenView";
import { requireScreen } from "@/lib/screens";

const screen = requireScreen("/pod");

export default function PodPage() {
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
        support={<PodcastSupport />}
      >
        <PodcastSurface />
      </ArcShell>
      <ReferenceList references={screen.references} />
    </div>
  );
}

function PodcastSupport() {
  return (
    <aside className="rounded-3xl border border-border-subtle/50 bg-surface-sunken/70 p-5 text-sm text-text-secondary shadow-lg shadow-surface-base/30">
      <h2 className="text-xs uppercase tracking-[0.32em] text-text-muted">Sonic Notes</h2>
      <p className="mt-3">
        The waveform player occupies the top four rows. Wire it to your preferred audio service and
        mirror transcript toggles with the Notebook API so script edits stay in sync.
      </p>
      <p className="mt-3">
        ElevenLabs toggles belong in the voice control column. Keep the resonance meter streaming
        real-time amplitude data to match the creative decisions within the script builder.
      </p>
    </aside>
  );
}
