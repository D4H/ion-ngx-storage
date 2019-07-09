import traverse from 'traverse';

import { StorageModuleConfig } from '../providers';

/**
 * Pick Store States for Dehydration
 * =============================================================================
 * Pick up the selected top-level keys to store. LocalForage throws errors if
 * you attempt to write a moment or date object to the database, so these
 * objects are stringified.
 *
 * @see https://github.com/apollographql/apollo-client/issues/1871
 * @see https://github.com/D4H/decisions-project/issues/2937
 * @see https://stackoverflow.com/a/27585758/1433400
 */

export function pickState(state: object, config: StorageModuleConfig): object {
  return traverse(pick(state, config.states)).map(function(value: any): void {
    if (isMomentOrDate(value)) {
      this.update(JSON.stringify(value));
    }
  });
}

/**
 * Pick Values from Object
 * =============================================================================
 */

export function pick(obj: object, keys: Array<string>): object {
  return Object.keys(obj).filter(key => keys.includes(key)).reduce(
    (acc, key) => ({ ...acc, [key]: obj[key] }),
    {}
  );
}

/**
 * Is Object a Moment or Date?
 * =============================================================================
 * @see https://github.com/moment/moment/blob/2e2a5b35439665d4b0200143d808a7c26d6cd30f/src/lib/moment/constructor.js#L75-L77
 * @see https://github.com/moment/moment/blob/2e2a5b35439665d4b0200143d808a7c26d6cd30f/src/lib/utils/is-date.js
 */

export function isMomentOrDate(obj: any): boolean {
  return (
    obj && obj._isAMomentObject
    || obj instanceof Date || Object.prototype.toString.call(obj) === '[object Date]'
  );
}
