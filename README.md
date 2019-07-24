[![Codeship Status for D4H/ion-ngx-storage](https://app.codeship.com/projects/2395cdd0-896c-0137-056a-1ede412c3fd8/status?branch=master)](https://app.codeship.com/projects/354562)
![npm](https://img.shields.io/npm/v/@d4h/ion-ngx-storage.svg)

# ion-ngx-storage
ion-ngx-storage is a module for Ionic 4/Angular applications which copies an application's [NgRx](https://ngrx.io/) root state to the native device or browser through [Ionic/Storage](https://ionicframework.com/docs/building/storage).

## Installation

`npm install --save @d4h/ion-ngx-storage`

## Configuration

```typescript
export interface StorageConfig<T extends object = {}> {
  features?: Array<string>;
  name: string;

  storage?: {
    description?: string;
    driver?: string | Array<string>;
    name?: string;
    size?: number;
    version?: number;
  }

  transform?: {
    read<T>(state: T): T;
    write<T>(state: T): T;
  }
}
```

* `features?: Array<string>`: Optional array of features to store to the device instead of the entire application state.
* `name: string`: The name of your application. Used internally as an Ionic Storage table key. All data is stored _per application_ as a single object.
* `storage?: StorageConfig`: [Ionic Storage](https://ionicframework.com/docs/building/storage#configuring-storage) configuration.
* `transform?: StorageStateTransform`: Transformations to be applied before being written to storage, and after being read. See [State Transform](#state-transformation) below.

## Default Configuration

```typescript
export const defaultConfig: StorageModuleConfig = {
  features: [],
  name: 'ION_NGX_STORAGE',

  storage: {
    name: 'ion_ngx_storage'
  },

  transform: {
    read: state => state,
    write: state => state
  }
};
```

## Use
Your module **must** import `StoreModule.forRoot` and `EffectsModule.forRoot` in order for ion-ngx-storage to function. After application initialization and initial hydration, ion-ngx-storage will write a copy of the state (or features) to the device after action dispatch.

```typescript
import { StorageConfig, StorageModule } from '@d4h/ion-ngx-storage';

const storageConfig: StorageConfig<AppState> = {
  name: 'my_application_name',
  features: ['foo']
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

## State Transformation
ion-ngx-storage builds upon other software. It directly calls [Ionic/Storage](https://ionicframework.com/docs/building/storage), which in turn uses [localForage](https://github.com/localForage/localForage), and which ultimately calls [`Storage.setItem`](https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem) for writes. localForage [serializes](https://github.com/localForage/localForage/blob/master/src/drivers/localstorage.js#L252-L274) data before it writes. Certain objects e.g. a Moment.js instance, cause operations to fail with an error.

The `read` and `write` functions transform the entire NgrX state.

```typescript
// _After_ read from storage.
function read<T>(state: T): T {
  return traverse(state).map(function(value: any): void {
    if (isIsoDate(value)) {
      this.update(new Date(value), true);
    }
  });
}

// _Before_ write to storage.
function write<T>(state: T): T {
  return traverse(state).map(function(value: any): void {
    if (isDateLike(value)) {
      this.update(value.toISOString());
    }
  });
}
```

### Waiting for Hydration
Internally, ion-ngx-storage operates in the following manner:

1. Register `StorageEffects` and `HydrateEffects`.
2. Dispatch `READ` from `HydrateEffects` with config payload.
3. Read state from storage, apply `transform.read` and dispatch `READ_SUCCESS`.
4. Merge the result into the application state via meta-reducer.
4. If `{ hydrated: true }` then dispatch `HYDRATE_SUCCESS`.

### HydrateSuccess Action
ion-ngx-storage makes the `HydrateSuccess` action public for use in NgRx effects.

```typescript
import { HydrateSuccess } from '@d4h/ion-ngx-storage';

@Injectable()
export class AppEffects {
  // Keep up splash screen until after hydration.
  init$: Observable<Action> = createEffect(
    () => this.actions$.pipe(
      ofType(HydrateSuccess),
      tap(() => {
        this.platform.ready().then(() => {
          this.statusBar.styleLightContent();
          this.splashScreen.hide();
        });
      })
    ),
    { dispatch: false }
  );

  constructor(/* ... */) {}
}
```

### Deferring Store Access
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
    select(selectHydratedStatus),
    filter(Boolean),
    switchMap(() => this.store.select(selectHydratedStatus))
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
Feel free to [open an issue](https://github.com/D4H/angular/issues/new), email <support@d4h.org> or tweet [@d4h](https://twitter.com/d4h/).

## License
Copyright (C) 2019 [D4H](https://d4htechnologies.com/)

Licensed under the [MIT](LICENSE) license.
