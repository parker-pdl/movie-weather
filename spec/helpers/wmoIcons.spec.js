import { wmoIconCode, wmoDescription, iconPath } from '../../src/helpers/wmoIcons';

describe('wmoIcons', () => {
  describe('.wmoIconCode', () => {
    it('maps known WMO codes to the self-hosted icon set', () => {
      expect(wmoIconCode(0)).toBe(113);
      expect(wmoIconCode(3)).toBe(122);
      expect(wmoIconCode(61)).toBe(296);
      expect(wmoIconCode(95)).toBe(200);
    });

    it('falls back to a sensible default for unknown codes', () => {
      expect(wmoIconCode(999)).toBe(119);
    });
  });

  describe('.wmoDescription', () => {
    it('returns human-readable text for known codes', () => {
      expect(wmoDescription(0)).toBe('Clear sky');
      expect(wmoDescription(61)).toBe('Light rain');
    });
  });

  describe('.iconPath', () => {
    it('builds a day path when isDay is truthy', () => {
      expect(iconPath(0, 1)).toBe('svg/day/113.png');
    });

    it('builds a night path when isDay is falsy', () => {
      expect(iconPath(0, 0)).toBe('svg/night/113.png');
    });
  });
});
