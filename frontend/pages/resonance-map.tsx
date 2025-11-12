/**
 * RESONANCE MAP
 * 
 * Interactive visualization of semantic relationships
 * Nodes = key concepts from conversation
 * Orbits = semantic distance and strength
 * Physics = gravity-like connections
 */

import React, { useEffect, useRef, useState } from 'react';

interface Node {
  id: string;
  label: string;
  value: number; // Size based on frequency/importance
  color: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Connection {
  source: string;
  target: string;
  strength: number; // 0-1, affects gravity
}

interface ResonanceMapProps {
  conversationId?: string;
  messages?: any[]; // From multi-LLM chat
  liveUpdate?: boolean; // Update as new messages arrive
}

export const ResonanceMap: React.FC<ResonanceMapProps> = ({
  conversationId,
  messages = [],
  liveUpdate = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const animationRef = useRef<number>();
  const velocityRef = useRef<Map<string, { vx: number; vy: number }>>(new Map());

  // Extract concepts from messages (simplified - would use NLP in production)
  const extractConcepts = (msgs: any[]) => {
    const conceptMap = new Map<string, number>();
    const connectionSet = new Set<string>();

    msgs.forEach((msg, idx) => {
      // Simple keyword extraction (in production, use NLP)
      const keywords = msg.content
        .toLowerCase()
        .split(/\s+/)
        .filter((w: string) => w.length > 4)
        .slice(0, 5);

      keywords.forEach((keyword: string) => {
        conceptMap.set(keyword, (conceptMap.get(keyword) || 0) + 1);

        // Create connections to previous keywords
        if (idx > 0) {
          const prevKeywords = messages[idx - 1].content
            .toLowerCase()
            .split(/\s+/)
            .filter((w: string) => w.length > 4)
            .slice(0, 2);

          prevKeywords.forEach((prev: string) => {
            connectionSet.add(`${prev}-${keyword}`);
          });
        }
      });
    });

    // Create node objects
    const colors = [
      '#ff6b6b', '#4ecdc4', '#45b7d1', '#f7dc6f', '#bb8fce', '#85c1e2'
    ];
    const newNodes: Node[] = Array.from(conceptMap.entries())
      .map((entry, idx) => ({
        id: entry[0],
        label: entry[0].substring(0, 15),
        value: entry[1],
        color: colors[idx % colors.length],
        x: Math.random() * 800 - 400,
        y: Math.random() * 600 - 300,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2
      }));

    // Create connections
    const newConnections: Connection[] = Array.from(connectionSet)
      .map(conn => {
        const [source, target] = conn.split('-');
        return {
          source,
          target,
          strength: Math.random() * 0.5 + 0.5
        };
      });

    setNodes(newNodes);
    setConnections(newConnections);
  };

  // Physics simulation
  const updatePhysics = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setNodes(prevNodes => {
      return prevNodes.map((node, idx) => {
        let ax = 0, ay = 0;

        // Repulsion from other nodes
        prevNodes.forEach((other, jdx) => {
          if (idx !== jdx) {
            const dx = node.x - other.x;
            const dy = node.y - other.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const force = 100 / (dist * dist + 1);
            ax += (dx / dist) * force * 0.1;
            ay += (dy / dist) * force * 0.1;
          }
        });

        // Attraction from connections
        connections.forEach(conn => {
          if (conn.source === node.id) {
            const target = prevNodes.find(n => n.id === conn.target);
            if (target) {
              const dx = target.x - node.x;
              const dy = target.y - node.y;
              const dist = Math.sqrt(dx * dx + dy * dy) || 1;
              ax += (dx / dist) * conn.strength * 0.2;
              ay += (dy / dist) * conn.strength * 0.2;
            }
          } else if (conn.target === node.id) {
            const source = prevNodes.find(n => n.id === conn.source);
            if (source) {
              const dx = source.x - node.x;
              const dy = source.y - node.y;
              const dist = Math.sqrt(dx * dx + dy * dy) || 1;
              ax += (dx / dist) * conn.strength * 0.2;
              ay += (dy / dist) * conn.strength * 0.2;
            }
          }
        });

        // Center attraction (keeps nodes on screen)
        const centerForce = 0.02;
        ax -= node.x * centerForce;
        ay -= node.y * centerForce;

        // Update velocity with damping
        const newVx = (node.vx + ax) * 0.95;
        const newVy = (node.vy + ay) * 0.95;

        return {
          ...node,
          x: node.x + newVx,
          y: node.y + newVy,
          vx: newVx,
          vy: newVy
        };
      });
    });
  };

  // Render canvas
  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#0f1419');
    gradient.addColorStop(1, '#1a1f2e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Draw connections
    ctx.strokeStyle = 'rgba(100, 120, 140, 0.3)';
    ctx.lineWidth = 1;
    connections.forEach(conn => {
      const source = nodes.find(n => n.id === conn.source);
      const target = nodes.find(n => n.id === conn.target);
      if (source && target) {
        ctx.beginPath();
        ctx.moveTo(centerX + source.x, centerY + source.y);
        ctx.lineTo(centerX + target.x, centerY + target.y);
        ctx.stroke();
      }
    });

    // Draw nodes
    nodes.forEach(node => {
      const x = centerX + node.x;
      const y = centerY + node.y;
      const size = node.value * 3 + 5;
      const isHovered = hoveredNode === node.id;

      // Node glow
      ctx.fillStyle = `${node.color}30`;
      ctx.beginPath();
      ctx.arc(x, y, size * 2, 0, Math.PI * 2);
      ctx.fill();

      // Node circle
      ctx.fillStyle = node.color;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();

      // Hover highlight
      if (isHovered) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, size + 4, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Label
      if (isHovered || node.value > 2) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.label, x, y);
      }
    });
  };

  // Animation loop
  const animate = () => {
    updatePhysics();
    render();
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    extractConcepts(messages);
  }, [messages, liveUpdate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    animate();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [nodes, connections, hoveredNode]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - canvas.width / 2;
    const y = e.clientY - rect.top - canvas.height / 2;

    // Check which node is hovered
    const hovered = nodes.find(node => {
      const dist = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2);
      return dist < (node.value * 3 + 10);
    });

    setHoveredNode(hovered?.id || null);
  };

  return (
    <div className="h-full flex flex-col bg-gray-950 text-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">🗺️ Resonance Map</h2>
          <div className="text-sm text-gray-400">
            <span>{nodes.length} concepts</span> • <span>{connections.length} connections</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Nodes represent key concepts. Orbits show semantic relationships. Hover to explore.
        </p>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          onMouseMove={handleMouseMove}
          className="w-full h-full cursor-crosshair"
          style={{
            display: 'block',
            backgroundImage: 'radial-gradient(circle at center, #1a1f2e 0%, #0f1419 100%)'
          }}
        />

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-gray-900 border border-gray-700 rounded-lg p-3 text-xs space-y-1 max-w-xs">
          <div className="font-semibold mb-2">About this map:</div>
          <div>🔵 Large nodes = frequently mentioned concepts</div>
          <div>🔗 Connections = semantic relationships</div>
          <div>⭐ Physics = gravity simulates relatedness</div>
          <div className="text-gray-500 mt-2">
            Hover over nodes to highlight and see details
          </div>
        </div>

        {/* Hovered Node Info */}
        {hoveredNode && (
          <div className="absolute top-4 left-4 bg-gray-900 border border-gray-700 rounded-lg p-3">
            <p className="font-semibold">{hoveredNode}</p>
            <p className="text-xs text-gray-400">
              {nodes.find(n => n.id === hoveredNode)?.value} mentions
            </p>
            <div className="text-xs text-gray-500 mt-2">
              Related to:{' '}
              {connections
                .filter(c => c.source === hoveredNode || c.target === hoveredNode)
                .map(c => (c.source === hoveredNode ? c.target : c.source))
                .join(', ') || 'none'}
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-4 border-t border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800 space-y-2">
        <button className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition">
          📊 Export Map
        </button>
        <div className="text-xs text-gray-400 text-center">
          Map updates in real-time as conversation grows
        </div>
      </div>
    </div>
  );
};

export default ResonanceMap;
