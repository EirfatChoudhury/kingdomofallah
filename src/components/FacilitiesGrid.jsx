// src/components/FacilitiesGrid.jsx
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Car, 
  Landmark, 
  Users, 
  Droplets, 
  Sparkles, 
  CheckCircle2,
  Building2
} from 'lucide-react';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useMasjid } from '@/context/MasjidContext';

const ICON_MAP = {
  Car,
  Landmark,
  Users,
  Droplets,
  Sparkles,
};

export function FacilitiesGrid() {
  const { currentMasjid } = useMasjid();
  const [activeFilter, setActiveFilter] = useState('All');

  const textColor = useThemeColor({}, 'text');
  const cardBackground = useThemeColor({}, 'cardBackground');
  const primaryColor = useThemeColor({}, 'primary');
  const secondaryColor = useThemeColor({}, 'secondary');
  const borderColor = useThemeColor({}, 'border');
  const iconColor = useThemeColor({}, 'icon');

  const facilities = currentMasjid?.facilities || [];

  // Reset filter when mosque changes
  useEffect(() => {
    setActiveFilter('All');
  }, [currentMasjid]);

  // Derive unique categories dynamically from current mosque's facilities
  const filterCategories = useMemo(() => {
    const set = new Set();
    facilities.forEach((f) => {
      if (f.category) set.add(f.category);
    });
    return ['All', ...Array.from(set)];
  }, [facilities]);

  const filteredFacilities = activeFilter === 'All'
    ? facilities
    : facilities.filter((item) => item.category === activeFilter);

  return (
    <div className="w-full flex flex-col">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h1
          className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2"
          style={{ color: primaryColor }}
        >
          Masjid Facilities
        </h1>
        <p
          className="text-xs sm:text-sm font-medium max-w-xl mx-auto"
          style={{ color: iconColor }}
        >
          Explore infrastructure and amenities provided at {currentMasjid?.name}.
        </p>
      </div>

      {/* Dynamic Category Filter Bar */}
      {filterCategories.length > 1 && (
        <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
          {filterCategories.map((cat) => {
            const isActive = activeFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className="px-4 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 border cursor-pointer"
                style={{
                  backgroundColor: isActive ? primaryColor : cardBackground,
                  color: isActive ? '#ffffff' : textColor,
                  borderColor: isActive ? primaryColor : borderColor,
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      )}

      {/* Facilities Grid */}
      {filteredFacilities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredFacilities.map((fac) => {
            const Icon = ICON_MAP[fac.icon] || Building2;

            return (
              <article
                key={fac.id}
                className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-l-4 flex flex-col justify-between shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                style={{
                  backgroundColor: cardBackground,
                  borderColor: borderColor,
                  borderLeftColor: secondaryColor,
                }}
              >
                <div>
                  {/* Top Row: Icon + Status */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border"
                      style={{
                        backgroundColor: `${primaryColor}14`,
                        borderColor: `${primaryColor}25`,
                      }}
                    >
                      <Icon size={24} style={{ color: primaryColor }} />
                    </div>

                    <span className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-600/15 text-emerald-600 border border-emerald-600/30">
                      <CheckCircle2 size={12} />
                      {fac.status || 'Open'}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h2
                    className="text-base sm:text-lg font-extrabold tracking-tight mb-2"
                    style={{ color: textColor }}
                  >
                    {fac.title}
                  </h2>
                  <p
                    className="text-xs sm:text-sm font-medium leading-relaxed mb-6"
                    style={{ color: iconColor }}
                  >
                    {fac.description}
                  </p>
                </div>

                {/* Metrics Box */}
                {fac.details && fac.details.length > 0 && (
                  <div
                    className="p-3.5 rounded-xl border flex flex-col gap-2"
                    style={{
                      backgroundColor: `${textColor}05`,
                      borderColor: borderColor,
                    }}
                  >
                    {fac.details.map((det, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center text-xs pb-1.5 last:pb-0 border-b last:border-b-0 border-dashed"
                        style={{ borderColor: borderColor }}
                      >
                        <span className="font-semibold" style={{ color: iconColor }}>
                          {det.label}
                        </span>
                        <span className="font-bold" style={{ color: primaryColor }}>
                          {det.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center">
          <p className="text-sm font-medium" style={{ color: iconColor }}>
            No facilities listed for this mosque.
          </p>
        </div>
      )}
    </div>
  );
}