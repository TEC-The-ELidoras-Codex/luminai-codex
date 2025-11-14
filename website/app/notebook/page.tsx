import { ArcShell } from "@/components/layout/ArcShell";
import { NotebookSurface } from "@/components/surfaces/NotebookSurface";
import { ScreenSpecLink } from "@/components/surfaces/ScreenSpecLink";
import { GridBadge, PrimaryActions, ReferenceList } from "@/components/surfaces/ScreenView";
import { requireScreen } from "@/lib/screens";

const screen = requireScreen("/notebook");

export default function NotebookPage() {
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
        support={<NotebookSupport />}
      >
        <NotebookSurface />
      </ArcShell>
      <ReferenceList references={screen.references} />
    </div>
  );
}

function NotebookSupport() {
  return (
    <aside className="rounded-3xl border border-border-subtle/50 bg-surface-sunken/70 p-5 text-sm text-text-secondary shadow-lg shadow-surface-base/30">
      <h2 className="text-xs uppercase tracking-[0.32em] text-text-muted">Implementation Notes</h2>
      <p className="mt-3">
        Notebook canvas spans nine columns. When you wire this to the Airth Research Guard, stream
        TGCR calculations via the
        <code className="mx-1 rounded bg-surface-base/60 px-1.5 py-0.5 text-[0.65rem]">
          EquationBlock
        </code>
        placeholder and hydrate reasoning cards from the guard’s step trace.
      </p>
      <p className="mt-3">
        Keep transcript filters keyed to persona IDs so the witness filter toggles remain in sync
        with Harmony presence updates. Pin export buttons to shared storage so Notebook links drop
        directly into Arcadia Portal workflows.
      </p>
    </aside>
  );
}
