// src/components/DonationDetails.jsx
'use client';

import React, { useState } from 'react';
import { Heart, Info, Copy, Check } from 'lucide-react';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useMasjid } from '@/context/MasjidContext';

export function DonationDetails() {
  const { currentMasjid } = useMasjid();

  const textColor = useThemeColor({}, 'text');
  const cardBackground = useThemeColor({}, 'cardBackground');
  const primaryColor = useThemeColor({}, 'primary');
  const secondaryColor = useThemeColor({}, 'secondary');
  const borderColor = useThemeColor({}, 'border');
  const iconColor = useThemeColor({}, 'icon');

  const [copiedKey, setCopiedKey] = useState(null);

  const donation = currentMasjid?.donation || {};

  const handleCopy = async (key, value) => {
    let copied = false;

    if (typeof window !== 'undefined' && window.isSecureContext && navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(value);
        copied = true;
      } catch (e) {
        copied = false;
      }
    }

    if (!copied && typeof document !== 'undefined') {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = value;
        textArea.setAttribute('readonly', '');
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        copied = document.execCommand('copy');
        document.body.removeChild(textArea);
      } catch (e) {
        console.error('Fallback copy failed: ', e);
      }
    }

    if (copied) {
      setCopiedKey(key);
      setTimeout(() => {
        setCopiedKey(null);
      }, 2000);
    }
  };

  if (!donation.bankName && !donation.accountNumber) return null;

  return (
    <div className="w-full mt-6">
      <h3
        className="text-sm sm:text-base font-extrabold tracking-tight mb-3"
        style={{ color: textColor }}
      >
        Support {currentMasjid?.name}
      </h3>

      <div
        className="p-4 rounded-[20px] border transition-colors duration-200"
        style={{ backgroundColor: cardBackground, borderColor: borderColor }}
      >
        {/* Header */}
        <div className="flex items-center mb-3.5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center mr-3.5 shrink-0"
            style={{ backgroundColor: `${primaryColor}14` }}
          >
            <Heart size={20} style={{ color: secondaryColor }} fill={secondaryColor} />
          </div>
          <div className="flex-1">
            <span
              className="block text-[10px] font-extrabold tracking-wider uppercase mb-0.5"
              style={{ color: iconColor }}
            >
              DIRECT BANK TRANSFER
            </span>
            <h4
              className="text-sm sm:text-base font-extrabold tracking-tight"
              style={{ color: textColor }}
            >
              {donation.bankName}
            </h4>
          </div>
        </div>

        {/* Instructions Notice Box */}
        <div
          className="flex items-start rounded-xl border p-3 mb-3.5 gap-2"
          style={{
            backgroundColor: `${primaryColor}10`,
            borderColor: `${primaryColor}25`,
          }}
        >
          <Info size={18} style={{ color: primaryColor }} className="shrink-0 mt-0.5" />
          <p
            className="text-xs font-medium leading-relaxed"
            style={{ color: textColor }}
          >
            Please copy each detail below into your banking app to transfer directly to the masjid account.
          </p>
        </div>

        {/* Bank Transfer Details List */}
        <div
          className="rounded-xl border px-3.5 py-1.5"
          style={{ borderColor: borderColor }}
        >
          {/* Account Name */}
          <div className="flex items-center justify-between py-2">
            <div className="flex-1 pr-3">
              <span
                className="block text-[11px] font-bold tracking-tight mb-0.5"
                style={{ color: iconColor }}
              >
                Account Name
              </span>
              <p
                className="text-xs sm:text-sm font-semibold truncate"
                style={{ color: textColor }}
              >
                {donation.accountName}
              </p>
            </div>
            <button
              onClick={() => handleCopy('accountName', donation.accountName)}
              className="flex items-center px-3 py-1.5 rounded-full border text-xs font-bold gap-1 transition-all active:scale-95 shrink-0 cursor-pointer"
              style={{
                backgroundColor: copiedKey === 'accountName' ? primaryColor : 'transparent',
                borderColor: copiedKey === 'accountName' ? primaryColor : borderColor,
                color: copiedKey === 'accountName' ? '#FFFFFF' : textColor,
              }}
            >
              {copiedKey === 'accountName' ? (
                <>
                  <Check size={13} color="#FFFFFF" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy size={13} style={{ color: iconColor }} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <div className="h-px w-full" style={{ backgroundColor: borderColor }} />

          {/* Sort Code */}
          <div className="flex items-center justify-between py-2">
            <div className="flex-1 pr-3">
              <span
                className="block text-[11px] font-bold tracking-tight mb-0.5"
                style={{ color: iconColor }}
              >
                Sort Code
              </span>
              <p
                className="text-xs sm:text-sm font-extrabold tabular-nums tracking-wider"
                style={{ color: textColor }}
              >
                {donation.sortCode}
              </p>
            </div>
            <button
              onClick={() => handleCopy('sortCode', donation.sortCode)}
              className="flex items-center px-3 py-1.5 rounded-full border text-xs font-bold gap-1 transition-all active:scale-95 shrink-0 cursor-pointer"
              style={{
                backgroundColor: copiedKey === 'sortCode' ? primaryColor : 'transparent',
                borderColor: copiedKey === 'sortCode' ? primaryColor : borderColor,
                color: copiedKey === 'sortCode' ? '#FFFFFF' : textColor,
              }}
            >
              {copiedKey === 'sortCode' ? (
                <>
                  <Check size={13} color="#FFFFFF" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy size={13} style={{ color: iconColor }} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <div className="h-px w-full" style={{ backgroundColor: borderColor }} />

          {/* Account Number */}
          <div className="flex items-center justify-between py-2">
            <div className="flex-1 pr-3">
              <span
                className="block text-[11px] font-bold tracking-tight mb-0.5"
                style={{ color: iconColor }}
              >
                Account Number
              </span>
              <p
                className="text-xs sm:text-sm font-extrabold tabular-nums tracking-wider"
                style={{ color: textColor }}
              >
                {donation.accountNumber}
              </p>
            </div>
            <button
              onClick={() => handleCopy('accountNumber', donation.accountNumber)}
              className="flex items-center px-3 py-1.5 rounded-full border text-xs font-bold gap-1 transition-all active:scale-95 shrink-0 cursor-pointer"
              style={{
                backgroundColor: copiedKey === 'accountNumber' ? primaryColor : 'transparent',
                borderColor: copiedKey === 'accountNumber' ? primaryColor : borderColor,
                color: copiedKey === 'accountNumber' ? '#FFFFFF' : textColor,
              }}
            >
              {copiedKey === 'accountNumber' ? (
                <>
                  <Check size={13} color="#FFFFFF" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy size={13} style={{ color: iconColor }} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}