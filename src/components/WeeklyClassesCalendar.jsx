'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { useThemeColor } from '@/hooks/useThemeColor';
import { loadClassesFromCSV } from '@/services/classesService';
import { useMasjid } from '@/context/MasjidContext';

export function WeeklyClassesCalendar() {
  const router = useRouter();
  const { currentMasjid } = useMasjid();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState('All');

  const textColor = useThemeColor({}, 'text');
  const cardBackground = useThemeColor({}, 'cardBackground');
  const primaryColor = useThemeColor({}, 'primary');
  const secondaryColor = useThemeColor({}, 'secondary');
  const borderColor = useThemeColor({}, 'border');
  const iconColor = useThemeColor({}, 'icon');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    async function fetchData() {
      if (!currentMasjid?.classesCsvUrl) return;
      try {
        const data = await loadClassesFromCSV(currentMasjid.classesCsvUrl, currentMasjid.id);
        if (isMounted) {
          setClasses(data);
        }
      } catch (err) {
        console.error('Failed to load classes CSV:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [currentMasjid]);

  const uniqueCategories = useMemo(() => {
    const categoriesSet = new Set();
    classes.forEach((c) => {
      c.categories.forEach((cat) => categoriesSet.add(cat));
    });
    return ['All', ...Array.from(categoriesSet)];
  }, [classes]);

  const getDaysOfWeek = (baseDate) => {
    const current = new Date(baseDate);
    const day = current.getDay();
    const diffToMonday = current.getDate() - day + (day === 0 ? -6 : 1);

    const monday = new Date(current.setDate(diffToMonday));
    monday.setHours(0, 0, 0, 0);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const weekDays = getDaysOfWeek(currentDate);
  const monday = weekDays[0];
  const sunday = weekDays[6];

  const handlePrevWeek = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 7);
    setCurrentDate(prev);
  };

  const handleNextWeek = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 7);
    setCurrentDate(next);
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const headerLabel = `${monday.toLocaleDateString('default', {
    day: 'numeric',
    month: 'short',
  })} - ${sunday.toLocaleDateString('default', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })}`;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div
          className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: `${primaryColor} transparent transparent transparent` }}
        />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col">
      {/* 1. Week Navigator */}
      <div className="flex items-center justify-between py-2 px-4 max-w-md mx-auto w-full mb-3">
        <button
          onClick={handlePrevWeek}
          className="p-2 rounded-full hover:opacity-75 transition-opacity cursor-pointer"
          aria-label="Previous week"
        >
          <ChevronLeft size={22} style={{ color: primaryColor }} />
        </button>
        <span
          className="text-base sm:text-lg font-extrabold tracking-tight select-none"
          style={{ color: textColor }}
        >
          {headerLabel}
        </span>
        <button
          onClick={handleNextWeek}
          className="p-2 rounded-full hover:opacity-75 transition-opacity cursor-pointer"
          aria-label="Next week"
        >
          <ChevronRight size={22} style={{ color: primaryColor }} />
        </button>
      </div>

      {/* 2. Category Filter Chips */}
      <div className="w-full overflow-x-auto no-scrollbar mb-5 px-2">
        <div className="flex items-center gap-2 min-w-max mx-auto justify-start md:justify-center">
          {uniqueCategories.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className="py-1.5 px-4 rounded-full text-xs font-bold transition-all border shrink-0 cursor-pointer"
                style={{
                  backgroundColor: isSelected ? primaryColor : cardBackground,
                  borderColor: isSelected ? primaryColor : borderColor,
                  color: isSelected ? '#FFFFFF' : textColor,
                }}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Responsive Calendar Grid */}
      <div className="w-full overflow-x-auto xl:overflow-x-visible pb-4 no-scrollbar">
        <div className="flex xl:grid xl:grid-cols-7 gap-3 min-w-max xl:min-w-0">
          {weekDays.map((dayDate) => {
            const dayIndex = dayDate.getDay();
            const year = dayDate.getFullYear();
            const month = String(dayDate.getMonth() + 1).padStart(2, '0');
            const day = String(dayDate.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;

            const dayClasses = classes.filter((c) => {
              const matchesDayOrDate = c.date ? c.date === dateStr : c.dayOfWeek === dayIndex;
              const matchesCategory =
                selectedCategory === 'All' || c.categories.includes(selectedCategory);
              return matchesDayOrDate && matchesCategory;
            });

            const activeToday = isToday(dayDate);

            return (
              <div
                key={dayDate.toISOString()}
                className={`w-55 xl:w-auto rounded-2xl border flex flex-col shrink-0 xl:shrink min-h-105 ${
                  activeToday ? 'border-2 ring-1' : ''
                }`}
                style={{
                  backgroundColor: cardBackground,
                  borderColor: activeToday ? primaryColor : borderColor,
                  ...(activeToday ? { ringColor: `${primaryColor}30` } : {}),
                }}
              >
                {/* Day Header */}
                <div
                  className="py-3 px-2 flex flex-col items-center border-b"
                  style={{
                    borderColor: borderColor,
                    backgroundColor: activeToday ? `${primaryColor}14` : 'transparent',
                  }}
                >
                  <span
                    className="text-[11px] font-extrabold uppercase tracking-wider"
                    style={{ color: activeToday ? primaryColor : iconColor }}
                  >
                    {dayDate.toLocaleDateString('default', { weekday: 'short' })}
                  </span>
                  <span
                    className="text-lg font-extrabold"
                    style={{ color: activeToday ? primaryColor : textColor }}
                  >
                    {dayDate.getDate()}
                  </span>
                </div>

                {/* Day's Classes Stack */}
                <div className="p-2.5 flex flex-col gap-2.5 flex-1 overflow-y-auto max-h-145 no-scrollbar">
                  {dayClasses.length > 0 ? (
                    dayClasses.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl border border-l-4 flex flex-col justify-between"
                        style={{
                          borderColor: borderColor,
                          borderLeftColor: secondaryColor,
                          backgroundColor: cardBackground,
                        }}
                      >
                        <div>
                          <span
                            className="text-[11px] font-extrabold mb-1 block tabular-nums"
                            style={{ color: primaryColor }}
                          >
                            {item.time}
                          </span>
                          <h4
                            className="text-xs font-bold leading-snug mb-1"
                            style={{ color: textColor }}
                          >
                            {item.title}
                          </h4>
                          <p
                            className="text-[11px] font-medium mb-0.5 truncate"
                            style={{ color: iconColor }}
                          >
                            {item.instructor}
                          </p>
                          <div
                            className="flex items-center gap-1 text-[10px] font-medium mb-2.5"
                            style={{ color: iconColor }}
                          >
                            <MapPin size={11} className="shrink-0" />
                            <span className="truncate">{item.location}</span>
                          </div>

                          {/* Category Badges */}
                          <div className="flex flex-wrap gap-1 mb-2.5">
                            {item.categories.map((cat) => (
                              <span
                                key={cat}
                                className="px-1.5 py-0.5 rounded text-[8.5px] font-semibold border"
                                style={{
                                  borderColor: borderColor,
                                  color: iconColor,
                                }}
                              >
                                {cat}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Availability & Enrolment */}
                        {item.availability === 'space available' && (
                          <button
                            onClick={() =>
                              router.push(
                                `/mosque/enrolment?classTitle=${encodeURIComponent(
                                  item.title
                                )}&classId=${encodeURIComponent(item.id)}`
                              )
                            }
                            className="w-full py-1.5 rounded-lg text-xs font-bold text-white text-center transition-opacity hover:opacity-90 active:scale-95 mt-1 cursor-pointer"
                            style={{ backgroundColor: primaryColor }}
                          >
                            Enrol
                          </button>
                        )}

                        {item.availability === 'no space' && (
                          <div className="w-full py-1.5 rounded-lg bg-red-500/10 text-center mt-1">
                            <span className="text-[10px] font-bold text-red-500">
                              Fully Booked
                            </span>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center my-auto">
                      <span className="text-xs font-medium" style={{ color: iconColor }}>
                        No classes
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}