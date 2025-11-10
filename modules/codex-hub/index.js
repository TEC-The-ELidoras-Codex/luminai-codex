/**
 * 📚 Codex Hub Module
 * 
 * Memory, knowledge storage, and retrieval for the LuminAI system.
 * 
 * Endpoints:
 * - store_memory: Save a conversation exchange or memory to the knowledge base
 * - retrieve_memory: Retrieve memories matching session or timeframe
 * - search: Semantic search across the knowledge base
 * - list_sessions: List all session IDs
 * - getStatus: Get module status and metrics
 */

const CuteModule = require('../../lib/module');

class CodexHub extends CuteModule {
  constructor(config = {}) {
    super({
      name: '📚 Codex Hub',
      version: '1.0.0',
      description: 'Memory storage and retrieval for LuminAI conversations',
      ...config,
    });

    this.memory = new Map(); // sessionId -> [{ prompt, response, timestamp, provider }, ...]
    this.metadata = new Map(); // sessionId -> { createdAt, lastAccessed, exchangeCount }
    this.searchIndex = []; // { id, text, sessionId, timestamp } for searching

    this.config = {
      maxMemoriesPerSession: 500,
      maxSessions: 1000,
      ...config,
    };

    // Define endpoints
    this.endpoints = {
      store_memory: {
        description: 'Store a conversation exchange or memory',
        handler: this.storeMemory,
      },
      retrieve_memory: {
        description: 'Retrieve memories from a session',
        handler: this.retrieveMemory,
      },
      search: {
        description: 'Search across all stored memories',
        handler: this.search,
      },
      list_sessions: {
        description: 'List all session IDs',
        handler: this.listSessions,
      },
      clear_session: {
        description: 'Clear memories for a session',
        handler: this.clearSession,
      },
      getStatus: {
        description: 'Get module status and metrics',
        handler: this.getStatus,
      },
    };
  }

  /**
   * Setup: Initialize memory backend (in-memory by default, could be extended to DB)
   */
  async setup() {
    try {
      this.log('info', 'Setting up CodexHub');

      // Could initialize database connection here
      // For now, using in-memory storage

      this.log('info', 'CodexHub ready for memory operations');
      return true;
    } catch (error) {
      this.log('error', 'Setup failed', { error: error.message });
      throw error;
    }
  }

  /**
   * Store a memory (conversation exchange)
   */
  async storeMemory(payload) {
    const {
      sessionId = 'default',
      prompt,
      response,
      provider = 'unknown',
      metadata = {},
      timestamp = Date.now(),
    } = payload;

    if (!sessionId) {
      throw new Error('sessionId is required');
    }

    try {
      this.log('info', 'Storing memory', { sessionId, promptLength: prompt?.length });

      // Initialize session if needed
      if (!this.memory.has(sessionId)) {
        this.memory.set(sessionId, []);
        this.metadata.set(sessionId, {
          createdAt: Date.now(),
          lastAccessed: Date.now(),
          exchangeCount: 0,
        });
      }

      // Check capacity
      const memories = this.memory.get(sessionId);
      if (memories.length >= this.config.maxMemoriesPerSession) {
        this.log('warn', 'Session memory limit reached', { sessionId });
        // Could implement LRU eviction here
      }

      // Create memory entry
      const memory = {
        id: `${sessionId}-${timestamp}`,
        prompt,
        response,
        provider,
        metadata,
        timestamp,
      };

      // Store
      memories.push(memory);

      // Update metadata
      const meta = this.metadata.get(sessionId);
      meta.lastAccessed = Date.now();
      meta.exchangeCount = memories.length;

      // Add to search index
      this.searchIndex.push({
        id: memory.id,
        text: `${prompt} ${response}`.toLowerCase(),
        sessionId,
        timestamp,
      });

      this.metrics.calls++;
      return {
        success: true,
        memoryId: memory.id,
        sessionMemoryCount: memories.length,
      };
    } catch (error) {
      this.log('error', 'Failed to store memory', { error: error.message });
      this.metrics.errors++;
      throw error;
    }
  }

