import { ArcShell } from "@/components/layout/ArcShell";
import { ChatSurface } from "@/components/surfaces/ChatSurface";
import { ScreenSpecLink } from "@/components/surfaces/ScreenSpecLink";
import { GridBadge, PrimaryActions, ReferenceList } from "@/components/surfaces/ScreenView";
import { requireScreen } from "@/lib/screens";

const screen = requireScreen("/chat");

export default function ChatPage() {
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
        support={<ChatSupport />}
      >
        <ChatSurface />
      </ArcShell>
      <ReferenceList references={screen.references} />
    </div>
  );
}

function ChatSupport() {
  return (
    <aside className="rounded-3xl border border-border-subtle/50 bg-surface-sunken/70 p-5 text-sm text-text-secondary shadow-lg shadow-surface-base/30">
      <h2 className="text-xs uppercase tracking-[0.32em] text-text-muted">Live Wiring Tips</h2>
      <p className="mt-3">
        Bind the chat stream to the Resonance Engine websocket. Each
        <strong> ChatBubble</strong> maps to the witness persona array in the JSON skeleton. Mirror
        citations with Codex Hub search results so badge taps jump directly into the notebook
        drawer.
      </p>
      <p className="mt-3">
        The composer lives on a 1.5-row span. Reserve the final 6rem of the viewport for ritual
        controls and keep the upload/mic buttons as discrete commands within Harmony’s Echo
        Protocol.
      </p>
    </aside>
  );
}
