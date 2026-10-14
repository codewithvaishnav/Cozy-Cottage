import { useState, useEffect, useRef, useCallback } from 'react';

export interface ScrollPhysicsState {
  scrollY: number;
  scrollVelocity: number; // pixels per second (signed: + down, - up)
  normalizedVelocity: number; // -1 to +1 (clamped)
  speed: number; // 0 to 1 (magnitude of normalized velocity)
  direction: 'down' | 'up' | 'idle';
  progress: number; // 0.0 to 1.0 (document scroll percentage)
  elevation: number; // calculated estate altitude in meters (410m to 465m)
}

export function useScrollPhysics(): ScrollPhysicsState {
  const [state, setState] = useState<ScrollPhysicsState>({
    scrollY: 0,
    scrollVelocity: 0,
    normalizedVelocity: 0,
    speed: 0,
    direction: 'idle',
    progress: 0,
    elevation: 420
  });

  const lastScrollY = useRef(0);
  const lastTime = useRef(performance.now());
  const velocityEma = useRef(0);
  const rafId = useRef<number | null>(null);
  const isUpdating = useRef(false);
  const idleTimeout = useRef<NodeJS.Timeout | null>(null);

  const calculatePhysics = useCallback(() => {
    const currentScrollY = typeof window !== 'undefined' ? (window.scrollY || window.pageYOffset || 0) : 0;
    const currentTime = performance.now();
    const dt = Math.max(0.001, (currentTime - lastTime.current) / 1000); // in seconds

    const instantVelocity = (currentScrollY - lastScrollY.current) / dt; // px/s
    
    // Exponential moving average for silky-smooth velocity
    const alpha = 0.25;
    const safeInstant = Number.isFinite(instantVelocity) ? instantVelocity : 0;
    const updatedEma = alpha * safeInstant + (1 - alpha) * velocityEma.current;
    velocityEma.current = Number.isFinite(updatedEma) ? updatedEma : 0;

    // Decay if nearly zero
    if (Math.abs(velocityEma.current) < 5) {
      velocityEma.current = 0;
    }

    const docHeight = Math.max(
      document.body?.scrollHeight || 0,
      document.documentElement?.scrollHeight || 0,
      document.body?.offsetHeight || 0,
      document.documentElement?.offsetHeight || 0,
      document.body?.clientHeight || 0,
      document.documentElement?.clientHeight || 0
    ) - (window.innerHeight || 1);

    const progress = docHeight > 0 && Number.isFinite(currentScrollY)
      ? Math.min(1, Math.max(0, currentScrollY / docHeight))
      : 0;

    // Normalized velocity between -1.0 and 1.0 (capped at ~1800 px/s)
    const normalized = Number.isFinite(velocityEma.current)
      ? Math.max(-1, Math.min(1, velocityEma.current / 1800))
      : 0;
    const speed = Number.isFinite(velocityEma.current)
      ? Math.min(1, Math.abs(velocityEma.current) / 1800)
      : 0;

    let direction: 'down' | 'up' | 'idle' = 'idle';
    if (velocityEma.current > 15) {
      direction = 'down';
    } else if (velocityEma.current < -15) {
      direction = 'up';
    }

    // Estate elevation model: ascends from 410m (Apothecary Garden in lower valley) to 465m (Upper Hilltop Vineyard)
    // with organic topographical variation
    const elevation = Math.round(410 + (progress || 0) * 55 + Math.sin((progress || 0) * Math.PI * 2) * 4);

    setState({
      scrollY: Number.isFinite(currentScrollY) ? currentScrollY : 0,
      scrollVelocity: Number.isFinite(velocityEma.current) ? Math.round(velocityEma.current) : 0,
      normalizedVelocity: Number.isFinite(normalized) ? Number(normalized.toFixed(3)) : 0,
      speed: Number.isFinite(speed) ? Number(speed.toFixed(3)) : 0,
      direction,
      progress: Number.isFinite(progress) ? Number(progress.toFixed(4)) : 0,
      elevation: Number.isFinite(elevation) ? elevation : 420
    });

    lastScrollY.current = currentScrollY;
    lastTime.current = currentTime;
    isUpdating.current = false;
  }, []);

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    lastTime.current = performance.now();

    const handleScroll = () => {
      if (!isUpdating.current) {
        isUpdating.current = true;
        rafId.current = requestAnimationFrame(calculatePhysics);
      }

      // Clear previous idle timer
      if (idleTimeout.current) {
        clearTimeout(idleTimeout.current);
      }

      // When scroll stops, smoothly decay velocity to 0
      idleTimeout.current = setTimeout(() => {
        velocityEma.current = 0;
        setState((prev) => ({
          ...prev,
          scrollVelocity: 0,
          normalizedVelocity: 0,
          speed: 0,
          direction: 'idle'
        }));
      }, 120);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial run
    calculatePhysics();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
      if (idleTimeout.current) clearTimeout(idleTimeout.current);
    };
  }, [calculatePhysics]);

  return state;
}
