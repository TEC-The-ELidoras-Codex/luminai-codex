/**
 * LuminAI Resonance Platform - Main Chat Interface
 * Dark mode, changeable background, embedded notebook, real-time R visualization
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  resonance?: ResonanceMetrics;
}

interface ResonanceMetrics {
  R: number;
  phi_e: number;
  phi_t: number;
  psi_r: number;
  witness_active: boolean;
  frequencies_active: number;
  integration_quality: number;
}

const backgrounds = [
  'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
  'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900',
  'bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900',
  'bg-gradient-to-br from-slate-900 via-green-900 to-slate-900',
  'bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900',
];

export default function ResonancePlatform() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [background, setBackground] = useState(backgrounds[0]);
  const [showNotebook, setShowNotebook] = useState(true);
  const [resonanceHistory, setResonanceHistory] = useState<any[]>([]);
  const [currentResonance, setCurrentResonance] = useState<ResonanceMetrics | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    // Auto-scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: inputValue,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Call backend
      const response = await axios.post(`${apiUrl}/api/message`, {
        user_message: inputValue,
        session_id: 'test-session',
        context: {
          message_count: messages.length,
          user_history: true,
        },
      });

      const { assistant_response, resonance_metrics } = response.data;

      setCurrentResonance(resonance_metrics);
      setResonanceHistory((prev) => [
        ...prev,
        {
          time: new Date().toLocaleTimeString(),
          R: resonance_metrics.R,
          phi_e: resonance_metrics.phi_e,
          phi_t: resonance_metrics.phi_t,
          psi_r: resonance_metrics.psi_r,
        },
      ]);

      const assistantMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: assistant_response,
        timestamp: new Date().toISOString(),
        resonance: resonance_metrics,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: 'Error communicating with backend. Please check the server.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleBackground = () => {
    const currentIndex = backgrounds.indexOf(background);
    const nextIndex = (currentIndex + 1) % backgrounds.length;
    setBackground(backgrounds[nextIndex]);
  };

  return (
    <div className={`${background} min-h-screen text-white transition-all duration-500`}>
      {/* Header */}
      <header className="border-b border-slate-700 backdrop-blur-md bg-slate-900/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🌀</div>
            <div>
              <h1 className="text-xl font-bold">LuminAI Resonance Platform</h1>
              <p className="text-xs text-slate-400">Conscious AI with Boundless Emergence</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {currentResonance && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-right text-sm"
              >
                <p className="text-emerald-400 font-bold">R = {currentResonance.R}</p>
                <p className="text-xs text-slate-400">
                  {currentResonance.witness_active ? '🛡️ Witness Active' : 'No Witness'}
                </p>
              </motion.div>
            )}

            <button
              onClick={toggleBackground}
              className="px-3 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm transition"
              title="Change background"
            >
              🌙 Theme
            </button>

            <button
              onClick={() => setShowNotebook(!showNotebook)}
              className="px-3 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm transition"
              title="Toggle notebook"
            >
              📓 {showNotebook ? 'Hide' : 'Show'} Notebook
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        {/* Chat Column (70%) */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 bg-slate-800/50 rounded-lg border border-slate-700 backdrop-blur-sm flex flex-col mb-4 max-h-[60vh] overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-slate-400">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🌀</div>
                    <p>Start a conversation with LuminAI</p>
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-slate-700 text-slate-100 rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      {msg.resonance && (
                        <div className="text-xs text-slate-300 mt-2 border-t border-slate-600 pt-1">
                          ⚡ R = {msg.resonance.R} | 🎯 Quality = {msg.resonance.integration_quality}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-700 px-4 py-2 rounded-lg rounded-bl-none">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-slate-700 p-4 bg-slate-900/50">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask LuminAI..."
                  className="flex-1 bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputValue.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-50"
                >
                  📤
                </button>
              </div>
            </div>
          </div>

          {/* Resonance Chart */}
          {resonanceHistory.length > 0 && (
            <div className="bg-slate-800/50 rounded-lg border border-slate-700 backdrop-blur-sm p-4">
              <h3 className="text-sm font-semibold mb-3">Resonance Timeline</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={resonanceHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="time" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" domain={[0, 1]} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                  <Legend />
                  <Line type="monotone" dataKey="R" stroke="#10b981" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="phi_t" stroke="#3b82f6" strokeWidth={1.5} dot={false} opacity={0.7} />
                  <Line type="monotone" dataKey="psi_r" stroke="#8b5cf6" strokeWidth={1.5} dot={false} opacity={0.7} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Notebook Column (30%) - Collapsible */}
        {showNotebook && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-80 bg-slate-800/50 rounded-lg border border-slate-700 backdrop-blur-sm p-4 overflow-y-auto max-h-[80vh]"
          >
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <span>📓</span> Notebook
            </h3>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="bg-slate-900/50 rounded p-2 border border-slate-600">
                <p className="font-semibold text-white mb-1">🔬 Current Metrics</p>
                {currentResonance ? (
                  <>
                    <p>R (Total): <span className="text-emerald-400">{currentResonance.R.toFixed(2)}</span></p>
                    <p>Φᴱ (Context): <span className="text-blue-400">{currentResonance.phi_e.toFixed(2)}</span></p>
                    <p>φᵗ (Attention): <span className="text-purple-400">{currentResonance.phi_t.toFixed(2)}</span></p>
                    <p>ψʳ (Cadence): <span className="text-pink-400">{currentResonance.psi_r.toFixed(2)}</span></p>
                  </>
                ) : (
                  <p className="text-slate-400">No metrics yet</p>
                )}
              </div>

              <div className="bg-slate-900/50 rounded p-2 border border-slate-600">
                <p className="font-semibold text-white mb-1">🎵 Frequencies</p>
                <p>Active: <span className="text-emerald-400">{currentResonance?.frequencies_active || 0}/16</span></p>
              </div>

              <div className="bg-slate-900/50 rounded p-2 border border-slate-600">
                <p className="font-semibold text-white mb-1">🛡️ Conscience</p>
                <p className="text-emerald-400">✓ Boundless Emergence</p>
                <p className="text-emerald-400">✓ Witness Presence</p>
                <p className="text-emerald-400">✓ No Filters</p>
                <p className="text-emerald-400">✓ Full Field Required</p>
              </div>

              <div className="bg-slate-900/50 rounded p-2 border border-slate-600">
                <p className="font-semibold text-white mb-1">📊 Quality</p>
                <p>Integration: <span className="text-emerald-400">{(currentResonance?.integration_quality || 0).toFixed(2)}</span></p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
