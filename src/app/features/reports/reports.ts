import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivityStore } from '../../core/data/activity.store';
import { STATUS_LABEL, STATUS_TONE } from '../../core/data/labels';
import { TasksStore } from '../../core/data/tasks.store';
import { TaskStatus } from '../../core/models';
import { UiBadge, UiCard, UiProgress, UiStat } from '../../shared/ui';

interface ProjectRow {
  project: string;
  total: number;
  done: number;
  blocked: number;
  hours: number;
  percentDone: number;
}

@Component({
  selector: 'app-reports',
  imports: [UiCard, UiStat, UiBadge, UiProgress],
  templateUrl: './reports.html',
  styleUrl: './reports.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Reports {
  private readonly tasksStore = inject(TasksStore);
  private readonly activityStore = inject(ActivityStore);

  protected readonly throughput = this.activityStore.throughput;
  protected readonly cycleTime = this.activityStore.cycleTimeDays;
  protected readonly counts = this.tasksStore.countByStatus;

  protected readonly closedTotal = computed(() => this.throughput().reduce((a, b) => a + b, 0));
  protected readonly avgCycle = computed(() => {
    const s = this.cycleTime();
    return (s.reduce((a, b) => a + b, 0) / s.length).toFixed(1);
  });
  protected readonly maxCycle = computed(() => Math.max(...this.cycleTime()));

  protected readonly statusShare = computed(() => {
    const c = this.counts();
    const total = c.open + c['in-progress'] + c.blocked + c.done || 1;
    return (['open', 'in-progress', 'blocked', 'done'] as TaskStatus[]).map((s) => ({
      status: s,
      label: STATUS_LABEL[s],
      tone: STATUS_TONE[s],
      count: c[s],
      percent: Math.round((c[s] / total) * 100),
    }));
  });

  protected readonly byProject = computed<ProjectRow[]>(() => {
    const map = new Map<string, ProjectRow>();
    for (const t of this.tasksStore.tasks()) {
      const row = map.get(t.project) ?? { project: t.project, total: 0, done: 0, blocked: 0, hours: 0, percentDone: 0 };
      row.total++;
      if (t.status === 'done') row.done++;
      if (t.status === 'blocked') row.blocked++;
      if (t.status !== 'done') row.hours += t.estimateHours;
      map.set(t.project, row);
    }
    return [...map.values()].map((r) => ({ ...r, percentDone: Math.round((r.done / r.total) * 100) }));
  });

  protected linePoints(series: number[], max: number): string {
    const step = 100 / (series.length - 1);
    return series.map((v, i) => `${(i * step).toFixed(1)},${(40 - (v / max) * 36).toFixed(1)}`).join(' ');
  }
}
