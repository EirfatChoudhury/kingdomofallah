// src/components/MemberStripClient.jsx
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Building2, ArrowRight, LayoutGrid, Users } from 'lucide-react';

export function MemberStripClient({ logos = [] }) {
  const cardBackground = useThemeColor({}, 'cardBackground');
  const borderColor = useThemeColor({}, 'border');
  const primaryColor = useThemeColor({}, 'primary');
  const secondaryColor = useThemeColor({}, 'secondary');
  const iconColor = useThemeColor({}, 'icon');

  if (!logos || logos.length === 0) {
    return null;
  }

  const multiplier = Math.max(2, Math.ceil(12 / logos.length));
  const displayLogos = Array(multiplier).fill(logos).flat();

  return (
    <section
      className="w-full border-y py-10 sm:py-12 overflow-hidden relative select-none"
      style={{
        backgroundColor: cardBackground,
        borderTopColor: borderColor,
        borderBottomColor: borderColor,
        borderLeftColor: borderColor,
        borderRightColor: borderColor,
      }}
    >
      {/* Centered Large Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-10 flex flex-col items-center text-center gap-2">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider"
          style={{
            backgroundColor: `${secondaryColor}15`,
            borderColor: `${secondaryColor}30`,
            color: secondaryColor,
          }}
        >
          <Building2 size={13} />
          <span>Affiliated Network</span>
        </div>

        <h2
          className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight"
          style={{ color: primaryColor }}
        >
          All Members
        </h2>

        <p className="text-xs sm:text-sm font-medium" style={{ color: iconColor }}>
          United masajid, community organizations, and partners across the region
        </p>
      </div>

      {/* Side Vignette Fades */}
      <div className="flex w-full overflow-hidden mask-[linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        {/* Track 1 */}
        <div className="flex shrink-0 items-center gap-10 sm:gap-16 animate-marquee">
          {displayLogos.map((item, idx) => (
            <div
              key={`track1-${item.id}-${idx}`}
              className="w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center shrink-0 transition-transform duration-200 hover:scale-110"
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={96}
                height={96}
                className="w-full h-full object-contain filter drop-shadow-sm"
              />
            </div>
          ))}
        </div>

        {/* Track 2 */}
        <div
          aria-hidden="true"
          className="flex shrink-0 items-center gap-10 sm:gap-16 animate-marquee pl-10 sm:pl-16"
        >
          {displayLogos.map((item, idx) => (
            <div
              key={`track2-${item.id}-${idx}`}
              className="w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center shrink-0 transition-transform duration-200 hover:scale-110"
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={96}
                height={96}
                className="w-full h-full object-contain filter drop-shadow-sm"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-10 sm:mt-12 flex flex-wrap items-center justify-center gap-4">
        {/* View All Mosques Button */}
        <Link
          href="/mosque/all-member-mosques"
          className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl text-xs sm:text-sm md:text-base font-bold border transition-all transform active:scale-95 shadow-md hover:opacity-90 group cursor-pointer"
          style={{
            backgroundColor: `${secondaryColor}18`,
            borderColor: `${secondaryColor}40`,
            color: secondaryColor,
          }}
        >
          <LayoutGrid size={18} />
          <span>View All Mosques</span>
        </Link>

        {/* View All Non-Mosques Button */}
        <Link
          href="/non-mosques"
          className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl text-xs sm:text-sm md:text-base font-bold border transition-all transform active:scale-95 shadow-md hover:opacity-90 group cursor-pointer"
          style={{
            backgroundColor: `${primaryColor}15`,
            borderColor: `${primaryColor}40`,
            color: primaryColor,
          }}
        >
          <Users size={18} />
          <span>View Organisations</span>
        </Link>

        {/* Join Us Button */}
        <Link
          href="/contact"
          className="inline-flex items-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl text-xs sm:text-sm md:text-base font-bold text-white transition-all transform active:scale-95 shadow-lg hover:opacity-90 group cursor-pointer"
          style={{ backgroundColor: primaryColor }}
        >
          <span>Join Us</span>
          <ArrowRight
            size={18}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>
      </div>
    </section>
  );
}