  /**
   * Retrieve memories from a session
   */
  async retrieveMemory(payload) {
    const {
      sessionId = 'default',
      limit = 10,
      startTime = null,
      endTime = null,
    } = payload;

    try {
      this.log('info', 'Retrieving memories', { sessionId, limit });

      if (!this.memory.has(sessionId)) {
        return {
          memories: [],
          count: 0,
          sessionExists: false,
        };
      }

      let memories = this.memory.get(sessionId);

      // Filter by time range if provided
      if (startTime || endTime) {
        memories = memories.filter((m) => {
          if (startTime && m.timestamp < startTime) return false;
          if (endTime && m.timestamp > endTime) return false;
          return true;
        });
      }

      // Sort by most recent and limit
      memories = memories
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, limit);

      // Update access time
      const meta = this.metadata.get(sessionId);
      if (meta) meta.lastAccessed = Date.now();

      this.metrics.calls++;
      return {
        memories,
        count: memories.length,
        sessionExists: true,
      };
    } catch (error) {
      this.log('error', 'Failed to retrieve memory', { error: error.message });
      this.metrics.errors++;
      throw error;
    }
  }

  /**
   * Search across all memories
   */
  async search(payload) {
    const {
      query,
      limit = 20,
      sessionId = null, // Optional: filter by session
    } = payload;

    if (!query) {
      throw new Error('query is required');
    }

    try {
      this.log('info', 'Searching memories', { query, limit });

      const queryLower = query.toLowerCase();

      // Simple string matching (could be enhanced with ML/embeddings)
      let results = this.searchIndex.filter((entry) => {
        // Filter by session if specified
        if (sessionId && entry.sessionId !== sessionId) return false;

        // Match query in text
        return entry.text.includes(queryLower);
      });

      // Sort by recency and limit
      results = results
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, limit)
        .map((entry) => {
          const memories = this.memory.get(entry.sessionId) || [];
          const memory = memories.find((m) => m.id === entry.id);
          return {
            ...entry,
            memory,
          };
        });

      this.metrics.calls++;
      return {
        query,
        results,
        count: results.length,
      };
    } catch (error) {
      this.log('error', 'Search failed', { error: error.message });
      this.metrics.errors++;
      throw error;
    }
  }

  /**
   * List all session IDs
   */
  async listSessions(payload) {
    try {
      this.log('info', 'Listing sessions');

      const sessions = Array.from(this.metadata.entries())
        .map(([sessionId, meta]) => ({
          sessionId,
          createdAt: meta.createdAt,
          lastAccessed: meta.lastAccessed,
          exchangeCount: meta.exchangeCount,
        }))
        .sort((a, b) => b.lastAccessed - a.lastAccessed);

      this.metrics.calls++;
      return {
        sessions,
        total: sessions.length,
      };
    } catch (error) {
      this.log('error', 'Failed to list sessions', { error: error.message });
      this.metrics.errors++;
      throw error;
    }
  }

  /**
   * Clear a session's memories
   */
  async clearSession(payload) {
    const { sessionId = 'default' } = payload;

    try {
      this.log('info', 'Clearing session', { sessionId });

      if (!this.memory.has(sessionId)) {
        return { success: false, reason: 'Session not found' };
      }

      // Remove from memory
      const count = this.memory.get(sessionId).length;
      this.memory.delete(sessionId);
      this.metadata.delete(sessionId);

      // Remove from search index
      this.searchIndex = this.searchIndex.filter(
        (entry) => entry.sessionId !== sessionId
      );

      this.metrics.calls++;
      return {
        success: true,
        memoriesCleared: count,
      };
    } catch (error) {
      this.log('error', 'Failed to clear session', { error: error.message });
      this.metrics.errors++;
      throw error;
    }
  }

  /**
   * Health check
   */
  async healthCheck() {
    return {
      status: this.status,
      healthy: true,
      stats: {
        totalSessions: this.memory.size,
        totalMemories: Array.from(this.memory.values()).reduce(
          (sum, arr) => sum + arr.length,
          0
        ),
        searchIndexSize: this.searchIndex.length,
      },
    };
  }

  /**
   * Cleanup before shutdown
   */
  async cleanup() {
    this.log('info', 'Clearing memory cache');
    this.memory.clear();
    this.metadata.clear();
    this.searchIndex = [];
  }
}

module.exports = CodexHub;
