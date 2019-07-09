import { EffectsModule } from '@ngrx/effects';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { Storage, StorageConfig, StorageConfigToken } from '@ionic/storage';
import { ActionReducerMap, MetaReducer, StoreModule, META_REDUCERS } from '@ngrx/store';

import {
  STORAGE_CONFIG,
  StorageModuleConfig,
  defaultConfig,
  provideStorage
} from './providers';

import {
  StorageEffects,
  storageReducerProvider,
  reducer
} from './store';

@NgModule({
  imports: [
    StoreModule.forFeature('ion-ngx-storage', reducer),
    EffectsModule.forFeature([StorageEffects])
  ]
})
export class StorageModule {
  static forFeature(configuration: StorageModuleConfig = defaultConfig): ModuleWithProviders {
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
          provide: META_REDUCERS,
          useFactory: storageReducerProvider
        }
      ]
    };
  }
}
