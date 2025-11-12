/**
 * Multi-User Collaboration System
 * 
 * Enables 4+ users to collaborate in real-time:
 * - Shared conversation session
 * - Real-time message sync (WebSocket)
 * - User presence indicators
 * - Shared resonance metrics
 * - Group meeting controls
 */

import React, { useState, useEffect } from 'react';

interface CollaborativeUser {
  id: string;
  name: string;
  avatar?: string;
  color: string;
  isActive: boolean;
  joinedAt: Date;
  lastMessageAt?: Date;
}

interface CollaborativeSession {
  id: string;
  title: string;
  description?: string;
  createdBy: string;
  createdAt: Date;
  maxUsers: number;
  currentUsers: CollaborativeUser[];
  llmProvider: 'openai' | 'anthropic' | 'xai';
  llmModel: string;
  isRecording: boolean;
  resonanceScore: number;
}

const USER_COLORS = [
  'from-blue-500 to-blue-400',
  'from-purple-500 to-purple-400',
  'from-pink-500 to-pink-400',
  'from-green-500 to-green-400',
  'from-yellow-500 to-yellow-400',
  'from-red-500 to-red-400',
  'from-indigo-500 to-indigo-400',
  'from-cyan-500 to-cyan-400'
];

interface CollaborationPanelProps {
  session: CollaborativeSession | null;
  currentUserId: string;
  onCreateSession: (title: string, maxUsers: number) => void;
  onInviteUser: (email: string) => void;
  onRemoveUser: (userId: string) => void;
  onLeaveSession: () => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

export const CollaborationPanel: React.FC<CollaborationPanelProps> = ({
  session,
  currentUserId,
  onCreateSession,
  onInviteUser,
  onRemoveUser,
  onLeaveSession,
  onStartRecording,
  onStopRecording
}) => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [showInviteForm, setShowInviteForm] = useState(false);

  if (!session) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">👥 Group Collaboration</h3>
        <p className="text-gray-400 text-sm mb-4">Start a group session to collaborate with others</p>
        <button
          onClick={() => onCreateSession('New Collaboration', 4)}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          ✨ Start Group Session
        </button>
      </div>
    );
  }

  const isCreator = session.createdBy === currentUserId;
  const spotsAvailable = session.maxUsers - session.currentUsers.length;

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 space-y-4">
      {/* Session Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">{session.title}</h3>
          <div className="text-2xl">👥</div>
        </div>
        {session.description && (
          <p className="text-sm text-gray-400">{session.description}</p>
        )}
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>🤖 {session.llmProvider} ({session.llmModel})</span>
          <span>•</span>
          <span>Created {new Date(session.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Recording Status */}
      <div className="p-3 bg-gray-800 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${session.isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-600'}`}></div>
          <span className="text-sm font-medium">{session.isRecording ? 'Recording' : 'Not recording'}</span>
        </div>
        <button
          onClick={session.isRecording ? onStopRecording : onStartRecording}
          className={`text-xs px-3 py-1 rounded transition ${
            session.isRecording
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          {session.isRecording ? '⏹️ Stop' : '🎙️ Record'}
        </button>
      </div>

      {/* Resonance Score */}
      <div className="p-3 bg-gradient-to-r from-purple-900 to-purple-800 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">🎼 Group Resonance</span>
          <span className="text-lg font-bold">{session.resonanceScore.toFixed(2)}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
          <div
            className="bg-gradient-to-r from-purple-500 to-purple-400 h-2 rounded-full transition-all"
            style={{ width: `${session.resonanceScore * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Active Users */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-sm">
            Active Users ({session.currentUsers.length}/{session.maxUsers})
          </h4>
          {spotsAvailable > 0 && (
            <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
              {spotsAvailable} spot{spotsAvailable !== 1 ? 's' : ''} open
            </span>
          )}
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto">
          {session.currentUsers.map(user => (
            <div
              key={user.id}
              className={`flex items-center justify-between p-2 bg-gray-800 rounded-lg ${
                !user.isActive ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                {/* Avatar Circle */}
                <div
                  className={`w-8 h-8 rounded-full bg-gradient-to-r ${user.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {user.name}
                    {user.id === currentUserId && <span className="text-xs text-gray-400 ml-1">(You)</span>}
                  </p>
                  <p className="text-xs text-gray-400">
                    {user.isActive ? (
                      <>
                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                        Active now
                      </>
                    ) : (
                      `Idle`
                    )}
                  </p>
                </div>
              </div>

              {/* Remove User Button (Creator Only) */}
              {isCreator && user.id !== currentUserId && (
                <button
                  onClick={() => onRemoveUser(user.id)}
                  className="text-gray-500 hover:text-red-500 transition text-sm"
                  title="Remove user"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Invite Form */}
      {isCreator && spotsAvailable > 0 && (
        <div className="space-y-2 pt-2 border-t border-gray-700">
          <button
            onClick={() => setShowInviteForm(!showInviteForm)}
            className="w-full text-sm bg-gray-800 hover:bg-gray-700 rounded-lg py-2 transition"
          >
            {showInviteForm ? '✕ Close' : '➕ Invite User'}
          </button>

          {showInviteForm && (
            <div className="space-y-2 p-3 bg-gray-800 rounded-lg">
              <input
                type="email"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={() => {
                  if (inviteEmail) {
                    onInviteUser(inviteEmail);
                    setInviteEmail('');
                    setShowInviteForm(false);
                  }
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-1 rounded transition"
              >
                Send Invite
              </button>
            </div>
          )}
        </div>
      )}

      {/* Leave Session */}
      <button
        onClick={onLeaveSession}
        className="w-full text-sm bg-gray-800 hover:bg-red-900 text-gray-300 hover:text-white py-2 rounded-lg transition"
      >
        👋 Leave Session
      </button>
    </div>
  );
};

/**
 * Collaboration Avatars Stack
 * Shows multiple users in compact form (for header/toolbar)
 */
interface CollaborationAvatarsProps {
  users: CollaborativeUser[];
  maxDisplay?: number;
}

export const CollaborationAvatars: React.FC<CollaborationAvatarsProps> = ({
  users,
  maxDisplay = 4
}) => {
  const displayed = users.slice(0, maxDisplay);
  const remaining = Math.max(0, users.length - maxDisplay);

  return (
    <div className="flex items-center gap-1">
      <div className="flex -space-x-2">
        {displayed.map(user => (
          <div
            key={user.id}
            className={`w-7 h-7 rounded-full bg-gradient-to-r ${user.color} flex items-center justify-center text-white text-xs font-bold border-2 border-gray-900`}
            title={user.name}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
        ))}

        {remaining > 0 && (
          <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-white text-xs font-bold border-2 border-gray-900">
            +{remaining}
          </div>
        )}
      </div>

      {users.length > 0 && (
        <span className="text-xs text-gray-400 ml-2">
          {users.length} collaborating
        </span>
      )}
    </div>
  );
};

export default CollaborationPanel;
