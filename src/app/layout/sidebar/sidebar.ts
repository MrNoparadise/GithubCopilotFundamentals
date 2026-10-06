import { ChangeDetectionStrategy, Component, Signal, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SettingsStore } from '../../core/data/settings.store';
import { TasksStore } from '../../core/data/tasks.store';
import { IconName, UiIcon } from '../../shared/ui';

interface NavItem {
  label: string;
  icon: IconName;
  path: string;
  count?: Signal<number>;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, UiIcon],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar {
  private readonly settingsStore = inject(SettingsStore);
  private readonly tasksStore = inject(TasksStore);

  protected readonly workspaceName = computed(() => this.settingsStore.settings().workspaceName);

  /** Tasks that are not done, shown next to "Tasks". */
  private readonly openTasks = computed(() => {
    const c = this.tasksStore.countByStatus();
    return c.open + c['in-progress'] + c.blocked;
  });

  protected readonly items: NavItem[] = [
    { label: 'Overview', icon: 'home', path: '/overview' },
    { label: 'Tasks', icon: 'list', path: '/tasks', count: this.openTasks },
    { label: 'Team', icon: 'users', path: '/team' },
    { label: 'Reports', icon: 'chart', path: '/reports' },
    { label: 'Settings', icon: 'settings', path: '/settings' },
  ];
}
