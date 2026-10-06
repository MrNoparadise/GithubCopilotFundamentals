import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconName, UiIcon } from '../ui-icon/ui-icon';

/** Empty state: icon, title, projected hint text. */
@Component({
  selector: 'ui-empty',
  imports: [UiIcon],
  template: `
    <div class="ui-empty">
      <ui-icon class="ui-empty__icon" [name]="icon()" />
      <p class="ui-empty__title">{{ title() }}</p>
      <p class="ui-empty__hint"><ng-content /></p>
    </div>
  `,
  styleUrl: './ui-empty.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiEmpty {
  readonly icon = input<IconName>('list');
  readonly title = input.required<string>();
}
