// src/app/mosque/classes/page.js
'use client';

import React from 'react';
import { MasjidNavbar } from '@/components/MasjidNavbar';
import { WeeklyClassesCalendar } from '@/components/WeeklyClassesCalendar';

export default function ClassesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <MasjidNavbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <WeeklyClassesCalendar />
      </main>
    </div>
  );
}