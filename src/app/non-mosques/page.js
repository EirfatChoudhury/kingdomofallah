// src/app/non-mosques/page.js
'use client';

import React from 'react';
import { MainNavbar } from '@/components/MainNavbar';
import { Footer } from '@/components/Footer';
import { AllMemberNonMosquesView } from '@/components/AllMemberNonMosquesView';

export default function NonMosquesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <MainNavbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex flex-col">
        <AllMemberNonMosquesView />
      </main>

      <Footer />
    </div>
  );
}