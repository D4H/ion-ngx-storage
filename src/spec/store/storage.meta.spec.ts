// tslint:disable no-shadowed-variable

import faker from 'faker';
import { Action, META_REDUCERS } from '@ngrx/store';
import { Storage } from '@ionic/storage';
import { fromPairs, sampleSize, times } from 'lodash';

import {
  IonNgxConfig,
  MODULE_CONFIG,
  defaultConfig
} from '../../lib/providers';

import {
  ActionTypes,
  STORAGE_META_REDUCER,
  provideMetaReducer
} from '../../lib/store';

describe('Meta Reducer', () => {
  describe('STORAGE_META_REDUCER', () => {
    it('should equal the comparison provider', () => {
      const comparisonProvider = {
        provide: META_REDUCERS,
        deps: [MODULE_CONFIG, Storage],
        useFactory: provideMetaReducer,
        multi: true
      };

      expect(JSON.stringify(STORAGE_META_REDUCER))
        .toEqual(JSON.stringify(comparisonProvider));
    });
  });

  describe('provideMetaReducer', () => {
    const reducer = (state, action) => state; // NOOP for sake of tests.

    let action: { type: string, state: object };
    let config: IonNgxConfig;
    let metaReducer: (state: object, action: Action) => object;
    let state: object;
    let storage: Storage;

    beforeEach(() => {
      config = defaultConfig;
      action = { type: faker.random.uuid(), state: {} };
      storage = new Storage(config.storage);
      metaReducer = provideMetaReducer(config, storage)(reducer);

      state = {
        [config.reducer]: {
          hydrated: false
        },

        [faker.random.uuid()]: {
          [faker.random.uuid()]: faker.random.uuid()
        }
      };
    });

    afterEach(() => {
      storage.clear();
    });

    it('should be a factory function returning appropriate functions', () => {
      expect(typeof provideMetaReducer).toBe('function');
      expect(provideMetaReducer.length).toBe(2);

      expect(typeof provideMetaReducer(config, storage)).toBe('function');
      expect(provideMetaReducer(config, storage).length).toBe(1);

      metaReducer = provideMetaReducer(config, storage)(reducer);
      expect(typeof metaReducer).toBe('function');
      expect(metaReducer.length).toBe(2);
    });

    it('should write to storage', (done) => {
      storage.set(config.name, { goth: 'huggles' }).then((res) => {
        expect('blah').toEqual('blah');
        expect(res).toEqual({ goth: 'huggles' });

        storage.keys().then(keys => {
          expect(keys.includes(config.name)).toBe(true);
        });

        done();
      });
    });

    // FIXME: Test doesn't work. Need to spy and wait for async to finish. How?
    xit('should not write to storage when hydration: false', (done) => {
      metaReducer(state, action);

      storage.keys().then(keys => {
        expect(keys.length).toBe(0);
        done();
      });
    });
  });
});
