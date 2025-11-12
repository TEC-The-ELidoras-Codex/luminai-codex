/**
 * LLM Provider Selector
 * 
 * Allows users to choose which AI provider to use:
 * - OpenAI (GPT-4, GPT-3.5)
 * - Anthropic (Claude)
 * - xAI (Grok)
 * 
 * Each provider has different strengths for conversation style
 */

import React, { useState } from 'react';

interface LLMProvider {
  id: 'openai' | 'anthropic' | 'xai';
  name: string;
  icon: string;
  description: string;
  models: string[];
  strengths: string[];
  color: string;
}

const LLM_PROVIDERS: LLMProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    icon: '🔵',
    description: 'GPT-4 & GPT-3.5 - Fast, versatile, great for creative tasks',
    models: ['gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo'],
    strengths: ['Speed', 'Versatility', 'Multilingual', 'Code generation'],
    color: 'from-blue-600 to-blue-400'
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    icon: '🟠',
    description: 'Claude - Deep reasoning, nuanced responses, excellent for complex analysis',
    models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
    strengths: ['Reasoning', 'Context window', 'Nuance', 'Accuracy'],
    color: 'from-orange-600 to-orange-400'
  },
  {
    id: 'xai',
    name: 'xAI',
    icon: '✨',
    description: 'Grok - Direct, edgy, unconventional perspective',
    models: ['grok-1', 'grok-1-vision'],
    strengths: ['Directness', 'Humor', 'Critical thinking', 'Current events'],
    color: 'from-purple-600 to-purple-400'
  }
];

interface LLMProviderSelectorProps {
  selectedProvider: 'openai' | 'anthropic' | 'xai' | null;
  selectedModel: string | null;
  onProviderChange: (provider: 'openai' | 'anthropic' | 'xai', model: string) => void;
  onClose?: () => void;
  inline?: boolean; // Show in header, not modal
}

export const LLMProviderSelector: React.FC<LLMProviderSelectorProps> = ({
  selectedProvider,
  selectedModel,
  onProviderChange,
  onClose,
  inline = false
}) => {
  const [expanded, setExpanded] = useState(!inline);

  const handleProviderSelect = (provider: LLMProvider) => {
    const defaultModel = provider.models[0];
    onProviderChange(provider.id, defaultModel);
    if (inline) setExpanded(false);
  };

  const currentProvider = LLM_PROVIDERS.find(p => p.id === selectedProvider);

  // Inline mode (header dropdown)
  if (inline) {
    return (
      <div className="relative">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
        >
          {currentProvider ? (
            <>
              <span className="text-xl">{currentProvider.icon}</span>
              <span className="text-sm font-medium">{currentProvider.name}</span>
              <span className="text-xs text-gray-400 max-w-[100px] truncate">{selectedModel}</span>
            </>
          ) : (
            <>
              <span className="text-xl">🤖</span>
              <span className="text-sm font-medium">Choose AI</span>
            </>
          )}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>

        {expanded && (
          <div className="absolute top-full mt-2 right-0 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50 w-72">
            <div className="p-4 space-y-3">
              {LLM_PROVIDERS.map(provider => (
                <button
                  key={provider.id}
                  onClick={() => handleProviderSelect(provider)}
                  className={`w-full text-left p-3 rounded-lg transition ${
                    selectedProvider === provider.id
                      ? 'bg-gradient-to-r ' + provider.color + ' text-white'
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{provider.icon}</span>
                        <span className="font-semibold">{provider.name}</span>
                      </div>
                      <p className="text-xs text-gray-300 mt-1">{provider.description}</p>
                    </div>
                    {selectedProvider === provider.id && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Full modal mode (settings page)
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Choose Your AI Provider</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {LLM_PROVIDERS.map(provider => (
          <button
            key={provider.id}
            onClick={() => handleProviderSelect(provider)}
            className={`p-6 rounded-lg transition border-2 text-left ${
              selectedProvider === provider.id
                ? `border-opacity-100 bg-gradient-to-r ${provider.color}`
                : 'border-gray-700 bg-gray-800 hover:border-gray-600'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{provider.icon}</span>
                <div>
                  <h3 className="text-xl font-bold">{provider.name}</h3>
                  <p className="text-sm text-gray-300">{provider.description}</p>
                </div>
              </div>
              {selectedProvider === provider.id && (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>

            {/* Models */}
            <div className="mb-3">
              <p className="text-xs font-semibold text-gray-400 mb-2">Available Models:</p>
              <div className="flex flex-wrap gap-2">
                {provider.models.map(model => (
                  <span
                    key={model}
                    className="text-xs bg-gray-700 bg-opacity-50 px-2 py-1 rounded"
                  >
                    {model}
                  </span>
                ))}
              </div>
            </div>

            {/* Strengths */}
            <div>
              <p className="text-xs font-semibold text-gray-400 mb-2">Strengths:</p>
              <div className="flex flex-wrap gap-1">
                {provider.strengths.map(strength => (
                  <span
                    key={strength}
                    className="text-xs bg-gray-600 bg-opacity-50 px-2 py-1 rounded"
                  >
                    {strength}
                  </span>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>

      {selectedProvider && (
        <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <p className="text-sm">
            <span className="font-semibold">Current Selection:</span> {currentProvider?.name} ({selectedModel})
          </p>
          <p className="text-xs text-gray-400 mt-2">
            This provider will be used for your next conversation and group sessions.
          </p>
        </div>
      )}
    </div>
  );
};

export default LLMProviderSelector;
