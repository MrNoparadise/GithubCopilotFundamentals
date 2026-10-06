---
name: add-notifications-center
description: Longer workshop prompt. Touches the rules the code cannot show by example. Run it once on the bare repo and once after instructions are in place.
agent: agent
---
Add notifications to the Team Dashboard.

**Bell in the top bar**
- Put a bell icon button to the left of the user's name. When there are unread notifications, show a small red counter on the bell.
- Clicking the bell opens a dropdown under it. Clicking outside the dropdown or pressing Escape closes it.

**The dropdown**
- Header: the title "Notifications", the number of unread items and a "Mark all as read" action.
- Tabs to filter by type: All, Info, Warning, Success, Error.
- A list of notifications. Each row shows an icon and colour for its type, the title, a one-line message, the photo of the teammate it is about (if any) and the time as relative text ("5 min ago", "2 h ago", "yesterday").
- Unread rows look different from read rows. Clicking a row marks it as read.
- Each row has a small × button that dismisses the notification.
- When nothing is left to show, show a friendly empty state.
- A "View all" link at the bottom opens the Notifications page.

**Notifications page**
- A new page at /notifications with its own entry in the sidebar.
- The same list and tabs as the dropdown, with more room.

**Data**
- 8 mock notifications spread over the four types; some are about teammates. No backend.
- Read and dismissed state survive a page reload.
