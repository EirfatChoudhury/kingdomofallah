'use client';

import React from 'react';
import { MasjidNavbar } from '@/components/MasjidNavbar';
import { FacilitiesGrid } from '@/components/FacilitiesGrid';

export default function MosqueFacilitiesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <MasjidNavbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 pb-12">
        <FacilitiesGrid />
      </main>
    </div>
  );
}