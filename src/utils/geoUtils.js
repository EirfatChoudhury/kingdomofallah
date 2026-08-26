// src/utils/geoUtils.js

// Haversine formula to compute distance in miles between two coordinates
export function getDistanceFromLatLonInMiles(lat1, lon1, lat2, lon2) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return Infinity;

  const R = 3958.8; // Earth radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Bulk geocode a list of UK postcodes (handles chunking for Postcodes.io 100-item limit)
export async function geocodePostcodes(postcodes) {
  const unique = Array.from(
    new Set(postcodes.map((p) => p?.trim()).filter(Boolean))
  );
  if (!unique.length) return {};

  const CHUNK_SIZE = 100;
  const map = {};

  for (let i = 0; i < unique.length; i += CHUNK_SIZE) {
    const chunk = unique.slice(i, i + CHUNK_SIZE);
    try {
      const res = await fetch('https://api.postcodes.io/postcodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postcodes: chunk }),
      });
      const data = await res.json();
      if (data.status === 200 && Array.isArray(data.result)) {
        data.result.forEach((item) => {
          if (item?.result) {
            map[item.query.replace(/\s+/g, '').toUpperCase()] = {
              lat: item.result.latitude,
              lon: item.result.longitude,
            };
          }
        });
      }
    } catch {
      // Continue processing other chunks if one fails
    }
  }

  return map;
}

// Lookup a single user-entered UK postcode
export async function lookupPostcode(postcode) {
  if (!postcode?.trim()) return null;

  try {
    const clean = encodeURIComponent(postcode.trim().replace(/\s+/g, ''));
    const res = await fetch(`https://api.postcodes.io/postcodes/${clean}`);
    const data = await res.json();
    if (data.status === 200 && data.result) {
      return {
        lat: data.result.latitude,
        lon: data.result.longitude,
        name: data.result.postcode,
      };
    }
    return null;
  } catch {
    return null;
  }
}