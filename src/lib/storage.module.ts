import { EffectsModule } from '@ngrx/effects';
import { META_REDUCERS, StoreModule } from '@ngrx/store';
import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { Storage, StorageConfig } from '@ionic/storage';

import {
  IonNgxConfig,
  MODULE_CONFIG,
  defaultConfig,
  provideStorage
} from './providers';

import {
  STORAGE_META_REDUCER,
  STORAGE_REDUCER,
  StorageEffects,
  storageMetaReducer,
  storageReducer
} from './store';

/**
 * IonNgxModule Declaration
 * =============================================================================
 */

@NgModule({
  imports: [
    StoreModule.forFeature(STORAGE_REDUCER, storageReducer),
    EffectsModule.forFeature([StorageEffects])
  ]
})
export class IonNgxModule {
  static forRoot(config: IonNgxConfig = defaultConfig): ModuleWithProviders {
    return {
      ngModule: IonNgxModule,
      providers: [
        STORAGE_META_REDUCER,
        {
          provide: MODULE_CONFIG,
          useValue: { ...defaultConfig, ...config }
        },
        {
          provide: Storage,
          useFactory: provideStorage,
          deps: [MODULE_CONFIG]
        }
      ]
    };
  }
}
