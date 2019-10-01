import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { Storage } from '@ionic/storage';

/**
 * Storage Service
 * =============================================================================
 * Minimal observable wrapper for Ionic Storage, for ease of development and
 * testing.
 */

@Injectable()
export class StorageService {
  constructor(private readonly storage: Storage) {}

  clear(): Observable<any> {
    return from(this.storage.clear());
  }

  get(key: string): Observable<any> {
    return from(this.storage.get(key));
  }

  set(key: string, value: any): Observable<any> {
    return from(this.storage.set(key, value));
  }
}
