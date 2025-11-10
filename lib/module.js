/**
 * @file lib/module.js
 * @description Base class for all LuminAI Codex modules
 * Every module (Resonance, Codex, Arcadia, Harmony, etc) extends this
 * Provides consistent interface, status tracking, and event emission
 */

const EventEmitter = require('events');

/**
 * CuteModule - Base class for all LuminAI Codex modules
 * Handles initialization, status tracking, error handling, metrics
 */
class CuteModule extends EventEmitter {
  constructor(config = {}) {
    super();

    // Identity
    this.id = config.id || `module-${Date.now()}`;
    this.name = config.name || 'Unknown Module';
    this.icon = config.icon || '⚙️';
    this.version = config.version || '1.0.0';
    this.description = config.description || '';

    // Status & Health
    this.status = 'uninitialized'; // uninitialized|initializing|active|paused|error|shutdown
    this.healthy = false;
    this.lastHealthCheck = null;

    // Dependencies & Connections
    this.dependencies = config.dependencies || [];
    this.dependents = []; // Modules that depend on this one
    this.connections = new Map(); // Connected modules

    // Endpoints (what this module can do)
    this.endpoints = config.endpoints || {};

    // Metrics
    this.metrics = {
      calls: 0,
      errors: 0,
      totalTime: 0,
      avgTime: 0,
      lastError: null,
      startTime: Date.now(),
    };

    // Config
    this.config = config.config || {};
    this.harmonyNode = config.harmonyNode || null; // Event bus reference
  }

  /**
   * Initialize the module
   * Called during app startup
   */
  async initialize() {
    try {
      this.status = 'initializing';
      this.emit('status_change', { status: 'initializing' });

      // Check dependencies
      for (const dep of this.dependencies) {
        if (!dep.healthy) {
          throw new Error(`Dependency ${dep.name} is not healthy`);
        }
      }

      // Run module-specific initialization
      await this.setup();

      this.status = 'active';
      this.healthy = true;
      this.emit('initialized');
      this.emit('status_change', { status: 'active' });

      console.log(`✨ ${this.icon} ${this.name} initialized`);
      return true;
    } catch (error) {
      this.status = 'error';
      this.healthy = false;
      this.metrics.lastError = error.message;
      this.emit('error', error);
      console.error(`❌ ${this.icon} ${this.name} failed to initialize:`, error);
      throw error;
    }
  }

  /**
   * Setup method - override in subclass
   * Module-specific initialization logic
   */
  async setup() {
    // Override in subclass
  }

  /**
   * Execute an action on this module
   * @param {string} action - The action name (must be in endpoints)
   * @param {object} payload - Action payload/parameters
   */
  async execute(action, payload = {}) {
    if (this.status !== 'active') {
      throw new Error(
        `Cannot execute ${action} on ${this.name}: module is ${this.status}`
      );
    }

    if (!this.endpoints[action]) {
      throw new Error(`${this.name} does not have endpoint: ${action}`);
    }

    try {
      const startTime = Date.now();
      this.metrics.calls++;

      // Execute the endpoint
      const result = await this.endpoints[action].handler.call(this, payload);

      // Update metrics
      const elapsed = Date.now() - startTime;
      this.metrics.totalTime += elapsed;
      this.metrics.avgTime = this.metrics.totalTime / this.metrics.calls;

      // Emit event (if connected to Harmony Node)
      if (this.harmonyNode) {
        this.harmonyNode.emit('module_executed', {
          module: this.name,
          action,
          duration: elapsed,
          success: true,
        });
      }

      return result;
    } catch (error) {
      this.metrics.errors++;
      this.metrics.lastError = error.message;

      if (this.harmonyNode) {
        this.harmonyNode.emit('module_error', {
          module: this.name,
          action,
          error: error.message,
        });
      }

      throw error;
    }
  }

  /**
   * Send a message to another module through Harmony Node
   */
  send(recipientName, action, payload = {}) {
    if (!this.harmonyNode) {
      throw new Error('Module not connected to Harmony Node');
    }

    this.harmonyNode.route({
      sender: this.name,
      recipient: recipientName,
      action,
      payload,
      timestamp: Date.now(),
      traceId: this.generateTraceId(),
    });
  }

  /**
   * Pause the module (still initialized, but not processing)
   */
  async pause() {
    this.status = 'paused';
    this.emit('status_change', { status: 'paused' });
    console.log(`⏸️  ${this.icon} ${this.name} paused`);
  }

  /**
   * Resume the module
   */
  async resume() {
    if (this.status === 'paused') {
      this.status = 'active';
      this.emit('status_change', { status: 'active' });
      console.log(`▶️  ${this.icon} ${this.name} resumed`);
    }
  }

  /**
   * Shutdown the module
   */
  async shutdown() {
    try {
      this.status = 'shutdown';
      this.emit('status_change', { status: 'shutdown' });

      // Module-specific cleanup
      await this.cleanup();

      this.healthy = false;
      console.log(`🛑 ${this.icon} ${this.name} shut down`);
    } catch (error) {
      console.error(`Error shutting down ${this.name}:`, error);
    }
  }

  /**
   * Cleanup method - override in subclass
   */
  async cleanup() {
    // Override in subclass
  }

  /**
   * Health check - can be overridden
   */
  async healthCheck() {
    this.lastHealthCheck = Date.now();
    // Override for custom health checks
    return this.healthy;
  }

  /**
   * Get module status summary
   */
  getStatus() {
    const uptime = Date.now() - this.metrics.startTime;
    return {
      id: this.id,
      name: this.name,
      icon: this.icon,
      status: this.status,
      healthy: this.healthy,
      uptime: uptime,
      metrics: this.metrics,
      endpoints: Object.keys(this.endpoints),
    };
  }

  /**
   * Connect this module to another
   */
  connect(targetModule) {
    this.connections.set(targetModule.name, targetModule);
    if (!targetModule.dependents.includes(this)) {
      targetModule.dependents.push(this);
    }
  }

  /**
   * Get connected modules
   */
  getConnections() {
    return Array.from(this.connections.values());
  }

  /**
   * Generate unique trace ID for debugging
   */
  generateTraceId() {
    return `${this.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Log with context
   */
  log(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    console.log(
      `[${timestamp}] ${this.icon} ${this.name} [${level}] ${message}`,
      data
    );
  }
}

module.exports = CuteModule;
