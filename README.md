# Gridory

[English](README.md) · [Español](README.es.md)

React components for data-heavy apps: a table, a kanban board, an AI assistant and sign-in and
sign-up forms that emit events instead of mutating your data.

> Private repository, version 1.0.0. Publication on npm is pending; until then the package is
> consumed from this repository.

## Why Gridory

- **One data model, several views.** Table and kanban read the same rows and field definitions.
- **Event-driven.** Changes reach you as callbacks; the data you pass in is never mutated.
- **The assistant asks before acting.** `onAction` fires only after the user confirms a proposal.
- **Typed end to end.** Components are generic over your row type, with no `any` in the public API.

## Modules

| Import | What it includes |
|---|---|
| `gridory` | Everything below except the stylesheet and the preset: components, hooks, helpers, constants and types. |
| `gridory/table` | `DataTable` and its types, plus the shared data-model, toolbar and row-action exports. |
| `gridory/kanban` | `KanbanBoard` and its types, plus the same shared exports. |
| `gridory/ai` | `AIChatSidebar`, `AIChatButton`, `useAIChat`, the provider presets, the prompt builders, the default texts and the assistant types. |
| `gridory/auth` | `LoginForm`, `SignUpForm`, their default texts and fields, the configuration errors and the auth types. |
| `gridory/segmented-control` | `SegmentedControl` and its types. |
| `gridory/styles.css` | The compiled stylesheet for every module, with the light and dark tokens. |
| `gridory/tailwind-preset` | Optional Tailwind preset that maps the `--gdy-*` tokens to shadcn-style theme keys (`bg-primary`, `border-border`) for your own markup. |

## Installation

```bash
npm install gridory
```

`react` and `react-dom` (18.2 or later, or 19) are peer dependencies. Until the package is on npm,
build it from a clone with `npm run build`, then either run `npm link` there and `npm link gridory`
in your app, or run `npm pack` and install the generated tarball.

Import the stylesheet once, before your own CSS, so that a rule of yours with the same selector as a
library rule wins. Tailwind is not required.

```ts
import "gridory/styles.css";
```

The built-in UI texts are Spanish (`"Buscar..."`, `"Nuevo"`, the menu labels, the assistant
messages). Every one of them can be replaced through props, listed in each guide.

## Quick start

### Table

```tsx
import { DataTable, type ColumnDefinition } from "gridory/table";

type Lead = { id: string; name: string; status: string };

const leads: Lead[] = [
  { id: "1", name: "Acme", status: "new" },
  { id: "2", name: "Globex", status: "won" },
];

const columns: ColumnDefinition<Lead>[] = [
  { id: "name", header: "Name", accessor: (row) => row.name, searchable: true, sortable: true },
  { id: "status", header: "Status", accessor: (row) => row.status, filterable: true },
];

export const LeadsTable = () => (
  <DataTable columns={columns} data={leads} getRowId={(row) => row.id} />
);
```

Guide: [docs/table.md](docs/table.md).

### Kanban

```tsx
import { KanbanBoard, type ColumnDefinition, type KanbanGroupOption } from "gridory/kanban";

type Task = { id: string; title: string; status: string };

const tasks: Task[] = [
  { id: "1", title: "Write the brief", status: "todo" },
  { id: "2", title: "Review the design", status: "done" },
];

const fields: ColumnDefinition<Task>[] = [
  { id: "title", header: "Title", accessor: (card) => card.title, searchable: true },
];

const statusGroup: KanbanGroupOption<Task> = {
  id: "status",
  label: "Status",
  accessor: (card) => card.status,
  setValue: (card, status) => ({ ...card, status }),
  values: [{ value: "todo", label: "To do" }, { value: "done", label: "Done" }],
};

const saveTask = (task: Task) =>
  fetch(`/api/tasks/${task.id}`, { method: "PATCH", body: JSON.stringify(task) });

export const TasksBoard = () => (
  <KanbanBoard
    fields={fields}
    data={tasks}
    groups={[statusGroup]}
    defaultGroupId="status"
    getCardId={(card) => card.id}
    onCardMove={({ updatedCard }) => saveTask(updatedCard)}
  />
);
```

