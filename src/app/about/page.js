// src/app/about/page.js
'use client';

import React from 'react';
import Link from 'next/link';
import { MainNavbar } from '@/components/MainNavbar';
import { Footer } from '@/components/Footer';
import { useThemeColor } from '@/hooks/useThemeColor';
import { 
  Users, 
  Sparkles, 
  Heart, 
  Briefcase, 
  Globe2, 
  GraduationCap, 
  HandHeart, 
  Layers, 
  ArrowRight 
} from 'lucide-react';

const SECTION_ONE_IMAGE = "https://imgs.search.brave.com/uNi-OcBBdqukVYCHRz4OslA0quhQAo0_sq-uO1Yrz1s/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuc3F1YXJlc3Bh/Y2UtY2RuLmNvbS9j/b250ZW50L3YxLzY1/NThkNzg1NmViNzRl/NDFkYzEzMWEyNy9k/MWRlNmNiYi1kMDYy/LTQyZDItYjIyZS0y/YjFmNzNiYjY2OGQv/Z3JvdXAuSlBH";
const PLACEHOLDER_IMAGE = "https://imgs.search.brave.com/nUSsrRonWWLlP9DH67FzKzqvVz7msD7AAL6_GeKpOAU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTE3/Mjg2ODY3MS9waG90/by90aGUtZWFzdC1s/b25kb24tbW9zcXVl/LWFuZC10aGUtbG9u/ZG9uLW11c2xpbS1j/ZW50ZXItanVzdC1i/ZWZvcmUtc3Vuc2V0/LWR1cmluZy10aGUt/aG9seS1tb250aC5q/cGc_cz02MTJ4NjEy/Jnc9MCZrPTIwJmM9/ajI3OFZVUXJ3Tklj/dUstX2hMMzJZSno4/eW9OUFlhaVViaHp0/X2UyTUQ0QT0";

// SECTION 1: Community-First Hook (Unity, Youth, Sisters, Business Alliances)
const SECTION_ONE_OFFERS = [
  {
    icon: Users,
    title: 'Cross-Masjid Unity & Joint Events',
    description: 'Breaking down community silos by uniting masajid to co-host regional lectures, sports tournaments, youth camps, and joint Ramadan programs.',
  },
  {
    icon: Sparkles,
    title: 'Youth Leadership & Enterprise',
    description: 'Reconnecting young Muslims to the mosque while providing hands-on mentorship, skills training, and networks to launch ethical businesses.',
  },
  {
    icon: Heart,
    title: 'Sister-Centric Spaces & Programs',
    description: "Championing dedicated sisters' circles, mothers' networks, verified female scholarship, and comfortable, accessible mosque spaces.",
  },
  {
    icon: Briefcase,
    title: 'Strategic Business & Non-Mosque Alliances',
    description: 'Partnering with vetted businesses, trusts, and charities to secure discounted (or other) professional services, facilities, and sponsorships for masajid.',
  },
];

// SECTION 2: Institutional & Operational Growth (Tech, Trust, Sadaqah, Resource Sharing)
const SECTION_TWO_OFFERS = [
  {
    icon: Globe2,
    title: 'Modern Digital Reach & Visibility',
    description: 'Equipping every masjid with custom digital visibility, automated live prayer feeds, and effortless community engagement tools.',
  },
  {
    icon: GraduationCap,
    title: 'Verified Scholarly Transparency',
    description: 'Building authentic trust by showcasing the verified qualifications, ijazaat, and credentials of resident imams and educators.',
  },
  {
    icon: HandHeart,
    title: 'Collective Sadaqah & Project Amplification',
    description: 'Spotlighting verified mosque and charity initiatives to a wider audience with zero donation handling—directing 100% of support straight to the source.',
  },
  {
    icon: Layers,
    title: 'Resource Sharing & Milestone Showcases',
    description: 'Enabling member organisations to pool physical assets, share best practices, and publicly celebrate community milestones and future goals.',
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

        {/* Section 1: Image Left, Community Cards & CTA Right */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Image */}
          <div className="lg:col-span-5">
            <div className="relative w-full h-80 sm:h-96 lg:h-125 rounded-3xl overflow-hidden border shadow-md" style={{ borderColor }}>
              <img
                src={SECTION_ONE_IMAGE}
                alt="Community Unity and Sister Networks"
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
                href="/events"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl text-sm font-bold text-white transition-all transform active:scale-95 shadow-md hover:opacity-90 group w-full sm:w-auto"
                style={{ backgroundColor: primaryColor }}
              >
                <span>Discover Community Initiatives</span>
                <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>

        {/* Divider */}
        <hr className="border-t w-full" style={{ borderColor }} />

        {/* Section 2: Cards & CTA Left, Image Right */}
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
                href="/mosque/all-member-mosques"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl text-sm font-bold text-white transition-all transform active:scale-95 shadow-md hover:opacity-90 group w-full sm:w-auto"
                style={{ backgroundColor: secondaryColor }}
              >
                <span>View Member Mosques</span>
                <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="relative w-full h-80 sm:h-96 lg:h-125 rounded-3xl overflow-hidden border shadow-md" style={{ borderColor }}>
              <img
                src={PLACEHOLDER_IMAGE}
                alt="Mosque Technology and Scholarly Network"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Divider */}
        <hr className="border-t w-full" style={{ borderColor }} />

        {/* Section 3: Final Call to Action */}
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
              Join the Kingdom of Allah
            </h2>
            <p className="text-sm sm:text-base font-medium leading-relaxed" style={{ color: iconColor }}>
              Whether you are a mosque committee, charity trust, local business, or community organiser, partner with us today to amplify your impact.
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