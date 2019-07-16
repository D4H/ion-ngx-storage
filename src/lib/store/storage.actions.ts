import { Action, createAction, props } from '@ngrx/store';

export enum ActionTypes {
  HYDRATION_ERROR = 'STORAGE_HYDRATION_ERROR',
  HYDRATION_SUCCESS = 'STORAGE_HYDRATION_SUCCESS'
}

export const HydrationError = createAction(
  ActionTypes.HYDRATION_ERROR,
  props<{ error: object }>()
);

export const HydrationSuccess = createAction(
  ActionTypes.HYDRATION_SUCCESS,
  props<{ state: object }>()
);
