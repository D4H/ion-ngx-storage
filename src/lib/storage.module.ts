import { InjectionToken } from '@angular/core';
import { META_REDUCERS } from '@ngrx/store';
import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { Storage, StorageConfig } from '@ionic/storage';

import {
  MODULE_CONFIG,
  StorageModuleConfig,
  defaultConfig,
  provideStorage
} from './providers';

import { provideMetaReducer } from './store';

/**
 * Storage Module Declaration
 * =============================================================================
 * TODO: Rename StorageModule. This name confuses me...
 */

@NgModule({})
export class StorageModule {
  static forRoot(config: StorageModuleConfig = defaultConfig): ModuleWithProviders {
    return {
      ngModule: StorageModule,
      providers: [
        {
          provide: MODULE_CONFIG,
          useValue: { ...defaultConfig, ...config }
        },
        {
          provide: Storage,
          useFactory: provideStorage,
          deps: [MODULE_CONFIG]
        },
        {
          provide: META_REDUCERS,
          useFactory: provideMetaReducer,
          deps: [MODULE_CONFIG, Storage],
          multi: true
        }
      ]
    };
  }
}
