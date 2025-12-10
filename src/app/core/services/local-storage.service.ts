import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private readonly STORAGE_PREFIX = 'gatze_';

  get<T>(key: string, defaultValue: T) {
    const stored = localStorage.getItem(`${this.STORAGE_PREFIX}${key}`);
    return stored ? (JSON.parse(stored) as T) : defaultValue;
  }

  set<T>(key: string, value: T) {
    localStorage.setItem(`${this.STORAGE_PREFIX}${key}`, JSON.stringify(value));
  }

  remove(key: string) {
    localStorage.removeItem(`${this.STORAGE_PREFIX}${key}`);
  }
}
