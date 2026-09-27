# Gridory

[English](README.md) · [Español](README.es.md)

React + TypeScript components for data-heavy apps. They emit events; your app keeps the data.

## Why Gridory

- **One data model, several views.** Table and kanban read the same rows and field definitions.
- **Event-driven.** Changes reach you as callbacks; the data you pass in is never mutated.
- **The assistant asks before acting.** `onAction` fires only after the user confirms a proposal.
- **Typed end to end.** Components are generic over your row type, with no `any` in the public API.

## Installation

```bash
npm install gridory
```

`react` and `react-dom` (18.2 or later, or 19) are peer dependencies. Import the stylesheet once,
before your own CSS. Tailwind is not required.

```ts
import "gridory/styles.css";
```

The built-in UI texts are in Spanish. Every one of them can be replaced through props.

## Quick start

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

## Components

Each component has its own guide with every prop, event and style hook. Start there when you need
the details.

### Data

| Component | Import | Guide |
|---|---|---|
| `DataTable`: sorting, filters, pagination, grouping, inline editing and server-side mode. | `gridory/table` | [Table](docs/table.md) |
| `KanbanBoard`: the same data as cards, with drag and drop between columns. | `gridory/kanban` | [Kanban](docs/kanban.md) |
| Toolbar, search, filters and row actions shared by both views. | `gridory/table`, `gridory/kanban` | [Toolbar](docs/toolbar.md) |

### AI

| Component | Import | Guide |
|---|---|---|
| `AIChatSidebar` and `useAIChat`: an assistant that proposes changes to your data and waits for confirmation. Works with OpenAI-compatible providers. | `gridory/ai` | [AI assistant](docs/ai-assistant.md) |

The assistant needs the `openai` SDK, an optional peer dependency: run `npm install openai` only if
you use it.

### Forms

| Component | Import | Guide |
|---|---|---|
| `LoginForm` and `SignUpForm`: sign-in and sign-up with validation. | `gridory/auth` | [Auth forms](docs/auth-forms.md) |
| `SegmentedControl`: a single choice between a few options. | `gridory/segmented-control` | [Segmented control](docs/segmented-control.md) |
| `CountrySelect`: one or several countries, with search and flags. | `gridory/country-select` | [Country select](docs/country-select.md) |
| `PhoneInput`: a phone number with its dial code. | `gridory/phone-input` | [Phone input](docs/phone-input.md) |

### Navigation

| Component | Import | Guide |
|---|---|---|
| `SidebarLayout` and `Sidebar`: a side menu with hover and pinned modes and a mobile drawer. | `gridory/sidebar` | [Sidebar](docs/sidebar.md) |

Everything except the AI assistant is also exported from `gridory`.

## Theming

Colors, radius and shadows come from `--gdy-*` tokens, with a light and a dark theme. Override them
in your CSS, or target the `gdy-*` classes every element carries. See [Theming](docs/theming.md) and
the full [style hooks catalog](docs/style-hooks.md).

## Contributing

Issues and pull requests are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) to run the demo and
the checks locally. Release notes are in the
[GitHub releases](https://github.com/VictorDiazJauregui/gridory/releases).

## License

[MIT](LICENSE) © Victor Díaz Jáuregui.
