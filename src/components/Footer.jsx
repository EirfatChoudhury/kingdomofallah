// src/components/Footer.jsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Mail, MapPin, Heart } from 'lucide-react';

export function Footer() {
  const cardBackground = useThemeColor({}, 'cardBackground');
  const borderColor = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');
  const primaryColor = useThemeColor({}, 'primary');
  const secondaryColor = useThemeColor({}, 'secondary');

  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="w-full border-t mt-auto transition-colors duration-300"
      style={{
        backgroundColor: cardBackground,
        borderTopColor: borderColor,
        borderRightColor: borderColor,
        borderBottomColor: borderColor,
        borderLeftColor: borderColor,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3 w-fit">
              <div className="w-10 h-10 relative shrink-0">
                <Image
                  src="/logos/KOA Logos/logo-removebg-preview.png"
                  alt="Kingdom of Allah Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <span
                className="text-lg sm:text-xl font-extrabold tracking-tight"
                style={{ color: primaryColor }}
              >
                Kingdom of Allah
              </span>
            </Link>
            <p
              className="text-xs sm:text-sm font-medium leading-relaxed max-w-sm"
              style={{ color: iconColor }}
            >
              Fostering unity, empowering youth, and enriching community connection across local masajid, educational programs, and outreach initiatives.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h4
              className="text-xs sm:text-sm font-extrabold uppercase tracking-wider"
              style={{ color: textColor }}
            >
              Explore
            </h4>
            <ul className="flex flex-col gap-2 text-xs sm:text-sm font-semibold">
              <li>
                <Link
                  href="/about"
                  className="hover:underline transition-opacity"
                  style={{ color: iconColor }}
                >
                  About KOA
                </Link>
              </li>
              <li>
                <Link
                  href="/announcements"
                  className="hover:underline transition-opacity"
                  style={{ color: iconColor }}
                >
                  Announcements
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="hover:underline transition-opacity"
                  style={{ color: iconColor }}
                >
                  Events Calendar
                </Link>
              </li>
              <li>
                <Link
                  href="/mosque"
                  className="hover:underline transition-opacity"
                  style={{ color: iconColor }}
                >
                  Member Mosques
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact / Connect */}
          <div className="flex flex-col gap-3">
            <h4
              className="text-xs sm:text-sm font-extrabold uppercase tracking-wider"
              style={{ color: textColor }}
            >
              Connect
            </h4>
            <div className="flex flex-col gap-2.5 text-xs sm:text-sm font-medium">
              <div className="flex items-center gap-2" style={{ color: iconColor }}>
                <MapPin size={15} style={{ color: primaryColor }} className="shrink-0" />
                <span>Kent, Medway, UK</span>
              </div>
              <Link
                href="/contact"
                className="flex items-center gap-2 hover:underline"
                style={{ color: iconColor }}
              >
                <Mail size={15} style={{ color: primaryColor }} className="shrink-0" />
                <span>Get in Touch</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div
          className="mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold"
          style={{ borderColor, color: iconColor }}
        >
          <p>© {currentYear} Kingdom of Allah (KOA). All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built with dedication for the community</span>
            <Heart size={13} className="text-red-500 fill-red-500" />
          </div>
        </div>
      </div>
    </footer>
  );
}