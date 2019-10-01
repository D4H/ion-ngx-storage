import faker from 'faker';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable, isObservable, of, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { cold, hot } from 'jasmine-marbles';
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
  WriteSuccess,
  getHydrated,
  initialState
} from '../../lib/store';

import { Config, STORAGE_CONFIG, defaultConfig } from '../../lib/providers';
import { StorageService } from '../../lib/services';

const moduleConfig = ({
  features = [],
  name = faker.internet.domainWord(),
  storage = { name: faker.internet.domainWord() }
} = defaultConfig) => ({ features, name, storage });

describe('StorageEffects', () => {
  let actions$: Observable<any>;
  let config: Config;
  let effects: StorageEffects;
  let result$: Observable<any>;
  let storage;
  let store: MockStore<StorageState>;
  let value: string;

  beforeEach(() => {
    config = moduleConfig();
    value = faker.random.uuid();

    TestBed.configureTestingModule({
      providers: [
        StorageEffects,
        provideMockStore(),
        provideMockActions(() => actions$),
        {
          provide: STORAGE_CONFIG,
          useValue: config
        },
        {
          provide: StorageService,
          useValue: jasmine.createSpyObj('storage', ['clear', 'get', 'set'])
        }
      ]
    });

    effects = TestBed.get(StorageEffects);
    storage = TestBed.get(StorageService);
    store = TestBed.get(Store);
  });

  describe('ngrxOnInitEffects', () => {
    it('should be a function accessor', () => {
      expect(typeof effects.ngrxOnInitEffects).toBe('function');
    });

    it('should return Read()', () => {
      expect(effects.ngrxOnInitEffects()).toEqual(Read());
    });
  });

  describe('clear$', () => {
    it('should be an observable accessor', () => {
      expect(isObservable(effects.clear$)).toBe(true);
    });

    it('should call storage.clear dispatch Read', () => {
      storage.clear.and.returnValue(of(null));

      actions$ = hot('-a---', {
        a: Clear()
      });

      result$ = cold('-b', {
        b: Read()
      });

      expect(effects.clear$).toBeObservable(result$);
      expect(storage.clear).toHaveBeenCalled();
    });
  });

  describe('read$', () => {
    it('should be an observable accessor', () => {
      expect(isObservable(effects.read$)).toBe(true);
    });

    it('should call storage.get and dispatch ReadResult', () => {
      storage.get.and.returnValue(of(value));

      actions$ = hot('-a---', {
        a: Read()
      });

      result$ = cold('-b', {
        b: ReadResult({ value })
      });

      expect(effects.read$).toBeObservable(result$);
      expect(storage.get).toHaveBeenCalledWith(config.name);
    });

    it('should dispatch ReadError upon a storage error', () => {
      storage.get.and.returnValue(throwError({ error: value }));

      actions$ = hot('-a---', {
        a: Read()
      });

      result$ = cold('-b', {
        b: ReadError({ error: { error: value } })
      });

      expect(effects.read$).toBeObservable(result$);
      expect(storage.get).toHaveBeenCalledWith(config.name);
    });
  });

  describe('readResult$', () => {
    it('should be an observable accessor', () => {
      expect(isObservable(effects.readResult$)).toBe(true);
    });

    describe('getHydrated is falsy', () => {
      it('should not dispatch ReadSuccess', () => {
        store.overrideSelector(getHydrated, false);

        actions$ = hot('-a---', {
          a: ReadResult({ value })
        });

        result$ = cold('---', {
          b: ReadSuccess()
        });

        expect(effects.readResult$).toBeObservable(result$);
      });
    });

    describe('getHydrated is truthy', () => {
      beforeEach(() => {
        store.overrideSelector(getHydrated, true);
      });

      it('should dispatch ReadSuccess', () => {
        actions$ = hot('-a---', {
          a: ReadResult({ value })
        });

        result$ = cold('-(b|)', {
          b: ReadSuccess()
        });

        expect(effects.readResult$).toBeObservable(result$);
      });
    });
  });

  describe('write$', () => {
    it('should be an observable accessor', () => {
      expect(isObservable(effects.write$)).toBe(true);
    });

    describe('getHydrated is falsy', () => {
      beforeEach(() => {
        store.overrideSelector(getHydrated, false);
        storage.set.and.returnValue(of(value));
      });

      it('should not call storage.set or dispatch WriteSuccess', () => {
        actions$ = hot('-a---', {
          a: { type: faker.random.uuid() }
        });

        result$ = cold('---', {
          b: WriteSuccess()
        });

        expect(effects.write$).toBeObservable(result$);
        expect(storage.set).not.toHaveBeenCalled();
      });
    });

    describe('getHydrated is truthy', () => {
      beforeEach(() => {
        store.overrideSelector(getHydrated, true);
        store.setState({ [value]: value } as any);
        storage.set.and.returnValue(of(value));
      });

      it('should call storage.set and dispatch WriteSuccess with any external action', () => {
        actions$ = hot('-a---', {
          a: { type: faker.random.uuid() }
        });

        result$ = cold('-(b)', {
          b: WriteSuccess()
        });

        expect(effects.write$).toBeObservable(result$);
        expect(storage.set).toHaveBeenCalledWith(config.name, { [value]: value });
      });

      describe('internal actions', () => {
        Object.values(ActionTypes).forEach(type => {
          it(`should not call storage.set or dispatch WriteSuccess with ${type}`, () => {
            actions$ = hot('-a---', {
              a: { type }
            });

            result$ = cold('---', {
              b: WriteSuccess()
            });

            expect(effects.write$).toBeObservable(result$);
            expect(storage.set).not.toHaveBeenCalled();
          });
        });
      });
    });


    describe('storage error', () => {
      it('should dispatch WriteError', () => {
        store.overrideSelector(getHydrated, true);
        storage.set.and.returnValue(throwError({ error: value }));

        actions$ = hot('-a---', {
          a: { type: faker.random.uuid() }
        });

        result$ = cold('-(b)', {
          b: WriteError({ error: { error: value } })
        });

        expect(effects.write$).toBeObservable(result$);
      });
    });
  });
});
