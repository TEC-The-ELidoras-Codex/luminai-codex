/**
 * RESONANCE MAP COMPONENT
 * 
 * Embeddable visualization with simplified orbit physics
 * Used in chat sidebar or as full-page interactive map
 */

import React, { useEffect, useRef, useState } from 'react';

interface Concept {
  id: string;
  label: string;
  frequency: number;
  color: string;
}

interface Resonance {
  source: string;
  target: string;
  strength: number;
}

interface CompactResonanceMapProps {
  concepts: Concept[];
  resonances: Resonance[];
  size?: 'small' | 'medium' | 'large'; // 200px, 400px, 600px
  interactive?: boolean;
  onConceptClick?: (conceptId: string) => void;
}

export const CompactResonanceMap: React.FC<CompactResonanceMapProps> = ({
  concepts = [],
  resonances = [],
  size = 'medium',
  interactive = true,
  onConceptClick
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null);
  const animationRef = useRef<number>();

  const sizeMap = { small: 200, medium: 400, large: 600 };
  const canvasSize = sizeMap[size];

  // Physics simulation (simplified for embedded use)
  const simulate = () => {
    const canvas = canvasRef.current;
    if (!canvas || concepts.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.fillStyle = '#0f1419';
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    const centerX = canvasSize / 2;
    const centerY = canvasSize / 2;
    const maxRadius = (canvasSize - 40) / 2;

    // Draw resonance lines first (behind nodes)
    ctx.strokeStyle = 'rgba(100, 150, 200, 0.2)';
    ctx.lineWidth = 1;
    
    resonances.forEach(res => {
      const source = concepts.find(c => c.id === res.source);
      const target = concepts.find(c => c.id === res.target);
      if (!source || !target) return;

      const sourceIdx = concepts.indexOf(source);
      const targetIdx = concepts.indexOf(target);

      const sourceAngle = (sourceIdx / concepts.length) * Math.PI * 2;
      const targetAngle = (targetIdx / concepts.length) * Math.PI * 2;

      const sourceX = centerX + Math.cos(sourceAngle) * maxRadius;
      const sourceY = centerY + Math.sin(sourceAngle) * maxRadius;
      const targetX = centerX + Math.cos(targetAngle) * maxRadius;
      const targetY = centerY + Math.sin(targetAngle) * maxRadius;

      // Draw line with strength-based opacity
      ctx.globalAlpha = Math.min(res.strength, 0.6);
      ctx.beginPath();
      ctx.moveTo(sourceX, sourceY);
      ctx.lineTo(targetX, targetY);
      ctx.stroke();
      ctx.globalAlpha = 1;
    });

    // Draw nodes orbiting
    concepts.forEach((concept, idx) => {
      const angle = (idx / concepts.length) * Math.PI * 2 + (Date.now() * 0.0001);
      const x = centerX + Math.cos(angle) * maxRadius;
      const y = centerY + Math.sin(angle) * maxRadius;
      const radius = Math.min(concept.frequency * 1.5 + 3, 12);

      // Node glow
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 3);
      gradient.addColorStop(0, concept.color + '40');
      gradient.addColorStop(1, concept.color + '00');
      ctx.fillStyle = gradient;
      ctx.fillRect(x - radius * 3, y - radius * 3, radius * 6, radius * 6);

      // Node circle
      ctx.fillStyle = concept.color;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      // Highlight if selected
      if (selectedConcept === concept.id) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, radius + 4, 0, Math.PI * 2);
        ctx.stroke();
      }
    });

    // Draw center circle
    ctx.fillStyle = 'rgba(100, 150, 200, 0.1)';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
    ctx.fill();

    if (concepts.length > 0) {
      animationRef.current = requestAnimationFrame(simulate);
    }
  };

  useEffect(() => {
    simulate();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [concepts, resonances, selectedConcept]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!interactive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const centerX = canvasSize / 2;
    const centerY = canvasSize / 2;
    const maxRadius = (canvasSize - 40) / 2;

    // Check if click is on a node
    concepts.forEach((concept, idx) => {
      const angle = (idx / concepts.length) * Math.PI * 2 + (Date.now() * 0.0001);
      const x = centerX + Math.cos(angle) * maxRadius;
      const y = centerY + Math.sin(angle) * maxRadius;
      const radius = Math.min(concept.frequency * 1.5 + 3, 12);

      const dist = Math.sqrt((clickX - x) ** 2 + (clickY - y) ** 2);
      if (dist < radius + 4) {
        setSelectedConcept(concept.id);
        onConceptClick?.(concept.id);
      }
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={canvasSize}
          height={canvasSize}
          onClick={handleCanvasClick}
          className={interactive ? 'cursor-pointer' : 'cursor-default'}
          style={{ display: 'block', width: '100%' }}
        />
      </div>

      {/* Mini legend */}
      {size !== 'small' && (
        <div className="text-xs text-gray-400 px-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-500" />
            <span>Concepts orbit by relevance</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompactResonanceMap;
