import { Action, ActionReducer } from '@ngrx/store';
import { META_REDUCERS } from '@ngrx/store';
import { Provider } from '@angular/core';

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

export const STORAGE_META_REDUCER: Provider = {
  provide: META_REDUCERS,
  useFactory: () => storageMetaReducer,
  multi: true
};
