import Storage from '../../src/app/storage';

// A representative Open-Meteo forecast response shape (see
// https://open-meteo.com/en/docs), trimmed to the fields storage.js reads.
// Hourly/daily timestamps are set far in the future so `.buildData`'s
// "next hours from now" filter behaves deterministically in tests.
const mockWeather = {
  latitude: 52.52,
  longitude: 13.41,
  current: {
    temperature_2m: 21.4,
    relative_humidity_2m: 55,
    apparent_temperature: 20.1,
    is_day: 1,
    weather_code: 2,
    cloud_cover: 40,
    wind_speed_10m: 12.3,
  },
  hourly: {
    time: [
      '2126-01-01T00:00',
      '2126-01-01T01:00',
      '2126-01-01T02:00',
      '2126-01-01T03:00',
      '2126-01-01T04:00',
      '2126-01-01T05:00',
      '2126-01-01T06:00',
      '2126-01-01T07:00',
    ],
    temperature_2m: [18, 17.6, 17, 16.8, 16.2, 16, 15.9, 16.4],
    weather_code: [2, 2, 3, 3, 61, 61, 0, 0],
    precipitation_probability: [10, 12, 20, 25, 60, 55, 5, 0],
    is_day: [0, 0, 0, 0, 0, 0, 1, 1],
  },
  daily: {
    time: [
      '2125-12-31',
      '2126-01-01',
      '2126-01-02',
      '2126-01-03',
      '2126-01-04',
      '2126-01-05',
      '2126-01-06',
    ],
    weather_code: [1, 2, 3, 61, 71, 0, 95],
    temperature_2m_max: [24, 23, 22, 20, 15, 25, 19],
    temperature_2m_min: [14, 13, 12, 10, 5, 15, 9],
    precipitation_probability_max: [5, 10, 20, 70, 40, 0, 80],
    sunrise: [
      '2125-12-31T06:10',
      '2126-01-01T06:11',
      '2126-01-02T06:12',
      '2126-01-03T06:12',
      '2126-01-04T06:13',
      '2126-01-05T06:14',
      '2126-01-06T06:14',
    ],
    sunset: [
      '2125-12-31T19:50',
      '2126-01-01T19:49',
      '2126-01-02T19:49',
      '2126-01-03T19:48',
      '2126-01-04T19:47',
      '2126-01-05T19:46',
      '2126-01-06T19:45',
    ],
    uv_index_max: [3, 4, 5, 2, 1, 6, 3],
  },
};

describe('Storage', () => {
  describe('constructor', () => {
    it('defines properties', () => {
      const storage = new Storage();

      expect(storage.openMeteo).toBeDefined();
      expect(storage.data).toBeDefined();
      expect(storage.currentDate).toBeDefined();
      expect(['c', 'f']).toContain(storage.data.unit);
    });
  });

  describe('.getLastUpdate', () => {
    it('returns formatted date string', () => {
      const storage = new Storage();
      const result = storage.getLastUpdate(new Date(2018, 11, 24, 10, 33));

      expect(result).toBe('10:33');
    });

    it('returns formatted date string with leading zeros', () => {
      const storage = new Storage();
      const result = storage.getLastUpdate(new Date(2018, 11, 24, 2, 5));

      expect(result).toBe('02:05');
    });
  });

  describe('.cacheIsStale', () => {
    it('is stale when nothing has been cached yet', () => {
      localStorage.clear();

      const storage = new Storage();

      expect(storage.cacheIsStale()).toBe(true);
    });

    it('is not stale right after a fresh update', () => {
      localStorage.clear();
      localStorage.setItem('mw_lastupdate', new Date().toString());

      const storage = new Storage();

      expect(storage.cacheIsStale()).toBe(false);
    });
  });

  describe('.buildData', () => {
    it('maps current conditions, including the new detail fields', () => {
      const storage = new Storage();
      const data = storage.buildData('Berlin, Germany', mockWeather);

      expect(data.currentCondition.location).toBe('Berlin, Germany');
      expect(data.currentCondition.temperature).toBe(21.4);
      expect(data.currentCondition.feelsLike).toBe(20.1);
      expect(data.currentCondition.humidity).toBe(55);
      expect(data.currentCondition.windSpeed).toBe(12);
      expect(data.currentCondition.cloudCover).toBe(40);
      expect(data.currentCondition.weather).toBe('Partly cloudy');
      expect(data.currentCondition.icon).toBe('svg/day/116.png');
      // Today's (index 0 of daily) uv/sunrise/sunset.
      expect(data.currentCondition.uvIndex).toBe(3);
      expect(data.currentCondition.sunrise).toBe('06:10');
      expect(data.currentCondition.sunset).toBe('19:50');
    });

    it('only includes hourly entries after now, up to 6', () => {
      const storage = new Storage();
      const data = storage.buildData('Berlin, Germany', mockWeather);

      // All 8 mock hours are in the far future relative to "now" at test
      // time, so the filter should keep all of them and cap at 6.
      expect(data.foreCastHourly.length).toBe(6);
      expect(data.foreCastHourly[0].time).toBe(0);
      expect(data.foreCastHourly[0].temperature).toBe(18);
      expect(data.foreCastHourly[0].rainProbability).toBe(10);
    });

    it('skips today and returns the next 5 days', () => {
      const storage = new Storage();
      const data = storage.buildData('Berlin, Germany', mockWeather);

      expect(data.foreCastDaily.length).toBe(5);
      // daily.time[1] is 2126-01-01, a Thursday.
      expect(data.foreCastDaily[0].temperature).toEqual({ max: 23, min: 13 });
      expect(data.foreCastDaily[0].rainProbability).toBe(10);
    });
  });

  describe('.toggleUnit', () => {
    it('flips between celsius and fahrenheit and persists the choice', () => {
      localStorage.clear();

      const storage = new Storage();
      const first = storage.data.unit;
      const toggled = storage.toggleUnit();

      expect(toggled).not.toBe(first);
      expect(storage.data.unit).toBe(toggled);
      expect(localStorage.getItem('mw_unit')).toBe(toggled);
    });
  });
});
