// src/components/MasjidHeader.jsx
'use client';

import React from 'react';
import Image from 'next/image';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useMasjid } from '@/context/MasjidContext';

export function MasjidHeader() {
  const { currentMasjid } = useMasjid();
  const textColor = useThemeColor({}, 'text');
  const primaryColor = useThemeColor({}, 'primary');
  const iconColor = useThemeColor({}, 'icon');

  return (
    <div className="w-full flex flex-col items-center text-center py-2">
      <div className="mb-2">
        <Image
          src={currentMasjid.logoUrl || '/logos/KOA Logos/logo.png'}
          alt={currentMasjid.name}
          width={64}
          height={64}
          className="rounded-full object-contain"
          priority
        />
      </div>
      <p
        className="text-[11px] font-extrabold uppercase tracking-[1.5px] mb-0.5"
        style={{ color: primaryColor }}
      >
        WELCOME TO
      </p>
      <h1
        className="text-2xl sm:text-3xl font-extrabold tracking-tight"
        style={{ color: textColor }}
      >
        {currentMasjid.name}
      </h1>
      <p className="text-xs sm:text-sm font-medium mt-1" style={{ color: iconColor }}>
        {currentMasjid.contact.address}
      </p>
    </div>
  );
}