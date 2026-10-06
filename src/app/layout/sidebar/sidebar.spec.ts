import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MemoryStorage } from '../../../testing/memory-storage';
import { SettingsStore } from '../../core/data/settings.store';
import { BROWSER_STORAGE } from '../../core/data/storage';
import { Sidebar } from './sidebar';

describe('Sidebar', () => {
  it('shows the workspace name saved in Settings', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: BROWSER_STORAGE, useValue: new MemoryStorage() }] });
    const fixture = TestBed.createComponent(Sidebar);
    await fixture.whenStable();

    TestBed.inject(SettingsStore).save({ workspaceName: 'Platform · Q1 2027', weekStart: 'monday', capacityWarning: 80 });
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.sidebar__workspace-name').textContent.trim()).toBe('Platform · Q1 2027');
  });
});
