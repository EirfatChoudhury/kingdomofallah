// src/components/TeamGrid.jsx
'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useMasjid } from '@/context/MasjidContext';

export function TeamGrid() {
  const { currentMasjid } = useMasjid();
  const textColor = useThemeColor({}, 'text');
  const cardBackground = useThemeColor({}, 'cardBackground');
  const primaryColor = useThemeColor({}, 'primary');
  const secondaryColor = useThemeColor({}, 'secondary');
  const borderColor = useThemeColor({}, 'border');
  const iconColor = useThemeColor({}, 'icon');

  const team = currentMasjid?.team || [];

  if (team.length === 0) return null;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <h2
          className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-1"
          style={{ color: primaryColor }}
        >
          Our Scholarly Leadership
        </h2>
        <p className="text-xs sm:text-sm font-medium max-w-xl mx-auto" style={{ color: iconColor }}>
          Learn from verified, certified spiritual leaders dedicated to providing authentic guidance at {currentMasjid?.name}.
        </p>
      </div>

      {/* Grid List */}
      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        {team.map((member) => (
          <article
            key={member.id}
            className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-l-4 flex flex-col md:flex-row gap-5 items-start md:items-center shadow-sm transition-colors"
            style={{
              backgroundColor: cardBackground,
              borderColor: borderColor,
              borderLeftColor: secondaryColor,
            }}
          >
            {/* Avatar Column */}
            <div
              className="w-full md:w-48 h-48 sm:h-52 md:h-48 rounded-xl sm:rounded-2xl overflow-hidden shrink-0 border"
              style={{ borderColor: borderColor }}
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details Column */}
            <div className="flex-1 flex flex-col w-full">
              <span
                className="self-start text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full mb-1.5 border"
                style={{
                  backgroundColor: `${primaryColor}14`,
                  color: primaryColor,
                  borderColor: `${primaryColor}30`,
                }}
              >
                {member.role}
              </span>

              <h3
                className="text-lg sm:text-xl font-extrabold tracking-tight mb-1.5"
                style={{ color: textColor }}
              >
                {member.name}
              </h3>

              <p
                className="text-xs sm:text-sm leading-relaxed mb-4 font-medium"
                style={{ color: iconColor }}
              >
                {member.description}
              </p>

              {/* Qualifications Sub-List */}
              {member.qualifications && member.qualifications.length > 0 && (
                <div
                  className="pt-3 border-t border-dashed"
                  style={{ borderColor: borderColor }}
                >
                  <h4
                    className="text-[11px] font-extrabold uppercase tracking-wider mb-2"
                    style={{ color: secondaryColor }}
                  >
                    Credentials & Qualifications
                  </h4>
                  <ul className="flex flex-col gap-1.5">
                    {member.qualifications.map((qual, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-xs font-semibold"
                        style={{ color: textColor }}
                      >
                        <Check
                          size={14}
                          className="shrink-0 mt-0.5"
                          style={{ color: secondaryColor }}
                        />
                        <span>{qual}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}