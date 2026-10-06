---
applyTo: "src/app/**/*.{ts,html,scss}"
---
# UI rules

## Spacing and sizes
- Use only the spacing scale from `src/styles/_tokens.scss`: `t.$space-1` (4px) … `t.$space-12` (48px).
- Each component SCSS starts with `@use 'styles/tokens' as t;`.
- Gap between cards or tiles: `t.$space-4`. Padding inside a card body: `t.$space-4`. Between page sections: `t.$space-6`.
- Fixed sizes come from `t.$size-*`, radii from `t.$radius-sm|md|lg|full`, shadows from `t.$shadow-*`, focus from `t.$ring-focus`, motion from `t.$transition-fast`.

## Colours
- Use only token colours (`t.$color-*`). Never write a hex or rgba value in a component.
- Status colours: info → `info`, warning → `warning`, success → `success`, error → `danger`. Use the `*-soft` variant for backgrounds and the base variant for text and icons.
- Muted text uses `t.$color-text-muted`. Links and accents use `t.$color-primary`. On the dark sidebar use `t.$color-on-dark*`.

## Components
- Boxed content goes in `<ui-card heading="...">`. Header actions use the `card-actions` attribute slot.
- Buttons are `<ui-button variant="primary|secondary|ghost" type="button|submit">`. Never a bare `<button>` in a feature — a ghost `ui-button` with an icon is the dismiss/close button.
- Status labels are `<ui-badge tone="...">`. Filter tabs are `<ui-chip [active] [count] (toggled)>`. KPI tiles are `<ui-stat>`. People are `<ui-avatar [initials] [src]>`. Empty lists are `<ui-empty title="...">`.
- Icons are `<ui-icon name="...">`. A missing icon gets a path in `ui-icon.ts`; never inline SVG in a feature.
- Reuse these before creating a new element. If a new shared component is needed: folder `src/app/shared/ui/ui-<name>/`, selector `ui-<name>`, class `Ui<Name>`, exported from `src/app/shared/ui/index.ts`.

## Naming
- Feature components: folder `src/app/features/<feature>/`, selector `app-<feature>`, registered as a lazy route in `app.routes.ts`. Sub-components: `features/<feature>/<sub>/`, selector `app-<sub>`.
- CSS classes use BEM with the selector as block: `.ui-card__header`, `.tasks__row-actions`, `.ui-stat--danger`.
