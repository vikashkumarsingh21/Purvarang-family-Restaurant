import React, { useState, useEffect, useCallback } from 'react';
import {
  Image as ImageIcon,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { GALLERY_ITEMS, ImageAsset } from '../data/images';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

export const Gallery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = [
    { id: 'all', label: 'All Photos' },
    { id: 'interior', label: 'Dining Hall & Ambiance' },
    { id: 'food', label: 'Culinary Specialties' },
    { id: 'exterior', label: 'Building Facade' },
    { id: 'team', label: 'Hospitality & Team' },
  ];

  const filteredItems = GALLERY_ITEMS.filter(item => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (lightboxIndex === null) return;
    if (e.key === 'Escape') setLightboxIndex(null);
    if (e.key === 'ArrowRight') {
      setLightboxIndex(prev => (prev !== null ? (prev + 1) % filteredItems.length : null));
    }
    if (e.key === 'ArrowLeft') {
      setLightboxIndex(prev => (prev !== null ? (prev - 1 + filteredItems.length) % filteredItems.length : null));
    }
  }, [lightboxIndex, filteredItems.length]);

  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxIndex, handleKeyDown]);

  const activeImage: ImageAsset | null = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 text-espresso">
      
      {/* Gallery Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-wheat text-palak text-[14px] font-semibold shadow-soft">
          <ImageIcon className="w-4 h-4 text-mirchi" strokeWidth={1.75} />
          <span>Real Photography Archive</span>
        </div>
        <h1 className="font-serif text-[clamp(32px,4vw,48px)] font-bold text-espresso">
          Restaurant Gallery
        </h1>
        <p className="text-[16px] text-clay">
          Unfiltered photos of our Lalganj dining halls, party swing booth, charcoal tandoor, and authentic feasts.
        </p>
      </div>

      {/* Category Filter Buttons */}
      <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-[14px] font-medium transition-all border ${
              selectedCategory === cat.id
                ? 'bg-mirchi text-white border-mirchi shadow-soft font-semibold'
                : 'bg-white text-espresso border-wheat hover:bg-paper'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Responsive Masonry-like Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {filteredItems.map((item, idx) => (
          <div
            key={item.src + idx}
            onClick={() => setLightboxIndex(idx)}
            className="group break-inside-avoid p-3 bg-white rounded-[16px] border border-wheat shadow-soft cursor-pointer transition-all duration-300 hover:border-clay/40 hover:-translate-y-0.5"
          >
            <div className="rounded-[10px] overflow-hidden bg-paper">
              <ImageWithFallback
                src={item.src}
                alt={item.alt}
                aspectRatio="auto"
                className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-300"
              />
            </div>

            {/* Photo Caption */}
            <div className="mt-3 px-1 flex items-center justify-between text-left">
              <div>
                <p className="font-serif text-[16px] font-bold text-espresso">{item.alt}</p>
                {item.caption && <p className="text-[13px] text-clay mt-0.5 italic">{item.caption}</p>}
              </div>
              <div className="w-8 h-8 rounded-[8px] bg-paper text-clay group-hover:text-mirchi flex items-center justify-center shrink-0 transition-colors">
                <Maximize2 className="w-4 h-4" strokeWidth={1.75} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && activeImage && (
        <div
          className="fixed inset-0 z-50 bg-espresso/85 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 select-none animate-fade-in text-espresso"
          role="dialog"
          aria-modal="true"
        >
          {/* Close Button */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-5 right-5 z-50 p-2.5 rounded-full bg-white hover:bg-paper text-espresso border border-wheat shadow-soft transition-colors"
            aria-label="Close Lightbox"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>

          {/* Previous Button */}
          <button
            onClick={e => {
              e.stopPropagation();
              setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
            }}
            className="absolute left-4 sm:left-8 z-50 p-3 rounded-full bg-white hover:bg-paper text-espresso border border-wheat shadow-soft transition-colors"
            aria-label="Previous Image"
          >
            <ChevronLeft className="w-6 h-6" strokeWidth={2} />
          </button>

          {/* Next Button */}
          <button
            onClick={e => {
              e.stopPropagation();
              setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
            }}
            className="absolute right-4 sm:right-8 z-50 p-3 rounded-full bg-white hover:bg-paper text-espresso border border-wheat shadow-soft transition-colors"
            aria-label="Next Image"
          >
            <ChevronRight className="w-6 h-6" strokeWidth={2} />
          </button>

          {/* Image Container */}
          <div
            className="max-w-4xl max-h-[85vh] bg-white p-3 rounded-[16px] border border-wheat shadow-soft flex flex-col justify-between"
            onClick={e => e.stopPropagation()}
          >
            <div className="max-h-[70vh] overflow-hidden rounded-[10px] bg-paper flex items-center justify-center">
              <img
                src={activeImage.src}
                alt={activeImage.alt}
                className="max-w-full max-h-[70vh] object-contain rounded-[8px]"
              />
            </div>
            <div className="pt-3 px-2 flex items-center justify-between text-[14px]">
              <div>
                <p className="font-serif font-bold text-espresso text-[16px]">{activeImage.alt}</p>
                {activeImage.caption && <p className="text-clay text-[13px]">{activeImage.caption}</p>}
              </div>
              <span className="text-clay text-[13px] font-semibold">
                {lightboxIndex + 1} / {filteredItems.length}
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
