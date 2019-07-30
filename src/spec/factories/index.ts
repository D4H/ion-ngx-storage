import { Factory } from '@d4h/angular';
import { ModuleConfig } from './module-config.factory';
import { TestState, State } from './test-state.factory';

Factory.add({
  ModuleConfig,
  TestState
});

export {
  Factory,
  State
};
