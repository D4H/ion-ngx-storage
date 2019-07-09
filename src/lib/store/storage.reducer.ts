import { createReducer, on } from '@ngrx/store';

import { HydrationSuccess } from './storage.actions';

export interface State {
  hydrated: boolean;
}

export const initialState: State = {
  hydrated: false
};

export const reducer = createReducer(
  initialState,

  on(HydrationSuccess, (state: State): State => ({
    hydrated: true
  }))
);
