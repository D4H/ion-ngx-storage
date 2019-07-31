import { defaultConfig, STORAGE_REDUCER } from '../../lib/providers';

describe('Module Provider', () => {
  describe('defaultConfig', () => {
    it('should equal comparison configuration', () => {
      const comparisonConfig = {
        features: [],
        name: STORAGE_REDUCER,

        storage: {
          name: STORAGE_REDUCER
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
