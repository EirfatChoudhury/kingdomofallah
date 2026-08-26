// src/app/api/service-request/route.js
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { MASJIDS_DATA, DEFAULT_MASJID_ID } from '@/constants/masjidsData';

export async function POST(req) {
  try {
    const { name, email, phone, serviceTitle, message, masjidId } = await req.json();

    if (!name || !email || !serviceTitle) {
      return NextResponse.json(
        { error: 'Name, email, and service title are required.' },
        { status: 400 }
      );
    }

    const targetMasjid = MASJIDS_DATA[masjidId] || MASJIDS_DATA[DEFAULT_MASJID_ID];
    const masjidName = targetMasjid.name;
    const targetAdminEmail = targetMasjid.adminEnrolmentEmail || targetMasjid.contact?.email;

    // Pull the masjid-specific API key from process.env
    const apiKey = process.env[targetMasjid.resendApiKeyEnv];
    if (!apiKey) {
      return NextResponse.json(
        { error: `Missing Resend API key for ${masjidName}` },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);
    const emailSubject = `New Service Inquiry (${masjidName}): ${serviceTitle} - ${name}`;
    const emailBody = `
Dear ${masjidName},

I, ${name}, would like to inquire about / request the service: "${serviceTitle}".

--- Applicant Details ---
Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}

--- Questions / Message ---
${message || 'No additional questions entered.'}

Thank you,
${name}
    `.trim();

    const { data, error } = await resend.emails.send({
      from: `${masjidName} <onboarding@resend.dev>`,
      to: [targetAdminEmail],
      reply_to: email,
      subject: emailSubject,
      text: emailBody,
    });

    if (error) {
      console.error('Resend API error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Service request error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit service request.' },
      { status: 500 }
    );
  }
}