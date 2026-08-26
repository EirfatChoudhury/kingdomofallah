// src/components/MosqueFilterModal.jsx
'use client';

import React, { useState } from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';
import {
  MapPin,
  LocateFixed,
  Navigation,
  ArrowUpDown,
  Loader2,
  X,
  SlidersHorizontal,
  Check,
} from 'lucide-react';

export function MosqueFilterModal({
  isOpen,
  onClose,
  userOrigin,
  setUserOrigin,
  radiusMiles,
  setRadiusMiles,
  customRadius,
  setCustomRadius,
  sortBy,
  setSortBy,
  onResetFilters,
}) {
  const textColor = useThemeColor({}, 'text');
  const primaryColor = useThemeColor({}, 'primary');
  const secondaryColor = useThemeColor({}, 'secondary');
  const cardBackground = useThemeColor({}, 'cardBackground');
  const borderColor = useThemeColor({}, 'border');
  const iconColor = useThemeColor({}, 'icon');

  const [postcodeQuery, setPostcodeQuery] = useState('');
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isLocatingUser, setIsLocatingUser] = useState(false);
  const [geoError, setGeoError] = useState('');

  if (!isOpen) return null;

  // Postcode search handler
  const handleApplyPostcode = async (e) => {
    e?.preventDefault();
    if (!postcodeQuery.trim()) return;

    setIsGeocoding(true);
    setGeoError('');

    try {
      const cleanPostcode = postcodeQuery.trim().replace(/\s+/g, '');
      const res = await fetch(`https://api.postcodes.io/postcodes/${cleanPostcode}`);
      if (!res.ok) throw new Error('Invalid postcode');
      const data = await res.json();

      setUserOrigin({
        lat: data.result.latitude,
        lon: data.result.longitude,
        label: data.result.postcode,
      });

      if (sortBy === 'name-asc') {
        setSortBy('distance-asc');
      }
    } catch {
      setGeoError('Could not find UK postcode. Please verify and try again.');
    } finally {
      setIsGeocoding(false);
    }
  };

  // Browser Geolocation trigger
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocatingUser(true);
    setGeoError('');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        let label = 'Your Location';

        try {
          const res = await fetch(
            `https://api.postcodes.io/postcodes?lon=${longitude}&lat=${latitude}`
          );
          if (res.ok) {
            const data = await res.json();
            if (data.result && data.result.length > 0) {
              const nearest = data.result[0];
              label = nearest.admin_district
                ? `${nearest.admin_district} (${nearest.postcode})`
                : nearest.postcode;
            }
          }
        } catch {
          label = `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`;
        }

        setUserOrigin({
          lat: latitude,
          lon: longitude,
          label,
        });

        setPostcodeQuery('');
        setIsLocatingUser(false);

        if (sortBy === 'name-asc') {
          setSortBy('distance-asc');
        }
      },
      (err) => {
        setIsLocatingUser(false);
        setGeoError(
          err.code === 1
            ? 'Location access was denied. Please allow permissions in your browser.'
            : 'Could not retrieve your location.'
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const presetDistances = ['all', '3', '5', '10', '20', 'custom'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg rounded-3xl border shadow-2xl p-6 sm:p-8 flex flex-col gap-6 max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: cardBackground,
          borderColor,
        }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor }}>
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center border"
              style={{
                backgroundColor: `${primaryColor}15`,
                borderColor: `${primaryColor}30`,
                color: primaryColor,
              }}
            >
              <SlidersHorizontal size={18} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold" style={{ color: textColor }}>
                Filter & Sort Mosques
              </h3>
              <p className="text-xs font-medium" style={{ color: iconColor }}>
                Refine by location, radius, and proximity
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl border hover:opacity-70 transition-opacity cursor-pointer"
            style={{ borderColor, color: iconColor }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Section 1: Set Origin Location */}
        <div className="flex flex-col gap-3">
          <label className="text-xs font-extrabold uppercase tracking-wider" style={{ color: textColor }}>
            1. Your Location
          </label>

          <form onSubmit={handleApplyPostcode} className="flex gap-2">
            <div
              className="flex-1 flex items-center px-4 py-2.5 rounded-2xl border"
              style={{ borderColor }}
            >
              <MapPin size={16} style={{ color: iconColor }} className="shrink-0 mr-2.5" />
              <input
                type="text"
                placeholder="Enter UK Postcode..."
                value={postcodeQuery}
                onChange={(e) => setPostcodeQuery(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-semibold outline-none uppercase placeholder:capitalize placeholder:text-neutral-400"
                style={{ color: textColor }}
              />
            </div>

            <button
              type="submit"
              disabled={isGeocoding || !postcodeQuery.trim()}
              className="px-4 py-2.5 rounded-2xl text-xs font-bold text-white transition-all active:scale-95 disabled:opacity-50 cursor-pointer shrink-0"
              style={{ backgroundColor: primaryColor }}
            >
              {isGeocoding ? <Loader2 size={15} className="animate-spin" /> : 'Set'}
            </button>
          </form>

          {/* Browser Location Button */}
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={isLocatingUser}
            className="w-full py-2.5 px-4 rounded-2xl border text-xs font-bold transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            style={{
              backgroundColor: `${secondaryColor}15`,
              borderColor: `${secondaryColor}30`,
              color: secondaryColor,
            }}
          >
            {isLocatingUser ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <LocateFixed size={15} />
            )}
            <span>Use Current Location</span>
          </button>

          {geoError && <span className="text-xs font-semibold text-rose-500">{geoError}</span>}

          {userOrigin && !geoError && (
            <div
              className="p-3 rounded-2xl border flex items-center justify-between text-xs font-semibold"
              style={{ backgroundColor: `${secondaryColor}08`, borderColor: `${secondaryColor}25` }}
            >
              <div className="flex items-center gap-2">
                <Navigation size={13} style={{ color: secondaryColor }} />
                <span>
                  Origin set: <strong style={{ color: textColor }}>{userOrigin.label}</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setUserOrigin(null);
                  setPostcodeQuery('');
                }}
                className="text-rose-500 hover:underline cursor-pointer"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Section 2: Distance / Radius Filter */}
        <div className="flex flex-col gap-3">
          <label className="text-xs font-extrabold uppercase tracking-wider" style={{ color: textColor }}>
            2. Search Distance
          </label>

          <div className="grid grid-cols-3 gap-2">
            {presetDistances.map((preset) => {
              const isSelected = radiusMiles === preset;
              const label =
                preset === 'all'
                  ? 'Any Distance'
                  : preset === 'custom'
                  ? 'Custom'
                  : `${preset} Miles`;

              return (
                <button
                  key={preset}
                  type="button"
                  disabled={!userOrigin && preset !== 'all'}
                  onClick={() => setRadiusMiles(preset)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all disabled:opacity-40 cursor-pointer flex items-center justify-center gap-1.5`}
                  style={{
                    backgroundColor: isSelected ? `${primaryColor}18` : 'transparent',
                    borderColor: isSelected ? primaryColor : borderColor,
                    color: isSelected ? primaryColor : textColor,
                  }}
                >
                  {isSelected && <Check size={13} />}
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          {/* Custom Distance Input Field */}
          {radiusMiles === 'custom' && (
            <div
              className="flex items-center gap-2 p-3 rounded-2xl border animate-in fade-in"
              style={{ borderColor }}
            >
              <span className="text-xs font-semibold" style={{ color: iconColor }}>
                Max Distance:
              </span>
              <input
                type="number"
                min="1"
                max="500"
                placeholder="e.g. 15"
                value={customRadius}
                onChange={(e) => setCustomRadius(e.target.value)}
                className="w-24 px-3 py-1.5 rounded-xl border bg-transparent text-xs font-bold outline-none"
                style={{ borderColor, color: textColor }}
              />
              <span className="text-xs font-bold" style={{ color: textColor }}>
                miles
              </span>
            </div>
          )}
        </div>

        {/* Section 3: Sorting Options */}
        <div className="flex flex-col gap-3">
          <label className="text-xs font-extrabold uppercase tracking-wider" style={{ color: textColor }}>
            3. Sort Order
          </label>

          <div
            className="flex items-center px-4 py-2.5 rounded-2xl border"
            style={{ borderColor }}
          >
            <ArrowUpDown size={16} style={{ color: iconColor }} className="mr-2.5 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm font-semibold outline-none cursor-pointer"
              style={{ color: textColor }}
            >
              <option value="name-asc" style={{ backgroundColor: cardBackground }}>
                Alphabetical (A-Z)
              </option>
              <option
                value="distance-asc"
                disabled={!userOrigin}
                style={{ backgroundColor: cardBackground }}
              >
                Closest to Farthest
              </option>
              <option
                value="distance-desc"
                disabled={!userOrigin}
                style={{ backgroundColor: cardBackground }}
              >
                Farthest to Closest
              </option>
            </select>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t gap-3 mt-2" style={{ borderColor }}>
          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs font-bold text-rose-500 hover:underline cursor-pointer"
          >
            Reset Filters
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold text-white transition-all transform active:scale-95 shadow-md cursor-pointer"
            style={{ backgroundColor: primaryColor }}
          >
            Apply & View Mosques
          </button>
        </div>
      </div>
    </div>
  );
}