import React from 'react';
import { ForestParallaxLayer } from './ForestParallaxLayer';

interface HeroSectionProps {
  onExplore3D: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExplore3D }) => {
  const waUrl = "https://wa.me/919052310001?text=Hi%2C%20I%27d%20like%20to%20book%20Cozy%20Cottage%21%20%F0%9F%8F%A1%0A%0AHere%20are%20my%20details%3A%0A%0A%F0%9F%93%85%20Date%20of%20Booking%3A%20%0A%F0%9F%91%A5%20Number%20of%20Guests%3A%20%0A%F0%9F%8E%89%20Purpose%20of%20Visit%3A%20%0A%0ALooking%20forward%20to%20hearing%20from%20you%21";

  return (
    <section id="hero" className="min-h-[100svh] relative flex flex-col justify-center overflow-hidden pt-20 xs:pt-24 sm:pt-36 pb-8 xs:pb-10 sm:pb-20">
      {/* Background Image / Nature Mood Layer */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src="/unnamed.webp"
          alt="Cozy Cottage luxury sanctuary"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter saturate-110 brightness-[0.70] contrast-[1.03] scale-100"
        />
        {/* Organic Forest Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a2015]/65 via-[#0a2015]/20 via-50% to-[#0a2015]/90 pointer-events-none" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#0a2015]/15 to-[#0a2015]/75 pointer-events-none" />
      </div>

      {/* Floating Parallax Botanical Leaves & Soft Forest Bokeh Layer */}
      <ForestParallaxLayer />

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-3.5 sm:px-6 text-center flex flex-col items-center">
        {/* Location & Heritage Tag with Backdrop Blur & Blinking Glowing Green Dot */}
        <div className="flex justify-center mb-3 sm:mb-6">
          <div className="inline-flex items-center gap-2 xs:gap-2.5 px-3.5 xs:px-4 sm:px-5 py-1.5 sm:py-2 rounded-full border border-[#52b788]/30 bg-[#0a1f15]/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.37)] text-[#e8f5ed] text-[9px] xs:text-[10px] sm:text-xs tracking-[0.15em] uppercase font-medium">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ade80] opacity-80" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22c55e] shadow-[0_0_10px_#4ade80,0_0_18px_#22c55e]" />
            </span>
            <span>Shamirpet, Hyderabad &nbsp;·&nbsp; Private Farmhouse</span>
          </div>
        </div>

        {/* Main Editorial Headline with Nature Color Theory */}
        <h1 className="font-serif text-[1.75rem] xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.08] sm:leading-[1.04] tracking-tight mb-2.5 sm:mb-5 text-[#f7f5ee] max-w-4xl">
          Escape the city rush.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#74c69d] via-[#52b788] to-[#dda15e]">
            Find your peace in nature.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-[12px] xs:text-xs sm:text-base md:text-lg text-[#d8d3c5]/90 max-w-xl mx-auto mb-5 sm:mb-8 leading-relaxed font-light px-2">
          A secluded private farmhouse with sparkling pool, fireside evenings under starlit skies, and peaceful green surroundings for your group.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 xs:gap-2.5 sm:gap-4 w-full max-w-md sm:max-w-none">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center justify-center gap-2 min-h-[42px] xs:min-h-[44px] sm:min-h-[50px] px-4 xs:px-5 sm:px-7 rounded-full font-semibold transition-all text-xs sm:text-sm md:text-base cursor-pointer shadow-lg flex-1 xs:flex-initial"
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.943l6.284-1.649A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-4.988-1.362l-.357-.213-3.732.98.998-3.641-.234-.374A9.818 9.818 0 1112 21.818z" />
            </svg>
            <span>Book WhatsApp</span>
          </a>

          <button
            onClick={onExplore3D}
            type="button"
            className="btn-secondary inline-flex items-center justify-center gap-1.5 xs:gap-2 min-h-[42px] xs:min-h-[44px] sm:min-h-[50px] px-4 xs:px-5 sm:px-6 rounded-full font-medium transition-all text-xs sm:text-sm md:text-base cursor-pointer flex-1 xs:flex-initial"
          >
            <span>3D Estate</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>

          <a
            href="https://maps.app.goo.gl/yMPQjEHRnrGRMuJ2A?g_st=ac"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 min-h-[38px] xs:min-h-[40px] sm:min-h-[44px] px-3.5 xs:px-4 sm:px-5 rounded-full border border-[#52b788]/25 bg-[#0d1e16]/60 text-[11px] xs:text-xs sm:text-sm text-[#e8f5ed]/85 hover:text-[#74c69d] hover:border-[#52b788]/60 transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>Directions</span>
          </a>
        </div>

        {/* Hero Scroll Indicator - positioned directly below Directions button with toggle & text */}
        <button
          type="button"
          onClick={() => {
            const nextSection = document.getElementById('estate-3d') || document.getElementById('about');
            if (nextSection) {
              nextSection.scrollIntoView({ behavior: 'smooth' });
            } else {
              window.scrollBy({ top: window.innerHeight * 0.85, behavior: 'smooth' });
            }
          }}
          className="mt-4 xs:mt-5 sm:mt-7 flex flex-col items-center gap-1 text-[#74c69d]/85 hover:text-[#74c69d] text-[10px] xs:text-xs tracking-[0.2em] uppercase transition-colors cursor-pointer group focus:outline-none"
          aria-label="Scroll down to explore"
        >
          {/* Scroll Toggle */}
          <div className="w-5 h-8 sm:w-6 sm:h-9 rounded-full border border-[#52b788]/40 relative bg-[#0e1e16]/70 backdrop-blur-sm group-hover:border-[#52b788]/80 group-hover:shadow-[0_0_15px_rgba(82,183,136,0.3)] transition-all">
            <div className="w-1 h-1.5 sm:w-1.5 sm:h-2 bg-[#52b788] rounded-full absolute top-1.5 left-1/2 -translate-x-1/2 animate-scroll-dot" />
          </div>
          {/* Scroll Down text */}
          <span className="font-medium tracking-[0.2em] text-[#74c69d]/90 group-hover:text-[#95d5b2]">Scroll Down</span>
        </button>
      </div>
    </section>
  );
};
