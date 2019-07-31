import { InjectionToken } from '@angular/core';
import { Storage, StorageConfig } from '@ionic/storage';

/**
 * Root Storage Reducer Name
 * =============================================================================
 */

export const STORAGE_REDUCER = 'ion_ngx_storage';

/**
 * Storage Module Configuration
 * =============================================================================
 * @see https://ionicframework.com/docs/building/storage
 */

export interface StateTransform {
  read<T>(state: T): T;
  write<T>(state: T): T;
}

export interface ModuleConfig<T extends object = {}> {
  features?: Array<string>;
  name: string;
  storage?: StorageConfig;
  transform?: StateTransform;
}

export const defaultConfig: ModuleConfig = {
  features: [],
  name: STORAGE_REDUCER,

  storage: {
    name: STORAGE_REDUCER
  },

  transform: {
    read: state => state,
    write: state => state
  }
};

export const STORAGE_CONFIG = new InjectionToken<StorageConfig>(
  'ION_NGX_STORAGE_CONFIG'
);

/**
 * Ionic Storage Factory Provider
 * =============================================================================
 * @see https://github.com/ionic-team/ionic-storage/blob/2ea8583d774a96c3c150e944c8fe925d0cf69f3d/src/storage.ts#L261-L264
 * @see https://stackoverflow.com/a/43246735/1433400
 */

export function provideStorage(
  config: Partial<ModuleConfig> = defaultConfig
): Storage {
  return new Storage(config.storage);
}
