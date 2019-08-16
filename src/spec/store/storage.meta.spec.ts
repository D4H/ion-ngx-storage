// tslint:disable no-shadowed-variable

import faker from 'faker';
import { Action } from '@ngrx/store';

import { ReadResult, storageMetaReducer } from '../../lib/store';

describe('Meta Reducer', () => {
  describe('storageMetaReducer', () => {
    const reducer = (state, action) => state;
    const metaReducer = storageMetaReducer(reducer);

    let action: { type: string, value: object };
    let state: object;

    beforeEach(() => {
      action = {
        type: faker.random.uuid(),

        value: {
          [faker.random.uuid()]: {
            [faker.random.uuid()]: faker.random.uuid()
          }
        }
      };

      state = {
        [faker.random.uuid()]: {
          [faker.random.uuid()]: faker.random.uuid()
        }
      };
    });

    it('should be a compliant meta-reducer', () => {
      expect(typeof storageMetaReducer).toBe('function');
      expect(storageMetaReducer.length).toBe(1);

      expect(typeof metaReducer).toBe('function');
      expect(metaReducer.length).toBe(2);
    });

    it('should not perform any changes with different actions', () => {
      expect(metaReducer(state, action)).toEqual(state);
    });

    it('should merge states when the action is READ_RESULT', () => {
      action = { ...action, type: ReadResult.type };
      expect(metaReducer(state, action)).toEqual({ ...state, ...action.value });

      action = { type: ReadResult.type, value: undefined };
      expect(metaReducer(state, action)).toEqual({ ...state, ...action.value });
    });
  });
});
