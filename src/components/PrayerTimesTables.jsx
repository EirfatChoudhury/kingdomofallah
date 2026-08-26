'use client';

import React, { useEffect, useState } from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';

function timeToMinutes(timeStr) {
  if (!timeStr || timeStr === '-') return null;
  const [hours, minutes] = timeStr.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) return null;
  return hours * 60 + minutes;
}

export function PrayerTimesTable({ data }) {
  const textColor = useThemeColor({}, 'text');
  const primaryColor = useThemeColor({}, 'primary');
  const cardBackground = useThemeColor({}, 'cardBackground');
  const borderColor = useThemeColor({}, 'border');
  const iconColor = useThemeColor({}, 'icon');
  const secondaryColor = useThemeColor({}, 'secondary');

  const [activePrayer, setActivePrayer] = useState(null);

  const prayers = [
    { name: 'Fajr', adhaan: data?.fajrAdhaan || '-', iqamah: data?.fajrIqamah || '-' },
    { name: 'Sunrise', adhaan: data?.sunrise || '-', iqamah: '-' },
    {
      name: data?.isFriday ? 'Jummah' : 'Dhuhr',
      adhaan: data?.dhuhrAdhaan || '-',
      iqamah: data?.dhuhrIqamah || '-',
    },
    { name: 'Asr', adhaan: data?.asrAdhaan || '-', iqamah: data?.asrIqamah || '-' },
    { name: 'Maghrib', adhaan: data?.maghribAdhaan || '-', iqamah: data?.maghribIqamah || '-' },
    { name: 'Isha', adhaan: data?.ishaAdhaan || '-', iqamah: data?.ishaIqamah || '-' },
  ];

  useEffect(() => {
    function computeCurrentPrayer() {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      let current = null;

      for (const prayer of prayers) {
        const prayerMinutes = timeToMinutes(prayer.adhaan);
        if (prayerMinutes !== null && currentMinutes >= prayerMinutes) {
          current = prayer.name;
        }
      }

      if (!current) {
        current = 'Isha';
      }

      setActivePrayer(current);
    }

    computeCurrentPrayer();
    const interval = setInterval(computeCurrentPrayer, 30000);
    return () => clearInterval(interval);
  }, [data]);

  if (!data) return null;

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Date Header */}
      <div className="mb-3.5 text-center">
        <p
          className="text-[11px] font-bold tracking-[1.2px] uppercase mb-0.5"
          style={{ color: iconColor }}
        >
          {data.date}
        </p>
        <h2
          className="text-xl sm:text-2xl font-extrabold tracking-tight"
          style={{ color: textColor }}
        >
          Today's Schedule
        </h2>
      </div>

      {/* Main Table Card */}
      <div
        className="rounded-[20px] border overflow-hidden shadow-sm transition-colors duration-200"
        style={{
          backgroundColor: cardBackground,
          borderColor: borderColor,
        }}
      >
        {/* Table Column Headers */}
        <div
          className="flex items-center justify-between py-3 px-4 border-b"
          style={{ borderColor: borderColor }}
        >
          <span
            className="text-[11px] font-bold tracking-wider flex-[1.2] text-left"
            style={{ color: iconColor }}
          >
            PRAYER
          </span>
          <span
            className="text-[11px] font-bold tracking-wider flex-1 text-center"
            style={{ color: iconColor }}
          >
            ADHAAN
          </span>
          <span
            className="text-[11px] font-bold tracking-wider flex-1 text-right"
            style={{ color: iconColor }}
          >
            IQAMAH
          </span>
        </div>

        {/* Prayer Rows */}
        {prayers.map((item, index) => {
          const isCurrent = item.name === activePrayer;
          const isLast = index === prayers.length - 1;

          return (
            <div
              key={item.name}
              className={`flex items-center justify-between py-3.5 px-4 transition-colors duration-150 ${
                !isLast ? 'border-b' : ''
              }`}
              style={{
                borderColor: borderColor,
                backgroundColor: isCurrent ? `${primaryColor}14` : 'transparent',
              }}
            >
              {/* Left Column: Prayer Name + Active Accent Bar */}
              <div className="flex items-center flex-[1.2] text-left">
                {isCurrent && (
                  <div
                    className="w-1 h-4 rounded-sm mr-2 shrink-0"
                    style={{ backgroundColor: secondaryColor }}
                  />
                )}
                <span
                  className={`text-sm sm:text-base ${
                    isCurrent ? 'font-extrabold' : 'font-medium'
                  }`}
                  style={{ color: isCurrent ? primaryColor : textColor }}
                >
                  {item.name}
                </span>
              </div>

              {/* Middle Column: Adhaan */}
              <span
                className={`text-sm sm:text-base flex-1 text-center tabular-nums ${
                  isCurrent ? 'font-extrabold' : 'font-medium'
                }`}
                style={{ color: isCurrent ? primaryColor : textColor }}
              >
                {item.adhaan}
              </span>

              {/* Right Column: Iqamah */}
              <span
                className={`text-sm sm:text-base flex-1 text-right tabular-nums ${
                  isCurrent ? 'font-extrabold' : 'font-semibold'
                }`}
                style={{
                  color:
                    item.iqamah === '-'
                      ? iconColor
                      : isCurrent
                      ? primaryColor
                      : textColor,
                }}
              >
                {item.iqamah}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}