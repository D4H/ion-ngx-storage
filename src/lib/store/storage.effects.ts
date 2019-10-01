import { Action, Store, select } from '@ngrx/store';
import { Actions, OnInitEffects, createEffect, ofType } from '@ngrx/effects';
import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
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

import { Config, STORAGE_CONFIG } from '../providers/config.provider';
import { StorageService } from '../services/storage.service';
import { StorageState, getHydrated } from './storage.reducer';

@Injectable()
export class StorageEffects implements OnInitEffects {
  clear$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(Clear),
    switchMap(() => this.storage.clear().pipe(
      map(() => Read())
    ))
  ));

  read$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(Read),
    switchMap(() => this.storage.get(this.config.name).pipe(
      map((value: any) => ReadResult({ value })),
      catchError(error => of(ReadError({ error })))
    ))
  ));

  /**
   * Assess Whether Read Succeeded
   * ===========================================================================
   *
   *  - storageMetaReducer: Integrate the result of ReadResult.
   *  - storageReducer: Set { hydrated: true } upon ReadResult.
   *  - readRestult$ Assess whether ReadResult succeeded.
   *
   * If result of getHydrated is truthy it is safe to assume that dehydrated
   * data has been read back successfully.
   *
   * TODO: Check effects of take(1) after storage clear!
   */

  readResult$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(ReadResult),
    concatMap(({ value }) => this.hydrated$),
    take(1),
    map(() => ReadSuccess())
  ));

  /**
   * Write NgRx State to Browser/Device Storage
   * ===========================================================================
   * Copy the application state to storage when the following conditions are
   * met:
   *
   *  1. The action's type is external to ion-ngx-storage. See internalTypes.
   *  2. getHydrated is truthy. See hydrated$.
   *
   * TODO: Reimplement config.features slicing!
   */

  write$: Observable<Action> = createEffect(() => this.actions$.pipe(
    filter(action => !this.internalTypes.includes(action.type)),
    concatMap(() => this.hydrated$),
    concatMap(() => of(undefined).pipe(
      withLatestFrom(this.store),
      map(([, state]) => state)
    )),
    switchMap(state => this.storage.set(this.config.name, state).pipe(
      map(() => WriteSuccess()),
      catchError(error => of(WriteError({ error })))
    ))
  ));

  /**
   * Has Storage Hydrated?
   * ===========================================================================
   * Effectively a stored procedure shared between readResult$ and write$ to
   * clear up logic. Has the state hydrated successfully from storage?
   *
   * @see https://medium.com/@viestursv/fab9e9c8f087
   */

  private readonly hydrated$: Observable<boolean> = of(undefined).pipe(
    withLatestFrom(this.store.pipe(select(getHydrated))),
    map(([, hydrated]: [undefined, boolean]): boolean => hydrated),
    filter((hydrated: boolean): boolean => hydrated)
  );

  /**
   * Internal Storage Actions
   * ===========================================================================
   * If write$ acted on these actions it would trigger infinite circular writes,
   * which would lead to a hard application lock, e.g. WriteSuccess() triggers
   * write$ triggers WriteSuccess() (...).
   */

  private readonly internalTypes: Array<string> = Object.values(ActionTypes);

  constructor(
    @Inject(STORAGE_CONFIG) private readonly config: Config,
    private readonly actions$: Actions,
    private readonly storage: StorageService,
    private readonly store: Store<StorageState>
  ) {}

  ngrxOnInitEffects(): Action {
    return Read();
  }
}
