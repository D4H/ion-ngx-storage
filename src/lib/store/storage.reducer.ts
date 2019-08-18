import {
  Action,
  ActionReducer,
  MemoizedSelector,
  createFeatureSelector,
  createReducer,
  createSelector,
  on
} from '@ngrx/store';

import { InjectionToken } from '@angular/core';
import { ReadResult } from './storage.actions';
import { STORAGE_REDUCER_KEY } from '../providers';

/**
 * Storage State and Reducer
 * ===========================================================================
 */

export interface State {
  hydrated: boolean;
}

export interface StorageState {
  [STORAGE_REDUCER_KEY]: State;
}

export const initialState: State = {
  hydrated: false
};

export const storageReducer: ActionReducer<State, Action>
  = createReducer(
    initialState,
    on(ReadResult, (): State => ({ hydrated: true }))
  );

export function reducer(state: State, action: Action): State {
  return storageReducer(state, action);
}

/**
 * Storage Selectors
 * ===========================================================================
 */

export const getStorageState: MemoizedSelector<StorageState, State>
  = createFeatureSelector<State>(
    STORAGE_REDUCER_KEY
  );

export const getHydrated: MemoizedSelector<StorageState, boolean>
  = createSelector(
    getStorageState,
    (state: State): boolean => state.hydrated
  );
