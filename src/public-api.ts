/*
 * Public API Surface of storage
 */

export {
  STORAGE_CONFIG,
  ModuleConfig as StorageConfig,
  StateTransform as StorageStateTransform
} from './lib/providers';

export {
  Clear,
  Read,
  ReadError,
  ReadSuccess,
  StorageFacade,
  StorageState,
  WriteError,
  getHydrated,
  getStorageState
} from './lib/store';

export {
  StorageModule
} from './lib/storage.module';
