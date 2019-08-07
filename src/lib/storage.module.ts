import { EffectsModule } from '@ngrx/effects';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { Storage } from '@ionic/storage';
import { StoreModule } from '@ngrx/store';

import {
  ModuleConfig,
  STORAGE_CONFIG,
  STORAGE_FEATURE_KEY,
  defaultConfig,
  provideStorage
} from './providers';

import { STORAGE_META_REDUCER } from './store/storage.meta';
import { StorageEffects, } from './store/storage.effects';
import { initialState, reducer } from './store/storage.reducer';

/**
 * StorageModule Declaration
 * =============================================================================
 */

@NgModule({
  imports: [
    StoreModule.forFeature(STORAGE_FEATURE_KEY, reducer),
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
