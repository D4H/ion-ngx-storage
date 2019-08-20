import { InjectionToken } from '@angular/core';
import { Storage, StorageConfig } from '@ionic/storage';

/**
 * Root Storage Reducer Name
 * =============================================================================
 */

export const STORAGE_REDUCER_KEY = 'ion_ngx_storage';

/**
 * Storage Module Configuration
 * =============================================================================
 * @see https://ionicframework.com/docs/building/storage
 */

export interface Config<T extends object = {}> {
  features?: Array<string>;
  name: string;
  storage?: StorageConfig;
}

export const defaultConfig: Config = {
  features: [],
  name: STORAGE_REDUCER_KEY,

  storage: {
    name: STORAGE_REDUCER_KEY
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
  config: Partial<Config> = defaultConfig
): Storage {
  return new Storage(config.storage);
}
