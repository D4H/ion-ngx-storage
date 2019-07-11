import { EffectsModule } from '@ngrx/effects';
import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { META_REDUCERS, StoreModule } from '@ngrx/store';
import { Storage, StorageConfig, StorageConfigToken } from '@ionic/storage';

import {
  MODULE_CONFIG,
  StorageModuleConfig,
  StoreConfig,
  defaultConfig,
  provideStorage
} from './providers';

import {
  State,
  initialState,
  StorageEffects,
  provideMetaReducer,
  reducer
} from './store';

/**
 * NgRx Feature Config Provider
 * =============================================================================
 */

export const NGRX_FEATURE_CONFIG = new InjectionToken<StoreConfig<State>>(
  'ION_NGX_NGRX_FEATURE_CONFIG'
);

export function provideNgrxConfig(
  config: StorageModuleConfig,
  storage: Storage
): any {
  console.log('[provideStoreConfig] function fired.');

  return {
    initialState,

    reducerFactory() {
      console.log('[reducerFactory] function fired.');

      return {
        storage: reducer
      };
    },

    metaReducers: [
      provideMetaReducer(config, storage)
    ]
  };
}

/**
 * Storage Module Declaration
 * =============================================================================
 * TODO: Rename StorageModule. Its name confuses me...
 */

@NgModule({
  imports: [
    EffectsModule.forRoot([]),
    StoreModule.forRoot({}),
    StoreModule.forFeature('storage', NGRX_FEATURE_CONFIG),
    EffectsModule.forFeature([StorageEffects])
  ]
})
export class StorageModule {
  static forFeature(moduleConfig?: StorageModuleConfig): ModuleWithProviders {
    console.log('[StorageModule] Module initialized.');

    return {
      ngModule: StorageModule,
      providers: [
        {
          provide: MODULE_CONFIG,
          useValue: moduleConfig
        },
        {
          deps: [MODULE_CONFIG],
          provide: Storage,
          useFactory: provideStorage
        },
        {
          deps: [MODULE_CONFIG, Storage],
          provide: NGRX_FEATURE_CONFIG,
          useFactory: provideNgrxConfig
        }
      ]
    };
  }
}
