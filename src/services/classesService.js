// src/services/classesService.js

async function getClassesCsvContent(csvUrl, masjidId = 'default') {
  const cacheKey = `cached_classes_csv_${masjidId}`;

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

  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(cacheKey);
    if (cached) return cached;
  }

  return '';
}

export async function loadClassesFromCSV(csvUrl, masjidId) {
  const csvContent = await getClassesCsvContent(csvUrl, masjidId);
  if (!csvContent) return [];

  const lines = csvContent.replace(/^\uFEFF/, '').trim().split(/\r?\n/);
  const classes = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const cols = line.split(',').map((val) => val.trim());
    const rowDate = cols[1] || undefined;

    let dayOfWeek = parseInt(cols[2], 10);
    if (isNaN(dayOfWeek) && rowDate) {
      dayOfWeek = new Date(rowDate).getDay();
    }

    const rawAvailability = cols[8]?.toLowerCase();
    let availability = null;
    if (rawAvailability === 'space available' || rawAvailability === 'no space') {
      availability = rawAvailability;
    }

    classes.push({
      id: cols[0] || String(i),
      date: rowDate,
      dayOfWeek: isNaN(dayOfWeek) ? 0 : dayOfWeek,
      title: cols[3] || '',
      time: cols[4] || '',
      instructor: cols[5] || '',
      location: cols[6] || '',
      categories: cols[7] ? cols[7].split(';').map((c) => c.trim()) : [],
      availability,
    });
  }

  return classes;
}