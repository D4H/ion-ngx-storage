import { Action, ActionReducer } from '@ngrx/store';

import { ReadResult } from './storage.actions';

/**
 * Storage Read Meta Reducer
 * =============================================================================
 * Merge the payload into the state on successful hydration from device or
 * browser storage.
 */

export function storageMetaReducer<T>(
  reducer: ActionReducer<T>
): ActionReducer<T> {
  return (state: T, action: Action & { value: object }): T => {
    if (action.type === ReadResult.type) {
      return reducer({ ...state, ...action.value }, action);
    } else {
      return reducer(state, action);
    }
  };
}
