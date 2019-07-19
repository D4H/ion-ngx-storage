import { defaultConfig } from '../../lib/providers';

describe('Module Provider', () => {
  describe('defaultConfig', () => {
    it('should equal comparison configuration', () => {
      const comparisonConfig = {
        features: [],
        name: 'ION_NGX_STORAGE',

        storage: {
          name: 'ion_ngx_storage'
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
