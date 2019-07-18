/*
 * Public API Surface of storage
 */

export {
  ModuleConfig as StorageModuleConfig,
  StateTransform as StorageStateTransform
} from './lib/providers';

export {
  StorageFacade,
  selectHydratedStatus,
  selectStorageState
} from './lib/store';

export {
  StorageModule as StorageModule
} from './lib/storage.module';

export {
  dateTransform
} from './lib/tools';
