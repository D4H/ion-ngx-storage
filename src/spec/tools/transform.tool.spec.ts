// tslint:disable no-shadowed-variable
import faker from 'faker';
import isIsoDate from 'is-iso-date';
import moment from 'moment';
import traverse from 'traverse';

import { isDateLike, read, transform, write } from '../../lib/tools';

export function testStruct(): { source: object, read: object, write: object } {
  const source = {
    [faker.random.uuid()]: new Date(),
    [faker.random.uuid()]: new Date(),
    [faker.random.uuid()]: new Date(),

    [faker.random.uuid()]: {
      [faker.random.uuid()]: new Date(),
      [faker.random.uuid()]: moment(),

      [faker.random.uuid()]: [
        new Date(),
        moment(),
        new Date()
      ]
    },

    [faker.random.uuid()]: [
      new Date(),
      moment(),
      new Date()
    ],

    [faker.random.uuid()]: [
      0,
      1,
      Infinity,
      NaN,
      [],
      false,
      null,
      undefined,
      {}
    ]
  };

  const read = traverse(source).map(function(value: any): void {
    if (isIsoDate(value)) {
      this.update(new Date(value), true);
    }
  });

  const write = traverse(source).map(function(value: any): void {
    if (isDateLike(value)) {
      this.update(value.toISOString());
    }
  });

  return {
    source,
    read,
    write
  };
}

describe('Storage Meta Reducer', () => {
  describe('write', () => {
    let struct;

    beforeEach(() => {
      struct = testStruct();
    });

    it('should be a function accessor', () => {
      expect(typeof write).toBe('function');
      expect(write.length).toBe(1);
    });

    it('should transform Date and Moment objects into ISO-formatted strings', () => {
      expect(write(struct.source)).toEqual(struct.write);
    });
  });

  describe('read', () => {
    let struct;

    beforeEach(() => {
      struct = testStruct();
    });

    it('should be a function accessor', () => {
      expect(typeof read).toBe('function');
      expect(read.length).toBe(1);
    });

    it('should transform ISO-formatted strings to Date objects', () => {
      expect(read(struct.source)).toEqual(struct.read);
    });
  });

  describe('isDateLike', () => {
    it('should be a function accessor', () => {
      expect(typeof isDateLike).toBe('function');
      expect(isDateLike.length).toBe(1);
    });

    it('should correctly determine the type of value', () => {
      const values = [
        {
          value: Infinity,
          result: false
        },
        {
          value: NaN,
          result: false
        },
        {
          value: [],
          result: false
        },
        {
          value: true,
          result: false
        },
        {
          value: false,
          result: false
        },
        {
          value: '',
          result: false
        },
        {
          value: 15,
          result: false
        },
        {
          value: moment(),
          result: true
        },
        {
          value: new Date(),
          result: true
        },
        {
          value: null,
          result: false
        },
        {
          value: true,
          result: false
        },
        {
          value: undefined,
          result: false
        },
        {
          value: {},
          result: false
        }
      ];

      values.forEach(({ value, result }) => {
        expect(isDateLike(value)).toBe(result);
      });
    });
  });
});
