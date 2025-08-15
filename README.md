# v11 — Fix chat overflow

- `CardContent` uses `min-h-0` so the ScrollArea owns the scroll.
- `ScrollArea` forwards the **viewport ref** and has `h-full` root.
- The input row is `shrink-0` so it stays pinned at the bottom.

Deploy over v10.
