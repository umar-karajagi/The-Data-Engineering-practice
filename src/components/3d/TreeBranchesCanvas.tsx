'use client';

import React, { useEffect, useRef } from 'react';

interface TreeBranchesCanvasProps {
  className?: string;
}

export const TreeBranchesCanvas: React.FC<TreeBranchesCanvasProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 800);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || 800;
    };
    window.addEventListener('resize', handleResize);

    // Mouse influence
    let mouseX = width / 2;
    let mouseY = height / 2;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Branch Node Structure
    interface Branch {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      cp1x: number;
      cp1y: number;
      depth: number;
      children: Branch[];
      pulseT: number;
      pulseSpeed: number;
    }

    const createBranch = (
      x: number,
      y: number,
      angle: number,
      length: number,
      depth: number,
      maxDepth: number
    ): Branch => {
      const rad = (angle * Math.PI) / 180;
      const targetX = x + Math.cos(rad) * length;
      const targetY = y + Math.sin(rad) * length;

      // Slight curve control point
      const midX = (x + targetX) / 2 + (Math.random() - 0.5) * (length * 0.3);
      const midY = (y + targetY) / 2 + (Math.random() - 0.5) * (length * 0.3);

      const branch: Branch = {
        x1: x,
        y1: y,
        x2: targetX,
        y2: targetY,
        cp1x: midX,
        cp1y: midY,
        depth,
        children: [],
        pulseT: Math.random(),
        pulseSpeed: 0.003 + Math.random() * 0.004
      };

      if (depth < maxDepth && length > 25) {
        const subBranches = depth === 0 ? 3 : Math.random() > 0.3 ? 2 : 1;
        for (let i = 0; i < subBranches; i++) {
          const spread = 22 + Math.random() * 28;
          const newAngle = angle + (i % 2 === 0 ? spread : -spread);
          const newLength = length * (0.65 + Math.random() * 0.15);
          branch.children.push(createBranch(targetX, targetY, newAngle, newLength, depth + 1, maxDepth));
        }
      }

      return branch;
    };

    // Generate root branch systems originating from left and right corners
    const rootBranches: Branch[] = [
      createBranch(-20, height * 0.2, 25, 180, 0, 4),
      createBranch(-20, height * 0.7, -15, 200, 0, 4),
      createBranch(width + 20, height * 0.3, 160, 190, 0, 4),
      createBranch(width + 20, height * 0.8, -165, 180, 0, 4)
    ];

    let time = 0;

    const renderBranch = (b: Branch) => {
      // Draw branch line
      const lineWidth = Math.max(1, 4.5 - b.depth * 0.8);
      ctx.lineWidth = lineWidth;

      // Soft light green gradient
      const alpha = Math.max(0.18, 0.45 - b.depth * 0.07);
      ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
      ctx.shadowColor = 'rgba(52, 211, 153, 0.4)';
      ctx.shadowBlur = 8;

      ctx.beginPath();
      ctx.moveTo(b.x1, b.y1);
      ctx.quadraticCurveTo(b.cp1x, b.cp1y, b.x2, b.y2);
      ctx.stroke();

      // Leaf / Node Bud at branch end
      if (b.children.length === 0) {
        const pulse = Math.sin(time * 2 + b.pulseT * 10) * 1.5;
        const leafRadius = 3.5 + pulse;
        ctx.fillStyle = 'rgba(52, 211, 153, 0.75)';
        ctx.beginPath();
        ctx.arc(b.x2, b.y2, Math.max(2, leafRadius), 0, Math.PI * 2);
        ctx.fill();

        // Little leaf ring
        ctx.strokeStyle = 'rgba(110, 231, 183, 0.6)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Traveling bioluminescent data pulse along branch curve
      b.pulseT += b.pulseSpeed;
      if (b.pulseT > 1) b.pulseT = 0;
      const t = b.pulseT;
      // Quadratic bezier point: (1-t)^2*P0 + 2(1-t)t*P1 + t^2*P2
      const px = (1 - t) * (1 - t) * b.x1 + 2 * (1 - t) * t * b.cp1x + t * t * b.x2;
      const py = (1 - t) * (1 - t) * b.y1 + 2 * (1 - t) * t * b.cp1y + t * t * b.y2;

      ctx.fillStyle = '#6EE7B7';
      ctx.shadowColor = '#10B981';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(px, py, 2.2, 0, Math.PI * 2);
      ctx.fill();

      // Recurse children
      b.children.forEach(renderBranch);
    };

    const animate = () => {
      animId = requestAnimationFrame(animate);
      time += 0.015;

      ctx.clearRect(0, 0, width, height);

      // Render all branch trees
      rootBranches.forEach(renderBranch);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none z-0 overflow-hidden ${className}`}
      aria-hidden="true"
    />
  );
};
