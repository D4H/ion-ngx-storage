import faker from 'faker';
import { fromPairs, sampleSize, times } from 'lodash';

import { pickFeatures } from '../../lib/tools';

describe('pickFeatures', () => {
  let keys: Array<string>;
  let state: object;

  beforeEach(() => {
    state = fromPairs(
      times(15, () => [faker.random.uuid(), faker.random.uuid()])
    );

    keys = sampleSize(
      Object.keys(state),
      faker.random.number({ min: 0, max: 20 })
    );
  });

  it('should be a function', () => {
    expect(typeof pickFeatures).toBe('function');
    expect(pickFeatures.length).toBe(1);
  });

  it('should return an object comprising only picked keys', () => {
    const result = keys.reduce(
      (acc, key) => ({ ...acc, [key]: state[key] }),
      {}
    );

    expect(pickFeatures(state, keys)).toEqual(result);
  });

  it('should return the original object when given no keys', () => {
    expect(pickFeatures(state)).toEqual(state);
    expect(pickFeatures(state, [])).toEqual(state);
  });
});
