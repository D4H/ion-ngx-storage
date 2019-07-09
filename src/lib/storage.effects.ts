import { Action } from '@ngrx/store';
import { Actions, Effect, ROOT_EFFECTS_INIT, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { Storage } from '@ionic/storage';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { ActionTypes, HydrationError, HydrationSuccess } from './storage.actions';
import { TEMP_key } from './storage.config';

@Injectable()
export class StorageEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly storageService: Storage
  ) {}

  @Effect() init$: Observable<Action> = this.actions$.pipe(
    ofType(ROOT_EFFECTS_INIT),
    switchMap(() => from(this.storageService.get(TEMP_key)).pipe(
      map(state => new HydrationSuccess(state)),
      catchError(error => of(new HydrationError(error)))
    ))
  );

  /**
   * Storage Hydration Error
   * ===========================================================================
   * This has no other effect on the application than effectively wiping data.
   * Catch and log error, but keep going otherwise because the app otherwise
   * waits for hydration to complete.
   */

  @Effect() error$: Observable<Action> = this.actions$.pipe(
    ofType<HydrationError>(ActionTypes.HYDRATION_ERROR),
    tap(console.error),
    map(() => new HydrationSuccess({}))
  );
}
