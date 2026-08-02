// Location lookups -- all free, keyless services.
//
// - searchLocation: Open-Meteo Geocoding API (https://open-meteo.com/en/docs/geocoding-api)
//   for the manual "search a city" box.
// - reverseGeocode: BigDataCloud's free client-side reverse geocoding endpoint,
//   used to turn GPS coordinates into a place name (Open-Meteo has no reverse
//   geocoding endpoint of its own).
// - locateByIP: ipapi.co, used once on first load to guess the user's
//   location without prompting for GPS permission.

const GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const REVERSE_GEOCODE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';
const IP_LOCATE_URL = 'https://ipapi.co/json/';

function formatPlaceName({ city, locality, principalSubdivision, countryName }) {
  return [city || locality, principalSubdivision, countryName].filter(Boolean).join(', ');
}

export async function searchLocation(query) {
  const params = new URLSearchParams({ name: query, count: 5, language: 'en', format: 'json' });
  const response = await fetch(`${GEOCODE_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Location search failed with status ${response.status}`);
  }

  const result = await response.json();
  const matches = result.results || [];

  return matches.map((match) => ({
    name: [match.name, match.admin1, match.country].filter(Boolean).join(', '),
    latitude: match.latitude,
    longitude: match.longitude,
  }));
}

export async function reverseGeocode(latitude, longitude) {
  const params = new URLSearchParams({ latitude, longitude, localityLanguage: 'en' });
  const response = await fetch(`${REVERSE_GEOCODE_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Reverse geocoding failed with status ${response.status}`);
  }

  const result = await response.json();

  return formatPlaceName(result);
}

export async function locateByIP() {
  const response = await fetch(IP_LOCATE_URL);

  if (!response.ok) {
    throw new Error(`IP location failed with status ${response.status}`);
  }

  const result = await response.json();

  if (result.error || !result.latitude || !result.longitude) {
    throw new Error('IP location did not return usable coordinates');
  }

  return {
    latitude: result.latitude,
    longitude: result.longitude,
    name: [result.city, result.region, result.country_name].filter(Boolean).join(', '),
  };
}
