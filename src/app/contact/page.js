// src/app/contact/page.js
'use client';

import React, { useState } from 'react';
import { MainNavbar } from '@/components/MainNavbar';
import { Footer } from '@/components/Footer';
import { useThemeColor } from '@/hooks/useThemeColor';
import { 
  Mail, 
  MapPin, 
  Send, 
  Sparkles, 
  Building2, 
  Briefcase, 
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';

const CONTACT_CHANNELS = [
  {
    icon: Mail,
    title: 'Email Us',
    subtitle: 'Direct support & general inquiries',
    detail: 'info@kingdomofallah.com',
    href: 'mailto:info@kingdomofallah.com',
    actionText: 'Open in Email Client',
  },
  {
    icon: MapPin,
    title: 'Headquarters',
    subtitle: 'Regional Coordination Hub',
    detail: 'Gillingham, Kent, UK',
    href: 'https://maps.google.com/?q=Gillingham,Kent,UK',
    actionText: 'View on Maps',
  },
];

const INQUIRY_TYPES = [
  { id: 'Mosque Affiliation', label: 'Mosque Affiliation', icon: Building2 },
  { id: 'Business Partnership', label: 'Business Partnership', icon: Briefcase },
  { id: 'General Inquiry', label: 'General Inquiry', icon: HelpCircle },
];

export default function ContactPage() {
  const textColor = useThemeColor({}, 'text');
  const primaryColor = useThemeColor({}, 'primary');
  const secondaryColor = useThemeColor({}, 'secondary');
  const cardBackground = useThemeColor({}, 'cardBackground');
  const borderColor = useThemeColor({}, 'border');
  const iconColor = useThemeColor({}, 'icon');

  const [inquiryType, setInquiryType] = useState('Mosque Affiliation');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          topic: inquiryType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || data.error || 'Failed to send message.');
      }

      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        organization: '',
        message: '',
      });
    } catch (err) {
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <MainNavbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex flex-col gap-12">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center gap-3 max-w-2xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider shadow-sm"
            style={{
              backgroundColor: `${secondaryColor}15`,
              borderColor: `${secondaryColor}30`,
              color: secondaryColor,
            }}
          >
            <Sparkles size={14} />
            <span>Connect & Collaborate</span>
          </div>

          <h1
            className="text-3xl sm:text-5xl font-extrabold tracking-tight"
            style={{ color: primaryColor }}
          >
            Get In Touch
          </h1>
          <p className="text-base sm:text-lg font-medium leading-relaxed" style={{ color: iconColor }}>
            Have a question, want to affiliate your masjid, or explore community partnership opportunities? Send us an email below.
          </p>
        </div>

        {/* Quick Contact Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {CONTACT_CHANNELS.map((item, index) => {
            const Icon = item.icon;
            return (
              <a
                key={index}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className="group rounded-3xl border border-l-4 p-5 sm:p-6 flex flex-col justify-between gap-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                style={{
                  backgroundColor: cardBackground,
                  borderTopColor: borderColor,
                  borderRightColor: borderColor,
                  borderBottomColor: borderColor,
                  borderLeftColor: secondaryColor,
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                    style={{
                      backgroundColor: `${textColor}05`,
                      borderColor,
                    }}
                  >
                    <Icon size={20} style={{ color: primaryColor }} />
                  </div>

                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: iconColor }}>
                      {item.title}
                    </span>
                    <span className="text-sm sm:text-base font-extrabold truncate" style={{ color: textColor }}>
                      {item.detail}
                    </span>
                    <span className="text-xs font-medium mt-0.5" style={{ color: iconColor }}>
                      {item.subtitle}
                    </span>
                  </div>
                </div>

                <div 
                  className="text-xs font-bold flex items-center gap-1.5 transition-colors group-hover:opacity-80"
                  style={{ color: primaryColor }}
                >
                  <span>{item.actionText}</span>
                  <span>&rarr;</span>
                </div>
              </a>
            );
          })}
        </div>

        {/* Email Form Container */}
        <div
          className="rounded-3xl border p-6 sm:p-10 shadow-sm flex flex-col gap-6"
          style={{
            backgroundColor: cardBackground,
            borderColor,
          }}
        >
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: textColor }}>
              Send Us an Email
            </h2>
            <p className="text-sm font-medium" style={{ color: iconColor }}>
              Fill out the form below and it will be delivered directly to our inbox.
            </p>
          </div>

          {isSubmitted ? (
            <div
              className="p-8 rounded-2xl border flex flex-col items-center text-center gap-3"
              style={{
                backgroundColor: `${primaryColor}10`,
                borderColor: `${primaryColor}30`,
              }}
            >
              <CheckCircle2 size={42} style={{ color: primaryColor }} />
              <h3 className="text-lg font-extrabold" style={{ color: textColor }}>
                Message Sent Successfully!
              </h3>
              <p className="text-xs sm:text-sm font-medium max-w-md" style={{ color: iconColor }}>
                Thank you for reaching out. We have received your email and will respond to you shortly.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="mt-3 px-5 py-2 rounded-xl text-xs font-bold border transition-transform active:scale-95 cursor-pointer"
                style={{
                  backgroundColor: cardBackground,
                  borderColor,
                  color: textColor,
                }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {errorMessage && (
                <div
                  className="p-4 rounded-xl border flex items-center gap-3 text-xs font-bold"
                  style={{
                    backgroundColor: '#ef444415',
                    borderColor: '#ef444440',
                    color: '#ef4444',
                  }}
                >
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Topic Selector */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-extrabold uppercase tracking-wider" style={{ color: iconColor }}>
                  Topic of Interest
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {INQUIRY_TYPES.map((type) => {
                    const Icon = type.icon;
                    const isSelected = inquiryType === type.id;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setInquiryType(type.id)}
                        className="flex items-center justify-center gap-2 px-3 py-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer"
                        style={{
                          backgroundColor: isSelected ? `${primaryColor}15` : `${textColor}04`,
                          borderColor: isSelected ? primaryColor : borderColor,
                          color: isSelected ? primaryColor : textColor,
                        }}
                      >
                        <Icon size={16} />
                        <span>{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sender Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold" style={{ color: textColor }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Brother Ahmad"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border text-sm font-medium outline-none transition-colors"
                    style={{
                      backgroundColor: `${textColor}05`,
                      borderColor,
                      color: textColor,
                    }}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold" style={{ color: textColor }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. ahmad@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border text-sm font-medium outline-none transition-colors"
                    style={{
                      backgroundColor: `${textColor}05`,
                      borderColor,
                      color: textColor,
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold" style={{ color: textColor }}>
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="+44 7000 000000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border text-sm font-medium outline-none transition-colors"
                    style={{
                      backgroundColor: `${textColor}05`,
                      borderColor,
                      color: textColor,
                    }}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold" style={{ color: textColor }}>
                    Organisation / Masjid (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Local Islamic Centre"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border text-sm font-medium outline-none transition-colors"
                    style={{
                      backgroundColor: `${textColor}05`,
                      borderColor,
                      color: textColor,
                    }}
                  />
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold" style={{ color: textColor }}>
                  Your Message *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us how we can help or collaborate..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border text-sm font-medium outline-none transition-colors resize-none"
                  style={{
                    backgroundColor: `${textColor}05`,
                    borderColor,
                    color: textColor,
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-sm font-bold text-white transition-all transform active:scale-95 shadow-md hover:opacity-90 cursor-pointer disabled:opacity-60 disabled:pointer-events-none w-full sm:w-auto self-start"
                style={{ backgroundColor: primaryColor }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
}