import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Shared card container. Use for every boxed block of content.
 * Content is projected; an optional heading renders in the header row.
 */
@Component({
  selector: 'ui-card',
  templateUrl: './ui-card.html',
  styleUrl: './ui-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiCard {
  readonly heading = input<string>('');
}
