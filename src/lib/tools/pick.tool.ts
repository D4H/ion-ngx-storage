/**
 * Pick from Object
 * =============================================================================
 * Returns object as-is when no keys are supplied.
 */

export function pickFeatures<T extends object>(
  state: T,
  keys: Array<string> = []
): Partial<T> {
  if (keys && keys.length) {
    return keys.reduce(
      (acc: Partial<T>, key: string): Partial<T> => ({ ...acc, [key]: state[key] }),
      {} as Partial<T>
    );
  } else {
    return state;
  }
}
