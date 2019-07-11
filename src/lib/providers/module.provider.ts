import { Action, ActionReducerFactory, MetaReducer } from '@ngrx/store';
import { InjectionToken } from '@angular/core';
import { Storage, StorageConfig } from '@ionic/storage';

import { State, initialState, provideMetaReducer, reducer } from '../store';
import { StoreConfig } from './ngrx.provider';

/**
 * Ionic Storage Factory Provider
 * =============================================================================
 * @see https://github.com/ionic-team/ionic-storage/blob/2ea8583d774a96c3c150e944c8fe925d0cf69f3d/src/storage.ts#L261-L264
 * @see https://stackoverflow.com/a/43246735/1433400
 */

export function provideStorage(config: Partial<StorageModuleConfig> = {}): Storage {
  return new Storage(config.storage);
}

/**
 * Storage Module Configuration
 * =============================================================================
 * As well as providing
 */

export interface StorageModuleConfig {
  key: string;
  states: Array<string>;
  storage?: StorageConfig;
}

export const defaultConfig: StorageModuleConfig = {
  key: 'THUNDERCATS_HOOOOOOO',
  states: [],

  storage: {
    name: 'ion_ngx_storage'
  }
};

export const MODULE_CONFIG = new InjectionToken<StorageConfig>(
  'ION_NGX_MODULE_CONFIG'
);
