// src/app/about/page.js
'use client';

import React from 'react';
import Link from 'next/link';
import { MainNavbar } from '@/components/MainNavbar';
import { Footer } from '@/components/Footer';
import { useThemeColor } from '@/hooks/useThemeColor';
import { 
  Globe2,
  GraduationCap,
  Sparkles,
  Users,
  Layers,
  Compass,
  Heart,
  Grid,
  BellRing,
  Building2,
  Handshake,
  HeartHandshake,
  Network,
  ArrowRight 
} from 'lucide-react';

const SECTION_ONE_IMAGE = "/images/KOA/about-section-1.webp";
const SECTION_TWO_IMAGE = "/images/KOA/about-section-2.webp";
const SECTION_THREE_IMAGE = "/images/KOA/about-section-3.webp";

// SECTION 1: For Mosques & Committee Leaders
const SECTION_ONE_OFFERS = [
  {
    icon: Globe2,
    title: 'An Instant Online Presence',
    description: 'Share your daily prayer times, facilities, and announcements through a dedicated portal without needing to build or maintain a website from scratch.',
  },
  {
    icon: GraduationCap,
    title: 'Effortless Class & Enrolment Management',
    description: 'List madrasah and adult classes with instant visibility on spaces, categories, and direct student enrolment requests.',
  },
  {
    icon: Sparkles,
    title: 'Youth Mentorship & Community Growth',
    description: 'Provide a hub for youth activities, career guidance, and leadership programs to keep the next generation connected to the masjid.',
  },
  {
    icon: Users,
    title: 'Showcase Your Imams & Scholars',
    description: 'Highlight your imams, resident teachers, and their verified credentials so worshippers can learn who guides them.',
  },
  {
    icon: Layers,
    title: 'Unite & Collaborate with Every Mosque',
    description: 'Break down barriers to co-host larger initiatives, share resources, and exchange best practices across all member masajid.',
  },
];

// SECTION 2: For Worshippers, Sisters & Families
const SECTION_TWO_OFFERS = [
  {
    icon: Compass,
    title: 'Cross-Mosque Events & Trips',
    description: 'Discover large-scale community lectures, youth tournaments, Umrah journeys, and charity volunteering drives happening across the network.',
  },
  {
    icon: Heart,
    title: 'Dedicated Sisters & Family Spaces',
    description: "Discover verified sisters' study circles, mother support networks, and accessible family facilities with complete ease.",
  },
  {
    icon: Grid,
    title: 'Essential Services & Facilities at a Glance',
    description: 'Instantly check available services—such as Nikah solemnisation, funeral arrangements, counselling, and hall bookings—across multiple locations.',
  },
  {
    icon: BellRing,
    title: 'Shared Announcements & Member Updates',
    description: 'Stay informed on the latest KOA initiatives, member milestones, and network-wide updates in one unified place.',
  },
];

// SECTION 3: For Local Businesses, Charities & Trusts
const SECTION_THREE_OFFERS = [
  {
    icon: Building2,
    title: 'Community Directory Spotlight',
    description: 'Get your business, professional practice, or charity listed where community members can easily discover you.',
  },
  {
    icon: Handshake,
    title: 'Direct Mosque Partnerships',
    description: 'Offer exclusive discounts, professional services, sponsorships, or facilities directly to member mosques.',
  },
  {
    icon: HeartHandshake,
    title: 'Amplify Good Causes',
    description: 'Share verified humanitarian appeals and project initiatives to reach a wider, caring audience.',
  },
  {
    icon: Network,
    title: 'Ethical Networking',
    description: 'Build long-term partnerships with like-minded Muslim business owners, non-profits, and community leaders.',
  },
];

