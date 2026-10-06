import { TestBed } from '@angular/core/testing';
import { MemoryStorage } from '../../../testing/memory-storage';
import { SettingsStore } from '../../core/data/settings.store';
import { BROWSER_STORAGE } from '../../core/data/storage';
import { Team } from './team';

describe('Team', () => {
  beforeEach(() => {
    const storage = new MemoryStorage();
    // Luis has 40 h a week; 24 h open = 60 %.
    storage.setItem(
      'team-dashboard.v1.tasks',
      JSON.stringify([{ id: 1, title: 'Big one', owner: 'luis', project: 'Reports', status: 'open', priority: 'high', dueDate: '2026-10-20', estimateHours: 24 }]),
    );
    TestBed.configureTestingModule({ providers: [{ provide: BROWSER_STORAGE, useValue: storage }] });
  });

  it.each([
    [80, 'Available', 'primary'],
    [50, 'Near capacity', 'warning'],
  ])('capacity warning at %i: a 60 percent load shows "%s" and a %s bar', async (capacityWarning, badge, bar) => {
    TestBed.inject(SettingsStore).save({ workspaceName: 'Platform', weekStart: 'monday', capacityWarning });
    const fixture = TestBed.createComponent(Team);
    await fixture.whenStable();

    const card = [...fixture.nativeElement.querySelectorAll('ui-card')].find((c: HTMLElement) => c.textContent?.includes('Luis Ortega'));
    expect(card.querySelector('ui-badge').textContent.trim()).toBe(badge);
    expect(card.querySelector('.ui-progress__bar').classList).toContain(`ui-progress__bar--${bar}`);
  });
});
