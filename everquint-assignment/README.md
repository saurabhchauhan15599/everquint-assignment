# Team Workflow Board

A lightweight Kanban-style task management app for tracking a team's work across three status columns: **Backlog**, **In Progress**, and **Done**.

---

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

```bash
# Run tests
npm test

# Build for production
npm run build
```

---

## Architecture overview

### Stack

| Concern | Choice | Rationale |
|---|---|---|
| Framework | React 19 + TypeScript + Vite | Fast dev cycle, strong TS support |
| State | Zustand | Minimal boilerplate, no Provider wrapping needed, great DX for small-to-medium stores |
| Styling | Tailwind CSS v4 | Utility-first, consistent design tokens, no runtime overhead |
| UI primitives | shadcn/ui (Radix-based) | Accessible, unstyled components that we own — no dependency lock-in |
| DnD | @dnd-kit | Modern, accessible, tree-shakeable; `react-beautiful-dnd` is unmaintained |
| Routing | react-router-dom | Required for URL-synced filters |
| Date formatting | date-fns | Tree-shakeable, no global state |

### File structure

```
src/
├── types/          # All shared TypeScript types and constants
├── store/          # Zustand store (tasks, toasts, storage writes)
├── services/       # localStorage adapter + schema migration
├── hooks/          # useFilters (URL sync), useTaskForm, useFilteredTasks
├── utils/          # generateId, relativeTime, parseTags, clsx wrapper
├── components/
│   ├── ui/         # shadcn/ui primitives (Button, Dialog, Select, Badge…)
│   ├── board/      # Board, BoardColumn
│   ├── task/       # TaskCard, TaskForm, TaskDialog
│   └── filters/    # FilterBar
└── __tests__/      # Jest tests
```

### State management

Zustand was chosen over Context + useReducer because:
- No Provider boilerplate — components subscribe directly
- Straightforward to call `get()` / `set()` outside React (e.g. in storage helpers)
- Makes it easy to colocate actions with state without Redux's dispatch ceremony

The store owns task CRUD, toast queue, and storage error state. Filters live in the URL (via `useFilters`) rather than the store, keeping them shareable and bookmarkable.

### Data layer and schema migration

Tasks are stored in `localStorage` under the key `workflow-board-data`:

```json
{
  "schemaVersion": 2,
  "tasks": [...]
}
```

On load, the schema version is checked. If older than `CURRENT_SCHEMA_VERSION` (2), the migration function runs:

- **v1 → v2**: Adds `priority: "Medium"` and `tags: []` to tasks that predate those fields.

A non-intrusive info toast is shown after migration.

### Filters and URL sync

Filters (status, priority, text search, sort) are serialised into URL query params via `useFilters`. This means:
- Filters survive a page refresh
- Filter state is copy-pasteable and shareable
- No filter state lives in the Zustand store (separation of concerns)

---

## Known trade-offs and limitations

- **No backend / auth** — all data lives in localStorage. Clearing browser storage loses data.
- **No real-time collaboration** — a full app would need websockets or SSE.
- **`window.confirm` for destructive actions** — a proper inline confirmation dialog would be better UX for production. Used here to keep scope lean.
- **No pagination** — the board renders all tasks. A real product would paginate or virtualise long lists.

---

## Performance note

During development, the React DevTools profiler showed that `TaskCard` was re-rendering on every board state change even when the individual task data hadn't changed, because `Board` was passing new inline callback functions (`onEdit`, `onDelete`) on every render. Fixed by:

1. Wrapping `TaskCard` in `React.memo`
2. Wrapping `handleEditTask` and `handleDeleteTask` in `useCallback` inside `Board.tsx`

This eliminated unnecessary re-renders across all task cards when only one task changed status.
