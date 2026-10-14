import React, { useState, useEffect } from 'react';
import { GalleryPhoto } from '../../types';
import { HIGH_RES_GALLERY } from '../../data/estateData';
import { ParallaxImage } from '../parallax/ParallaxImage';
import { 
  Camera, 
  Maximize2, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Sparkles, 
  Layers, 
  Grid, 
  Compass, 
  Download,
  Info
} from 'lucide-react';

export const GallerySection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activePhoto, setActivePhoto] = useState<GalleryPhoto | null>(null);
  const [viewLayout, setViewLayout] = useState<'masonry' | 'editorial'>('masonry');
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  const filteredPhotos = selectedCategory === 'all'
    ? HIGH_RES_GALLERY
    : HIGH_RES_GALLERY.filter((p) => p.category === selectedCategory);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activePhoto) return;
      if (e.key === 'Escape') {
        setActivePhoto(null);
        setIsZoomed(false);
      } else if (e.key === 'ArrowRight') {
        navigatePhoto(1);
      } else if (e.key === 'ArrowLeft') {
        navigatePhoto(-1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhoto]);

  const navigatePhoto = (direction: number) => {
    if (!activePhoto) return;
    const currentIndex = filteredPhotos.findIndex((p) => p.id === activePhoto.id);
    const nextIndex = (currentIndex + direction + filteredPhotos.length) % filteredPhotos.length;
    setActivePhoto(filteredPhotos[nextIndex]);
    setIsZoomed(false);
  };

  return (
    <section id="gallery" className="relative py-28 px-6 lg:px-12 bg-[#0c120e] text-[#f3efe6]">
      {/* Subtle background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-3/4 h-96 bg-[#25382c]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Header section with refined editorial aesthetic */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#25362a] pb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#c89b58] uppercase">
              <Camera className="w-3.5 h-3.5" />
              <span>High-Resolution Curated Archive</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-[#fbf8f2] tracking-tight">
              Visual Chronicles of the Land
            </h2>
            <p className="text-[#a89e8d] max-w-xl text-sm md:text-base leading-relaxed">
              Captured across the four seasons using medium-format analog and digital lenses—showcasing the raw tactile texture of stone, timber, dew-kissed harvests, and sanctuary living.
            </p>
          </div>

          {/* Controls: Filter Tags & Layout Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 bg-[#131c16] p-1 rounded-2xl border border-[#283b2e]">
              <button
                id="gallery-filter-all"
                onClick={() => setSelectedCategory('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-[#c89b58] text-[#0d1310] font-semibold'
                    : 'text-[#9fae9a] hover:text-white'
                }`}
              >
                All Works
              </button>
              <button
                id="gallery-filter-architecture"
                onClick={() => setSelectedCategory('architecture')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  selectedCategory === 'architecture'
                    ? 'bg-[#c89b58] text-[#0d1310] font-semibold'
                    : 'text-[#9fae9a] hover:text-white'
                }`}
              >
                Architecture
              </button>
              <button
                id="gallery-filter-harvest"
                onClick={() => setSelectedCategory('harvest')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  selectedCategory === 'harvest'
                    ? 'bg-[#c89b58] text-[#0d1310] font-semibold'
                    : 'text-[#9fae9a] hover:text-white'
                }`}
              >
                Harvest & Botany
              </button>
              <button
                id="gallery-filter-culinary"
                onClick={() => setSelectedCategory('culinary')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  selectedCategory === 'culinary'
                    ? 'bg-[#c89b58] text-[#0d1310] font-semibold'
                    : 'text-[#9fae9a] hover:text-white'
                }`}
              >
                Culinary Hearth
              </button>
              <button
                id="gallery-filter-lifestyle"
                onClick={() => setSelectedCategory('lifestyle')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  selectedCategory === 'lifestyle'
                    ? 'bg-[#c89b58] text-[#0d1310] font-semibold'
                    : 'text-[#9fae9a] hover:text-white'
                }`}
              >
                Sanctuary Stays
              </button>
            </div>

            {/* Layout Toggle */}
            <div className="flex items-center gap-1 bg-[#131c16] p-1 rounded-2xl border border-[#283b2e]">
              <button
                onClick={() => setViewLayout('masonry')}
                className={`p-2 rounded-xl text-xs transition-all ${
                  viewLayout === 'masonry' ? 'bg-[#2a3c30] text-[#c89b58]' : 'text-[#849688] hover:text-white'
                }`}
                title="Masonry Gallery"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewLayout('editorial')}
                className={`p-2 rounded-xl text-xs transition-all ${
                  viewLayout === 'editorial' ? 'bg-[#2a3c30] text-[#c89b58]' : 'text-[#849688] hover:text-white'
                }`}
                title="Cinematic Editorial View"
              >
                <Layers className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Gallery Grid Content */}
        {viewLayout === 'masonry' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhotos.map((photo, index) => {
              const isLarge = index === 0 || index === 5;
              const parallaxSpeed = 0.12 + (index % 3) * 0.06;
              return (
                <div
                  key={photo.id}
                  id={`gallery-item-${photo.id}`}
                  className={isLarge ? 'md:col-span-2 lg:col-span-2' : ''}
                >
                  <ParallaxImage
                    src={photo.fullUrl}
                    alt={photo.title}
                    speed={parallaxSpeed}
                    tiltFactor={6}
                    aspectRatio={isLarge ? 'wide' : 'portrait'}
                    badge={`${photo.season} • ${photo.location}`}
                    caption={photo.caption}
                    exif={photo.exif}
                    onClick={() => setActivePhoto(photo)}
                    containerClassName="shadow-xl"
                  />
                </div>
              );
            })}
          </div>
        ) : (
          /* Editorial Showcase View */
          <div className="space-y-20">
            {filteredPhotos.map((photo, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={photo.id}
                  id={`editorial-item-${photo.id}`}
                  onClick={() => setActivePhoto(photo)}
                  className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-12 group cursor-pointer p-6 rounded-3xl bg-[#111914]/60 border border-[#243729] hover:border-[#c89b58]/60 transition-all duration-500 ${
                    isEven ? '' : 'lg:flex-row-reverse'
                  }`}
                >
                  <div className="w-full lg:w-3/5">
                    <ParallaxImage
                      src={photo.fullUrl}
                      alt={photo.title}
                      speed={0.16}
                      tiltFactor={5}
                      aspectRatio="wide"
                      badge={photo.category.toUpperCase()}
                      containerClassName="border-0 shadow-2xl"
                    />
                  </div>

                  <div className="w-full lg:w-2/5 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-mono text-[#c89b58] uppercase">
                      <Compass className="w-3.5 h-3.5" />
                      <span>{photo.location} — {photo.season}</span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-serif text-[#fdfbf7] group-hover:text-[#f5d7a1] transition-colors">
                      {photo.title}
                    </h3>

                    <p className="text-sm text-[#b8ad9c] leading-relaxed">
                      {photo.caption}
                    </p>

                    <div className="pt-4 border-t border-[#26372b] grid grid-cols-2 gap-3 text-xs font-mono text-[#8a998d]">
                      <div>
                        <span className="text-[#59695d] block">Camera</span>
                        <span className="text-[#cfc5b4]">{photo.exif.camera}</span>
                      </div>
                      <div>
                        <span className="text-[#59695d] block">Optics</span>
                        <span className="text-[#cfc5b4]">{photo.exif.lens}</span>
                      </div>
                      <div>
                        <span className="text-[#59695d] block">Aperture / Shutter</span>
                        <span className="text-[#cfc5b4]">{photo.exif.aperture} • {photo.exif.shutter}</span>
                      </div>
                      <div>
                        <span className="text-[#59695d] block">ISO</span>
                        <span className="text-[#cfc5b4]">{photo.exif.iso}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Fullscreen Ultra-HD Lightbox Modal */}
      {activePhoto && (
        <div
          id="photo-lightbox-modal"
          className="fixed inset-0 z-50 bg-[#070b09]/95 backdrop-blur-2xl flex flex-col justify-between p-4 md:p-8 animate-fade-in text-[#f3efe6]"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono tracking-widest uppercase text-[#c89b58] px-3 py-1 rounded-full bg-[#18241c] border border-[#304434]">
                {activePhoto.category} • {activePhoto.season}
              </span>
              <span className="text-xs text-[#a39886] font-mono hidden md:inline">
                {activePhoto.location}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                className={`p-2.5 rounded-full border transition-colors ${
                  isZoomed ? 'bg-[#c89b58] text-[#0d1310] border-[#f5d7a1]' : 'bg-[#152019] text-[#e0d8ca] border-[#2e4032] hover:border-[#c89b58]'
                }`}
                title={isZoomed ? 'Reset Zoom' : '100% Ultra-HD Zoom'}
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setActivePhoto(null);
                  setIsZoomed(false);
                }}
                className="p-2.5 rounded-full bg-[#152019] border border-[#2e4032] text-[#e0d8ca] hover:text-white hover:border-[#c89b58] transition-colors"
                title="Close Lightbox (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Central Image View with Navigation Buttons */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            {/* Prev Button */}
            <button
              onClick={() => navigatePhoto(-1)}
              className="absolute left-2 md:left-6 z-20 p-3.5 rounded-full bg-[#0d1510]/80 backdrop-blur-md border border-[#304434] text-[#e0d8ca] hover:bg-[#c89b58] hover:text-[#0d1310] transition-all"
              title="Previous Photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Main High-Res Image Container */}
            <div
              className={`relative max-h-[70vh] transition-all duration-300 flex items-center justify-center ${
                isZoomed ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in'
              }`}
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <img
                src={activePhoto.fullUrl}
                alt={activePhoto.title}
                className="max-h-[68vh] max-w-[88vw] object-contain rounded-2xl border border-[#2e4233] shadow-2xl"
              />
            </div>

            {/* Next Button */}
            <button
              onClick={() => navigatePhoto(1)}
              className="absolute right-2 md:right-6 z-20 p-3.5 rounded-full bg-[#0d1510]/80 backdrop-blur-md border border-[#304434] text-[#e0d8ca] hover:bg-[#c89b58] hover:text-[#0d1310] transition-all"
              title="Next Photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Bar: Title, Description & EXIF specifications */}
          <div className="bg-[#101813]/90 backdrop-blur-xl border border-[#273a2d] p-4 md:p-6 rounded-3xl max-w-5xl mx-auto w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4 z-10">
            <div className="space-y-1">
              <h3 className="text-xl md:text-2xl font-serif text-[#fcf9f2]">{activePhoto.title}</h3>
              <p className="text-xs md:text-sm text-[#b5a997] max-w-2xl">{activePhoto.caption}</p>
            </div>

            <div className="flex items-center gap-6 text-[11px] font-mono text-[#8d9e90] border-t md:border-t-0 md:border-l border-[#283c2f] pt-3 md:pt-0 md:pl-6">
              <div>
                <span className="text-[#59695d] block">Camera Rig</span>
                <span className="text-[#d8cdbd]">{activePhoto.exif.camera}</span>
              </div>
              <div>
                <span className="text-[#59695d] block">Glass & Shutter</span>
                <span className="text-[#d8cdbd]">{activePhoto.exif.aperture} • {activePhoto.exif.shutter}</span>
              </div>
              <div>
                <span className="text-[#59695d] block">ISO Sensitivity</span>
                <span className="text-[#d8cdbd]">{activePhoto.exif.iso}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
