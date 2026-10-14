import React, { useState } from 'react';
import { useScrollPhysics } from '../../hooks/useScrollPhysics';
import { 
  Compass, 
  Wind, 
  Mountain, 
  ChevronUp, 
  ChevronDown, 
  Layers, 
  Eye, 
  Camera, 
  Sparkles 
} from 'lucide-react';

export const ScrollVelocityHUD: React.FC = () => {
  const { elevation, scrollVelocity, normalizedVelocity, direction, speed, progress } = useScrollPhysics();
  const [isExpanded, setIsExpanded] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside
      aria-label="Scroll Physics and Estate Elevation HUD"
      className="fixed bottom-6 right-6 z-40 hidden md:block select-none"
    >
      <div className="flex flex-col items-end gap-2">
        {/* Expanded Navigation Matrix */}
        {isExpanded && (
          <div className="w-64 p-4 rounded-3xl bg-[#0b120e]/95 backdrop-blur-2xl border border-[#273d2f] shadow-2xl space-y-3 animate-fade-in text-xs font-mono text-[#f3efe6]">
            <div className="flex items-center justify-between border-b border-[#1e2f23] pb-2 text-[10px] text-[#8a998d] uppercase tracking-widest">
              <span className="flex items-center gap-1.5 text-[#c89b58]">
                <Layers className="w-3 h-3" />
                <span>Topographical Index</span>
              </span>
              <span>{(progress * 100).toFixed(0)}% DEPTH</span>
            </div>

            {/* Quick Glide Links */}
            <div className="space-y-1 text-xs">
              <a
                href="#estate-3d-viewport"
                onClick={() => setIsExpanded(false)}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-[#152219] transition-colors"
              >
                <span>01. 3D WebGL Sanctuary</span>
                <span className="text-[#8a998d] text-[10px]">420m</span>
              </a>
              <a
                href="#parallax-story-voyage"
                onClick={() => setIsExpanded(false)}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-[#152219] transition-colors"
              >
                <span>02. Parallax 4 Horizons</span>
                <span className="text-[#8a998d] text-[10px]">410-460m</span>
              </a>
              <a
                href="#gallery"
                onClick={() => setIsExpanded(false)}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-[#152219] transition-colors"
              >
                <span>03. Visual Photo Archive</span>
                <span className="text-[#8a998d] text-[10px]">Medium Format</span>
              </a>
              <a
                href="#stays"
                onClick={() => setIsExpanded(false)}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-[#152219] transition-colors"
              >
                <span>04. Havens & Suites</span>
                <span className="text-[#8a998d] text-[10px]">Residencies</span>
              </a>
            </div>

            {/* Kinetic Aerodynamic Readout */}
            <div className="pt-2 border-t border-[#1e2f23] text-[10px] space-y-1 text-[#8a998d]">
              <div className="flex justify-between">
                <span>Inertia Damping:</span>
                <span className="text-[#ded5c6]">60 FPS Smooth LERP</span>
              </div>
              <div className="flex justify-between">
                <span>Wind Vector:</span>
                <span className="text-[#c89b58]">
                  {direction === 'idle' ? 'Calm Alpine Breeze' : `${Math.abs(scrollVelocity)} px/s ${direction}`}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Floating Telemetry Capsule Button */}
        <div className="flex items-center gap-2 bg-[#0c140f]/90 backdrop-blur-xl border border-[#233527] rounded-full p-1.5 pl-4 shadow-2xl hover:border-[#c89b58]/60 transition-all">
          {/* Real-time Altitude */}
          <div className="flex items-center gap-2 pr-3 border-r border-[#203024] text-xs font-mono">
            <Mountain className="w-3.5 h-3.5 text-[#c89b58]" />
            <span className="text-[#ded5c6] font-medium">{elevation}M</span>
            <span className="text-[9px] text-[#6d7e72] uppercase">A.S.L.</span>
          </div>

          {/* Dynamic Scroll Speed Bar */}
          <div className="flex items-center gap-2 pr-2 text-xs font-mono">
            <Wind
              className={`w-3.5 h-3.5 ${
                speed > 0.15 ? 'text-[#4ade80] animate-pulse' : 'text-[#8a998d]'
              }`}
            />
            <div className="w-12 h-1.5 rounded-full bg-[#18261e] overflow-hidden">
              <div
                style={{ width: `${Math.min(100, speed * 100)}%` }}
                className={`h-full transition-all duration-150 ${
                  direction === 'down' ? 'bg-[#4ade80]' : direction === 'up' ? 'bg-[#38bdf8]' : 'bg-[#c89b58]'
                }`}
              />
            </div>
          </div>

          {/* Toggle Expand Menu Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title="Toggle Topography Index"
            className="w-8 h-8 rounded-full bg-[#152219] hover:bg-[#203024] border border-[#2d4032] flex items-center justify-center text-[#ded5c6] transition-colors"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </aside>
  );
};
