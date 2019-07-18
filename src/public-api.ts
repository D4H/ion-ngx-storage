/*
 * Public API Surface of storage
 */

export {
  ModuleConfig as IonNgxConfig,
  StateTransform as IonNgxStateTransform,
  defaultConfig
} from './lib/providers';

export {
  StorageFacade,
  selectHydratedStatus,
  selectStorageState
} from './lib/store';

export {
  StorageModule as IonNgxModule
} from './lib/storage.module';

export {
  dateTransform
} from './lib/tools';
