'use client';

import React from 'react';
import { MainNavbar } from '@/components/MainNavbar';
import { EventsGrid } from '@/components/EventsGrid';

export default function EventsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <MainNavbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <EventsGrid />
      </main>
    </div>
  );
}