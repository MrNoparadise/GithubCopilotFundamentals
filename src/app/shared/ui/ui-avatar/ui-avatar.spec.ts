import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiAvatar } from './ui-avatar';

describe('UiAvatar', () => {
  let fixture: ComponentFixture<UiAvatar>;

  async function render(inputs: Record<string, unknown>): Promise<void> {
    fixture = TestBed.createComponent(UiAvatar);
    for (const [key, value] of Object.entries(inputs)) fixture.componentRef.setInput(key, value);
    await fixture.whenStable();
  }

  const img = (): HTMLImageElement | null => fixture.nativeElement.querySelector('img');
  const text = (): string => fixture.nativeElement.textContent.trim();

  it('shows the photo when a source is given', async () => {
    await render({ initials: 'AK', name: 'Anna Keller', src: '/avatars/anna.jpg' });

    expect(img()?.getAttribute('src')).toBe('/avatars/anna.jpg');
    expect(img()?.alt).toBe('Anna Keller');
    expect(text()).toBe('');
  });

  it('shows the initials when there is no photo', async () => {
    await render({ initials: 'KM', name: 'Kirill Moroz' });

    expect(img()).toBeNull();
    expect(text()).toBe('KM');
  });

  it('falls back to the initials when the photo fails to load', async () => {
    await render({ initials: 'AK', name: 'Anna Keller', src: '/avatars/missing.jpg' });

    img()!.dispatchEvent(new Event('error'));
    await fixture.whenStable();

    expect(img()).toBeNull();
    expect(text()).toBe('AK');
  });
});
