import { Action, Store } from '@ngrx/store';
import { Actions, OnInitEffects, createEffect, ofType } from '@ngrx/effects';
import { Inject, Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { Storage } from '@ionic/storage';

import {
  catchError,
  concatMap,
  filter,
  map,
  switchMap,
  take,
  withLatestFrom
} from 'rxjs/operators';

import {
  ActionTypes,
  Clear,
  Read,
  ReadError,
  ReadResult,
  ReadSuccess,
  WriteError,
  WriteSuccess
} from './storage.actions';

import {
  ModuleConfig,
  STORAGE_CONFIG,
  STORAGE_FEATURE_KEY
} from '../providers/config.provider';

@Injectable()
export class StorageEffects implements OnInitEffects {
  clear$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(Clear),
    switchMap(() => from(this.storage.clear()).pipe(
      map(() => Read())
    ))
  ));

  read$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(Read),
    switchMap(action => from(this.storage.get(this.config.name)).pipe(
      map((value: any) => ReadResult({ value })),
      catchError(error => of(ReadError(error)))
    ))
  ));

  readResult$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(ReadResult),
    concatMap(action => of(action).pipe(
      withLatestFrom(this.store$),
      map(([, state]) => state),
      filter(state => state[STORAGE_FEATURE_KEY] && state[STORAGE_FEATURE_KEY].hydrated)
    )),
    take(1),
    map(() => ReadSuccess())
  ));

  /**
   * Write NgRx State to Browser/Device Storage
   * ===========================================================================
   * Copy the application state to storage when the following conditions are
   * met:
   *
   *  1. The action's type is not one from ion-ngx-storage. This is to prevent
   *  infinite circular writes which could break the application.
   *  2. The initial read of the state completed. Otherwise the initial
   *  application state will overwrite that stored.
   */

  write$: Observable<Action> = createEffect(() => this.actions$.pipe(
    filter(action => !Object.values(ActionTypes).includes(action.type)),
    concatMap(action => of(action).pipe(
      withLatestFrom(this.store$),
      map(([, state]) => state)
    )),
    filter(state => state[STORAGE_FEATURE_KEY] && state[STORAGE_FEATURE_KEY].hydrated),
    switchMap(state => from(this.storage.set(this.config.name, state)).pipe(
      map(() => WriteSuccess()),
      catchError(error => of(WriteError({ error })))
    ))
  ));

  constructor(
    @Inject(STORAGE_CONFIG) private readonly config: ModuleConfig,
    private readonly actions$: Actions,
    private readonly storage: Storage,
    private readonly store$: Store<any>
  ) {}

  ngrxOnInitEffects(): Action {
    return Read();
  }
}
