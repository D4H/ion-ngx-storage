import faker from 'faker';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';

import { Factory, State } from '../factories';
import { STORAGE_FEATURE_KEY } from '../../lib/providers';
import { StorageFacade, getHydrated, getStorageState } from '../../lib/store';

describe('StorageFacade', () => {
  let facade: StorageFacade;
  let initialState: State;
  let store: MockStore<State>;
  let value: any;

  beforeEach(() => {
    value = faker.random.uuid();

    initialState = Factory.build('TestState', {
      [STORAGE_FEATURE_KEY]: { hydrated: value }
    });

    TestBed.configureTestingModule({
      providers: [
        StorageFacade,
        provideMockStore({ initialState })
      ]
    });

    store = TestBed.get<Store<State>>(Store);
    facade = TestBed.get(StorageFacade);
  });

  describe('state$', () => {
    it('should equal the storage state', done => {
      facade.state$.subscribe(result => {
        expect(result).toEqual({ hydrated: value });

        store.select(getStorageState).subscribe(selected => {
          expect(selected).toEqual(result);
          done();
        });
      });
    });
  });

  describe('hydrated$', () => {
    it('should equal the hydrated value', done => {
      facade.hydrated$.subscribe(result => {
        expect(result).toEqual(value);

        store.select(getHydrated).subscribe(selected => {
          expect(selected).toEqual(result);
          done();
        });
      });
    });
  });
});
