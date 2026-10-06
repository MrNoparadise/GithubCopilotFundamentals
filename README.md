# GitHub Copilot fundamentals — "Copilot beyond autocomplete"

Material from a 60-minute session, October 2026: a demo Angular app, the same prompt run with
and without repository instruction files, the two instruction files, and the handouts.

Facts were checked against the pages in `workshop/handouts/05-sources.md` on 2026-10-05.
Copilot billing changed on 2026-06-01 and may change again; check the GitHub pages before you
rely on the numbers.

## Workshop materials

| Path | What it is |
|---|---|
| `workshop/handouts/01-setup-check.md` | Check your Copilot setup, the fix for each failure, and how to run the prompts yourself. |
| `workshop/handouts/02-cost-cheatsheet.md` | How Copilot is billed and five habits that cut spend. |
| `workshop/handouts/03-figma-mcp.md` | Figma through MCP: setup, tools, limits. |
| `workshop/handouts/04-results-and-faq.md` | What the result branches show, instructions vs. linter, common questions. |
| `workshop/handouts/05-sources.md` | Every external fact with its URL and date. |
| `workshop/reference-config/` | The two instruction files from the session, and an `mcp.json` with the Figma server added. |
| `workshop/screenshots/` | The app pages and the two short-prompt results. |

## Branches

| Branch | What it is |
|---|---|
| `no-docs` | The bare app: no instruction files. |
| `with-docs` | `no-docs` plus `.github/copilot-instructions.md` and `.github/instructions/ui.instructions.md`. |
| `results/short-no-docs` | `/add-notifications-short` run on `no-docs`. |
| `results/short-with-docs` | `/add-notifications-short` run on `with-docs`. |
| `results/long-no-docs` | `/add-notifications-center` run on `no-docs`. |
| `results/long-with-docs` | `/add-notifications-center` run on `with-docs`. |
| `main` | `no-docs` plus the `workshop/` folder and this README. |

One commit per result branch, one run each, Claude Sonnet in Agent mode, 2026-10-05.

## Start here

1. Run the app. Needs Node 20.19+ or 22.12+ and npm 10+.

   ```bash
   git clone https://github.com/MrNoparadise/GithubCopilotFundamentals.git
   cd GithubCopilotFundamentals
   npm install          # if it fails with "edgesOut": npm install --legacy-peer-deps
   npm start            # http://localhost:4200
   ```

2. Compare the results the way the session did, by the diff:

   ```bash
   git diff --stat no-docs   results/short-no-docs
   git diff --stat with-docs results/short-with-docs
   git diff --stat no-docs   results/long-no-docs
   git diff --stat with-docs results/long-with-docs
   ```

   Add `-w` to ignore whitespace. `workshop/handouts/04-results-and-faq.md` explains what the numbers show.

3. Run the prompts yourself on `no-docs` and `with-docs` (not on `main`):
   `workshop/handouts/01-setup-check.md`, section "Run the prompts yourself".

4. Add one rule to the instructions file of a project you work on this week, and check what
   it changes with `git diff --stat`.

## The demo app

Angular 21. Five routed pages (Overview, Tasks, Team, Reports, Settings), a sidebar and top
bar, nine shared UI components and one token file. Mock data lives in signal stores; settings
and task changes survive a reload through `core/data/storage.ts`. No backend. Unit tests run
with `npm test` (Vitest).

### The prompts

Both live in `.github/prompts/` so the text is identical every run. In Copilot Chat
(Agent mode) type the slash command:

- `/add-notifications-short` — the prompt from the session. A notifications panel on the Overview page,
  built as its own component, with tabs, unread count, dismiss and an empty state. Ends with
  one `npx ng build`, no tests.
- `/add-notifications-center` — the longer variant: bell in the top bar, dropdown, a
  Notifications page and persisted read state.

### Layout

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

### Assets

- `public/avatars/` — team photos from [Unsplash](https://unsplash.com) (Unsplash License: free to use, no attribution required).
  Photo ids: anna `1580489944761-15a19d654956`, tomas `1570295999919-56ceb5ecca61`, priya `1544725176-7c40e5a71c5e`,
  luis `1507003211169-0a1dd7228f2d`, mei `1534528741775-53994a69daeb`. A missing photo falls back to initials.
- `public/fonts/inter-latin.woff2` — Inter (SIL Open Font License), self-hosted so the app looks the same offline.
