import React, { useState, useEffect } from 'react';

interface NavbarProps {
  onExplore3D?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onExplore3D }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Cottage Story', href: '#about' },
    { label: '3D Estate Tour', href: '#estate-3d', onClick: onExplore3D },
    { label: 'Cottage Stays', href: '#experiences' },
    { label: 'Guest Memories', href: '#reviews' },
    { label: 'Availability', href: '#availability' },
    { label: 'Google Map', href: 'https://maps.google.com/?cid=12585248165060563740', external: true }
  ];

  return (
    <>
      <header
        id="navbar"
        className="fixed top-2 sm:top-5 inset-x-0 z-40 transition-all duration-500"
      >
        <div className={`w-[min(calc(100%-16px),1280px)] sm:w-[min(calc(100%-28px),1280px)] mx-auto px-3 sm:px-6 py-2 sm:py-3.5 flex items-center justify-between border transition-all duration-300 rounded-full ${
          scrolled 
            ? 'border-[#52b788]/25 bg-[#091610]/90 backdrop-blur-xl shadow-[0_8px_30px_rgba(2,10,6,0.6)]' 
            : 'border-white/10 bg-[#0c1a13]/70 backdrop-blur-lg shadow-[0_6px_20px_rgba(0,0,0,0.3)]'
        }`}>
          {/* Brand */}
          <a
            href="#"
            className="flex items-center gap-2 font-serif text-base sm:text-lg tracking-wide whitespace-nowrap text-[#f7f5ee] hover:text-[#74c69d] transition-colors group"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[#52b788] to-[#1b4332] flex items-center justify-center text-[#07110c] shadow-[0_0_14px_rgba(82,183,136,0.4)] group-hover:scale-105 transition-transform">
              <span className="text-xs sm:text-sm">🌿</span>
            </div>
            <span className="leading-tight font-semibold text-base sm:text-lg">
              Cozy <span className="text-[#52b788] font-light">Cottage</span>
            </span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                onClick={link.onClick}
                className="text-[#d8d3c5] hover:text-[#74c69d] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#52b788] hover:after:w-full after:transition-all after:duration-300"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#booking"
              className="px-5 py-2 rounded-full border border-[#52b788]/60 bg-[#52b788]/10 text-[#74c69d] hover:bg-[#52b788] hover:text-[#07150e] hover:shadow-[0_0_20px_rgba(82,183,136,0.4)] transition-all duration-300 text-sm font-semibold flex items-center gap-1.5"
            >
              <span>Book Cottage</span>
              <span className="text-xs">→</span>
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            id="mobile-menu-toggle"
            type="button"
            aria-label="Toggle Navigation Menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 rounded-full border border-[#52b788]/20 bg-[#12241b]/60 flex items-center justify-center text-[#f7f5ee] hover:border-[#52b788]/50 transition-colors"
          >
            {mobileMenuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Panel & Backdrop */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-35 bg-black/40 backdrop-blur-sm md:hidden animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div
            id="mobile-nav-panel"
            className="fixed top-18 inset-x-3.5 z-40 p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#091610]/95 backdrop-blur-2xl border border-[#52b788]/25 shadow-[0_20px_50px_rgba(2,10,6,0.8)] flex flex-col gap-1 md:hidden animate-in fade-in slide-in-from-top-4 duration-300"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (link.onClick) link.onClick();
                }}
                className="py-2.5 px-3 text-[#f7f5ee]/90 hover:text-[#74c69d] border-b border-white/5 text-sm sm:text-base transition-colors flex items-center justify-between"
              >
                <span>{link.label}</span>
                <span className="text-xs text-[#52b788]">✦</span>
              </a>
            ))}
            <a
              href="#booking"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-3 py-2.5 sm:py-3 rounded-full text-center text-sm sm:text-base font-semibold bg-gradient-to-r from-[#74c69d] via-[#52b788] to-[#2d6a4f] text-[#07150e] shadow-[0_8px_24px_rgba(82,183,136,0.3)]"
            >
              Reserve Your Stay
            </a>
          </div>
        </>
      )}
    </>
  );
};
