import React from 'react';

export const CinematicSection: React.FC = () => {
  return (
    <section className="py-20 sm:py-32 md:py-44 relative overflow-hidden text-center">
      {/* Background Image & Nature Mood Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/hero.jpeg"
          alt="Cozy Cottage Illuminated Nature & Twilight Ambiance"
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.src.includes('lawn.jpeg')) {
              target.src = '/lawn.jpeg';
            }
          }}
          className="w-full h-full object-cover object-center filter brightness-[0.58] saturate-[1.15] contrast-[1.05] scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Soft emerald twilight vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2015]/80 via-[#0a2015]/35 to-[#0a2015]/90" />
        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-[#0a2015]/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-[min(calc(100%-24px),900px)] sm:w-[min(calc(100%-36px),900px)] mx-auto px-2 sm:px-4">
        

        <h2 className="font-serif text-3xl xs:text-4xl sm:text-6xl md:text-7xl leading-tight tracking-tight mb-4 sm:mb-6 text-[#f7f5ee]">
          Where Nature &amp; Serenity Turn<br />
          Into <span className="text-[#dda15e]">Cherished Memories</span>
        </h2>

        <p className="text-base sm:text-lg text-[#d8d3c5]/90 max-w-2xl mx-auto leading-relaxed font-light">
          Step away from urban rush into pure pine breezes. At Cozy Cottage, time slows down, conversations deepen beside the campfire, and nature restores your spirit.
        </p>
      </div>
    </section>
  );
};
