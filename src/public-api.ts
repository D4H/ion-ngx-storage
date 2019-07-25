/*
 * Public API Surface of storage
 */

export {
  ModuleConfig as StorageConfig,
  StateTransform as StorageStateTransform
} from './lib/providers';

export {
  HydrateSuccess,
  StorageFacade,
  selectHydratedStatus,
  selectStorageState
} from './lib/store';

export {
  StorageModule
} from './lib/storage.module';

export {
  dateTransform
} from './lib/tools';
