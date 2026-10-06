# Results and common questions

## What the result branches show

Four branches, one run each, Claude Sonnet, 2026-10-05. Results vary per run and per model; judge by the diff, not only the screen.

| Branch | `git diff --stat` against its base |
|---|---|
| `results/short-no-docs` | 9 files, 5 new, +480 / −271 (+211 / −2 with `-w`) |
| `results/short-with-docs` | 10 files, 5 new, +215 / −3 |
| `results/long-no-docs` | 29 files, 15 new, +1,055 / −9 |
| `results/long-with-docs` | 26 files, 11 new, +790 / −151 (+647 / −8 with `-w`) |

Which rules changed the output, strongest first:

- **Where it goes** (sub-component inside the page folder; top-bar things under `layout/`) — the clearest change, on the short and the long prompt. Folder placement is a project decision the code only hints at; the rule states it.
- **Change scope** (no reformatting, no spec files unless asked) — second. Without instruction files the short run rewrote three files it didn't need to touch (`overview.html`, `overview.ts`, `ui-icon.ts`), and the long run added four spec files. Scope rules are also cost rules and review-time rules.
- **Labels in `labels.ts`** — the reuse rule. Without it the model defined tones inside the component; with it, it extended the existing maps. A rule that names an existing file works better than a rule that describes a principle.
- **Tokens only, no hex** — changed nothing: both runs used tokens. On a consistent repo the code carries style rules by example. The line is still worth keeping (it is one line) for the day someone pastes a hex in.

Which rule was ignored: `results/long-with-docs` reformatted `settings.ts`, `settings.html` and `topbar.spec.ts` despite the "no reformatting" line. A scope rule lowers the odds; it is not a guarantee. Either reword the rule (shorter, more concrete, with an example) or move it to tooling.

## Instructions or linter?

| Put it in a linter / formatter / schematic | Put it in instructions |
|---|---|
| Formatting (Prettier) | Which component to use for what (`ui-card` for boxed content) |
| Import order, unused vars, `no-any` (ESLint) | Where new files go and why |
| Selector prefix (`@angular-eslint/component-selector`) | Mapping from domain concept to tone/colour (blocked → danger) |
| Max line length, naming case | "Do not add dependencies", "no spec files unless asked" |
| Anything with a fix-on-save | Anything that needs judgement or project knowledge |

Rule of thumb: if a machine can check it, let the machine check it and keep the line out of the instructions — it costs tokens on every request. Instructions are for what the machine cannot know. Where both exist (the selector prefix is lintable *and* in the demo's file), keep the instruction only while the lint rule is not in place.

The counter-argument: the instruction prevents the error, the linter only reports it after. True; the cost is tokens and drift between the two sources. A middle path: keep the instruction, but make it one line.

## Common questions

- **Does it work for Visual Studio / JetBrains / CLI?** `.github/copilot-instructions.md` is read by Copilot in VS, JetBrains, the CLI and the cloud coding agent. `.instructions.md` with `applyTo` and prompt files are VS Code features; check each IDE's docs. `AGENTS.md` is the cross-tool choice.
- **User-level instructions?** `~/.copilot/copilot-instructions.md` and `~/.copilot/instructions/` apply to every workspace for you only. Good for personal preferences, not team rules.
- **Monorepo — one file per app?** Yes: `.instructions.md` files with `applyTo: "apps/web/**"` etc. `chat.useCustomizationsInParentRepositories` (default false) controls reading from parent repos.
- **Does the cloud coding agent use them?** Yes — same `.github/copilot-instructions.md`. That is why the commit matters.
- **Can we enforce the instructions org-wide?** Org-level custom instructions exist for Copilot (org settings); repo files add to them. Admins can also push settings via `managed-settings.json`.
- **How long can the file be?** No documented hard limit found; the guidance is "short and self-contained". Every line is sent with every request. The demo's two files are 56 lines together.
- **Prompt files are "deprecated"?** For Agent Host sessions they are being migrated to agent skills; locally they still work. `/add-notifications-short` works today; expect to move it to a skill later.
- **Can I block a tool permanently?** Configure Tools state is per workspace. Tool sets let you save a named set and switch. For terminal commands, `chat.tools.terminal.autoApprove` has a deny list.
- **What about secrets in context?** Anything in the workspace can be attached or found by `#codebase`. Keep `.env` out of the workspace or in `files.exclude`; org content-exclusion policies exist for Business/Enterprise.
