import faker from 'faker';
import { ReplaySubject } from 'rxjs';
import { Storage } from '@ionic/storage';
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

import { MODULE_CONFIG, defaultConfig, provideStorage } from '../../lib/providers';
import { StorageEffects } from '../../lib/store/storage.effects';

describe('StorageEffects', () => {
  let actions: ReplaySubject<any>;
  let effects: StorageEffects;
  let storage: Storage;
  let key: string;
  let val: string;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StorageEffects,
        provideMockActions(() => actions),
        { provide: MODULE_CONFIG, useValue: defaultConfig },
        { provide: Storage, useFactory: provideStorage, deps: [MODULE_CONFIG] }
      ]
    });

    effects = TestBed.get<StorageEffects>(StorageEffects);
    storage = TestBed.get<Storage>(Storage);
    key = faker.random.uuid();
    val = faker.random.uuid();
  });

  afterEach(() => {
    storage.clear();
  });

  describe('clear$', () => {
    beforeEach(() => {
      actions = new ReplaySubject(1);
      actions.next(Clear());
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
    it('should return ReadSuccess action', done => {
      actions = new ReplaySubject(1);
      actions.next(Read({ key }));

      storage.set(key, val).then(() => {
        effects.read$.subscribe(result => {
          expect(result).toEqual(ReadSuccess({ value: val }));
          done();
        });
      });
    });

    it('should apply the transform function if supplied', done => {
      const replacement = faker.random.uuid();
      const transform = value => replacement;

      actions = new ReplaySubject(1);
      actions.next(Read({ key, transform }));

      storage.set(key, val).then(() => {
        effects.read$.subscribe(result => {
          expect(result).toEqual(ReadSuccess({ value: replacement }));
          done();
        });
      });
    });
  });

  describe('readError$', () => {
    beforeEach(() => {
      actions = new ReplaySubject(1);
      actions.next(ReadError({ error: undefined }));
    });

    it('should return ReadSuccess with no payload', done => {
      effects.readError$.subscribe(result => {
        expect(result).toEqual(ReadSuccess({ value: undefined }));
        done();
      });
    });
  });

  describe('write$', () => {
    it('should return WriteSuccess action', done => {
      actions = new ReplaySubject(1);
      actions.next(Write({ key, value: val }));

      effects.write$.subscribe(result => {
        expect(result).toEqual(WriteSuccess({ value: val }));
        done();
      });
    });

    it('write value to storeage', done => {
      actions = new ReplaySubject(1);
      actions.next(Write({ key, value: val }));

      effects.write$.subscribe(() =>
        storage.get(key).then(outcome => {
          expect(outcome).toBe(val);
          done();
        })
      );
    });

    it('should apply the transform function if supplied', done => {
      const replacement = faker.random.uuid();
      const transform = value => replacement;

      actions = new ReplaySubject(1);
      actions.next(Write({ key, value: val, transform }));

      storage.set(key, val).then(() => {
        effects.write$.subscribe(result => {
          expect(result).toEqual(WriteSuccess({ value: replacement }));
          done();
        });
      });
    });
  });

  describe('writeError$', () => {
    beforeEach(() => {
      actions = new ReplaySubject(1);
      actions.next(WriteError({ error: undefined }));
    });

    it('should return WriteSuccess with no payload', done => {
      effects.writeError$.subscribe(result => {
        expect(result).toEqual(WriteSuccess({ value: undefined }));
        done();
      });
    });
  });
});
