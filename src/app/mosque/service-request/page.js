// src/app/mosque/service-request/page.js
'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Send, AlertCircle, HeartHandshake } from 'lucide-react';
import { MasjidNavbar } from '@/components/MasjidNavbar';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useMasjid } from '@/context/MasjidContext';

function ServiceRequestForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceTitle = searchParams.get('serviceTitle') || 'Community Service';
  const { currentMasjid } = useMasjid();

  const textColor = useThemeColor({}, 'text');
  const cardBackground = useThemeColor({}, 'cardBackground');
  const primaryColor = useThemeColor({}, 'primary');
  const secondaryColor = useThemeColor({}, 'secondary');
  const borderColor = useThemeColor({}, 'border');
  const iconColor = useThemeColor({}, 'icon');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setErrorMsg('Please enter your full name and email address.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/service-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          serviceTitle,
          masjidId: currentMasjid.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send service request.');
      }

      setSubmitted(true);
    } catch (err) {
      setErrorMsg(err.message || 'An error occurred while submitting.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col pt-2 pb-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 self-start text-xs font-bold mb-6 transition-opacity hover:opacity-75 cursor-pointer"
        style={{ color: primaryColor }}
      >
        <ArrowLeft size={16} />
        <span>Back to Services</span>
      </button>

      {/* Main Form Container */}
      <div
        className="p-6 sm:p-8 rounded-3xl border shadow-sm transition-colors"
        style={{ backgroundColor: cardBackground, borderColor: borderColor }}
      >
        {submitted ? (
          <div className="flex flex-col items-center text-center py-8">
            <CheckCircle2 size={52} style={{ color: primaryColor }} className="mb-4" />
            <h2
              className="text-xl sm:text-2xl font-extrabold tracking-tight mb-2"
              style={{ color: textColor }}
            >
              Request Submitted
            </h2>
            <p
              className="text-xs sm:text-sm font-medium leading-relaxed max-w-md mb-6"
              style={{ color: iconColor }}
            >
              Thank you for contacting <strong>{currentMasjid.name}</strong> regarding{' '}
              <strong>{serviceTitle}</strong>. An admin or scholar will review your request and get back to you at{' '}
              <strong>{formData.email}</strong>.
            </p>
            <button
              onClick={() => router.push('/mosque/services')}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white transition-all active:scale-95 cursor-pointer"
              style={{ backgroundColor: primaryColor }}
            >
              Return to Services
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col">
            {/* Header Badge & Title */}
            <div className="flex items-center gap-2.5 mb-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${primaryColor}14` }}
              >
                <HeartHandshake size={18} style={{ color: primaryColor }} />
              </div>
              <span
                className="text-[10px] font-extrabold uppercase tracking-wider"
                style={{ color: secondaryColor }}
              >
                Service Inquiry • {currentMasjid.name}
              </span>
            </div>

            <h1
              className="text-xl sm:text-2xl font-extrabold tracking-tight mb-1"
              style={{ color: textColor }}
            >
              {serviceTitle}
            </h1>
            <p
              className="text-xs sm:text-sm font-medium mb-6"
              style={{ color: iconColor }}
            >
              Fill in your details below to request this service or ask any questions.
            </p>

            {errorMsg && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 text-red-500 text-xs font-bold mb-4">
                <AlertCircle size={16} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Input Fields */}
            <div className="flex flex-col gap-4">
              <div>
                <label
                  className="block text-xs font-bold mb-1.5"
                  style={{ color: textColor }}
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Abdullah Ahmed"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium outline-none transition-all focus:ring-2"
                  style={{
                    backgroundColor: 'transparent',
                    borderColor: borderColor,
                    color: textColor,
                  }}
                />
              </div>

              <div>
                <label
                  className="block text-xs font-bold mb-1.5"
                  style={{ color: textColor }}
                >
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="e.g. name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium outline-none transition-all focus:ring-2"
                  style={{
                    backgroundColor: 'transparent',
                    borderColor: borderColor,
                    color: textColor,
                  }}
                />
              </div>

              <div>
                <label
                  className="block text-xs font-bold mb-1.5"
                  style={{ color: textColor }}
                >
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="e.g. +44 7123 456789"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium outline-none transition-all focus:ring-2"
                  style={{
                    backgroundColor: 'transparent',
                    borderColor: borderColor,
                    color: textColor,
                  }}
                />
              </div>

              <div>
                <label
                  className="block text-xs font-bold mb-1.5"
                  style={{ color: textColor }}
                >
                  Questions / Additional Details (Optional)
                </label>
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Enter any specific questions, preferred dates, or requirements..."
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium outline-none transition-all focus:ring-2 resize-none"
                  style={{
                    backgroundColor: 'transparent',
                    borderColor: borderColor,
                    color: textColor,
                  }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-white flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              style={{ backgroundColor: primaryColor }}
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Submit Service Request</span>
                  <Send size={15} />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ServiceRequestPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <MasjidNavbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <ServiceRequestForm />
        </Suspense>
      </main>
    </div>
  );
}