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
  ReadError,
  ReadSuccess,
  StorageFacade,
  WriteError,
  getHydratedStatus,
  getStorageState
} from './lib/store';

export {
  StorageModule
} from './lib/storage.module';

export {
  dateTransform
} from './lib/tools';
