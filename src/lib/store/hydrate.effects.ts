import { Action, Store } from '@ngrx/store';
import { Inject, Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';

import {
  concatMap,
  exhaustMap,
  takeUntil,
  filter,
  map,
  switchMap,
  tap,
  take,
  withLatestFrom
} from 'rxjs/operators';

import {
  Actions,
  EffectNotification,
  OnInitEffects,
  createEffect,
  ofType
} from '@ngrx/effects';

import {
  ActionTypes,
  Read,
  HydrateSuccess,
  ReadSuccess,
  Write
} from './storage.actions';

import { ModuleConfig, STORAGE_CONFIG } from '../providers';
import { STORAGE_REDUCER } from './storage.reducer';
import { pickFeatures } from '../tools';

@Injectable()
export class HydrateEffects implements OnInitEffects {
  /**
   * Dispatch HydrateSuccess Signal If Hydrated
   * ===========================================================================
   */

  hydrate$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(ReadSuccess),
    concatMap(action => of(action).pipe(
      withLatestFrom(this.store$),
      map(([, state]) => state),
      filter(state => state[STORAGE_REDUCER] && state[STORAGE_REDUCER].hydrated)
    )),
    take(1),
    map(() =>
      HydrateSuccess()
    )
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

  dehydrate$: Observable<Action> = createEffect(() => this.actions$.pipe(
    filter(action => (
      !Object.values(ActionTypes).includes(action.type)
    )),
    concatMap(action => of(action).pipe(
      withLatestFrom(this.store$), map(([, state]) => state)
    )),
    filter(state => (
      state[STORAGE_REDUCER] && state[STORAGE_REDUCER].hydrated
    )),
    map(state => Write({
      key: this.config.name,
      value: pickFeatures(state, this.config.features),
      transform: this.config.transform.write
    }))
  ));

  constructor(
    @Inject(STORAGE_CONFIG) private readonly config: ModuleConfig,
    private readonly actions$: Actions,
    private readonly store$: Store<any>
  ) {}

  ngrxOnInitEffects(): Action {
    return Read({
      key: this.config.name,
      transform: this.config.transform.read
    });
  }
}
