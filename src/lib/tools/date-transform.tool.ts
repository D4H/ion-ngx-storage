import isIsoDate from 'is-iso-date';
import traverse from 'traverse';

import { IonNgxStateTransform } from '../providers';

/**
 * Transform State for Read/Write
 * =============================================================================
 * It is necessary for D4H applications tot stringify Date and Moment objects
 * before write becasue LocalForage errors out when passsed these.
 *
 * @see https://github.com/D4H/decisions-project/issues/2937
 * @see https://github.com/apollographql/apollo-client/issues/1871
 * @see https://stackoverflow.com/a/27585758/1433400
 */

export function read<T>(state: T): T {
  return traverse(state).map(function(value: any): void {
    if (isIsoDate(value)) {
      this.update(new Date(value), true);
    }
  });
}

export function write<T>(state: T): T {
  return traverse(state).map(function(value: any): void {
    if (isDateLike(value)) {
      this.update(value.toISOString());
    }
  });
}

export const dateTransform: IonNgxStateTransform = {
  write,
  read
};

/**
 * Is Object Datelike?
 * =============================================================================
 * Extracted from isMoment() and isDate() in moment.js
 *
 * @see https://github.com/moment/moment/blob/2e2a5b35439665d4b0200143d808a7c26d6cd30f/src/lib/moment/constructor.js#L75-L77
 * @see https://github.com/moment/moment/blob/2e2a5b35439665d4b0200143d808a7c26d6cd30f/src/lib/utils/is-date.js
 */

export function isDateLike(value: any): boolean {
  return Boolean(value) && (
    value._isAMomentObject
    || value instanceof Date
    || Object.prototype.toString.call(value) === '[object Date]'
  );
}
