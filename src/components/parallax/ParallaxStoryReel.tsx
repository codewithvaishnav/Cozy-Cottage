import React, { useRef, useState, useEffect } from 'react';
import { useScrollPhysics } from '../../hooks/useScrollPhysics';
import { ParallaxImage } from './ParallaxImage';
import { 
  Sparkles, 
  Compass, 
  ArrowDownRight, 
  Layers, 
  Wind, 
  Eye, 
  Sun, 
  Droplets, 
  Mountain, 
  Flame, 
  CheckCircle2, 
  Maximize2 
} from 'lucide-react';

interface StoryHorizon {
  id: string;
  chapter: string;
  title: string;
  subtitle: string;
  elevation: string;
  terroirNote: string;
  primaryImage: {
    src: string;
    alt: string;
    caption: string;
    badge: string;
    exif: {
      camera: string;
      lens: string;
      aperture: string;
      shutter: string;
      iso: string;
    };
  };
  accentImage: {
    src: string;
    alt: string;
    caption: string;
  };
  attributes: Array<{ label: string; value: string }>;
  quote: string;
  icon: React.ReactNode;
}

const STORY_HORIZONS: StoryHorizon[] = [
  {
    id: 'granary-hearth',
    chapter: 'HORIZON I / ARCHITECTURE',
    title: 'The Great Riverstone & Hand-Hewn Timber',
    subtitle: '1842 Vernacular Preservation & Botanical Library Loft',
    elevation: '420M A.S.L.',
    terroirNote: 'Quarried sub-alpine limestone with ancient river sediment patterns, restored with breathable lime mortar and century-old chestnut timber.',
    icon: <Mountain className="w-4 h-4 text-[#c89b58]" />,
    primaryImage: {
      src: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2400&q=90',
      alt: 'Great Stone Barn at Golden Hour',
      caption: 'The main library mezzanine bathed in low afternoon sunbeams filtering through reclaimed chestnut rafters.',
      badge: 'ARCHITECTURAL SANCTUARY',
      exif: {
        camera: 'Hasselblad H6D-100c',
        lens: 'HC 35mm f/3.5',
        aperture: 'f/4.5',
        shutter: '1/160s',
        iso: '100'
      }
    },
    accentImage: {
      src: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85',
      alt: 'Handcrafted Interior Timber Detail',
      caption: 'Original wrought-iron latches and hand-planed oak floorboards.'
    },
    attributes: [
      { label: 'Thermal Mass', value: '70cm Double-Wall Stone' },
      { label: 'Rafter Span', value: '18m Hand-Hewn Oak' },
      { label: 'Atmosphere', value: 'Cedar & Beeswax Linseed' }
    ],
    quote: '"Stone remembers the quiet centuries, breathing out the day’s warmth into the mountain dusk."'
  },
  {
    id: 'vineyard-terroir',
    chapter: 'HORIZON II / VITICULTURE',
    title: 'The Amphitheater & 60-Year Sangiovese',
    subtitle: 'Low-Intervention Biodynamic Terraces & Unfiltered Reserve',
    elevation: '460M A.S.L.',
    terroirNote: 'Steep south-facing amphitheater catching 2,200 annual sunshine hours with subterranean limestone drainage and wild thyme ground cover.',
    icon: <Sun className="w-4 h-4 text-[#c89b58]" />,
    primaryImage: {
      src: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=2400&q=90',
      alt: 'Sunlit Vineyard Terraces',
      caption: 'Morning dew evaporating off 60-year-old bush vines along the upper limestone terraces.',
      badge: 'DEMETER BIODYNAMIC',
      exif: {
        camera: 'Leica SL2',
        lens: 'APO-Summicron-SL 50mm f/2 ASPH',
        aperture: 'f/2.8',
        shutter: '1/1000s',
        iso: '50'
      }
    },
    accentImage: {
      src: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=85',
      alt: 'Amphora and Oak Casks',
      caption: 'Subterranean gravity-fed cellar aging in Slovenian oak and terracotta amphorae.'
    },
    attributes: [
      { label: 'Annual Bottling', value: '3,200 Bottles Only' },
      { label: 'Vine Age', value: '60 Years (Planted 1964)' },
      { label: 'Vinification', value: 'Wild Yeast Native Ferment' }
    ],
    quote: '"We do not bend the vine; we listen to what the sub-alpine soil whispers through each harvest."'
  },
  {
    id: 'springs-wellness',
    chapter: 'HORIZON III / WELLNESS',
    title: 'Thermal Cedar Springs & Forest Bathhouse',
    subtitle: 'Sub-Alpine Mineral Plunge & Steam Infusion Sanctuary',
    elevation: '435M A.S.L.',
    terroirNote: 'Deep subterranean aquifer bubbling at naturally soothing 38°C, rich in sulfur, magnesium, and silica with wild lavender mist rituals.',
    icon: <Droplets className="w-4 h-4 text-[#c89b58]" />,
    primaryImage: {
      src: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=2400&q=90',
      alt: 'Cedar Thermal Bathhouse in Forest',
      caption: 'Steam rising through the ancient larch canopy from our natural mineral spring plunge pools.',
      badge: 'MINERAL HYDROTHERAPY',
      exif: {
        camera: 'Fujifilm GFX 100 II',
        lens: 'GF 45-100mm f/4 R LM OIS WR',
        aperture: 'f/4.0',
        shutter: '1/250s',
        iso: '160'
      }
    },
    accentImage: {
      src: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=85',
      alt: 'Aromatic Botanical Infusion',
      caption: 'Wild mountain chamomile, rosemary, and eucalyptus vapor infusions.'
    },
    attributes: [
      { label: 'Spring Temp', value: '38°C Natural Flow' },
      { label: 'Mineral Profile', value: 'Magnesium & Silica Rich' },
      { label: 'Sauna Craft', value: 'Local Red Cedar & Wood Stoves' }
    ],
    quote: '"Submerged in warm mountain minerals as cool alpine pine breezes brush your brow."'
  },
  {
    id: 'apothecary-gastronomy',
    chapter: 'HORIZON IV / GASTRONOMY',
    title: 'The Culinary Apothecary & Wood Hearth',
    subtitle: 'Zero-Kilometer Regenerative Harvest & 7-Course Hearth Dinner',
    elevation: '410M A.S.L.',
    terroirNote: '400+ heirloom seed varieties grown without synthetic inputs, gathered at sunrise and cooked exclusively over olive and fruit wood embers.',
    icon: <Flame className="w-4 h-4 text-[#c89b58]" />,
    primaryImage: {
      src: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?auto=format&fit=crop&w=2400&q=90',
      alt: 'Heirloom Produce Basket at Dawn',
      caption: 'Sunrise harvest of Black Krim tomatoes, edible borage blossoms, and purple artichokes.',
      badge: 'ZERO-KILOMETER HEARTH',
      exif: {
        camera: 'Hasselblad H6D-100c',
        lens: 'HC 80mm f/2.8',
        aperture: 'f/3.2',
        shutter: '1/320s',
        iso: '100'
      }
    },
    accentImage: {
      src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85',
      alt: 'Open Flame Hearth Cooking',
      caption: 'Cast-iron pans searing sourdough and foraged morels over olive wood embers.'
    },
    attributes: [
      { label: 'Seed Vault', value: '400+ Preserved Varieties' },
      { label: 'Harvest Radius', value: '< 200m from Table' },
      { label: 'Cuisine Style', value: 'Slow Hearth Woodfire' }
    ],
    quote: '"Taste the soil, the sun, the rainfall of this exact morning in every bite."'
  }
];

