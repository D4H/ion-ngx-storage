import {
  Action,
  MemoizedSelector,
  createFeatureSelector,
  createReducer,
  createSelector,
  on
} from '@ngrx/store';

import { InjectionToken } from '@angular/core';
import { ReadResult } from './storage.actions';
import { STORAGE_REDUCER } from '../providers';

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
    on(ReadResult, (): StorageState => ({ hydrated: true }))
  )(state, action);
}

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
