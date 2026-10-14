import React, { useState } from 'react';
import { CottageSuite } from '../../types';
import { COTTAGE_SUITES } from '../../data/estateData';
import { BookingModal } from './BookingModal';
import { ParallaxImage } from '../parallax/ParallaxImage';
import { Bed, Users, Sparkles, Check, ArrowRight, Eye, Bath, Flame, Trees, Maximize } from 'lucide-react';

export const CottageSuites: React.FC = () => {
  const [activeSuiteIndex, setActiveSuiteIndex] = useState(0);
  const [bookingSuite, setBookingSuite] = useState<CottageSuite | null>(null);
  const activeSuite = COTTAGE_SUITES[activeSuiteIndex];

  return (
    <section id="stays" className="relative py-28 px-6 lg:px-12 bg-[#090e0b] text-[#f3efe6] overflow-hidden">
      {/* Glow backgrounds */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#c89b58]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#1f3829]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#233528] pb-8">
          <div className="space-y-3">
            <span className="text-xs font-mono tracking-widest text-[#c89b58] uppercase flex items-center gap-2">
              <Bed className="w-3.5 h-3.5" />
              <span>Sanctuary Living & Lodging</span>
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-[#fdfbf7] tracking-tight">
              Boutique Farmhouse Havens
            </h2>
            <p className="text-[#a69c8c] max-w-xl text-sm md:text-base leading-relaxed">
              Architecturally restored 19th-century riverstone barns, timber lofts, and glass conservatories nestled directly into the vineyard terraces.
            </p>
          </div>

          {/* Suite Selector Buttons */}
          <div className="flex items-center gap-2 bg-[#121b15] p-1.5 rounded-2xl border border-[#25372a] overflow-x-auto max-w-full">
            {COTTAGE_SUITES.map((suite, idx) => (
              <button
                key={suite.id}
                id={`suite-tab-${suite.id}`}
                onClick={() => setActiveSuiteIndex(idx)}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                  activeSuiteIndex === idx
                    ? 'bg-[#c89b58] text-[#0d1310] font-semibold shadow-lg shadow-[#c89b58]/20'
                    : 'text-[#9bae97] hover:text-white hover:bg-white/5'
                }`}
              >
                {suite.name.split('&')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Active Suite Hero Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Main Visual Carousel / Large Photo */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="relative">
              <ParallaxImage
                src={activeSuite.image}
                alt={activeSuite.name}
                speed={0.18}
                tiltFactor={6}
                aspectRatio="wide"
                badge={`${activeSuite.sqft} SQ FT • MAX ${activeSuite.maxGuests} GUESTS`}
                caption={activeSuite.description}
                containerClassName="shadow-2xl shadow-black/60 border border-[#273a2d]"
              />

              <div className="mt-4 flex items-center justify-between p-4 rounded-2xl bg-[#121b15] border border-[#233527]">
                <div>
                  <span className="text-xs font-mono text-[#c89b58] uppercase">From</span>
                  <div className="text-2xl font-serif text-white">
                    ${activeSuite.ratePerNight} <span className="text-xs font-mono text-[#a89e8d] font-normal">/ Night</span>
                  </div>
                </div>

                <button
                  id={`reserve-haven-btn-${activeSuite.id}`}
                  onClick={() => setBookingSuite(activeSuite)}
                  className="px-6 py-3 rounded-full bg-[#c89b58] text-[#0d1310] font-semibold text-xs uppercase tracking-wider font-mono hover:bg-[#e0b575] transition-all flex items-center gap-2 shadow-xl"
                >
                  <span>Reserve Haven</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Additional gallery thumbnails */}
            <div className="grid grid-cols-2 gap-4">
              {activeSuite.additionalImages.map((imgUrl, i) => (
                <div key={i}>
                  <ParallaxImage
                    src={imgUrl}
                    alt={`${activeSuite.name} detail ${i + 1}`}
                    speed={0.12}
                    tiltFactor={4}
                    aspectRatio="landscape"
                    containerClassName="border border-[#233527]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Suite Architectural Details & Amenities */}
          <div className="lg:col-span-5 flex flex-col justify-between p-6 md:p-8 rounded-3xl bg-[#101813]/90 border border-[#243729] space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-mono text-[#c89b58] uppercase tracking-widest">
                  Architectural Residence
                </span>
                <h3 className="text-2xl md:text-3xl font-serif text-[#fdfbf7] mt-1">{activeSuite.name}</h3>
                <p className="text-xs text-[#a89e8d] font-serif italic mt-0.5">{activeSuite.tagline}</p>
              </div>

              <p className="text-xs md:text-sm text-[#b8ad9c] leading-relaxed font-sans">
                {activeSuite.description}
              </p>

              {/* Key Features Icons */}
              <div className="space-y-2 pt-2 border-t border-[#233528]">
                <h4 className="text-xs font-mono text-[#c89b58] uppercase tracking-wider">Key Highlights</h4>
                <div className="space-y-2">
                  {activeSuite.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-[#ded5c6]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c89b58] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Complimentary Agritourism Inclusions */}
              <div className="space-y-2 pt-2 border-t border-[#233528]">
                <h4 className="text-xs font-mono text-[#c89b58] uppercase tracking-wider">Estate Inclusions</h4>
                <div className="space-y-2">
                  {activeSuite.amenities.map((amen, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-[#a8b8aa]">
                      <Check className="w-3.5 h-3.5 text-[#4ade80] shrink-0" />
                      <span>{amen}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom View Lore */}
            <div className="p-4 rounded-2xl bg-[#141f17] border border-[#293d2e] flex items-center justify-between text-xs font-mono text-[#99a99b]">
              <span className="flex items-center gap-1.5">
                <Trees className="w-3.5 h-3.5 text-[#c89b58]" />
                {activeSuite.view}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        suite={bookingSuite}
        onClose={() => setBookingSuite(null)}
      />
    </section>
  );
};
