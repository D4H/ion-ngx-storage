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

export const reducer: ActionReducer<StorageState> = createReducer(
  initialState,
  on(ReadSuccess, (state: StorageState): StorageState => ({
    hydrated: true
  }))
);

export function storageReducer(state: StorageState, action: Action): StorageState {
  return reducer(state, action);
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

export const selectHydrationStatus: MemoizedSelector<StorageState, boolean>
  = createSelector(
    selectStorageState,
    (state: StorageState): boolean => state.hydrated
  );
