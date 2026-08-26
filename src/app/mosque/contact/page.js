// src/app/mosque/contact/page.js
'use client';

import React from 'react';
import { MasjidNavbar } from '@/components/MasjidNavbar';
import { ContactDetails } from '@/components/ContactDetails';
import { DonationDetails } from '@/components/DonationDetails';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useMasjid } from '@/context/MasjidContext';

export default function MosqueContactPage() {
  const { currentMasjid } = useMasjid();
  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');
  const borderColor = useThemeColor({}, 'border');

  return (
    <div className="min-h-screen flex flex-col">
      <MasjidNavbar />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 pb-12 flex flex-col">
        {/* Header */}
        <div className="text-center mb-6">
          <h2
            className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-1"
            style={{ color: textColor }}
          >
            Contact & Support
          </h2>
          <p className="text-xs sm:text-sm font-medium" style={{ color: iconColor }}>
            Get in touch or support {currentMasjid?.name}
          </p>
        </div>

        {/* Modular Sections */}
        <ContactDetails />
        <DonationDetails />

        {/* Footer */}
        {currentMasjid?.contact?.charityNumber && (
          <div
            className="mt-8 pt-5 border-t text-center"
            style={{ borderColor: borderColor }}
          >
            <p
              className="text-xs font-semibold tracking-wide"
              style={{ color: iconColor }}
            >
              Registered Charity No: {currentMasjid.contact.charityNumber}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}