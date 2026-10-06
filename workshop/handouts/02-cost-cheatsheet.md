# Copilot cost cheat sheet

Checked 2026-10-05 against GitHub and VS Code docs (links at the end). Billing changed on 2026-06-01; numbers may change again.

## How it is billed

- Unit: **AI credit = $0.01**. Usage = input + output + cached tokens, at each model's published rate.
- Included per month: Business **1,900 credits/seat**, Enterprise **3,900/seat**, Pro 1,500, Pro+ 7,000, Max 20,000. Org credits are **pooled**. No rollover. Reset on the 1st, 00:00 UTC.
- Overage ("additional usage") is **on by default**; admins set budgets per user, cost centre, org or enterprise.
- **Not billed:** inline code completions, next-edit suggestions.
- **Billed:** Chat (Ask/Agent/Plan), CLI, cloud coding agent, Spaces, Spark, third-party agents in VS Code.
- Auto model selection: **10% discount** on model cost.

Model rates (per 1M tokens, input / output): Claude Haiku 4.5 $1 / $5 · Claude Sonnet 5.5 $2 / $10 · Claude Opus 5.5 $4 / $20 · GPT-6 Luna $0.10–0.20 / $0.50–0.75 · GPT-5.5 $5–10 / $30–45. Check the pricing page for the current table.

**Illustration (not a measurement):** one agent turn with ~60k input tokens and ~3k output on Sonnet 5.5 ≈ $0.12 + $0.03 = **~15 credits**. A Business seat buys ~125 such turns. Input tokens dominate — and input is the context you carry.

## Where to see it

- Hover a chat response → credits used by that turn.
- Context-window indicator in the chat input → how full the context is and session cost.
- Status bar Copilot icon → monthly allowance used.
- `Developer: Show Chat Debug View` → the exact prompt sent, including instruction files and tool list.

## Five habits that cut spend (and improve output)

1. **New chat per task.** Ctrl+N / ⌘N in chat. Old turns are re-sent every time. Use `/compact` if you must continue.
2. **Attach fewer files.** Give the smallest authoritative set; let `#codebase` search for the rest. Exclude `dist/`, `node_modules/` via `.gitignore` / `search.exclude`.
3. **Switch off unused tools.** Every enabled tool's definition is sent each turn. Hard limit 128 per request; VS Code groups them into "virtual tools" above the `github.copilot.chat.virtualTools.threshold` (default 128). Use Configure Tools or tool sets per task.
4. **Short instructions.** Instruction files ride along on every request. One rule per line; drop anything a linter enforces.
5. **Right model for the job.** Auto for routine work; raise thinking effort or pick a top model only for the hard problem. Use Plan agent with a cheaper model for the exploration phase.

## Settings worth knowing

| Setting | Default | Why |
|---|---|---|
| `github.copilot.chat.codeGeneration.useInstructionFiles` | true | reads `.github/copilot-instructions.md` |
| `chat.useAgentsMdFile` | true | reads `AGENTS.md` |
| `chat.agent.maxRequests` | 25 | cap on tool-call rounds per turn |
| `chat.tools.global.autoApprove` | false | keep false; approve per tool instead |
| `chat.tools.terminal.autoApprove` | map | `rm`, `curl`, `chmod`… stay manual |
| `github.copilot.chat.virtualTools.threshold` | 128 | when tools get grouped |

## Sources

- GitHub: Plans — https://docs.github.com/en/copilot/get-started/plans
- GitHub: Usage-based billing for orgs — https://docs.github.com/en/copilot/concepts/billing/usage-based-billing-for-organizations-and-enterprises
- GitHub: Models and pricing — https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing
- GitHub: Auto model selection — https://docs.github.com/en/copilot/concepts/auto-model-selection
- VS Code: Optimize AI credit usage (2026-09-30) — https://code.visualstudio.com/docs/agents/guides/optimize-usage
- VS Code: Chat tools (2026-07-29) — https://code.visualstudio.com/docs/chat/chat-tools
- VS Code: AI settings reference (2026-09-30) — https://code.visualstudio.com/docs/agents/reference/ai-settings
