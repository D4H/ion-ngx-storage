import faker from 'faker';

import {
  ActionTypes,
  Clear,
  HydrateSuccess,
  Read,
  ReadError,
  ReadSuccess,
  Write,
  WriteError,
  WriteSuccess
} from '../../lib/store';

describe('Storage Actions', () => {
  enum ComparisonActionTypes {
    CLEAR = '[ion-ngx-storage] Clear Storage',
    HYDRATE_SUCCESS = '[ion-ngx-storage] Storage Hydrate Success',
    READ = '[ion-ngx-storage] Storage Read',
    READ_ERROR = '[ion-ngx-storage] Storage Read Error',
    READ_SUCCESS = '[ion-ngx-storage] Storage Read Success',
    WRITE = '[ion-ngx-storage] Storage Write',
    WRITE_ERROR = '[ion-ngx-storage] Storage Write Error',
    WRITE_SUCCESS = '[ion-ngx-storage] Storage Write Success'
  }

  describe('ActionTypes', () => {
    it('should equal the comparison enumerable object', () => {
      expect(Object.keys(ActionTypes)).toEqual(Object.keys(ComparisonActionTypes));

      Object.keys(ComparisonActionTypes).forEach(key => {
        expect(ActionTypes[key]).toEqual(ComparisonActionTypes[key]);
      });
    });
  });

  describe('Clear', () => {
    it('should match comparison action', () => {
      const action: any = { type: ComparisonActionTypes.CLEAR };
      expect(Clear()).toEqual(action);
    });
  });

  describe('HydrateSuccess', () => {
    it('should match comparison action', () => {
      const action: any = { type: ComparisonActionTypes.HYDRATE_SUCCESS };
      expect(HydrateSuccess()).toEqual(action);
    });
  });

  describe('Read', () => {
    it('should match comparison action', () => {
      const key = faker.random.uuid();
      const transform = state => state;
      const action: any = { type: ComparisonActionTypes.READ, transform, key };
      expect(Read({ key, transform })).toEqual(action);
    });
  });

  describe('ReadError', () => {
    it('should match comparison action', () => {
      const error = faker.random.uuid();
      const action: any = { type: ComparisonActionTypes.READ_ERROR, error };
      expect(ReadError({ error })).toEqual(action);
    });
  });

  describe('ReadSuccess', () => {
    it('should match comparison action', () => {
      const value = faker.random.uuid();
      const action: any = { type: ComparisonActionTypes.READ_SUCCESS, value };
      expect(ReadSuccess({ value })).toEqual(action);
    });
  });

  describe('Write', () => {
    it('should match comparison action', () => {
      const key = faker.random.uuid();
      const value = faker.random.uuid();
      const transform = state => state;
      const action: any = { type: ComparisonActionTypes.WRITE, transform, key, value };
      expect(Write({ key, value, transform })).toEqual(action);
    });
  });

  describe('WriteError', () => {
    it('should match comparison action', () => {
      const error = faker.random.uuid();
      const action: any = { type: ComparisonActionTypes.WRITE_ERROR, error };
      expect(WriteError({ error })).toEqual(action);
    });
  });

  describe('WriteSuccess', () => {
    it('should match comparison action', () => {
      const value = faker.random.uuid();
      const action: any = { type: ComparisonActionTypes.WRITE_SUCCESS, value };
      expect(WriteSuccess({ value })).toEqual(action);
    });
  });
});