export const ParallaxStoryReel: React.FC = () => {
  const { normalizedVelocity, scrollVelocity, direction, speed, elevation } = useScrollPhysics();
  const [activeHorizonId, setActiveHorizonId] = useState<string>(STORY_HORIZONS[0].id);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={containerRef}
      id="parallax-story-voyage"
      className="relative py-32 px-6 lg:px-12 bg-gradient-to-b from-[#090e0b] via-[#0c130f] to-[#090e0b] text-[#f3efe6] overflow-hidden"
    >
      {/* Background Subtle Contour Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#c89b58_1px,transparent_1px)] [background-size:32px_32px]"
      />

      <div className="max-w-7xl mx-auto space-y-28 relative z-10">
        {/* Section Header with Dynamic Telemetry Readout */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-[#203024] pb-10">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121c15] border border-[#2b3e30] text-[#c89b58] text-xs font-mono tracking-widest uppercase">
              <Layers className="w-3.5 h-3.5" />
              <span>Multi-Plane Kinetic Parallax Journey</span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light text-[#fdfbf7] tracking-tight leading-[1.1]">
              The Four Horizons of{' '}
              <span className="italic font-normal text-shimmer">
                Aethelgard
              </span>
            </h2>

            <p className="text-[#a89d8c] text-sm sm:text-base leading-relaxed">
              Scroll through the estate’s layered dimensions. Notice how architectural depth, medium-format photographic plates, and botanical telemetry shift dynamically with your scroll velocity and direction.
            </p>
          </div>

          {/* Real-time Dynamic Scroll Physics Telemetry Badge */}
          <div className="flex flex-wrap items-center gap-3 bg-[#111a14]/90 backdrop-blur-xl p-4 rounded-3xl border border-[#243729] text-xs font-mono">
            <div className="space-y-0.5 pr-4 border-r border-[#203024]">
              <span className="text-[#6d7e72] text-[10px] uppercase block">Scroll Speed</span>
              <span className="text-[#f5d7a1] font-semibold flex items-center gap-1.5">
                <Wind className={`w-3.5 h-3.5 text-[#c89b58] ${speed > 0.2 ? 'animate-pulse' : ''}`} />
                <span>{Math.abs(scrollVelocity)} px/s</span>
              </span>
            </div>

            <div className="space-y-0.5 pr-4 border-r border-[#203024]">
              <span className="text-[#6d7e72] text-[10px] uppercase block">Vector</span>
              <span className={`font-semibold uppercase ${direction === 'down' ? 'text-[#4ade80]' : direction === 'up' ? 'text-[#38bdf8]' : 'text-[#8a998d]'}`}>
                {direction === 'idle' ? 'Static Balance' : `${direction}ward glide`}
              </span>
            </div>

            <div className="space-y-0.5">
              <span className="text-[#6d7e72] text-[10px] uppercase block">Topography Altitude</span>
              <span className="text-[#ded5c6] font-semibold">
                {elevation}m a.s.l.
              </span>
            </div>
          </div>
        </div>

        {/* The 4 Parallax Horizons */}
        <div className="space-y-40">
          {STORY_HORIZONS.map((horizon, index) => {
            const isEven = index % 2 === 0;

            return (
              <div
                key={horizon.id}
                id={`horizon-${horizon.id}`}
                className={`relative grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center ${
                  isEven ? '' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Visual Photographic Parallax Plate (7 cols) */}
                <div
                  className={`lg:col-span-7 relative ${
                    isEven ? 'order-1' : 'order-1 lg:order-2'
                  }`}
                >
                  {/* Background Depth Watermark Elevation Number */}
                  <div
                    className="absolute -top-14 -left-6 text-7xl sm:text-9xl font-serif font-black text-[#152219]/60 select-none pointer-events-none z-0"
                  >
                    0{index + 1}
                  </div>

                  {/* Primary Main High-Res Image with velocity tilt and parallax depth */}
                  <div className="relative z-10">
                    <ParallaxImage
                      src={horizon.primaryImage.src}
                      alt={horizon.primaryImage.alt}
                      speed={isEven ? 0.15 : 0.18}
                      aspectRatio="landscape"
                      badge={horizon.primaryImage.badge}
                      caption={horizon.primaryImage.caption}
                      exif={horizon.primaryImage.exif}
                      containerClassName="shadow-2xl shadow-black/60"
                    />
                  </div>

                  {/* Floating Layer 2: Accent Detail Image */}
                  <div
                    className={`hidden sm:block absolute ${
                      isEven ? '-bottom-12 -right-8' : '-bottom-12 -left-8'
                    } w-52 md:w-64 z-20 shadow-2xl rounded-2xl overflow-hidden border border-[#304435] bg-[#0c130e]/95 backdrop-blur-md p-2 hover:scale-105 transition-transform duration-300`}
                  >
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                      <img
                        src={horizon.accentImage.src}
                        alt={horizon.accentImage.alt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-2 text-[10px] font-mono text-[#a89d8c] line-clamp-1">
                      {horizon.accentImage.caption}
                    </div>
                  </div>
                </div>

                {/* Narrative & Telemetry Content Plate (5 cols) */}
                <div
                  className={`lg:col-span-5 space-y-6 ${
                    isEven ? 'order-2' : 'order-2 lg:order-1'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-mono text-[#c89b58] uppercase tracking-widest">
                      {horizon.icon}
                      <span>{horizon.chapter}</span>
                      <span>•</span>
                      <span className="text-[#8a998d]">{horizon.elevation}</span>
                    </div>

                    <h3 className="text-3xl sm:text-4xl font-serif text-[#fdfbf7] font-light leading-snug">
                      {horizon.title}
                    </h3>

                    <h4 className="text-xs font-mono uppercase tracking-wider text-[#93a495]">
                      {horizon.subtitle}
                    </h4>
                  </div>

                  <p className="text-xs sm:text-sm text-[#b0a594] leading-relaxed">
                    {horizon.terroirNote}
                  </p>

                  {/* Attributes Matrix */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    {horizon.attributes.map((attr, aIdx) => (
                      <div
                        key={aIdx}
                        className="p-3 rounded-xl bg-[#111b15] border border-[#213326] space-y-1"
                      >
                        <span className="text-[10px] font-mono text-[#637568] uppercase block">
                          {attr.label}
                        </span>
                        <span className="text-xs font-mono text-[#ded5c6] font-medium block">
                          {attr.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Poetic Quote Box with subtle gold border accent */}
                  <blockquote className="p-4 rounded-2xl bg-[#0f1712] border-l-2 border-[#c89b58] text-xs sm:text-sm font-serif italic text-[#ded5c6]/90 leading-relaxed">
                    {horizon.quote}
                  </blockquote>

                  {/* Horizon Navigation Button */}
                  <div className="pt-2">
                    <a
                      href="#stays"
                      className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#c89b58] hover:text-[#f5d7a1] transition-colors group"
                    >
                      <span>Experience this sanctuary in person</span>
                      <ArrowDownRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
