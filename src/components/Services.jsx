// src/components/Services.jsx
'use client';

import React from 'react';
import { 
  Moon, 
  BookOpen, 
  HeartHandshake, 
  Users, 
  ShieldCheck, 
  HelpCircle,
  ArrowRight 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useMasjid } from '@/context/MasjidContext';

const ICON_MAP = {
  Moon,
  BookOpen,
  HeartHandshake,
  Users,
  ShieldCheck,
};

export function Services() {
  const router = useRouter();
  const { currentMasjid } = useMasjid();

  const textColor = useThemeColor({}, 'text');
  const cardBackground = useThemeColor({}, 'cardBackground');
  const primaryColor = useThemeColor({}, 'primary');
  const secondaryColor = useThemeColor({}, 'secondary');
  const borderColor = useThemeColor({}, 'border');
  const iconColor = useThemeColor({}, 'icon');

  const services = currentMasjid?.services || [];

  const handleRequestService = (title) => {
    router.push(`/mosque/service-request?serviceTitle=${encodeURIComponent(title)}`);
  };

  return (
    <div className="w-full flex flex-col">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12">
        <h1
          className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2"
          style={{ color: primaryColor }}
        >
          Our Services
        </h1>
        <p
          className="text-xs sm:text-sm font-medium max-w-xl mx-auto"
          style={{ color: iconColor }}
        >
          Services provided by {currentMasjid?.name} to support the community spiritually, educationally, and socially.
        </p>
      </div>

      {/* Grid Track */}
      {services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {services.map((service) => {
            const Icon = ICON_MAP[service.icon] || HelpCircle;

            return (
              <article
                key={service.id}
                className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-l-4 flex flex-col justify-between shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                style={{
                  backgroundColor: cardBackground,
                  borderColor: borderColor,
                  borderLeftColor: secondaryColor,
                }}
              >
                <div>
                  {/* Top Row: Icon and Pricing Tag */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border"
                      style={{
                        backgroundColor: `${primaryColor}14`,
                        borderColor: `${primaryColor}25`,
                      }}
                    >
                      <Icon size={24} style={{ color: primaryColor }} />
                    </div>

                    <div className="text-right">
                      <span
                        className="text-xs sm:text-sm font-extrabold px-2.5 py-1 rounded-full border inline-block"
                        style={{
                          backgroundColor: `${secondaryColor}15`,
                          borderColor: `${secondaryColor}40`,
                          color: secondaryColor,
                        }}
                      >
                        {service.price}
                      </span>
                      {service.priceNote && (
                        <p className="text-[10px] font-semibold mt-0.5" style={{ color: iconColor }}>
                          {service.priceNote}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h2
                    className="text-base sm:text-lg font-extrabold tracking-tight mb-2"
                    style={{ color: textColor }}
                  >
                    {service.title}
                  </h2>
                  <p
                    className="text-xs sm:text-sm font-medium leading-relaxed mb-6"
                    style={{ color: iconColor }}
                  >
                    {service.description}
                  </p>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleRequestService(service.title)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-all duration-150 hover:opacity-90 active:scale-95 cursor-pointer"
                  style={{
                    backgroundColor: `${primaryColor}14`,
                    color: primaryColor,
                    borderColor: borderColor,
                  }}
                >
                  <span>Request Service</span>
                  <ArrowRight size={14} />
                </button>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center">
          <p className="text-sm font-medium" style={{ color: iconColor }}>
            No services listed for this mosque yet.
          </p>
        </div>
      )}
    </div>
  );
}