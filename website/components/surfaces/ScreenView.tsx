import type { ReactNode } from "react";

import { PageShell } from "@/components/layout/PageShell";
import { SectionGrid } from "@/components/layout/SectionGrid";
import type { ScreenSpec } from "@/lib/screen-schema";

interface ScreenViewProps {
  readonly screen: ScreenSpec;
  readonly supportContent?: ReactNode;
}

export function ScreenView({ screen, supportContent }: ScreenViewProps) {
  return (
    <PageShell
      title={screen.name}
      summary={screen.summary}
      accent={<GridBadge screen={screen} />}
      actions={<PrimaryActions actions={screen.primary_actions} />}
    >
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1">
          <SectionGrid screen={screen} />
        </div>
        {supportContent ? (
          <aside className="sticky top-28 h-max rounded-3xl border border-border-subtle/50 bg-surface-sunken/70 p-6 text-sm text-text-secondary shadow-lg shadow-surface-base/20">
            {supportContent}
          </aside>
        ) : null}
      </div>
      <ReferenceList references={screen.references} />
    </PageShell>
  );
}

export function GridBadge({ screen }: { readonly screen: ScreenSpec }) {
  const { columns, rows, column_width: columnWidth, gutter, margin } = screen.grid;
  return (
    <dl className="grid grid-cols-2 gap-3 rounded-2xl border border-border-subtle/60 bg-surface-base/80 p-4 text-xs text-text-secondary">
      <div>
        <dt className="uppercase tracking-[0.3em] text-text-muted">Columns</dt>
        <dd className="text-lg font-semibold text-text-primary">{columns}</dd>
      </div>
      <div>
        <dt className="uppercase tracking-[0.3em] text-text-muted">Rows</dt>
        <dd className="text-lg font-semibold text-text-primary">{rows}</dd>
      </div>
      <div>
        <dt className="uppercase tracking-[0.3em] text-text-muted">Column Width</dt>
        <dd className="text-lg font-semibold text-text-primary">{columnWidth}px</dd>
      </div>
      <div>
        <dt className="uppercase tracking-[0.3em] text-text-muted">Gutter</dt>
        <dd className="text-lg font-semibold text-text-primary">{gutter}px</dd>
      </div>
      <div className="col-span-2">
        <dt className="uppercase tracking-[0.3em] text-text-muted">Margin</dt>
        <dd className="text-lg font-semibold text-text-primary">{margin}px</dd>
      </div>
    </dl>
  );
}

export function PrimaryActions({ actions }: { readonly actions: readonly string[] }) {
  if (actions.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {actions.map((action) => (
        <span
          key={action}
          className="rounded-full border border-accent-primary/30 bg-accent-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.28em] text-accent-primary"
        >
          {action}
        </span>
      ))}
    </div>
  );
}

const REPO_BASE = "https://github.com/TEC-The-ELidoras-Codex/luminai-codex/blob/main/";

export function ReferenceList({ references }: { readonly references: readonly string[] }) {
  if (references.length === 0) return null;
  return (
    <div className="rounded-3xl border border-border-subtle/60 bg-surface-raised/60 p-6 text-sm text-text-secondary">
      <h2 className="text-lg font-semibold text-text-primary">Documentation Links</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5">
        {references.map((reference) => (
          <li key={reference} className="hover:text-text-primary">
            <a
              href={`${REPO_BASE}${reference}`}
              target="_blank"
              rel="noreferrer"
              className="underline decoration-dotted underline-offset-4"
            >
              {reference}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
