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

export const storageReducer: ActionReducer<StorageState> = createReducer(
  initialState,
  on(ReadSuccess, (state: StorageState): StorageState => ({
    hydrated: true
  }))
);

/**
 * Storage Selectors
 * ===========================================================================
 */

export const selectStorageState: MemoizedSelector<any, StorageState>
  = createFeatureSelector<StorageState>(
    'storage'
  );

export const selectHydrationStatus: MemoizedSelector<StorageState, boolean>
  = createSelector(
    selectStorageState,
    (state: StorageState): boolean => state.hydrated
  );
