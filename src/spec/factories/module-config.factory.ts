import faker from 'faker';
import deepmerge from 'deepmerge';

import { ModuleConfig, defaultConfig } from '../../lib/providers';

export function ModuleConfig(attributes: Partial<ModuleConfig> = {}): ModuleConfig {
  return deepmerge<ModuleConfig>({
    ...defaultConfig,
    features: [],
    name: faker.internet.domainWord(),

    storage: {
      name: faker.internet.domainWord()
    }
  }, attributes);
}
