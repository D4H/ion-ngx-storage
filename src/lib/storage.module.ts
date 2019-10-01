import { EffectsModule } from '@ngrx/effects';
import { META_REDUCERS } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { Storage } from '@ionic/storage';
import { StoreModule } from '@ngrx/store';

import {
  Config,
  STORAGE_CONFIG,
  STORAGE_REDUCER_KEY,
  defaultConfig,
  provideStorage
} from './providers';

import { StorageEffects } from './store/storage.effects';
import { StorageService } from './services/storage.service';
import { initialState, reducer } from './store/storage.reducer';
import { storageMetaReducer } from './store/storage.meta';

@NgModule({
  imports: [
    StoreModule.forFeature(STORAGE_REDUCER_KEY, reducer),
    EffectsModule.forFeature([StorageEffects])
  ],
  providers: [
    StorageService,
    {
      provide: META_REDUCERS,
      multi: true,

      useFactory(): any {
        return storageMetaReducer;
      }
    },
    {
      provide: Storage,
      useFactory: provideStorage,
      deps: [STORAGE_CONFIG]
    }
  ]
})
export class StorageModule {
  static forRoot(config: Config = defaultConfig): ModuleWithProviders {
    return {
      ngModule: StorageModule,
      providers: [
        {
          provide: STORAGE_CONFIG,
          useValue: { ...defaultConfig, ...config }
        }
      ]
    };
  }
}
