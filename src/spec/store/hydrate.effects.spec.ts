import faker from 'faker';
import { ReplaySubject } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Store } from '@ngrx/store';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import {
  ActionTypes,
  HydrateSuccess,
  Read,
  ReadSuccess,
  Write
} from '../../lib/store/storage.actions';

import { HydrateEffects } from '../../lib/store/hydrate.effects';
import { ModuleConfig, STORAGE_CONFIG, provideStorage } from '../../lib/providers';

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
  let effects: HydrateEffects;
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
        HydrateEffects,
        provideMockActions(() => actions),
        provideMockStore({ initialState }),
        { provide: STORAGE_CONFIG, useValue: config },
        { provide: Storage, useFactory: provideStorage, deps: [STORAGE_CONFIG] }
      ]
    });

    effects = TestBed.get<HydrateEffects>(HydrateEffects);
    storage = TestBed.get<Storage>(Storage);
    store = TestBed.get<Store<TestState>>(Store);
  });

  afterEach(() => {
    storage.clear();
  });

  describe('hydrate$', () => {
    it('should not dispatch with READ_SUCCESS when storage is not hydrated', fakeAsync(() => {
      let data;

      store.setState({ ...initialState,
        ion_ngx_storage: { hydrated: false }
      });

      actions = new ReplaySubject(1);
      actions.next({ type: ActionTypes.READ_SUCCESS });

      effects.hydrate$.subscribe(result => data = result);
      tick(500);
      expect(data).toBe(undefined);
    }));

    it('should dispatch with READ_SUCCESS when storage is hydrated', done => {
      store.setState({
        ...initialState,
        ion_ngx_storage: { hydrated: true }
      });

      actions = new ReplaySubject(1);
      actions.next({ type: ActionTypes.READ_SUCCESS });

      effects.hydrate$.subscribe(result => {
        expect(result).toEqual(HydrateSuccess());
        done();
      });
    });
  });

  describe('dehydrate$', () => {
    it('should not dispatch when storage is hydrated', fakeAsync(() => {
      let data;

      store.setState({
        ...initialState,
        ion_ngx_storage: { hydrated: false }
      });

      actions = new ReplaySubject(1);
      actions.next({ type: faker.random.uuid() });

      effects.dehydrate$.subscribe(result => data = result);
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
        effects.dehydrate$.subscribe(result => data = result);
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

      effects.dehydrate$.subscribe(result => {
        expect(result).toEqual(action);
        done();
      });
    });
  });
});
