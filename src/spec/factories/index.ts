import { Factory } from '@d4h/angular';

import { ModuleConfig } from './module-config.factory';
import { StorageState } from './storage-state.factory';

Factory.add({
  ModuleConfig,
  StorageState
});

export {
  Factory
};
