// src/app/mosque/timetable/page.js
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MasjidNavbar } from '@/components/MasjidNavbar';
import { loadPrayerTimesFromCSV } from '@/services/prayerTimesService';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useMasjid } from '@/context/MasjidContext';

export default function TimetablePage() {
  const { currentMasjid } = useMasjid();
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('week');
  const [currentDate, setCurrentDate] = useState(new Date());

  const cardBackground = useThemeColor({}, 'cardBackground');
  const textColor = useThemeColor({}, 'text');
  const primaryColor = useThemeColor({}, 'primary');
  const secondaryColor = useThemeColor({}, 'secondary');
  const borderColor = useThemeColor({}, 'border');
  const iconColor = useThemeColor({}, 'icon');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    async function fetchFullSchedule() {
      if (!currentMasjid?.prayerTimesCsvUrl) return;
      try {
        const rows = await loadPrayerTimesFromCSV(
          currentMasjid.prayerTimesCsvUrl,
          currentMasjid.id
        );
        if (isMounted) {
          setSchedule(rows);
        }
      } catch (error) {
        console.error('Failed to load full timetable:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchFullSchedule();

    return () => {
      isMounted = false;
    };
  }, [currentMasjid]);

  const isCurrentDay = (dateStr) => {
    const today = new Date();
    const rowDate = new Date(dateStr);
    return (
      today.getFullYear() === rowDate.getFullYear() &&
      today.getMonth() === rowDate.getMonth() &&
      today.getDate() === rowDate.getDate()
    );
  };

  const filteredData = useMemo(() => {
    if (!schedule.length) return [];

    if (viewMode === 'month') {
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const prefix = `${year}-${month}`;
      return schedule.filter((row) => row.date.startsWith(prefix));
    }

    const current = new Date(currentDate);
    const day = current.getDay();
    const diffToMonday = current.getDate() - day + (day === 0 ? -6 : 1);

    const startOfWeek = new Date(current.setDate(diffToMonday));
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return schedule.filter((row) => {
      const rowDate = new Date(row.date);
      return rowDate >= startOfWeek && rowDate <= endOfWeek;
    });
  }, [schedule, viewMode, currentDate]);

  const handlePrev = () => {
    const nextDate = new Date(currentDate);
    if (viewMode === 'month') {
      nextDate.setMonth(nextDate.getMonth() - 1);
    } else {
      nextDate.setDate(nextDate.getDate() - 7);
    }
    setCurrentDate(nextDate);
  };

  const handleNext = () => {
    const nextDate = new Date(currentDate);
    if (viewMode === 'month') {
      nextDate.setMonth(nextDate.getMonth() + 1);
    } else {
      nextDate.setDate(nextDate.getDate() + 7);
    }
    setCurrentDate(nextDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const headerLabel = useMemo(() => {
    if (viewMode === 'month') {
      return currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' });
    }
    const current = new Date(currentDate);
    const day = current.getDay();
    const diffToMonday = current.getDate() - day + (day === 0 ? -6 : 1);

    const monday = new Date(current.setDate(diffToMonday));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const startLabel = monday.toLocaleDateString('default', { day: 'numeric', month: 'short' });
    const endLabel = sunday.toLocaleDateString('default', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    return `${startLabel} - ${endLabel}`;
  }, [currentDate, viewMode]);

  return (
    <div className="min-h-screen flex flex-col">
      <MasjidNavbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col items-center">
        <div className="w-full max-w-3xl flex flex-col gap-3">
          
          {/* Top View Mode Switcher + Today Button */}
          <div className="flex items-center justify-between relative max-w-sm mx-auto w-full px-2 mt-1">
            <div
              className="flex rounded-full border p-1"
              style={{ backgroundColor: cardBackground, borderColor: borderColor }}
            >
              <button
                onClick={() => setViewMode('week')}
                className="py-1.5 px-5 rounded-full text-xs font-bold transition-all cursor-pointer"
                style={{
                  backgroundColor: viewMode === 'week' ? primaryColor : 'transparent',
                  color: viewMode === 'week' ? '#FFFFFF' : textColor,
                }}
              >
                Week
              </button>
              <button
                onClick={() => setViewMode('month')}
                className="py-1.5 px-5 rounded-full text-xs font-bold transition-all cursor-pointer"
                style={{
                  backgroundColor: viewMode === 'month' ? primaryColor : 'transparent',
                  color: viewMode === 'month' ? '#FFFFFF' : textColor,
                }}
              >
                Month
              </button>
            </div>

            <button
              onClick={handleToday}
              className="py-1.5 px-3.5 rounded-full border text-xs font-bold transition-transform active:scale-95 cursor-pointer"
              style={{
                backgroundColor: cardBackground,
                borderColor: borderColor,
                color: primaryColor,
              }}
            >
              Today
            </button>
          </div>

          {/* Date Switcher Navigator */}
          <div className="flex items-center justify-between px-2 py-2 max-w-sm mx-auto w-full">
            <button
              onClick={handlePrev}
              className="p-2 rounded-full hover:opacity-75 transition-opacity cursor-pointer"
              aria-label="Previous date range"
            >
              <ChevronLeft size={20} style={{ color: primaryColor }} />
            </button>
            <span
              className="text-base font-extrabold tracking-tight select-none"
              style={{ color: textColor }}
            >
              {headerLabel}
            </span>
            <button
              onClick={handleNext}
              className="p-2 rounded-full hover:opacity-75 transition-opacity cursor-pointer"
              aria-label="Next date range"
            >
              <ChevronRight size={20} style={{ color: primaryColor }} />
            </button>
          </div>

          {/* Timetable Card Enclosure */}
          <div
            className="rounded-[20px] border overflow-hidden shadow-sm"
            style={{ backgroundColor: cardBackground, borderColor: borderColor }}
          >
            {/* Table Column Headers */}
            <div
              className="grid grid-cols-6 items-center py-3 px-3 border-b text-[10px] font-bold tracking-wider text-center"
              style={{ borderColor: borderColor, color: iconColor }}
            >
              <span className="col-span-1 text-left">DATE</span>
              <span>FAJR</span>
              <span>DHUHR</span>
              <span>ASR</span>
              <span>MAGH</span>
              <span>ISHA</span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div
                  className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
                  style={{ borderColor: `${primaryColor} transparent transparent transparent` }}
                />
              </div>
            ) : filteredData.length > 0 ? (
              <div className="divide-y" style={{ borderColor: borderColor }}>
                {filteredData.map((item) => {
                  const today = isCurrentDay(item.date);
                  const formattedDate = new Date(item.date).toLocaleDateString('default', {
                    weekday: 'short',
                    day: 'numeric',
                  });

                  return (
                    <div
                      key={item.date}
                      className={`grid grid-cols-6 items-center py-3 px-3 text-xs sm:text-sm transition-colors ${
                        today ? 'border-l-4' : ''
                      }`}
                      style={{
                        borderLeftColor: today ? secondaryColor : 'transparent',
                        backgroundColor: today ? `${primaryColor}12` : 'transparent',
                      }}
                    >
                      {/* Date Column */}
                      <div className="col-span-1 flex flex-col items-start">
                        <span
                          className={`text-xs ${today ? 'font-extrabold' : 'font-semibold'}`}
                          style={{ color: today ? primaryColor : textColor }}
                        >
                          {formattedDate}
                        </span>
                        {today && (
                          <span
                            className="text-[8px] font-extrabold px-1.5 py-0.5 rounded mt-0.5 tracking-wider"
                            style={{
                              backgroundColor: secondaryColor,
                              color: '#0D1714',
                            }}
                          >
                            TODAY
                          </span>
                        )}
                      </div>

                      {/* Prayer Time Columns */}
                      <span
                        className={`text-center tabular-nums ${
                          today ? 'font-extrabold' : 'font-medium'
                        }`}
                        style={{ color: today ? primaryColor : textColor }}
                      >
                        {item.fajrAdhaan}
                      </span>
                      <span
                        className={`text-center tabular-nums ${
                          today ? 'font-extrabold' : 'font-medium'
                        }`}
                        style={{ color: today ? primaryColor : textColor }}
                      >
                        {item.isFriday ? item.jummah : item.dhuhrAdhaan}
                      </span>
                      <span
                        className={`text-center tabular-nums ${
                          today ? 'font-extrabold' : 'font-medium'
                        }`}
                        style={{ color: today ? primaryColor : textColor }}
                      >
                        {item.asrAdhaan}
                      </span>
                      <span
                        className={`text-center tabular-nums ${
                          today ? 'font-extrabold' : 'font-medium'
                        }`}
                        style={{ color: today ? primaryColor : textColor }}
                      >
                        {item.maghribAdhaan}
                      </span>
                      <span
                        className={`text-center tabular-nums ${
                          today ? 'font-extrabold' : 'font-medium'
                        }`}
                        style={{ color: today ? primaryColor : textColor }}
                      >
                        {item.ishaAdhaan}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-xs font-medium" style={{ color: iconColor }}>
                  No prayer times available for this period.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}