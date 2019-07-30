import { EffectsModule } from '@ngrx/effects';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { Storage } from '@ionic/storage';
import { StoreModule } from '@ngrx/store';

import {
  ModuleConfig,
  STORAGE_CONFIG,
  defaultConfig,
  provideStorage
} from './providers';

import {
  STORAGE_META_REDUCER,
  STORAGE_REDUCER,
  StorageEffects,
  initialState,
  reducer
} from './store';

/**
 * StorageModule Declaration
 * =============================================================================
 */

@NgModule({
  imports: [
    StoreModule.forFeature(STORAGE_REDUCER, reducer),
    EffectsModule.forFeature([StorageEffects])
  ]
})
export class StorageModule {
  static forRoot(config: ModuleConfig = defaultConfig): ModuleWithProviders {
    return {
      ngModule: StorageModule,
      providers: [
        STORAGE_META_REDUCER,
        {
          provide: STORAGE_CONFIG,
          useValue: { ...defaultConfig, ...config }
        },
        {
          provide: Storage,
          useFactory: provideStorage,
          deps: [STORAGE_CONFIG]
        }
      ]
    };
  }
}
