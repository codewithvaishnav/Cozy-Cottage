import React, { useEffect } from 'react';

export interface ExperienceData {
  id: string;
  tag: string;
  title: string;
  titleAccent: string;
  shortDesc: string;
  coverImage: string;
  videoUrl?: string;
  gallery: string[];
  highlights: string[];
  sideTitle: string;
  sideText: string;
}

interface ExperienceModalProps {
  experience: ExperienceData | null;
  onClose: () => void;
}

export const ExperienceModal: React.FC<ExperienceModalProps> = ({ experience, onClose }) => {
  useEffect(() => {
    if (!experience) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [experience, onClose]);

  if (!experience) return null;

  const waUrl = `https://wa.me/919052310001?text=Hi%2C%20I%27d%20like%20to%20inquire%20about%20${encodeURIComponent(
    experience.title + ' ' + experience.titleAccent
  )}%20at%20Cozy%20Cottage%21`;

  return (
    <div
      id="experience-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#071910]/90 backdrop-blur-md animate-in fade-in duration-300"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl sm:rounded-3xl border border-[#52b788]/30 bg-gradient-to-b from-[#143625]/98 to-[#0c2418]/98 shadow-[0_36px_80px_rgba(2,16,9,0.8)] p-4 xs:p-5 sm:p-6 md:p-8 overscroll-contain animate-in zoom-in-95 duration-300"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close modal"
          className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#12281d] border border-[#52b788]/30 text-[#74c69d] flex items-center justify-center hover:rotate-90 hover:bg-[#52b788] hover:text-[#07150e] transition-all duration-300 cursor-pointer shadow-md"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* 4-Image Grid Gallery */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-5 sm:mb-8">
          {experience.gallery.map((imgSrc, idx) => (
            <div key={idx} className="relative h-28 xs:h-36 sm:h-48 rounded-xl overflow-hidden border border-[#52b788]/20 bg-[#0f2c1e]/60">
              <img
                src={imgSrc}
                alt={`${experience.title} ${idx + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>

        {/* Content Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-7">
            <div className="inline-block text-xs uppercase tracking-widest text-[#52b788] font-semibold mb-2">
              🌿 {experience.tag}
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#f7f5ee] leading-tight mb-4">
              {experience.title} <span className="text-[#dda15e] font-light">{experience.titleAccent}</span>
            </h2>

            <h4 className="text-xs uppercase tracking-[0.16em] text-[#74c69d] font-semibold mb-3">
              What You'll Love
            </h4>

            <ul className="space-y-3 mb-6">
              {experience.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-3 text-sm sm:text-base text-[#d8d3c5]/90 font-light">
                  <span className="w-2 h-2 rounded-full bg-[#52b788] mt-2 shadow-[0_0_8px_rgba(82,183,136,0.8)] shrink-0" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-5 p-5 sm:p-6 rounded-2xl border border-[#52b788]/20 bg-[#12281d]/60 backdrop-blur-sm">
            <h4 className="font-serif text-lg sm:text-xl text-[#f7f5ee] mb-2">
              {experience.sideTitle}
            </h4>
            <p className="text-xs sm:text-sm text-[#d8d3c5]/80 mb-5 leading-relaxed font-light">
              {experience.sideText}
            </p>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full py-3.5 px-5 rounded-full flex items-center justify-center gap-2 text-sm font-semibold transition-all cursor-pointer shadow-lg"
            >
              <span>Inquire on WhatsApp</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
