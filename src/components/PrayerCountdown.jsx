'use client';

import React, { useEffect, useState } from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';

function parseTimeToDate(timeStr) {
  if (!timeStr || timeStr === '-') return null;
  const [hours, minutes] = timeStr.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) return null;

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

export function PrayerCountdown({ data }) {
  const textColor = useThemeColor({}, 'text');
  const primaryColor = useThemeColor({}, 'primary');
  const cardBackground = useThemeColor({}, 'cardBackground');
  const borderColor = useThemeColor({}, 'border');
  const iconColor = useThemeColor({}, 'icon');
  const secondaryColor = useThemeColor({}, 'secondary');

  const [timeLeft, setTimeLeft] = useState(null);
  const [nextPrayerName, setNextPrayerName] = useState('');

  useEffect(() => {
    if (!data) return;

    const prayers = [
      { name: 'Fajr', time: data.fajrAdhaan },
      { name: 'Sunrise', time: data.sunrise },
      { name: data.isFriday ? 'Jummah' : 'Dhuhr', time: data.dhuhrAdhaan },
      { name: 'Asr', time: data.asrAdhaan },
      { name: 'Maghrib', time: data.maghribAdhaan },
      { name: 'Isha', time: data.ishaAdhaan },
    ];

    function updateCountdown() {
      const now = new Date();

      // Find next prayer today
      let nextTarget = null;
      for (const p of prayers) {
        const prayerDate = parseTimeToDate(p.time);
        if (prayerDate && prayerDate.getTime() > now.getTime()) {
          nextTarget = { name: p.name, targetDate: prayerDate };
          break;
        }
      }

      // If all prayers today passed, target tomorrow's Fajr
      if (!nextTarget) {
        const tomorrowFajr = parseTimeToDate(data.fajrAdhaan);
        if (tomorrowFajr) {
          tomorrowFajr.setDate(tomorrowFajr.getDate() + 1);
          nextTarget = { name: 'Fajr', targetDate: tomorrowFajr };
        }
      }

      if (nextTarget) {
        setNextPrayerName(nextTarget.name);
        const diffMs = nextTarget.targetDate.getTime() - now.getTime();

        if (diffMs > 0) {
          const totalSecs = Math.floor(diffMs / 1000);
          const hours = Math.floor(totalSecs / 3600);
          const minutes = Math.floor((totalSecs % 3600) / 60);
          const seconds = totalSecs % 60;
          setTimeLeft({ hours, minutes, seconds });
        }
      }
    }

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [data]);

  if (!timeLeft) return null;

  const pad = (num) => String(num).padStart(2, '0');

  return (
    <div
      className="w-full max-w-md mx-auto flex flex-col items-center py-5 px-5 rounded-[20px] border shadow-sm transition-colors duration-200"
      style={{
        backgroundColor: cardBackground,
        borderColor: borderColor,
      }}
    >
      {/* Top Pill Badge */}
      <div className="flex items-center mb-2">
        <div
          className="flex items-center px-2.5 py-1 rounded-full border gap-1.5"
          style={{ borderColor: borderColor }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: secondaryColor }}
          />
          <span
            className="text-[10px] font-bold tracking-[1.2px] uppercase"
            style={{ color: iconColor }}
          >
            UPCOMING PRAYER
          </span>
        </div>
      </div>

      {/* Target Prayer Title */}
      <h3
        className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3.5"
        style={{ color: textColor }}
      >
        {nextPrayerName}
      </h3>

      {/* Clock Counter Display */}
      <div className="flex items-center justify-center w-full">
        {/* Hours */}
        <div className="flex flex-col items-center min-w-13.5">
          <span
            className="text-3xl sm:text-4xl font-extrabold tabular-nums tracking-tight"
            style={{ color: primaryColor }}
          >
            {pad(timeLeft.hours)}
          </span>
          <span
            className="text-[9px] font-bold tracking-wider mt-1"
            style={{ color: iconColor }}
          >
            HRS
          </span>
        </div>

        <span
          className="text-2xl sm:text-3xl font-light mx-1.5 pb-4 opacity-50 select-none"
          style={{ color: iconColor }}
        >
          :
        </span>

        {/* Minutes */}
        <div className="flex flex-col items-center min-w-13.5">
          <span
            className="text-3xl sm:text-4xl font-extrabold tabular-nums tracking-tight"
            style={{ color: primaryColor }}
          >
            {pad(timeLeft.minutes)}
          </span>
          <span
            className="text-[9px] font-bold tracking-wider mt-1"
            style={{ color: iconColor }}
          >
            MIN
          </span>
        </div>

        <span
          className="text-2xl sm:text-3xl font-light mx-1.5 pb-4 opacity-50 select-none"
          style={{ color: iconColor }}
        >
          :
        </span>

        {/* Seconds */}
        <div className="flex flex-col items-center min-w-13.5">
          <span
            className="text-3xl sm:text-4xl font-extrabold tabular-nums tracking-tight"
            style={{ color: primaryColor }}
          >
            {pad(timeLeft.seconds)}
          </span>
          <span
            className="text-[9px] font-bold tracking-wider mt-1"
            style={{ color: iconColor }}
          >
            SEC
          </span>
        </div>
      </div>
    </div>
  );
}