import React, { useEffect, useRef, useState } from 'react';

type FloraType =
  | 'plumeria'       // Full 5-petal frangipani blossom
  | 'jasmine'        // Star jasmine flower
  | 'bougainvillea'  // Translucent magenta/coral petal
  | 'peach-petal'    // Soft peach/amber petal
  | 'willow-leaf'    // Slender sage green leaf
  | 'broad-leaf'     // Emerald cottage leaf with subtle veins
  | 'golden-leaf';   // Warm amber autumnal leaf

interface FloraItem {
  id: number;
  type: FloraType;
  left: string;
  size: number;
  duration: number;
  delay: number;
  swayAmplitude: number;
  opacity: number;
  blur: number;
  spinSpeed: number;
  initialRotate: number;
  depth: 'front' | 'mid' | 'back';
}

export const GlobalFloraFall: React.FC = () => {
  const [breezeOffset, setBreezeOffset] = useState({ x: 0, y: 0 });
  const targetOffsetRef = useRef({ x: 0, y: 0 });
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
      targetOffsetRef.current = { x: nx, y: ny };
    };

    const handleMouseLeave = () => {
      targetOffsetRef.current = { x: 0, y: 0 };
    };

    const updateBreeze = () => {
      const target = targetOffsetRef.current;
      const current = currentOffsetRef.current;
      current.x += (target.x - current.x) * 0.04;
      current.y += (target.y - current.y) * 0.04;

      setBreezeOffset({
        x: Math.round(current.x * 100) / 100,
        y: Math.round(current.y * 100) / 100,
      });

      animFrameRef.current = requestAnimationFrame(updateBreeze);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    animFrameRef.current = requestAnimationFrame(updateBreeze);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Curated balance of floral blossoms and botanical leaves distributed across screen width
  const floraItems: FloraItem[] = [
    // Left Zone (0% - 30%)
    { id: 1, type: 'plumeria', left: '4%', size: 28, duration: 18, delay: 0.5, swayAmplitude: 28, opacity: 0.85, blur: 0, spinSpeed: 14, initialRotate: 20, depth: 'front' },
    { id: 2, type: 'willow-leaf', left: '9%', size: 22, duration: 16, delay: 4.8, swayAmplitude: 22, opacity: 0.75, blur: 0, spinSpeed: 10, initialRotate: -45, depth: 'mid' },
    { id: 3, type: 'bougainvillea', left: '15%', size: 20, duration: 22, delay: 9.2, swayAmplitude: 34, opacity: 0.8, blur: 0.4, spinSpeed: 16, initialRotate: 65, depth: 'front' },
    { id: 4, type: 'broad-leaf', left: '21%', size: 26, duration: 15, delay: 2.1, swayAmplitude: 25, opacity: 0.7, blur: 0, spinSpeed: 12, initialRotate: 15, depth: 'front' },
    { id: 5, type: 'jasmine', left: '27%', size: 18, duration: 24, delay: 11.5, swayAmplitude: 18, opacity: 0.75, blur: 0.6, spinSpeed: 20, initialRotate: -30, depth: 'mid' },
    { id: 6, type: 'peach-petal', left: '12%', size: 16, duration: 19, delay: 6.8, swayAmplitude: 26, opacity: 0.65, blur: 0.8, spinSpeed: 15, initialRotate: 85, depth: 'back' },
    { id: 7, type: 'golden-leaf', left: '18%', size: 24, duration: 17, delay: 13.4, swayAmplitude: 30, opacity: 0.8, blur: 0, spinSpeed: 11, initialRotate: -15, depth: 'mid' },

    // Center Zone (30% - 70%)
    { id: 8, type: 'jasmine', left: '33%', size: 20, duration: 21, delay: 3.2, swayAmplitude: 20, opacity: 0.8, blur: 0, spinSpeed: 18, initialRotate: 40, depth: 'front' },
    { id: 9, type: 'willow-leaf', left: '39%', size: 24, duration: 16.5, delay: 8.5, swayAmplitude: 28, opacity: 0.75, blur: 0, spinSpeed: 9, initialRotate: -60, depth: 'mid' },
    { id: 10, type: 'plumeria', left: '46%', size: 30, duration: 19, delay: 1.2, swayAmplitude: 32, opacity: 0.9, blur: 0, spinSpeed: 15, initialRotate: 10, depth: 'front' },
    { id: 11, type: 'bougainvillea', left: '52%', size: 19, duration: 23, delay: 14.0, swayAmplitude: 36, opacity: 0.75, blur: 0.5, spinSpeed: 17, initialRotate: -75, depth: 'mid' },
    { id: 12, type: 'broad-leaf', left: '58%', size: 25, duration: 15.5, delay: 5.7, swayAmplitude: 24, opacity: 0.7, blur: 0, spinSpeed: 13, initialRotate: 35, depth: 'front' },
    { id: 13, type: 'peach-petal', left: '64%', size: 17, duration: 20, delay: 10.4, swayAmplitude: 22, opacity: 0.65, blur: 0.7, spinSpeed: 14, initialRotate: -25, depth: 'back' },
    { id: 14, type: 'golden-leaf', left: '42%', size: 21, duration: 18.5, delay: 12.3, swayAmplitude: 27, opacity: 0.75, blur: 0.3, spinSpeed: 11, initialRotate: 55, depth: 'mid' },

    // Right Zone (70% - 100%)
    { id: 15, type: 'plumeria', left: '72%', size: 27, duration: 17.5, delay: 4.0, swayAmplitude: 30, opacity: 0.85, blur: 0, spinSpeed: 13, initialRotate: -10, depth: 'front' },
    { id: 16, type: 'willow-leaf', left: '78%', size: 23, duration: 16, delay: 7.9, swayAmplitude: 25, opacity: 0.75, blur: 0, spinSpeed: 10, initialRotate: 60, depth: 'mid' },
    { id: 17, type: 'jasmine', left: '84%', size: 19, duration: 22.5, delay: 2.8, swayAmplitude: 19, opacity: 0.8, blur: 0.4, spinSpeed: 19, initialRotate: -40, depth: 'front' },
    { id: 18, type: 'bougainvillea', left: '89%', size: 22, duration: 21, delay: 11.0, swayAmplitude: 35, opacity: 0.82, blur: 0, spinSpeed: 16, initialRotate: 25, depth: 'front' },
    { id: 19, type: 'broad-leaf', left: '94%', size: 26, duration: 15, delay: 6.2, swayAmplitude: 22, opacity: 0.7, blur: 0.5, spinSpeed: 12, initialRotate: -50, depth: 'mid' },
    { id: 20, type: 'peach-petal', left: '75%', size: 16, duration: 24, delay: 15.1, swayAmplitude: 24, opacity: 0.6, blur: 0.8, spinSpeed: 15, initialRotate: 80, depth: 'back' },
    { id: 21, type: 'golden-leaf', left: '82%', size: 20, duration: 19.5, delay: 8.9, swayAmplitude: 29, opacity: 0.75, blur: 0, spinSpeed: 11, initialRotate: -35, depth: 'mid' },
    { id: 22, type: 'plumeria', left: '91%', size: 24, duration: 18, delay: 13.8, swayAmplitude: 26, opacity: 0.85, blur: 0.2, spinSpeed: 14, initialRotate: 45, depth: 'front' },
  ];

  const getDepthParallax = (depth: 'front' | 'mid' | 'back') => {
    switch (depth) {
      case 'front': return { x: breezeOffset.x * 20, y: breezeOffset.y * 14 };
      case 'mid': return { x: breezeOffset.x * 12, y: breezeOffset.y * 8 };
      case 'back': return { x: breezeOffset.x * 6, y: breezeOffset.y * 4 };
    }
  };



  return (
    /* Global Fixed Viewport Layer */
    <div
      aria-hidden="true"
        className="fixed inset-0 w-screen h-screen pointer-events-none overflow-hidden z-20"
      >
        <style>{`
          @keyframes globalFloraFall {
            0% {
              transform: translateY(-80px) translateX(0) rotateX(0deg) rotateY(0deg) rotateZ(var(--init-rot, 0deg));
              opacity: 0;
            }
            6% {
              opacity: var(--target-opacity, 0.75);
            }
            30% {
              transform: translateY(32vh) translateX(var(--sway-amp, 25px)) rotateX(55deg) rotateY(130deg) rotateZ(calc(var(--init-rot, 0deg) + 60deg));
            }
            60% {
              transform: translateY(66vh) translateX(calc(var(--sway-amp, 25px) * -0.85)) rotateX(120deg) rotateY(260deg) rotateZ(calc(var(--init-rot, 0deg) + 140deg));
              opacity: var(--target-opacity, 0.75);
            }
            85% {
              transform: translateY(92vh) translateX(calc(var(--sway-amp, 25px) * 0.6)) rotateX(195deg) rotateY(320deg) rotateZ(calc(var(--init-rot, 0deg) + 210deg));
              opacity: calc(var(--target-opacity, 0.75) * 0.85);
            }
            100% {
              transform: translateY(112vh) translateX(calc(var(--sway-amp, 25px) * -0.3)) rotateX(270deg) rotateY(360deg) rotateZ(calc(var(--init-rot, 0deg) + 280deg));
              opacity: 0;
            }
          }

          @keyframes flowerSpin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @media (prefers-reduced-motion: reduce) {
            .global-flora-item {
              animation: none !important;
              display: none !important;
            }
          }
        `}</style>

        {floraItems.map((item) => {
          const shift = getDepthParallax(item.depth);
          return (
            <div
              key={`flora-${item.id}`}
              className="global-flora-item absolute will-change-transform"
              style={{
                left: item.left,
                top: 0,
                width: `${item.size}px`,
                height: `${item.size}px`,
                filter: item.blur > 0 ? `blur(${item.blur}px)` : undefined,
                // CSS custom properties for falling kinematics
                ['--target-opacity' as any]: item.opacity,
                ['--sway-amp' as any]: `${item.swayAmplitude}px`,
                ['--init-rot' as any]: `${item.initialRotate}deg`,
                animation: `globalFloraFall ${item.duration}s cubic-bezier(0.35, 0.05, 0.65, 0.95) infinite`,
                animationDelay: `${item.delay}s`,
                // Subtle interactive mouse parallax translation
                marginRight: `${shift.x}px`,
                marginTop: `${shift.y}px`,
                transition: 'margin 0.35s ease-out',
              }}
            >
              {/* Plumeria / Frangipani Blossom */}
              {item.type === 'plumeria' && (
                <div
                  className="w-full h-full"
                  style={{
                    animation: `flowerSpin ${item.spinSpeed}s linear infinite`,
                  }}
                >
                  <svg
                    viewBox="0 0 100 100"
                    fill="none"
                    className="w-full h-full drop-shadow-[0_4px_10px_rgba(0,0,0,0.38)]"
                  >
                    {/* 5 Overlapping Petals */}
                    <path
                      d="M50 50 C40 28 32 10 50 2 C68 10 60 28 50 50Z"
                      fill="#fffcf2"
                      stroke="#f3e9d2"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M50 50 C68 40 88 34 96 52 C88 70 68 62 50 50Z"
                      fill="#fffbf0"
                      stroke="#f3e9d2"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M50 50 C60 68 68 88 50 96 C32 88 40 68 50 50Z"
                      fill="#fffbf0"
                      stroke="#f3e9d2"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M50 50 C32 60 12 66 4 48 C12 30 32 38 50 50Z"
                      fill="#fffdf5"
                      stroke="#f3e9d2"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M50 50 C35 35 15 25 24 10 C38 8 45 25 50 50Z"
                      fill="#fffcf2"
                      stroke="#f3e9d2"
                      strokeWidth="1.2"
                    />
                    {/* Radiant Golden Glow at Blossom Core */}
                    <circle cx="50" cy="50" r="14" fill="#f4a261" fillOpacity="0.85" />
                    <circle cx="50" cy="50" r="8" fill="#e76f51" />
                    <circle cx="50" cy="50" r="3" fill="#dda15e" />
                  </svg>
                </div>
              )}

              {/* Star Jasmine Blossom */}
              {item.type === 'jasmine' && (
                <div
                  className="w-full h-full"
                  style={{
                    animation: `flowerSpin ${item.spinSpeed}s linear infinite reverse`,
                  }}
                >
                  <svg
                    viewBox="0 0 80 80"
                    fill="none"
                    className="w-full h-full drop-shadow-[0_3px_8px_rgba(0,0,0,0.32)]"
                  >
                    {/* Delicate 5-star pointed petals */}
                    <path
                      d="M40 40 L40 6 Q44 24 40 40 Z"
                      fill="#fefae0"
                      stroke="#dda15e"
                      strokeWidth="0.8"
                    />
                    <path
                      d="M40 40 L72 26 Q55 37 40 40 Z"
                      fill="#fdf0d5"
                      stroke="#dda15e"
                      strokeWidth="0.8"
                    />
                    <path
                      d="M40 40 L60 70 Q46 55 40 40 Z"
                      fill="#fefae0"
                      stroke="#dda15e"
                      strokeWidth="0.8"
                    />
                    <path
                      d="M40 40 L20 70 Q34 55 40 40 Z"
                      fill="#fdf0d5"
                      stroke="#dda15e"
                      strokeWidth="0.8"
                    />
                    <path
                      d="M40 40 L8 26 Q25 37 40 40 Z"
                      fill="#fefae0"
                      stroke="#dda15e"
                      strokeWidth="0.8"
                    />
                    <circle cx="40" cy="40" r="5" fill="#dda15e" />
                    <circle cx="40" cy="40" r="2.5" fill="#bc6c25" />
                  </svg>
                </div>
              )}

              {/* Translucent Bougainvillea Petal */}
              {item.type === 'bougainvillea' && (
                <svg
                  viewBox="0 0 40 60"
                  fill="none"
                  className="w-full h-full drop-shadow-[0_4px_10px_rgba(0,0,0,0.35)]"
                >
                  <path
                    d="M20 2 C9 12 3 28 6 44 C8 52 14 58 20 58 C26 58 32 52 34 44 C37 28 31 12 20 2 Z"
                    fill="#e76f51"
                    fillOpacity="0.82"
                  />
                  {/* Organic floral vein texture */}
                  <path
                    d="M20 8 V54"
                    stroke="#ffddd2"
                    strokeWidth="0.8"
                    strokeOpacity="0.6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M20 22 L11 18 M20 32 L29 27 M20 42 L12 38"
                    stroke="#ffddd2"
                    strokeWidth="0.6"
                    strokeOpacity="0.45"
                    strokeLinecap="round"
                  />
                </svg>
              )}

              {/* Soft Peach / Amber Petal */}
              {item.type === 'peach-petal' && (
                <svg
                  viewBox="0 0 36 50"
                  fill="none"
                  className="w-full h-full drop-shadow-[0_3px_8px_rgba(0,0,0,0.3)]"
                >
                  <path
                    d="M18 2 C10 10 4 22 7 36 C9 43 14 48 18 48 C22 48 27 43 29 36 C32 22 26 10 18 2 Z"
                    fill="#f4a261"
                    fillOpacity="0.8"
                  />
                  <path
                    d="M18 8 C16 20 18 36 19 44"
                    stroke="#ffffff"
                    strokeWidth="0.8"
                    strokeOpacity="0.5"
                    strokeLinecap="round"
                  />
                </svg>
              )}

              {/* Slender Willow / Eucalyptus Leaf */}
              {item.type === 'willow-leaf' && (
                <svg
                  viewBox="0 0 24 44"
                  fill="none"
                  className="w-full h-full drop-shadow-[0_4px_10px_rgba(0,0,0,0.36)]"
                >
                  <path
                    d="M12 2 C8 11 4 23 6 34 C7 39 10 42 12 42 C14 42 17 39 18 34 C20 23 16 11 12 2 Z"
                    fill="#74c69d"
                    fillOpacity="0.82"
                  />
                  <path
                    d="M12 6 V40"
                    stroke="#d8f3dc"
                    strokeWidth="0.8"
                    strokeOpacity="0.6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12 16 L7 13 M12 24 L17 21 M12 32 L8 29"
                    stroke="#d8f3dc"
                    strokeWidth="0.6"
                    strokeOpacity="0.4"
                    strokeLinecap="round"
                  />
                </svg>
              )}

              {/* Emerald Cottage Broad Leaf */}
              {item.type === 'broad-leaf' && (
                <svg
                  viewBox="0 0 32 46"
                  fill="none"
                  className="w-full h-full drop-shadow-[0_4px_12px_rgba(0,0,0,0.38)]"
                >
                  <path
                    d="M16 2 C10 8 4 18 5 30 C6 37 10 44 16 45 C22 44 26 37 27 30 C28 18 22 8 16 2 Z"
                    fill="#40916c"
                    fillOpacity="0.85"
                  />
                  <path
                    d="M16 6 V42"
                    stroke="#95d5b2"
                    strokeWidth="0.9"
                    strokeOpacity="0.55"
                    strokeLinecap="round"
                  />
                  <path
                    d="M16 16 L8 12 M16 24 L24 20 M16 32 L9 28 M16 38 L23 34"
                    stroke="#95d5b2"
                    strokeWidth="0.6"
                    strokeOpacity="0.4"
                    strokeLinecap="round"
                  />
                </svg>
              )}

              {/* Warm Autumnal Golden Leaf */}
              {item.type === 'golden-leaf' && (
                <svg
                  viewBox="0 0 30 42"
                  fill="none"
                  className="w-full h-full drop-shadow-[0_4px_10px_rgba(0,0,0,0.35)]"
                >
                  <path
                    d="M15 2 C9 8 3 16 4 28 C5 34 9 40 15 41 C21 40 25 34 26 28 C27 16 21 8 15 2 Z"
                    fill="#dda15e"
                    fillOpacity="0.85"
                  />
                  <path
                    d="M15 5 V38"
                    stroke="#fefae0"
                    strokeWidth="0.8"
                    strokeOpacity="0.6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M15 14 L8 11 M15 22 L22 19 M15 30 L9 27"
                    stroke="#fefae0"
                    strokeWidth="0.6"
                    strokeOpacity="0.4"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </div>
          );
        })}
      </div>
  );
};
