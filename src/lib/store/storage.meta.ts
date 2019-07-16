import { Action, ActionReducer, MetaReducer } from '@ngrx/store';
import { META_REDUCERS } from '@ngrx/store';
import { Provider } from '@angular/core';
import { Storage } from '@ionic/storage';

import { ActionTypes } from './storage.actions';
import { IonNgxModuleConfig, MODULE_CONFIG } from '../providers';

/**
 * Storage Hydration Meta Reducer
 * =============================================================================
 * Merge the payload into the state on successful hydration from device or
 * browser storage.
 *
 *  1. On a successful read (HYDRATION_SUCCESS) from the state merge the payload
 *  into the state.
 *  2. Apply the reducer to get the new state.
 *  3. If the state is flagged as hydrated, write the new state to the store.
 *  This last is _vital_ to avoid the broadcast of the application's initial
 *  state from writing null/undefined to the store, before stored data can be
 *  read back.
 */

export function provideMetaReducer<T extends object>(
  config: IonNgxModuleConfig,
  storage: Storage
): (reducer: ActionReducer<T>) => (state: T, action: Action) => T {
  return (reducer: ActionReducer<T>) => {
    return (state: T, action: Action): T => {
      const mergedState: T = config.transform.read(mergeReadState(state, action));
      const newState: T = reducer(mergedState, action);

      if (newState[config.reducer] && newState[config.reducer].hydrated) {
        const pickedState: Partial<T> = pickState(state, config.states);
        storage.set(config.name, config.transform.write(pickedState));
      }

      return newState;
    };
  };
}

/**
 * TESTED
 *
 * Provide Meta Reducer
 * =============================================================================
 */

export const STORAGE_META_REDUCER: Provider = {
  provide: META_REDUCERS,
  deps: [MODULE_CONFIG, Storage],
  useFactory: provideMetaReducer,
  multi: true
};

/**
 * TESTED
 *
 * Merge State from Hydration
 * =============================================================================
 */

export function mergeReadState<T extends object>(
  state: T,
  action: Action
): T {
  if (action.type === ActionTypes.HYDRATION_SUCCESS) {
    return { ...state, ...(action as Action & { state: object }).state } as T;
  } else {
    return state;
  }
}

/**
 * TESTED
 *
 * Pick from Store for Dehydration
 * =============================================================================
 * Return state as-is when no keys are given.
 */

export function pickState<T extends object>(
  state: T,
  keys: Array<string> = []
): Partial<T> {
  if (keys && keys.length) {
    return keys.reduce(
      (acc: Partial<T>, key: string): Partial<T> => ({ ...acc, [key]: state[key] }),
      {} as Partial<T>
    );
  } else {
    return state;
  }
}
