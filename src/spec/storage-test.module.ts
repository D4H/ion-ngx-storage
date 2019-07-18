import { EffectsModule } from '@ngrx/effects';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { Storage } from '@ionic/storage';

import {
  MODULE_CONFIG,
  ModuleConfig,
  defaultConfig,
  provideStorage
} from '../lib/providers';

import {
  STORAGE_REDUCER,
  StorageEffects,
  initialState
} from '../lib/store';

@NgModule({})
export class StorageTestModule {
  static forRoot(
    config: ModuleConfig = defaultConfig
  ): ModuleWithProviders {
    return {
      ngModule: StorageTestModule,
      providers: [
        StorageEffects,

        provideMockStore({
          // Testing state?
          initialState: {
            [STORAGE_REDUCER]: initialState
          }
        }),

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
