/**
 * @file lib/harmony.js
 * @description HarmonyNode - Event bus and message router
 * Routes messages between modules
 * Implements the "Echo Protocol" for inter-module communication
 */

const EventEmitter = require('events');

/**
 * HarmonyNode - Central event router and message bus
 * Coordinates communication between all modules
 */
class HarmonyNode extends EventEmitter {
  constructor(config = {}) {
    super();

    this.name = '🎵 Harmony Node';
    this.status = 'initializing';
    this.modules = new Map();
    this.routes = new Map(); // Module routes
    this.messageQueue = [];
    this.metrics = {
      messagesRouted: 0,
      bytesTransferred: 0,
      latency: [],
      startTime: Date.now(),
    };

    this.config = {
      maxQueueSize: config.maxQueueSize || 10000,
      routeTimeout: config.routeTimeout || 30000,
      enableMetrics: config.enableMetrics !== false,
      ...config,
    };

    this.messageHandlers = new Map();
  }

  /**
   * Register a module with the Harmony Node
   */
  registerModule(module) {
    this.modules.set(module.name, module);
    module.harmonyNode = this; // Give module reference back

    // Subscribe to module's events
    module.on('error', (error) => this.handleModuleError(module, error));

    console.log(`📡 ${module.icon} ${module.name} registered with ${this.name}`);
    return this;
  }

  /**
   * Deregister a module
   */
  deregisterModule(moduleName) {
    this.modules.delete(moduleName);
    console.log(`📡 ${moduleName} deregistered from ${this.name}`);
  }

  /**
   * Route a message from one module to another
   * Implements the Echo Protocol
   */
  async route(message) {
    const startTime = Date.now();

    // Enrich message
    message.id = message.id || this.generateMessageId();
    message.timestamp = message.timestamp || Date.now();
    message.priority = message.priority || 'normal'; // critical|high|normal|low
    message.traceId = message.traceId || this.generateTraceId();

    // Add to queue if busy
    if (this.status === 'processing') {
      this.messageQueue.push(message);
      if (this.messageQueue.length > this.config.maxQueueSize) {
        console.warn(`🚨 Message queue full (${this.config.maxQueueSize})`);
        this.messageQueue.shift(); // Drop oldest
      }
      return;
    }

    try {
      // Find recipient module
      const recipient = this.modules.get(message.recipient);
      if (!recipient) {
        throw new Error(
          `Recipient module not found: ${message.recipient}`
        );
      }

      // Check if recipient can handle this action
      if (!recipient.endpoints[message.action]) {
        throw new Error(
          `${message.recipient} does not have endpoint: ${message.action}`
        );
      }

      // Execute on recipient
      this.status = 'processing';
      const result = await recipient.execute(message.action, message.payload);

      // Track metrics
      const latency = Date.now() - startTime;
      this.metrics.messagesRouted++;
      this.metrics.latency.push(latency);
      this.metrics.bytesTransferred += JSON.stringify(message).length;

      // Emit routing event
      this.emit('message_routed', {
        id: message.id,
        sender: message.sender,
        recipient: message.recipient,
        action: message.action,
        latency,
        success: true,
      });

      this.status = 'ready';
      return result;
    } catch (error) {
      this.emit('routing_error', {
        message: message.id,
        sender: message.sender,
        recipient: message.recipient,
        error: error.message,
      });

      console.error(
        `❌ Routing failed: ${message.sender} → ${message.recipient}:`,
        error.message
      );

      this.status = 'ready';
      throw error;
    }
  }

  /**
   * Broadcast a message to all modules
   */
  broadcast(action, payload = {}, sender = 'system') {
    console.log(`📢 Broadcasting: ${action}`);
    this.modules.forEach((module) => {
      if (module.name !== sender && module.endpoints[action]) {
        try {
          this.route({
            sender,
            recipient: module.name,
            action,
            payload,
            priority: 'high',
          });
        } catch (error) {
          console.error(`Failed to route to ${module.name}:`, error);
        }
      }
    });
  }

