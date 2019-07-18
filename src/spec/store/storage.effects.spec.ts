import faker from 'faker';
import { ReplaySubject } from 'rxjs';
import { Storage } from '@ionic/storage';
import { StoreModule } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';

import {
  ActionTypes,
  Clear,
  Read,
  ReadError,
  ReadSuccess,
  Write,
  WriteError,
  WriteSuccess
} from '../../lib/store/storage.actions';

import {
  StorageEffects
} from '../../lib/store/storage.effects';

import {
  ModuleConfig,
  StateTransform
} from '../../lib/providers';

import { StorageTestModule } from '../storage-test.module';

describe('StorageEffects', () => {
  let action: { type: string, [key: string]: any };
  let actions: ReplaySubject<any>;
  let effects: StorageEffects;
  let storage: Storage;
  let key: string;
  let val: string;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StorageTestModule.forRoot()
      ],
      providers: [
        provideMockActions(() => actions)
      ]
    });

    effects = TestBed.get(StorageEffects);
    storage = TestBed.get(Storage);
    key = faker.random.uuid();
    val = faker.random.uuid();
  });

  afterEach(() => {
    storage.clear();
  });

  describe('clear$', () => {
    beforeEach(() => {
      actions = new ReplaySubject(1);
      action = Clear();
      actions.next(action);
    });

    it('should return ReadSuccess action', done => {
      storage.set(key, val).then(() => {
        effects.clear$.subscribe(result => {
          expect(result).toEqual(ReadSuccess({ value: undefined }));
          done();
        });
      });
    });

    it('should clear storage', done => {
      storage.set(key, val).then(() => {
        effects.clear$.subscribe(() => {
          storage.get(key).then(value => {
            expect(value).toBe(null);
            done();
          });
        });
      });
    });
  });

  describe('read$', () => {
    beforeEach(() => {
      actions = new ReplaySubject(1);
      action = Read({ key });
      actions.next(action);
    });

    it('should return ReadSuccess action', done => {
      storage.set(key, val).then(() => {
        effects.read$.subscribe(result => {
          expect(result).toEqual(ReadSuccess({ value: val }));
          done();
        });
      });
    });
  });

  describe('readError$', () => {
    beforeEach(() => {
      actions = new ReplaySubject(1);
      action = ReadError({ error: undefined });
      actions.next(action);
    });

    it('should return ReadSuccess with no payload', done => {
      effects.readError$.subscribe(result => {
        expect(result).toEqual(ReadSuccess({ value: undefined }));
        done();
      });
    });
  });

  describe('write$', () => {
    beforeEach(() => {
      actions = new ReplaySubject(1);
      action = Write({ key, value: val });
      actions.next(action);
    });

    it('should return WriteSuccess action', done => {
      effects.write$.subscribe(result => {
        expect(result).toEqual(WriteSuccess({ value: val }));
        done();
      });
    });

    it('write value to storeage', done => {
      effects.write$.subscribe(() =>
        storage.get(key).then(outcome => {
          expect(outcome).toBe(val);
          done();
        })
      );
    });
  });

  describe('writeError$', () => {
    beforeEach(() => {
      actions = new ReplaySubject(1);
      action = WriteError({ error: undefined });
      actions.next(action);
    });

    it('should return WriteSuccess with no payload', done => {
      effects.writeError$.subscribe(result => {
        expect(result).toEqual(WriteSuccess({ value: undefined }));
        done();
      });
    });
  });

  describe('synchronize$', () => {
    beforeEach(() => {
      actions = new ReplaySubject(1);
      action = { type: faker.random.uuid() };
      actions.next(action);
    });

    it('should copy application state to storage', done => {
      // TODO
      done();
    });
  });
});
