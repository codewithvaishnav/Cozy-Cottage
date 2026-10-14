import React, { useState, useEffect } from 'react';
import { subscribeToBookings, fetchLiveFirebaseBookings, getCachedBookings } from '../../services/availabilityService';
import { RotateCw } from 'lucide-react';

export const AvailabilitySection: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [bookedDatesList, setBookedDatesList] = useState<string[]>(() => getCachedBookings());
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    // Connects to Firebase real-time listener (updates automatically when bookings change)
    const unsubscribe = subscribeToBookings((dates) => {
      setBookedDatesList(dates);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      const dates = await fetchLiveFirebaseBookings();
      if (dates && dates.length > 0) {
        setBookedDatesList(dates);
      }
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const bookedDatesSet = new Set<string>(bookedDatesList);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr = new Date().toISOString().split('T')[0];

  const getWaLinkForDate = (dateStr: string) => {
    return `https://wa.me/919052310001?text=Hi%2C%20I%27d%20like%20to%20book%20Cozy%20Cottage%21%20%F0%9F%8F%A1%0A%0AHere%20are%20my%20details%3A%0A%0A%F0%9F%93%85%20Date%20of%20Booking%3A%20${encodeURIComponent(
      dateStr
    )}%0A%F0%9F%91%A5%20Number%20of%20Guests%3A%20%0A%F0%9F%8E%89%20Purpose%20of%20Visit%3A%20%0A%0ALooking%20forward%20to%20hearing%20from%20you%21`;
  };

  return (
    <section id="availability" className="py-16 sm:py-24 md:py-32 relative z-10">
      <div className="w-[min(calc(100%-24px),1240px)] sm:w-[min(calc(100%-36px),1240px)] mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-14">
          <div className="inline-flex items-center justify-center gap-3 text-[#74c69d] text-xs sm:text-sm uppercase tracking-[0.22em] mb-3">
            <span className="w-10 sm:w-12 h-px bg-gradient-to-r from-transparent via-[#52b788] to-transparent" />
            <span>Escape To Nature</span>
            <span className="w-10 sm:w-12 h-px bg-gradient-to-r from-transparent via-[#52b788] to-transparent" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl leading-[1.08] tracking-tight mb-3 text-[#f7f5ee]">
            Cozy Cottage <span className="text-[#dda15e]">Availability</span>
          </h2>
          <p className="text-xs sm:text-base text-[#d8d3c5]/80 max-w-2xl mx-auto font-light px-2">
            Check calendar dates below — tap any open date to instantly reserve on WhatsApp.
          </p>
        </div>

        {/* Calendar Card */}
        <div className="max-w-xl mx-auto p-4 xs:p-5 sm:p-7 md:p-8 rounded-2xl sm:rounded-[28px] bg-gradient-to-b from-[#143625]/95 to-[#0d281a]/95 border border-[#52b788]/25 shadow-[0_24px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          {/* Calendar Header Navigation */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#52b788]/15">
            <button
              onClick={handlePrevMonth}
              type="button"
              aria-label="Previous Month"
              className="w-10 h-10 rounded-full border border-[#52b788]/30 bg-[#12281d] text-[#74c69d] flex items-center justify-center hover:bg-[#52b788] hover:text-[#07150e] transition-all text-xl cursor-pointer shadow-sm"
            >
              &#8249;
            </button>

            <div className="text-center">
              <span className="font-serif text-xl sm:text-2xl text-[#f7f5ee] tracking-wide block">
                {months[month]} {year}
              </span>
              {/* <button
                type="button"
                onClick={handleManualRefresh}
                title="Click to check and refresh live Firebase reservations"
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#12281d] border border-[#52b788]/25 text-[10px] text-[#74c69d] hover:text-[#f7f5ee] hover:border-[#52b788]/60 transition-all cursor-pointer font-medium mt-1"
              >
                <RotateCw className={`w-2.5 h-2.5 ${isLoading || isRefreshing ? 'animate-spin text-[#dda15e]' : 'text-[#52b788]'}`} />
                <span>{isLoading ? 'Checking calendar...' : isRefreshing ? 'Syncing Firebase...' : 'Live Synced with Firebase'}</span>
              </button> */}
            </div>

            <button
              onClick={handleNextMonth}
              type="button"
              aria-label="Next Month"
              className="w-10 h-10 rounded-full border border-[#52b788]/30 bg-[#12281d] text-[#74c69d] flex items-center justify-center hover:bg-[#52b788] hover:text-[#07150e] transition-all text-xl cursor-pointer shadow-sm"
            >
              &#8250;
            </button>
          </div>

          {/* Day Names */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-3 text-center">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
              <div key={d} className="text-[11px] uppercase tracking-widest text-[#74c69d]/60 font-semibold">
                {d}
              </div>
            ))}
          </div>

          {/* Grid Cells */}
          <div className="grid grid-cols-7 gap-1 xs:gap-1.5 sm:gap-2">
            {/* Empty initial days */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="h-9 xs:h-10 sm:h-11 rounded-lg" />
            ))}

            {/* Days in Month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const isBooked = bookedDatesSet.has(dateStr);
              const isPast = dateStr < todayStr;
              const isToday = dateStr === todayStr;

              if (isBooked) {
                return (
                  <div
                    key={dateStr}
                    className="relative group h-9 xs:h-10 sm:h-11 rounded-lg bg-red-500/15 border border-red-500/25 text-red-300/60 line-through text-[11px] sm:text-sm font-medium flex items-center justify-center cursor-not-allowed select-none"
                  >
                    <span>{dayNum}</span>
                    {/* Tooltip */}
                    <div className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 hidden group-hover:block z-30 px-3 py-1.5 rounded-lg bg-[#0c2418]/95 border border-red-500/40 text-[11px] text-[#f7f5ee] whitespace-nowrap shadow-xl pointer-events-none">
                      🚫 Reserved
                    </div>
                  </div>
                );
              }

              if (isPast) {
                return (
                  <div
                    key={dateStr}
                    className="h-9 xs:h-10 sm:h-11 rounded-lg text-[#52b788]/20 text-[11px] sm:text-sm flex items-center justify-center select-none"
                  >
                    {dayNum}
                  </div>
                );
              }

              return (
                <a
                  key={dateStr}
                  href={getWaLinkForDate(dateStr)}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={isToday ? `Today (${dateStr}) — Tap to reserve` : `Available date: ${dateStr} — Tap to reserve`}
                  className={`h-9 xs:h-10 sm:h-11 rounded-lg text-[11px] sm:text-sm transition-all cursor-pointer flex items-center justify-center ${
                    isToday
                      ? 'bg-[#52b788] text-[#07150e] font-bold shadow-[0_0_14px_rgba(82,183,136,0.6)] ring-2 ring-[#74c69d]'
                      : 'text-white hover:bg-white/15 hover:text-white font-medium hover:scale-105'
                  }`}
                >
                  {dayNum}
                </a>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-5 sm:gap-8 mt-6 pt-5 border-t border-[#52b788]/15 text-xs text-[#d8d3c5]/80 font-light flex-wrap">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#52b788] ring-2 ring-[#52b788]/40 shadow-[0_0_8px_rgba(82,183,136,0.6)]" />
              <span className="text-[#f7f5ee]">Today</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-white ring-2 ring-white/30 shadow-[0_0_6px_rgba(255,255,255,0.4)]" />
              <span className="text-[#f7f5ee]">Available</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/90 ring-2 ring-red-500/30" />
              <span className="text-[#f7f5ee]">Reserved</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
