// tslint:disable no-shadowed-variable

import { InjectionToken } from '@angular/core';

import {
  Action,
  ActionReducerMap,
  createFeatureSelector,
  createReducer,
  createSelector,
  on
} from '@ngrx/store';

import { HydrationSuccess } from './storage.actions';

/**
 * Storage State
 * ===========================================================================
 */

export interface StorageState {
  hydrated: boolean;
}

export interface State {
  storage: StorageState;
}

/**
 * Storage Reducer
 * ===========================================================================
 * Wrapped in a provider object per bug in NgRX while registering a single
 * reducer with StoreModule.forFeature.
 *
 * @see https://github.com/ngrx/platform/issues/1915
 * @see https://ngrx.io/guide/store/recipes/injecting#injecting-reducers
 */

export const initialState: StorageState = {
  hydrated: false
};

export const reducer = createReducer(
  initialState,
  on(HydrationSuccess, (state: StorageState) => ({ hydrated: true }))
);

/**
 * Storage Selectors
 * ===========================================================================
 */

export const selectStorageState = createFeatureSelector<State, StorageState>(
  'storage'
);

export const selectHydrationStatus = createSelector(
  selectStorageState,
  (state: StorageState): boolean => state.hydrated
);
