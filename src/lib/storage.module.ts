import { InjectionToken } from '@angular/core';
import { META_REDUCERS } from '@ngrx/store';
import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { Storage, StorageConfig } from '@ionic/storage';

import {
  IonNgxModuleConfig,
  MODULE_CONFIG,
  defaultConfig,
  provideStorage
} from './providers';

import { provideMetaReducer } from './store';

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
