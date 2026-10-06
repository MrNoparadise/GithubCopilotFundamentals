# Team Dashboard — Copilot workshop demo

Angular 21 app used in the session *Copilot beyond autocomplete*. Five routed pages
(Overview, Tasks, Team, Reports, Settings), a sidebar and top bar, nine shared UI
components and one token file. Mock data lives in signal stores; settings and task
changes survive a reload through `core/data/storage.ts`. No backend. Unit tests run
with `npm test` (Vitest).

`no-docs` is on purpose **bare**: no `.github/copilot-instructions.md`, no
`.github/instructions/`. The `with-docs` branch adds them. The workshop handouts are on
`main`, in the `workshop/` folder.

## Result branches

The session showed prepared results, one commit each, run on 2026-10-05 with Claude Sonnet
in Agent mode:

| Branch | Base | Prompt |
|---|---|---|
| `results/short-no-docs` | `no-docs` | `/add-notifications-short` |
| `results/short-with-docs` | `with-docs` | `/add-notifications-short` |
| `results/long-no-docs` | `no-docs` | `/add-notifications-center` |
| `results/long-with-docs` | `with-docs` | `/add-notifications-center` |

Compare with `git diff --stat <base> <branch>` (add `-w` to ignore whitespace).

## Run

```bash
npm install          # if it fails with "edgesOut": npm install --legacy-peer-deps
npm start            # http://localhost:4200
```

Needs Node 20.19+ or 22.12+ and npm 10+.

## The prompts

Both live in `.github/prompts/` so the text is identical every run. In Copilot Chat
(Agent mode) type the slash command:

- `/add-notifications-short` — the prompt from the session. A notifications panel on the Overview page,
  built as its own component, with tabs, unread count, dismiss and an empty state. Ends with
  one `npx ng build`, no tests.
- `/add-notifications-center` — the longer variant: bell in the top bar, dropdown, a
  Notifications page and persisted read state.

## Layout

```
src/
  styles/_tokens.scss            spacing scale, colours, radius, type — the only file with raw values
  styles.scss                    exposes tokens as CSS custom properties, base styles
  app/
    app.ts|html|scss             shell: sidebar + topbar + <router-outlet>
    app.routes.ts                lazy routes, one per feature
    layout/sidebar, layout/topbar
    core/models/                 Task, Member, Activity, WorkspaceSettings
    core/data/                   TasksStore, MembersStore, ActivityStore, SettingsStore (signals);
                                 labels.ts (status/priority/activity → label, tone, icon);
                                 storage.ts (localStorage with a test-friendly token); dates.ts
    shared/ui/                   ui-card, ui-button, ui-badge, ui-icon, ui-avatar, ui-stat,
                                 ui-progress, ui-chip, ui-empty  (selector prefix ui-, BEM classes)
    features/overview            KPI tiles, due-soon table, throughput bars, team load, activity feed
    features/tasks               filter chips, search, sortable table, status transitions, task-form
    features/team                member cards with capacity
    features/reports             cycle-time line, status share, per-project table
    features/settings            reactive form backed by SettingsStore
  testing/memory-storage.ts      in-memory Storage for specs
```

## Assets

- `public/avatars/` — team photos from [Unsplash](https://unsplash.com) (Unsplash License: free to use, no attribution required).
  Photo ids: anna `1580489944761-15a19d654956`, tomas `1570295999919-56ceb5ecca61`, priya `1544725176-7c40e5a71c5e`,
  luis `1507003211169-0a1dd7228f2d`, mei `1534528741775-53994a69daeb`. A missing photo falls back to initials.
- `public/fonts/inter-latin.woff2` — Inter (SIL Open Font License), self-hosted so the app looks the same offline.

## Run the prompts yourself

Make a worktree per side, run `npm install` in each, open each in its own VS Code window
and run the slash command in Agent mode:

```bash
git worktree add ../no-docs no-docs
git worktree add ../with-docs with-docs
```

Reset a worktree between runs:

```bash
git checkout -- . && git clean -fd src
```
