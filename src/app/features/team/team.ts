import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MembersStore } from '../../core/data/members.store';
import { SettingsStore } from '../../core/data/settings.store';
import { TasksStore } from '../../core/data/tasks.store';
import { UiAvatar, UiBadge, UiCard, UiProgress } from '../../shared/ui';

@Component({
  selector: 'app-team',
  imports: [UiCard, UiAvatar, UiBadge, UiProgress],
  templateUrl: './team.html',
  styleUrl: './team.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Team {
  private readonly membersStore = inject(MembersStore);
  private readonly tasksStore = inject(TasksStore);
  private readonly settingsStore = inject(SettingsStore);

  protected readonly warnAt = computed(() => this.settingsStore.settings().capacityWarning);

  protected readonly cards = computed(() => {
    const hours = this.tasksStore.hoursByOwner();
    const tasks = this.tasksStore.tasks();
    return this.membersStore.members().map((m) => {
      const mine = tasks.filter((t) => t.owner === m.id);
      const h = hours.get(m.id) ?? 0;
      return {
        member: m,
        hours: h,
        percent: Math.round((h / m.capacityHours) * 100),
        open: mine.filter((t) => t.status !== 'done').length,
        blocked: mine.filter((t) => t.status === 'blocked').length,
        done: mine.filter((t) => t.status === 'done').length,
      };
    });
  });
}
