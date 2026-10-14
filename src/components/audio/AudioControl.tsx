import React, { useState, useEffect } from 'react';
import { soundscape } from './SoundscapeEngine';
import { AtmosphericMood } from '../../types';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioControlProps {
  mood?: AtmosphericMood;
}

export const AudioControl: React.FC<AudioControlProps> = ({ mood }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (mood) {
      soundscape.setMood(mood);
    }
  }, [mood]);

  const handleToggle = () => {
    const active = soundscape.toggle();
    setIsPlaying(active);
  };

  return (
    <button
      id="nature-soundscape-btn"
      type="button"
      onClick={handleToggle}
      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all border shadow-lg ${
        isPlaying
          ? 'bg-[#12281d] text-[#74c69d] border-[#52b788]/80 shadow-[0_0_15px_rgba(82,183,136,0.3)]'
          : 'bg-[#091610]/80 text-[#a3b18a] border-[#52b788]/20 hover:border-[#52b788] hover:text-white'
      }`}
      title={isPlaying ? 'Mute Sanctuary Soundscape (100%)' : 'Listen to Woodland Nature Ambience (100%)'}
    >
      {isPlaying ? (
        <>
          <Volume2 className="w-3.5 h-3.5 text-[#52b788] animate-bounce" />
          <span className="font-semibold">Ambience: 100%</span>
        </>
      ) : (
        <>
          <VolumeX className="w-3.5 h-3.5 text-[#74c69d]/60" />
          <span>Forest Soundscape</span>
        </>
      )}
    </button>
  );
};
