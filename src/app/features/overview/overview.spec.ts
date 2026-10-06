import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { MemoryStorage } from '../../../testing/memory-storage';
import { SettingsStore } from '../../core/data/settings.store';
import { BROWSER_STORAGE } from '../../core/data/storage';
import { Task } from '../../core/models';
import { Overview } from './overview';

function done(id: number, completedAt: string): Task {
  return { id, title: `Task ${id}`, owner: 'anna', project: 'Platform', status: 'done', priority: 'low', dueDate: '2026-10-20', estimateHours: 1, completedAt };
}

describe('Overview', () => {
  let storage: MemoryStorage;

  beforeEach(() => {
    storage = new MemoryStorage();
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2026, 9, 7, 9, 0)); // Wednesday 2026-10-07
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: 'tasks', children: [] }]), { provide: BROWSER_STORAGE, useValue: storage }],
    });
  });
  afterEach(() => vi.useRealTimers());

  async function render(tasks: Task[]): Promise<ComponentFixture<Overview>> {
    storage.setItem('team-dashboard.v1.tasks', JSON.stringify(tasks));
    const fixture = TestBed.createComponent(Overview);
    await fixture.whenStable();
    return fixture;
  }

  function doneTile(fixture: ComponentFixture<Overview>) {
    const tile = [...fixture.nativeElement.querySelectorAll('ui-stat')].find((el: HTMLElement) => el.textContent?.includes('Done this week'));
    return {
      value: tile.querySelector('.ui-stat__value').textContent.trim(),
      delta: tile.querySelector('.ui-stat__delta').textContent.replace(/\s+/g, ' ').trim(),
    };
  }

  // Sun 09-27 … Sat 10-03 | Sun 10-04 … Sat 10-10. Monday weeks: 09-28 … 10-04 | 10-05 … 10-11.
  const tasks = [done(1, '2026-09-28'), done(2, '2026-10-04'), done(3, '2026-10-05'), done(4, '2026-10-06'), done(5, '2026-10-07')];

  it('"Done this week" counts tasks completed since Monday and compares with last week', async () => {
    const fixture = await render(tasks);

    expect(doneTile(fixture)).toEqual({ value: '3', delta: '+50% vs last week' });
  });

  it('"Done this week" follows the week start from Settings', async () => {
    TestBed.inject(SettingsStore).save({ workspaceName: 'Platform', weekStart: 'sunday', capacityWarning: 80 });
    const fixture = await render(tasks);

    expect(doneTile(fixture)).toEqual({ value: '4', delta: '+300% vs last week' });
  });

  it('"Done this week" shows no change when nothing was completed last week', async () => {
    const fixture = await render([done(1, '2026-10-06')]);

    expect(doneTile(fixture)).toEqual({ value: '1', delta: '+0% vs last week' });
  });

  it('View all opens the task list', async () => {
    const fixture = await render(tasks);
    const viewAll = [...fixture.nativeElement.querySelectorAll('button')].find((b: HTMLElement) => b.textContent?.trim() === 'View all');

    viewAll.click();
    await fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe('/tasks');
  });
});
