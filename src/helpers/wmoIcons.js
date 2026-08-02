// Maps Open-Meteo's WMO weather codes (https://open-meteo.com/en/docs#weathervariables)
// to this app's existing self-hosted icon set in public/svg/day and
// public/svg/night (the same numbering originally used for WeatherAPI.com
// condition codes -- kept as-is so no new icon assets are needed).

const WMO = {
  0: { icon: 113, text: 'Clear sky' },
  1: { icon: 116, text: 'Mainly clear' },
  2: { icon: 116, text: 'Partly cloudy' },
  3: { icon: 122, text: 'Overcast' },
  45: { icon: 248, text: 'Fog' },
  48: { icon: 260, text: 'Freezing fog' },
  51: { icon: 263, text: 'Light drizzle' },
  53: { icon: 266, text: 'Drizzle' },
  55: { icon: 284, text: 'Heavy drizzle' },
  56: { icon: 281, text: 'Freezing drizzle' },
  57: { icon: 284, text: 'Heavy freezing drizzle' },
  61: { icon: 296, text: 'Light rain' },
  63: { icon: 302, text: 'Rain' },
  65: { icon: 308, text: 'Heavy rain' },
  66: { icon: 311, text: 'Freezing rain' },
  67: { icon: 314, text: 'Heavy freezing rain' },
  71: { icon: 326, text: 'Light snow' },
  73: { icon: 332, text: 'Snow' },
  75: { icon: 338, text: 'Heavy snow' },
  77: { icon: 350, text: 'Snow grains' },
  80: { icon: 353, text: 'Light rain showers' },
  81: { icon: 356, text: 'Rain showers' },
  82: { icon: 359, text: 'Heavy rain showers' },
  85: { icon: 368, text: 'Light snow showers' },
  86: { icon: 371, text: 'Snow showers' },
  95: { icon: 200, text: 'Thunderstorm' },
  96: { icon: 200, text: 'Thunderstorm with hail' },
  99: { icon: 200, text: 'Severe thunderstorm with hail' },
};

const FALLBACK = { icon: 119, text: 'Cloudy' };

export function wmoIconCode(code) {
  return (WMO[code] || FALLBACK).icon;
}

export function wmoDescription(code) {
  return (WMO[code] || FALLBACK).text;
}

export function iconPath(code, isDay) {
  return `svg/${isDay ? 'day' : 'night'}/${wmoIconCode(code)}.png`;
}

export default wmoIconCode;
