// tslint:disable no-shadowed-variable

import {
  Action,
  ActionReducerMap,
  createReducer,
  createSelector,
  createFeatureSelector,
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
 * Wrapped in a factory function per bug in NgRX while registering a single
 * reducer with StoreModule.forFeature.
 *
 * @see https://github.com/ngrx/platform/issues/1915
 */

export const initialState: StorageState = {
  hydrated: false
};

export function reducer(state: StorageState | undefined, action: Action) {
  return createReducer(
    initialState,
    on(HydrationSuccess, (state: StorageState) => ({ hydrated: true }))
  )(state, action);
}

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
