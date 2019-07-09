import { InjectionToken } from '@angular/core';
import { StorageConfig } from '@ionic/storage';

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

export const STORAGE_CONFIG = new InjectionToken<StorageConfig>(
  'ION_NGX_STORAGE_CONFIGURATION'
);
