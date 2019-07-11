import { Action } from '@ngrx/store';
import { Inject, Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { Storage } from '@ionic/storage';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import {
  Actions,
  Effect,
  ROOT_EFFECTS_INIT,
  createEffect,
  ofType
} from '@ngrx/effects';

import { ActionTypes, HydrationError, HydrationSuccess } from './storage.actions';
import { STORAGE_CONFIG, StorageModuleConfig } from '../providers';

@Injectable()
export class StorageEffects {
  constructor(
    @Inject(STORAGE_CONFIG) private readonly config: StorageModuleConfig,
    private readonly actions$: Actions,
    private readonly storageService: Storage
  ) {}

  /**
   * Rehydrate Storage on Store Initialization
   * ===========================================================================
   * Hydration cannot occur before effects are initialized. There's nowhere to
   * dispatch the action before this.
   */

  init$: Observable<Action> = createEffect(() => this.actions$.pipe(
    tap(() => console.log('[StorageEffects] init$ effect fired')),
    ofType(ROOT_EFFECTS_INIT),
    switchMap(() => from(this.storageService.get(this.config.key)).pipe(
      tap(() => console.log('[StorageEffects] storageService.get() fired successfully')),
      map(state => HydrationSuccess(state)),
      catchError(error => of(HydrationError(error)))
    ))
  ));

  /**
   * Storage Hydration Error
   * ===========================================================================
   * Hydration errors have no impact on state other than effective deletion of
   * dehydrated data. Catch and log error but continue execution, because
   * otherwise guards which depend on this will wait for hydration to complete.
   */

  @Effect() error$: Observable<Action> = this.actions$.pipe(
    ofType(HydrationError),
    tap(console.error),
    map(() => HydrationSuccess({ state: {} }))
  );
}
