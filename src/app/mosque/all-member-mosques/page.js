// src/app/mosque/all-member-mosques/page.js
'use client';

import React from 'react';
import { MasjidNavbar } from '@/components/MasjidNavbar';
import { Footer } from '@/components/Footer';
import { AllMemberMosquesView } from '@/components/AllMemberMosquesView';

export default function AllMemberMosquesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <MasjidNavbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex flex-col">
        <AllMemberMosquesView />
      </main>

      <Footer />
    </div>
  );
}