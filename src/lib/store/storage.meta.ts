import isIsoDate from 'is-iso-date';
import traverse from 'traverse';
import { Action, ActionReducer, MetaReducer } from '@ngrx/store';
import { META_REDUCERS } from '@ngrx/store';
import { Provider } from '@angular/core';
import { Storage } from '@ionic/storage';

import { ActionTypes } from './storage.actions';
import { MODULE_CONFIG, StorageModuleConfig } from '../providers';

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
  config: StorageModuleConfig,
  storage: Storage
): (reducer: ActionReducer<T>) => (state: T, action: Action) => T {
  return (reducer: ActionReducer<T>) => {
    return (state: T, action: Action): T => {
      const newState = reducer(mergeState(state, action), action);

      if (newState[config.reducer] && newState[config.reducer].hydrated) {
        const pickedState: Partial<T> = pickState(state, config);
        storage.set(config.name, stringify<Partial<T>>(pickedState));
      }

      return newState;
    };
  };
}

/**
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
 * Merge State from Hydration
 * =============================================================================
 * If hydration has successfully merged, convert ISO-formatted strings into dates
 * merge the payload to the current state.
 */

export function mergeState<T extends object>(state: T, action: Action): T {
  if (action.type === ActionTypes.HYDRATION_SUCCESS) {
    return dateify<T>({
      ...state,
      ...(action as Action & { state: object }).state
    });
  } else {
    return state;
  }
}

/**
 * Pick Store States for Dehydration
 * =============================================================================
 * Pick up the selected top-level keys to store. LocalForage throws errors if
 * you attempt to write a moment or date object to the database, so these
 * objects are stringified.
 *
 * @see https://github.com/apollographql/apollo-client/issues/1871
 * @see https://github.com/D4H/decisions-project/issues/2937
 * @see https://stackoverflow.com/a/27585758/1433400
 * @see https://stackoverflow.com/a/56162151/1433400
 */

export function pickState<T extends object>(
  state: T,
  config: StorageModuleConfig
): Partial<T> {
  const keys: Array<string> = config.states;

  if (keys && keys.length) {
    return keys.reduce(
      (acc: Partial<T>, key: string): Partial<T> => ({ ...acc, [key]: state[key] }),
      {} as Partial<T>
    );
  } else {
    return state;
  }
}

/**
 * Transform State for Read/Write
 * =============================================================================
 * It is necessary to stringify Date and Moment objects before write becasue
 * LocalForage throws errors when you attempt to write an object with native
 * functions.
 *
 * @see https://github.com/apollographql/apollo-client/issues/1871
 * @see https://github.com/D4H/decisions-project/issues/2937
 * @see https://stackoverflow.com/a/27585758/1433400
 */

export function stringify<T extends object>(state: T): T {
  return traverse(state).map(function(value: any): void {
    if (isDateLike(value)) {
      this.update(JSON.stringify(value), true);
    }
  });
}

export function dateify<T extends object>(state: T): T {
  return traverse(state).map(function(value: any): void {
    if (isIsoDate(value)) {
      this.update(new Date(value), true);
    }
  });
}

/**
 * Is Object Datelike?
 * =============================================================================
 * Extracted from isMoment() and isDate() in moment.js
 *
 * @see https://github.com/moment/moment/blob/2e2a5b35439665d4b0200143d808a7c26d6cd30f/src/lib/moment/constructor.js#L75-L77
 * @see https://github.com/moment/moment/blob/2e2a5b35439665d4b0200143d808a7c26d6cd30f/src/lib/utils/is-date.js
 */

export function isDateLike(value: any): boolean {
  return value && (
    value._isAMomentObject
    || value instanceof Date
    || Object.prototype.toString.call(value) === '[object Date]'
  );
}
