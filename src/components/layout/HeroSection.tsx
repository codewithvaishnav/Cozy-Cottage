import React from 'react';
import { Compass, Sparkles, ArrowDown, ChevronRight, Eye, Camera, Sun, Wind } from 'lucide-react';
import { AtmosphericMood } from '../../types';
import { useScrollPhysics } from '../../hooks/useScrollPhysics';

interface HeroSectionProps {
  mood: AtmosphericMood;
  onExplore3D: () => void;
  onOpenBooking: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ mood, onExplore3D, onOpenBooking }) => {
  const { scrollY } = useScrollPhysics();

  return (
    <section className="relative pt-32 md:pt-40 pb-16 px-6 lg:px-12 bg-gradient-to-b from-[#090e0b] via-[#0b130f] to-[#0c120e] text-[#f3efe6] overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        {/* Top Badges & Live Status */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#213326] pb-6">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-ping" />
            <span className="text-xs font-mono tracking-widest text-[#d8cdbd] uppercase">
              Estate Sanctuary Open for Seasonal Residency
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-[#8a998d]">
            <span className="flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-[#c89b58]" />
              <span>72°F (22°C) • GENTLE CANOPY BREEZE</span>
            </span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">120 ACRES REGENERATIVE BOTANY</span>
          </div>
        </div>

        {/* Hero Title & Editorial Narrative with Parallax Pitch */}
        <div
          style={{
            transform: `translate3d(0, ${(Number.isFinite(scrollY) ? scrollY * 0.08 : 0).toFixed(1)}px, 0)`
          }}
          className="space-y-6 max-w-5xl will-change-transform"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121c15] border border-[#2b3e30] text-[#c89b58] text-xs font-mono tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Whistling Woods • Luxury Farmhouse & Pool Villa</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-light tracking-tight text-[#fdfbf7] leading-[1.05]">
            Vibrant Geometry Meets{' '}
            <span className="italic font-normal text-shimmer">
              Azure Pool Waters.
            </span>
          </h1>

          <p className="text-[#b3a896] max-w-2xl text-base sm:text-lg md:text-xl font-light leading-relaxed">
            An exclusive contemporary farmhouse retreat featuring signature sunshine yellow & slate geometric facades, private 35-foot swimming pool, pillared veranda lounges, and starlit cyan night illuminations.
          </p>
        </div>

        {/* Interactive Call-to-Actions & Quick Actions */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            id="hero-explore-3d-btn"
            onClick={onExplore3D}
            className="px-8 py-4 rounded-full bg-[#c89b58] text-[#0d1310] font-semibold text-xs font-mono uppercase tracking-widest hover:bg-[#e0b575] transition-all flex items-center gap-2 shadow-2xl shadow-[#c89b58]/30"
          >
            <Eye className="w-4 h-4" />
            <span>Explore 3D Model (Pixar / Toon)</span>
          </button>

          <a
            href="#real-farmhouse-tour"
            className="px-8 py-4 rounded-full bg-[#121c15] border border-[#2e4033] text-[#ded5c6] font-medium text-xs font-mono uppercase tracking-widest hover:border-[#c89b58] hover:text-white transition-all flex items-center gap-2"
          >
            <Camera className="w-4 h-4 text-[#c89b58]" />
            <span>Real Photo Spatial Tour</span>
          </a>

          <button
            onClick={onOpenBooking}
            className="px-8 py-4 rounded-full bg-transparent border border-[#243729] text-[#a89d8c] font-medium text-xs font-mono uppercase tracking-widest hover:border-[#c89b58] hover:text-[#f5d7a1] transition-all flex items-center gap-2 ml-auto"
          >
            <span>Reserve Villa Stay</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bottom Feature Pill Strip with Counter-Parallax */}
        <div
          style={{
            transform: `translate3d(0, ${(Number.isFinite(scrollY) ? scrollY * 0.03 : 0).toFixed(1)}px, 0)`
          }}
          className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-[#1c2a20] text-xs font-mono text-[#8a998d] will-change-transform"
        >
          <div className="space-y-1">
            <span className="text-[#5c6e61] block">01 / ARCHITECTURE</span>
            <span className="text-[#ded5c6]">L-Shaped Geometric Villa</span>
          </div>
          <div className="space-y-1">
            <span className="text-[#5c6e61] block">02 / PRIVATE POOL</span>
            <span className="text-[#ded5c6]">35ft Crystal Azure Basin</span>
          </div>
          <div className="space-y-1">
            <span className="text-[#5c6e61] block">03 / NIGHT AMBIANCE</span>
            <span className="text-[#ded5c6]">Cyan Pillar LED Sconces</span>
          </div>
          <div className="space-y-1">
            <span className="text-[#5c6e61] block">04 / EXPANSIVE LAWN</span>
            <span className="text-[#ded5c6]">Bermuda Grass & Palm Grove</span>
          </div>
        </div>
      </div>
    </section>
  );
};
