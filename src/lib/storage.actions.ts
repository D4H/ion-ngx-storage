import { Action } from '@ngrx/store';

export enum ActionTypes {
  HYDRATION_ERROR = 'STORAGE_HYDRATION_ERROR',
  HYDRATION_SUCCESS = 'STORAGE_HYDRATION_SUCCESS'
}

export type StorageActions
  = HydrationError
  | HydrationSuccess;

export class HydrationError implements Action {
  readonly type = ActionTypes.HYDRATION_ERROR;

  constructor(readonly payload: object) {}
}

export class HydrationSuccess implements Action {
  readonly type = ActionTypes.HYDRATION_SUCCESS;

  constructor(readonly payload: object) {}
}
