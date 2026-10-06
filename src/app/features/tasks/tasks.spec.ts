import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { MemoryStorage } from '../../../testing/memory-storage';
import { BROWSER_STORAGE } from '../../core/data/storage';
import { Task } from '../../core/models';
import { Tasks } from './tasks';

const TASKS: Task[] = [
  { id: 1, title: 'Write docs', owner: 'anna', project: 'Platform', status: 'open', priority: 'high', dueDate: '2026-10-09', estimateHours: 2 },
  { id: 2, title: 'Fix chips', owner: 'mei', project: 'Design system', status: 'open', priority: 'low', dueDate: '2026-10-12', estimateHours: 3 },
  { id: 3, title: 'Old cleanup', owner: 'mei', project: 'Platform', status: 'done', priority: 'medium', dueDate: '2026-10-01', estimateHours: 1, completedAt: '2026-10-01' },
];

describe('Tasks', () => {
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    const storage = new MemoryStorage();
    storage.setItem('team-dashboard.v1.tasks', JSON.stringify(TASKS));
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: 'tasks', component: Tasks }]), { provide: BROWSER_STORAGE, useValue: storage }],
    });
    harness = await RouterTestingHarness.create();
  });

  const el = (): HTMLElement => harness.routeNativeElement as HTMLElement;
  const titles = () => [...el().querySelectorAll('.tasks__title')].map((e) => e.textContent?.trim());
  const header = (label: string) => [...el().querySelectorAll<HTMLElement>('th')].find((th) => th.textContent?.trim() === label)!;
  const button = (label: string) => [...el().querySelectorAll<HTMLButtonElement>('button')].find((b) => b.textContent?.trim() === label)!;

  async function click(target: HTMLElement): Promise<void> {
    target.click();
    await harness.fixture.whenStable();
  }

  /** Column label → aria-sort, for the columns that have one. */
  function sortState(): Record<string, string | null> {
    return Object.fromEntries(
      [...el().querySelectorAll('th[aria-sort]')].map((th) => [th.textContent?.trim(), th.getAttribute('aria-sort')]),
    );
  }

  it('marks the sorted column and its direction', async () => {
    await harness.navigateByUrl('/tasks', Tasks);
    expect(sortState()).toEqual({ Due: 'ascending' });
    expect(header('Due').querySelectorAll('ui-icon').length).toBe(1);
    expect(header('Task').querySelectorAll('ui-icon').length).toBe(0);

    await click(header('Due').querySelector('button')!);
    expect(sortState()).toEqual({ Due: 'descending' });
    expect(titles()).toEqual(['Fix chips', 'Write docs']);

    await click(header('Task').querySelector('button')!);
    expect(sortState()).toEqual({ Task: 'ascending' });
    expect(header('Due').querySelectorAll('ui-icon').length).toBe(0);
  });

  it('search from the top bar (?q=) matches owner names across all statuses', async () => {
    await harness.navigateByUrl('/tasks?q=mei', Tasks);

    expect(el().querySelector<HTMLInputElement>('.tasks__search input')!.value).toBe('mei');
    expect(titles()).toEqual(['Old cleanup', 'Fix chips']);
  });

  it('?new=1 opens the new task form and Cancel closes it', async () => {
    await harness.navigateByUrl('/tasks?new=1', Tasks);
    expect(el().querySelector('app-task-form')).not.toBeNull();

    await click(button('Cancel'));

    expect(el().querySelector('app-task-form')).toBeNull();
    expect(TestBed.inject(Router).url).toBe('/tasks');
  });
});
