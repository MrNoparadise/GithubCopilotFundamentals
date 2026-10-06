import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ActivityStore } from '../../core/data/activity.store';
import { addDays, weekRange } from '../../core/data/dates';
import { ACTIVITY_ICON, ACTIVITY_TEXT, ACTIVITY_TONE, STATUS_LABEL, STATUS_TONE } from '../../core/data/labels';
import { MembersStore } from '../../core/data/members.store';
import { SettingsStore } from '../../core/data/settings.store';
import { TasksStore } from '../../core/data/tasks.store';
import { Activity, TaskStatus } from '../../core/models';
import { UiAvatar, UiBadge, UiButton, UiCard, UiIcon, UiProgress, UiStat } from '../../shared/ui';

@Component({
  selector: 'app-overview',
  imports: [DatePipe, UiCard, UiButton, UiBadge, UiStat, UiAvatar, UiProgress, UiIcon],
  templateUrl: './overview.html',
  styleUrl: './overview.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Overview {
  private readonly tasksStore = inject(TasksStore);
  private readonly membersStore = inject(MembersStore);
  private readonly activityStore = inject(ActivityStore);
  private readonly settingsStore = inject(SettingsStore);
  private readonly router = inject(Router);

  protected readonly counts = this.tasksStore.countByStatus;
  protected readonly members = this.membersStore.members;
  protected readonly throughput = this.activityStore.throughput;
  protected readonly warnAt = computed(() => this.settingsStore.settings().capacityWarning);

  protected readonly greeting = computed(() => {
    const hour = new Date().getHours();
    return hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  });
  protected readonly firstName = computed(() => this.membersStore.currentUser().name.split(' ')[0]);

  /** Open tasks with a due date in the current week. */
  protected readonly dueThisWeek = computed(() => {
    const { start, end } = weekRange(new Date(), this.settingsStore.settings().weekStart);
    return this.tasksStore.tasks().filter((t) => t.status !== 'done' && t.dueDate >= start && t.dueDate <= end).length;
  });

  protected readonly doneThisWeek = computed(() =>
    this.tasksStore.countDoneBetween(weekRange(new Date(), this.settingsStore.settings().weekStart)),
  );
  private readonly doneLastWeek = computed(() =>
    this.tasksStore.countDoneBetween(weekRange(addDays(new Date(), -7), this.settingsStore.settings().weekStart)),
  );
  /** Percent change vs last week; 0 when nothing was done last week. */
  protected readonly doneDelta = computed(() => {
    const last = this.doneLastWeek();
    return last ? Math.round(((this.doneThisWeek() - last) / last) * 100) : 0;
  });

  protected readonly openHours = computed(() =>
    this.tasksStore.tasks().filter((t) => t.status !== 'done').reduce((sum, t) => sum + t.estimateHours, 0),
  );

  protected readonly dueSoon = computed(() =>
    [...this.tasksStore.tasks()]
      .filter((t) => t.status !== 'done')
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
      .slice(0, 6),
  );

  protected readonly load = computed(() => {
    const hours = this.tasksStore.hoursByOwner();
    return this.membersStore.members().map((m) => ({
      member: m,
      hours: hours.get(m.id) ?? 0,
      percent: Math.round(((hours.get(m.id) ?? 0) / m.capacityHours) * 100),
    }));
  });

  protected readonly activity = computed(() => this.activityStore.items().slice(0, 5));

  protected readonly maxThroughput = computed(() => Math.max(...this.throughput(), 1));
  protected readonly closedTotal = computed(() => this.throughput().reduce((a, b) => a + b, 0));

  protected memberName(id: string): string {
    return this.membersStore.byId(id)?.name ?? id;
  }

  protected memberInitials(id: string): string {
    return this.membersStore.byId(id)?.initials ?? '?';
  }

  protected memberPhoto(id: string): string | undefined {
    return this.membersStore.byId(id)?.photoUrl;
  }

  protected taskTitle(id: number): string {
    return this.tasksStore.tasks().find((t) => t.id === id)?.title ?? `#${id}`;
  }

  protected activityText(a: Activity): string {
    return ACTIVITY_TEXT[a.kind];
  }

  protected activityIcon(a: Activity) {
    return ACTIVITY_ICON[a.kind];
  }

  protected activityTone(a: Activity) {
    return ACTIVITY_TONE[a.kind];
  }

  protected tone(status: TaskStatus) {
    return STATUS_TONE[status];
  }

  protected label(status: TaskStatus): string {
    return STATUS_LABEL[status];
  }

  protected markDone(id: number): void {
    this.tasksStore.setStatus(id, 'done');
  }

  protected viewAll(): void {
    this.router.navigate(['/tasks']);
  }
}