  /**
   * Subscribe to a specific message type
   */
  subscribe(moduleName, action, handler) {
    const key = `${moduleName}:${action}`;
    this.messageHandlers.set(key, handler);
    return () => this.messageHandlers.delete(key); // Unsubscribe function
  }

  /**
   * Get all registered modules
   */
  getModules() {
    return Array.from(this.modules.values());
  }

  /**
   * Get module by name
   */
  getModule(name) {
    return this.modules.get(name);
  }

  /**
   * Get status of all modules
   */
  async getSystemStatus() {
    const moduleStatuses = Array.from(this.modules.values()).map((m) =>
      m.getStatus()
    );

    const avgLatency =
      this.metrics.latency.length > 0
        ? this.metrics.latency.reduce((a, b) => a + b, 0) /
          this.metrics.latency.length
        : 0;

    return {
      harmonyStatus: this.status,
      totalModules: this.modules.size,
      modules: moduleStatuses,
      metrics: {
        messagesRouted: this.metrics.messagesRouted,
        bytesTransferred: this.metrics.bytesTransferred,
        avgLatency,
        uptime: Date.now() - this.metrics.startTime,
      },
      queueSize: this.messageQueue.length,
    };
  }

  /**
   * Initialize all registered modules
   */
  async initialize() {
    console.log(`\n🎵 ${this.name} initializing...`);
    this.status = 'initializing';

    const initOrder = this.calculateDependencyOrder();

    for (const module of initOrder) {
      try {
        await module.initialize();
      } catch (error) {
        console.error(`Failed to initialize ${module.name}:`, error);
        throw error;
      }
    }

    this.status = 'ready';
    console.log(`✨ ${this.name} ready\n`);
  }

  /**
   * Shutdown all modules gracefully
   */
  async shutdown() {
    console.log(`\n🛑 ${this.name} shutting down...`);
    this.status = 'shutting_down';

    // Shutdown in reverse order of initialization
    const modules = Array.from(this.modules.values());
    const shutdownOrder = modules.reverse();

    for (const module of shutdownOrder) {
      try {
        await module.shutdown();
      } catch (error) {
        console.error(`Error shutting down ${module.name}:`, error);
      }
    }

    this.status = 'shutdown';
    console.log(`✨ ${this.name} shut down\n`);
  }

  /**
   * Calculate module initialization order based on dependencies
   */
  calculateDependencyOrder() {
    const visited = new Set();
    const order = [];

    const visit = (module) => {
      if (visited.has(module.name)) return;
      visited.add(module.name);

      // Visit dependencies first
      for (const dep of module.dependencies) {
        visit(dep);
      }

      order.push(module);
    };

    // Visit all modules
    this.modules.forEach((module) => visit(module));

    return order;
  }

  /**
   * Handle module errors
   */
  handleModuleError(module, error) {
    console.error(`❌ Error in ${module.name}:`, error);
    this.emit('module_error', {
      module: module.name,
      error: error.message,
    });

    // Could implement auto-restart logic here
  }

  /**
   * Health check for all modules
   */
  async healthCheck() {
    const checks = [];
    for (const module of this.modules.values()) {
      const isHealthy = await module.healthCheck();
      checks.push({
        module: module.name,
        healthy: isHealthy,
      });
    }
    return checks;
  }

  /**
   * Get message queue status
   */
  getQueueStatus() {
    return {
      queueSize: this.messageQueue.length,
      maxSize: this.config.maxQueueSize,
      percentFull: (this.messageQueue.length / this.config.maxQueueSize) * 100,
      messages: this.messageQueue.slice(0, 10), // First 10
    };
  }

  /**
   * Generate unique message ID
   */
  generateMessageId() {
    return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate trace ID for debugging
   */
  generateTraceId() {
    return `trace-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Log with context
   */
  log(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] 🎵 ${this.name} [${level}] ${message}`, data);
  }
}

module.exports = HarmonyNode;
