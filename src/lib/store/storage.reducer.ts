import {
  Action,
  ActionReducer,
  MemoizedSelector,
  createFeatureSelector,
  createReducer,
  createSelector,
  on
} from '@ngrx/store';

import { StorageHydrationSuccess } from './storage.actions';

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
  on(StorageHydrationSuccess, (state: StorageState): StorageState => ({
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
