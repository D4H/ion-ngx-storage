import { Action } from '@ngrx/store';
import { Actions, ROOT_EFFECTS_INIT, createEffect, ofType } from '@ngrx/effects';
import { Inject, Injectable, Injector } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { Storage } from '@ionic/storage';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { HydrationError, HydrationSuccess } from './storage.actions';
import { MODULE_CONFIG, StorageModuleConfig } from '../providers';

@Injectable()
export class StorageEffects {
  constructor(
    @Inject(MODULE_CONFIG) private readonly config: StorageModuleConfig,
    private readonly actions$: Actions,
    private readonly storage: Storage
  ) {}

  /**
   * Rehydrate Storage on Store Initialization
   * ===========================================================================
   * Hydration cannot occur before effects are initialized. There's nowhere to
   * dispatch the action before this.
   */

  init$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(ROOT_EFFECTS_INIT),
    switchMap(() => from(this.storage.get(this.config.name)).pipe(
      map((state: object) => HydrationSuccess({ state })),
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

  error$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(HydrationError),
    tap(console.error),
    map(() => HydrationSuccess({ state: {} }))
  ));
}
