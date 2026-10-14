import React from 'react';

export const AboutSection: React.FC = () => {
  const featureTiles = [
    {
      icon: "🏊‍♂️",
      title: "Pool, BBQ & Games",
      desc: "Cool off in the private pool, play lawn cricket & carrom with friends, and wind down with an evening barbecue"
    },
    {
      icon: "🛋️",
      title: "2-Bedroom Cottage & Hall",
      desc: "Air-conditioned bedrooms with attached bathrooms and a spacious living area to unwind together"
    },
    {
      icon: "👥",
      title: "15+ Guest Capacity",
      desc: "Comfortably hosts family get-togethers, friends' trips, and team offsites with full property privacy"
    },
    {
      icon: "📍",
      title: "Shamirpet, Hyderabad",
      desc: "Just 45 minutes from the city — peaceful, scenic, and completely to yourselves"
    }
  ];

  return (
    <section id="about" className="py-16 sm:py-24 md:py-32 relative z-10">
      <div className="w-[min(calc(100%-24px),1240px)] sm:w-[min(calc(100%-36px),1240px)] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-7 items-stretch">
          {/* Main Editorial Copy Box */}
          <div className="lg:col-span-7 glass-panel p-5 xs:p-6 sm:p-8 md:p-12 flex flex-col justify-center relative overflow-hidden">
            {/* Soft background ambient leaf glow */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-[#52b788]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="inline-flex items-center gap-3 text-[#74c69d] text-xs sm:text-sm uppercase tracking-[0.22em] mb-4 sm:mb-5">
              <span className="w-8 sm:w-10 h-px bg-gradient-to-r from-transparent via-[#52b788] to-transparent" />
              <span>About Cozy Cottage</span>
            </div>

            <h2 className="font-serif text-2xl xs:text-3xl sm:text-4xl md:text-5xl leading-[1.08] tracking-tight mb-4 sm:mb-6 text-[#f7f5ee]">
              Natural Living,<br />
              <span className="text-[#52b788]">Peaceful Stays</span>
            </h2>

            <div className="space-y-3 text-sm sm:text-base text-[#d8d3c5]/90 leading-relaxed font-light">
              <p>
                Located in Shamirpet, <strong className="text-[#f7f5ee] font-medium">Cozy Cottage</strong> is a private farmhouse built for relaxed getaways with family and friends. Whether you're planning a weekend reunion, a birthday celebration, or a quiet break from the city, the entire property is exclusively yours.
              </p>
              <p>
                Spend your time swimming in the private pool, playing friendly games on the open lawn, and enjoying a warm bonfire barbecue at night under open skies.
              </p>
            </div>

            <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-[#52b788]/15 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-[#d8d3c5]/80">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#52b788]" />
                <span>100% Private Entire Estate</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#dda15e]" />
                <span>Ideal for Families &amp; Friends</span>
              </div>
            </div>
          </div>

          {/* 4 Feature Cards Grid - 2x2 on mobile */}
          <div className="lg:col-span-5 glass-panel p-3 xs:p-4 sm:p-7 grid grid-cols-2 gap-2.5 xs:gap-3 sm:gap-4 content-start">
            {featureTiles.map((tile) => (
              <div
                key={tile.title}
                className="p-3 xs:p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-[#0e1f17]/70 border border-[#52b788]/20 hover:border-[#52b788]/50 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-start group"
              >
                <span className="text-xl xs:text-2xl mb-2 sm:mb-3 block">{tile.icon}</span>
                <h3 className="font-serif text-sm xs:text-base sm:text-lg text-[#f7f5ee] mb-1.5 sm:mb-2 tracking-tight group-hover:text-[#74c69d] transition-colors leading-snug">
                  {tile.title}
                </h3>
                <p className="text-[11px] xs:text-xs text-[#d8d3c5]/75 leading-relaxed font-light">
                  {tile.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
