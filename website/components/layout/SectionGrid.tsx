import type { ReactNode } from "react";

import type { ScreenSpec, SectionSpec } from "@/lib/screen-schema";

interface SectionGridProps {
  readonly screen: ScreenSpec;
  readonly renderSection?: (section: SectionSpec) => ReactNode;
}

const defaultRender = (section: SectionSpec) => <SectionCard key={section.id} section={section} />;

export function SectionGrid({ screen, renderSection = defaultRender }: SectionGridProps) {
  return (
    <div
      className="relative grid w-full gap-6"
      style={{
        gridTemplateColumns: `repeat(${screen.grid.columns}, minmax(0, 1fr))`,
        gridAutoRows: "minmax(120px, auto)",
      }}
    >
      {screen.sections.map((section) => {
        const colStart = Math.max(1, Math.round(section.layout.x + 1));
        const colSpan = Math.max(1, Math.round(section.layout.w));
        const rowStart = Math.max(1, Math.round(section.layout.y + 1));
        const rowSpan = Math.max(1, Math.round(section.layout.h));
        return (
          <div
            key={section.id}
            className="min-h-[160px]"
            style={{
              gridColumn: `${colStart} / span ${colSpan}`,
              gridRow: `${rowStart} / span ${rowSpan}`,
            }}
          >
            {renderSection(section)}
          </div>
        );
      })}
      <GridOverlay grid={screen.grid} />
    </div>
  );
}

interface SectionCardProps {
  readonly section: SectionSpec;
}

export function SectionCard({ section }: SectionCardProps) {
  return (
    <div className="shadow-aura-DEFAULT/20 relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-border-subtle/60 bg-surface-raised/70 p-6 shadow-sm">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-surface-raised/40 via-transparent to-surface-base/20" />
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.24em] text-text-muted">{section.id}</p>
          <h2 className="text-xl font-semibold text-text-primary">{section.label}</h2>
          <p className="text-sm text-text-secondary">{section.description}</p>
        </div>
        <span className="rounded-full border border-border-subtle/50 px-3 py-1 text-xs text-text-muted">
          {section.layout.w}×{section.layout.h}
        </span>
      </div>
      <div className="mt-auto flex flex-wrap gap-2">
        {section.components.map((component) => (
          <span
            key={component}
            className="inline-flex items-center gap-2 rounded-full border border-accent-primary/30 bg-accent-primary/10 px-3 py-1 text-xs font-medium text-accent-primary"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent-primary" aria-hidden />
            {component}
          </span>
        ))}
      </div>
    </div>
  );
}

interface GridOverlayProps {
  readonly grid: ScreenSpec["grid"];
}

function GridOverlay({ grid }: GridOverlayProps) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 grid gap-6 opacity-[0.04]"
      style={{ gridTemplateColumns: `repeat(${grid.columns}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: grid.columns }).map((_, index) => (
        <div key={index} className="rounded-lg border border-dashed border-text-primary/40" />
      ))}
    </div>
  );
}
