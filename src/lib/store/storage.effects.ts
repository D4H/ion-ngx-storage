import { Action, Store } from '@ngrx/store';
import { Actions, OnInitEffects, createEffect, ofType } from '@ngrx/effects';
import { Inject, Injectable, Injector } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { Storage } from '@ionic/storage';

import {
  catchError,
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

import { MODULE_CONFIG, IonNgxConfig } from '../providers';
import { STORAGE_REDUCER } from './storage.reducer';
import { pickFeatures } from '../tools';

@Injectable()
export class StorageEffects implements OnInitEffects {
  read: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(Read),
    switchMap((action) => from(this.storage.get(action.payload)).pipe(
      map((val: any) => this.config.transform.read(val)),
      map((val: any) => ReadSuccess({ payload: val })),
      catchError(error => of(ReadError(error)))
    ))
  ));

  readError$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(ReadError),
    tap(console.error),
    map(() => ReadSuccess({ payload: {} }))
  ));

  write$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(Write),
    map((action: any) => this.config.transform.write(action.payload)),
    switchMap((payload) => from(this.storage.set(this.config.name, payload)).pipe(
      map((val: any) => WriteSuccess(val))
    ))
  ));

  writeError$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(WriteError),
    tap(console.error),
    map(() => WriteSuccess)
  ));

  clear$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(Clear),
    switchMap(() => from(this.storage.clear()).pipe(
      map(() => ReadSuccess({ payload: {} }))
    ))
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
    withLatestFrom(this.store$),
    filter(([action, state]: [Action, Store<any>]) => (
      !Object.values(ActionTypes).includes(action.type)
      && state[STORAGE_REDUCER] && state[STORAGE_REDUCER].hydrated
    )),
    map(([action, state]) => pickFeatures(state, this.config.features)),
    map(state => Write({ payload: state }))
  ));

  constructor(
    @Inject(MODULE_CONFIG) private readonly config: IonNgxConfig,
    private readonly actions$: Actions,
    private readonly storage: Storage,
    private readonly store$: Store<any>
  ) {}

  ngrxOnInitEffects(): Action {
    return Read({ payload: this.config.name });
  }
}
