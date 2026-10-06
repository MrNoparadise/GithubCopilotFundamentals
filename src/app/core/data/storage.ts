import { DOCUMENT, InjectionToken, inject } from '@angular/core';

/** The browser's localStorage, or null where there is none (blocked, server). Tests provide their own. */
export const BROWSER_STORAGE = new InjectionToken<Storage | null>('BROWSER_STORAGE', {
  providedIn: 'root',
  factory: () => {
    try {
      return inject(DOCUMENT).defaultView?.localStorage ?? null;
    } catch {
      return null;
    }
  },
});

const PREFIX = 'team-dashboard.v1.';

/** Parsed value saved under `key`, or undefined if there is none or it is not valid JSON. */
export function readStored<T>(storage: Storage | null, key: string): T | undefined {
  try {
    const raw = storage?.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : undefined;
  } catch {
    return undefined;
  }
}

export function writeStored(storage: Storage | null, key: string, value: unknown): void {
  try {
    storage?.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Storage full or blocked: the app keeps working from memory.
  }
}
