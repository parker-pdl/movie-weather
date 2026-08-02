// Weather data client for Open-Meteo (https://open-meteo.com/).
// Free, open, and requires no API key -- this replaces the app's original
// dependency on a private third-party WeatherAPI.com proxy.

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

const CURRENT_FIELDS = [
  'temperature_2m',
  'relative_humidity_2m',
  'apparent_temperature',
  'is_day',
  'weather_code',
  'cloud_cover',
  'wind_speed_10m',
].join(',');

const HOURLY_FIELDS = [
  'temperature_2m',
  'weather_code',
  'precipitation_probability',
  'is_day',
].join(',');

const DAILY_FIELDS = [
  'weather_code',
  'temperature_2m_max',
  'temperature_2m_min',
  'precipitation_probability_max',
  'sunrise',
  'sunset',
  'uv_index_max',
].join(',');

export default class OpenMeteo {
  constructor() {
    this.data = null;
  }

  endpoint(latitude, longitude) {
    const params = new URLSearchParams({
      latitude,
      longitude,
      current: CURRENT_FIELDS,
      hourly: HOURLY_FIELDS,
      daily: DAILY_FIELDS,
      temperature_unit: 'celsius',
      wind_speed_unit: 'kmh',
      timezone: 'auto',
      forecast_days: 7,
    });

    return `${FORECAST_URL}?${params.toString()}`;
  }

  async fetch(latitude, longitude) {
    try {
      const response = await fetch(this.endpoint(latitude, longitude));

      if (!response.ok) {
        throw new Error(`Open-Meteo responded with status ${response.status}`);
      }

      this.data = await response.json();
    } catch (error) {
      throw new Error(`OpenMeteo unable to fetch: ${error.message}`);
    }

    return this.data;
  }
}
