// src/components/EventsGrid.jsx
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';
import { loadEventsFromCSV } from '@/services/eventsService';
import {
  getDistanceFromLatLonInMiles,
  lookupPostcode,
} from '@/utils/geoUtils';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  XCircle,
  Filter,
  RotateCcw,
  X,
  ExternalLink,
  Search,
  Info,
  Mail,
  Phone,
  Tag,
  Repeat,
  Navigation,
  Loader2,
  Sparkles,
} from 'lucide-react';

const TIMEFRAME_OPTIONS = [
  'All',
  'Today',
  'This Week',
  'This Weekend',
  'This Month',
  'Next Month',
  'Custom',
];

const PRICE_TYPE_OPTIONS = ['All', 'Free Only', 'Custom Range'];
const RADIUS_OPTIONS = [5, 10, 25, 50, 'Custom'];

export function EventsGrid() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedEventDetails, setSelectedEventDetails] = useState(null);

  // Location States
  const [userOrigin, setUserOrigin] = useState(null); // { lat, lon, label }
  const [locationInput, setLocationInput] = useState('');
  const [selectedRadiusOption, setSelectedRadiusOption] = useState(10);
  const [customRadiusInput, setCustomRadiusInput] = useState('');
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState('');

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState('All');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Price States
  const [priceType, setPriceType] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Tag States
  const [selectedAudiences, setSelectedAudiences] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [selectedBadges, setSelectedBadges] = useState([]);
  const [selectedRecurring, setSelectedRecurring] = useState([]);

  const textColor = useThemeColor({}, 'text');
  const cardBackground = useThemeColor({}, 'cardBackground');
  const primaryColor = useThemeColor({}, 'primary');
  const secondaryColor = useThemeColor({}, 'secondary');
  const borderColor = useThemeColor({}, 'border');
  const iconColor = useThemeColor({}, 'icon');

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await loadEventsFromCSV();
        setEvents(data);
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Compute active radius distance in miles
  const effectiveRadiusMiles = useMemo(() => {
    if (selectedRadiusOption === 'Custom') {
      const parsed = parseFloat(customRadiusInput);
      return isNaN(parsed) || parsed <= 0 ? 10 : parsed;
    }
    return selectedRadiusOption;
  }, [selectedRadiusOption, customRadiusInput]);

  // Browser GPS Location Handler
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser');
      return;
    }
    setGeoLoading(true);
    setGeoError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserOrigin({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          label: 'My Current Location',
        });
        setGeoLoading(false);
      },
      () => {
        setGeoError('Unable to retrieve your location');
        setGeoLoading(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  // UK Postcode Lookup Handler
  const handleLookupPostcode = async () => {
    if (!locationInput.trim()) return;
    setGeoLoading(true);
    setGeoError('');
    const result = await lookupPostcode(locationInput);
    if (result) {
      setUserOrigin({
        lat: result.lat,
        lon: result.lon,
        label: result.name,
      });
      setLocationInput('');
    } else {
      setGeoError('Invalid UK postcode');
    }
    setGeoLoading(false);
  };

  const distinctAudiences = useMemo(() => {
    const set = new Set();
    events.forEach((ev) => ev.audiences.forEach((a) => set.add(a)));
    return Array.from(set).sort();
  }, [events]);

  const distinctActivities = useMemo(() => {
    const set = new Set();
    events.forEach((ev) => ev.activities.forEach((a) => set.add(a)));
    return Array.from(set).sort();
  }, [events]);

  const distinctBadges = useMemo(() => {
    const set = new Set();
    events.forEach((ev) => ev.badges.forEach((b) => set.add(b)));
    return Array.from(set).sort();
  }, [events]);

  const distinctRecurring = useMemo(() => {
    const set = new Set();
    events.forEach((ev) => {
      if (ev.recurring && ev.recurring.trim()) set.add(ev.recurring.trim());
    });
    return Array.from(set).sort();
  }, [events]);

  const toggleSelection = (item, selectedList, setter) => {
    if (selectedList.includes(item)) {
      setter(selectedList.filter((i) => i !== item));
    } else {
      setter([...selectedList, item]);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedTimeframe('All');
    setCustomStartDate('');
    setCustomEndDate('');
    setPriceType('All');
    setMinPrice('');
    setMaxPrice('');
    setSelectedAudiences([]);
    setSelectedActivities([]);
    setSelectedBadges([]);
    setSelectedRecurring([]);
    setUserOrigin(null);
    setLocationInput('');
    setSelectedRadiusOption(10);
    setCustomRadiusInput('');
    setGeoError('');
  };

  const parseNumericPrice = (priceStr) => {
    if (!priceStr) return 0;
    const cleanStr = priceStr.toLowerCase().replace(/[^0-9.]/g, '');
    const num = parseFloat(cleanStr);
    return isNaN(num) ? 0 : num;
  };

  const isFree = (priceStr) => {
    if (!priceStr) return true;
    const lower = priceStr.toLowerCase().trim();
    return lower === 'free' || parseNumericPrice(priceStr) === 0;
  };

  const matchesTimeframe = (eventStartStr) => {
    if (selectedTimeframe === 'All') return true;
    if (!eventStartStr) return false;

    const eventDate = new Date(eventStartStr.replace(' ', 'T'));
    if (isNaN(eventDate.getTime())) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const eventDay = new Date(eventDate);
    eventDay.setHours(0, 0, 0, 0);

    if (selectedTimeframe === 'Today') {
      return eventDay.getTime() === today.getTime();
    }

    if (selectedTimeframe === 'This Week') {
      const currentDay = today.getDay();
      const diffToMonday = today.getDate() - currentDay + (currentDay === 0 ? -6 : 1);
      const startOfWeek = new Date(today);
      startOfWeek.setDate(diffToMonday);
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      return eventDate >= startOfWeek && eventDate <= endOfWeek;
    }

    if (selectedTimeframe === 'This Weekend') {
      const currentDay = today.getDay();
      const diffToSaturday = 6 - currentDay;
      const saturday = new Date(today);
      saturday.setDate(today.getDate() + diffToSaturday);
      saturday.setHours(0, 0, 0, 0);

      const sunday = new Date(saturday);
      sunday.setDate(saturday.getDate() + 1);
      sunday.setHours(23, 59, 59, 999);

      return eventDate >= saturday && eventDate <= sunday;
    }

    if (selectedTimeframe === 'This Month') {
      return (
        eventDate.getFullYear() === today.getFullYear() &&
        eventDate.getMonth() === today.getMonth()
      );
    }

    if (selectedTimeframe === 'Next Month') {
      const nextMonthYear = today.getMonth() === 11 ? today.getFullYear() + 1 : today.getFullYear();
      const nextMonth = today.getMonth() === 11 ? 0 : today.getMonth() + 1;
      return (
        eventDate.getFullYear() === nextMonthYear &&
        eventDate.getMonth() === nextMonth
      );
    }

    if (selectedTimeframe === 'Custom') {
      if (!customStartDate && !customEndDate) return true;
      const start = customStartDate ? new Date(customStartDate) : null;
      const end = customEndDate ? new Date(customEndDate) : null;
      if (start) start.setHours(0, 0, 0, 0);
      if (end) end.setHours(23, 59, 59, 999);

      if (start && end) return eventDate >= start && eventDate <= end;
      if (start) return eventDate >= start;
      if (end) return eventDate <= end;
    }

    return true;
  };

  const filteredEvents = useMemo(() => {
    const now = new Date();
    const query = searchQuery.toLowerCase().trim();

    return events
      .filter((ev) => {
        // 1. Filter out past events
        const relevantDateStr = ev.endDatetime || ev.startDatetime;
        if (relevantDateStr) {
          const eventExpiry = new Date(relevantDateStr.replace(' ', 'T'));
          if (!isNaN(eventExpiry.getTime()) && eventExpiry < now) {
            return false;
          }
        }

        // 2. Scoped Keyword Search (Title & Description only)
        if (query) {
          const matchTitle = ev.title.toLowerCase().includes(query);
          const matchDesc = ev.description.toLowerCase().includes(query);
          if (!matchTitle && !matchDesc) {
            return false;
          }
        }

        // 3. Price Filter
        if (priceType === 'Free Only') {
          if (!isFree(ev.price)) return false;
        } else if (priceType === 'Custom Range') {
          const numPrice = parseNumericPrice(ev.price);
          const min = minPrice !== '' ? parseFloat(minPrice) : null;
          const max = maxPrice !== '' ? parseFloat(maxPrice) : null;

          if (min !== null && numPrice < min) return false;
          if (max !== null && numPrice > max) return false;
        }

        // 4. Timeframe Filter
        if (!matchesTimeframe(ev.startDatetime)) {
          return false;
        }

        // 5. Radius Location Filter
        if (userOrigin) {
          if (!ev.lat || !ev.lon) return false;
          const distance = getDistanceFromLatLonInMiles(
            userOrigin.lat,
            userOrigin.lon,
            ev.lat,
            ev.lon
          );
          if (distance > effectiveRadiusMiles) return false;
        }

        // 6. Tag Filters
        const passesAudiences =
          selectedAudiences.length === 0 ||
          selectedAudiences.some((aud) => ev.audiences.includes(aud));

        const passesActivities =
          selectedActivities.length === 0 ||
          selectedActivities.some((act) => ev.activities.includes(act));

        const passesBadges =
          selectedBadges.length === 0 ||
          selectedBadges.some((bdg) => ev.badges.includes(bdg));

        const passesRecurring =
          selectedRecurring.length === 0 ||
          selectedRecurring.includes(ev.recurring?.trim());

        return (
          passesAudiences &&
          passesActivities &&
          passesBadges &&
          passesRecurring
        );
      })
      .sort((a, b) => {
        const dateA = a.startDatetime ? new Date(a.startDatetime.replace(' ', 'T')) : null;
        const dateB = b.startDatetime ? new Date(b.startDatetime.replace(' ', 'T')) : null;

        const validDateA = dateA && !isNaN(dateA.getTime());
        const validDateB = dateB && !isNaN(dateB.getTime());

        if (validDateA && validDateB) {
          const timeDiff = dateA - dateB;
          if (timeDiff !== 0) return timeDiff;
        } else if (validDateA && !validDateB) {
          return -1;
        } else if (!validDateA && validDateB) {
          return 1;
        }

        const aFull = a.availability?.toLowerCase() === 'no space';
        const bFull = b.availability?.toLowerCase() === 'no space';
        if (!aFull && bFull) return -1;
        if (aFull && !bFull) return 1;

        return 0;
      });
  }, [
    events,
    searchQuery,
    priceType,
    minPrice,
    maxPrice,
    selectedTimeframe,
    customStartDate,
    customEndDate,
    userOrigin,
    effectiveRadiusMiles,
    selectedAudiences,
    selectedActivities,
    selectedBadges,
    selectedRecurring,
  ]);

  const formatDateTime = (startStr, endStr) => {
    if (!startStr) return { date: 'TBA', time: 'TBA' };

    const startDate = new Date(startStr.replace(' ', 'T'));
    const isInvalidStart = isNaN(startDate.getTime());

    const date = isInvalidStart
      ? startStr.split(' ')[0]
      : startDate.toLocaleDateString('default', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });

    let time = isInvalidStart
      ? startStr.split(' ')[1] || ''
      : startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (endStr) {
      const endDate = new Date(endStr.replace(' ', 'T'));
      const endTime = isNaN(endDate.getTime())
        ? endStr.split(' ')[1] || ''
        : endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      if (endTime) time += ` - ${endTime}`;
    }

    return { date, time };
  };

  const activeFiltersCount =
    (selectedTimeframe !== 'All' ? 1 : 0) +
    (priceType !== 'All' ? 1 : 0) +
    (userOrigin ? 1 : 0) +
    selectedAudiences.length +
    selectedActivities.length +
    selectedBadges.length +
    selectedRecurring.length;

  return (
    <div className="w-full flex flex-col">
      {/* Title Header with Top Badge */}
      <div className="flex flex-col gap-2 mb-6">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider w-fit"
          style={{
            backgroundColor: `${secondaryColor}15`,
            borderColor: `${secondaryColor}30`,
            color: secondaryColor,
          }}
        >
          <Sparkles size={13} />
          <span>Events</span>
        </div>

        <h1
          className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight"
          style={{ color: primaryColor }}
        >
          Kingdom of Allah Events
        </h1>
        <p className="text-xs sm:text-sm font-medium mt-1" style={{ color: iconColor }}>
          Showing {filteredEvents.length} upcoming {filteredEvents.length === 1 ? 'event' : 'events'}
        </p>
      </div>

      {/* Search Bar & Filter Modal Trigger */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
        <div
          className="flex-1 flex items-center px-4 py-2.5 rounded-2xl border transition-all shadow-sm"
          style={{ backgroundColor: cardBackground, borderColor }}
        >
          <Search size={16} style={{ color: iconColor }} className="shrink-0 mr-2.5" />
          <input
            type="text"
            placeholder="Search events by title or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs sm:text-sm font-medium outline-none placeholder:text-neutral-400"
            style={{ color: textColor }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 hover:opacity-70 cursor-pointer"
              style={{ color: iconColor }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        <button
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl border text-xs font-bold transition-all active:scale-95 shadow-sm cursor-pointer shrink-0"
          style={{
            backgroundColor: activeFiltersCount > 0 ? `${primaryColor}14` : cardBackground,
            borderColor: activeFiltersCount > 0 ? primaryColor : borderColor,
            color: activeFiltersCount > 0 ? primaryColor : textColor,
          }}
        >
          <Filter size={15} style={{ color: activeFiltersCount > 0 ? primaryColor : iconColor }} />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span
              className="w-5 h-5 rounded-full text-[10px] font-extrabold flex items-center justify-center text-white ml-0.5"
              style={{ backgroundColor: primaryColor }}
            >
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-lg rounded-3xl border shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
            style={{ backgroundColor: cardBackground, borderColor }}
          >
            {/* Modal Header */}
            <div
              className="flex items-center justify-between p-5 border-b shrink-0"
              style={{ borderColor }}
            >
              <div className="flex items-center gap-2">
                <Filter size={18} style={{ color: primaryColor }} />
                <h3 className="text-base font-extrabold" style={{ color: textColor }}>
                  Filter Events
                </h3>
              </div>

              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-1.5 rounded-full hover:opacity-75 transition-opacity cursor-pointer"
                style={{ color: iconColor }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Filter Fields */}
            <div className="p-5 flex flex-col gap-5 overflow-y-auto">
              {/* 1. Location & Radius */}
              <div className="flex flex-col gap-2.5">
                <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: iconColor }}>
                  <Navigation size={13} />
                  <span>Location Radius</span>
                </span>

                {userOrigin ? (
                  <div
                    className="p-3 rounded-2xl border flex items-center justify-between"
                    style={{ backgroundColor: `${primaryColor}10`, borderColor: `${primaryColor}30` }}
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <MapPin size={14} style={{ color: primaryColor }} className="shrink-0" />
                      <span className="text-xs font-bold truncate" style={{ color: textColor }}>
                        {userOrigin.label} ({effectiveRadiusMiles} mi)
                      </span>
                    </div>
                    <button
                      onClick={() => setUserOrigin(null)}
                      className="text-[11px] font-bold underline hover:opacity-80 cursor-pointer shrink-0"
                      style={{ color: secondaryColor }}
                    >
                      Clear
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={handleUseMyLocation}
                      disabled={geoLoading}
                      className="w-full py-2 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                      style={{
                        backgroundColor: `${primaryColor}12`,
                        borderColor: `${primaryColor}30`,
                        color: primaryColor,
                      }}
                    >
                      {geoLoading ? <Loader2 size={14} className="animate-spin" /> : <Navigation size={14} />}
                      <span>Use My Current Location</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Or enter UK Postcode..."
                        value={locationInput}
                        onChange={(e) => setLocationInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleLookupPostcode()}
                        className="flex-1 px-3 py-1.5 rounded-xl border text-xs font-medium outline-none"
                        style={{
                          backgroundColor: 'transparent',
                          borderColor,
                          color: textColor,
                        }}
                      />
                      <button
                        onClick={handleLookupPostcode}
                        disabled={geoLoading || !locationInput.trim()}
                        className="py-1.5 px-3 rounded-xl text-xs font-bold text-white transition-opacity disabled:opacity-50 cursor-pointer"
                        style={{ backgroundColor: primaryColor }}
                      >
                        Set
                      </button>
                    </div>

                    {geoError && (
                      <p className="text-[11px] font-semibold text-red-500">{geoError}</p>
                    )}
                  </div>
                )}

                {/* Radius Distance Selector */}
                <div className="flex flex-col gap-2 mt-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-bold" style={{ color: iconColor }}>Radius:</span>
                    <div className="flex gap-1.5 flex-wrap">
                      {RADIUS_OPTIONS.map((rad) => {
                        const isSelected = selectedRadiusOption === rad;
                        return (
                          <button
                            key={`radius-opt-${rad}`}
                            onClick={() => setSelectedRadiusOption(rad)}
                            className="py-0.5 px-2.5 rounded-full text-[11px] font-bold transition-all border shrink-0 cursor-pointer"
                            style={{
                              backgroundColor: isSelected ? primaryColor : 'transparent',
                              borderColor: isSelected ? primaryColor : borderColor,
                              color: isSelected ? '#FFFFFF' : textColor,
                            }}
                          >
                            {typeof rad === 'number' ? `${rad} mi` : rad}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {selectedRadiusOption === 'Custom' && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-semibold" style={{ color: iconColor }}>Distance (miles):</span>
                      <input
                        type="number"
                        min="1"
                        placeholder="e.g. 15"
                        value={customRadiusInput}
                        onChange={(e) => setCustomRadiusInput(e.target.value)}
                        className="w-24 px-2.5 py-1 rounded-xl border text-xs font-medium outline-none"
                        style={{
                          backgroundColor: 'transparent',
                          borderColor,
                          color: textColor,
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* 2. Timeframe */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: iconColor }}>
                  Timeframe
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {TIMEFRAME_OPTIONS.map((tf) => {
                    const isSelected = selectedTimeframe === tf;
                    return (
                      <button
                        key={`tf-opt-${tf}`}
                        onClick={() => setSelectedTimeframe(tf)}
                        className="py-1 px-3 rounded-full text-xs font-bold transition-all border shrink-0 cursor-pointer"
                        style={{
                          backgroundColor: isSelected ? primaryColor : 'transparent',
                          borderColor: isSelected ? primaryColor : borderColor,
                          color: isSelected ? '#FFFFFF' : textColor,
                        }}
                      >
                        {tf}
                      </button>
                    );
                  })}
                </div>

                {selectedTimeframe === 'Custom' && (
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold" style={{ color: iconColor }}>From:</span>
                      <input
                        type="date"
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate(e.target.value)}
                        className="px-2.5 py-1 rounded-xl border text-xs font-medium outline-none"
                        style={{
                          backgroundColor: 'transparent',
                          borderColor,
                          color: textColor,
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold" style={{ color: iconColor }}>To:</span>
                      <input
                        type="date"
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                        className="px-2.5 py-1 rounded-xl border text-xs font-medium outline-none"
                        style={{
                          backgroundColor: 'transparent',
                          borderColor,
                          color: textColor,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Recurring Schedule */}
              {distinctRecurring.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: iconColor }}>
                    <Repeat size={13} />
                    <span>Recurring Schedule</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {distinctRecurring.map((rec) => {
                      const isSelected = selectedRecurring.includes(rec);
                      return (
                        <button
                          key={`recurring-${rec}`}
                          onClick={() => toggleSelection(rec, selectedRecurring, setSelectedRecurring)}
                          className="py-1 px-3 rounded-full text-xs font-bold transition-all border shrink-0 cursor-pointer"
                          style={{
                            backgroundColor: isSelected ? `${secondaryColor}25` : 'transparent',
                            borderColor: isSelected ? secondaryColor : borderColor,
                            color: isSelected ? secondaryColor : textColor,
                          }}
                        >
                          {rec}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 4. Price Filter */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: iconColor }}>
                  Admission / Price
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {PRICE_TYPE_OPTIONS.map((pt) => {
                    const isSelected = priceType === pt;
                    return (
                      <button
                        key={`pt-opt-${pt}`}
                        onClick={() => setPriceType(pt)}
                        className="py-1 px-3 rounded-full text-xs font-bold transition-all border shrink-0 cursor-pointer"
                        style={{
                          backgroundColor: isSelected ? primaryColor : 'transparent',
                          borderColor: isSelected ? primaryColor : borderColor,
                          color: isSelected ? '#FFFFFF' : textColor,
                        }}
                      >
                        {pt}
                      </button>
                    );
                  })}
                </div>

                {priceType === 'Custom Range' && (
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold" style={{ color: iconColor }}>Min (£):</span>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-20 px-2.5 py-1 rounded-xl border text-xs font-medium outline-none"
                        style={{
                          backgroundColor: 'transparent',
                          borderColor,
                          color: textColor,
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold" style={{ color: iconColor }}>Max (£):</span>
                      <input
                        type="number"
                        min="0"
                        placeholder="50"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-20 px-2.5 py-1 rounded-xl border text-xs font-medium outline-none"
                        style={{
                          backgroundColor: 'transparent',
                          borderColor,
                          color: textColor,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 5. Target Audience */}
              {distinctAudiences.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: iconColor }}>
                    Target Audience
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {distinctAudiences.map((aud) => {
                      const isSelected = selectedAudiences.includes(aud);
                      return (
                        <button
                          key={`aud-opt-${aud}`}
                          onClick={() => toggleSelection(aud, selectedAudiences, setSelectedAudiences)}
                          className="py-1 px-3 rounded-full text-xs font-bold transition-all border shrink-0 cursor-pointer"
                          style={{
                            backgroundColor: isSelected ? `${secondaryColor}25` : 'transparent',
                            borderColor: isSelected ? secondaryColor : borderColor,
                            color: isSelected ? secondaryColor : textColor,
                          }}
                        >
                          {aud}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 6. Activities & Type */}
              {distinctActivities.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: iconColor }}>
                    Activities & Type
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {distinctActivities.map((act) => {
                      const isSelected = selectedActivities.includes(act);
                      return (
                        <button
                          key={`act-opt-${act}`}
                          onClick={() => toggleSelection(act, selectedActivities, setSelectedActivities)}
                          className="py-1 px-3 rounded-full text-xs font-bold transition-all border shrink-0 cursor-pointer"
                          style={{
                            backgroundColor: isSelected ? primaryColor : 'transparent',
                            borderColor: isSelected ? primaryColor : borderColor,
                            color: isSelected ? '#FFFFFF' : textColor,
                          }}
                        >
                          {act}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 7. Experience Badges */}
              {distinctBadges.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: iconColor }}>
                    Features & Badges
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {distinctBadges.map((badge) => {
                      const isSelected = selectedBadges.includes(badge);
                      return (
                        <button
                          key={`badge-opt-${badge}`}
                          onClick={() => toggleSelection(badge, selectedBadges, setSelectedBadges)}
                          className="py-1 px-2.5 rounded-md text-xs font-bold transition-all border shrink-0 cursor-pointer"
                          style={{
                            backgroundColor: isSelected ? `${primaryColor}20` : 'transparent',
                            borderColor: isSelected ? primaryColor : borderColor,
                            color: isSelected ? primaryColor : iconColor,
                          }}
                        >
                          {badge}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div
              className="flex items-center justify-between p-4 border-t gap-3 shrink-0"
              style={{ borderColor }}
            >
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold transition-opacity hover:opacity-80 cursor-pointer"
                style={{ color: secondaryColor }}
              >
                <RotateCcw size={13} />
                <span>Reset All</span>
              </button>

              <button
                onClick={() => setIsFilterOpen(false)}
                className="px-6 py-2 rounded-xl text-xs font-bold text-white transition-all active:scale-95 cursor-pointer shadow-sm"
                style={{ backgroundColor: primaryColor }}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedEventDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-xl rounded-3xl border shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            style={{ backgroundColor: cardBackground, borderColor }}
          >
            <div
              className="flex items-center justify-between p-5 border-b shrink-0"
              style={{ borderColor }}
            >
              <div className="flex items-center gap-2">
                <Info size={18} style={{ color: primaryColor }} />
                <h3 className="text-base font-extrabold truncate pr-2" style={{ color: textColor }}>
                  {selectedEventDetails.title}
                </h3>
              </div>

              <button
                onClick={() => setSelectedEventDetails(null)}
                className="p-1.5 rounded-full hover:opacity-75 transition-opacity cursor-pointer"
                style={{ color: iconColor }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-5 overflow-y-auto">
              {selectedEventDetails.imageUrl && (
                <div className="w-full h-52 rounded-2xl overflow-hidden border shrink-0" style={{ borderColor }}>
                  <img
                    src={selectedEventDetails.imageUrl}
                    alt={selectedEventDetails.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Organised By in Details Modal */}
              {selectedEventDetails.organisedBy && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold" style={{ color: iconColor }}>Organised By:</span>
                  <span
                    className="text-xs font-extrabold px-3 py-1 rounded-full border"
                    style={{
                      backgroundColor: `${primaryColor}14`,
                      borderColor: `${primaryColor}30`,
                      color: primaryColor,
                    }}
                  >
                    {selectedEventDetails.organisedBy}
                  </span>
                </div>
              )}

              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider mb-1" style={{ color: iconColor }}>
                  Overview
                </h4>
                <p className="text-sm font-medium leading-relaxed" style={{ color: textColor }}>
                  {selectedEventDetails.description}
                </p>
              </div>

              <div
                className="p-4 rounded-2xl border flex flex-col gap-2.5"
                style={{ backgroundColor: `${textColor}05`, borderColor }}
              >
                <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: textColor }}>
                  <Calendar size={15} style={{ color: primaryColor }} className="shrink-0" />
                  <span>
                    {formatDateTime(selectedEventDetails.startDatetime, selectedEventDetails.endDatetime).date}
                    {selectedEventDetails.recurring ? ` (${selectedEventDetails.recurring})` : ''}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: textColor }}>
                  <Clock size={15} style={{ color: primaryColor }} className="shrink-0" />
                  <span>{formatDateTime(selectedEventDetails.startDatetime, selectedEventDetails.endDatetime).time}</span>
                </div>

                {[selectedEventDetails.location, selectedEventDetails.postcode].filter(Boolean).length > 0 && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      [selectedEventDetails.location, selectedEventDetails.postcode].filter(Boolean).join(', ')
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs font-semibold hover:underline"
                    style={{ color: textColor }}
                  >
                    <MapPin size={15} style={{ color: primaryColor }} className="shrink-0" />
                    <span>
                      {selectedEventDetails.location}
                      {selectedEventDetails.location && selectedEventDetails.postcode
                        ? ` (${selectedEventDetails.postcode})`
                        : selectedEventDetails.postcode}
                    </span>
                    <ExternalLink size={12} style={{ color: iconColor }} />
                  </a>
                )}

                <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: textColor }}>
                  <Tag size={15} style={{ color: primaryColor }} className="shrink-0" />
                  <span>Admission: {selectedEventDetails.price}</span>
                </div>
              </div>

              {(selectedEventDetails.contactEmail || selectedEventDetails.contactNumber) && (
                <div
                  className="p-4 rounded-2xl border flex flex-col gap-3"
                  style={{ backgroundColor: `${secondaryColor}10`, borderColor: `${secondaryColor}25` }}
                >
                  <h4 className="text-xs font-extrabold uppercase tracking-wider" style={{ color: secondaryColor }}>
                    Event Inquiries & Coordinator Contact
                  </h4>

                  {selectedEventDetails.contactEmail && (
                    <a
                      href={`mailto:${selectedEventDetails.contactEmail}?subject=${encodeURIComponent(
                        `Inquiry: ${selectedEventDetails.title}`
                      )}`}
                      className="flex items-center gap-2 text-xs font-bold hover:underline"
                      style={{ color: textColor }}
                    >
                      <Mail size={15} style={{ color: primaryColor }} />
                      <span>{selectedEventDetails.contactEmail}</span>
                    </a>
                  )}

                  {selectedEventDetails.contactNumber && (
                    <a
                      href={`tel:${selectedEventDetails.contactNumber}`}
                      className="flex items-center gap-2 text-xs font-bold hover:underline"
                      style={{ color: textColor }}
                    >
                      <Phone size={15} style={{ color: primaryColor }} />
                      <span>{selectedEventDetails.contactNumber}</span>
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 border-t flex justify-end" style={{ borderColor }}>
              <button
                onClick={() => setSelectedEventDetails(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90 cursor-pointer"
                style={{ backgroundColor: primaryColor }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid View */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div
            className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: `${primaryColor} transparent transparent transparent` }}
          />
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredEvents.map((item, idx) => {
            const { date, time } = formatDateTime(item.startDatetime, item.endDatetime);
            const isAvailable = item.availability?.toLowerCase() !== 'no space';
            const fullAddress = [item.location, item.postcode].filter(Boolean).join(', ');

            // Compute distance in miles if user origin is available
            const distanceMiles =
              userOrigin && item.lat && item.lon
                ? getDistanceFromLatLonInMiles(
                    userOrigin.lat,
                    userOrigin.lon,
                    item.lat,
                    item.lon
                  )
                : null;

            return (
              <article
                key={item.id ? `event-${item.id}-${idx}` : `event-idx-${idx}`}
                className="rounded-3xl border border-l-4 flex flex-col justify-between shadow-sm overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                style={{
                  backgroundColor: cardBackground,
                  borderTopColor: borderColor,
                  borderRightColor: borderColor,
                  borderBottomColor: borderColor,
                  borderLeftColor: secondaryColor,
                }}
              >
                <div>
                  {item.imageUrl && (
                    <div
                      className="w-full h-44 sm:h-48 overflow-hidden relative border-b"
                      style={{ borderColor }}
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover select-none"
                        onError={(e) => {
                          e.currentTarget.parentElement.style.display = 'none';
                        }}
                      />
                      <span
                        className="absolute top-3 right-3 text-xs font-extrabold px-3 py-1 rounded-full backdrop-blur-md border shadow-sm"
                        style={{
                          backgroundColor: `${cardBackground}EE`,
                          borderColor,
                          color: primaryColor,
                        }}
                      >
                        {item.price}
                      </span>
                    </div>
                  )}

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 flex flex-col gap-3">
                    {/* Top Row: Audiences & Price / Distance */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex flex-wrap gap-1.5 flex-1 min-w-0">
                        {item.audiences.map((aud, aIdx) => (
                          <span
                            key={`aud-badge-${aud}-${aIdx}`}
                            className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border"
                            style={{
                              backgroundColor: `${secondaryColor}15`,
                              borderColor: `${secondaryColor}30`,
                              color: secondaryColor,
                            }}
                          >
                            {aud}
                          </span>
                        ))}

                        {!item.imageUrl && (
                          <span
                            className="text-xs font-extrabold px-2.5 py-0.5 rounded-full border"
                            style={{
                              backgroundColor: `${primaryColor}15`,
                              borderColor: `${primaryColor}30`,
                              color: primaryColor,
                            }}
                          >
                            {item.price}
                          </span>
                        )}

                        {/* Distance Badge */}
                        {distanceMiles !== null && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                            {distanceMiles.toFixed(1)} mi away
                          </span>
                        )}
                      </div>
                    </div>

                    <h2
                      className="text-lg sm:text-xl font-extrabold tracking-tight leading-snug"
                      style={{ color: textColor }}
                    >
                      {item.title}
                    </h2>

                    <p
                      className="text-xs sm:text-sm font-medium leading-relaxed line-clamp-2"
                      style={{ color: iconColor }}
                    >
                      {item.description}
                    </p>

                    {item.badges.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {item.badges.map((badge, bIdx) => (
                          <span
                            key={`badge-${badge}-${bIdx}`}
                            className="text-[10px] font-bold px-2 py-0.5 rounded-md border"
                            style={{
                              borderColor,
                              color: iconColor,
                              backgroundColor: `${textColor}05`,
                            }}
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Metadata Box */}
                    <div
                      className="p-3.5 rounded-2xl border flex flex-col gap-2 mt-2"
                      style={{
                        backgroundColor: `${textColor}05`,
                        borderColor,
                      }}
                    >
                      <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: textColor }}>
                        <Calendar size={14} style={{ color: primaryColor }} className="shrink-0" />
                        <span>
                          {date} {item.recurring ? `(${item.recurring})` : ''}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: textColor }}>
                        <Clock size={14} style={{ color: primaryColor }} className="shrink-0" />
                        <span>{time}</span>
                      </div>

                      {fullAddress && (
                        item.postcode ? (
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between text-xs font-semibold hover:opacity-80 transition-opacity cursor-pointer group"
                            style={{ color: textColor }}
                          >
                            <div className="flex items-center gap-2 min-w-0 pr-1">
                              <MapPin size={14} style={{ color: primaryColor }} className="shrink-0" />
                              <span className="truncate">
                                {item.location} ({item.postcode})
                              </span>
                            </div>
                            <ExternalLink size={12} style={{ color: iconColor }} className="shrink-0 opacity-70 group-hover:opacity-100" />
                          </a>
                        ) : (
                          <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: textColor }}>
                            <MapPin size={14} style={{ color: primaryColor }} className="shrink-0" />
                            <span>{item.location}</span>
                          </div>
                        )
                      )}

                      {item.capacity && (
                        <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: textColor }}>
                          <Users size={14} style={{ color: primaryColor }} className="shrink-0" />
                          <span>Capacity: {item.capacity} spaces</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="px-5 pb-5 sm:px-6 sm:pb-6 flex items-center gap-2.5">
                  <button
                    onClick={() => setSelectedEventDetails(item)}
                    className="flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition-all active:scale-95 cursor-pointer text-center"
                    style={{
                      backgroundColor: `${primaryColor}14`,
                      borderColor: `${primaryColor}30`,
                      color: primaryColor,
                    }}
                  >
                    View Details
                  </button>

                  <div
                    className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold shrink-0 ${
                      isAvailable
                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/25'
                        : 'bg-red-500/10 text-red-600 border-red-500/25'
                    }`}
                  >
                    {isAvailable ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                    <span>{isAvailable ? 'Available' : 'Full'}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-sm font-medium mb-3" style={{ color: iconColor }}>
            No upcoming events matched your search or filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: primaryColor }}
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}