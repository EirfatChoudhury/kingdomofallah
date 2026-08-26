'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Home,
  Info,
  Calendar,
  Phone,
  Building,
  Sun,
  Moon,
  Menu,
  X,
  Megaphone,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useThemeColor } from '@/hooks/useThemeColor';

const MAIN_NAV_ITEMS = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'About', href: '/about', icon: Info },
  { label: 'Announcements', href: '/announcements', icon: Megaphone },
  { label: 'Events', href: '/events', icon: Calendar },
  { label: 'Contact', href: '/contact', icon: Phone },
  { label: 'Organisations', href: '/non-mosques', icon: Building },
  { label: 'Mosques', href: '/mosque', icon: Building, isHighlight: true },
];

export function MainNavbar() {
  const pathname = usePathname();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const textColor = useThemeColor({}, 'text');
  const primaryColor = useThemeColor({}, 'primary');
  const secondaryColor = useThemeColor({}, 'secondary');
  const cardBackground = useThemeColor({}, 'cardBackground');
  const borderColor = useThemeColor({}, 'border');
  const iconColor = useThemeColor({}, 'icon');

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className="sticky top-0 z-50 w-full border-b backdrop-blur-md transition-colors"
        style={{
          backgroundColor: `${cardBackground}E6`,
          borderColor: borderColor,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 z-50">
            <Image
              src="/logos/KOA Logos/logo.png"
              alt="Kingdom of Allah"
              width={32}
              height={32}
              className="rounded-full object-contain"
              priority
            />
            <span className="text-lg font-extrabold tracking-tight" style={{ color: primaryColor }}>
              Kingdom of Allah
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {MAIN_NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-bold transition-all py-1 border-b-2 ${
                    item.isHighlight
                      ? 'px-3 py-1.5 rounded-lg border-none text-white'
                      : isActive
                      ? 'border-current'
                      : 'border-transparent'
                  }`}
                  style={{
                    backgroundColor: item.isHighlight ? primaryColor : 'transparent',
                    color: item.isHighlight ? '#ffffff' : isActive ? primaryColor : iconColor,
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

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

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-xl border transition-transform active:scale-95 flex items-center justify-center cursor-pointer"
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
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <div
        className={`fixed top-16 left-0 right-0 z-40 border-b lg:hidden transition-all duration-300 ease-in-out transform shadow-xl ${
          isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
        style={{ backgroundColor: cardBackground, borderColor: borderColor }}
      >
        <div className="px-4 pt-3 pb-6 flex flex-col gap-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
          {MAIN_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3.5 px-4 py-3 rounded-2xl border transition-all"
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
                  <Icon size={18} style={{ color: isActive ? primaryColor : iconColor }} />
                </div>
                <span className="text-sm font-extrabold flex-1" style={{ color: isActive ? primaryColor : textColor }}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: secondaryColor }} />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}