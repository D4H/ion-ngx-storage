import { Store, select } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  State,
  StorageState,
  getHydrated,
  getStorageState
} from './storage.reducer';

import { StorageModule } from '../storage.module';

@Injectable({ providedIn: StorageModule })
export class StorageFacade {
  readonly state$: Observable<State> = this.store.pipe(
    select(getStorageState)
  );

  readonly hydrated$: Observable<boolean> = this.store.pipe(
    select(getHydrated)
  );

  constructor(private readonly store: Store<StorageState>) {}
}
