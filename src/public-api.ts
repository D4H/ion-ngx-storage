/*
 * Public API Surface of storage
 */

export {
  IonNgxModule
} from './lib/storage.module';

export {
  IonNgxConfig,
  defaultConfig
} from './lib/providers';

export {
  selectHydrationStatus,
  selectStorageState
} from './lib/store';

export {
  transform
} from './lib/tools';
