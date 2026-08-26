// src/app/mosque/enrolment/page.js
'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { MasjidNavbar } from '@/components/MasjidNavbar';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useMasjid } from '@/context/MasjidContext';
import { sendEnrolmentEmail } from '@/services/emailService';

function EnrolmentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const classTitle = searchParams.get('classTitle') || 'Selected Class';
  const { currentMasjid } = useMasjid();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const cardBackground = useThemeColor({}, 'cardBackground');
  const textColor = useThemeColor({}, 'text');
  const primaryColor = useThemeColor({}, 'primary');
  const secondaryColor = useThemeColor({}, 'secondary');
  const borderColor = useThemeColor({}, 'border');
  const iconColor = useThemeColor({}, 'icon');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();
    const trimmedEmail = email.trim();
    const fullName = `${trimmedFirst} ${trimmedLast}`.trim();

    if (!trimmedFirst || !trimmedLast || !trimmedEmail) {
      setStatusMessage({
        type: 'error',
        text: 'Please fill in your first name, last name, and email address.',
      });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    const result = await sendEnrolmentEmail({
      name: fullName,
      userEmail: trimmedEmail,
      classTitle: classTitle,
      masjidId: currentMasjid.id,
    });

    setIsSubmitting(false);

    if (result.success) {
      setStatusMessage({
        type: 'success',
        text: `Your enrolment request has been sent to ${currentMasjid.name}! We will be in touch soon.`,
      });
      setTimeout(() => {
        router.push('/mosque/classes');
      }, 2500);
    } else {
      setStatusMessage({
        type: 'error',
        text: result.error || 'Failed to submit enrolment. Please try again.',
      });
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col">
      {/* Top Header Bar */}
      <div
        className="flex items-center justify-between py-3 border-b mb-5"
        style={{ borderColor: borderColor }}
      >
        <button
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="p-1.5 rounded-full hover:opacity-75 transition-opacity cursor-pointer"
          aria-label="Go back"
        >
          <ArrowLeft size={20} style={{ color: textColor }} />
        </button>
        <h2
          className="text-base sm:text-lg font-extrabold tracking-tight"
          style={{ color: textColor }}
        >
          Class Enrolment
        </h2>
        <div className="w-8" />
      </div>

      {/* Class Banner Card */}
      <div
        className="p-4 rounded-2xl border border-l-4 mb-6 transition-colors"
        style={{
          backgroundColor: cardBackground,
          borderColor: borderColor,
          borderLeftColor: secondaryColor,
        }}
      >
        <div className="flex items-center gap-1.5 mb-1">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: secondaryColor }}
          />
          <span
            className="text-[10px] font-extrabold tracking-wider uppercase"
            style={{ color: iconColor }}
          >
            ENROLLING IN ({currentMasjid.name})
          </span>
        </div>
        <h3
          className="text-lg sm:text-xl font-extrabold leading-tight"
          style={{ color: primaryColor }}
        >
          {classTitle}
        </h3>
      </div>

      {/* Status Feedback Notice */}
      {statusMessage && (
        <div
          className={`p-3.5 rounded-xl text-xs sm:text-sm font-semibold mb-4 text-center border ${
            statusMessage.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
              : 'bg-red-500/10 text-red-600 border-red-500/20'
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      {/* Enrolment Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold tracking-tight" style={{ color: textColor }}>
            First Name
          </label>
          <input
            type="text"
            placeholder="e.g. Abdullah"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={isSubmitting}
            required
            className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors"
            style={{
              backgroundColor: cardBackground,
              borderColor: borderColor,
              color: textColor,
            }}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold tracking-tight" style={{ color: textColor }}>
            Last Name
          </label>
          <input
            type="text"
            placeholder="e.g. Khan"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={isSubmitting}
            required
            className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors"
            style={{
              backgroundColor: cardBackground,
              borderColor: borderColor,
              color: textColor,
            }}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold tracking-tight" style={{ color: textColor }}>
            Email Address
          </label>
          <input
            type="email"
            placeholder="e.g. name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            required
            className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors"
            style={{
              backgroundColor: cardBackground,
              borderColor: borderColor,
              color: textColor,
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-3 w-full py-3.5 rounded-xl font-extrabold text-sm text-white shadow-sm transition-all active:scale-[0.99] disabled:opacity-60 flex items-center justify-center cursor-pointer"
          style={{ backgroundColor: primaryColor }}
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            'Submit Enrolment'
          )}
        </button>
      </form>
    </div>
  );
}

export default function EnrolmentPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <MasjidNavbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <EnrolmentForm />
        </Suspense>
      </main>
    </div>
  );
}