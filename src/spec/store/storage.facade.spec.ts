import faker from 'faker';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';

import {
  StorageFacade,
  selectHydratedStatus,
  selectStorageState
} from '../../lib/store';

import { Factory, State } from '../factories';
import { STORAGE_REDUCER } from '../../lib/providers';

describe('StorageFacade', () => {
  let facade: StorageFacade;
  let initialState: State;
  let store: MockStore<State>;
  let value: any;

  beforeEach(() => {
    value = faker.random.uuid();

    initialState = Factory.build('TestState', {
      [STORAGE_REDUCER]: { hydrated: value }
    });

    TestBed.configureTestingModule({
      providers: [
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

        store.select(selectStorageState).subscribe(selected => {
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

        store.select(selectHydratedStatus).subscribe(selected => {
          expect(selected).toEqual(result);
          done();
        });
      });
    });
  });
});