export default function AboutPage() {
  const textColor = useThemeColor({}, 'text');
  const primaryColor = useThemeColor({}, 'primary');
  const secondaryColor = useThemeColor({}, 'secondary');
  const cardBackground = useThemeColor({}, 'cardBackground');
  const borderColor = useThemeColor({}, 'border');
  const iconColor = useThemeColor({}, 'icon');

  return (
    <div className="min-h-screen flex flex-col">
      <MainNavbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex flex-col gap-16">
        
        {/* Page Hero Header */}
        <div className="flex flex-col items-center text-center gap-3 max-w-3xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider shadow-sm"
            style={{
              backgroundColor: `${secondaryColor}15`,
              borderColor: `${secondaryColor}30`,
              color: secondaryColor,
            }}
          >
            <Sparkles size={14} />
            <span>Our Mission & Vision</span>
          </div>

          <h1
            className="text-3xl sm:text-5xl font-extrabold tracking-tight"
            style={{ color: primaryColor }}
          >
            Uniting the Ummah, Empowering Communities
          </h1>
          <p className="text-base sm:text-lg font-medium leading-relaxed" style={{ color: iconColor }}>
            Kingdom of Allah connects local masajid, community organisations, and businesses under a shared digital umbrella to uplift our collective strength.
          </p>
        </div>

        {/* Divider */}
        <hr className="border-t w-full" style={{ borderColor }} />

        {/* Section 1: For Mosques & Committee Leaders (Image Left, Cards + CTA Right) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Image */}
          <div className="lg:col-span-5">
            <div className="relative w-full h-80 sm:h-96 lg:h-125 rounded-3xl overflow-hidden border shadow-md" style={{ borderColor }}>
              <img
                src={SECTION_ONE_IMAGE}
                alt="Mosque Leadership and Committee Management"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Column: Offer Cards + CTA */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex flex-col gap-3.5">
              {SECTION_ONE_OFFERS.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="rounded-2xl border border-l-4 p-4 sm:p-5 flex items-start gap-4 shadow-sm transition-transform duration-200 hover:-translate-y-0.5"
                    style={{
                      backgroundColor: cardBackground,
                      borderTopColor: borderColor,
                      borderRightColor: borderColor,
                      borderBottomColor: borderColor,
                      borderLeftColor: primaryColor,
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 mt-0.5"
                      style={{
                        backgroundColor: `${textColor}05`,
                        borderColor,
                      }}
                    >
                      <Icon size={20} style={{ color: primaryColor }} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-sm sm:text-base font-extrabold tracking-tight" style={{ color: textColor }}>
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm font-medium leading-relaxed" style={{ color: iconColor }}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-1">
              <Link
                href="/mosque/all-member-mosques"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl text-sm font-bold text-white transition-all transform active:scale-95 shadow-md hover:opacity-90 group w-full sm:w-auto"
                style={{ backgroundColor: primaryColor }}
              >
                <span>View Member Mosques</span>
                <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>

        {/* Divider */}
        <hr className="border-t w-full" style={{ borderColor }} />

        {/* Section 2: For Worshippers, Sisters & Families (Cards + CTA Left, Image Right) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Offer Cards + CTA */}
          <div className="lg:col-span-7 flex flex-col gap-6 order-2 lg:order-1">
            <div className="flex flex-col gap-3.5">
              {SECTION_TWO_OFFERS.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="rounded-2xl border border-l-4 p-4 sm:p-5 flex items-start gap-4 shadow-sm transition-transform duration-200 hover:-translate-y-0.5"
                    style={{
                      backgroundColor: cardBackground,
                      borderTopColor: borderColor,
                      borderRightColor: borderColor,
                      borderBottomColor: borderColor,
                      borderLeftColor: secondaryColor,
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 mt-0.5"
                      style={{
                        backgroundColor: `${textColor}05`,
                        borderColor,
                      }}
                    >
                      <Icon size={20} style={{ color: secondaryColor }} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-sm sm:text-base font-extrabold tracking-tight" style={{ color: textColor }}>
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm font-medium leading-relaxed" style={{ color: iconColor }}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-1">
              <Link
                href="/events"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl text-sm font-bold text-white transition-all transform active:scale-95 shadow-md hover:opacity-90 group w-full sm:w-auto"
                style={{ backgroundColor: secondaryColor }}
              >
                <span>Discover Community Events</span>
                <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="relative w-full h-80 sm:h-96 lg:h-125 rounded-3xl overflow-hidden border shadow-md" style={{ borderColor }}>
              <img
                src={SECTION_TWO_IMAGE}
                alt="Community, Sisters, and Family Activities"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Divider */}
        <hr className="border-t w-full" style={{ borderColor }} />

        {/* Section 3: For Local Businesses, Charities & Trusts (Image Left, Cards + CTA Right) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Image */}
          <div className="lg:col-span-5">
            <div className="relative w-full h-80 sm:h-96 lg:h-125 rounded-3xl overflow-hidden border shadow-md" style={{ borderColor }}>
              <img
                src={SECTION_THREE_IMAGE}
                alt="Local Business and Charity Partnerships"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Column: Offer Cards + CTA */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex flex-col gap-3.5">
              {SECTION_THREE_OFFERS.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="rounded-2xl border border-l-4 p-4 sm:p-5 flex items-start gap-4 shadow-sm transition-transform duration-200 hover:-translate-y-0.5"
                    style={{
                      backgroundColor: cardBackground,
                      borderTopColor: borderColor,
                      borderRightColor: borderColor,
                      borderBottomColor: borderColor,
                      borderLeftColor: primaryColor,
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 mt-0.5"
                      style={{
                        backgroundColor: `${textColor}05`,
                        borderColor,
                      }}
                    >
                      <Icon size={20} style={{ color: primaryColor }} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-sm sm:text-base font-extrabold tracking-tight" style={{ color: textColor }}>
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm font-medium leading-relaxed" style={{ color: iconColor }}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-1">
              <Link
                href="/non-mosques"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl text-sm font-bold text-white transition-all transform active:scale-95 shadow-md hover:opacity-90 group w-full sm:w-auto"
                style={{ backgroundColor: primaryColor }}
              >
                <span>Explore Non-Mosque Directory</span>
                <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>

        {/* Divider */}
        <hr className="border-t w-full" style={{ borderColor }} />

        {/* Section 4: Final Universal Call to Action */}
        <section
          className="relative overflow-hidden rounded-3xl border p-8 sm:p-12 text-center flex flex-col items-center gap-6 shadow-sm"
          style={{
            backgroundColor: cardBackground,
            borderColor,
          }}
        >
          {/* Subtle Ambient Glow */}
          <div
            className="absolute -top-20 -left-20 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ backgroundColor: primaryColor }}
          />
          <div
            className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full blur-3xl opacity-15 pointer-events-none"
            style={{ backgroundColor: secondaryColor }}
          />

          <div className="relative z-10 max-w-2xl flex flex-col items-center gap-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight" style={{ color: primaryColor }}>
              Join the Kingdom of Allah Network
            </h2>
            <p className="text-sm sm:text-base font-medium leading-relaxed" style={{ color: iconColor }}>
              Whether you run a mosque, offer a local service, lead a charity trust, or want to get involved in community initiatives, partner with us today to amplify your impact.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-sm sm:text-base font-bold text-white transition-all transform active:scale-95 shadow-md hover:opacity-90 group"
              style={{ backgroundColor: primaryColor }}
            >
              <span>Partner With Us</span>
              <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}