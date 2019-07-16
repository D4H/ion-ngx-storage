import { InjectionToken } from '@angular/core';
import { Storage, StorageConfig } from '@ionic/storage';

/**
 * Storage Module Configuration
 * =============================================================================
 * @see https://ionicframework.com/docs/building/storage
 */

export interface IonNgxModuleConfig {
  ionicStorage?: StorageConfig;
  name: string;
  reducer: string;
  states?: Array<string>;
}

export const defaultConfig: IonNgxModuleConfig = {
  name: 'ION_NGX_STORAGE',
  reducer: 'storage',
  states: [],

  ionicStorage: {
    name: 'ion_ngx_storage'
  }
};

export const MODULE_CONFIG = new InjectionToken<StorageConfig>(
  'ION_NGX_MODULE_CONFIG'
);

/**
 * Ionic Storage Factory Provider
 * =============================================================================
 * @see https://github.com/ionic-team/ionic-storage/blob/2ea8583d774a96c3c150e944c8fe925d0cf69f3d/src/storage.ts#L261-L264
 * @see https://stackoverflow.com/a/43246735/1433400
 */

export function provideStorage(
  config: Partial<IonNgxModuleConfig> = defaultConfig
): Storage {
  return new Storage(config.ionicStorage);
}
