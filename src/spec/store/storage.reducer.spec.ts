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
    let action: { type: string, value?: any };

    beforeEach(() => {
      action = { type: faker.random.uuid() };
    });

    it('should return the previous state with any action', () => {
      expect(reducer(initialState, action)).toBe(initialState);
    });

    describe('HydrateSuccess', () => {
      it('should not change state with HydrateSuccess', () => {
        action = { type: ActionTypes.HYDRATE_SUCCESS };
        expect(reducer(initialState, action)).toEqual(initialState);
      });
    });

    describe('Clear', () => {
      it('should not change state with Clear', () => {
        action = { type: ActionTypes.CLEAR };
        expect(reducer(initialState, action)).toEqual(initialState);
      });
    });

    describe('Read', () => {
      it('should not change state with Read', () => {
        action = { type: ActionTypes.READ };
        expect(reducer(initialState, action)).toEqual(initialState);
      });
    });

    describe('ReadError', () => {
      it('should change not change state with ReadError', () => {
        action = { type: ActionTypes.READ_ERROR };
        expect(reducer(initialState, action)).toEqual(initialState);
      });
    });

    describe('ReadSuccess', () => {
      it('should change hydrated state with ReadSuccess', () => {
        action = { type: ActionTypes.READ_SUCCESS };
        expect(reducer(initialState, action)).toEqual({ hydrated: true });
      });
    });

    describe('Write', () => {
      it('should not change state with Write', () => {
        action = { type: ActionTypes.WRITE };
        expect(reducer(initialState, action)).toEqual(initialState);
      });
    });

    describe('WriteError', () => {
      it('should not change state with WriteError', () => {
        action = { type: ActionTypes.WRITE_ERROR };
        expect(reducer(initialState, action)).toEqual(initialState);
      });
    });

    describe('WriteSuccess', () => {
      it('should not change state with WriteSuccess', () => {
        action = { type: ActionTypes.WRITE_SUCCESS };
        expect(reducer(initialState, action)).toEqual(initialState);
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
