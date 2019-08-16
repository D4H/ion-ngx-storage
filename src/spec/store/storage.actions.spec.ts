import faker from 'faker';

import {
  ActionTypes,
  Clear,
  Read,
  ReadError,
  ReadResult,
  ReadSuccess,
  WriteError,
  WriteSuccess
} from '../../lib/store';

describe('Storage Actions', () => {
  enum ComparisonActionTypes {
    CLEAR = '[ion-ngx-storage] Clear',
    READ = '[ion-ngx-storage] Read',
    READ_ERROR = '[ion-ngx-storage] Read Error',
    READ_RESULT = '[ion-ngx-storage] Read Result',
    READ_SUCCESS = '[ion-ngx-storage] Read Success',
    WRITE_ERROR = '[ion-ngx-storage] Write Error',
    WRITE_SUCCESS = '[ion-ngx-storage] Write Success'
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

  describe('ReadSuccess', () => {
    it('should match comparison action', () => {
      const action: any = { type: ComparisonActionTypes.READ_SUCCESS };
      expect(ReadSuccess()).toEqual(action);
    });
  });

  describe('Read', () => {
    it('should match comparison action', () => {
      const action: any = { type: ComparisonActionTypes.READ };
      expect(Read()).toEqual(action);
    });
  });

  describe('ReadError', () => {
    it('should match comparison action', () => {
      const error = faker.random.uuid();
      const action: any = { type: ComparisonActionTypes.READ_ERROR, error };
      expect(ReadError({ error })).toEqual(action);
    });
  });

  describe('ReadResult', () => {
    it('should match comparison action', () => {
      const value = faker.random.uuid();
      const action: any = { type: ComparisonActionTypes.READ_RESULT, value };
      expect(ReadResult({ value })).toEqual(action);
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
      const action: any = { type: ComparisonActionTypes.WRITE_SUCCESS };
      expect(WriteSuccess()).toEqual(action);
    });
  });
});
