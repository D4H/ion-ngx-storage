import faker from 'faker';
import deepmerge from 'deepmerge';

import { STORAGE_FEATURE_KEY } from '../../lib/providers';

/**
 * Fake Application State
 * =============================================================================
 * This makes my life so much easier in effects tests.
 */

export interface State {
  [key: string]: any;

  [STORAGE_FEATURE_KEY]: {
    hydrated: boolean;
  };
}

export function TestState(
  attributes: Partial<State> = {}
): State {
  return deepmerge<State>({
    [faker.random.uuid()]: {
      [faker.random.uuid()]: faker.random.uuid(),
      [faker.random.uuid()]: faker.date.future(),
      [faker.random.uuid()]: faker.date.past()
    },

    [faker.random.uuid()]: {
      [faker.random.uuid()]: faker.random.uuid(),
      [faker.random.uuid()]: faker.date.future(),
      [faker.random.uuid()]: faker.date.past()
    },

    [faker.random.uuid()]: {
      [faker.random.uuid()]: faker.random.uuid(),
      [faker.random.uuid()]: faker.date.future(),
      [faker.random.uuid()]: faker.date.past()
    },

    [STORAGE_FEATURE_KEY]: {
      hydrated: false
    }
  }, attributes);
}
