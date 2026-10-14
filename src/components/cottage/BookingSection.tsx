import React from 'react';

export const BookingSection: React.FC = () => {
  const waUrl = "https://wa.me/919052310001?text=Hi%2C%20I%27d%20like%20to%20book%20Cozy%20Cottage%21%20%F0%9F%8F%A1%0A%0AHere%20are%20my%20details%3A%0A%0A%F0%9F%93%85%20Date%20of%20Booking%3A%20%0A%F0%9F%91%A5%20Number%20of%20Guests%3A%20%0A%F0%9F%8E%89%20Purpose%20of%20Visit%3A%20%0A%0ALooking%20forward%20to%20hearing%20from%20you%21";

  return (
    <section id="booking" className="py-10 xs:py-12 sm:py-24 md:py-32 relative z-10">
      <div className="w-[min(calc(100%-20px),1240px)] sm:w-[min(calc(100%-36px),1240px)] mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-14">
          <div className="inline-flex items-center gap-2 sm:gap-3 text-[#74c69d] text-[11px] sm:text-sm uppercase tracking-[0.2em] mb-2 sm:mb-4">
            <span className="w-6 sm:w-12 h-px bg-gradient-to-r from-transparent via-[#52b788] to-transparent" />
            <span>Reserve Your Stay</span>
          </div>
          <h2 className="font-serif text-xl xs:text-2xl sm:text-4xl md:text-5xl leading-[1.1] tracking-tight mb-2 sm:mb-4 text-[#f7f5ee]">
            Plan Your <span className="text-[#dda15e]">Cozy Stay</span>
          </h2>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-7 items-stretch">
          {/* Card 1: Direct Reservation */}
          <div className="lg:col-span-6 glass-panel p-4 xs:p-5 sm:p-8 md:p-12 flex flex-col justify-between">
            <div>
              {/* <div className="inline-block text-[11px] xs:text-xs uppercase tracking-widest text-[#52b788] font-semibold mb-1.5 sm:mb-3">
                🌿 Direct Booking &amp; Inquiries
              </div> */}
              <h3 className="font-serif text-lg xs:text-xl sm:text-3xl md:text-4xl text-[#f7f5ee] mb-2 sm:mb-4">
                Ready to Experience Cozy Cottage?
              </h3>
              <p className="text-[12px] xs:text-xs sm:text-base text-[#d8d3c5]/80 mb-4 sm:mb-8 font-light leading-relaxed">
                Connect with us to reserve your stay. Enjoy full property exclusivity, custom poolside barbecue setups, and tranquil nature seclusion.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 sm:gap-4">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center justify-center gap-2 min-h-[42px] xs:min-h-[44px] sm:min-h-[52px] px-5 sm:px-8 rounded-full font-semibold transition-all text-xs sm:text-base cursor-pointer shadow-lg flex-1 xs:flex-initial"
              >
                <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.943l6.284-1.649A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-4.988-1.362l-.357-.213-3.732.98.998-3.641-.234-.374A9.818 9.818 0 1112 21.818z" />
                </svg>
                <span>WhatsApp</span>
              </a>

              <a
                href="tel:+919052310001"
                className="btn-secondary inline-flex items-center justify-center gap-1.5 sm:gap-2 min-h-[42px] xs:min-h-[44px] sm:min-h-[52px] px-4 sm:px-7 rounded-full font-medium text-[#f7f5ee] transition-all text-xs sm:text-base cursor-pointer flex-1 xs:flex-initial"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>Call Host</span>
              </a>
            </div>
          </div>

          {/* Card 2: Contact List Info */}
          <div className="lg:col-span-6 glass-panel p-4 xs:p-5 sm:p-8 md:p-12">
            <h3 className="font-serif text-lg xs:text-xl sm:text-3xl text-[#f7f5ee] mb-4 sm:mb-6">
              Contact Us
            </h3>

            <ul className="divide-y divide-[#52b788]/15">
              <li className="py-2.5 sm:py-4">
                <small className="block text-[10px] sm:text-[11px] uppercase tracking-wider text-[#74c69d] mb-0.5 sm:mb-1">
                  Phone &amp; WhatsApp
                </small>
                <a
                  href="tel:+919052310001"
                  className="text-sm sm:text-lg text-[#f7f5ee] hover:text-[#52b788] transition-colors"
                >
                  +91 90523 10001
                </a>
              </li>

              {/* <li className="py-2.5 sm:py-4">
                <small className="block text-[10px] sm:text-[11px] uppercase tracking-wider text-[#74c69d] mb-0.5 sm:mb-1">
                  Direct Email
                </small>
                <a
                  href="mailto:contact@cozycottage.retreat"
                  className="text-xs sm:text-base text-[#f7f5ee] hover:text-[#52b788] transition-colors"
                >
                  contact@cozycottage.retreat
                </a>
              </li> */}

              <li className="py-2.5 sm:py-4">
                <small className="block text-[10px] sm:text-[11px] uppercase tracking-wider text-[#74c69d] mb-0.5 sm:mb-1">
                  Farmhouse Location
                </small>
                <a
                  href="https://maps.google.com/?cid=12585248165060563740"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs sm:text-base text-[#f7f5ee] hover:text-[#dda15e] transition-colors"
                >
                  Shamirpet, Hyderabad, Telangana ↗
                </a>
              </li>

              <li className="pt-2.5 sm:pt-4">
                <small className="block text-[10px] sm:text-[11px] uppercase tracking-wider text-[#74c69d] mb-0.5 sm:mb-1">
                  Community &amp; Stories
                </small>
                <a
                  href="https://instagram.com/cozycottage.farmhouse"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs sm:text-base text-[#dda15e] hover:underline"
                >
                  @cozycottage.farmhouse ↗
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
