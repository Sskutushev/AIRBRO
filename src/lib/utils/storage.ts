/**
 * @file Manages safe and type-safe interactions with localStorage.
 * @module lib/utils/storage
 */

/**
 * A service for safely interacting with localStorage, providing automatic
 * prefixing, JSON serialization/deserialization, and error handling.
 */
class StorageService {
  private prefix: string;

  /**
   * Creates an instance of StorageService.
   * @param {string} [prefix='aibro_'] - The prefix to use for all localStorage keys.
   */
  constructor(prefix: string = 'aibro_') {
    this.prefix = prefix;
  }

  /**
   * Constructs the full key with the service's prefix.
   * @param {string} key - The original key.
   * @returns {string} The prefixed key.
   */
  private getPrefixedKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  /**
   * Sets a value in localStorage.
   * @template T The type of the value being stored.
   * @param {string} key - The key under which to store the value.
   * @param {T} value - The value to store.
   */
  set<T>(key: string, value: T): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      console.warn('localStorage is not available.');
      return;
    }
    try {
      const prefixedKey = this.getPrefixedKey(key);
      const serializedValue = JSON.stringify(value);
      window.localStorage.setItem(prefixedKey, serializedValue);
    } catch (error) {
      console.error(`Error setting item to localStorage for key "${key}":`, error);
    }
  }

  /**
   * Retrieves a value from localStorage.
   * @template T The expected type of the retrieved value.
   * @param {string} key - The key of the value to retrieve.
   * @returns {T | null} The retrieved value, or null if not found or an error occurs.
   */
  get<T>(key: string): T | null {
    if (typeof window === 'undefined' || !window.localStorage) {
      console.warn('localStorage is not available.');
      return null;
    }
    try {
      const prefixedKey = this.getPrefixedKey(key);
      const serializedValue = window.localStorage.getItem(prefixedKey);
      if (serializedValue === null) {
        return null;
      }
      return JSON.parse(serializedValue) as T;
    } catch (error) {
      console.error(`Error getting item from localStorage for key "${key}":`, error);
      return null;
    }
  }

  /**
   * Removes a value from localStorage.
   * @param {string} key - The key of the value to remove.
   */
  remove(key: string): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      console.warn('localStorage is not available.');
      return;
    }
    try {
      const prefixedKey = this.getPrefixedKey(key);
      window.localStorage.removeItem(prefixedKey);
    } catch (error) {
      console.error(`Error removing item from localStorage for key "${key}":`, error);
    }
  }

  /**
   * Clears all items from localStorage that have the service's prefix.
   * Note: This method iterates through all keys. For large storage, consider performance.
   */
  clear(): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      console.warn('localStorage is not available.');
      return;
    }
    try {
      for (let i = window.localStorage.length - 1; i >= 0; i--) {
        const key = window.localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          window.localStorage.removeItem(key);
        }
      }
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
}

/**
 * A singleton instance of StorageService for application-wide use.
 * @type {StorageService}
 */
export const storage = new StorageService();
