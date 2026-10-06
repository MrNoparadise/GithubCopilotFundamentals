import { Injectable, effect, inject, signal } from '@angular/core';
import { WorkspaceSettings } from '../models';
import { BROWSER_STORAGE, readStored, writeStored } from './storage';

const STORAGE_KEY = 'settings';

const DEFAULTS: WorkspaceSettings = {
  workspaceName: 'Platform · Q4 2026',
  weekStart: 'monday',
  capacityWarning: 80,
};

/** Workspace settings, saved to browser storage so they survive a reload. */
@Injectable({ providedIn: 'root' })
export class SettingsStore {
  private readonly storage = inject(BROWSER_STORAGE);

  readonly settings = signal<WorkspaceSettings>({ ...DEFAULTS, ...readStored<Partial<WorkspaceSettings>>(this.storage, STORAGE_KEY) });

  constructor() {
    effect(() => writeStored(this.storage, STORAGE_KEY, this.settings()));
  }

  save(settings: WorkspaceSettings): void {
    this.settings.set(settings);
  }

  /** Back to the defaults. */
  reset(): void {
    this.settings.set(DEFAULTS);
  }
}
