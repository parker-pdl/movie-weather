import { celsiusToFahrenheit, displayTemperature } from '../../src/helpers/units';

describe('units', () => {
  describe('.celsiusToFahrenheit', () => {
    it('converts correctly', () => {
      expect(celsiusToFahrenheit(0)).toBe(32);
      expect(celsiusToFahrenheit(100)).toBe(212);
      expect(celsiusToFahrenheit(20)).toBe(68);
    });
  });

  describe('.displayTemperature', () => {
    it('rounds celsius when unit is c', () => {
      expect(displayTemperature(20.4, 'c')).toBe(20);
      expect(displayTemperature(20.6, 'c')).toBe(21);
    });

    it('converts and rounds to fahrenheit when unit is f', () => {
      expect(displayTemperature(20, 'f')).toBe(68);
    });

    it('defaults to celsius when unit is missing', () => {
      expect(displayTemperature(15, undefined)).toBe(15);
    });
  });
});
