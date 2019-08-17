[![Codeship Status for D4H/ion-ngx-storage](https://app.codeship.com/projects/3862bfd0-911f-0137-6172-7e8373628817/status?branch=master)](https://app.codeship.com/projects/356368)
![npm](https://img.shields.io/npm/v/@d4h/ion-ngx-storage.svg)

# @d4h/ion-ngx-storage
ion-ngx-storage is a module for Ionic 4/Angular applications which copies an application's [NgRx](https://ngrx.io/) root state to the native device or browser through [Ionic/Storage](https://ionicframework.com/docs/building/storage).

## Installation

`npm install --save @d4h/ion-ngx-storage`

## Configuration

```typescript
interface StorageConfig<T extends object = {}> {
  features?: Array<string>;
  name: string;

  storage?: {
    description?: string;
    driver?: string | Array<string>;
    name?: string;
    size?: number;
    version?: number;
  }
}
```

* `features?: Array<string>`: Optional array of features to store to the device instead of the entire application state.
* `name: string`: The name of your application. Used internally as an Ionic Storage table key. All data is stored _per application_ as a single object.
* `storage?: StorageConfig`: [Ionic Storage](https://ionicframework.com/docs/building/storage#configuring-storage) configuration.

### Default Configuration

```typescript
const defaultConfig: StorageConfig = {
  features: [],
  name: 'ion_ngx_storage',

  storage: {
    name: 'ion_ngx_storage'
  }
};
```

## Use
Import and call `StoreModule.forRoot()`. ion-ngx-storage read and write the application state without any additional configuration. After effects initialization, ion-ngx-storage writes a serialized copy of the root state to the device after each action dispatch.

```typescript
import { StorageConfig, StorageModule } from '@d4h/ion-ngx-storage';

// Optional configuration
const storageConfig: StorageConfig<AppState> = {
  name: 'my_application_name',
  features: ['foo']
};

@NgModule({
  imports: [
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot(effects),
    StorageModule.forRoot(storageConfig)
  ]
})
export class AppModule {}
```

Your application **must** import `StoreModule.forRoot` and `EffectsModule.forRoot` in order for ion-ngx-storage to function.

### Waiting for Hydration
Internally, ion-ngx-storage operates in the following manner:

1. Register `StorageEffects` and `HydrateEffects`.
2. Dispatch `Read` from `HydrateEffects`.
3. Read state from storage and dispatch `ReadResult`.
4. Merge the result into the application state via meta-reducer.
4. If `{ hydrated: true }` then dispatch `ReadSuccess`.

## ReadSuccess Action
ion-ngx-storage makes the `ReadSuccess` action public for use in NgRx effects.

```typescript
import { ReadSuccess } from '@d4h/ion-ngx-storage';

@Injectable()
export class AppEffects {
  // Keep up splash screen until after hydration.
  init$: Observable<Action> = createEffect(() => this.actions$.pipe(
      ofType(ReadSuccess),
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

## Inject Configuration
The public `STORAGE_CONFIG` token allows injection of the configuration in cases of module composition.

```typescript
import { STORAGE_CONFIG, StorageConfig, StorageModule } from '@d4h/ion-ngx-storage';

@NgModule({
  imports: [
    StorageModule
  ]
})
export class AppFeatureModule {
  static forFeature(config: FeatureConfig): ModuleWithProviders {
    return {
      ngModule: AppFeatureModule,
      providers: [
        { provide: STORAGE_CONFIG, useValue: config.storage }
      ]
    };
  }
}
```

## Selecting Storage Status
ion-ngx-storage makes `StorageState` available for cases where you need to select or extend the state:

```typescript
import { StorageState } from '@d4h/ion-ngx-storage';

export interface AppState extends StorageState {
  // ...
}
```

After this you can employ the `getHydrated` and `getStorageState` selectors.

## Defer Store Access
Although ion-ngx-storage hydrates data from storage once NgRx Effects dispatches `ROOT_EFFECTS_INIT`, the asynchronous nature of Angular and NgRx make it likely your application will attempts to read from the state it is ready. Applications which rely on the NgRx store to determine i.e. authentication status must be modified in a way which defers assessment until after hydration.

In both cases below:

1. [`filter(Boolean)`](https://www.learnrxjs.io/operators/filtering/filter.html) leads to only truthy values emitting.
2. Once this happens, [`switchMap`](https://www.learnrxjs.io/operators/transformation/switchmap.html) replaces the prior observable with a new one that contains the actual assessment of authentication status.

### AccountFacade

```typescript
import { StorageFacade } from '@d4h/ion-ngx-storage';

@Injectable({ providedIn: 'root' })
export class AccountFacade {
  readonly authenticated$: Observable<boolean> = this.storage.hydrated$.pipe(
    filter(Boolean),
    switchMap(() => this.store.select(getAuthenticated))
  );

  constructor(
    private readonly storage: StorageFacade,
    private readonly store: Store<AppState>
  ) {}
}
```

### AuthenticatedGuard

```typescript
import { AccountFacade } from '@app/store/account';

@Injectable({ providedIn: 'root' })
export class AuthenticatedGuard implements CanActivate {
  private readonly authenticated$: Observable<boolean>;

  constructor(
    private readonly accounts: AccountFacade,
    private readonly router: Router
    ) {
      this.authenticated$ = this.store.pipe(
        select(getHydrated),
        filter(Boolean),
        switchMap(() => this.store.select(getAuthentication))
      );
    }

  canActivate(): Observable<boolean | UrlTree> {
    return this.authenticated$.pipe(
      map((authenticated: boolean): boolean | UrlTree => {
        return authenticated || this.router.parseUrl('/login');
      })
    );
  }
}
```

## Logout/Reinitialization
Many applications have some kind of logout action which resets the application to its in initial state. In these cases ion-ngx-storage resets to `{ hydrated: false }`, meaning it will no longer write device state to storage. In these cases you have to dispatch one `Clear` or `Read`:

* `Clear`: Wipe the stored application state and triggers `Read` with an initial empty value.
* `Read`: Reads the logged-out state and triggers reducer setting `{ hydrated: true }`.

The difference in practice is whether you want to remove all content stored on the device.

```typescript
import { Read } from '@d4h/ion-ngx-storage';

class LoginEffects {
  logout$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(Logout),
    switchMap(() => [
      Read(),
      Navigate({ path: ['/login', 'username'] })
    ])
  ));
}
```

## Support and Feedback
Feel free to email <support@d4h.org> or tweet [@d4h](https://twitter.com/d4h/).

## License
Copyright (C) 2019 [D4H](https://d4htechnologies.com/)

Licensed under the [MIT](LICENSE) license.
