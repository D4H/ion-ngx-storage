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
  provideMetaReducer,
  selectHydrationStatus,
  selectStorageState,
  storageReducer
} from './lib/store';

export {
  transform
} from './lib/tools';
