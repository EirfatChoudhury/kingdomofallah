// src/components/Hero.jsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ArrowRight, Sparkles } from 'lucide-react';

export function Hero() {
  const cardBackground = useThemeColor({}, 'cardBackground');
  const primaryColor = useThemeColor({}, 'primary');
  const secondaryColor = useThemeColor({}, 'secondary');
  const borderColor = useThemeColor({}, 'border');
  const iconColor = useThemeColor({}, 'icon');

  return (
    <section
      className="relative w-full min-h-[calc(100vh-76px)] flex items-center justify-center overflow-hidden px-6 sm:px-12 py-16 transition-all duration-300 border-b"
      style={{
        backgroundColor: cardBackground,
        borderColor: borderColor,
      }}
    >
      {/* Centered KOA Watermark Logo */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden opacity-[0.07] select-none">
        <img
          src="/logos/KOA Logos/logo-removebg-preview.png"
          alt="Kingdom of Allah Watermark"
          className="w-80 sm:w-125 md:w-162.5 lg:w-200 max-w-none object-contain"
        />
      </div>

      {/* Ambient Glows */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: primaryColor }}
      />
      <div
        className="absolute bottom-10 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ backgroundColor: secondaryColor }}
      />

      {/* Hero Content */}
      <div className="relative z-10 max-w-3xl flex flex-col items-center text-center gap-6">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-extrabold tracking-wider uppercase shadow-sm"
          style={{
            backgroundColor: `${primaryColor}12`,
            borderColor: `${primaryColor}25`,
            color: primaryColor,
          }}
        >
          <Sparkles size={14} />
          <span>Kingdom of Allah</span>
        </div>

        <h1
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]"
          style={{ color: primaryColor }}
        >
          Uniting Hearts, Inspiring Faith.
        </h1>

        <p
          className="text-base sm:text-lg md:text-xl font-medium leading-relaxed max-w-2xl"
          style={{ color: iconColor }}
        >
          Kingdom of Allah (KOA) is dedicated to fostering community connection, 
          empowering youth, and enriching spiritual journeys across our local 
          masajid, educational initiatives, and outreach programs.
        </p>

        <div className="pt-3">
          <Link
            href="/about"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-sm sm:text-base font-bold text-white transition-all transform active:scale-95 shadow-lg hover:opacity-90 group cursor-pointer"
            style={{ backgroundColor: primaryColor }}
          >
            <span>Learn More</span>
            <ArrowRight
              size={18}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}