---
name: add-notifications-short
description: Short workshop prompt. Sized for a live run. Run it once on the bare repo and once after instructions are in place.
agent: agent
---
Add a notifications panel to the Overview page, under the stat tiles and above "Due soon". Build the panel as its own component.

- Show 6 mock notifications from a store. No backend. Each has a title, a one-line message, a time and a type: info, warning, success or error. Show an icon and colour for each type.
- Tabs at the top of the panel filter by type: All, Info, Warning, Success, Error.
- The panel heading shows the number of unread notifications, with a "Mark all as read" action.
- Each row has a small × button that dismisses it.
- When nothing is left to show, show a friendly empty state.

When done, run `npx ng build` once to check it compiles. Skip the test suite.
