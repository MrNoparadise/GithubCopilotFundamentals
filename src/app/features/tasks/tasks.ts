import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { PRIORITY_LABEL, PRIORITY_TONE, STATUSES, STATUS_LABEL, STATUS_TONE } from '../../core/data/labels';
import { MembersStore } from '../../core/data/members.store';
import { TasksStore } from '../../core/data/tasks.store';
import { Task, TaskPriority, TaskStatus } from '../../core/models';
import { UiAvatar, UiBadge, UiButton, UiCard, UiChip, UiEmpty, UiIcon } from '../../shared/ui';
import { TaskForm } from './task-form/task-form';

type SortKey = 'title' | 'owner' | 'dueDate' | 'priority' | 'estimateHours';
const PRIORITY_RANK: Record<TaskPriority, number> = { high: 0, medium: 1, low: 2 };
const SORT_COLUMNS: { key: SortKey; label: string }[] = [
  { key: 'title', label: 'Task' },
  { key: 'owner', label: 'Owner' },
  { key: 'priority', label: 'Priority' },
  { key: 'dueDate', label: 'Due' },
  { key: 'estimateHours', label: 'Est.' },
];
const DEFAULT_STATUSES: TaskStatus[] = ['open', 'in-progress', 'blocked'];

/**
 * Task list. Query params: `q` pre-fills the filter and shows every status (set by the top bar search);
 * `new` opens the new task form (set by both "New task" buttons).
 */
@Component({
  selector: 'app-tasks',
  imports: [DatePipe, UiCard, UiButton, UiBadge, UiChip, UiAvatar, UiEmpty, UiIcon, TaskForm],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tasks {
  private readonly tasksStore = inject(TasksStore);
  private readonly membersStore = inject(MembersStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly params = toSignal(this.route.queryParamMap, { requireSync: true });
  private readonly searchParam = computed(() => this.params().get('q') ?? '');

  protected readonly statuses = STATUSES;
  protected readonly sortColumns = SORT_COLUMNS;
  protected readonly counts = this.tasksStore.countByStatus;
  protected readonly composing = computed(() => this.params().has('new'));

  protected readonly activeStatuses = linkedSignal<Set<TaskStatus>>(() =>
    this.searchParam() ? new Set(STATUSES) : new Set(DEFAULT_STATUSES),
  );
  protected readonly query = linkedSignal(() => this.searchParam());
  protected readonly sortKey = signal<SortKey>('dueDate');
  protected readonly sortAsc = signal(true);

  protected readonly rows = computed(() => {
    const q = this.query().trim().toLowerCase();
    const active = this.activeStatuses();
    const key = this.sortKey();
    const dir = this.sortAsc() ? 1 : -1;
    return this.tasksStore
      .tasks()
      .filter((t) => active.has(t.status))
      .filter(
        (t) =>
          !q ||
          t.title.toLowerCase().includes(q) ||
          t.project.toLowerCase().includes(q) ||
          this.memberName(t.owner).toLowerCase().includes(q),
      )
      .sort((a, b) => this.compare(a, b, key) * dir);
  });

  protected readonly totalHours = computed(() => this.rows().reduce((s, t) => s + t.estimateHours, 0));

  protected toggleStatus(status: TaskStatus): void {
    this.activeStatuses.update((set) => {
      const next = new Set(set);
      next.has(status) ? next.delete(status) : next.add(status);
      return next;
    });
  }

  protected setQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected sortBy(key: SortKey): void {
    if (this.sortKey() === key) this.sortAsc.update((v) => !v);
    else {
      this.sortKey.set(key);
      this.sortAsc.set(true);
    }
  }

  protected ariaSort(key: SortKey): 'ascending' | 'descending' | null {
    if (this.sortKey() !== key) return null;
    return this.sortAsc() ? 'ascending' : 'descending';
  }

  protected openForm(): void {
    this.router.navigate([], { relativeTo: this.route, queryParams: { new: 1 }, queryParamsHandling: 'merge' });
  }

  protected closeForm(): void {
    this.router.navigate([], { relativeTo: this.route, queryParams: { new: null }, queryParamsHandling: 'merge' });
  }

  protected advance(task: Task): void {
    const next: Record<TaskStatus, TaskStatus> = { open: 'in-progress', 'in-progress': 'done', blocked: 'open', done: 'done' };
    this.tasksStore.setStatus(task.id, next[task.status]);
  }

  protected memberName(id: string): string {
    return this.membersStore.byId(id)?.name ?? id;
  }
  protected memberInitials(id: string): string {
    return this.membersStore.byId(id)?.initials ?? '?';
  }
  protected memberPhoto(id: string): string | undefined {
    return this.membersStore.byId(id)?.photoUrl;
  }
  protected statusLabel(s: TaskStatus): string {
    return STATUS_LABEL[s];
  }
  protected statusTone(s: TaskStatus) {
    return STATUS_TONE[s];
  }
  protected priorityTone(p: TaskPriority) {
    return PRIORITY_TONE[p];
  }
  protected priorityLabel(p: TaskPriority): string {
    return PRIORITY_LABEL[p];
  }

  private compare(a: Task, b: Task, key: SortKey): number {
    switch (key) {
      case 'priority':
        return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
      case 'estimateHours':
        return a.estimateHours - b.estimateHours;
      case 'owner':
        return this.memberName(a.owner).localeCompare(this.memberName(b.owner));
      default:
        return String(a[key]).localeCompare(String(b[key]));
    }
  }
}
