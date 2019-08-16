import faker from 'faker';
import { Action } from '@ngrx/store';

import {
  ActionTypes,
  getHydrated,
  getStorageState,
  initialState,
  reducer
} from '../../lib/store';

import { STORAGE_FEATURE_KEY } from '../../lib/providers';

describe('Storage Reducer', () => {
  describe('reducer', () => {
    it('should return the previous state with any action', () => {
      expect(reducer(initialState, { type: faker.random.uuid() }))
        .toBe(initialState);
    });

    describe('Clear', () => {
      it('should not change state with Clear', () => {
        expect(reducer(initialState, { type: ActionTypes.CLEAR }))
          .toEqual(initialState);
      });
    });

    describe('Read', () => {
      it('should not change state with Read', () => {
        expect(reducer(initialState, { type: ActionTypes.READ }))
          .toEqual(initialState);
      });
    });

    describe('ReadError', () => {
      it('should change not change state with ReadError', () => {
        expect(reducer(initialState, { type: ActionTypes.READ_ERROR }))
          .toEqual(initialState);
      });
    });

    describe('ReadResult', () => {
      it('should change hydrated state with ReadResult', () => {
        expect(reducer(initialState, { type: ActionTypes.READ_RESULT }))
          .toEqual({ hydrated: true });
      });
    });

    describe('ReadSuccess', () => {
      it('should not change state with ReadSuccess', () => {
        expect(reducer(initialState, { type: ActionTypes.READ_SUCCESS }))
          .toEqual(initialState);
      });
    });

    describe('WriteError', () => {
      it('should not change state with WriteError', () => {
        expect(reducer(initialState, { type: ActionTypes.WRITE_ERROR }))
          .toEqual(initialState);
      });
    });

    describe('WriteSuccess', () => {
      it('should not change state with WriteSuccess', () => {
        expect(reducer(initialState, { type: ActionTypes.WRITE_SUCCESS }))
          .toEqual(initialState);
      });
    });
  });

  describe('initialState', () => {
    it('should equal the comparison value', () => {
      expect(initialState).toEqual({ hydrated: false });
    });
  });

  describe('STORAGE_FEATURE_KEY', () => {
    it('should equal the comparison value', () => {
      expect(STORAGE_FEATURE_KEY).toEqual('ion_ngx_storage');
    });
  });
});

describe('Storage Selectors', () => {
  let state;

  beforeEach(() => {
    state = {
      [STORAGE_FEATURE_KEY]: initialState,

      [faker.random.uuid()]: {
        [faker.random.uuid()]: faker.random.uuid()
      },

      [faker.random.uuid()]: {
        [faker.random.uuid()]: faker.random.uuid()
      }
    };
  });

  describe('getStorageState', () => {
    it('should return the feature state', () => {
      expect(getStorageState(state)).toEqual(initialState);
    });
  });

  describe('getHydrated', () => {
    it('should return hydrated status', () => {
      expect(getHydrated(state)).toBe(initialState.hydrated);
    });
  });
});
