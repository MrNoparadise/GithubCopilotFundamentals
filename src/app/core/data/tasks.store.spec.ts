import { TestBed } from '@angular/core/testing';
import { MemoryStorage } from '../../../testing/memory-storage';
import { Task, TaskStatus } from '../models';
import { BROWSER_STORAGE } from './storage';
import { TasksStore } from './tasks.store';

const KEY = 'team-dashboard.v1.tasks';

function task(id: number, status: TaskStatus, completedAt?: string): Task {
  return { id, title: `Task ${id}`, owner: 'anna', project: 'Platform', status, priority: 'low', dueDate: '2026-10-20', estimateHours: 1, completedAt };
}

describe('TasksStore', () => {
  let storage: MemoryStorage;
  const saved = (): Task[] => JSON.parse(storage.getItem(KEY) ?? 'null');

  beforeEach(() => {
    storage = new MemoryStorage();
    TestBed.configureTestingModule({ providers: [{ provide: BROWSER_STORAGE, useValue: storage }] });
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2026, 9, 7, 10, 0)); // Wednesday 2026-10-07
  });
  afterEach(() => vi.useRealTimers());

  it('stamps today as the completion date when a task is marked done', () => {
    storage.setItem(KEY, JSON.stringify([task(1, 'open')]));
    const store = TestBed.inject(TasksStore);

    store.setStatus(1, 'done');

    expect(store.tasks()[0].completedAt).toBe('2026-10-07');
  });

  it('clears the completion date when a done task is reopened', () => {
    storage.setItem(KEY, JSON.stringify([task(1, 'done', '2026-10-05')]));
    const store = TestBed.inject(TasksStore);

    store.setStatus(1, 'open');

    expect(store.tasks()[0].completedAt).toBeUndefined();
  });

  it('counts tasks completed inside a date range, both ends included', () => {
    storage.setItem(
      KEY,
      JSON.stringify([task(1, 'done', '2026-10-04'), task(2, 'done', '2026-10-05'), task(3, 'done', '2026-10-11'), task(4, 'done', '2026-10-12'), task(5, 'open')]),
    );
    const store = TestBed.inject(TasksStore);

    expect(store.countDoneBetween({ start: '2026-10-05', end: '2026-10-11' })).toBe(2);
  });

  it('saves added tasks to storage with the next free id', () => {
    storage.setItem(KEY, JSON.stringify([task(3, 'open'), task(7, 'done', '2026-10-01')]));
    const store = TestBed.inject(TasksStore);

    store.add({ title: 'Write tests', owner: 'mei', project: 'Platform', priority: 'low', dueDate: '2026-10-20', estimateHours: 2 });
    TestBed.tick();

    expect(saved().map((t) => [t.id, t.title, t.status])).toEqual([
      [3, 'Task 3', 'open'],
      [7, 'Task 7', 'done'],
      [8, 'Write tests', 'open'],
    ]);
  });

  it('uses the sample data when nothing valid is saved', () => {
    storage.setItem(KEY, '{not json');
    const store = TestBed.inject(TasksStore);

    expect(store.tasks().length).toBe(14);
  });

  it('reset brings back the sample data and saves it', () => {
    storage.setItem(KEY, JSON.stringify([task(1, 'open')]));
    const store = TestBed.inject(TasksStore);

    store.reset();
    TestBed.tick();

    expect(store.tasks().length).toBe(14);
    expect(saved().length).toBe(14);
  });
});
