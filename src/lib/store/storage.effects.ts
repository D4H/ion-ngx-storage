import { Action, Store } from '@ngrx/store';
import { Actions, OnInitEffects, createEffect, ofType } from '@ngrx/effects';
import { Inject, Injectable, Injector } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { Storage } from '@ionic/storage';

import {
  catchError,
  concatMap,
  filter,
  map,
  switchMap,
  tap,
  withLatestFrom
} from 'rxjs/operators';

import {
  ActionTypes,
  Clear,
  Read,
  ReadError,
  ReadSuccess,
  Write,
  WriteError,
  WriteSuccess
} from './storage.actions';

import { MODULE_CONFIG, ModuleConfig } from '../providers';
import { STORAGE_REDUCER } from './storage.reducer';
import { pickFeatures } from '../tools';

@Injectable()
export class StorageEffects implements OnInitEffects {
  clear$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(Clear),
    switchMap(() => from(this.storage.clear()).pipe(
      map(() => ReadSuccess({ value: undefined }))
    ))
  ));

  read$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(Read),
    switchMap(action => from(this.storage.get(action.key)).pipe(
      map((value: any) => this.config.transform.read(value)),
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
    map(({ key, value }) => ({ key, value: this.config.transform.write(value) })),
    switchMap(({ key, value }) => from(this.storage.set(key, value)).pipe(
      map((val: any) => WriteSuccess({ value: val }))
    ))
  ));

  writeError$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(WriteError),
    tap(console.error),
    map(() => WriteSuccess({ value: undefined }))
  ));

  /**
   * Copy Store to Storage
   * ===========================================================================
   * Copy the application state to storage when the following conditions are
   * met:
   *
   *  1. The action's type is not one from ion-ngx-storage. This is to prevent
   *  infinite circular writes which could break the application.
   *  2. The initial read of the state completed. Otherwise the initial
   *  application state will overwrite that stored.
   */

  synchchronize$: Observable<Action> = createEffect(() => this.actions$.pipe(
    filter(action => !Object.values(ActionTypes).includes(action.type)),
    concatMap(action => of(action).pipe(withLatestFrom(this.store$))),
    map(([, state]) => state),
    filter(state => state[STORAGE_REDUCER] && state[STORAGE_REDUCER].hydrated),
    map(state => pickFeatures(state, this.config.features)),
    map(state => Write({ key: this.config.name, value: state }))
  ));

  constructor(
    @Inject(MODULE_CONFIG) private readonly config: ModuleConfig,
    private readonly actions$: Actions,
    private readonly storage: Storage,
    private readonly store$: Store<any>
  ) {}

  ngrxOnInitEffects(): Action {
    return Read({ key: this.config.name });
  }
}
