import { Action, Store } from '@ngrx/store';
import { Actions, OnInitEffects, createEffect, ofType } from '@ngrx/effects';
import { Inject, Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { concatMap, filter, map, switchMap, withLatestFrom } from 'rxjs/operators';

import { ActionTypes, Read, Write } from './storage.actions';
import { MODULE_CONFIG, ModuleConfig } from '../providers';
import { STORAGE_REDUCER } from './storage.reducer';
import { pickFeatures } from '../tools';

/**
 * Synchronize NgRx State with Browser/Device Storage
 * ===========================================================================
 * Copy the application state to storage when the following conditions are met:
 *
 *  1. The action's type is not one from ion-ngx-storage. This is to prevent
 *  infinite circular writes which could break the application.
 *  2. The initial read of the state completed. Otherwise the initial
 *  application state will overwrite that stored.
 */

@Injectable()
export class StorageSyncEffects implements OnInitEffects {
  synchronize$: Observable<Action> = createEffect(() => this.actions$.pipe(
    filter(action => (
      !Object.values(ActionTypes).includes(action.type)
    )),
    concatMap(action => of(action).pipe(
      withLatestFrom(this.store$),
      map(([, state]) => state
    ))),
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
    @Inject(MODULE_CONFIG) private readonly config: ModuleConfig,
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
