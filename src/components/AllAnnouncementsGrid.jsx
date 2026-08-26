// src/components/AllAnnouncementsGrid.jsx
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';
import { loadAnnouncementsFromCSV } from '@/services/announcementsService';
import {
  Megaphone,
  Calendar,
  Search,
  X,
  Bell,
  Info,
  ArrowRight,
  Filter,
} from 'lucide-react';

export function AllAnnouncementsGrid() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBadge, setSelectedBadge] = useState('All');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  const textColor = useThemeColor({}, 'text');
  const cardBackground = useThemeColor({}, 'cardBackground');
  const primaryColor = useThemeColor({}, 'primary');
  const secondaryColor = useThemeColor({}, 'secondary');
  const borderColor = useThemeColor({}, 'border');
  const iconColor = useThemeColor({}, 'icon');

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await loadAnnouncementsFromCSV();
        setAnnouncements(data);
      } catch (err) {
        console.error('Failed to load announcements:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Extract distinct badge tags for filter pills
  const distinctBadges = useMemo(() => {
    const set = new Set();
    announcements.forEach((item) => {
      item.badges.forEach((b) => set.add(b));
    });
    return ['All', ...Array.from(set).sort()];
  }, [announcements]);

  // Filter announcements by keyword and badge
  const filteredAnnouncements = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return announcements.filter((item) => {
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.longDescription.toLowerCase().includes(q);

      const matchesBadge =
        selectedBadge === 'All' || item.badges.includes(selectedBadge);

      return matchesSearch && matchesBadge;
    });
  }, [announcements, searchQuery, selectedBadge]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="w-full flex flex-col">
      {/* Page Title & Subtitle */}
      <div className="flex flex-col gap-2 mb-8">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider w-fit"
          style={{
            backgroundColor: `${secondaryColor}15`,
            borderColor: `${secondaryColor}30`,
            color: secondaryColor,
          }}
        >
          <Megaphone size={13} />
          <span>Official Announcements</span>
        </div>

        <h1
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight"
          style={{ color: primaryColor }}
        >
          Kingdom of Allah Announcements
        </h1>
        <p className="text-sm sm:text-base font-medium" style={{ color: iconColor }}>
          Stay informed with the latest updates, mosque news, and community notices.
        </p>
      </div>

      {/* Search & Badges Filter Toolbar */}
      <div className="flex flex-col gap-4 mb-10">
        <div
          className="w-full max-w-md flex items-center px-4 py-2.5 rounded-2xl border transition-all shadow-sm"
          style={{ backgroundColor: cardBackground, borderColor }}
        >
          <Search size={16} style={{ color: iconColor }} className="shrink-0 mr-2.5" />
          <input
            type="text"
            placeholder="Search announcements by keywords..."
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

        {/* Badge Filter Pills */}
        {distinctBadges.length > 1 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold mr-1 flex items-center gap-1" style={{ color: iconColor }}>
              <Filter size={12} />
              <span>Filter:</span>
            </span>
            {distinctBadges.map((badge) => {
              const isSelected = selectedBadge === badge;
              return (
                <button
                  key={`badge-pill-${badge}`}
                  onClick={() => setSelectedBadge(badge)}
                  className="py-1 px-3 rounded-full text-xs font-bold transition-all border shrink-0 cursor-pointer"
                  style={{
                    backgroundColor: isSelected ? primaryColor : 'transparent',
                    borderColor: isSelected ? primaryColor : borderColor,
                    color: isSelected ? '#FFFFFF' : textColor,
                  }}
                >
                  {badge}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div
            className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: `${primaryColor} transparent transparent transparent` }}
          />
        </div>
      ) : filteredAnnouncements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredAnnouncements.map((item, idx) => (
            <article
              key={item.id ? `announcement-${item.id}-${idx}` : `announcement-idx-${idx}`}
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
                  <div className="w-full h-44 overflow-hidden border-b relative" style={{ borderColor }}>
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.parentElement.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                <div className="p-6 flex flex-col gap-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex flex-wrap gap-1.5">
                      {item.isImportant && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 border border-red-500/20">
                          <Bell size={10} />
                          <span>Important</span>
                        </span>
                      )}

                      {item.badges.map((badge, bIdx) => (
                        <span
                          key={`item-badge-${badge}-${bIdx}`}
                          className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase tracking-wider"
                          style={{
                            backgroundColor: `${primaryColor}10`,
                            borderColor: `${primaryColor}25`,
                            color: primaryColor,
                          }}
                        >
                          {badge}
                        </span>
                      ))}
                    </div>

                    {item.date && (
                      <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: iconColor }}>
                        <Calendar size={12} />
                        <span>{formatDate(item.date)}</span>
                      </div>
                    )}
                  </div>

                  <h2
                    className="text-lg font-extrabold tracking-tight leading-snug pt-1"
                    style={{ color: textColor }}
                  >
                    {item.title}
                  </h2>

                  <p
                    className="text-xs sm:text-sm font-medium leading-relaxed line-clamp-3"
                    style={{ color: iconColor }}
                  >
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2">
                <button
                  onClick={() => setSelectedAnnouncement(item)}
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold transition-opacity hover:opacity-80 group cursor-pointer"
                  style={{ color: primaryColor }}
                >
                  <span>Read full announcement</span>
                  <ArrowRight
                    size={14}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center">
          <p className="text-sm font-medium mb-3" style={{ color: iconColor }}>
            No announcements match your search or filter.
          </p>
          {(searchQuery || selectedBadge !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedBadge('All');
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: primaryColor }}
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Details Pop-up Modal */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-xl rounded-3xl border shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
            style={{ backgroundColor: cardBackground, borderColor }}
          >
            <div className="flex items-center justify-between p-5 border-b shrink-0" style={{ borderColor }}>
              <div className="flex items-center gap-2">
                <Info size={18} style={{ color: primaryColor }} />
                <h3 className="text-base font-extrabold truncate pr-2" style={{ color: textColor }}>
                  {selectedAnnouncement.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="p-1.5 rounded-full hover:opacity-75 transition-opacity cursor-pointer"
                style={{ color: iconColor }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4 overflow-y-auto">
              {selectedAnnouncement.imageUrl && (
                <div className="w-full h-56 rounded-2xl overflow-hidden border shrink-0" style={{ borderColor }}>
                  <img
                    src={selectedAnnouncement.imageUrl}
                    alt={selectedAnnouncement.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.parentElement.style.display = 'none';
                    }}
                  />
                </div>
              )}

              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {selectedAnnouncement.isImportant && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 border border-red-500/20">
                      Important
                    </span>
                  )}
                  {selectedAnnouncement.badges.map((b, bIdx) => (
                    <span
                      key={`modal-badge-${b}-${bIdx}`}
                      className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border"
                      style={{
                        backgroundColor: `${primaryColor}10`,
                        borderColor: `${primaryColor}25`,
                        color: primaryColor,
                      }}
                    >
                      {b}
                    </span>
                  ))}
                </div>

                {selectedAnnouncement.date && (
                  <span className="text-xs font-semibold" style={{ color: iconColor }}>
                    {formatDate(selectedAnnouncement.date)}
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider mb-1" style={{ color: iconColor }}>
                  Summary
                </h4>
                <p className="text-sm font-semibold leading-relaxed" style={{ color: textColor }}>
                  {selectedAnnouncement.description}
                </p>
              </div>

              {selectedAnnouncement.longDescription && (
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider mb-1.5" style={{ color: iconColor }}>
                    Full Details
                  </h4>
                  <div
                    className="text-xs sm:text-sm font-medium leading-relaxed whitespace-pre-line p-4 rounded-2xl border"
                    style={{ backgroundColor: `${textColor}05`, borderColor, color: textColor }}
                  >
                    {selectedAnnouncement.longDescription}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t flex justify-end shrink-0" style={{ borderColor }}>
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90 cursor-pointer"
                style={{ backgroundColor: primaryColor }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}