"use client";

import React, { useState } from "react";

interface RetentionSettingsProps {
  onComplete: (retention: "minimal" | "standard" | "full") => void;
}

const RETENTION_OPTIONS = [
  {
    value: "minimal" as const,
    label: "Minimal",
    duration: "7 days",
    icon: "🌊",
    description: "Session data deleted after 7 days. Perfect for privacy-focused users.",
    details: [
      "Session transcripts deleted after 7 days",
      "Only aggregated metrics kept (anonymous)",
      "User profile deleted after 90 days inactive",
    ],
  },
  {
    value: "standard" as const,
    label: "Standard",
    duration: "30 days",
    icon: "📦",
    description: "Session summaries kept for 30 days, then anonymized.",
    details: [
      "Full transcripts deleted after 7 days",
      "Session summaries kept for 30 days",
      "User profile anonymized after 1 year inactive",
    ],
  },
  {
    value: "full" as const,
    label: "Full Archive",
    duration: "Forever (until you delete)",
    icon: "🗄️",
    description: "Keep your session archives. You control deletion manually.",
    details: [
      "All session data preserved indefinitely",
      "Export anytime via Settings",
      "Delete manually whenever you want",
    ],
  },
];

/**
 * RetentionSettings — User chooses data retention policy
 *
 * Part of the User Data Anonymization Framework:
 * - User controls how long data is kept
 * - Clear deletion schedules
 * - Can change anytime in settings
 */
export default function RetentionSettings({ onComplete }: RetentionSettingsProps) {
  const [selected, setSelected] = useState<"minimal" | "standard" | "full">("minimal");

  const handleConfirm = () => {
    onComplete(selected);
  };

  return (
    <div className="flex flex-col gap-6 p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl border border-cyan-500/30 shadow-lg shadow-cyan-500/10">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-cyan-400">Data Retention</h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          How long should we keep your session data?
          <br />
          <span className="text-slate-500">You can change this anytime in Settings.</span>
        </p>
      </div>

      {/* Retention Options */}
      <div className="flex flex-col gap-4">
        {RETENTION_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => setSelected(option.value)}
            className={`flex flex-col gap-3 p-5 rounded-xl text-left transition-all ${
              selected === option.value
                ? "bg-cyan-500/20 border-2 border-cyan-500 shadow-lg shadow-cyan-500/20"
                : "bg-slate-800 border border-slate-700 hover:border-cyan-500/50"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{option.icon}</span>
                <div>
                  <div className="font-bold text-lg text-slate-200">{option.label}</div>
                  <div className="text-xs text-slate-500">{option.duration}</div>
                </div>
              </div>
              {selected === option.value && (
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500">
                  <span className="text-slate-900 text-sm">✓</span>
                </div>
              )}
            </div>
            <p className="text-sm text-slate-400">{option.description}</p>
            <ul className="flex flex-col gap-1 text-xs text-slate-500">
              {option.details.map((detail, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-cyan-500 mt-0.5">•</span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </button>
        ))}
      </div>

      {/* Confirm Button */}
      <button
        onClick={handleConfirm}
        className="w-full px-4 py-3 bg-cyan-500 text-slate-900 rounded-lg font-semibold hover:bg-cyan-400 transition-all"
      >
        Complete Setup
      </button>

      {/* GDPR Notice */}
      <div className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg">
        <p className="text-xs text-slate-500 leading-relaxed">
          📜 <span className="font-semibold text-slate-400">Your rights:</span> Regardless of retention choice,
          you can always export or delete your data via Settings. We comply with GDPR, CCPA, and COPPA.
        </p>
      </div>
    </div>
  );
}
