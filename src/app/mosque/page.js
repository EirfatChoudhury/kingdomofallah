'use client';

import React, { useEffect, useState } from 'react';
import { MasjidNavbar } from '@/components/MasjidNavbar';
import { MasjidHeader } from '@/components/MasjidHeader';
import { PrayerTimesTable } from '@/components/PrayerTimesTables';
import { PrayerCountdown } from '@/components/PrayerCountdown';
import { useMasjid } from '@/context/MasjidContext';
import { getTodayPrayerTimes } from '@/services/prayerTimesService';

export default function MosquePortalPage() {
  const { currentMasjid } = useMasjid();
  const [prayerData, setPrayerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    async function loadData() {
      if (!currentMasjid?.prayerTimesCsvUrl) return;
      const data = await getTodayPrayerTimes(currentMasjid.prayerTimesCsvUrl, currentMasjid.id);
      if (isMounted) {
        setPrayerData(data);
        setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [currentMasjid]);

  return (
    <div className="min-h-screen flex flex-col">
      <MasjidNavbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col items-center gap-6">
        <MasjidHeader />

        {loading ? (
          <div className="py-12 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current" />
          </div>
        ) : (
          <div className="w-full flex flex-col items-center gap-6">
            <PrayerCountdown data={prayerData} />
            <PrayerTimesTable data={prayerData} />
          </div>
        )}
      </main>
    </div>
  );
}