import faker from 'faker';
import deepmerge from 'deepmerge';

/**
 * Fake Application State
 * =============================================================================
 * This makes my life so much easier in effects tests.
 */

export interface State {
  [key: string]: any;

  ion_ngx_storage: {
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

    ion_ngx_storage: {
      hydrated: false
    }
  }, attributes);
}
