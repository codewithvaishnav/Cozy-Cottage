import React, { useState, useEffect } from 'react';
import { VideoLightbox } from './VideoLightbox';
import { fetchGoogleReviews, GooglePlaceReviewsResponse, GoogleReviewItem } from '../../services/googleReviewsService';

export const ReviewsSection: React.FC = () => {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [reviewsData, setReviewsData] = useState<GooglePlaceReviewsResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [expandedReviews, setExpandedReviews] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let isMounted = true;
    fetchGoogleReviews()
      .then((data) => {
        if (isMounted) {
          setReviewsData(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load Google Reviews', err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const googleIcon = (
    <svg viewBox="0 0 24 24" width="20" height="20" className="shrink-0">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );

  const currentRating = reviewsData?.rating ?? 4.6;
  const currentCount = reviewsData?.userRatingCount ?? 33;
  const reviewsList = reviewsData?.reviews ?? [];
  const mapsUri = reviewsData?.googleMapsUri || 'https://maps.google.com/?cid=12585248165060563740';

  return (
    <>
      <section id="reviews" className="py-10 xs:py-12 sm:py-24 md:py-32 relative z-10">
        <div className="w-[min(calc(100%-20px),1240px)] sm:w-[min(calc(100%-36px),1240px)] mx-auto">
          {/* Header with Live Google Ratings Badge */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-6 sm:mb-14 gap-3.5 sm:gap-6">
            <div>
              <div className="inline-flex items-center gap-2 sm:gap-3 text-[#74c69d] text-[11px] sm:text-sm uppercase tracking-[0.2em] mb-2 sm:mb-4">
                <span className="w-6 sm:w-12 h-px bg-gradient-to-r from-transparent via-[#52b788] to-transparent" />
                <span>Verified Guest Chronicles</span>
              </div>
              <h2 className="font-serif text-xl xs:text-2xl sm:text-4xl md:text-5xl leading-[1.1] tracking-tight mb-2 sm:mb-4 text-[#f7f5ee]">
                Live <span className="text-[#dda15e]">Google Reviews</span>
              </h2>
              {/* <p className="text-[12px] xs:text-xs sm:text-base text-[#d8d3c5]/80 max-w-2xl font-light">
                Directly connected to Google Maps — read authentic, unedited experiences from families, reunions, and celebrations at Cozy Cottage.
              </p> */}
            </div>

            {/* Live Google Scorecard Banner */}
            <div className="flex items-center gap-2.5 sm:gap-4 p-2.5 sm:px-5 sm:py-3.5 rounded-xl sm:rounded-2xl bg-[#0e2118]/80 border border-[#52b788]/25 backdrop-blur-md shadow-lg shrink-0 self-start lg:self-auto max-w-full">
              <div className="p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                {googleIcon}
              </div>
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-serif text-lg sm:text-2xl font-bold text-[#f7f5ee]">
                    {currentRating.toFixed(1)}
                  </span>
                  <div className="flex text-[#dda15e] text-xs">
                    {'★★★★★'.slice(0, Math.round(currentRating))}
                  </div>
                  <span className="text-[9px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full bg-[#52b788]/20 text-[#74c69d] font-medium border border-[#52b788]/30">
                    Google Verified
                  </span>
                </div>
                <div className="text-[10px] sm:text-xs text-[#d8d3c5]/80 mt-0.5">
                  Based on <strong>{currentCount} verified Google reviews</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Google Reviews Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={`skeleton-${idx}`}
                  className="rounded-[20px] p-6 border border-[#52b788]/15 bg-[#0e2118]/40 animate-pulse h-56 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="h-4 w-24 bg-white/10 rounded" />
                    <div className="h-3 w-full bg-white/10 rounded" />
                    <div className="h-3 w-4/5 bg-white/10 rounded" />
                  </div>
                  <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                    <div className="w-9 h-9 rounded-full bg-white/10" />
                    <div className="space-y-1.5">
                      <div className="h-3 w-28 bg-white/10 rounded" />
                      <div className="h-2 w-16 bg-white/10 rounded" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              reviewsList.map((review: GoogleReviewItem) => {
                const isExpanded = expandedReviews[review.id];
                const isLongText = review.text.length > 180;
                const displayText = isExpanded || !isLongText ? review.text : `${review.text.slice(0, 180)}...`;

                return (
                  <div
                    key={review.id}
                    className="rounded-xl sm:rounded-[20px] overflow-hidden border border-[#52b788]/20 bg-gradient-to-b from-[#0e2118]/85 to-[#07130d]/85 shadow-[0_10px_28px_rgba(0,0,0,0.3)] p-4 xs:p-5 sm:p-7 flex flex-col justify-between relative group hover:border-[#52b788]/45 transition-all duration-300"
                  >
                    <span className="absolute top-1.5 right-3 text-3xl sm:text-4xl text-[#52b788]/15 font-serif leading-none select-none">
                      “
                    </span>

                    <div className="relative z-10 mb-3 sm:mb-4">
                      {/* Star Rating & Relative Time */}
                      <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <div className="text-[#dda15e] text-xs sm:text-sm tracking-wider">
                          {'★'.repeat(review.rating)}
                        </div>
                        <span className="text-[10px] sm:text-[11px] text-[#a3b18a]/80 font-light">
                          {review.relativeTime}
                        </span>
                      </div>

                      {/* Review Text */}
                      <p className="text-[12px] xs:text-xs sm:text-sm text-[#d8d3c5]/90 leading-relaxed font-light whitespace-pre-line">
                        "{displayText}"
                      </p>

                      {isLongText && (
                        <button
                          onClick={() => toggleExpand(review.id)}
                          type="button"
                          className="mt-1.5 text-[10px] sm:text-[11px] text-[#74c69d] hover:text-[#dda15e] transition-colors font-medium cursor-pointer"
                        >
                          {isExpanded ? 'Show less' : 'Read full review'}
                        </button>
                      )}
                    </div>

                    {/* Author Attribution with Real Google Profile Photo & Link */}
                    <div className="mt-3 sm:mt-4 flex items-center justify-between pt-2.5 sm:pt-3 border-t border-[#52b788]/15">
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        {review.authorPhoto ? (
                          <img
                            src={review.authorPhoto}
                            alt={review.authorName}
                            referrerPolicy="no-referrer"
                            className="w-7 h-7 sm:w-9 sm:h-9 rounded-full object-cover border border-[#52b788]/30 shrink-0"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-[#1b382b] text-[#74c69d] flex items-center justify-center font-serif font-bold text-xs sm:text-sm border border-[#52b788]/30 shrink-0">
                            {review.authorName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <a
                            href={review.authorUri || 'https://maps.app.goo.gl/yMPQjEHRnrGRMuJ2A?g_st=ac'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-[11px] sm:text-xs text-[#f7f5ee] font-medium hover:text-[#74c69d] transition-colors"
                          >
                            {review.authorName}
                          </a>
                          <span className="text-[9px] sm:text-[10px] text-[#a3b18a] flex items-center gap-1">
                            <span>Google Verified Reviewer</span>
                          </span>
                        </div>
                      </div>

                      <a
                        href={review.googleMapsUri || mapsUri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 sm:p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                        title="View on Google Maps"
                      >
                        {googleIcon}
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Action Footer: Link to Google Maps Business Page */}
          <div className="text-center mt-8 sm:mt-12 space-y-2 sm:space-y-3">
            <a
              href={mapsUri}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary inline-flex items-center justify-center gap-2.5 min-h-[42px] sm:min-h-[48px] px-5 sm:px-8 rounded-full text-xs sm:text-sm text-[#f7f5ee] hover:text-white transition-all shadow-md max-w-full"
            >
              {googleIcon}
              <span className="truncate">See All {currentCount} Reviews on Google Maps ↗</span>
            </a>

            {/* Mandatory Google Maps Attribution */}
            <p className="text-[10px] sm:text-[11px] text-[#a3b18a]/70 font-light tracking-wide">
              Ratings and reviews sourced via Google Maps
            </p>
          </div>
        </div>
      </section>

      {/* Video Lightbox Modal */}
      <VideoLightbox videoId={activeVideoId} onClose={() => setActiveVideoId(null)} />
    </>
  );
};
