import React, { useEffect, useState } from 'react';

export const ScrollProgressBar: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = window.scrollY || document.documentElement.scrollTop;
          const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = scrollHeight > 0 ? Math.min(Math.max(scrollTop / scrollHeight, 0), 1) : 0;
          setScrollProgress(progress);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[2.5px] z-50 pointer-events-none bg-[#0a2015]/30 backdrop-blur-[2px]"
    >
      {/* Sage gradient progress bar with GPU-accelerated scaleX */}
      <div
        className="h-full w-full bg-gradient-to-r from-[#2d6a4f] via-[#52b788] to-[#95d5b2] shadow-[0_0_10px_rgba(82,183,136,0.65),0_0_3px_rgba(116,198,157,0.9)] origin-left will-change-transform transition-transform duration-75 ease-out"
        style={{
          transform: `scaleX(${scrollProgress})`,
        }}
      />
      {/* Delicate leading-edge glow spark */}
      {scrollProgress > 0.005 && scrollProgress < 0.995 && (
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-2 rounded-full bg-[#f7f5ee] filter blur-[1.5px] opacity-90 shadow-[0_0_8px_#52b788,0_0_14px_#dda15e] pointer-events-none transition-transform duration-75 ease-out"
          style={{
            left: `calc(${scrollProgress * 100}% - 8px)`,
          }}
        />
      )}
    </div>
  );
};
