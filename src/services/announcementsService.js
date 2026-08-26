// src/services/announcementsService.js
import { AppConfig } from '@/constants/config';

const CACHE_KEY = 'cached_koa_announcements_csv';

// Multiline RFC 4180 compliant CSV parser
function parseCSV(text) {
  const p = '';
  let row = [''];
  const rows = [row];
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];

    if (c === '"') {
      if (inQuotes && next === '"') {
        row[row.length - 1] += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      row.push('');
    } else if ((c === '\r' || c === '\n') && !inQuotes) {
      if (c === '\r' && next === '\n') {
        i++;
      }
      row = [''];
      rows.push(row);
    } else {
      row[row.length - 1] += c;
    }
  }

  return rows.filter((r) => r.some((cell) => cell.trim() !== ''));
}

async function getAnnouncementsCsvContent() {
  if (AppConfig.announcementsCsvUrl) {
    try {
      const response = await fetch(AppConfig.announcementsCsvUrl);
      if (response.ok) {
        const text = await response.text();
        if (typeof window !== 'undefined') {
          localStorage.setItem(CACHE_KEY, text);
        }
        return text;
      }
    } catch {
      // Fallback to cache on failure
    }
  }

  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) return cached;
  }

  return '';
}

export async function loadAnnouncementsFromCSV() {
  const csvContent = await getAnnouncementsCsvContent();
  if (!csvContent) return [];

  const rawRows = parseCSV(csvContent.replace(/^\uFEFF/, '').trim());
  if (rawRows.length <= 1) return [];

  const now = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(now.getDate() - 30);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  const announcements = [];

  for (let i = 1; i < rawRows.length; i++) {
    const cols = rawRows[i];
    if (!cols || cols.length === 0) continue;

    const rawId = cols[0]?.trim();
    const id = rawId ? `${rawId}-${i}` : `announcement-${i}`;
    const title = cols[1]?.trim() || '';
    const description = cols[2]?.trim() || '';
    const longDescription = cols[3]?.trim() || '';
    const dateStr = cols[4]?.trim() || '';
    const badges = cols[5] ? cols[5].split(';').map((s) => s.trim()).filter(Boolean) : [];
    const imageUrl = cols[6]?.trim() || '';
    const isImportant =
      cols[7]?.trim().toLowerCase() === 'yes' ||
      badges.some((b) => b.toLowerCase() === 'important');

    if (!title) continue;

    // Filter announcements within the last 30 days
    const itemDate = new Date(dateStr);
    const isValidDate = !isNaN(itemDate.getTime());

    if (isValidDate && itemDate < thirtyDaysAgo) {
      continue;
    }

    announcements.push({
      id,
      title,
      description,
      longDescription,
      date: dateStr,
      badges,
      imageUrl,
      isImportant,
      parsedDate: isValidDate ? itemDate : new Date(0),
    });
  }

  // Sort: Important first, then newest date descending
  return announcements.sort((a, b) => {
    if (a.isImportant && !b.isImportant) return -1;
    if (!a.isImportant && b.isImportant) return 1;
    return b.parsedDate - a.parsedDate;
  });
}