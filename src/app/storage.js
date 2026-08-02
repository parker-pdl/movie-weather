import OpenMeteo from '../api/openMeteo';
import { searchLocation, reverseGeocode, locateByIP } from '../api/geocoding';
import { wmoDescription, iconPath } from '../helpers/wmoIcons';
import { hourOf, hhmmOf, weekdayOf, toDate } from '../helpers/localTime';
import { addLeadingZero } from '../helpers/time';
import weekdays from '../helpers/weekdays';
import initialState from '../initialState';

const CACHE_KEY = 'mw_weather';
const LOCATION_KEY = 'mw_location';
const LAST_UPDATE_KEY = 'mw_lastupdate';
const UNIT_KEY = 'mw_unit';

export default class Storage {
  constructor() {
    this.openMeteo = new OpenMeteo();
    this.data = { ...initialState, unit: localStorage.getItem(UNIT_KEY) || 'c' };
    this.currentDate = new Date();
  }

  getLastUpdate(currentDate) {
    return `${addLeadingZero(currentDate.getHours())}:${addLeadingZero(currentDate.getMinutes())}`;
  }

  cacheIsStale() {
    this.currentDate = new Date();
    const prevDate = localStorage.getItem(LAST_UPDATE_KEY);

    if (!prevDate) {
      return true;
    }

    const ms = this.currentDate - new Date(prevDate);
    const min = Math.floor((ms / 1000 / 60) << 0);
    const sec = Math.floor((ms / 1000) % 60);

    return (min > 58 && sec > 0);
  }

  buildData(locationName, weather) {
    const { current, hourly, daily } = weather;
    const now = new Date();

    const nextHours = hourly.time
      .map((time, index) => ({
        time,
        temperature: hourly.temperature_2m[index],
        rainProbability: hourly.precipitation_probability[index],
        isDay: hourly.is_day[index],
        weatherCode: hourly.weather_code[index],
      }))
      .filter((item) => toDate(item.time) > now);

    const upcomingDays = daily.time
      .map((date, index) => ({
        date,
        max: daily.temperature_2m_max[index],
        min: daily.temperature_2m_min[index],
        rainProbability: daily.precipitation_probability_max[index],
        weatherCode: daily.weather_code[index],
      }))
      .slice(1, 6);

    return {
      latitude: weather.latitude,
      longitude: weather.longitude,
      lastUpdate: this.getLastUpdate(this.currentDate),
      unit: this.data.unit,
      currentCondition: {
        location: locationName,
        date: now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        temperature: current.temperature_2m,
        feelsLike: current.apparent_temperature,
        weather: wmoDescription(current.weather_code),
        icon: iconPath(current.weather_code, current.is_day),
        humidity: Math.round(current.relative_humidity_2m),
        windSpeed: Math.round(current.wind_speed_10m),
        cloudCover: Math.round(current.cloud_cover),
        uvIndex: Math.round(daily.uv_index_max[0]),
        sunrise: hhmmOf(daily.sunrise[0]),
        sunset: hhmmOf(daily.sunset[0]),
      },
      foreCastHourly: nextHours.slice(0, 6).map((item) => ({
        time: hourOf(item.time),
        rainProbability: item.rainProbability,
        temperature: Math.round(item.temperature),
        icon: iconPath(item.weatherCode, item.isDay),
      })),
      foreCastDaily: upcomingDays.map((item) => ({
        weekDay: weekdays(weekdayOf(item.date)),
        rainProbability: item.rainProbability,
        icon: iconPath(item.weatherCode, true),
        temperature: {
          max: Math.round(item.max),
          min: Math.round(item.min),
        },
      })),
    };
  }

  async fetchWeatherFor(latitude, longitude, locationName) {
    const weather = await this.openMeteo.fetch(latitude, longitude);

    weather.latitude = latitude;
    weather.longitude = longitude;

    this.data = this.buildData(locationName, weather);

    localStorage.setItem(CACHE_KEY, JSON.stringify(this.data));
    localStorage.setItem(LOCATION_KEY, JSON.stringify({ latitude, longitude, name: locationName }));
    localStorage.setItem(LAST_UPDATE_KEY, this.currentDate.toString());
  }

  // Initial load: prefer a fresh cache, otherwise fall back to IP-based
  // location so the app has something to show without prompting for GPS
  // permission right away.
  async fetch() {
    if (!this.cacheIsStale() && localStorage.getItem(CACHE_KEY)) {
      this.data = { ...JSON.parse(localStorage.getItem(CACHE_KEY)), unit: this.data.unit };

      return;
    }

    try {
      const location = await locateByIP();

      await this.fetchWeatherFor(location.latitude, location.longitude, location.name);
    } catch (error) {
      this.data = { ...this.data, error: error.message };
    }
  }

  // Used by the GPS button -- only coordinates are known, so the place name
  // has to come from a reverse-geocode lookup.
  async getCurrentPosition(latitude, longitude) {
    try {
      const name = await reverseGeocode(latitude, longitude);

      await this.fetchWeatherFor(latitude, longitude, name);
    } catch (error) {
      this.data = { ...this.data, error: error.message };
    }
  }

  // Used by manual search -- name is already known from the geocoding result.
  async search(query) {
    const matches = await searchLocation(query);
    const first = matches[0];

    if (!first) {
      throw new Error(`No location found for "${query}"`);
    }

    await this.fetchWeatherFor(first.latitude, first.longitude, first.name);

    return first;
  }

  async refresh() {
    const { latitude, longitude, name } = JSON.parse(localStorage.getItem(LOCATION_KEY) || '{}');

    if (latitude && longitude) {
      await this.fetchWeatherFor(latitude, longitude, name);
    }
  }

  toggleUnit() {
    const unit = this.data.unit === 'c' ? 'f' : 'c';

    this.data = { ...this.data, unit };
    localStorage.setItem(UNIT_KEY, unit);

    return unit;
  }
}
