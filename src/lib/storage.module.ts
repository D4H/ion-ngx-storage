import { EffectsModule } from '@ngrx/effects';
import { META_REDUCERS, StoreModule } from '@ngrx/store';
import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { Storage, StorageConfig } from '@ionic/storage';

import {
  IonNgxModuleConfig,
  MODULE_CONFIG,
  defaultConfig,
  provideStorage
} from './providers';

import {
  STORAGE_META_REDUCER,
  StorageEffects,
  storageMetaReducer
} from './store';

/**
 * IonNgxModule Declaration
 * =============================================================================
 */

@NgModule({})
export class IonNgxModule {
  static forRoot(config: IonNgxModuleConfig = defaultConfig): ModuleWithProviders {
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
