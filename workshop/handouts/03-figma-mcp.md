# Figma via MCP

How a Figma frame reaches the Copilot agent, what comes back, and what to check before you try it. Slides 23–25. Sources in `05-sources.md`.

## How a frame reaches the agent

1. **A frame in Figma, built with variables.** Colours, spacing, radius, type as named variables. A frame with raw values returns nothing useful from `get_variable_defs`.
2. **Figma MCP server.** Remote: `https://mcp.figma.com/mcp`, available on all seats and plans; write tools free during beta. Desktop alternative: the Figma app serves `http://127.0.0.1:3845/mcp` (Dev or Full seat on paid plans). Sign-in is OAuth, once.
3. **VS Code · Copilot agent.** One entry in `.vscode/mcp.json`: `{ "servers": { "figma": { "type": "http", "url": "https://mcp.figma.com/mcp" } } }`, then **Start** above the entry. Or **MCP: Add Server → HTTP**. Read tools: `get_design_context`, `get_variable_defs`, `get_screenshot`, `get_metadata`, `get_figjam`, `get_code_connect_map`. Remote-only: `search_design_system`, `get_libraries`, `download_assets`, `use_figma`, `generate_figma_design`, `generate_diagram`, `create_new_file`.
4. **Your repo.** The agent maps what it read onto your tokens (`_tokens.scss` in the demo repo); the instruction files decide where the component goes and which tokens it may use. A value with no token should be reported, not invented. The demo's `ui.instructions.md` has no line for this; add one if you try it.

## What comes back from one frame

The table on slide 24 is an illustration, not a real export. The three tool calls are real; the variable names and values are made up to show the three outcomes:

- exact match (`color/text/muted` → `t.$color-text-muted`),
- near match: use the token and flag the difference (`radius/row` 16 vs token 14),
- no token (`space/row-padding` 28): the agent should say so instead of writing `28px` into a component.

Why not screenshot the frame? A screenshot gives the model pixels to guess from; `get_variable_defs` gives names and numbers. The guess is where hex values and odd pixel sizes come from.

## Before you try it

- Org policy **"MCP servers in Copilot"** (Business/Enterprise) must be enabled; admins can restrict to a registry. VS Code setting `chat.mcp.access` must not be `none`.
- Read-tool rate limits: Starter view seats 20/month; Pro/Org/Enterprise view seats 6/month; Dev/Full seats 200/day (Pro, Org) or 600/day (Enterprise), plus a per-minute cap.
- The frame must use variables; otherwise it is a design-system conversation, not a tooling one.
- Design context for a large frame is big: import in a chat of its own, then start a new chat to build.
- Each enabled MCP server adds tools to every request (see `02-cost-cheatsheet.md`). Switch Figma off when not using it.

## Common questions

- **Does it write back to Figma?** Yes, remote server only (`use_figma`, `generate_figma_design`), free during beta.
- **Does it work with Copilot Business?** Yes, if the org policy above is on. The seat question is on the Figma side.
- **Is MCP stable?** GA in VS Code since 1.102 (July 2025).
- **Can I try it on the demo repo?** `workshop/reference-config/.vscode/mcp.json` has the entry. You need a Figma file with variables; the demo repo has none.
