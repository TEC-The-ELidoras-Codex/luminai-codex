"use client";

import React, { useState } from "react";

interface MonikerPickerProps {
  onSelect: (moniker: string) => void;
  initialValue?: string;
}

const SUGGESTED_MONIKERS = [
  "StarGazer", "CodeWanderer", "ThoughtWeaver", "QuantumDreamer",
  "EchoSeeker", "NightRunner", "CipherSage", "VoidWhisperer",
  "DataDancer", "ResonanceRider", "PixelPoet", "ShadowScribe"
];

/**
 * MonikerPicker — User chooses an anonymous display name
 *
 * Part of the User Data Anonymization Framework:
 * - No real names required
 * - User-chosen pseudonym for all sessions
 * - Can be changed anytime in settings
 */
export default function MonikerPicker({ onSelect, initialValue = "" }: MonikerPickerProps) {
  const [moniker, setMoniker] = useState(initialValue);
  const [customMode, setCustomMode] = useState(!!initialValue);

  const generateRandom = () => {
    const random = SUGGESTED_MONIKERS[Math.floor(Math.random() * SUGGESTED_MONIKERS.length)];
    const suffix = Math.floor(Math.random() * 999);
    const generated = `${random}${suffix}`;
    setMoniker(generated);
    setCustomMode(false);
    return generated;
  };

  const handleConfirm = () => {
    const finalMoniker = moniker.trim() || generateRandom();
    onSelect(finalMoniker);
  };

  return (
    <div className="flex flex-col gap-6 p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl border border-cyan-500/30 shadow-lg shadow-cyan-500/10">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-cyan-400">Choose Your Moniker</h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          Choose a name you'll use in sessions. This is how the platform will address you.
          <br />
          <span className="text-slate-500">Your real name is never required. You can change this anytime.</span>
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {customMode ? (
          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-400">Custom Moniker</label>
            <input
              type="text"
              value={moniker}
              onChange={(e) => setMoniker(e.target.value)}
              placeholder="Enter your chosen name..."
              maxLength={50}
              className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500">{moniker.length}/50 characters</span>
              <button
                onClick={() => setCustomMode(false)}
                className="text-xs text-cyan-400 hover:text-cyan-300 underline"
              >
                Use suggested instead
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-400">Suggested Monikers</label>
            <div className="grid grid-cols-2 gap-2">
              {SUGGESTED_MONIKERS.slice(0, 6).map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setMoniker(`${suggestion}${Math.floor(Math.random() * 999)}`)}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${
                    moniker.startsWith(suggestion)
                      ? "bg-cyan-500 text-slate-900 font-semibold"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                  }`}
                >
                  {suggestion}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCustomMode(true)}
              className="mt-2 text-xs text-cyan-400 hover:text-cyan-300 underline self-start"
            >
              Enter custom name
            </button>
          </div>
        )}

        <div className="flex gap-3 mt-4">
          <button
            onClick={generateRandom}
            className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-700 hover:border-cyan-500/50 transition-all flex items-center justify-center gap-2"
          >
            <span>✨</span>
            <span>Generate Random</span>
          </button>
          <button
            onClick={handleConfirm}
            disabled={!moniker.trim()}
            className="flex-1 px-4 py-3 bg-cyan-500 text-slate-900 rounded-lg font-semibold hover:bg-cyan-400 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed transition-all"
          >
            Continue
          </button>
        </div>
      </div>

      {moniker && (
        <div className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg">
          <p className="text-sm text-slate-400">
            Preview: <span className="text-cyan-400 font-semibold">{moniker}</span>
          </p>
        </div>
      )}
    </div>
  );
}
