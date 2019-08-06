import { Store, select } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  StorageState,
  selectHydratedStatus,
  selectStorageState
} from './storage.reducer';

import { StorageModule } from '../storage.module';

@Injectable({ providedIn: StorageModule })
export class StorageFacade {
  readonly state$: Observable<StorageState> = this.store.pipe(
    select(selectStorageState)
  );

  readonly hydrated$: Observable<boolean> = this.store.pipe(
    select(selectHydratedStatus)
  );

  constructor(private readonly store: Store<StorageState>) {}
}
