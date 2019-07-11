import { Action, ActionReducerFactory, MetaReducer } from '@ngrx/store';

/**
 * [TEMP] NgRx Feature Config
 * =============================================================================
 * Per the opened issue, StoreConfig is not exported by NgRX, although I can
 * confirm that parameters work just fine when passed in! Temporarily replicated
 * here until PR is merged and next NgRx maintenance release goes out.
 *
 * @see https://github.com/ngrx/platform/issues/2007
 * @see https://github.com/ngrx/platform/pull/2009
 */

export type TypeId<T> = () => T;

export type InitialState<T> = Partial<T> | TypeId<Partial<T>> | void;

export interface StoreConfig<T, V extends Action = Action> {
  initialState?: InitialState<T>;
  metaReducers?: Array<MetaReducer<T, V>>;
  reducerFactory?: ActionReducerFactory<T, V>;
}
