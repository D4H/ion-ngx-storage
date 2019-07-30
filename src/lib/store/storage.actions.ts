import { createAction, props } from '@ngrx/store';

export enum ActionTypes {
  CLEAR = '[ion-ngx-storage] Clear',
  READ = '[ion-ngx-storage] Read',
  READ_ERROR = '[ion-ngx-storage] Read Error',
  READ_RESULT = '[ion-ngx-storage] Read Result',
  READ_SUCCESS = '[ion-ngx-storage] Read Success',
  WRITE_ERROR = '[ion-ngx-storage] Write Error',
  WRITE_SUCCESS = '[ion-ngx-storage] Write Success'
}

export const Clear = createAction(
  ActionTypes.CLEAR
);

export const ReadSuccess = createAction(
  ActionTypes.READ_SUCCESS
);

export const Read = createAction(
  ActionTypes.READ,
  props<{ key: string }>()
);

export const ReadError = createAction(
  ActionTypes.READ_ERROR,
  props<{ error: any }>()
);

export const ReadResult = createAction(
  ActionTypes.READ_RESULT,
  props<{ value: any }>()
);

export const WriteError = createAction(
  ActionTypes.WRITE_ERROR,
  props<{ error: any }>()
);

export const WriteSuccess = createAction(
  ActionTypes.WRITE_SUCCESS
);
