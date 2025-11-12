/**
 * Multi-LLM Collaboration Chat
 * 
 * Allow Claude, OpenAI, and xAI to have conversations together
 * Each LLM sees previous responses and builds on them
 * Creates natural debate/discussion dynamic
 */

import React, { useState } from 'react';

type LLMProvider = 'openai' | 'anthropic' | 'xai';

interface LLMResponse {
  id: string;
  provider: LLMProvider;
  content: string;
  timestamp: Date;
  tokens: number;
  reasoningProcess?: string;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'llm-set';
  userContent?: string;
  responses?: LLMResponse[];
  timestamp: Date;
  conversationTurn: number;
}

interface MultiLLMChatProps {
  enabled: boolean;
}

const LLM_CONFIG = {
  openai: {
    name: 'OpenAI (GPT-4)',
    icon: '🔵',
    color: 'from-blue-600 to-blue-400',
    style: 'border-l-4 border-blue-500'
  },
  anthropic: {
    name: 'Anthropic (Claude)',
    icon: '🟠',
    color: 'from-orange-600 to-orange-400',
    style: 'border-l-4 border-orange-500'
  },
  xai: {
    name: 'xAI (Grok)',
    icon: '✨',
    color: 'from-purple-600 to-purple-400',
    style: 'border-l-4 border-purple-500'
  }
};

/**
 * Multi-LLM Chat Component
 * When user sends message, it gets routed to selected LLMs
 * Each LLM sees context of conversation + other LLM responses
 */
export const MultiLLMChat: React.FC<MultiLLMChatProps> = ({ enabled }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [selectedLLMs, setSelectedLLMs] = useState<LLMProvider[]>(['openai', 'anthropic', 'xai']);
  const [isLoading, setIsLoading] = useState(false);
  const [showLLMSelector, setShowLLMSelector] = useState(false);

  if (!enabled) {
    return null;
  }

  const toggleLLM = (provider: LLMProvider) => {
    setSelectedLLMs(prev =>
      prev.includes(provider)
        ? prev.filter(p => p !== provider)
        : [...prev, provider]
    );
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || selectedLLMs.length === 0) return;

    setIsLoading(true);

    // Add user message
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      type: 'user',
      userContent: userInput,
      timestamp: new Date(),
      conversationTurn: messages.length
    };

    setMessages(prev => [...prev, userMessage]);

    // Get context for LLMs (previous messages + conversation history)
    const context = messages.map(msg => {
      if (msg.userContent) {
        return `User: ${msg.userContent}`;
      } else {
        return msg.responses
          ?.map(r => `${LLM_CONFIG[r.provider].name}: ${r.content}`)
          .join('\n---\n');
      }
    }).join('\n\n');

    // Send to each selected LLM and get responses
    const responses: LLMResponse[] = [];

    for (const provider of selectedLLMs) {
      try {
        const response = await fetch('/api/llm/query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            provider,
            message: userInput,
            context: context, // Other LLMs see full context
            conversationHistory: messages
          })
        });

        if (response.ok) {
          const data = await response.json();
          responses.push({
            id: `response-${provider}-${Date.now()}`,
            provider,
            content: data.content,
            timestamp: new Date(),
            tokens: data.tokens,
            reasoningProcess: data.reasoning
          });
        }
      } catch (error) {
        console.error(`Error querying ${provider}:`, error);
      }
    }

    // Add LLM responses as a group
    const llmMessage: ChatMessage = {
      id: `llm-set-${Date.now()}`,
      type: 'llm-set',
      responses,
      timestamp: new Date(),
      conversationTurn: messages.length + 1
    };

    setMessages(prev => [...prev, llmMessage]);
    setUserInput('');
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-gray-950">
      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">🌐 Multi-LLM Collaboration</h2>
              <p className="text-gray-400">Start a conversation. Watch Claude, OpenAI, and Grok debate ideas together.</p>
            </div>
          </div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className="space-y-3">
              {/* User Message */}
              {msg.userContent && (
                <div className="flex justify-end">
                  <div className="bg-blue-600 text-white rounded-lg px-4 py-3 max-w-xl">
                    <p className="text-sm">{msg.userContent}</p>
                    <p className="text-xs text-blue-100 mt-1">You</p>
                  </div>
                </div>
              )}

              {/* LLM Responses */}
              {msg.responses && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {msg.responses.map(response => (
                    <LLMResponseCard key={response.id} response={response} />
                  ))}
                </div>
              )}
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex gap-4 justify-center items-end">
            {selectedLLMs.map(provider => (
              <div key={provider} className="text-center">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${LLM_CONFIG[provider].color} mb-2 animate-pulse mx-auto`}></div>
                <p className="text-xs text-gray-400">{LLM_CONFIG[provider].name.split('(')[0]}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-700 p-6 space-y-4">
        {/* LLM Selector */}
        <div className="flex gap-2 flex-wrap">
          {Object.entries(LLM_CONFIG).map(([provider, config]) => (
            <button
              key={provider}
              onClick={() => toggleLLM(provider as LLMProvider)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                selectedLLMs.includes(provider as LLMProvider)
                  ? `bg-gradient-to-r ${config.color} text-white`
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <span className="text-lg">{config.icon}</span>
              <span className="text-sm font-medium">{provider === 'anthropic' ? 'Claude' : provider === 'openai' ? 'GPT-4' : 'Grok'}</span>
              {selectedLLMs.includes(provider as LLMProvider) && (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>

        {/* Input Field */}
        <div className="flex gap-3">
          <input
            type="text"
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask Claude, GPT-4, and Grok anything..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            disabled={isLoading || selectedLLMs.length === 0}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !userInput.trim() || selectedLLMs.length === 0}
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:from-gray-700 disabled:to-gray-600 text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            {isLoading ? '⏳' : '➤'}
          </button>
        </div>

        {selectedLLMs.length === 0 && (
          <p className="text-xs text-yellow-600 bg-yellow-900 bg-opacity-20 p-2 rounded">
            ⚠️ Select at least one LLM to continue
          </p>
        )}

        <p className="text-xs text-gray-500">
          💡 Tip: Each LLM sees the others' responses. They'll build on and debate each other's ideas.
        </p>
      </div>
    </div>
  );
};

/**
 * Individual LLM Response Card
 */
interface LLMResponseCardProps {
  response: LLMResponse;
}

const LLMResponseCard: React.FC<LLMResponseCardProps> = ({ response }) => {
  const config = LLM_CONFIG[response.provider];
  const [expandedReasoning, setExpandedReasoning] = useState(false);

  return (
    <div className={`bg-gray-900 rounded-lg p-4 ${config.style}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{config.icon}</span>
          <div>
            <p className="font-semibold text-sm">{config.name}</p>
            <p className="text-xs text-gray-400">{response.tokens} tokens</p>
          </div>
        </div>
      </div>

      {/* Response Content */}
      <div className="text-sm text-gray-100 mb-3 leading-relaxed">
        {response.content}
      </div>

      {/* Reasoning Process (if available) */}
      {response.reasoningProcess && (
        <div className="mt-3 pt-3 border-t border-gray-700">
          <button
            onClick={() => setExpandedReasoning(!expandedReasoning)}
            className="text-xs text-gray-400 hover:text-gray-300 transition flex items-center gap-1"
          >
            {expandedReasoning ? '▼' : '▶'} Show reasoning
          </button>
          {expandedReasoning && (
            <div className="mt-2 text-xs text-gray-400 bg-gray-800 p-2 rounded">
              {response.reasoningProcess}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiLLMChat;
