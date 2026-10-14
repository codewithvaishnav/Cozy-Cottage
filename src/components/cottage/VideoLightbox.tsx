import React, { useEffect } from 'react';

interface VideoLightboxProps {
  videoId: string | null;
  onClose: () => void;
}

export const VideoLightbox: React.FC<VideoLightboxProps> = ({ videoId, onClose }) => {
  useEffect(() => {
    if (!videoId) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [videoId, onClose]);

  if (!videoId) return null;

  return (
    <div
      id="video-lightbox-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-8 bg-[#071910]/95 backdrop-blur-2xl animate-in fade-in duration-300"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-4xl rounded-2xl overflow-hidden shadow-[0_40px_80px_rgba(3,18,10,0.8)] border border-[#52b788]/25 bg-[#0a2016]">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close Video"
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#0e271b]/80 border border-[#c9a84c]/40 text-[#c9a84c] flex items-center justify-center hover:rotate-90 hover:bg-[#c9a84c]/20 transition-all duration-300 cursor-pointer"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Video Iframe */}
        <div className="relative aspect-video w-full">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
            title="Cozy Cottage Video Walkthrough"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>
      </div>
    </div>
  );
};
