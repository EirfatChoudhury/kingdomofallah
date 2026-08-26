// src/components/AllMemberMosquesView.jsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { MosqueFilterModal } from '@/components/MosqueFilterModal';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useMasjid } from '@/context/MasjidContext';
import { MASJIDS_DATA } from '@/constants/masjidsData';
import {
  Building2,
  MapPin,
  Globe,
  Phone,
  Mail,
  ExternalLink,
  Search,
  X,
  Navigation,
  SlidersHorizontal,
  Check,
} from 'lucide-react';

function getDistanceFromLatLonInMiles(lat1, lon1, lat2, lon2) {
  const R = 3958.8;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function extractPostcode(address = '') {
  const match = address.match(/([A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2})/i);
  return match ? match[0].trim() : null;
}

export function AllMemberMosquesView() {
  const textColor = useThemeColor({}, 'text');
  const primaryColor = useThemeColor({}, 'primary');
  const secondaryColor = useThemeColor({}, 'secondary');
  const cardBackground = useThemeColor({}, 'cardBackground');
  const borderColor = useThemeColor({}, 'border');
  const iconColor = useThemeColor({}, 'icon');

  const { selectedMasjidId, changeMasjid } = useMasjid();

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [userOrigin, setUserOrigin] = useState(null);
  const [radiusMiles, setRadiusMiles] = useState('all');
  const [customRadius, setCustomRadius] = useState('15');
  const [sortBy, setSortBy] = useState('name-asc');
  const [masjidsWithCoordinates, setMasjidsWithCoordinates] = useState([]);

  const baseMasjidsList = useMemo(() => {
    if (!MASJIDS_DATA) return [];
    const list = Array.isArray(MASJIDS_DATA) ? MASJIDS_DATA : Object.values(MASJIDS_DATA);
    return list.filter((masjid) => masjid.isMosque === true);
  }, []);

  useEffect(() => {
    async function geocodeMasjids() {
      const updated = await Promise.all(
        baseMasjidsList.map(async (masjid) => {
          const pc = extractPostcode(masjid.contact?.address);
          if (!pc) return { ...masjid, lat: null, lon: null };

          try {
            const cleanPc = pc.replace(/\s+/g, '');
            const res = await fetch(`https://api.postcodes.io/postcodes/${cleanPc}`);
            if (res.ok) {
              const data = await res.json();
              return {
                ...masjid,
                lat: data.result.latitude,
                lon: data.result.longitude,
              };
            }
          } catch (e) {
            console.error(`Failed to geocode postcode ${pc}:`, e);
          }
          return { ...masjid, lat: null, lon: null };
        })
      );
      setMasjidsWithCoordinates(updated);
    }

    geocodeMasjids();
  }, [baseMasjidsList]);

  const handleResetFilters = () => {
    setUserOrigin(null);
    setRadiusMiles('all');
    setCustomRadius('15');
    setSortBy('name-asc');
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (userOrigin) count++;
    if (radiusMiles !== 'all') count++;
    if (sortBy !== 'name-asc') count++;
    return count;
  }, [userOrigin, radiusMiles, sortBy]);

  const processedMasjids = useMemo(() => {
    const listToProcess =
      masjidsWithCoordinates.length > 0 ? masjidsWithCoordinates : baseMasjidsList;

    let list = listToProcess.map((masjid) => {
      let distance = null;
      if (userOrigin && masjid.lat && masjid.lon) {
        distance = getDistanceFromLatLonInMiles(
          userOrigin.lat,
          userOrigin.lon,
          masjid.lat,
          masjid.lon
        );
      }
      return { ...masjid, distance };
    });

    const query = searchQuery.toLowerCase().trim();
    if (query) {
      list = list.filter((m) => (m.name || '').toLowerCase().includes(query));
    }

    if (userOrigin && radiusMiles !== 'all') {
      const maxDistance =
        radiusMiles === 'custom' ? parseFloat(customRadius) || Infinity : parseFloat(radiusMiles);
      list = list.filter((m) => m.distance !== null && m.distance <= maxDistance);
    }

    list.sort((a, b) => {
      if (sortBy === 'distance-asc') {
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      }
      if (sortBy === 'distance-desc') {
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return b.distance - a.distance;
      }
      return (a.name || '').localeCompare(b.name || '');
    });

    return list;
  }, [
    masjidsWithCoordinates,
    baseMasjidsList,
    userOrigin,
    searchQuery,
    radiusMiles,
    customRadius,
    sortBy,
  ]);

  return (
    <>
      {/* Header Section */}
      <div className="flex flex-col gap-2 mb-8">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider w-fit"
          style={{
            backgroundColor: `${secondaryColor}15`,
            borderColor: `${secondaryColor}30`,
            color: secondaryColor,
          }}
        >
          <Building2 size={13} />
          <span>Affiliated Network</span>
        </div>

        <h1
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight"
          style={{ color: primaryColor }}
        >
          Member Mosques & Centres
        </h1>
        <p className="text-xs sm:text-sm font-medium" style={{ color: iconColor }}>
          Showing {processedMasjids.length} affiliated{' '}
          {processedMasjids.length === 1 ? 'mosque' : 'mosques'} across the network
        </p>
      </div>

      {/* Clean Search Bar & Filter Modal Trigger */}
      <div className="flex items-center gap-3 mb-8 w-full max-w-2xl">
        <div
          className="flex-1 flex items-center px-4 py-3 rounded-2xl border shadow-sm transition-all"
          style={{ backgroundColor: cardBackground, borderColor }}
        >
          <Search size={18} style={{ color: iconColor }} className="shrink-0 mr-3" />
          <input
            type="text"
            placeholder="Search by mosque name..."
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
              <X size={15} />
            </button>
          )}
        </div>

        <button
          onClick={() => setIsFilterModalOpen(true)}
          className="relative flex items-center gap-2.5 px-5 py-3 rounded-2xl border text-xs sm:text-sm font-bold shadow-sm transition-all transform active:scale-95 cursor-pointer shrink-0"
          style={{
            backgroundColor: activeFilterCount > 0 ? `${primaryColor}15` : cardBackground,
            borderColor: activeFilterCount > 0 ? primaryColor : borderColor,
            color: activeFilterCount > 0 ? primaryColor : textColor,
          }}
        >
          <SlidersHorizontal size={16} />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white"
              style={{ backgroundColor: primaryColor }}
            >
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Active Origin Notification Pill */}
      {userOrigin && (
        <div
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold mb-8 w-fit"
          style={{
            backgroundColor: `${secondaryColor}10`,
            borderColor: `${secondaryColor}30`,
            color: textColor,
          }}
        >
          <Navigation size={13} style={{ color: secondaryColor }} />
          <span>
            Proximity from <strong>{userOrigin.label}</strong>
            {radiusMiles !== 'all' &&
              ` (within ${radiusMiles === 'custom' ? customRadius : radiusMiles} mi)`}
          </span>
          <button
            onClick={handleResetFilters}
            className="ml-1 text-rose-500 hover:underline cursor-pointer"
          >
            Reset
          </button>
        </div>
      )}

      {/* Mosques Grid */}
      {processedMasjids.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {processedMasjids.map((masjid) => {
            const name = masjid.name || 'Mosque';
            const logo = masjid.logoUrl || '/logos/KOA Logos/logo.png';
            const address = masjid.contact?.address || '';
            const isSelected = selectedMasjidId === masjid.id;

            return (
              <div
                key={masjid.id}
                className="rounded-3xl border border-l-4 p-6 sm:p-7 flex flex-col justify-between shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md relative"
                style={{
                  backgroundColor: cardBackground,
                  borderTopColor: borderColor,
                  borderRightColor: borderColor,
                  borderBottomColor: borderColor,
                  borderLeftColor: secondaryColor,
                }}
              >
                {masjid.distance !== null && (
                  <div
                    className="absolute top-5 right-5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-extrabold shadow-sm"
                    style={{
                      backgroundColor: `${secondaryColor}15`,
                      borderColor: `${secondaryColor}35`,
                      color: secondaryColor,
                    }}
                  >
                    <Navigation size={11} />
                    <span>{masjid.distance.toFixed(1)} mi away</span>
                  </div>
                )}

                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4 pr-20">
                    <div
                      className="w-16 h-16 rounded-2xl border p-2 flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: `${textColor}05`,
                        borderColor,
                      }}
                    >
                      <Image
                        src={logo}
                        alt={name}
                        width={56}
                        height={56}
                        className="w-full h-full object-contain filter drop-shadow-sm"
                      />
                    </div>

                    <div className="flex flex-col min-w-0">
                      <h2
                        className="text-base sm:text-lg font-extrabold tracking-tight leading-snug truncate"
                        style={{ color: textColor }}
                      >
                        {name}
                      </h2>
                      {masjid.contact?.charityNumber && (
                        <span className="text-xs font-bold" style={{ color: secondaryColor }}>
                          Charity No: {masjid.contact.charityNumber}
                        </span>
                      )}
                    </div>
                  </div>

                  <div
                    className="p-3.5 rounded-2xl border flex flex-col gap-2 mt-2"
                    style={{
                      backgroundColor: `${textColor}05`,
                      borderColor,
                    }}
                  >
                    {address && (
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          address
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between text-xs font-semibold hover:opacity-80 transition-opacity cursor-pointer group"
                        style={{ color: textColor }}
                      >
                        <div className="flex items-center gap-2 min-w-0 pr-1">
                          <MapPin size={14} style={{ color: primaryColor }} className="shrink-0" />
                          <span className="truncate">{address}</span>
                        </div>
                        <ExternalLink
                          size={12}
                          style={{ color: iconColor }}
                          className="shrink-0 opacity-70 group-hover:opacity-100"
                        />
                      </a>
                    )}

                    {masjid.donation?.onlineDonationUrl && (
                      <a
                        href={masjid.donation.onlineDonationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between text-xs font-semibold hover:opacity-80 transition-opacity"
                        style={{ color: textColor }}
                      >
                        <div className="flex items-center gap-2 min-w-0 pr-1">
                          <Globe size={14} style={{ color: primaryColor }} className="shrink-0" />
                          <span className="truncate">Online Donations</span>
                        </div>
                        <ExternalLink size={12} style={{ color: iconColor }} className="shrink-0 opacity-70" />
                      </a>
                    )}

                    {masjid.contact?.phone && (
                      <a
                        href={`tel:${masjid.contact.phone}`}
                        className="flex items-center gap-2 text-xs font-semibold hover:underline"
                        style={{ color: textColor }}
                      >
                        <Phone size={14} style={{ color: primaryColor }} className="shrink-0" />
                        <span>{masjid.contact.phone}</span>
                      </a>
                    )}

                    {masjid.contact?.email && (
                      <a
                        href={`mailto:${masjid.contact.email}`}
                        className="flex items-center gap-2 text-xs font-semibold hover:underline truncate"
                        style={{ color: textColor }}
                      >
                        <Mail size={14} style={{ color: primaryColor }} className="shrink-0" />
                        <span className="truncate">{masjid.contact.email}</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="pt-5 mt-auto">
                  <button
                    onClick={() => changeMasjid(masjid.id)}
                    className="w-full py-2.5 px-4 rounded-xl border text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: isSelected ? primaryColor : 'transparent',
                      borderColor: isSelected ? primaryColor : borderColor,
                      color: isSelected ? '#FFFFFF' : textColor,
                    }}
                  >
                    {isSelected ? (
                      <>
                        <Check size={14} />
                        <span>Selected Mosque</span>
                      </>
                    ) : (
                      <span>Select as Active Mosque</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center flex flex-col items-center justify-center">
          <p className="text-sm font-medium mb-4" style={{ color: iconColor }}>
            No member mosques matched your search or radius criteria.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              handleResetFilters();
            }}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: primaryColor }}
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Filter Modal */}
      <MosqueFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        userOrigin={userOrigin}
        setUserOrigin={setUserOrigin}
        radiusMiles={radiusMiles}
        setRadiusMiles={setRadiusMiles}
        customRadius={customRadius}
        setCustomRadius={setCustomRadius}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onResetFilters={handleResetFilters}
      />
    </>
  );
}