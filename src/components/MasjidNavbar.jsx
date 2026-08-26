// src/components/MasjidNavbar.jsx
'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Calendar, 
  BookOpen, 
  HeartHandshake, 
  Building2, 
  Info, 
  Phone, 
  Users2,
  Sun, 
  Moon,
  Menu,
  X,
  ChevronDown,
  ArrowLeft,
  Search
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useMasjid } from '@/context/MasjidContext';

const NAV_ITEMS = [
  { label: 'Today', href: '/mosque', icon: Home },
  { label: 'Timetable', href: '/mosque/timetable', icon: Calendar },
  { label: 'Classes', href: '/mosque/classes', icon: BookOpen },
  { label: 'Services', href: '/mosque/services', icon: HeartHandshake },
  { label: 'Facilities', href: '/mosque/facilities', icon: Building2 },
  { label: 'About', href: '/mosque/about', icon: Info },
  { label: 'Contact', href: '/mosque/contact', icon: Phone },
];

export function MasjidNavbar() {
  const pathname = usePathname();
  const { isDarkMode, toggleTheme } = useTheme();
  const { currentMasjid, selectedMasjidId, changeMasjid, allMasjids } = useMasjid();
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef(null);

  const textColor = useThemeColor({}, 'text');
  const primaryColor = useThemeColor({}, 'primary');
  const secondaryColor = useThemeColor({}, 'secondary');
  const cardBackground = useThemeColor({}, 'cardBackground');
  const borderColor = useThemeColor({}, 'border');
  const iconColor = useThemeColor({}, 'icon');

  const isAllMosquesActive = pathname === '/mosque/all-member-mosques';

  // Filter dropdown options to only include mosques
  const mosquesOnly = useMemo(() => {
    return (allMasjids || []).filter((masjid) => masjid.isMosque === true);
  }, [allMasjids]);

  // Search filtered masjids
  const filteredMasjids = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return mosquesOnly;
    return mosquesOnly.filter((m) =>
      (m.name || '').toLowerCase().includes(q)
    );
  }, [mosquesOnly, searchQuery]);

  useEffect(() => {
    setIsOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  // Handle outside click to close the search popover
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectMasjid = (id) => {
    changeMasjid(id);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <>
      <header
        className="sticky top-0 z-50 w-full border-b backdrop-blur-md transition-colors"
        style={{
          backgroundColor: `${cardBackground}E6`,
          borderColor: borderColor,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Back link + Dropdown Selector, Search Popover & All Mosques Button */}
          <div className="flex items-center gap-2 sm:gap-3" ref={searchRef}>
            <Link
              href="/"
              title="Return to Kingdom of Allah"
              className="p-2 rounded-xl border flex items-center justify-center hover:opacity-80 transition-all"
              style={{ borderColor, color: iconColor }}
            >
              <ArrowLeft size={16} />
            </Link>

            {/* Dropdown Selector */}
            <div className="relative flex items-center">
              <select
                value={selectedMasjidId}
                onChange={(e) => changeMasjid(e.target.value)}
                className="appearance-none font-extrabold text-sm sm:text-base pr-7 pl-3 py-1.5 rounded-xl border cursor-pointer focus:outline-none transition-all"
                style={{
                  backgroundColor: cardBackground,
                  borderColor: borderColor,
                  color: primaryColor,
                }}
              >
                {mosquesOnly.map((masjid) => (
                  <option key={masjid.id} value={masjid.id}>
                    {masjid.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-2 pointer-events-none"
                style={{ color: primaryColor }}
              />
            </div>

            {/* Search Toggle Button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-xl border flex items-center justify-center hover:opacity-80 transition-all cursor-pointer"
              style={{
                backgroundColor: isSearchOpen ? `${primaryColor}15` : cardBackground,
                borderColor: isSearchOpen ? primaryColor : borderColor,
                color: isSearchOpen ? primaryColor : iconColor,
              }}
              title="Search Masjids"
            >
              <Search size={16} />
            </button>

            {/* All Mosques Button */}
            <Link
              href="/mosque/all-member-mosques"
              title="View All Member Mosques"
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl border flex items-center gap-1.5 hover:opacity-80 transition-all"
              style={{
                backgroundColor: isAllMosquesActive ? `${primaryColor}15` : cardBackground,
                borderColor: isAllMosquesActive ? primaryColor : borderColor,
                color: isAllMosquesActive ? primaryColor : iconColor,
              }}
            >
              <Users2 size={16} />
              <span className="hidden md:inline text-xs font-bold">All Mosques</span>
            </Link>

            {/* Search Dropdown / Popover */}
            {isSearchOpen && (
              <div
                className="absolute top-16 left-4 sm:left-14 w-72 sm:w-80 rounded-2xl border shadow-xl p-3 z-50 flex flex-col gap-2"
                style={{
                  backgroundColor: cardBackground,
                  borderColor: borderColor,
                }}
              >
                <div
                  className="flex items-center px-3 py-2 rounded-xl border"
                  style={{ borderColor, backgroundColor: `${textColor}05` }}
                >
                  <Search size={14} style={{ color: iconColor }} className="shrink-0 mr-2" />
                  <input
                    type="text"
                    placeholder="Search masjids..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="w-full bg-transparent text-xs font-semibold outline-none"
                    style={{ color: textColor }}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="p-0.5 hover:opacity-70 cursor-pointer"
                      style={{ color: iconColor }}
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>

                <div className="max-h-52 overflow-y-auto flex flex-col gap-1">
                  {filteredMasjids.length > 0 ? (
                    filteredMasjids.map((masjid) => {
                      const isSelected = selectedMasjidId === masjid.id;
                      return (
                        <button
                          key={masjid.id}
                          onClick={() => handleSelectMasjid(masjid.id)}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-between"
                          style={{
                            backgroundColor: isSelected ? `${primaryColor}15` : 'transparent',
                            color: isSelected ? primaryColor : textColor,
                          }}
                        >
                          <span className="truncate">{masjid.name}</span>
                          {isSelected && (
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: secondaryColor }}
                            />
                          )}
                        </button>
                      );
                    })
                  ) : (
                    <span className="text-xs text-center py-4 font-medium" style={{ color: iconColor }}>
                      No masjids found
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-5">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-bold transition-all hover:opacity-80 py-1 border-b-2 ${
                    isActive ? 'border-current' : 'border-transparent'
                  }`}
                  style={{
                    color: isActive ? primaryColor : iconColor,
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border transition-transform active:scale-95 flex items-center justify-center cursor-pointer"
              style={{
                backgroundColor: cardBackground,
                borderColor: borderColor,
                color: textColor,
              }}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="xl:hidden p-2 rounded-xl border transition-transform active:scale-95 flex items-center justify-center cursor-pointer"
              style={{
                backgroundColor: cardBackground,
                borderColor: borderColor,
                color: textColor,
              }}
              aria-label="Open menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm xl:hidden"
        />
      )}

      <div
        className={`fixed top-16 left-0 right-0 z-40 border-b xl:hidden transition-all duration-300 ease-in-out transform shadow-xl ${
          isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
        style={{
          backgroundColor: cardBackground,
          borderColor: borderColor,
        }}
      >
        <div className="px-4 pt-3 pb-6 flex flex-col gap-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3.5 px-4 py-3 rounded-2xl border transition-all active:scale-[0.98]"
                style={{
                  backgroundColor: isActive ? `${primaryColor}15` : 'transparent',
                  borderColor: isActive ? `${primaryColor}30` : 'transparent',
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center border shrink-0"
                  style={{
                    backgroundColor: isActive ? `${primaryColor}25` : `${textColor}08`,
                    borderColor: isActive ? `${primaryColor}40` : borderColor,
                  }}
                >
                  <Icon
                    size={18}
                    style={{
                      color: isActive ? primaryColor : iconColor,
                    }}
                  />
                </div>
                
                <span
                  className="text-sm font-extrabold flex-1"
                  style={{
                    color: isActive ? primaryColor : textColor,
                  }}
                >
                  {item.label}
                </span>

                {isActive && (
                  <div 
                    className="w-1.5 h-1.5 rounded-full" 
                    style={{ backgroundColor: secondaryColor }} 
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}