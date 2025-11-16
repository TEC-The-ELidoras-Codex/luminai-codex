"use client";

import React, { useState } from "react";
import MonikerPicker from "@/components/onboarding/MonikerPicker";
import DemographicBands from "@/components/onboarding/DemographicBands";
import RetentionSettings from "@/components/onboarding/RetentionSettings";

interface OnboardingData {
  moniker: string;
  ageBand: string | null;
  regionBand: string | null;
  retention: "minimal" | "standard" | "full";
}

/**
 * OnboardingFlow — Complete user onboarding with anonymization
 *
 * Steps:
 * 1. Choose moniker (required)
 * 2. Demographics (optional, broad bands only)
 * 3. Data retention preferences
 * 4. Create user profile via API
 */
export default function OnboardingFlow() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Partial<OnboardingData>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const handleMonikerSelect = (moniker: string) => {
    setData({ ...data, moniker });
    setStep(2);
  };

  const handleDemographicsContinue = (demographics: {
    ageBand: string | null;
    regionBand: string | null;
  }) => {
    setData({ ...data, ...demographics });
    setStep(3);
  };

  const handleDemographicsSkip = () => {
    setData({ ...data, ageBand: null, regionBand: null });
    setStep(3);
  };

  const handleRetentionComplete = async (retention: "minimal" | "standard" | "full") => {
    setData({ ...data, retention });
    setLoading(true);
    setError(null);

    try {
      // Create user profile via API
      const response = await fetch("http://localhost:8000/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moniker: data.moniker,
          demographics:
            data.ageBand || data.regionBand
              ? {
                  age_band: data.ageBand,
                  region_band: data.regionBand,
                }
              : null,
          data_retention: retention,
          consent_analytics: false, // Default to opt-out
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create profile: ${response.statusText}`);
      }

      const profile = await response.json();
      setUserId(profile.user_id);
      setStep(4); // Success screen
    } catch (err: any) {
      setError(err.message || "Failed to create profile. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="w-full max-w-2xl">
        {/* Progress indicator */}
        <div className="mb-8 flex justify-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 w-16 rounded-full transition-all ${
                s <= step ? "bg-cyan-500" : "bg-slate-700"
              }`}
            />
          ))}
        </div>

        {/* Step content */}
        {step === 1 && <MonikerPicker onSelect={handleMonikerSelect} />}

        {step === 2 && (
          <DemographicBands
            onContinue={handleDemographicsContinue}
            onSkip={handleDemographicsSkip}
          />
        )}

        {step === 3 && <RetentionSettings onComplete={handleRetentionComplete} />}

        {step === 4 && (
          <div className="flex flex-col gap-6 rounded-xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 shadow-lg shadow-cyan-500/10">
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500">
                <span className="text-3xl">✓</span>
              </div>
              <h2 className="text-2xl font-bold text-cyan-400">Welcome, {data.moniker}!</h2>
              <p className="text-center text-slate-400">
                Your profile has been created. You're ready to start exploring.
              </p>

              <div className="mt-4 rounded-lg border border-slate-700 bg-slate-800/50 p-4 text-sm text-slate-400">
                <div className="mb-2 font-semibold text-cyan-400">Your Privacy Settings:</div>
                <div>
                  • Moniker: <span className="text-slate-300">{data.moniker}</span>
                </div>
                <div>
                  • Age Band:{" "}
                  <span className="text-slate-300">{data.ageBand || "Not provided"}</span>
                </div>
                <div>
                  • Region:{" "}
                  <span className="text-slate-300">{data.regionBand || "Not provided"}</span>
                </div>
                <div>
                  • Retention: <span className="text-slate-300">{data.retention}</span>
                </div>
                <div className="mt-2 text-xs text-slate-500">User ID: {userId}</div>
              </div>

              <button
                onClick={() => (window.location.href = "/chat")}
                className="mt-4 rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-slate-900 transition-all hover:bg-cyan-400"
              >
                Start Chatting
              </button>
            </div>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col gap-4 rounded-xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
            <div className="flex items-center justify-center gap-3">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
              <span className="text-slate-400">Creating your profile...</span>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
            <div className="font-semibold text-red-400">Error</div>
            <div className="mt-1 text-sm text-red-300">{error}</div>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-xs text-red-400 underline hover:text-red-300"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Back button */}
        {step > 1 && step < 4 && !loading && (
          <button
            onClick={() => setStep(step - 1)}
            className="mt-4 text-sm text-slate-500 underline hover:text-cyan-400"
          >
            ← Go back
          </button>
        )}
      </div>
    </div>
  );
}
