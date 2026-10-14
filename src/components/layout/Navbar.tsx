import React, { useState, useEffect } from 'react';
import { AtmosphericMood, LandmarkHotspot } from '../../types';
import { AudioControl } from '../audio/AudioControl';
import { Compass, Menu, X, ArrowUpRight, Sparkles, Sun, Moon, CloudSun, Leaf } from 'lucide-react';

interface NavbarProps {
  mood: AtmosphericMood;
  onMoodChange: (mood: AtmosphericMood) => void;
  onOpenBooking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ mood, onMoodChange, onOpenBooking }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#090e0b]/90 backdrop-blur-xl border-b border-[#233527] py-3.5 shadow-2xl'
          : 'bg-gradient-to-b from-[#090e0b]/80 to-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
        {/* Brand Monogram & Title */}
        <a href="#" className="flex items-center gap-3.5 group">
          <div className="w-10 h-10 rounded-2xl bg-[#141f17] border border-[#304435] flex items-center justify-center text-[#c89b58] font-serif font-bold text-lg group-hover:border-[#c89b58] transition-colors shadow-lg">
            W
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg tracking-wider text-[#fdfbf7] font-normal uppercase group-hover:text-[#f5d7a1] transition-colors">
              Whistling Woods
            </span>
            <span className="text-[9px] font-mono tracking-widest text-[#93a495] uppercase">
              Luxury Farmhouse & Pool Villa
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-mono tracking-widest uppercase text-[#c2b9a7]">
          <a href="#estate-3d-viewport" className="hover:text-[#f5d7a1] transition-colors">
            3D Model (Realistic)
          </a>
          <a href="#real-farmhouse-tour" className="hover:text-[#f5d7a1] transition-colors text-[#c89b58]">
            Real Photo Tour
          </a>
          <a href="#gallery" className="hover:text-[#f5d7a1] transition-colors">
            Visual Archive
          </a>
          <a href="#stays" className="hover:text-[#f5d7a1] transition-colors">
            Suites & Pool
          </a>
          <a href="#almanac" className="hover:text-[#f5d7a1] transition-colors">
            Daily Rituals
          </a>
        </nav>

        {/* Right Utility: Atmospheric Audio, Weather & Booking Action */}
        <div className="flex items-center gap-3">
          {/* Nature Soundscape Audio Engine */}
          <AudioControl mood={mood} />

          {/* Quick Reserve Haven Button */}
          <button
            id="nav-reserve-btn"
            onClick={onOpenBooking}
            className="hidden sm:flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#c89b58] text-[#0d1310] text-xs font-mono font-semibold uppercase tracking-wider hover:bg-[#e0b575] transition-all shadow-lg shadow-[#c89b58]/20"
          >
            <span>Inquire Stay</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            id="mobile-nav-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-full bg-[#141f17] border border-[#2b3e30] text-[#ded5c6] hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Fullscreen Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[72px] bg-[#090e0b]/98 backdrop-blur-2xl p-8 flex flex-col justify-between animate-fade-in border-t border-[#233527]">
          <nav className="flex flex-col space-y-6 pt-4 text-xl font-serif text-[#fdfbf7]">
            <a
              href="#estate-3d-viewport"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#c89b58] transition-colors"
            >
              3D Interactive Estate
            </a>
            <a
              href="#gallery"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#c89b58] transition-colors"
            >
              Photography & Lightbox Gallery
            </a>
            <a
              href="#stays"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#c89b58] transition-colors"
            >
              Suites & Cottage Havens
            </a>
            <a
              href="#almanac"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#c89b58] transition-colors"
            >
              Seasonal Harvest & Gastronomy
            </a>
            <a
              href="#estate-map"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#c89b58] transition-colors"
            >
              Topographical Map
            </a>
          </nav>

          <div className="space-y-4 pt-6 border-t border-[#233527]">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-3.5 rounded-full bg-[#c89b58] text-[#0d1310] font-semibold text-xs font-mono uppercase tracking-wider"
            >
              Request Haven Stay
            </button>
            <div className="text-center text-xs font-mono text-[#8a998d]">
              45°28&apos;12&quot;N 9°14&apos;45&quot;E • ELEV. 420M
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
