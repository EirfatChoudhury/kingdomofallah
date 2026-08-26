// src/app/api/contact/route.js
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { AppConfig } from '@/constants/config';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { name, email, phone, organization, topic, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: 'Kingdom of Allah Contact <onboarding@resend.dev>',
      to: [AppConfig.adminContactEmail],
      reply_to: email,
      subject: `New Inquiry: [${topic || 'General'}] from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #1b6b50; border-bottom: 2px solid #1b6b50; padding-bottom: 8px;">New Contact Submission</h2>
          <p><strong>Topic / Interest:</strong> ${topic || 'General'}</p>
          <p><strong>Full Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Organisation / Masjid:</strong> ${organization || 'Not provided'}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Message:</strong></p>
          <p style="background: #f9f9f9; padding: 12px; border-radius: 6px; white-space: pre-wrap;">${message}</p>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}