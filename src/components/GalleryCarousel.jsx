// src/components/GalleryCarousel.jsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useMasjid } from '@/context/MasjidContext';

export function GalleryCarousel() {
  const { currentMasjid } = useMasjid();
  const textColor = useThemeColor({}, 'text');
  const cardBackground = useThemeColor({}, 'cardBackground');
  const primaryColor = useThemeColor({}, 'primary');
  const borderColor = useThemeColor({}, 'border');
  const iconColor = useThemeColor({}, 'icon');

  const galleryImages = currentMasjid?.gallery || [];

  const [images, setImages] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [translateX, setTranslateX] = useState(-100);
  const trackRef = useRef(null);

  // Sync carousel items when the selected mosque changes
  useEffect(() => {
    if (galleryImages.length > 0) {
      setImages([...galleryImages, ...galleryImages, ...galleryImages]);
      setTranslateX(-100);
    } else {
      setImages([]);
    }
  }, [currentMasjid]);

  const handleTransitionEnd = () => {
    setIsTransitioning(false);

    if (translateX <= -200) {
      setImages((prev) => {
        const copy = [...prev];
        const first = copy.shift();
        copy.push(first);
        return copy;
      });
      setTranslateX(-100);
    } else if (translateX >= 0) {
      setImages((prev) => {
        const copy = [...prev];
        const last = copy.pop();
        copy.unshift(last);
        return copy;
      });
      setTranslateX(-100);
    }
  };

  const handleNavigate = (direction) => {
    if (isTransitioning || images.length === 0) return;
    setIsTransitioning(true);
    setTranslateX(direction === 'left' ? 0 : -200);
  };

  if (!galleryImages || galleryImages.length === 0) return null;

  return (
    <div className="w-full mb-12 sm:mb-16">
      {/* Header */}
      <div className="text-center mb-6">
        <h2
          className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-1"
          style={{ color: primaryColor }}
        >
          Masjid Interior Architecture
        </h2>
        <p className="text-xs sm:text-sm font-medium max-w-xl mx-auto" style={{ color: iconColor }}>
          Take a visual walkthrough of {currentMasjid?.name}, custom-built to maximize serenity and communal focus.
        </p>
      </div>

      {/* Carousel Container */}
      <div className="relative w-full max-w-4xl mx-auto flex items-center">
        {/* Navigation Left */}
        <button
          onClick={() => handleNavigate('left')}
          className="absolute left-2 sm:left-4 z-20 p-2 sm:p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-all active:scale-90 cursor-pointer"
          aria-label="Previous image"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Navigation Right */}
        <button
          onClick={() => handleNavigate('right')}
          className="absolute right-2 sm:right-4 z-20 p-2 sm:p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-all active:scale-90 cursor-pointer"
          aria-label="Next image"
        >
          <ChevronRight size={24} />
        </button>

        {/* Viewport Mask */}
        <div
          className="w-full overflow-hidden rounded-2xl sm:rounded-3xl border shadow-sm"
          style={{ borderColor: borderColor, backgroundColor: cardBackground }}
        >
          <div
            ref={trackRef}
            className="flex flex-row w-full will-change-transform"
            onTransitionEnd={handleTransitionEnd}
            style={{
              transform: `translateX(${translateX}%)`,
              transition: isTransitioning ? 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)' : 'none',
            }}
          >
            {images.map((img, index) => (
              <div
                key={`${img.id}-${index}`}
                className="flex-none w-full relative aspect-16/10 sm:aspect-video overflow-hidden"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover select-none"
                />
                <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/90 via-black/40 to-transparent p-4 sm:p-6 pt-12">
                  <p className="text-white text-xs sm:text-base font-bold tracking-tight">
                    {img.alt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}