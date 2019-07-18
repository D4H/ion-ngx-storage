import {
  Action,
  ActionReducer,
  ActionReducerMap,
  MemoizedSelector,
  createFeatureSelector,
  createReducer,
  createSelector,
  on
} from '@ngrx/store';

import { InjectionToken } from '@angular/core';
import { ReadSuccess } from './storage.actions';

/**
 * Storage State and Reducer
 * ===========================================================================
 */

export interface StorageState {
  hydrated: boolean;
}

export const initialState: StorageState = {
  hydrated: false
};

export function reducer(state: StorageState, action: Action): StorageState {
  return createReducer(
    initialState,
    on(ReadSuccess, (): StorageState => ({ hydrated: true }))
  )(state, action);
}

export const STORAGE_REDUCER = 'ion_ngx_storage';

/**
 * Storage Selectors
 * ===========================================================================
 */

export const selectStorageState: MemoizedSelector<any, StorageState>
  = createFeatureSelector<StorageState>(
    STORAGE_REDUCER
  );

export const selectHydratedStatus: MemoizedSelector<StorageState, boolean>
  = createSelector(
    selectStorageState,
    (state: StorageState): boolean => state.hydrated
  );
