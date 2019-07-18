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
  StorageFacade,
  selectHydratedStatus,
  selectStorageState
} from './lib/store';

export {
  dateTransform
} from './lib/tools';
