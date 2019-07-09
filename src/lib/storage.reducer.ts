import moment from 'moment';
import traverse from 'traverse';
import { Action, ActionReducer } from '@ngrx/store';
import { Storage } from '@ionic/storage';
import { filter, isObject, pick } from 'lodash';

import { ActionTypes, StorageActions } from './storage.actions';

import { TEMP_config, TEMP_key, TEMP_storedStates } from './storage.config';

export interface State {
  hydrated: boolean;
}

export const initialState: State = {
  hydrated: false
};

export function reducer(
  state: State = initialState,
  action: StorageActions
): State {
  switch (action.type) {
    case ActionTypes.HYDRATION_SUCCESS: {
      return { hydrated: true };
    }

    default: {
      return state;
    }
  }
}

const storage: Storage = new Storage(TEMP_config);

/**
 * Storage Hydration
 * =============================================================================
 * Merge the payload into the state on successful hydration from device or
 * browser storage.
 *
 *  1. On a successful read from the state merge the payload into the state.
 *  2. Apply the reducer to get the new state.
 *  3. If the state is flagged as hydrated, write the new state to the store.
 *     This last is _vital_ to avoid the initial application state from writing
 *     to store before it is read back.
 */

export function storageSync(
  reducer: ActionReducer<any>
): (state: any, action: any) => any {
  return (state: any, action: any) => {
    // On hydration success, apply the reducer to the merged state.
    const newState = (action.type === ActionTypes.HYDRATION_SUCCESS)
      ? reducer({ ...state, ...action.payload }, action)
      : reducer(state, action);

    if (newState && newState.storage.hydrated) {
      storage.set(TEMP_key, pickState(newState, TEMP_storedStates));
    }

    return newState;
  };
}

/**
 * Pick Store States for Dehydration
 * =============================================================================
 * Pick up the selected top-level keys to store. localForge throws errors if you
 * attempt to write a moment or date object to the database, so I stringify
 * these objects.
 *
 * @see https://github.com/apollographql/apollo-client/issues/1871
 * @see https://github.com/D4H/decisions-project/issues/2937
 * @see https://stackoverflow.com/a/27585758/1433400
 */
function pickState(state: object, keys: Array<string>): object {
  return traverse(pick(state, keys)).map(function(value: any): void {
    if (moment.isMoment(value) || moment.isDate(value)) {
      // tslint:disable-next-line no-invalid-this
      this.update(JSON.stringify(value));
    }
  });
}
