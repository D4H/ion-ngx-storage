/*
 * Public API Surface of storage
 */

export {
  IonNgxModule
} from './lib/storage.module';

export {
  IonNgxModuleConfig,
  defaultConfig
} from './lib/providers';

export {
  StorageEffects,
  StorageState,
  initialState,
  selectHydrationStatus,
  selectStorageState,
  storageReducer,
  // Temp
  Clear,
  Read,
  ReadError,
  ReadSuccess,
} from './lib/store';

export {
  transform
} from './lib/tools';
