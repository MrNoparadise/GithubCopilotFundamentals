import { ChangeDetectionStrategy, Component, ElementRef, inject, viewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { MembersStore } from '../../core/data/members.store';
import { UiAvatar, UiButton, UiIcon } from '../../shared/ui';

const TITLES: Record<string, string> = {
  '/overview': 'Overview',
  '/tasks': 'Tasks',
  '/team': 'Team',
  '/reports': 'Reports',
  '/settings': 'Settings',
};

@Component({
  selector: 'app-topbar',
  imports: [DatePipe, UiAvatar, UiButton, UiIcon],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(window:keydown)': 'focusSearch($event)' },
})
export class Topbar {
  private readonly router = inject(Router);
  private readonly searchBox = viewChild.required<ElementRef<HTMLInputElement>>('searchBox');

  protected readonly user = inject(MembersStore).currentUser;
  protected readonly today = new Date();

  protected readonly title = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => TITLES[this.router.url.split('?')[0]] ?? 'Overview'),
      startWith(TITLES[this.router.url.split('?')[0]] ?? 'Overview'),
    ),
    { initialValue: 'Overview' },
  );

  protected newTask(): void {
    this.router.navigate(['/tasks'], { queryParams: { new: 1 }, queryParamsHandling: 'merge' });
  }

  /** Enter in the search box opens Tasks filtered by the text. */
  protected search(event: Event): void {
    const input = event.target as HTMLInputElement;
    const q = input.value.trim();
    if (!q) return;
    this.router.navigate(['/tasks'], { queryParams: { q } });
    input.value = '';
  }

  /** Ctrl+K (Cmd+K on Mac) jumps to the search box from anywhere. */
  protected focusSearch(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.searchBox().nativeElement.focus();
    }
  }
}
