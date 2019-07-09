/**
 * Storage Configuration
 * =============================================================================
 * Extracted from LocalForage.
 *
 * @see https://github.com/localForage/localForage#configuration
 * @see https://github.com/localForage/localForage/blob/7428cfc4a6fd60ac00346619b923bfb8e17e399a/typings/localforage.d.ts#L1-L15
 */

interface StorageConfig {
  description?: string;
  driver?: string | Array<string>;
  name?: string;
  size?: number;
  storeName?: string;
  version?: number;
}

export const TEMP_config: StorageConfig = {
  name: 'org.d4h.personnel'
};

// Injection key?
export const TEMP_key: string = 'D4H_PERSONNEL_STORAGE';

export const TEMP_storedStates: Array<string> = [
  'accounts',
  'members',
  'memberships',
  'servers'
];
