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
  StorageEffects,
  provideMetaReducer,
  reducer
} from './store';

/**
 * Testing
 * =============================================================================
 */

export const REDUCER_TOKEN = new InjectionToken<ActionReducerMap<State>>(
  'NGX_ION_STORAGE_REDUCERS'
);

/**
 * Modullleeeeeeeeeee
 * =============================================================================
 */

@NgModule({
  imports: [
    EffectsModule.forRoot([]),
    // StoreModule.forRoot({}),
    StoreModule.forFeature('storage', REDUCER_TOKEN),
    EffectsModule.forFeature([StorageEffects])
  ]
})
export class StorageModule {
  static forFeature(configuration?: any): ModuleWithProviders {
    console.log('[StorageModule] Initialized.');

    return {
      ngModule: StorageModule,
      providers: [
        {
          provide: REDUCER_TOKEN,
          useFactory: () => ({ storage: reducer })
        },
        // {
        //   provide: STORAGE_CONFIG,
        //   useValue: configuration
        // },
        // {
        //   deps: [STORAGE_CONFIG],
        //   provide: Storage,
        //   useFactory: provideStorage
        // },
        // {
        //   deps: [STORAGE_CONFIG, Storage],
        //   provide: META_REDUCERS,
        //   useFactory: provideMetaReducer
        // }
      ]
    };
  }
}
