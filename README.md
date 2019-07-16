[![Codeship Status for D4H/ion-ngx-storage](https://app.codeship.com/projects/8ec182c0-643f-0137-757e-1a7608ff9ea0/status?branch=master)](https://app.codeship.com/projects/344846)
![npm](https://img.shields.io/npm/v/@d4h/ion-ngx-storage.svg)

# ion-ngx-storage
ion-ngx-storage is a module for Ionic 4/Angular applications which synchronizes an application's [NgRx](https://ngrx.io/) root state to the native device or browser through [Ionic/Storage](https://ionicframework.com/docs/building/storage).

In NgRx store, all eagerly-loaded feature states are visible from the perspective of the root application state. During application initialization ion-ngx-storage reads the last-written state from the device and merges it into the root state using a [meta-reducer](https://ngrx.io/guide/store/metareducers). Thereafter it writes the state to the device whenever an action is dispatched.

## Installation

`npm install --save @d4h/ion-ngx-storage`

## Configuration
`StorageModuleConfig` accepts these configuration options:

* `name: string`: The name of your application. Used internally as an Ionic Storage table key. All data is stored _per application_ as a single object.
* `states?: Array<string>`: Optional array of store states to store to the device instead of the entire application state.
* `reducer: string`: Name of the reducer in the implementing application. This is necessary for ion-ngx-storage to determine whether hydration has completed successfully.
* `ionicStorage: StorageConfig`: [Ionic Storage](https://ionicframework.com/docs/building/storage#configuring-storage) configuration.

## Use
ion-ngx-storage **must** be added to the root state. `StorageModule` injects its meta reducer through the [`META_REDUCERS`](https://next.ngrx.io/guide/store/recipes/injecting#injecting-meta-reducers) provider.

```typescript
import {
  StorageEffects,
  StorageModule,
  StorageState,
  storageReducer
} from '@d4h/ion-ngx-storage';

// 1. Add StorageState to AppState
export interface AppState {
  foo: FooState;
  bar: BarState;
  storage: StorageState;
}

// 2. Add storageReducer to application reducers.
export const reducers: ActionReducerMap<AppState> = {
  foo: fooReducer,
  bar: barReducer,
  storage: storageReducer
};

export const metaReducers: Array<MetaReducer<AppState>> = [
  logger
];

// 3. Add StorageEffects to root effects.
const effects: Array<any> = [
  StorageEffects
];

// 4. Declare StorageConfig. In this case, ion-ngx-storage will only save FooState.
const storageConfig = {
  name: 'my_application_name',
  reducer: 'storage',
  states: ['foo']
};

@NgModule({
  imports: [
    StorageModule.forRoot(storageConfig),
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot(effects)
  ]
})
export class AppModule {}
```

## Deferring Store Access
Although ion-ngx-storage hydrates data from storage once NgRx Effects dispatches `ROOT_EFFECTS_INIT`, the asynchronous nature of Angular and NgRx make it likely your application will attempts to read from the state it is ready. Applications which rely on the NgRx store to determine i.e. authentication status must be modified in a way which defers assessment until after hydration. Take the below example:

1. `AccountFacade` is a [facade](https://medium.com/@thomasburlesonIA/ngrx-facades-better-state-management-82a04b9a1e39). Its `authenticated$` accessors defers emitting a value until after hydration.
2. [`filter(Boolean)`](https://www.learnrxjs.io/operators/filtering/filter.html) causes only _truthy_ values to emit.
3. Once this happens, [`switchMap`](https://www.learnrxjs.io/operators/transformation/switchmap.html) replaces the prior observable with a new one that contains the actual assessment of authentication status.

```typescript
import { selectHydrationStatus } from '@d4h/ion-ngx-storage';
import { selectAuthenticationStatus } from '@app/store/account';

@Injectable({ providedIn: 'root' })
export class AccountFacade {
  readonly authenticated$: Observable<boolean> = this.store.pipe(
    select(selectHydrationStatus),
    filter(Boolean),
    switchMap(() => this.store.select(selectAuthenticationStatus))
  );

  constructor(private readonly store: Store<State>) {}
}
```

```typescript
import { AccountFacade } from '@app/store/account';

@Injectable({ providedIn: 'root' })
export class AuthenticatedGuard implements CanActivate {
  constructor(
    private readonly accounts: AccountFacade,
    private readonly router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.accounts.authenticated$.pipe(
      map((authenticated: boolean): boolean | UrlTree => {
        return authenticated || this.router.parseUrl('/login');
      })
    );
  }
}
```

## Support and Feedback
Feel free to [open an issue](https://github.com/D4H/ion-ngx-storage/issues/new), email <support@d4h.org> or tweet [@d4h](https://twitter.com/d4h/)!

## License
Copyright (C) 2019 [D4H](https://d4htechnologies.com/)

Licensed under the [MIT](LICENSE) license.
