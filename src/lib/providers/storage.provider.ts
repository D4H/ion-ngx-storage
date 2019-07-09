import { Storage } from '@ionic/storage';

import { StorageModuleConfig } from './config.provider';

/**
 * Ionic Storage Factory Provider
 * =============================================================================
 * @see https://github.com/ionic-team/ionic-storage/blob/2ea8583d774a96c3c150e944c8fe925d0cf69f3d/src/storage.ts#L261-L264
 * @see https://stackoverflow.com/a/43246735/1433400
 */

export function provideStorage(config: Partial<StorageModuleConfig> = {}): Storage {
  return new Storage(config.storage);
}
