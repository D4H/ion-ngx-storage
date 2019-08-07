import { defaultConfig, STORAGE_FEATURE_KEY } from '../../lib/providers';

describe('Module Provider', () => {
  describe('defaultConfig', () => {
    it('should equal comparison configuration', () => {
      const comparisonConfig = {
        features: [],
        name: STORAGE_FEATURE_KEY,

        storage: {
          name: STORAGE_FEATURE_KEY
        },

        transform: {
          read: state => state,
          write: state => state
        }
      };

      expect(JSON.stringify(defaultConfig))
        .toEqual(JSON.stringify(comparisonConfig));
    });
  });
});
