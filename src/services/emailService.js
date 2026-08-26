// src/services/emailService.js

export async function sendEnrolmentEmail({ name, userEmail, classTitle, masjidId }) {
  try {
    const response = await fetch('/api/enrol', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        userEmail,
        classTitle,
        masjidId,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, error: result.error || 'Failed to send email' };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: err.message || 'Network error' };
  }
}