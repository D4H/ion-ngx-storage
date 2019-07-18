import { createAction, props } from '@ngrx/store';

export enum ActionTypes {
  CLEAR = '[ion-ngx-storage] Clear Storage',
  READ = '[ion-ngx-storage] Storage Read',
  READ_ERROR = '[ion-ngx-storage] Storage Read Error',
  READ_SUCCESS = '[ion-ngx-storage] Storage Read Success',
  WRITE = '[ion-ngx-storage] Storage Write',
  WRITE_ERROR = '[ion-ngx-storage] Storage Write Error',
  WRITE_SUCCESS = '[ion-ngx-storage] Storage Write Success'
}

export const Clear = createAction(
  ActionTypes.CLEAR
);

export const Read = createAction(
  ActionTypes.READ,
  props<{ key: string }>()
);

export const ReadError = createAction(
  ActionTypes.READ_ERROR,
  props<{ error: any }>()
);

export const ReadSuccess = createAction(
  ActionTypes.READ_SUCCESS,
  props<{ value: any }>()
);

export const Write = createAction(
  ActionTypes.WRITE,
  props<{ key: string, value: any }>()
);

export const WriteError = createAction(
  ActionTypes.WRITE_ERROR,
  props<{ error: any }>()
);

export const WriteSuccess = createAction(
  ActionTypes.WRITE_SUCCESS,
  props<{ value: any }>()
);
