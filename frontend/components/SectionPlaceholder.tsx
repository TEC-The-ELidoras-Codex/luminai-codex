import React from "react";

export default function SectionPlaceholder({ section }: { section: any }) {
  return (
    <div className="rounded-lg border border-gray-700 p-4 bg-gradient-to-br from-[#0f1724] to-[#11121a]">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-sm text-cyan-300">{section.label}</div>
          <div className="text-xs text-gray-400">{section.description}</div>
        </div>
        <div className="text-xs text-gray-500">{section.id}</div>
      </div>
      <div className="mt-2 text-sm text-gray-300">
        Components: {section.components?.join(", ") || "—"}
      </div>
    </div>
  );
}
