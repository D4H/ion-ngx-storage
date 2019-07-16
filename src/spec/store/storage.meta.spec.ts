// tslint:disable no-shadowed-variable

import faker from 'faker';
import { Action, META_REDUCERS } from '@ngrx/store';
import { Storage } from '@ionic/storage';
import { fromPairs, sampleSize, times } from 'lodash';

import {
  IonNgxModuleConfig,
  MODULE_CONFIG,
  defaultConfig
} from '../../lib/providers';

import {
  ActionTypes,
  STORAGE_META_REDUCER,
  mergeReadState,
  pickState,
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

  describe('mergeReadState', () => {
    let actions: Array<{ type: string, state: object }>;
    let payload: object;
    let state: object;

    beforeEach(() => {
      state = fromPairs(
        times(7, () => [faker.random.uuid(), faker.random.uuid()])
      );

      payload = fromPairs(
        times(9, () => [faker.random.uuid(), faker.random.uuid()])
      );

      actions = times(9, () => ({ type: faker.random.uuid(), state: payload }));
    });

    it('should be a function', () => {
      expect(typeof mergeReadState).toBe('function');
      expect(mergeReadState.length).toBe(2);
    });

    it('should not merge payload when given incorrect actions', () => {
      actions.forEach(action => {
        expect(mergeReadState(state, action)).toEqual(state);
      });
    });

    it('should merge payload when given the correct action', () => {
      const action = { type: ActionTypes.HYDRATION_SUCCESS, state: payload };
      expect(mergeReadState(state, action)).toEqual({ ...state, ...payload });
    });
  });

  describe('pickState', () => {
    let keys: Array<string>;
    let state: object;

    beforeEach(() => {
      state = fromPairs(
        times(15, () => [faker.random.uuid(), faker.random.uuid()])
      );

      keys = sampleSize(
        Object.keys(state),
        faker.random.number({ min: 0, max: 20 })
      );
    });

    it('should be a function', () => {
      expect(typeof pickState).toBe('function');
      expect(pickState.length).toBe(1);
    });

    it('should return an object comprising only picked keys', () => {
      const result = keys.reduce(
        (acc, key) => ({ ...acc, [key]: state[key] }),
        {}
      );

      expect(pickState(state, keys)).toEqual(result);
    });

    it('should return the original object when given no keys', () => {
      expect(pickState(state)).toEqual(state);
      expect(pickState(state, [])).toEqual(state);
    });
  });

  describe('provideMetaReducer', () => {
    const reducer = (state, action) => state; // NOOP for sake of tests.

    let action: { type: string, state: object };
    let config: IonNgxModuleConfig;
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
