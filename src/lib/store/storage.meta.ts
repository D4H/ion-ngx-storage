import { Action, ActionReducer, MetaReducer } from '@ngrx/store';
import { Storage } from '@ionic/storage';

import { ActionTypes } from './storage.actions';
import { StorageModuleConfig } from '../providers';
import { pickState } from '../tools';

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

export function storageReducerFactory(
  config: StorageModuleConfig,
  storage: Storage
): (reducer: ActionReducer<any>) => (state: any, action: Action) => any {
  return (reducer: ActionReducer<any>) => {
    return (state: any, action: Action) => {
      const newState = (action.type === ActionTypes.HYDRATION_SUCCESS)
        ? reducer({ ...state, ...(action as Action & { state: object }).state }, action)
        : reducer(state, action);

      if (newState && newState.storage && newState.storage.hydrated) {
        storage.set(config.key, pickState(newState, config));
      }

      return newState;
    };
  };
}

/**
 * Storage Provider Factory
 * =============================================================================
 * Kept separate from the above for sanity, clarity and ease of testing.
 */

export function provideMetaReducer(
  config: StorageModuleConfig,
  storage: Storage
): Array<MetaReducer<any>> {
  return [
    storageReducerFactory(config, storage)
  ];
}