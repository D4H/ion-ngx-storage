import faker from 'faker';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { isObservable } from 'rxjs';

import { STORAGE_REDUCER_KEY } from '../../lib/providers';
import { StorageFacade, StorageState, getHydrated, getStorageState } from '../../lib/store';

describe('StorageFacade', () => {
  let facade: StorageFacade;
  let store: MockStore<StorageState>;
  let value: boolean;

  beforeEach(() => {
    value = faker.random.boolean();

    TestBed.configureTestingModule({
      providers: [
        StorageFacade,
        provideMockStore({
          selectors: [
            { selector: getHydrated, value },
            { selector: getStorageState, value: { hydrated: value } }
          ]
        })
      ]
    });

    facade = TestBed.get(StorageFacade);
    store = TestBed.get(Store);
  });

  describe('state$', () => {
    it('should be an observable accessor', () => {
      expect(isObservable(facade.state$)).toBe(true);
    });

    it('should equal the storage state', () => {
      facade.state$.subscribe(result => {
        expect(result).toEqual({ hydrated: value });
      });
    });
  });

  describe('hydrated$', () => {
    it('should be an observable accessor', () => {
      expect(isObservable(facade.hydrated$)).toBe(true);
    });

    it('should equal the hydrated value', () => {
      facade.hydrated$.subscribe(result => {
        expect(result).toEqual(value);
      });
    });
  });
});
