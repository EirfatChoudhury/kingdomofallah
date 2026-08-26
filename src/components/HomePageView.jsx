// src/components/HomePageView.jsx
'use client';

import React from 'react';
import { MainNavbar } from '@/components/MainNavbar';
import { Hero } from '@/components/Hero';
import { MainAnnouncementsGrid } from '@/components/MainAnnouncementsGrid';
import { Footer } from '@/components/Footer';

export function HomePageView({ memberStripSlot }) {
  return (
    <div className="min-h-screen flex flex-col">
      <MainNavbar />

      <main className="flex-1 w-full flex flex-col">
        {/* Hero Section */}
        <Hero />

        {/* Member Mosques Conveyor Strip Slot */}
        {memberStripSlot}

        {/* Announcements Component */}
        <MainAnnouncementsGrid />
      </main>

      {/* Replaced Feature Grid with Footer */}
      <Footer />
    </div>
  );
}