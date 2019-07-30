import faker from 'faker';
import { Action } from '@ngrx/store';

import {
  ActionTypes,
  STORAGE_REDUCER,
  initialState,
  reducer,
  selectHydratedStatus,
  selectStorageState
} from '../../lib/store';

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

  describe('STORAGE_REDUCER', () => {
    it('should equal the comparison value', () => {
      expect(STORAGE_REDUCER).toEqual('ion_ngx_storage');
    });
  });
});

describe('Storage Selectors', () => {
  let state;

  beforeEach(() => {
    state = {
      [STORAGE_REDUCER]: initialState,

      [faker.random.uuid()]: {
        [faker.random.uuid()]: faker.random.uuid()
      },

      [faker.random.uuid()]: {
        [faker.random.uuid()]: faker.random.uuid()
      }
    };
  });

  describe('selectStorageState', () => {
    it('should return the feature state', () => {
      expect(selectStorageState(state)).toEqual(initialState);
    });
  });

  describe('selectHydratedStatus', () => {
    it('should return hydrated status', () => {
      expect(selectHydratedStatus(state)).toBe(initialState.hydrated);
    });
  });
});
