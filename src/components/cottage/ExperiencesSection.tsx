import React, { useState, useEffect } from 'react';
import { ExperienceData, ExperienceModal } from './ExperienceModal';

export const ExperiencesSection: React.FC = () => {
  const [selectedExp, setSelectedExp] = useState<ExperienceData | null>(null);

  const experiences: ExperienceData[] = [
    {
      id: 'pool',
      tag: 'Swimming Pool',
      title: 'Private Pool',
      titleAccent: '& Sun Deck',
      shortDesc: 'Clean swimming pool with loungers and evening lights for relaxing swims.',
      coverImage: '/pool1.jpeg',
      // videoUrl: 'https://blissful-53cbf.web.app/main%20pool%20video.mp4',
      gallery: ['/pool2.avif', '/pool3.avif', '/pool4.avif', '/pool5.avif'],
      highlights: [
        'Private pool with kid-friendly shallow zone',
        'Comfortable deck loungers for unwinding',
        'Warm evening lighting for night swims'
      ],
      sideTitle: 'Private Poolside Area',
      sideText: 'Exclusively yours to enjoy swimming, relaxing, and poolside music with your group.'
    },
    {
      id: 'bedrooms',
      tag: 'Accommodations',
      title: '2 Bedrooms',
      titleAccent: '& Living Room',
      shortDesc: 'Air-conditioned bedrooms with attached bathrooms and a spacious common hall.',
      coverImage: '/bed2.jpeg',
      // videoUrl: 'https://blissful-53cbf.web.app/bedroom%20video.mp4',
      gallery: ['/bed1.avif', '/bed4.avif', '/bed2.jpeg', '/bed3.jpeg'],
      highlights: [
        '2 air-conditioned bedrooms with comfy double beds',
        'Clean en-suite bathrooms with geysers and fresh toiletries',
        'Spacious furnished living room for group conversations'
      ],
      sideTitle: 'Private Cottage Stay',
      sideText: 'The entire cottage is reserved solely for your group — no other guests on the property.'
    },
    {
      id: 'games',
      tag: 'Activities',
      title: 'Foosball & Cricket',
      titleAccent: '& Board Games',
      shortDesc: 'Full-size foosball, box cricket, carrom board, and badminton for group fun.',
      coverImage: '/sit2.avif',
      gallery: ['/gold2.avif', '/sit2.avif', '/sit3.avif', '/sit1.avif'],
      highlights: [
        'Full-size championship foosball table',
        'Box cricket kit, carrom board, badminton, and playing cards',
        'Bluetooth speaker setup for your music'
      ],
      sideTitle: 'Games & Entertainment',
      sideText: 'Plenty of fun indoor and lawn games to keep family, friends, and colleagues engaged.'
    },
    {
      id: 'lawn',
      tag: 'Outdoor Space',
      title: 'Green Party Lawn',
      titleAccent: '& Sit-Out',
      shortDesc: 'Spacious manicured lawn with fairy lights for strolls, games, and gatherings.',
      coverImage: '/gold2.avif',
      // videoUrl: 'https://blissful-53cbf.web.app/staris%20video.mp4',
      gallery: ['/sit1.avif', '/sit2.avif', '/sit3.avif', '/gold2.avif'],
      highlights: [
        'Wide natural grass lawn for outdoor gatherings',
        'Cozy fairy-light canopy and garden benches',
        'Spacious enough for small parties and celebrations'
      ],
      sideTitle: 'Lawn & Celebrations',
      sideText: 'A peaceful green setting ideal for evening chai, open-air talks, or weekend celebrations.'
    },
    {
      id: 'sunset',
      tag: 'Sunset & Open Skies',
      title: 'Golden Hour',
      titleAccent: '& Sunset Views',
      shortDesc: 'Golden sunset views and peaceful evening breeze under wide open skies.',
      coverImage: '/gold3.avif',
      gallery: ['/gold1.avif', '/sit4.avif', '/gold3.avif', '/gold4.avif'],
      highlights: [
        'Front-row golden hour sunsets over open skies',
        'Cool evening breeze and peaceful atmosphere',
        'Stunning scenic backdrop for photos and relaxation'
      ],
      sideTitle: 'Golden Hour & Sunset Views',
      sideText: 'Unwind as the sun goes down, soaking in the amber glow and peaceful open-sky farm vibes.'
    },
    {
      id: 'campfire',
      tag: 'Night Ambience',
      title: 'Campfire',
      titleAccent: '& Barbecue Setup',
      shortDesc: 'Warm stone campfire pit and live barbecue grill under starry night skies.',
      coverImage: '/sit4.avif',
      gallery: ['/gold3.avif', '/sit4.avif', '/img2.jpeg', '/img1.jpeg'],
      highlights: [
        'Campfire pit with firewood provided on request',
        'Live barbecue grill with skewers and coal grates',
        'Comfortable outdoor seating around the warm fire'
      ],
      sideTitle: 'Campfire & BBQ Evenings',
      sideText: 'Gather around the glowing fire for warm music, grilled food, and late-night chats.'
    }
  ];

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      const match = experiences.find((item) => item.id === customEvent.detail);
      if (match) {
        setSelectedExp(match);
      }
    };
    window.addEventListener('open-cottage-experience', handleOpen);
    return () => window.removeEventListener('open-cottage-experience', handleOpen);
  }, []);

  return (
    <>
      <section id="experiences" className="py-14 sm:py-24 md:py-32 relative z-10">
        <div className="w-[min(calc(100%-20px),1240px)] sm:w-[min(calc(100%-36px),1240px)] mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-14">
            <div className="inline-flex items-center gap-3 text-[#74c69d] text-xs sm:text-sm uppercase tracking-[0.22em] mb-2 sm:mb-3">
              <span className="w-8 sm:w-10 h-px bg-gradient-to-r from-transparent via-[#52b788] to-transparent" />
              <span>Cozy Cottage Stay Highlights</span>
            </div>
            <h2 className="font-serif text-2xl xs:text-3xl sm:text-4xl md:text-5xl leading-[1.08] tracking-tight mb-2 sm:mb-3 text-[#f7f5ee]">
              Memorable <span className="text-[#dda15e]">Experiences</span>
            </h2>
            <p className="text-xs sm:text-base text-[#d8d3c5]/80 max-w-2xl font-light">
              Relax, play, and make memories together in nature.
            </p>
          </div>

          {/* Grid of 6 Cards - exact square divs (3x2 on mobile, 3 cols on desktop) */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-6">
            {experiences.map((exp) => (
              <div
                key={exp.id}
                onClick={() => setSelectedExp(exp)}
                className="group relative rounded-xl xs:rounded-2xl sm:rounded-[26px] overflow-hidden aspect-square w-full border border-[#52b788]/20 cursor-pointer shadow-[0_12px_30px_rgba(3,16,9,0.45)] transition-all duration-500 hover:-translate-y-1.5 hover:border-[#52b788]/60 hover:shadow-[0_24px_60px_rgba(3,16,9,0.7),0_0_24px_rgba(82,183,136,0.18)] bg-[#0d261a]"
              >
                {/* Media Background */}
                <div className="absolute inset-0 z-0">
                  {exp.videoUrl ? (
                    <video
                      autoPlay
                      muted
                      loop
                      playsInline
                      poster={exp.coverImage}
                      className="w-full h-full object-cover filter saturate-105 brightness-[0.65] group-hover:scale-105 group-hover:brightness-[0.78] transition-all duration-700"
                    >
                      <source src={exp.videoUrl} type="video/mp4" />
                      <img src={exp.coverImage} alt={exp.title} className="w-full h-full object-cover" />
                    </video>
                  ) : (
                    <img
                      src={exp.coverImage}
                      alt={exp.title}
                      className="w-full h-full object-cover filter saturate-105 brightness-[0.65] group-hover:scale-105 group-hover:brightness-[0.78] transition-all duration-700"
                    />
                  )}
                </div>

                {/* Nature Vignette Overlay */}
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#060e0a]/95 via-[#060e0a]/45 to-transparent transition-opacity duration-500" />

                {/* Top-Left Category Badge */}
                <div className="absolute top-2.5 left-2.5 xs:top-3.5 xs:left-3.5 sm:top-4 sm:left-4 z-20">
                  <span className="inline-flex items-center px-2 py-0.5 xs:px-2.5 xs:py-1 sm:px-3 sm:py-1 rounded-full bg-[#0a1f14]/85 backdrop-blur-md border border-[#52b788]/30 text-[9px] xs:text-[10px] sm:text-[11px] uppercase tracking-wider text-[#74c69d] font-semibold shadow-sm">
                    {exp.tag}
                  </span>
                </div>
                
                {/* Content Overlay pinned to bottom */}
                <div className="absolute inset-x-0 bottom-0 z-20 p-2.5 xs:p-3.5 sm:p-5 md:p-6 flex flex-col justify-end">
                  <h3 className="font-serif text-xs xs:text-sm sm:text-xl md:text-2xl text-[#f7f5ee] leading-tight group-hover:text-[#74c69d] transition-colors">
                    {exp.title} <span className="text-[#dda15e] font-light block xs:inline">{exp.titleAccent}</span>
                  </h3>

                  <p className="text-[10px] xs:text-[11px] sm:text-xs md:text-sm text-[#d8d3c5]/80 line-clamp-1 xs:line-clamp-2 font-light leading-snug mt-0.5 xs:mt-1 sm:mt-1.5">
                    {exp.shortDesc}
                  </p>

                  <div className="mt-1 xs:mt-1.5 sm:mt-2.5 flex items-center justify-between pt-1 xs:pt-1.5 sm:pt-2 border-t border-[#52b788]/15">
                    <span className="text-[9px] xs:text-[10px] sm:text-xs text-[#74c69d] font-medium tracking-wide flex items-center gap-1">
                      <span>View details</span>
                    </span>
                    <div className="w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full border border-[#52b788]/30 bg-[#122b1f]/80 flex items-center justify-center text-[#74c69d] group-hover:translate-x-0.5 group-hover:bg-[#52b788] group-hover:text-[#07150e] transition-all duration-300 shadow-[0_0_12px_rgba(82,183,136,0.2)]">
                      <svg className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Modal */}
      <ExperienceModal experience={selectedExp} onClose={() => setSelectedExp(null)} />
    </>
  );
};
