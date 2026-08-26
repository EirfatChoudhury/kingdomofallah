// src/components/ContactDetails.jsx
'use client';

import React from 'react';
import { MapPin, Phone, Mail, ExternalLink, ChevronRight } from 'lucide-react';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useMasjid } from '@/context/MasjidContext';

export function ContactDetails() {
  const { currentMasjid } = useMasjid();

  const textColor = useThemeColor({}, 'text');
  const cardBackground = useThemeColor({}, 'cardBackground');
  const primaryColor = useThemeColor({}, 'primary');
  const borderColor = useThemeColor({}, 'border');
  const iconColor = useThemeColor({}, 'icon');

  const contact = currentMasjid?.contact || {};

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    contact.address || ''
  )}`;

  return (
    <div className="w-full">
      <h3
        className="text-sm sm:text-base font-extrabold tracking-tight mb-3"
        style={{ color: textColor }}
      >
        Get in Touch
      </h3>

      <div className="flex flex-col gap-2.5">
        {/* Address */}
        {contact.address && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-3.5 rounded-2xl border transition-transform active:scale-[0.99] hover:opacity-95 cursor-pointer"
            style={{ backgroundColor: cardBackground, borderColor: borderColor }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mr-3.5 shrink-0"
              style={{ backgroundColor: `${primaryColor}14` }}
            >
              <MapPin size={20} style={{ color: primaryColor }} />
            </div>
            <div className="flex-1 min-w-0 pr-2">
              <span
                className="block text-[10px] font-extrabold tracking-wider uppercase mb-0.5"
                style={{ color: iconColor }}
              >
                VISIT US
              </span>
              <p
                className="text-xs sm:text-sm font-semibold leading-snug truncate"
                style={{ color: textColor }}
              >
                {contact.address}
              </p>
            </div>
            <ExternalLink size={16} style={{ color: iconColor }} className="shrink-0" />
          </a>
        )}

        {/* Phone */}
        {contact.phone && (
          <a
            href={`tel:${contact.phone}`}
            className="flex items-center p-3.5 rounded-2xl border transition-transform active:scale-[0.99] hover:opacity-95 cursor-pointer"
            style={{ backgroundColor: cardBackground, borderColor: borderColor }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mr-3.5 shrink-0"
              style={{ backgroundColor: `${primaryColor}14` }}
            >
              <Phone size={20} style={{ color: primaryColor }} />
            </div>
            <div className="flex-1 min-w-0 pr-2">
              <span
                className="block text-[10px] font-extrabold tracking-wider uppercase mb-0.5"
                style={{ color: iconColor }}
              >
                PHONE
              </span>
              <p
                className="text-xs sm:text-sm font-semibold leading-snug"
                style={{ color: textColor }}
              >
                {contact.phone}
              </p>
            </div>
            <ChevronRight size={16} style={{ color: iconColor }} className="shrink-0" />
          </a>
        )}

        {/* Email */}
        {contact.email && (
          <a
            href={`mailto:${contact.email}`}
            className="flex items-center p-3.5 rounded-2xl border transition-transform active:scale-[0.99] hover:opacity-95 cursor-pointer"
            style={{ backgroundColor: cardBackground, borderColor: borderColor }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mr-3.5 shrink-0"
              style={{ backgroundColor: `${primaryColor}14` }}
            >
              <Mail size={20} style={{ color: primaryColor }} />
            </div>
            <div className="flex-1 min-w-0 pr-2">
              <span
                className="block text-[10px] font-extrabold tracking-wider uppercase mb-0.5"
                style={{ color: iconColor }}
              >
                EMAIL
              </span>
              <p
                className="text-xs sm:text-sm font-semibold leading-snug truncate"
                style={{ color: textColor }}
              >
                {contact.email}
              </p>
            </div>
            <ChevronRight size={16} style={{ color: iconColor }} className="shrink-0" />
          </a>
        )}
      </div>
    </div>
  );
}