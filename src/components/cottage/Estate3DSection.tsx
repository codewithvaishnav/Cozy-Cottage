import React, { useState } from 'react';
import { Estate3DScene } from '../3d/Estate3DScene';
import { soundscape } from '../audio/SoundscapeEngine';
import { AtmosphericMood, LandmarkHotspot } from '../../types';

export const Estate3DSection: React.FC = () => {
  const [mood, setMood] = useState<AtmosphericMood>('dawn');
  const [activeHotspot, setActiveHotspot] = useState<LandmarkHotspot | null>(null);

  const handleMoodChange = (newMood: AtmosphericMood) => {
    setMood(newMood);
    soundscape.setMood(newMood);
  };

  return (
    <section id="estate-3d" className="py-16 sm:py-24 md:py-32 relative z-10">
      <div className="w-[min(calc(100%-24px),1240px)] sm:w-[min(calc(100%-36px),1240px)] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-10 gap-4 sm:gap-6">
          <div>
            <div className="inline-flex items-center gap-3 text-[#f5f0e8]/70 text-xs sm:text-sm uppercase tracking-[0.22em] mb-3">
              <span className="w-10 sm:w-12 h-px bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent" />
              <span>Interactive 3D Model</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl leading-[1.08] tracking-tight text-[#f7f5ee]">
              Real Time 3D <span className="text-[#c9a84c]">View</span>
            </h2>
            <p className="text-xs sm:text-base text-[#f5f0e8]/75 max-w-2xl font-light mt-2 sm:mt-3">
              Explore the villa architecture, swimming pools, serene drifting clouds across the skybox, and surrounding countryside village in our real-time 3D simulation.
            </p>
          </div>
        </div>

        {/* 3D Canvas Card Container */}
        <div className="relative rounded-2xl sm:rounded-[28px] overflow-hidden border border-[#52b788]/20 bg-[#0c2317] shadow-[0_30px_90px_rgba(3,18,10,0.6)] h-[440px] xs:h-[500px] sm:h-[580px] md:h-[640px] lg:h-[700px] w-full">
          <Estate3DScene
            mood={mood}
            activeHotspotId={activeHotspot ? activeHotspot.id : null}
            onSelectHotspot={(hotspot) => setActiveHotspot(hotspot)}
            onMoodChange={handleMoodChange}
          />
        </div>
      </div>
    </section>
  );
};
