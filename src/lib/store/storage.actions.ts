import { Action, createAction, props } from '@ngrx/store';

export enum ActionTypes {
  RESET = 'STORAGE_RESET',
  HYDRATION_ERROR = 'STORAGE_HYDRATION_ERROR',
  HYDRATION_SUCCESS = 'STORAGE_HYDRATION_SUCCESS'
}

export const StorageHydrationError = createAction(
  ActionTypes.HYDRATION_ERROR,
  props<{ error: object }>()
);

export const StorageHydrationSuccess = createAction(
  ActionTypes.HYDRATION_SUCCESS,
  props<{ state: object }>()
);

export const StorageReset = createAction(
  ActionTypes.RESET
);
