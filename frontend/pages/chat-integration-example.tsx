/**
 * INTEGRATION GUIDE: Multi-LLM Chat Page
 * 
 * This shows how to integrate the three new components into the main chat page.
 * Copy this pattern into your existing /pages/chat.tsx
 */

import React, { useState } from 'react';
import MultiLLMChat from '@/components/MultiLLMChat';
import CollaborationPanel from '@/components/CollaborationPanel';
import LLMProviderSelector from '@/components/LLMProviderSelector';
import CompactResonanceMap from '@/components/CompactResonanceMap';

// Example integrated chat page layout
export default function ChatPage() {
  const [selectedLLM, setSelectedLLM] = useState<'openai' | 'anthropic' | 'xai' | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState('conv-' + Date.now());
  const [concepts, setConcepts] = useState<any[]>([]);
  const [connections, setConnections] = useState<any[]>([]);

  const handleProviderChange = (provider: any, model: string) => {
    setSelectedLLM(provider);
    setSelectedModel(model);
  };

  const handleExportTranscript = (transcript: string) => {
    const blob = new Blob([transcript], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation-${conversationId}.md`;
    a.click();
  };

  return (
    <div className="h-screen flex flex-col bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-900 to-blue-900 border-b border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">🧠 LuminAI Resonance</h1>
            <div className="text-sm text-gray-300">
              {selectedLLM && (
                <>
                  <span>Using {selectedLLM === 'openai' ? 'GPT-4' : selectedLLM === 'anthropic' ? 'Claude' : 'Grok'}</span>
                  {selectedModel && <span className="text-gray-400"> • {selectedModel}</span>}
                </>
              )}
            </div>
          </div>

          {/* LLM Provider Selector in Header */}
          <div className="w-64">
            <LLMProviderSelector
              selectedProvider={selectedLLM}
              selectedModel={selectedModel}
              onProviderChange={handleProviderChange}
              inline={true}
            />
          </div>
        </div>
      </header>

      {/* Main Chat Layout */}
      <div className="flex-1 grid grid-cols-4 gap-4 p-4 overflow-hidden">
        {/* Left Sidebar: Collaboration */}
        <div className="col-span-1 space-y-4 overflow-y-auto">
          {/* Collaboration Panel */}
          <CollaborationPanel
            session={null} // Pass actual session data here
            currentUserId="user-123"
            onCreateSession={(title, maxUsers) => console.log('Create session:', title, maxUsers)}
            onInviteUser={(email) => console.log('Invite user:', email)}
            onRemoveUser={(userId) => console.log('Remove user:', userId)}
          />

          {/* Compact Resonance Map */}
          <div>
            <h3 className="text-sm font-semibold mb-2">📊 Concept Map</h3>
            <CompactResonanceMap
              concepts={concepts}
              resonances={connections}
              size="medium"
              interactive={true}
              onConceptClick={(conceptId) => console.log('Concept clicked:', conceptId)}
            />
          </div>

          {/* Quick Stats */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Concepts</span>
              <span className="font-semibold">{concepts.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Connections</span>
              <span className="font-semibold">{connections.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Messages</span>
              <span className="font-semibold">0</span>
            </div>
          </div>
        </div>

        {/* Main Content: Multi-LLM Chat */}
        <div className="col-span-3">
          <MultiLLMChat
            conversationId={conversationId}
            onExport={handleExportTranscript}
            showHelpPopover={true}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * INTEGRATION CHECKLIST
 * 
 * ✅ Import all four components:
 *    - MultiLLMChat
 *    - CollaborationPanel
 *    - LLMProviderSelector
 *    - CompactResonanceMap
 * 
 * ✅ Set up state for:
 *    - selectedLLM (provider choice)
 *    - selectedModel (specific model)
 *    - conversationId (unique identifier)
 *    - concepts (for resonance map)
 *    - connections (semantic links)
 * 
 * ✅ Create handlers for:
 *    - LLM provider changes
 *    - Transcript export
 *    - Collaboration actions
 *    - Concept map interactions
 * 
 * ✅ Layout structure:
 *    - Header: Title + LLMProviderSelector
 *    - Left sidebar: CollaborationPanel + CompactResonanceMap
 *    - Main area: MultiLLMChat
 * 
 * ✅ Styling:
 *    - Use Tailwind dark mode (bg-gray-950, etc.)
 *    - Match gradient color scheme
 *    - Ensure responsive layout
 *    - Add borders and spacing
 * 
 * ✅ Data flow:
 *    - LLM selection → Provider changes → Chat updates
 *    - Messages sent → API call → Responses received
 *    - Concepts extracted → Map updated → Connections shown
 * 
 * OPTIONAL ENHANCEMENTS
 * 
 * 🔹 Add WebSocket integration for real-time updates
 * 🔹 Connect collaboration panel to actual user sessions
 * 🔹 Extract concepts automatically from chat
 * 🔹 Add recording and playback functionality
 * 🔹 Implement user authentication
 * 🔹 Add conversation history sidebar
 * 🔹 Create settings panel for advanced options
 * 🔹 Add keyboard shortcuts
 * 🔹 Implement message search
 * 🔹 Add conversation tags/organization
 */
