"use client";

import React from "react";

interface CrisisResourcesProps {
  variant?: "banner" | "modal" | "footer";
}

const CRISIS_RESOURCES = [
  {
    name: "988 Suicide & Crisis Lifeline",
    contact: "Call or text 988",
    url: "https://988lifeline.org",
    description: "24/7 crisis support for suicidal thoughts or emotional distress",
  },
  {
    name: "Crisis Text Line",
    contact: "Text HOME to 741741",
    url: "https://www.crisistextline.org",
    description: "Free, 24/7 support via text message",
  },
  {
    name: "SAMHSA National Helpline",
    contact: "1-800-662-4357",
    url: "https://www.samhsa.gov/find-help/national-helpline",
    description: "Treatment referral and information service (in English and Spanish)",
  },
  {
    name: "The Trevor Project (LGBTQ+)",
    contact: "1-866-488-7386 or text START to 678678",
    url: "https://www.thetrevorproject.org",
    description: "Crisis intervention and suicide prevention for LGBTQ+ youth",
  },
  {
    name: "Save the Michaels",
    contact: "716-984-8375",
    url: "https://savethemichaels.com",
    description: "Addiction recovery and family support services",
  },
];

/**
 * CrisisResources — Always-visible crisis support information
 *
 * Design principle: Never gate access to crisis resources behind auth or modals
 */
export default function CrisisResources({ variant = "banner" }: CrisisResourcesProps) {
  if (variant === "banner") {
    return (
      <div className="rounded-lg border-l-4 border-red-500 bg-red-500/10 p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl text-red-400">⚠️</span>
          <div className="flex-1">
            <div className="mb-1 font-semibold text-red-300">
              If you're in crisis, please get help now
            </div>
            <div className="text-sm text-red-200/80">
              <strong>988 Suicide & Crisis Lifeline:</strong> Call or text <strong>988</strong>{" "}
              (24/7, free, confidential)
            </div>
            <div className="mt-2 text-xs text-red-200/60">
              <a href="#crisis-resources" className="underline hover:text-red-200">
                More crisis resources →
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "footer") {
    return (
      <div className="border-t border-slate-700 bg-slate-900 p-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-3 text-sm font-semibold text-slate-400">
            🆘 Crisis Resources (Available 24/7)
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {CRISIS_RESOURCES.map((resource) => (
              <div key={resource.name} className="text-xs text-slate-500">
                <div className="font-semibold text-slate-400">{resource.name}</div>
                <div className="text-cyan-400">{resource.contact}</div>
                <div className="mt-1">{resource.description}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-xs italic text-slate-600">
            If you're outside the US, visit{" "}
            <a
              href="https://findahelpline.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 underline hover:text-cyan-300"
            >
              findahelpline.com
            </a>{" "}
            for international resources.
          </div>
        </div>
      </div>
    );
  }

  // Modal variant
  return (
    <div className="max-w-2xl rounded-xl border border-red-500/30 bg-slate-800 p-6">
      <div className="mb-4 flex items-start gap-3">
        <span className="text-3xl">🆘</span>
        <div>
          <h2 className="text-xl font-bold text-red-300">Crisis Resources</h2>
          <p className="mt-1 text-sm text-slate-400">
            If you're in immediate danger or experiencing a crisis, please reach out for
            professional help
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {CRISIS_RESOURCES.map((resource) => (
          <div key={resource.name} className="rounded-lg border border-slate-700 bg-slate-900 p-4">
            <div className="font-semibold text-slate-200">{resource.name}</div>
            <div className="mt-1 font-mono text-lg text-cyan-400">{resource.contact}</div>
            <div className="mt-2 text-sm text-slate-400">{resource.description}</div>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-xs text-cyan-400 underline hover:text-cyan-300"
            >
              Learn more →
            </a>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-slate-700 bg-slate-900/50 p-4">
        <div className="text-sm text-slate-400">
          <strong>International:</strong> If you're outside the US, visit{" "}
          <a
            href="https://findahelpline.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 underline hover:text-cyan-300"
          >
            findahelpline.com
          </a>{" "}
          for crisis resources in your country.
        </div>
      </div>
    </div>
  );
}
