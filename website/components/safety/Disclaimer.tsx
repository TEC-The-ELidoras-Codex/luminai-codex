"use client";

import React from "react";

interface DisclaimerProps {
  variant?: "full" | "compact";
}

/**
 * Disclaimer — Legal and ethical clarity about platform limitations
 *
 * Key messages:
 * - Not a replacement for therapy, medical care, or legal advice
 * - AI has limitations and can make mistakes
 * - Age gates and content warnings
 */
export default function Disclaimer({ variant = "full" }: DisclaimerProps) {
  if (variant === "compact") {
    return (
      <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-3 text-xs text-slate-500">
        <div className="flex items-start gap-2">
          <span className="text-amber-400">⚠️</span>
          <div>
            <strong className="text-slate-400">Important:</strong> This platform is not a substitute
            for professional therapy, medical care, or legal advice. AI can make mistakes. Use your
            judgment and seek professional help when needed.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl rounded-xl border border-amber-500/30 bg-slate-900 p-6">
      <div className="mb-4 flex items-start gap-3">
        <span className="text-3xl">⚠️</span>
        <div>
          <h2 className="text-xl font-bold text-amber-400">Important Disclaimers</h2>
          <p className="mt-1 text-sm text-slate-400">
            Please read and understand these limitations before using the platform
          </p>
        </div>
      </div>

      <div className="space-y-4 text-sm text-slate-300">
        {/* Not a Replacement for Professional Care */}
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
          <div className="mb-2 font-semibold text-amber-300">
            🩺 Not a Replacement for Professional Care
          </div>
          <div className="text-slate-400">
            This platform is <strong>not</strong> a substitute for:
            <ul className="ml-6 mt-2 list-disc space-y-1">
              <li>Licensed therapy or counseling</li>
              <li>Medical diagnosis or treatment</li>
              <li>Legal advice or representation</li>
              <li>Emergency mental health services</li>
            </ul>
            <div className="mt-2 text-xs text-slate-500">
              If you need professional help, please contact a licensed provider or crisis service.
            </div>
          </div>
        </div>

        {/* AI Limitations */}
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
          <div className="mb-2 font-semibold text-amber-300">🤖 AI Has Limitations</div>
          <div className="text-slate-400">
            This platform uses AI language models that:
            <ul className="ml-6 mt-2 list-disc space-y-1">
              <li>Can make factual errors or hallucinate information</li>
              <li>May not understand nuance or context perfectly</li>
              <li>Cannot replace human judgment or empathy</li>
              <li>Are trained on data that may contain biases</li>
            </ul>
            <div className="mt-2 text-xs text-slate-500">
              Always verify important information from authoritative sources.
            </div>
          </div>
        </div>

        {/* Age Restrictions */}
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
          <div className="mb-2 font-semibold text-amber-300">🔞 Age Restrictions</div>
          <div className="text-slate-400">
            <ul className="ml-6 list-disc space-y-1">
              <li>
                <strong>Under 13:</strong> Parental consent required (COPPA compliance)
              </li>
              <li>
                <strong>13-17:</strong> Youth mode with additional safeguards
              </li>
              <li>
                <strong>18+:</strong> Adult mode may include mature themes
              </li>
            </ul>
            <div className="mt-2 text-xs text-slate-500">
              You are responsible for accurately reporting your age band.
            </div>
          </div>
        </div>

        {/* Data Privacy */}
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
          <div className="mb-2 font-semibold text-amber-300">🔒 Data Privacy</div>
          <div className="text-slate-400">
            We take privacy seriously:
            <ul className="ml-6 mt-2 list-disc space-y-1">
              <li>No real names required (monikers only)</li>
              <li>Broad demographic bands (not specific PII)</li>
              <li>You control data retention (7 days to forever)</li>
              <li>Export and delete rights (GDPR/CCPA compliant)</li>
            </ul>
            <div className="mt-2 text-xs text-slate-500">
              See our{" "}
              <a href="/privacy" className="text-cyan-400 underline hover:text-cyan-300">
                Privacy Policy
              </a>{" "}
              for details.
            </div>
          </div>
        </div>

        {/* Use Your Judgment */}
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
          <div className="mb-2 font-semibold text-amber-300">🧠 Use Your Judgment</div>
          <div className="text-slate-400">
            This platform is designed to support exploration, creativity, and reflection — but:
            <ul className="ml-6 mt-2 list-disc space-y-1">
              <li>Trust your instincts if something feels wrong</li>
              <li>Don't share sensitive personal information</li>
              <li>Take breaks if you feel overwhelmed</li>
              <li>Seek professional help for serious issues</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-4">
        <div className="text-sm text-cyan-300">
          <strong>Our Commitment:</strong> We build with ethics first. If you encounter harmful
          behavior, bugs, or concerns, please report them via our{" "}
          <a href="/support" className="underline hover:text-cyan-200">
            Support page
          </a>
          .
        </div>
      </div>
    </div>
  );
}
