import React from "react";
import screen01 from "../../../design/figma/exports/RESONANCE_SCR-01_CHAT_SKEL_struct.json";
import SectionPlaceholder from "../components/SectionPlaceholder";

const spec: any = screen01;

export default function Page() {
  const sections = spec.sections || [];

  // Render a simple placeholder grid using Tailwind
  return (
    <main className="p-10">
      <h1 className="text-3xl font-semibold mb-6">
        LuminAI Wireframe — {spec.name}
      </h1>

      <div className="grid grid-cols-12 gap-4">
        {sections.map((s: any) => (
          <div
            key={s.id}
            className={`col-span-${Math.max(
              1,
              Math.round(s.layout.w)
            )} row-span-1`}
          >
            <SectionPlaceholder section={s} />
          </div>
        ))}
      </div>
    </main>
  );
}
