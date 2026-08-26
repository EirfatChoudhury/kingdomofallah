// src/app/mosque/about/page.js
'use client';

import React from 'react';
import { MasjidNavbar } from '@/components/MasjidNavbar';
import { GalleryCarousel } from '@/components/GalleryCarousel';
import { TeamGrid } from '@/components/TeamGrid';

export default function MosqueAboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <MasjidNavbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 pb-12 flex flex-col">
        <GalleryCarousel />
        <TeamGrid />
      </main>
    </div>
  );
}