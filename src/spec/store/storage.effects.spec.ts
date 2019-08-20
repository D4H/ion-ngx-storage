import faker from 'faker';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ReplaySubject } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Store } from '@ngrx/store';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';

import {
  ActionTypes,
  Clear,
  Read,
  ReadError,
  ReadResult,
  ReadSuccess,
  StorageEffects,
  StorageState,
  WriteError,
  WriteSuccess
} from '../../lib/store';

import {
  Config,
  STORAGE_CONFIG,
  STORAGE_REDUCER_KEY,
  provideStorage
} from '../../lib/providers';

import { Factory } from '../factories';

describe('StorageEffects', () => {
  let action: any;
  let actions: ReplaySubject<any>;
  let config: Config;
  let effects: StorageEffects;
  let initialState: StorageState;
  let key: string;
  let storage: Storage;
  let store: MockStore<StorageState>;
  let val: StorageState;

  beforeEach(() => {
    config = Factory.build('ModuleConfig');
    initialState = Factory.build('StorageState');
    key = faker.random.uuid();
    val = initialState;

    TestBed.configureTestingModule({
      providers: [
        StorageEffects,
        provideMockActions(() => actions),
        provideMockStore({ initialState }),
        { provide: STORAGE_CONFIG, useValue: config },
        { provide: Storage, useFactory: provideStorage, deps: [STORAGE_CONFIG] }
      ]
    });

    effects = TestBed.get<StorageEffects>(StorageEffects);
    storage = TestBed.get<Storage>(Storage);
    store = TestBed.get<Store<StorageState>>(Store);
  });

  afterEach(() => {
    storage.clear();
  });

  describe('clear$', () => {
    beforeEach(() => {
      actions = new ReplaySubject(1);
      actions.next(Clear());
    });

    it('should return ReadResult action', done => {
      storage.set(key, val).then(() => {
        effects.clear$.subscribe(result => {
          expect(result).toEqual(Read());
          done();
        });
      });
    });

    it('should clear storage', done => {
      storage.set(key, val).then(() => {
        effects.clear$.subscribe(() => {
          storage.get(key).then(result => {
            expect(result).toBe(null);
            done();
          });
        });
      });
    });
  });

  describe('read$', () => {
    it('should return ReadResult action', done => {
      action = ReadResult({ value: null });
      actions = new ReplaySubject(1);
      actions.next(Read());

      effects.read$.subscribe(result => {
        expect(result).toEqual(action);
        done();
      });
    });

    it('should return value of key from storage', done => {
      action = ReadResult({ value: val });
      actions = new ReplaySubject(1);
      actions.next(Read());

      storage.set(config.name, val).then(() => {
        effects.read$.subscribe(result => {
          expect(result).toEqual(action);
          done();
        });
      });
    });
  });

  describe('readResult$', () => {
    it('should verify fakeAsync works', fakeAsync(() => {
      const promise = new Promise(resolve => {
        setTimeout(resolve, 10);
      });

      let done;
      promise.then(() => done = true);
      tick(50);
      expect(done).toBeTruthy();
    }));

    it('should not dispatch ReadSuccess() when storage is not hydrated', fakeAsync(() => {
      let data;

      store.setState({ ...initialState,
        [STORAGE_REDUCER_KEY]: { hydrated: false }
      });

      actions = new ReplaySubject(1);
      actions.next({ type: ActionTypes.READ_RESULT });

      effects.readResult$.subscribe(result => data = result);
      tick(50);
      expect(data).toBe(undefined);
    }));

    it('should dispatch with ReadSuccess() when storage is hydrated', done => {
      store.setState({
        ...initialState,
        [STORAGE_REDUCER_KEY]: { hydrated: true }
      });

      action = ReadSuccess();
      actions = new ReplaySubject(1);
      actions.next({ type: ActionTypes.READ_RESULT });

      effects.readResult$.subscribe(result => {
        expect(result).toEqual(action);
        done();
      });
    });
  });

  describe('write$', () => {
    it('should not dispatch when storage is not hydrated', fakeAsync(() => {
      let data;

      store.setState({
        ...initialState,
        [STORAGE_REDUCER_KEY]: { hydrated: false }
      });

      actions = new ReplaySubject(1);
      actions.next({ type: faker.random.uuid() });

      effects.write$.subscribe(result => data = result);
      tick(50);
      expect(data).toBe(undefined);
    }));

    it('should not dispatch when storage is hydrated but action is internal', fakeAsync(() => {
      let data;

      store.setState({
        ...initialState,
        [STORAGE_REDUCER_KEY]: { hydrated: true }
      });

      Object.values(ActionTypes).forEach(type => {
        actions = new ReplaySubject(1);
        actions.next({ type });
        effects.write$.subscribe(result => data = result);
        tick(50);
        expect(data).toBe(undefined);
      });
    }));

    it('should dispatch WriteSuccess() when hydrated and action is external', done => {
      action = WriteSuccess();
      actions = new ReplaySubject(1);

      store.setState({
        ...initialState,
        [STORAGE_REDUCER_KEY]: { hydrated: true }
      });

      storage.get(config.name).then(value => {
        expect(value).toBe(null);
        actions.next({ type: faker.random.uuid() });

        effects.write$.subscribe(result => {
          expect(result).toEqual(action);
          done();
        });
      });
    });

    it('should copy the state to the store', done => {
      action = WriteSuccess();
      actions = new ReplaySubject(1);

      store.setState({
        ...initialState,
        [STORAGE_REDUCER_KEY]: { hydrated: true }
      });

      storage.get(config.name).then(value => {
        expect(value).toBe(null);
        actions.next({ type: faker.random.uuid() });

        effects.write$.subscribe(() => {
          store.subscribe(state => {
            storage.get(config.name).then(result => {
              expect(result).toEqual(state);
              done();
            });
          });
        });
      });
    });
  });
});
