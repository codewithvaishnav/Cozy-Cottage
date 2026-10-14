import React, { useEffect, useRef, useState } from 'react';

interface BokehConfig {
  id: number;
  top: string;
  left: string;
  size: number;
  color: string;
  duration: number;
  delay: number;
  depth: 'front' | 'mid' | 'back';
}

export const ForestParallaxLayer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });
  const mouseTargetRef = useRef({ x: 0, y: 0 });
  const currentOffsetRef = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);

  // Parallax tracking with smooth lerp interpolation
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const nx = (e.clientX / innerWidth - 0.5) * 2;
      const ny = (e.clientY / innerHeight - 0.5) * 2;
      mouseTargetRef.current = { x: nx, y: ny };
    };

    const handleMouseLeave = () => {
      mouseTargetRef.current = { x: 0, y: 0 };
    };

    const updateParallax = () => {
      const target = mouseTargetRef.current;
      const current = currentOffsetRef.current;

      current.x += (target.x - current.x) * 0.05;
      current.y += (target.y - current.y) * 0.05;

      setParallaxOffset({
        x: Math.round(current.x * 100) / 100,
        y: Math.round(current.y * 100) / 100,
      });

      animFrameRef.current = requestAnimationFrame(updateParallax);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    animFrameRef.current = requestAnimationFrame(updateParallax);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Soft atmospheric forest bokeh orbs with glowing gradients
  const bokehOrbs: BokehConfig[] = [
    { id: 1, top: '12%', left: '14%', size: 240, color: 'radial-gradient(circle, rgba(221, 161, 94, 0.28) 0%, rgba(221, 161, 94, 0.08) 45%, transparent 70%)', duration: 18, delay: 0, depth: 'mid' },
    { id: 2, top: '22%', left: '78%', size: 280, color: 'radial-gradient(circle, rgba(116, 198, 157, 0.26) 0%, rgba(82, 183, 136, 0.07) 50%, transparent 75%)', duration: 22, delay: 3, depth: 'front' },
    { id: 3, top: '65%', left: '8%', size: 320, color: 'radial-gradient(circle, rgba(221, 161, 94, 0.22) 0%, rgba(188, 108, 37, 0.06) 50%, transparent 75%)', duration: 26, delay: 6, depth: 'back' },
    { id: 4, top: '55%', left: '85%', size: 260, color: 'radial-gradient(circle, rgba(82, 183, 136, 0.25) 0%, rgba(116, 198, 157, 0.08) 48%, transparent 72%)', duration: 20, delay: 1.5, depth: 'mid' },
    { id: 5, top: '38%', left: '46%', size: 360, color: 'radial-gradient(circle, rgba(244, 211, 94, 0.16) 0%, rgba(221, 161, 94, 0.04) 55%, transparent 80%)', duration: 28, delay: 8, depth: 'back' },
    { id: 6, top: '75%', left: '42%', size: 220, color: 'radial-gradient(circle, rgba(149, 213, 178, 0.24) 0%, rgba(82, 183, 136, 0.06) 50%, transparent 70%)', duration: 19, delay: 4.5, depth: 'front' },
  ];

  const getDepthShift = (depth: 'front' | 'mid' | 'back') => {
    switch (depth) {
      case 'front': return { x: parallaxOffset.x * 16, y: parallaxOffset.y * 14 };
      case 'mid': return { x: parallaxOffset.x * 9, y: parallaxOffset.y * 8 };
      case 'back': return { x: parallaxOffset.x * 4, y: parallaxOffset.y * 3 };
    }
  };

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-[4]"
    >
      <style>{`
        @keyframes bokehPulse {
          0%, 100% {
            transform: scale(1) translate(0, 0);
            opacity: 0.65;
          }
          33% {
            transform: scale(1.12) translate(14px, -18px);
            opacity: 0.95;
          }
          66% {
            transform: scale(0.92) translate(-16px, 12px);
            opacity: 0.55;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .bokeh-orb {
            animation: none !important;
          }
        }
      `}</style>

      {/* Bokeh Forest Light Orbs Layer */}
      <div className="absolute inset-0 w-full h-full">
        {bokehOrbs.map((orb) => {
          const shift = getDepthShift(orb.depth);
          return (
            <div
              key={`bokeh-${orb.id}`}
              className="bokeh-orb absolute rounded-full filter blur-[40px] will-change-transform"
              style={{
                top: orb.top,
                left: orb.left,
                width: `${orb.size}px`,
                height: `${orb.size}px`,
                background: orb.color,
                transform: `translate3d(${shift.x}px, ${shift.y}px, 0)`,
                transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
                animation: `bokehPulse ${orb.duration}s ease-in-out infinite`,
                animationDelay: `${orb.delay}s`,
              }}
            />
          );
        })}
      </div>

      {/* Ambient Forest Sunbeam Light Shaft */}
      <div
        className="absolute -top-24 right-1/4 w-[420px] h-[700px] pointer-events-none transform -rotate-12 opacity-35 filter blur-[60px]"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(254, 240, 138, 0.28) 0%, rgba(221, 161, 94, 0.12) 40%, transparent 75%)',
          transform: `rotate(-14deg) translate3d(${parallaxOffset.x * 8}px, ${parallaxOffset.y * 6}px, 0)`,
          transition: 'transform 0.5s ease-out',
        }}
      />
    </div>
  );
};
