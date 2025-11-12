/**
 * MULTI-LLM COLLABORATION ENGINE
 * 
 * Three AI personas collaborate in real-time:
 * 1. Claude (Deep thinking, nuanced) 🟠
 * 2. OpenAI (Creative, versatile) 🔵
 * 3. xAI (Direct, critical thinking) ✨
 * 
 * They "bounce off each other" - each LLM sees previous responses
 * and builds on them for richer, more complex answers.
 */

import React, { useState, useEffect } from 'react';

// LLM Personas - each has distinct voice and color
interface LLMPersona {
  id: 'claude' | 'openai' | 'xai';
  name: string;
  icon: string;
  color: string;
  bgGradient: string;
  borderColor: string;
  voice: string;
  systemPrompt: string;
  thinking: string; // What they do when thinking
  responsePrefix: string; // How they start responses
}

const LLM_PERSONAS: Record<string, LLMPersona> = {
  claude: {
    id: 'claude',
    name: 'Claude',
    icon: '🟠',
    color: 'text-orange-400',
    bgGradient: 'from-orange-900 to-orange-800',
    borderColor: 'border-orange-500',
    voice: 'thoughtful, nuanced, deeply analytical',
    systemPrompt: 'You are Claude. Think deeply and present nuanced perspectives. Acknowledge complexity and uncertainty.',
    thinking: '🧠 Claude is thinking deeply...',
    responsePrefix: '**Claude:** '
  },
  openai: {
    id: 'openai',
    name: 'GPT-4',
    icon: '🔵',
    color: 'text-blue-400',
    bgGradient: 'from-blue-900 to-blue-800',
    borderColor: 'border-blue-500',
    voice: 'creative, clear, practical',
    systemPrompt: 'You are GPT-4. Be creative yet practical. Build on previous ideas with clear examples.',
    thinking: '⚡ GPT-4 is generating...',
    responsePrefix: '**GPT-4:** '
  },
  xai: {
    id: 'xai',
    name: 'Grok',
    icon: '✨',
    color: 'text-purple-400',
    bgGradient: 'from-purple-900 to-purple-800',
    borderColor: 'border-purple-500',
    voice: 'direct, witty, critical',
    systemPrompt: 'You are Grok. Be direct and slightly irreverent. Point out gaps in previous reasoning.',
    thinking: '🎯 Grok is analyzing...',
    responsePrefix: '**Grok:** '
  }
};

interface MessageInMultiLLM {
  id: string;
  persona: 'user' | 'claude' | 'openai' | 'xai';
  content: string;
  timestamp: Date;
  isThinking?: boolean;
}

interface MultiLLMChatProps {
  conversationId?: string;
  onExport?: (transcript: string) => void;
  showHelpPopover?: boolean;
}

