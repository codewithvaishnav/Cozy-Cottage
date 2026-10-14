import React, { useState, useEffect } from 'react';
import { soundscape } from '../audio/SoundscapeEngine';
import { Volume2, VolumeX } from 'lucide-react';

export const FloatingAudioButton: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsPlaying(soundscape.getIsPlaying());
  }, []);

  const handleToggle = () => {
    const active = soundscape.toggle();
    setIsPlaying(active);
  };

  return (
    <div
      className="fixed left-3.5 xs:left-5 sm:left-6 bottom-3.5 xs:bottom-5 sm:bottom-6 z-50 flex items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Floating Action Button - Matching WhatsApp circular floating style */}
      <button
        id="floating-volume-btn"
        type="button"
        onClick={handleToggle}
        aria-label={isPlaying ? 'Mute Nature Ambience (Volume 100%)' : 'Play Nature Ambience (Volume 100%)'}
        className={`w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:scale-105 cursor-pointer relative group 
          ${
          isPlaying
            ? 'bg-gradient-to-br from-[#2d6a4f] via-[#1b4332] to-[#0f2e21] text-[#74c69d] border-2 border-[#52b788]/80 shadow-[0_18px_36px_rgba(82,183,136,0.45)] hover:shadow-[0_24px_44px_rgba(82,183,136,0.55)]'
            : 'bg-gradient-to-br from-[#12281d] via-[#0e1f17] to-[#07130d] text-[#a3b18a] border border-[#52b788]/30 shadow-[0_14px_30px_rgba(0,0,0,0.6)] hover:border-[#52b788] hover:text-[#f7f5ee]'
        }`}
      >
        {/* Animated Pulsing Ring when Active (same as WhatsApp button) */}
        {isPlaying && (
          <div className="absolute inset-0 rounded-full border-2 border-[#52b788]/50 animate-wa-pulse pointer-events-none" />
        )}

        {/* Audio Icon with Frequency Equalizer Bars */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          {isPlaying ? (
            <div className="flex flex-col items-center">
              <Volume2 className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 text-[#74c69d] transition-transform duration-300 group-hover:scale-110" />
              {/* Micro Equalizer Frequency Bars */}
              {/* <div className="flex items-center gap-0.5 mt-0.5">
                <span className="w-0.5 h-1.5 sm:h-2 bg-[#52b788] rounded-full animate-pulse" style={{ animationDuration: '0.4s' }} />
                <span className="w-0.5 h-2.5 sm:h-3 bg-[#74c69d] rounded-full animate-pulse" style={{ animationDuration: '0.7s' }} />
                <span className="w-0.5 h-1 sm:h-1.5 bg-[#dda15e] rounded-full animate-pulse" style={{ animationDuration: '0.5s' }} />
                <span className="w-0.5 h-2 sm:h-2.5 bg-[#52b788] rounded-full animate-pulse" style={{ animationDuration: '0.6s' }} />
              </div> */}
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <VolumeX className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 text-[#a3b18a]/80 transition-transform duration-300 group-hover:scale-110" />
              {/* <span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-wider text-[#a3b18a]/70 font-semibold mt-0.5">
                Mute
              </span> */}
            </div>
          )}
        </div>
      </button>

      {/* Floating Pill Label Tooltip on Hover / Focus */}
      <div
        className={`hidden sm:flex items-center gap-2 ml-3 px-3 py-1.5 rounded-full bg-[#091610]/95 backdrop-blur-md border border-[#52b788]/30 shadow-xl pointer-events-none transition-all duration-300 
          // ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}
          `}
      >
        <span className="w-2 h-2 rounded-full bg-[#52b788] animate-ping" />
        {/* <span className="text-xs font-mono text-[#f5f0e8] whitespace-nowrap">
          {isPlaying ? 'Forest Ambience: 100%' : 'Tap for Sound: 100%'}
        </span> */}
      </div>
    </div>
  );
};
