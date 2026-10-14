import React from 'react';
import { ScrollProgressBar } from './components/cottage/ScrollProgressBar';
import { FloatingWhatsApp } from './components/cottage/FloatingWhatsApp';
import { FloatingAudioButton } from './components/cottage/FloatingAudioButton';
import { Navbar } from './components/cottage/Navbar';
import { GlobalFloraFall } from './components/cottage/GlobalFloraFall';
import { HeroSection } from './components/cottage/HeroSection';
import { AboutSection } from './components/cottage/AboutSection';
import { Estate3DSection } from './components/cottage/Estate3DSection';
import { ExperiencesSection } from './components/cottage/ExperiencesSection';
import { CinematicSection } from './components/cottage/CinematicSection';
import { ReviewsSection } from './components/cottage/ReviewsSection';
import { AvailabilitySection } from './components/cottage/AvailabilitySection';
import { BookingSection } from './components/cottage/BookingSection';
import { Footer } from './components/cottage/Footer';

export default function App() {
  const handleScrollTo3D = () => {
    document.getElementById('estate-3d')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0a2015] text-[#f5f0e8] flex flex-col relative selection:bg-[#52b788] selection:text-[#07170f] overflow-x-hidden font-sans">
      {/* Viewport Scroll Progress Indicator */}
      <ScrollProgressBar />

      {/* Site-wide Floating Leaves & Floral Petals Breeze */}
      <GlobalFloraFall />

      {/* Floating WhatsApp Action Button */}
      <FloatingWhatsApp />

      {/* Floating Sanctuary Ambience Volume Button (100% Volume, No Slider) */}
      <FloatingAudioButton />

      {/* Floating Header Navbar */}
      <Navbar onExplore3D={handleScrollTo3D} />

      {/* Main Page Flow */}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection onExplore3D={handleScrollTo3D} />

        {/* About Section */}
        <AboutSection />

        {/* Untouched 3D Digital Twin Model Section */}
        <Estate3DSection />

        {/* Curated Experiences Grid & Modals */}
        <ExperiencesSection />

        {/* Cinematic Interlude */}
        <CinematicSection />

        {/* Client Stories & YouTube Featured Walkthrough */}
        <ReviewsSection />

        {/* Live Availability Calendar */}
        <AvailabilitySection />

        {/* Plan Your Escape / Booking Section */}
        <BookingSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
