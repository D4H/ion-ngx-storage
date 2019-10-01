import faker from 'faker';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { TestBed } from '@angular/core/testing';

import { StorageService } from '../../lib/services';

describe('StorageService', () => {
  let key: string;
  let service: StorageService;
  let storage: Storage;
  let value: { [key: string]: string };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        IonicStorageModule.forRoot({ name: 'foo' })
      ],
      providers: [
        StorageService
      ]
    });

    service = TestBed.get(StorageService);
    storage = TestBed.get(Storage);
    key = faker.random.uuid();
    value = { [faker.random.uuid()]: faker.random.uuid() };
  });

  beforeEach(() => {
    storage.clear();
  });

  it('should instantiate Storage and StorageService', () => {
    expect(service).toBeTruthy();
    expect(storage).toBeTruthy();
  });

  describe('clear', () => {
    beforeEach(() => {
      spyOn(storage, 'clear').and.callThrough();
    });

    it('should be a function accessor', () => {
      expect(typeof service.clear).toBe('function');
      expect(service.clear.length).toBe(0);
    });

    it('should call storage.clear', () => {
      service.clear();
      expect(storage.clear).toHaveBeenCalled();
    });
  });

  describe('get', () => {
    beforeEach(() => {
      spyOn(storage, 'get').and.callThrough();
    });

    it('should be a function accessor', () => {
      expect(typeof service.get).toBe('function');
      expect(service.get.length).toBe(1);
    });

    it('should call storage.get', () => {
      service.get(key);
      expect(storage.get).toHaveBeenCalledWith(key);
    });

    it('should return an observable yielding the retrieved value', done => {
      service.set(key, value).subscribe(() => {
        service.get(key).subscribe(result => {
          expect(result).toEqual(value);
          done();
        });
      });
    });

    it('should get value from storage', done => {
      storage.set(key, value).then(stored => {
        service.get(key).subscribe(result => {
          expect(result).toEqual(stored);
          expect(result).toEqual(value);
          done();
        });
      });
    });
  });

  describe('set', () => {
    beforeEach(() => {
      spyOn(storage, 'set').and.callThrough();
    });

    it('should be a function accessor', () => {
      expect(typeof service.set).toBe('function');
      expect(service.set.length).toBe(2);
    });

    it('should call storage.set', () => {
      service.set(key, value);
      expect(storage.set).toHaveBeenCalledWith(key, value);
    });

    it('should set value in storage', done => {
      service.set(key, value).subscribe(() => {
        storage.get(key).then(result => {
          expect(result).toEqual(value);
          done();
        });
      });
    });

    it('should return an observable yielding the set value', done => {
      service.set(key, value).subscribe(result => {
        expect(result).toEqual(value);
        done();
      });
    });
  });
});
