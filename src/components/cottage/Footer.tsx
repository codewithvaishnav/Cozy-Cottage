import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-12 sm:py-16 relative z-10 border-t border-[#52b788]/20 bg-[#081a11]">
      <div className="w-[min(calc(100%-24px),1240px)] sm:w-[min(calc(100%-36px),1240px)] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          {/* Brand Col */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="w-8 h-8 rounded-full bg-[#52b788]/20 border border-[#52b788]/40 flex items-center justify-center text-[#52b788] text-base">
                🌿
              </span>
              <div className="font-serif text-2xl text-[#f7f5ee] tracking-wide">
                Cozy <span className="text-[#52b788]">Cottage</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#a3b18a] mb-5 font-light">
              Shamirpet, Hyderabad · Cozy Cottage Stay
            </p>

            <div className="space-y-1.5 text-xs sm:text-sm text-[#d8d3c5]/80 font-light mb-6">
              <p>📞 +91 90523 10001</p>
              {/* <p>✉️ contact@cozycottage.retreat</p> */}
              <p>📍 Near Silpa Whistling Woods, Shamirpet, Hyderabad</p>
            </div>

            <a
              href="https://instagram.com/cozycottage.farmhouse"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[#52b788]/30 bg-[#0e2118]/60 text-xs text-[#74c69d] hover:text-[#dda15e] hover:border-[#dda15e]/50 transition-all"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
              <span>@cozycottage.farmhouse</span>
            </a>
          </div>

          {/* Quick Links Col */}
          <div className="md:col-span-3">
            <h5 className="text-xs uppercase tracking-[0.18em] text-[#74c69d] font-semibold mb-4">
              Explore
            </h5>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#d8d3c5]/80 font-light">
              <li>
                <a href="#about" className="hover:text-[#52b788] transition-colors">About Cottage</a>
              </li>
              <li>
                <a href="#estate-3d" className="hover:text-[#52b788] transition-colors">3D Model</a>
              </li>
              <li>
                <a href="#experiences" className="hover:text-[#52b788] transition-colors">Experiences</a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-[#52b788] transition-colors">Guest Stories</a>
              </li>
              <li>
                <a href="https://maps.google.com/?cid=12585248165060563740" target="_blank" rel="noopener noreferrer" className="hover:text-[#52b788] transition-colors">Location Map ↗</a>
              </li>
              <li>
                <a href="#booking" className="hover:text-[#dda15e] transition-colors">Reserve Your Stay</a>
              </li>
            </ul>
          </div>

          {/* Experiences Col */}
          <div className="md:col-span-4">
            <h5 className="text-xs uppercase tracking-[0.18em] text-[#74c69d] font-semibold mb-4">
              Experiences
            </h5>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#d8d3c5]/80 font-light">
              <li>
                <a
                  href="#experiences"
                  onClick={() => window.dispatchEvent(new CustomEvent('open-cottage-experience', { detail: 'pool' }))}
                  className="hover:text-[#52b788] transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#52b788]/60 group-hover:bg-[#52b788] transition-colors"></span>
                  Private Pool &amp; Sun Deck
                </a>
              </li>
              <li>
                <a
                  href="#experiences"
                  onClick={() => window.dispatchEvent(new CustomEvent('open-cottage-experience', { detail: 'bedrooms' }))}
                  className="hover:text-[#52b788] transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#52b788]/60 group-hover:bg-[#52b788] transition-colors"></span>
                  2 Bedrooms &amp; Living Room
                </a>
              </li>
              <li>
                <a
                  href="#experiences"
                  onClick={() => window.dispatchEvent(new CustomEvent('open-cottage-experience', { detail: 'games' }))}
                  className="hover:text-[#52b788] transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#52b788]/60 group-hover:bg-[#52b788] transition-colors"></span>
                  Foosball, Cricket &amp; Board Games
                </a>
              </li>
              <li>
                <a
                  href="#experiences"
                  onClick={() => window.dispatchEvent(new CustomEvent('open-cottage-experience', { detail: 'lawn' }))}
                  className="hover:text-[#52b788] transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#52b788]/60 group-hover:bg-[#52b788] transition-colors"></span>
                  Green Party Lawn &amp; Sit-Out
                </a>
              </li>
              <li>
                <a
                  href="#experiences"
                  onClick={() => window.dispatchEvent(new CustomEvent('open-cottage-experience', { detail: 'sunset' }))}
                  className="hover:text-[#52b788] transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#52b788]/60 group-hover:bg-[#52b788] transition-colors"></span>
                  Golden Hour &amp; Sunset Views
                </a>
              </li>
              <li>
                <a
                  href="#experiences"
                  onClick={() => window.dispatchEvent(new CustomEvent('open-cottage-experience', { detail: 'campfire' }))}
                  className="hover:text-[#52b788] transition-colors inline-flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#52b788]/60 group-hover:bg-[#52b788] transition-colors"></span>
                  Campfire &amp; Barbecue Setup
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 pt-6 border-t border-[#52b788]/15 flex flex-col sm:flex-row items-center justify-between text-xs text-[#a3b18a] gap-3 text-center sm:text-left font-light">
          <span>© 2026 Cozy Cottage Nature Sanctuary, Shamirpet, Hyderabad. All rights reserved.</span>
          <span>Crafted with 🌿 for unforgettable nature getaways</span>
        </div>
      </div>
    </footer>
  );
};
