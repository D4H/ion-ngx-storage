import { defaultConfig, STORAGE_REDUCER_KEY } from '../../lib/providers';

describe('Module Provider', () => {
  describe('defaultConfig', () => {
    it('should equal comparison configuration', () => {
      const comparisonConfig = {
        features: [],
        name: STORAGE_REDUCER_KEY,

        storage: {
          name: STORAGE_REDUCER_KEY
        }
      };

      expect(JSON.stringify(defaultConfig))
        .toEqual(JSON.stringify(comparisonConfig));
    });
  });
});
