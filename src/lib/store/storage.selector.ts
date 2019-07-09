import { createSelector } from '@ngrx/store';

import { StorageState, selectStorageState } from '@app/store/storage/state';

/**
 * Select Hydrated Status
 * =============================================================================
 * Has the store completed hydration, true or false?
 */

export const selectHydrationStatus = createSelector(
  selectStorageState,
  (state: StorageState): boolean => state.hydrated
);