export const MultiLLMChat: React.FC<MultiLLMChatProps> = ({
  conversationId = 'new',
  onExport,
  showHelpPopover = true
}) => {
  const [messages, setMessages] = useState<MessageInMultiLLM[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showHelpMenu, setShowHelpMenu] = useState(false);

  // Send user message and trigger all three LLMs
  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    // Add user message
    const userMsg: MessageInMultiLLM = {
      id: `msg-${Date.now()}`,
      persona: 'user',
      content: userInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setUserInput('');
    setIsProcessing(true);

    // Trigger LLMs in sequence: Claude → OpenAI → xAI
    try {
      // Each LLM sees all previous messages for context
      const fullContext = [userMsg, ...messages].reverse();

      // Claude responds first
      await triggerLLMResponse('claude', fullContext);

      // Then OpenAI (sees Claude's response)
      await triggerLLMResponse('openai', fullContext);

      // Finally xAI (sees both Claude and OpenAI)
      await triggerLLMResponse('xai', fullContext);
    } finally {
      setIsProcessing(false);
    }
  };

  const triggerLLMResponse = async (persona: 'claude' | 'openai' | 'xai', context: MessageInMultiLLM[]) => {
    // Add "thinking" message
    const thinkingId = `thinking-${persona}-${Date.now()}`;
    setMessages(prev => [...prev, {
      id: thinkingId,
      persona,
      content: LLM_PERSONAS[persona].thinking,
      timestamp: new Date(),
      isThinking: true
    }]);

    try {
      // Call your backend API
      const response = await fetch('/api/multi-llm/response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          persona,
          conversationId,
          context: context.map(m => ({
            persona: m.persona,
            content: m.content
          })),
          systemPrompt: LLM_PERSONAS[persona].systemPrompt
        })
      });

      const data = await response.json();

      // Remove thinking message and add actual response
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== thinkingId);
        return [...filtered, {
          id: `resp-${persona}-${Date.now()}`,
          persona,
          content: data.response,
          timestamp: new Date()
        }];
      });
    } catch (error) {
      console.error(`Error getting ${persona} response:`, error);
      // Show error message
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== thinkingId);
        return [...filtered, {
          id: `error-${persona}-${Date.now()}`,
          persona,
          content: `⚠️ Error connecting to ${LLM_PERSONAS[persona].name}`,
          timestamp: new Date()
        }];
      });
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-950 text-white">
      {/* Header with Help Icon */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold">🧠 Multi-LLM Collab</h2>
          <div className="flex gap-1">
            <span className="text-orange-400">🟠</span>
            <span className="text-blue-400">🔵</span>
            <span className="text-purple-400">✨</span>
          </div>
        </div>

        {showHelpPopover && (
          <div className="relative">
            <button
              onClick={() => setShowHelpMenu(!showHelpMenu)}
              className="group relative p-2 hover:bg-gray-800 rounded-lg transition"
              title="Help"
            >
              <span className="text-lg">❓</span>
              <div className="absolute -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            </button>

            {/* Help Popover */}
            {showHelpMenu && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-gray-900 border-2 border-gray-700 rounded-lg shadow-2xl p-4 space-y-3 z-50">
                <div className="flex items-start gap-2">
                  <span className="text-lg">🟠</span>
                  <div>
                    <p className="font-semibold text-orange-400">Claude - Deep Thinking</p>
                    <p className="text-xs text-gray-400">Nuanced analysis, acknowledges complexity</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="text-lg">🔵</span>
                  <div>
                    <p className="font-semibold text-blue-400">GPT-4 - Clarity</p>
                    <p className="text-xs text-gray-400">Clear thinking, practical examples</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="text-lg">✨</span>
                  <div>
                    <p className="font-semibold text-purple-400">Grok - Critical Eye</p>
                    <p className="text-xs text-gray-400">Direct feedback, identifies gaps</p>
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-3">
                  <p className="text-xs font-semibold text-gray-300 mb-2">💡 How it works:</p>
                  <ol className="text-xs text-gray-400 space-y-1 list-decimal list-inside">
                    <li>You ask a question</li>
                    <li>Claude responds first (deep thinking)</li>
                    <li>GPT-4 builds on Claude's answer</li>
                    <li>Grok challenges and critiques</li>
                    <li>They "bounce off" each other for richer insights</li>
                  </ol>
                </div>

                <button
                  onClick={() => setShowHelpMenu(false)}
                  className="w-full text-xs bg-gray-800 hover:bg-gray-700 py-1 rounded transition"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="text-4xl">🌟</div>
              <p className="text-gray-400">Start a multi-LLM conversation</p>
              <p className="text-xs text-gray-500">Ask Claude, GPT-4, and Grok to collaborate</p>
            </div>
          </div>
        )}

        {messages.map(msg => (
          <div
            key={msg.id}
            className={`animate-in fade-in slide-in-from-bottom-2 ${
              msg.persona === 'user' ? 'ml-auto' : ''
            }`}
          >
            {msg.persona === 'user' ? (
              // User message
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg p-4 max-w-2xl ml-auto">
                <p className="text-sm font-medium mb-1">You</p>
                <p className="text-white">{msg.content}</p>
              </div>
            ) : (
              // LLM message
              <div
                className={`bg-gradient-to-r ${LLM_PERSONAS[msg.persona as keyof typeof LLM_PERSONAS].bgGradient} 
                border-l-4 ${LLM_PERSONAS[msg.persona as keyof typeof LLM_PERSONAS].borderColor} 
                rounded-lg p-4 max-w-2xl hover:shadow-lg transition-all duration-300`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">
                    {LLM_PERSONAS[msg.persona as keyof typeof LLM_PERSONAS].icon}
                  </span>
                  <p className={`font-semibold ${LLM_PERSONAS[msg.persona as keyof typeof LLM_PERSONAS].color}`}>
                    {LLM_PERSONAS[msg.persona as keyof typeof LLM_PERSONAS].name}
                  </p>
                  {msg.isThinking && <span className="text-xs text-gray-400 animate-pulse">thinking...</span>}
                </div>

                {msg.isThinking ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin">⚙️</div>
                    <span className="text-gray-300">{msg.content}</span>
                  </div>
                ) : (
                  <p className="text-gray-100 text-sm leading-relaxed">{msg.content}</p>
                )}

                <div className="text-xs text-gray-400 mt-2">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            )}
          </div>
        ))}

        {isProcessing && messages[messages.length - 1]?.persona !== 'user' && (
          <div className="text-center text-gray-500 text-sm py-4">
            <span className="animate-pulse">Waiting for responses...</span>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="flex gap-3">
          <input
            type="text"
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && !isProcessing && handleSendMessage()}
            placeholder="Ask the LLMs something..."
            disabled={isProcessing}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 disabled:opacity-50 transition"
          />
          <button
            onClick={handleSendMessage}
            disabled={isProcessing || !userInput.trim()}
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:opacity-50 text-white font-semibold px-6 py-2 rounded-lg transition disabled:cursor-not-allowed"
          >
            Send
          </button>

          {onExport && (
            <button
              onClick={() => {
                const transcript = messages
                  .map(m => `${m.persona === 'user' ? 'You' : LLM_PERSONAS[m.persona as keyof typeof LLM_PERSONAS].name}: ${m.content}`)
                  .join('\n\n');
                onExport(transcript);
              }}
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold px-4 py-2 rounded-lg transition"
              title="Export conversation"
            >
              💾
            </button>
          )}
        </div>

        <p className="text-xs text-gray-500 mt-2">
          💡 Tip: Each LLM bounces off the previous response for deeper insights
        </p>
      </div>
    </div>
  );
};

export default MultiLLMChat;
