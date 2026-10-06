import { TestBed } from '@angular/core/testing';
import { MemoryStorage } from '../../../testing/memory-storage';
import { SettingsStore } from './settings.store';
import { BROWSER_STORAGE } from './storage';

const KEY = 'team-dashboard.v1.settings';

describe('SettingsStore', () => {
  let storage: MemoryStorage;

  function startApp(): SettingsStore {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [{ provide: BROWSER_STORAGE, useValue: storage }] });
    return TestBed.inject(SettingsStore);
  }

  beforeEach(() => (storage = new MemoryStorage()));

  it('keeps saved settings for the next start of the app', () => {
    startApp().save({ workspaceName: 'Platform · Q1 2027', weekStart: 'sunday', capacityWarning: 60 });
    TestBed.tick();

    expect(startApp().settings()).toEqual({ workspaceName: 'Platform · Q1 2027', weekStart: 'sunday', capacityWarning: 60 });
  });

  it('fills settings missing from the saved copy with the defaults', () => {
    storage.setItem(KEY, JSON.stringify({ workspaceName: 'Old name' }));

    expect(startApp().settings()).toEqual({ workspaceName: 'Old name', weekStart: 'monday', capacityWarning: 80 });
  });

  it('reset goes back to the defaults', () => {
    const store = startApp();
    store.save({ workspaceName: 'Changed', weekStart: 'sunday', capacityWarning: 95 });

    store.reset();

    expect(store.settings()).toEqual({ workspaceName: 'Platform · Q4 2026', weekStart: 'monday', capacityWarning: 80 });
  });
});
