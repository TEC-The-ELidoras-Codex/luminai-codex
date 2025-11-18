"use client";

import React, { useState } from "react";

interface DemographicData {
  ageBand: string | null;
  regionBand: string | null;
}

interface DemographicBandsProps {
  onContinue: (data: DemographicData) => void;
  onSkip: () => void;
}

const AGE_BANDS = [
  { value: "Under 13", label: "Under 13", description: "Youth mode with COPPA protection" },
  { value: "13-17", label: "13-17", description: "Teen mode" },
  { value: "18-42", label: "18-42", description: "Primary adult demographic" },
  { value: "43-65", label: "43-65", description: "Secondary adult demographic" },
  { value: "65+", label: "65+", description: "Senior demographic" },
];

const REGION_BANDS = [
  { value: "Western US", label: "Western US", emoji: "🌊" },
  { value: "Mountain US", label: "Mountain US", emoji: "⛰️" },
  { value: "Central US", label: "Central US", emoji: "🌾" },
  { value: "Eastern US", label: "Eastern US", emoji: "🏙️" },
  { value: "EU", label: "Europe", emoji: "🇪🇺" },
  { value: "Canada", label: "Canada", emoji: "🇨🇦" },
  { value: "Other", label: "Other", emoji: "🌍" },
];

/**
 * DemographicBands — Optional aggregated demographic collection
 *
 * Part of the User Data Anonymization Framework:
 * - Broad bands only (no specific ages/locations)
 * - Fully optional (can skip entirely)
 * - Used only for aggregated analytics if user consents
 */
export default function DemographicBands({ onContinue, onSkip }: DemographicBandsProps) {
  const [ageBand, setAgeBand] = useState<string | null>(null);
  const [regionBand, setRegionBand] = useState<string | null>(null);

  const handleContinue = () => {
    onContinue({ ageBand, regionBand });
  };

  return (
    <div className="flex flex-col gap-6 p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl border border-cyan-500/30 shadow-lg shadow-cyan-500/10">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-cyan-400">Demographics (Optional)</h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          To improve our service, we collect <span className="text-cyan-400 font-semibold">broad demographic bands</span> (not specific info).
          <br />
          <span className="text-slate-500">All data is anonymized and aggregated. You can skip this entirely.</span>
        </p>
      </div>

      {/* Age Band Selection */}
      <div className="flex flex-col gap-3">
        <label className="text-sm text-slate-400 font-semibold">Age Range</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {AGE_BANDS.map((band) => (
            <button
              key={band.value}
              onClick={() => setAgeBand(band.value)}
              className={`px-4 py-3 rounded-lg text-left transition-all ${
                ageBand === band.value
                  ? "bg-cyan-500 text-slate-900 border-2 border-cyan-400"
                  : "bg-slate-800 text-slate-300 border border-slate-700 hover:border-cyan-500/50"
              }`}
            >
              <div className="font-semibold">{band.label}</div>
              <div className={`text-xs mt-1 ${ageBand === band.value ? "text-slate-900/70" : "text-slate-500"}`}>
                {band.description}
              </div>
            </button>
          ))}
        </div>
        {ageBand && (
          <button
            onClick={() => setAgeBand(null)}
            className="text-xs text-slate-500 hover:text-cyan-400 self-start"
          >
            Clear selection
          </button>
        )}
      </div>

      {/* Region Band Selection */}
      <div className="flex flex-col gap-3">
        <label className="text-sm text-slate-400 font-semibold">Region</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {REGION_BANDS.map((region) => (
            <button
              key={region.value}
              onClick={() => setRegionBand(region.value)}
              className={`px-4 py-3 rounded-lg text-center transition-all ${
                regionBand === region.value
                  ? "bg-cyan-500 text-slate-900 border-2 border-cyan-400"
                  : "bg-slate-800 text-slate-300 border border-slate-700 hover:border-cyan-500/50"
              }`}
            >
              <div className="text-2xl mb-1">{region.emoji}</div>
              <div className="text-sm font-semibold">{region.label}</div>
            </button>
          ))}
        </div>
        {regionBand && (
          <button
            onClick={() => setRegionBand(null)}
            className="text-xs text-slate-500 hover:text-cyan-400 self-start"
          >
            Clear selection
          </button>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-4 pt-6 border-t border-slate-700">
        <button
          onClick={onSkip}
          className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-400 hover:text-slate-300 hover:border-slate-600 transition-all"
        >
          Skip This Step
        </button>
        <button
          onClick={handleContinue}
          className="flex-1 px-4 py-3 bg-cyan-500 text-slate-900 rounded-lg font-semibold hover:bg-cyan-400 transition-all"
        >
          Continue
        </button>
      </div>

      {/* Privacy Notice */}
      <div className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg">
        <p className="text-xs text-slate-500 leading-relaxed">
          🔒 <span className="font-semibold text-slate-400">Privacy guarantee:</span> We never store specific ages or locations.
          This data is aggregated with thousands of other users and used only to improve platform features.
        </p>
      </div>
    </div>
  );
}
