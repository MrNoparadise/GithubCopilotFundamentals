import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { NewTask, Task, TaskStatus } from '../models';
import { DateRange, toIsoDate } from './dates';
import { BROWSER_STORAGE, readStored, writeStored } from './storage';

const STORAGE_KEY = 'tasks';

const SEED: Task[] = [
  { id: 1, title: 'Write repo instructions file', owner: 'anna', project: 'Platform', status: 'open', priority: 'high', dueDate: '2026-10-09', estimateHours: 4 },
  { id: 2, title: 'Add UI rules for spacing and colours', owner: 'tomas', project: 'Platform', status: 'in-progress', priority: 'high', dueDate: '2026-10-10', estimateHours: 6 },
  { id: 3, title: 'Review Figma MCP setup', owner: 'priya', project: 'Design system', status: 'blocked', priority: 'medium', dueDate: '2026-10-12', estimateHours: 3 },
  { id: 4, title: 'Switch off unused tools in Copilot', owner: 'anna', project: 'Platform', status: 'done', priority: 'low', dueDate: '2026-10-05', estimateHours: 1, completedAt: '2026-10-04' },
  { id: 5, title: 'Measure token spend per task', owner: 'luis', project: 'Platform', status: 'open', priority: 'medium', dueDate: '2026-10-16', estimateHours: 8 },
  { id: 6, title: 'Migrate badge component to tokens', owner: 'tomas', project: 'Design system', status: 'done', priority: 'medium', dueDate: '2026-10-03', estimateHours: 2, completedAt: '2026-10-02' },
  { id: 7, title: 'Export variables from the Figma library', owner: 'priya', project: 'Design system', status: 'in-progress', priority: 'high', dueDate: '2026-10-11', estimateHours: 5 },
  { id: 8, title: 'Reports API: weekly throughput endpoint', owner: 'luis', project: 'Reports', status: 'in-progress', priority: 'high', dueDate: '2026-10-14', estimateHours: 12 },
  { id: 9, title: 'Regression suite for the task table', owner: 'mei', project: 'Platform', status: 'open', priority: 'medium', dueDate: '2026-10-18', estimateHours: 10 },
  { id: 10, title: 'Accessibility pass on chips and filters', owner: 'mei', project: 'Design system', status: 'blocked', priority: 'low', dueDate: '2026-10-20', estimateHours: 4 },
  { id: 11, title: 'Settings page: notification preferences', owner: 'anna', project: 'Platform', status: 'open', priority: 'low', dueDate: '2026-10-22', estimateHours: 6 },
  { id: 12, title: 'Reports: cycle time chart', owner: 'luis', project: 'Reports', status: 'done', priority: 'medium', dueDate: '2026-10-02', estimateHours: 5, completedAt: '2026-09-30' },
  { id: 13, title: 'Team page: capacity bars', owner: 'tomas', project: 'Platform', status: 'done', priority: 'low', dueDate: '2026-10-04', estimateHours: 3, completedAt: '2026-10-05' },
  { id: 14, title: 'Prettier config for Angular templates', owner: 'mei', project: 'Platform', status: 'done', priority: 'low', dueDate: '2026-10-01', estimateHours: 1, completedAt: '2026-09-29' },
];

/** Tasks, saved to browser storage on every change so they survive a reload. */
@Injectable({ providedIn: 'root' })
export class TasksStore {
  private readonly storage = inject(BROWSER_STORAGE);

  readonly tasks = signal<Task[]>(this.load());

  constructor() {
    effect(() => writeStored(this.storage, STORAGE_KEY, this.tasks()));
  }

  readonly countByStatus = computed(() => {
    const counts: Record<TaskStatus, number> = { open: 0, 'in-progress': 0, blocked: 0, done: 0 };
    for (const t of this.tasks()) counts[t.status]++;
    return counts;
  });

  readonly hoursByOwner = computed(() => {
    const map = new Map<string, number>();
    for (const t of this.tasks()) {
      if (t.status === 'done') continue;
      map.set(t.owner, (map.get(t.owner) ?? 0) + t.estimateHours);
    }
    return map;
  });

  readonly projects = computed(() => [...new Set(this.tasks().map((t) => t.project))]);

  setStatus(id: number, status: TaskStatus): void {
    const today = toIsoDate(new Date());
    this.tasks.update((list) =>
      list.map((t) => (t.id === id ? { ...t, status, completedAt: status === 'done' ? (t.completedAt ?? today) : undefined } : t)),
    );
  }

  add(task: NewTask): void {
    this.tasks.update((list) => [...list, { ...task, id: Math.max(0, ...list.map((t) => t.id)) + 1, status: 'open' }]);
  }

  countDoneBetween(range: DateRange): number {
    return this.tasks().filter((t) => t.status === 'done' && !!t.completedAt && t.completedAt >= range.start && t.completedAt <= range.end).length;
  }

  /** Back to the sample data. */
  reset(): void {
    this.tasks.set(SEED);
  }

  private load(): Task[] {
    const saved = readStored<Task[]>(this.storage, STORAGE_KEY);
    return Array.isArray(saved) ? saved : SEED;
  }
}