Guide: [docs/kanban.md](docs/kanban.md). What both views share: [docs/toolbar.md](docs/toolbar.md).

### AI assistant

```tsx
import { useState } from "react";
import { AIChatButton, AIChatSidebar, resolveProviderConfig } from "gridory/ai";
import type { AIActionEvent, AIDataSchema } from "gridory/ai";

const dataSchema: AIDataSchema = {
  entityName: "leads",
  entityNameSingular: "lead",
  fields: [{ id: "name", label: "Name", type: "text", required: true }],
};

const createLead = (lead: Record<string, unknown>) =>
  fetch("/api/leads", { method: "POST", body: JSON.stringify(lead) });

export const LeadsAssistant = ({ apiKey }: { apiKey: string }) => {
  const [open, setOpen] = useState(false);
  const handleAction = (event: AIActionEvent) => {
    if (event.type === "create-row") createLead(event.payload);
  };
  return (
    <>
      <AIChatButton onClick={() => setOpen(true)} />
      <AIChatSidebar
        open={open}
        onClose={() => setOpen(false)}
        providerConfig={resolveProviderConfig("openai", { apiKey })}
        mode="table"
        dataSchema={dataSchema}
        onAction={handleAction}
      />
    </>
  );
};
```

The provider is called from the browser with that key, so use a restricted key or point `baseURL`
at a proxy you control. Guide: [docs/ai-assistant.md](docs/ai-assistant.md).

### Auth forms

```tsx
import { LoginForm } from "gridory/auth";

const signIn = (values: { email: string; password: string }) =>
  fetch("/api/login", { method: "POST", body: JSON.stringify(values) });

export const SignIn = () => (
  <LoginForm
    onSubmit={signIn}
    forgotPassword={{ href: "/recover" }}
    signUpLink={{ href: "/register" }}
  />
);
```

`SignUpForm` adds name fields, password requirements and your own fields. Guide:
[docs/auth-forms.md](docs/auth-forms.md).

## Theming

Colors, radius and shadows come from `--gdy-*` tokens in `gridory/styles.css`. Light is the
default; dark applies with the `dark` class or `data-theme="dark"` on `<html>`. Base tokens read the
shadcn/ui variable of the same name when your app defines one. Override tokens in `:root`/`.dark`:

```css
:root { --gdy-primary: #0f766e; --gdy-radius: 6px; }
.dark { --gdy-primary: #5eead4; }
```

Every element carries a `gdy-*` class and state attributes. See [docs/theming.md](docs/theming.md)
and the full catalog in [docs/style-hooks.md](docs/style-hooks.md).

## Documentation

| English | Español | Content |
|---|---|---|
| [Table](docs/table.md) | [Tabla](docs/table.es.md) | `DataTable`: columns, sorting, pagination, grouping, inline editing, server-side mode. |
| [Kanban](docs/kanban.md) | [Kanban](docs/kanban.es.md) | `KanbanBoard`: fields, groups, drag and drop, card rendering, events. |
| [Toolbar](docs/toolbar.md) | [Toolbar, filtros y acciones](docs/toolbar.es.md) | What both views share: toolbar, search, filters, archived view, view switch, row and card actions. |
| [AI assistant](docs/ai-assistant.md) | [Asistente de IA](docs/ai-assistant.es.md) | Provider, modes, actions, memory, UI, `useAIChat` and events. |
| [Auth forms](docs/auth-forms.md) | [Formularios de autenticación](docs/auth-forms.es.md) | `LoginForm` and `SignUpForm`: fields, validation, zod, Google, texts and styling. |
| [Segmented control](docs/segmented-control.md) | [Control segmentado](docs/segmented-control.es.md) | `SegmentedControl`: options and value, icons, keyboard, accessibility, styling and motion. |
| [Theming](docs/theming.md) | [Temas y estilos](docs/theming.es.md) | Tokens, light/dark theme, overrides, style contract, motion, Tailwind preset. |
| [Style hooks](docs/style-hooks.md) | [Ganchos de estilo](docs/style-hooks.es.md) | Generated catalog of every class, state attribute and token. |

