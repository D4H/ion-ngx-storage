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
  REDUCER_TOKEN,
  State,
  StorageEffects,
  provideMetaReducer,
  provideReducer,
  reducer
} from './store';

@NgModule({
  imports: [
    EffectsModule.forRoot([]),
    StoreModule.forRoot({}),
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
          provide: STORAGE_CONFIG,
          useValue: configuration
        },
        {
          deps: [STORAGE_CONFIG],
          provide: Storage,
          useFactory: provideStorage
        },
        // {
        //   deps: [STORAGE_CONFIG, Storage],
        //   provide: META_REDUCERS,
        //   useFactory: provideMetaReducer,
        //   multi: true
        // }
      ]
    };
  }
}
