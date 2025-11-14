import { ArcShell } from "@/components/layout/ArcShell";
import { ScreenSpecLink } from "@/components/surfaces/ScreenSpecLink";
import { GridBadge, PrimaryActions, ReferenceList } from "@/components/surfaces/ScreenView";
import { ThemeSurface } from "@/components/surfaces/ThemeSurface";
import { requireScreen } from "@/lib/screens";

const screen = requireScreen("/theme");

export default function ThemePage() {
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
        support={<ThemeSupport />}
      >
        <ThemeSurface />
      </ArcShell>
      <ReferenceList references={screen.references} />
    </div>
  );
}

function ThemeSupport() {
  return (
    <aside className="rounded-3xl border border-border-subtle/50 bg-surface-sunken/70 p-5 text-sm text-text-secondary shadow-lg shadow-surface-base/30">
      <h2 className="text-xs uppercase tracking-[0.32em] text-text-muted">Shader Hooks</h2>
      <p className="mt-3">
        Map theme tiles to configuration payloads stored in
        <code className="mx-1 rounded bg-surface-base/60 px-1.5 py-0.5 text-[0.65rem]">
          design_tokens.json
        </code>
        . When a curator uploads a custom background, persist metadata to Codex Hub so every surface
        can sync updated halos.
      </p>
      <p className="mt-3">
        Controls panel expects real-time preview updates. Pipe slider deltas to Framer Motion or
        shader uniforms, and keep the chat/notebook preview components reading from the same theme
        context.
      </p>
    </aside>
  );
}
