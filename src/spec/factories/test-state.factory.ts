import faker from 'faker';
import deepmerge from 'deepmerge';

import { STORAGE_REDUCER } from '../../lib/providers';

/**
 * Fake Application State
 * =============================================================================
 * This makes my life so much easier in effects tests.
 */

export interface State {
  [key: string]: any;

  [STORAGE_REDUCER]: {
    hydrated: boolean;
  };
}

export function TestState(
  attributes: Partial<State> = {}
): State {
  return deepmerge<State>({
    [faker.random.uuid()]: {
      [faker.random.objectElement()]: faker.random.uuid(),
      [faker.random.objectElement()]: faker.date.future(),
      [faker.random.objectElement()]: faker.date.past()
    },

    [faker.random.uuid()]: {
      [faker.random.objectElement()]: faker.random.uuid(),
      [faker.random.objectElement()]: faker.date.future(),
      [faker.random.objectElement()]: faker.date.past()
    },

    [faker.random.uuid()]: {
      [faker.random.objectElement()]: faker.random.uuid(),
      [faker.random.objectElement()]: faker.date.future(),
      [faker.random.objectElement()]: faker.date.past()
    },

    [STORAGE_REDUCER]: {
      hydrated: false
    }
  }, attributes);
}
