import { Action } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { Storage } from '@ionic/storage';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';

import {
  Clear,
  Read,
  ReadError,
  ReadSuccess,
  Write,
  WriteError,
  WriteSuccess
} from './storage.actions';

@Injectable()
export class StorageEffects {
  clear$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(Clear),
    switchMap(() => from(this.storage.clear()).pipe(
      map(() => ReadSuccess({ value: undefined }))
    ))
  ));

  read$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(Read),
    switchMap(action => from(this.storage.get(action.key)).pipe(
      map((value: any) => {
        if (action.transform) {
          return action.transform(value);
        } else {
          return value;
        }
      }),
      map((value: any) => ReadSuccess({ value })),
      catchError(error => of(ReadError(error)))
    ))
  ));

  readError$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(ReadError),
    tap(console.error),
    map(() => ReadSuccess({ value: undefined }))
  ));

  write$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(Write),
    map(action => {
      if (action.transform) {
        return ({ ...action, value: action.transform(action.value) });
      } else {
        return action;
      }
    }),
    switchMap(({ key, value }) => from(this.storage.set(key, value)).pipe(
      map((val: any) => WriteSuccess({ value: val }))
    ))
  ));

  writeError$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(WriteError),
    tap(console.error),
    map(() => WriteSuccess({ value: undefined }))
  ));

  constructor(
    private readonly actions$: Actions,
    private readonly storage: Storage
  ) {}
}
