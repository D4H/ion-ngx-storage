import faker from 'faker';
import { Storage, StorageConfig } from '@ionic/storage';

import {
  STORAGE_REDUCER_KEY,
  defaultConfig,
  provideStorage
} from '../../lib/providers';

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

  describe('provideStorage', () => {
    let storageConfig: StorageConfig;
    let storage: Storage;

    beforeEach(() => {
      storageConfig = { name: faker.random.uuid() };
    });

    it('should be a function', () => {
      expect(typeof provideStorage).toBe('function');
      expect( provideStorage.length).toBe(0);
    });

    it('should return an instance of Storage', () => {
      storage = provideStorage({ storage: storageConfig });
      expect(storage instanceof Storage).toBe(true);
    });
  });
});