Contribution guidelines are in [CONTRIBUTING.md](CONTRIBUTING.md). Release notes are published in
the [GitHub releases](https://github.com/VictorDiazJauregui/gridory/releases).

## Local demo

Run `npm install` and `npm run dev`, then open `http://localhost:5173/mocks/table`, `/mocks/kanban`,
`/mocks/ai` (table, kanban and assistant together, with an event log), `/mocks/auth` (sign-in and
sign-up examples, with an event log) or `/mocks/controls` (the form controls together, with an event
log). Add `?theme=dark` or `?theme=light` to force a theme. The demo shell uses Tailwind for itself
only; none of it ships.

To chat with a real provider, copy the variables with `cp .env.example .env.local`, set
`VITE_AI_API_KEY` and restart `npm run dev`. The example values target Gemini:
`VITE_AI_BASE_URL=/api/google-openai` (a Vite proxy that avoids CORS) and
`VITE_AI_MODEL=gemini-2.5-flash`. Without a key the mock renders, but it makes no calls.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server with the demo. |
| `npm run build` | Type check, ESM bundle in `dist/` and type declarations in `dist/types/`. |
| `npm run lint` | ESLint over the sources and `scripts/`, with the project style rules: functions as `const` expressions, early returns (no `else` after `return`), no nested ternaries, nesting depth of 2, at most 3 parameters and 20 lines per function. |
| `npm run typecheck` | `tsc -b` without emitting files. |
| `npm test` / `npm run test:watch` | Vitest and Testing Library on jsdom, over the tests in `src/test/`; the watch variant reruns on change. |
| `npm run audit:styles` | After `npm run build`: checks the stylesheets against the classes and state attributes the components emit, and that `docs/style-hooks.md` is current. |
| `npm run docs:hooks` | Regenerates `docs/style-hooks.md` and `docs/style-hooks.es.md` from the sources. |

## Code structure

Each module lives in `src/components/<module>/`. The root holds the public surface and contracts
(`index.tsx`, or `index.ts` in `ai/`, `auth/` and `segmented-control/`, plus `types.ts`, `constants.ts` and `styles.css`). The rest is
split into folders by area, never by file type, with 3 to 12 files each and no barrel files inside
them.

| Folder | Areas |
|---|---|
| `table/` | `model/`, `header/`, `body/`, `pagination/` |
| `kanban/` | `model/`, `toolbar/`, `board/`, `card/` |
| `ai/` | `chat/`, `completion/`, `sidebar/`, `transcript/`, `actions/` |
| `auth/` | `config/`, `model/`, `fields/`, `password/`, `validation/`, `layout/`, `actions/` |
| `segmented-control/` | `model/`, `parts/` |
| `shared/` | Common contracts at the root; `controls/`, `rows/`, `toolbar/`, `filter-menu/`, `date-filter-menu/`, `date-pickers/`, `menu/` |
| `ui/` | Primitives over Radix and react-day-picker: `select/`, `toggle-group/`, `calendar/` |
| `mocks/` | Demo data and configuration |

The demo shell is in `src/demo/`, the tests in `src/test/` and the guides in `docs/`. The demo, the
mocks and the tests stay out of the package and out of the style audit.

## Contributing

Issues and pull requests are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) first.

## Roadmap

- Gantt / timeline view
- Form builder
- Sidebar and navigation

## License

MIT © Victor Díaz Jáuregui. You may use, copy, modify, merge, publish, distribute, sublicense and
sell the software, in personal or commercial projects, as long as the copyright notice and the
license text are kept in every copy. It comes with no warranty. See [LICENSE](LICENSE).
