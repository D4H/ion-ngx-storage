import faker from 'faker';
import { ReplaySubject } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Store } from '@ngrx/store';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { ActionTypes, Read, ReadSuccess, Write } from '../../lib/store/storage.actions';
import { MODULE_CONFIG, ModuleConfig, provideStorage } from '../../lib/providers';
import { STORAGE_REDUCER } from '../../lib/store/storage.reducer';
import { StorageSyncEffects } from '../../lib/store/storage-sync.effects';

interface TestState {
  foo: {
    bar: string;
  };

  ion_ngx_storage: {
    hydrated: boolean;
  };
}

describe('StorageEffects', () => {
  let actions: ReplaySubject<any>;
  let config: ModuleConfig;
  let effects: StorageSyncEffects;
  let initialState: TestState;
  let storage: Storage;
  let store: MockStore<TestState>;

  beforeEach(() => {
    initialState = {
      foo: {
        bar: faker.random.uuid()
      },

      ion_ngx_storage: {
        hydrated: false
      }
    };

    config = {
      name: faker.random.uuid(),

      transform: {
        read: state => 15 as any,
        write: state => 9 as any
      }
    };

    TestBed.configureTestingModule({
      providers: [
        StorageSyncEffects,
        provideMockActions(() => actions),
        provideMockStore({ initialState }),
        { provide: MODULE_CONFIG, useValue: config },
        { provide: Storage, useFactory: provideStorage, deps: [MODULE_CONFIG] }
      ]
    });

    effects = TestBed.get<StorageSyncEffects>(StorageSyncEffects);
    storage = TestBed.get<Storage>(Storage);
    store = TestBed.get<Store<TestState>>(Store);
  });

  afterEach(() => {
    storage.clear();
  });

  describe('synchronize$', () => {
    it('should not dispatch when storage is { hydrated: false }', fakeAsync(() => {
      let data;

      store.setState({
        ...initialState,
        ion_ngx_storage: { hydrated: false }
      });

      actions = new ReplaySubject(1);
      actions.next({ type: faker.random.uuid() });

      effects.synchronize$.subscribe(result => data = result);
      tick(100);
      expect(data).toBe(undefined);
    }));

    it('should not dispatch when storage is hydrated but action is from storage', fakeAsync(() => {
      const types = Object.values(ActionTypes);
      let data;

      types.forEach(type => {
        store.setState({ ...initialState, ion_ngx_storage: { hydrated: true } });
        actions = new ReplaySubject(1);
        actions.next({ type });
        effects.synchronize$.subscribe(result => data = result);
        tick(100);
        expect(data).toBe(undefined);
      });
    }));

    it('should dispatch when store is hydrated and action is not from storage', done => {
      const action = Write({
        transform: config.transform.write,
        key: config.name,

        value: {
          ...initialState,
          ion_ngx_storage: { hydrated: true }
        }
      });

      store.setState({ ...initialState, ion_ngx_storage: { hydrated: true } });
      actions = new ReplaySubject(1);
      actions.next({ type: faker.random.uuid() });

      effects.synchronize$.subscribe(result => {
        expect(result).toEqual(action);
        done();
      });
    });
  });
});
