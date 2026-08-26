// src/services/prayerTimesService.js

// Fetch from Google Sheets or fall back to cached copy in localStorage
async function getPrayerCsvContent(csvUrl, masjidId = 'default') {
  const cacheKey = `cached_prayer_times_csv_${masjidId}`;

  if (csvUrl) {
    try {
      const response = await fetch(csvUrl);
      if (response.ok) {
        const text = await response.text();
        if (typeof window !== 'undefined') {
          localStorage.setItem(cacheKey, text);
        }
        return text;
      }
    } catch {
      // Network failed, fall back to cached file
    }
  }

  // Fallback: Check if a previously cached copy exists for this masjid
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(cacheKey);
    if (cached) return cached;
  }

  return '';
}

// Format local YYYY-MM-DD string without UTC shift
export function getLocalDateString(d = new Date()) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Local Friday check
export function checkIsFriday(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const localDate = new Date(year, month - 1, day);
  return localDate.getDay() === 5;
}

export async function loadPrayerTimesFromCSV(csvUrl, masjidId) {
  const csvContent = await getPrayerCsvContent(csvUrl, masjidId);
  if (!csvContent) return [];

  const lines = csvContent.replace(/^\uFEFF/, '').trim().split(/\r?\n/);
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const cols = line.split(',').map((val) => val.trim());
    const dateStr = cols[0];
    const isFriday = checkIsFriday(dateStr);
    const jummahTime = cols[12] || '-';

    rows.push({
      date: dateStr,
      fajrAdhaan: cols[1] || '-',
      fajrIqamah: cols[2] || '-',
      sunrise: cols[3] || '-',
      dhuhrAdhaan: cols[4] || '-',
      dhuhrIqamah: isFriday && jummahTime !== '-' ? jummahTime : cols[5] || '-',
      asrAdhaan: cols[6] || '-',
      asrIqamah: cols[7] || '-',
      maghribAdhaan: cols[8] || '-',
      maghribIqamah: cols[9] || '-',
      ishaAdhaan: cols[10] || '-',
      ishaIqamah: cols[11] || '-',
      jummah: jummahTime,
      isFriday,
    });
  }

  return rows;
}

export async function getTodayPrayerTimes(csvUrl, masjidId) {
  const allRows = await loadPrayerTimesFromCSV(csvUrl, masjidId);
  const today = getLocalDateString(new Date());

  const match = allRows.find((row) => row.date === today);
  return match || allRows[0] || null;
}