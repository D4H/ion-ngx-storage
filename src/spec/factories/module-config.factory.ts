import deepmerge from 'deepmerge';
import faker from 'faker';

import { Config, defaultConfig } from '../../lib/providers';

export function ModuleConfig(attributes: Partial<Config> = {}): Config {
  return deepmerge<Config>({
    ...defaultConfig,
    features: [],
    name: faker.internet.domainWord(),

    storage: {
      name: faker.internet.domainWord()
    }
  }, attributes);
}
