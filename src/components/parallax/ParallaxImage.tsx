import React, { useRef, useState, useEffect } from 'react';

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  speed?: number; // Parallax offset speed: e.g. -0.2 to 0.4
  tiltFactor?: number; // Velocity tilt intensity: default 6
  aspectRatio?: 'landscape' | 'portrait' | 'square' | 'wide' | 'auto';
  caption?: string;
  badge?: string;
  exif?: {
    camera?: string;
    lens?: string;
    aperture?: string;
    shutter?: string;
    iso?: string;
  };
  onClick?: () => void;
  overlayGradient?: boolean;
}

export const ParallaxImage: React.FC<ParallaxImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  speed = 0.15,
  aspectRatio = 'landscape',
  caption,
  badge,
  exif,
  onClick,
  overlayGradient = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const aspectClass = {
    landscape: 'aspect-[4/3] md:aspect-[16/10]',
    portrait: 'aspect-[3/4] md:aspect-[4/5]',
    square: 'aspect-square',
    wide: 'aspect-[16/9] md:aspect-[21/9]',
    auto: 'h-full w-full'
  }[aspectRatio];

  useEffect(() => {
    let animId: number;
    let isScheduled = false;

    const updateParallax = () => {
      isScheduled = false;
      if (!containerRef.current || !imageWrapperRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = typeof window !== 'undefined' ? (window.innerHeight || document.documentElement.clientHeight || 800) : 800;

      // Check if element is in or near viewport
      if (rect.bottom >= -150 && rect.top <= windowHeight + 150) {
        // Linear distance from center of viewport (-windowHeight/2 to +windowHeight/2)
        const centerDistance = rect.top + (rect.height || 0) / 2 - windowHeight / 2;
        const targetOffset = centerDistance * speed;
        const safeOffset = Number.isFinite(targetOffset) ? targetOffset : 0;

        // Apply smooth direct GPU hardware-accelerated transform without CSS transition delays
        imageWrapperRef.current.style.transform = `translate3d(0, ${safeOffset.toFixed(1)}px, 0) scale(1.15)`;

        if (glareRef.current) {
          const totalHeight = windowHeight + (rect.height || 0);
          const viewProgress = totalHeight > 0 ? (windowHeight - rect.top) / totalHeight : 0;
          const calculatedGlare = Math.sin(viewProgress * Math.PI) * 0.15;
          const safeGlare = Number.isFinite(calculatedGlare) ? Math.max(0, Math.min(1, calculatedGlare)) : 0;
          glareRef.current.style.opacity = `${safeGlare}`;
        }
      }
    };

    const handleScroll = () => {
      if (!isScheduled) {
        isScheduled = true;
        animId = requestAnimationFrame(updateParallax);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    updateParallax();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      cancelAnimationFrame(animId);
    };
  }, [speed]);

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl md:rounded-3xl border border-[#223326] bg-[#101913] transition-colors duration-300 hover:border-[#c89b58]/50 hover:shadow-2xl hover:shadow-[#c89b58]/10 ${containerClassName} ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className={`relative w-full overflow-hidden ${aspectClass}`}>
        {/* Parallax Translating Image Container */}
        <div
          ref={imageWrapperRef}
          className="absolute inset-0 w-full h-full will-change-transform"
          style={{ transform: 'translate3d(0, 0px, 0) scale(1.15)' }}
        >
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            onLoad={() => setIsLoaded(true)}
            className={`w-full h-full object-cover object-center transition-opacity duration-500 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            } group-hover:scale-[1.03] transition-transform duration-700 ${className}`}
          />
        </div>

        {/* Dynamic Sunbeam Glare sweeping smoothly with scroll */}
        <div
          ref={glareRef}
          style={{
            opacity: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(200,155,88,0.15) 40%, transparent 80%)',
            pointerEvents: 'none'
          }}
          className="absolute inset-0 mix-blend-overlay"
        />

        {/* Cinematic Vignette & Ambient Gradient */}
        {overlayGradient && (
          <div className="absolute inset-0 bg-gradient-to-t from-[#090e0b]/90 via-[#090e0b]/20 to-transparent pointer-events-none transition-opacity duration-300 group-hover:opacity-80" />
        )}

        {/* Optional Floating Metadata Badge */}
        {badge && (
          <div className="absolute top-4 left-4 z-20">
            <span className="px-3 py-1 rounded-full bg-[#0d1410]/80 backdrop-blur-md border border-[#2b3e30] text-[10px] font-mono tracking-widest text-[#f5d7a1] uppercase shadow-lg">
              {badge}
            </span>
          </div>
        )}

        {/* Caption & EXIF Details Overlay */}
        {(caption || exif) && (
          <div className="absolute bottom-0 inset-x-0 p-5 md:p-6 z-20 flex flex-col justify-end">
            {caption && (
              <p className="text-xs md:text-sm font-serif text-[#fdfbf7] line-clamp-2 leading-relaxed text-shadow">
                {caption}
              </p>
            )}

            {exif && (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-mono text-[#a89d8c] mt-2 pt-2 border-t border-[#334637]/50">
                {exif.camera && <span>{exif.camera}</span>}
                {exif.lens && <span>• {exif.lens}</span>}
                {exif.aperture && <span>• {exif.aperture}</span>}
                {exif.shutter && <span>• {exif.shutter}</span>}
                {exif.iso && <span>• ISO {exif.iso}</span>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
