# Setup check

The three checks from the "Setup" part of the session, with the fix for each failure. Then how
to run the demo repo and the prompts yourself.

## Check 1 — Agent appears in the mode/agent picker

Open Copilot Chat (Ctrl+Alt+I / ⌃⌘I). The picker at the bottom of the chat box should offer **Ask / Agent / Plan**.

| Symptom | Fix |
|---|---|
| Only "Ask" | Update the *GitHub Copilot Chat* extension (Extensions → Updates). Reload window. |
| No chat at all / "Sign in" button | Status bar → Copilot icon → sign in. Use the GitHub account that holds the Business seat, not a personal one. |
| Agent greyed out | Org policy: an admin must enable agent mode / "Copilot in VS Code" features for the org. Ask the Copilot admin. |
| "Edit" shown instead of Agent | Very old VS Code. Edit mode was removed; update VS Code. |

## Check 2 — Model picker lists at least two models

Click the model name in the chat box.

| Symptom | Fix |
|---|---|
| One model, no dropdown | Org policy: Business/Enterprise members need the admin to allow switching models. Until then, use the default model; instruction files work the same. |
| Model you expect is missing | Pre-GA and some models are off by default in the org policy. Use any listed model. |
| Picker shows "Auto" only | Fine. Auto picks a model and gives a 10% discount. |

## Check 3 — Tools list opens and shows the `angular-cli` server

Open the demo repo in VS Code. Click the tools icon (Configure Tools) in the chat box, or type `#` and look at the list.

| Symptom | Fix |
|---|---|
| No MCP servers shown | Open `.vscode/mcp.json` in the repo → click **Start** above the server. First start runs `npx -y @angular/cli mcp` and needs network. |
| "MCP servers are disabled" | Setting `chat.mcp.access` is `none`, or org policy "MCP servers in Copilot" is off. Not needed for instruction files; needed for Figma MCP. |
| Error "maximum of 128 tools" | Deselect a server in Configure Tools. |

## Run the demo repo

```
git clone https://github.com/MrNoparadise/GithubCopilotFundamentals.git
cd GithubCopilotFundamentals
npm install
npm start        # http://localhost:4200
```

`no-docs` is the bare app. `with-docs` adds the two instruction files. `main` is `no-docs` plus the `workshop/` folder. The session's results are commits on four branches:

```
git diff --stat no-docs   results/short-no-docs
git diff --stat with-docs results/short-with-docs
git diff --stat no-docs   results/long-no-docs
git diff --stat with-docs results/long-with-docs
```

To see a result in the browser, check out its branch and start the app:

```
git checkout results/short-with-docs
npm start
```

## Run the prompts yourself

Run them on `no-docs` and `with-docs`, not on `main`: the agent can find the instruction files under `workshop/` and mix them into the "no docs" run.

Make a worktree per side, install, and open each one in its own VS Code window:

```
git worktree add ../no-docs no-docs
git worktree add ../with-docs with-docs
cd ../no-docs   && npm install
cd ../with-docs && npm install
```

In Copilot Chat, Agent mode, type the slash command:

- `/add-notifications-short` — the prompt from the session.
- `/add-notifications-center` — the longer one.

To run both apps at once, start the second on another port: `npm start -- --port 4201`.

Reset a worktree between runs with `git checkout -- . && git clean -fd src`.

Results vary per run and per model. Compare your `git diff --stat` with the result branches, not only what you see on screen.

### The app does not run

| Symptom | Fix |
|---|---|
| `npm install` → `Cannot read properties of null (reading 'edgesOut')` | `npm install --legacy-peer-deps` |
| `ng` needs Node ≥ 20.19 / 22.12 | Install Node 22 LTS. |
| Port 4200 in use | `npm start -- --port 4201` |

### Prompt file does not expand

Typing `/add-notifications-short` shows nothing → the prompt files are in `.github/prompts/` and are found only when the repo folder, not a parent, is the VS Code workspace root. Fallback: open `.github/prompts/add-notifications-short.prompt.md` and paste the text below the front matter into the chat.
