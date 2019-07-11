import { EffectsModule } from '@ngrx/effects';
import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { Storage, StorageConfig, StorageConfigToken } from '@ionic/storage';

import {
  ActionReducerMap,
  META_REDUCERS,
  MetaReducer,
  StoreModule
} from '@ngrx/store';

import {
  STORAGE_CONFIG,
  StorageModuleConfig,
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

export const FEATURE_STORE_CONFIG = new InjectionToken<any>(
  'ION_NGX_STORAGE_CONFIG'
);

export function provideStoreConfig(
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

@NgModule({
  imports: [
    EffectsModule.forRoot([]),
    StoreModule.forRoot({}),
    StoreModule.forFeature('storage', FEATURE_STORE_CONFIG),
    EffectsModule.forFeature([StorageEffects])
  ]
})
export class StorageModule {
  static forFeature(configuration?: any): ModuleWithProviders {
    console.log('[StorageModule] Module initialized.');

    return {
      ngModule: StorageModule,
      providers: [
        {
          provide: STORAGE_CONFIG,
          useValue: configuration
        },
        {
          deps: [STORAGE_CONFIG],
          provide: Storage,
          useFactory: provideStorage
        },
        {
          deps: [STORAGE_CONFIG, Storage],
          provide: FEATURE_STORE_CONFIG,
          useFactory: provideStoreConfig
        }
      ]
    };
  }
}
