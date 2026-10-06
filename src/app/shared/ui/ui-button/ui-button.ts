import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonType = 'button' | 'submit';

/**
 * Shared button. Projected content is the label. Use type="submit" inside a form.
 * For an icon with no text, set `iconOnly` and give the button a `label` for screen readers.
 */
@Component({
  selector: 'ui-button',
  templateUrl: './ui-button.html',
  styleUrl: './ui-button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiButton {
  readonly variant = input<ButtonVariant>('primary');
  readonly type = input<ButtonType>('button');
  readonly disabled = input<boolean>(false);
  readonly iconOnly = input<boolean>(false);
  /** aria-label; needed when the button shows only an icon. */
  readonly label = input<string | null>(null);
  /** aria-expanded, for a button that opens a menu or panel. Left off when null. */
  readonly expanded = input<boolean | null>(null);
}
