// src/services/eventsService.js
import { AppConfig } from '@/constants/config';
import { geocodePostcodes } from '@/utils/geoUtils';

const CACHE_KEY = 'cached_koa_events_csv';

function parseCSVRow(row) {
  const result = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === ',' && !insideQuotes) {
      result.push(current.trim().replace(/^"|"$/g, ''));
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim().replace(/^"|"$/g, ''));
  return result;
}

function extractImageUrl(rawUrl) {
  if (!rawUrl) return '';
  const markdownMatch = rawUrl.match(/\((https?:\/\/[^\s)]+)\)/);
  if (markdownMatch) return markdownMatch[1];
  return rawUrl.trim();
}

async function getEventsCsvContent() {
  if (AppConfig.eventsCsvUrl) {
    try {
      const response = await fetch(AppConfig.eventsCsvUrl);
      if (response.ok) {
        const text = await response.text();
        if (typeof window !== 'undefined') {
          localStorage.setItem(CACHE_KEY, text);
        }
        return text;
      }
    } catch {
      // Network failed, fallback to local cache
    }
  }

  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) return cached;
  }

  return '';
}

export async function loadEventsFromCSV() {
  const csvContent = await getEventsCsvContent();
  if (!csvContent) return [];

  const lines = csvContent.replace(/^\uFEFF/, '').trim().split(/\r?\n/);
  if (lines.length <= 1) return [];

  const events = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const cols = parseCSVRow(line);
    const rawId = cols[0]?.trim();
    const id = rawId ? `${rawId}-${i}` : `event-${i}`;

    events.push({
      id,
      title: cols[1] || '',
      description: cols[2] || '',
      audiences: cols[3] ? cols[3].split(';').map((s) => s.trim()).filter(Boolean) : [],
      activities: cols[4] ? cols[4].split(';').map((s) => s.trim()).filter(Boolean) : [],
      badges: cols[5] ? cols[5].split(';').map((s) => s.trim()).filter(Boolean) : [],
      location: cols[6] || '',
      postcode: cols[7] || '',
      startDatetime: cols[8] || '',
      endDatetime: cols[9] || '',
      price: cols[10] || 'Free',
      imageUrl: extractImageUrl(cols[11]),
      contactEmail: cols[12] || '',
      contactNumber: cols[13] || '',
      capacity: cols[14] || '',
      availability: cols[15] || 'Space available',
      recurring: cols[16] || '',
      organisedBy: cols[17] || '',
    });
  }

  // Extract non-empty postcodes and bulk geocode coordinates
  const validPostcodes = events
    .map((e) => e.postcode?.trim())
    .filter(Boolean);

  const postcodeMap = await geocodePostcodes(validPostcodes);

  return events.map((ev) => {
    const key = ev.postcode ? ev.postcode.replace(/\s+/g, '').toUpperCase() : '';
    return {
      ...ev,
      lat: postcodeMap[key]?.lat || null,
      lon: postcodeMap[key]?.lon || null,
    };
  });
}