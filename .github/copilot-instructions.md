# Team Dashboard — repository instructions

Angular 21, standalone components, signals, lazy routes, SCSS, Vitest. No NgModules.

## Project layout
- `src/app/shared/ui/<name>/` — shared UI components. Selector prefix `ui-`. Exported from `shared/ui/index.ts`.
- `src/app/features/<feature>/` — one routed page per folder. Selector prefix `app-`. Sub-components of a page live inside its folder (`features/tasks/task-form/`).
- `src/app/layout/` — sidebar and topbar. Anything that lives in the top bar or sidebar goes here, not in `features/`.
- `src/app/core/models/` — interfaces and types. `src/app/core/data/` — signal stores (`*.store.ts`), `labels.ts`, `storage.ts`, `dates.ts`.
- `src/styles/_tokens.scss` — the only file that may contain raw px, hex or rgba values.

## Conventions
- File names follow the Angular v20+ style guide: `tasks.ts`, `tasks.html`, `tasks.scss`. No `.component` suffix.
- Class names have no `Component` suffix: `export class Tasks`.
- Use `input()`, `output()`, `signal()`, `computed()`, `linkedSignal()` and `inject()`. No `@Input()`, no constructor injection.
- Use `@if` / `@for` / `@else` control flow. No `*ngIf` / `*ngFor`.
- Every component sets `changeDetection: ChangeDetectionStrategy.OnPush`.
- Mock data lives in a store under `core/data/`, typed with an interface from `core/models`, exposed as a `signal`.
- State that must survive a reload goes through `readStored` / `writeStored` from `core/data/storage.ts` with the `BROWSER_STORAGE` token — never `localStorage` directly.
- Labels, tones and icons for a status-like type live in `core/data/labels.ts` as `Record<Type, …>` maps. Add to that file; do not redefine them in a component.
- Relative dates use the helpers in `core/data/dates.ts`.

## Change scope
- Touch only the files the task needs. Do not reformat or reorder existing files.
- Do not add spec files unless asked. Existing specs must stay green.
- Finish with one `npx ng build`.

## Do not
- Do not add new npm dependencies.
- Do not add inline styles or inline SVG in templates.
