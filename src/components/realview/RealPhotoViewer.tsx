import React, { useState } from 'react';
import { Camera, Sun, Moon, Sparkles, MapPin, Eye, Maximize2, Check, ArrowRight, Layers } from 'lucide-react';
import { AtmosphericMood } from '../../types';

interface RealPhotoViewerProps {
  mood: AtmosphericMood;
  onOpenBooking?: () => void;
}

interface RealPhotoSpot {
  id: string;
  name: string;
  category: string;
  x: number; // percentage from left
  y: number; // percentage from top
  description: string;
  tag: string;
}

export const RealPhotoViewer: React.FC<RealPhotoViewerProps> = ({ mood, onOpenBooking }) => {
  // Photo scenes matching the 3 uploaded images:
  // Scene 1: Daytime Panorama (L-shaped villa, pool, lawn, palm fronds)
  // Scene 2: Daytime Poolside Veranda close-up (blue tiles, pillars, wood ceiling)
  // Scene 3: Nighttime Pool Glow (cyan sconces, warm windows, underwater lights)
  const [activeSceneIndex, setActiveSceneIndex] = useState<number>(0);
  const [activePin, setActivePin] = useState<RealPhotoSpot | null>(null);
  const [mouseOffset, setMouseOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const scenes = [
    {
      id: 'day-panorama',
      title: 'Daylight Overview & Lawn',
      time: 'Daytime Sunlight',
      url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=2400&q=90',
      description: 'Full panoramic view of the L-shaped contemporary farmhouse featuring sunshine yellow gable facades, slate grey geometric murals, white veranda pillars, the 35ft azure swimming pool, and front lawn.',
      hotspots: [
        {
          id: 'geom-wall',
          name: 'Geometric Yellow & Slate Murals',
          category: 'Architecture',
          x: 62,
          y: 48,
          description: 'Contemporary triangular and chevron color-block wall art connecting the long wing suites with vibrant sunny yellow and charcoal slate finishes.',
          tag: 'Exterior Finish'
        },
        {
          id: 'azure-pool',
          name: '35ft Azure Tiled Pool',
          category: 'Pool & Lounge',
          x: 55,
          y: 65,
          description: 'Custom sunken swimming pool tucked into the inner angle of the L-shape, bordered by polished dark granite coping and natural stone walkway.',
          tag: 'Private Amenity'
        },
        {
          id: 'veranda-columns',
          name: 'Pillared Veranda Porch',
          category: 'Outdoor Living',
          x: 48,
          y: 52,
          description: '4 bold white square structural columns supporting the covered veranda with warm wood ceiling overhang and potted tropical greenery.',
          tag: 'Shaded Lounge'
        },
        {
          id: 'yellow-gable',
          name: 'Sunshine Yellow Gable Wing',
          category: 'Suites',
          x: 23,
          y: 45,
          description: 'Pitched gable facade housing private guest rooms with high ceilings, white-trim panoramic windows, and private sheltered entryway.',
          tag: 'Guest Quarters'
        }
      ]
    },
    {
      id: 'pool-close',
      title: 'Poolside Veranda & Deck',
      time: 'Midday Pool View',
      url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=2400&q=90',
      description: 'Close-up perspective of the crystal clear water, submerged blue mosaic floor, stainless steel entry ladder, stone paver perimeter, and potted areca palms.',
      hotspots: [
        {
          id: 'water-tiles',
          name: 'Crystal Blue Mosaic Floor',
          category: 'Pool Design',
          x: 50,
          y: 70,
          description: 'High-clarity chlorinated and filtered water reflecting the open blue sky and the surrounding modern villa architecture.',
          tag: 'Deep Basin'
        },
        {
          id: 'pool-ladder',
          name: 'Stainless Steel Entry Ladder',
          category: 'Accessibility',
          x: 21,
          y: 60,
          description: 'Ergonomic curved stainless steel steps allowing effortless entry and exit from the shallow and deep ends.',
          tag: 'Safety & Comfort'
        },
        {
          id: 'potted-plants',
          name: 'Veranda Potted Planters',
          category: 'Botany',
          x: 35,
          y: 48,
          description: 'Arrangement of terracotta and glazed ceramic planters featuring lush areca palms and tropical foliage along the raised veranda deck.',
          tag: 'Tropical Flora'
        }
      ]
    },
    {
      id: 'night-illumination',
      title: 'Night Glow & Cyan Pillar Sconces',
      time: 'Starlit Evening',
      url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=2400&q=90',
      description: 'Evening ambiance with glowing turquoise/cyan LED sconces on every white pillar, submerged pool floodlights casting an electric blue water glow, and warm golden windows.',
      hotspots: [
        {
          id: 'cyan-sconces',
          name: 'Turquoise / Cyan Pillar Sconces',
          category: 'Smart Lighting',
          x: 65,
          y: 40,
          description: 'Custom vertical up-and-down LED fixtures illuminating each white column with vibrant electric cyan light beams.',
          tag: 'Architectural Lighting'
        },
        {
          id: 'underwater-glow',
          name: 'Submerged Electric-Blue Pool Lights',
          category: 'Poolside Ambiance',
          x: 48,
          y: 72,
          description: 'Waterproof high-lumen floodlights illuminating the water from within, creating a mesmerizing glowing oasis for evening swims.',
          tag: 'Night Swimming'
        },
        {
          id: 'warm-windows',
          name: 'Golden Interior Radiance',
          category: 'Interior Glow',
          x: 46,
          y: 35,
          description: 'Warm 2700K ambient light glowing from inside the bedrooms and living suites, reflecting on the polished veranda tiles.',
          tag: 'Cozy Atmosphere'
        },
        {
          id: 'perimeter-strip',
          name: 'Perimeter Wall LED Ambient Strip',
          category: 'Garden Lighting',
          x: 8,
          y: 38,
          description: 'Linear warm LED light running along the top of the boundary fence, softly framing the expansive lawn at night.',
          tag: 'Boundary Glow'
        }
      ]
    }
  ];

  const currentScene = scenes[activeSceneIndex];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 16;
    setMouseOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  return (
    <section id="real-farmhouse-tour" className="py-20 px-6 lg:px-12 bg-[#090e0b] border-t border-[#1a281e] text-[#f3efe6]">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121c15] border border-[#2b3e30] text-[#c89b58] text-xs font-mono uppercase tracking-widest">
              <Camera className="w-3.5 h-3.5" />
              <span>Real Property Photo Tour & Spatial Analysis</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif text-[#fdfbf7]">
              The Whistling Woods <span className="italic font-light text-[#c89b58]">Architecture</span>
            </h2>
            <p className="text-sm md:text-base text-[#b0a594] max-w-2xl leading-relaxed">
              Explore the real physical architecture of our L-shaped villa, private 35ft pool, and vibrant day-to-night lighting choreography. Click on any interactive pin to inspect specific features.
            </p>
          </div>

          {/* Scene Switcher Buttons */}
          <div className="flex flex-wrap items-center gap-2 bg-[#101913] p-1.5 rounded-2xl border border-[#233527]">
            {scenes.map((sc, idx) => (
              <button
                key={sc.id}
                onClick={() => {
                  setActiveSceneIndex(idx);
                  setActivePin(null);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 ${
                  activeSceneIndex === idx
                    ? 'bg-[#c89b58] text-[#090e0b] font-bold shadow-lg'
                    : 'text-[#9cb09f] hover:text-white hover:bg-[#18261c]'
                }`}
              >
                {idx === 2 ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
                <span>{sc.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main 2.5D Interactive Photo Container */}
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative aspect-[16/9] md:aspect-[21/10] rounded-3xl overflow-hidden border border-[#263b2d] bg-[#0c130e] group shadow-2xl"
        >
          {/* Real Photo with Smooth 2.5D Gyro Parallax */}
          <div
            style={{
              transform: `scale(1.06) translate3d(${mouseOffset.x}px, ${mouseOffset.y}px, 0)`,
              transition: 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)'
            }}
            className="w-full h-full relative"
          >
            <img
              src={currentScene.url}
              alt={currentScene.title}
              className="w-full h-full object-cover"
            />

            {/* Subtle Lighting Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#090e0b] via-transparent to-transparent opacity-70" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#090e0b]/40 via-transparent to-[#090e0b]/40" />
          </div>

          {/* Interactive Radar Hotspot Pins */}
          {currentScene.hotspots.map(pin => {
            const isSelected = activePin?.id === pin.id;
            return (
              <div
                key={pin.id}
                style={{
                  left: `${pin.x}%`,
                  top: `${pin.y}%`,
                  transform: `translate(-50%, -50%) translate3d(${mouseOffset.x * 0.6}px, ${mouseOffset.y * 0.6}px, 0)`
                }}
                className="absolute z-20 group/pin"
              >
                <button
                  onClick={() => setActivePin(isSelected ? null : pin)}
                  className={`relative flex items-center justify-center p-2 rounded-full backdrop-blur-md transition-all duration-300 shadow-2xl ${
                    isSelected
                      ? 'bg-[#c89b58] text-[#090e0b] scale-125 ring-4 ring-[#c89b58]/40'
                      : 'bg-[#090e0b]/85 border border-[#3b5240] text-[#f5d7a1] hover:border-[#c89b58] hover:scale-110'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#c89b58] animate-ping" />
                </button>

                {/* Hover Label */}
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 hidden group-hover/pin:block pointer-events-none z-30">
                  <div className="px-3 py-1 rounded-lg bg-[#0c140f]/90 backdrop-blur-md border border-[#2f4435] text-[11px] font-mono text-[#f3efe6] whitespace-nowrap shadow-xl">
                    {pin.name}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Top Scene Info Badge */}
          <div className="absolute top-5 left-5 pointer-events-none z-20">
            <div className="px-4 py-2 rounded-2xl bg-[#090e0b]/85 backdrop-blur-md border border-[#2b3e30] flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#c89b58] animate-pulse" />
              <div>
                <span className="text-[10px] font-mono text-[#788a7c] uppercase block">{currentScene.time}</span>
                <span className="text-xs font-mono text-[#ded5c6] font-bold">{currentScene.title}</span>
              </div>
            </div>
          </div>

          {/* Active Pin Detailed Popover */}
          {activePin && (
            <div className="absolute bottom-5 left-5 right-5 md:right-auto md:max-w-md p-5 rounded-2xl bg-[#0b130e]/95 backdrop-blur-md border border-[#c89b58]/60 shadow-2xl space-y-3 z-30 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#18281d] text-[#c89b58] border border-[#2b4232]">
                  {activePin.category}
                </span>
                <span className="text-[11px] font-mono text-[#8a998d]">{activePin.tag}</span>
              </div>
              <h4 className="text-lg font-serif text-[#fdfbf7]">{activePin.name}</h4>
              <p className="text-xs text-[#c4b9a8] leading-relaxed">{activePin.description}</p>
              <div className="flex items-center justify-between pt-2 border-t border-[#1e2f23]">
                <span className="text-[10px] font-mono text-[#6e8072]">Verified Architectural Feature</span>
                <button
                  onClick={() => setActivePin(null)}
                  className="text-xs font-mono text-[#c89b58] hover:underline"
                >
                  Close Pin
                </button>
              </div>
            </div>
          )}

          {/* Bottom Interactive Hint */}
          {!activePin && (
            <div className="absolute bottom-5 left-5 pointer-events-none z-20 hidden md:block">
              <div className="px-4 py-1.5 rounded-full bg-[#090e0b]/70 backdrop-blur-md border border-[#233527] text-[11px] font-mono text-[#8a998d] flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#c89b58]" />
                <span>Move mouse for 2.5D tilt • Click map pins for architectural specs</span>
              </div>
            </div>
          )}
        </div>

        {/* Feature Cards Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-6 rounded-3xl bg-[#111914] border border-[#233527] space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1a281e] border border-[#2f4435] flex items-center justify-center text-[#c89b58]">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-serif text-[#fdfbf7]">L-Shaped Modern Layout</h4>
            <p className="text-xs text-[#a89d8d] leading-relaxed">
              Engineered to embrace the swimming pool at its center, allowing every bedroom suite direct walkout access and sightlines to the water.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#111914] border border-[#233527] space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1a281e] border border-[#2f4435] flex items-center justify-center text-[#c89b58]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-serif text-[#fdfbf7]">Vibrant Geometric Murals</h4>
            <p className="text-xs text-[#a89d8d] leading-relaxed">
              Signature bright yellow and slate-grey triangular wall accents create a playful, energetic contemporary identity in the countryside.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#111914] border border-[#233527] space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1a281e] border border-[#2f4435] flex items-center justify-center text-[#c89b58]">
              <Moon className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-serif text-[#fdfbf7]">Night Cyan Sconce Symphony</h4>
            <p className="text-xs text-[#a89d8d] leading-relaxed">
              Integrated turquoise pillar wall sconces and underwater pool lights convert the farmhouse into an enchanting glowing oasis after sunset.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
