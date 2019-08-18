import faker from 'faker';

import { STORAGE_REDUCER_KEY } from '../../lib/providers';
import { State, StorageState } from '../../lib/store';

/**
 * Fake Application State
 * =============================================================================
 * This makes my life so much easier in effects tests.
 */

export function StorageState(attributes: object = {}): StorageState {
  return {
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

    [STORAGE_REDUCER_KEY]: {
      hydrated: false
    },

    ...attributes
  };
}
