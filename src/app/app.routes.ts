import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'overview' },
  { path: 'overview', loadComponent: () => import('./features/overview/overview').then((m) => m.Overview) },
  { path: 'tasks', loadComponent: () => import('./features/tasks/tasks').then((m) => m.Tasks) },
  { path: 'team', loadComponent: () => import('./features/team/team').then((m) => m.Team) },
  { path: 'reports', loadComponent: () => import('./features/reports/reports').then((m) => m.Reports) },
  {
    path: 'notifications',
    loadComponent: () => import('./features/notifications/notifications').then((m) => m.Notifications),
  },
  { path: 'settings', loadComponent: () => import('./features/settings/settings').then((m) => m.Settings) },
  { path: '**', redirectTo: 'overview' },
];
