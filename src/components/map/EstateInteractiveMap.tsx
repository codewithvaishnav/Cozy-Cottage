import React, { useState } from 'react';
import { LANDMARK_HOTSPOTS } from '../../data/estateData';
import { LandmarkHotspot } from '../../types';
import { MapPin, Compass, Mountain, Eye, Trees, Sparkles, Navigation } from 'lucide-react';

interface EstateInteractiveMapProps {
  onSelectHotspot: (hotspot: LandmarkHotspot) => void;
}

export const EstateInteractiveMap: React.FC<EstateInteractiveMapProps> = ({ onSelectHotspot }) => {
  const [hoveredLandmark, setHoveredLandmark] = useState<LandmarkHotspot | null>(null);

  return (
    <section id="estate-map" className="relative py-24 px-6 lg:px-12 bg-[#090e0b] text-[#f3efe6]">
      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#233528] pb-8">
          <div className="space-y-3">
            <span className="text-xs font-mono tracking-widest text-[#c89b58] uppercase flex items-center gap-2">
              <Compass className="w-3.5 h-3.5" />
              <span>120-Acre Protected Botanical Territory</span>
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-[#fdfbf7] tracking-tight">
              Estate Topography & Sanctuaries
            </h2>
            <p className="text-[#a69c8c] max-w-xl text-sm md:text-base leading-relaxed">
              Explore the interconnected ecosystems—from high alpine pine trails to south-facing vineyard terraces and thermal springs.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-[#8a9b8d]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#c89b58]" />
              <span>Historic Landmarks</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4ade80]" />
              <span>Bio-Intensive Flora</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8]" />
              <span>Thermal Spring</span>
            </div>
          </div>
        </div>

        {/* Interactive Tactical Blueprint Map Canvas Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-8 bg-[#0e1611] border border-[#26372b] rounded-3xl p-6 md:p-8 relative min-h-[480px] flex flex-col justify-between overflow-hidden shadow-2xl">
            {/* Architectural Grid Blueprint overlay */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#c89b58 1px, transparent 1px), linear-gradient(to right, #25382b 1px, transparent 1px), linear-gradient(to bottom, #25382b 1px, transparent 1px)',
                backgroundSize: '40px 40px, 80px 80px, 80px 80px'
              }}
            />

            {/* Top Blueprint Coordinates Header */}
            <div className="flex items-center justify-between text-xs font-mono text-[#8d9e90] relative z-10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#c89b58] animate-pulse" />
                <span className="text-[#f5d7a1]">LIVE TOPOGRAPHICAL RADAR</span>
              </div>
              <span>SCALE 1:2500 • TOTAL 120 HA</span>
            </div>

            {/* Visual Tactical Layout Elements (SVG-based Blueprint Trails) */}
            <div className="relative w-full h-80 my-4 flex items-center justify-center">
              <svg className="w-full h-full absolute inset-0 text-[#253d2d] stroke-current stroke-1 fill-none" viewBox="0 0 800 400">
                {/* Elevation Contours */}
                <path d="M50,320 Q250,280 400,310 T750,330" strokeDasharray="4 4" />
                <path d="M80,240 Q280,210 440,240 T720,260" strokeDasharray="4 4" />
                <path d="M120,160 Q300,140 480,170 T680,180" strokeDasharray="4 4" />
                {/* Mountain Stream */}
                <path d="M100,50 Q220,160 380,220 T650,380" stroke="#38bdf8" strokeWidth="2.5" opacity="0.4" />
                {/* Walking Trail */}
                <path d="M220,120 L400,180 L560,130 L620,260 L380,280 Z" stroke="#c89b58" strokeWidth="1.5" strokeDasharray="6 6" opacity="0.6" />
              </svg>

              {/* Landmark Pins Positioned across the Map */}
              {LANDMARK_HOTSPOTS.map((landmark) => {
                const positions: Record<string, { top: string; left: string }> = {
                  master_suites: { top: '38%', left: '60%' },
                  geometric_villa: { top: '35%', left: '32%' },
                  manicured_lawn: { top: '68%', left: '55%' }
                };

                const pos = positions[landmark.id] || { top: '50%', left: '50%' };
                const isHovered = hoveredLandmark?.id === landmark.id;

                return (
                  <div
                    key={landmark.id}
                    style={{ top: pos.top, left: pos.left }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                  >
                    <button
                      id={`map-node-${landmark.id}`}
                      onClick={() => {
                        onSelectHotspot(landmark);
                        // Scroll to 3D scene smoothly
                        document.getElementById('estate-3d-viewport')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      onMouseEnter={() => setHoveredLandmark(landmark)}
                      onMouseLeave={() => setHoveredLandmark(null)}
                      className={`group relative p-3 rounded-full border transition-all duration-300 flex items-center justify-center ${
                        isHovered
                          ? 'bg-[#c89b58] text-[#0d1310] border-[#f5d7a1] scale-125 shadow-xl shadow-[#c89b58]/40'
                          : 'bg-[#111c15] text-[#d4caaf] border-[#384e3d] hover:border-[#c89b58]'
                      }`}
                    >
                      <MapPin className="w-4 h-4" />
                      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-mono whitespace-nowrap bg-[#090e0b]/90 border border-[#2b3a2f] px-2 py-0.5 rounded text-[#e0d8ca] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                        {landmark.name}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Bottom Map Callout */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#233528] text-xs font-mono text-[#8d9e90] relative z-10">
              <span className="flex items-center gap-2">
                <Navigation className="w-3.5 h-3.5 text-[#c89b58]" />
                Click any zone marker to pilot the 3D cinematic camera directly to it.
              </span>
              <a
                href="#estate-3d-viewport"
                className="text-[#c89b58] hover:text-[#f5d7a1] font-semibold flex items-center gap-1"
              >
                <span>Launch 3D Viewport</span>
                <span>↑</span>
              </a>
            </div>
          </div>

          {/* Right: Selected Landmark Inspector Panel */}
          <div className="lg:col-span-4 bg-[#101813] border border-[#243729] rounded-3xl p-6 md:p-8 flex flex-col justify-between space-y-6">
            {hoveredLandmark ? (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-1">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[#c89b58] px-2.5 py-0.5 rounded-full bg-[#c89b58]/15 border border-[#c89b58]/30">
                    {hoveredLandmark.category}
                  </span>
                  <h3 className="text-2xl font-serif text-[#fdfbf7] pt-1">{hoveredLandmark.name}</h3>
                  <p className="text-xs text-[#c89b58] font-serif italic">{hoveredLandmark.subtitle}</p>
                </div>

                <div className="aspect-[16/10] rounded-2xl overflow-hidden border border-[#2a3e30]">
                  <img
                    src={hoveredLandmark.photoUrl}
                    alt={hoveredLandmark.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <p className="text-xs text-[#b8ab97] leading-relaxed font-sans">{hoveredLandmark.description}</p>

                <div className="space-y-1.5 pt-2 border-t border-[#213326] text-xs font-mono text-[#8a9b8d]">
                  <div><span className="text-[#5b6e60]">Elevation:</span> <span className="text-[#ded5c6]">{hoveredLandmark.elevation}</span></div>
                  <div><span className="text-[#5b6e60]">Origin:</span> <span className="text-[#ded5c6]">{hoveredLandmark.yearBuilt}</span></div>
                </div>

                <button
                  onClick={() => {
                    onSelectHotspot(hoveredLandmark);
                    document.getElementById('estate-3d-viewport')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-2.5 rounded-full bg-[#c89b58] text-[#0d1310] font-semibold text-xs uppercase tracking-wider font-mono hover:bg-[#e0b575] transition-colors flex items-center justify-center gap-2"
                >
                  <span>Fly to 3D Landmark</span>
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center my-auto space-y-4 py-8">
                <div className="w-14 h-14 rounded-2xl bg-[#18241d] border border-[#2d4032] flex items-center justify-center text-[#c89b58]">
                  <Mountain className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-serif text-[#fdfbf7]">Select an Estate Sanctuary</h4>
                  <p className="text-xs text-[#9ea094] max-w-xs">
                    Hover over any pinpoint on the blueprint or click to inspect historical provenance, agriculture methods, and architecture.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
