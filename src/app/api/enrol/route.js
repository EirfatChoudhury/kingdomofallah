// src/app/api/enrol/route.js
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { MASJIDS_DATA, DEFAULT_MASJID_ID } from '@/constants/masjidsData';

export async function POST(request) {
  try {
    const { name, userEmail, classTitle, masjidId } = await request.json();

    if (!name || !userEmail || !classTitle) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const targetMasjid = MASJIDS_DATA[masjidId] || MASJIDS_DATA[DEFAULT_MASJID_ID];
    const masjidName = targetMasjid.name;
    const recipientEmail = targetMasjid.adminEnrolmentEmail;

    // Pull the masjid-specific API key from process.env
    const apiKey = process.env[targetMasjid.resendApiKeyEnv];

    if (!apiKey) {
      return NextResponse.json(
        { error: `Missing Resend API key for ${masjidName}` },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);
    const emailBody = `Dear ${masjidName},\n\nI, ${name}, would like to enrol on ${classTitle}.\n\nHere is my contact email address: ${userEmail}\n\nThank you,\n\n${name}`;

    const data = await resend.emails.send({
      from: `${masjidName} <onboarding@resend.dev>`,
      to: [recipientEmail],
      reply_to: userEmail,
      subject: `Enrolment Request (${masjidName}): ${classTitle} - ${name}`,
      text: emailBody,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}