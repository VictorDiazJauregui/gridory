# KanbanBoard

[English](kanban.md) · [Español](kanban.es.md)

`KanbanBoard` shows typed records as cards split into columns by the value of one grouping. It
searches, filters and sorts the cards and lets the user drag them between columns. It never mutates
your data: every change is emitted through a callback and your app decides what to store.

## Import

```ts
import { KanbanBoard, type ColumnDefinition, type KanbanGroupOption } from "gridory/kanban";
```

Import `gridory/styles.css` once in your app, before any override (see [theming.md](theming.md)). The
root `gridory` entry re-exports the same names.

## Quick example

```tsx
import { useState } from "react";
import { KanbanBoard, type ColumnDefinition, type KanbanGroupOption } from "gridory/kanban";

interface Task {
  id: string;
  title: string;
  owner: string;
  priority: "low" | "high";
  project: string;
  status: "todo" | "doing" | "done";
  dueDate: string;
}

const fields: ColumnDefinition<Task>[] = [
  { id: "title", header: "Title", accessor: (task) => task.title },
  { id: "owner", header: "Owner", accessor: (task) => task.owner, filterable: true },
  {
    id: "priority",
    header: "Priority",
    accessor: (task) => task.priority,
    searchable: false,
    filterable: true,
    filterOptions: [{ value: "low", label: "Low" }, { value: "high", label: "High" }],
  },
  { id: "project", header: "Project", accessor: (task) => task.project, filterable: true },
  { id: "dueDate", header: "Due date", accessor: (task) => task.dueDate, type: "date", filterable: true },
];

const groups: KanbanGroupOption<Task>[] = [
  {
    id: "status",
    label: "Status",
    accessor: (task) => task.status,
    setValue: (task, nextValue) => ({ ...task, status: nextValue as Task["status"] }),
    values: [
      { value: "todo", label: "To do" },
      { value: "doing", label: "In progress" },
      { value: "done", label: "Done" },
    ],
  },
];

const initialTasks: Task[] = [
  { id: "1", title: "Write the brief", owner: "Ana", priority: "high", project: "Website", status: "todo", dueDate: "2026-10-02" },
  { id: "2", title: "Review the design", owner: "Luis", priority: "low", project: "Mobile app", status: "doing", dueDate: "2026-10-05" },
];

export const TaskBoard = () => {
  const [tasks, setTasks] = useState(initialTasks);
  return (
    <KanbanBoard
      fields={fields}
      data={tasks}
      groups={groups}
      defaultGroupId="status"
      getCardId={(task) => task.id}
      onCardMove={(event) =>
        setTasks((previous) =>
          previous.map((task) => (task.id === event.cardId ? event.updatedCard : task)),
        )
      }
    />
  );
};
```

## Data model

### Cards

`data` accepts a plain array or an API envelope (`DataInput<TData>`): an object with one of `data`,
`items`, `results`, `records` or `payload.data` / `payload.items` / `payload.results`. The first of
those keys that is defined, in that order, is used; if it does not hold an array the board has no
cards. `normalizeRow(raw, index)` maps every record of an envelope to `TData`. A plain array is used
as is, so `normalizeRow` is not applied to it.

`getCardId(card, index)` is required. Its result identifies the card in drag and drop, in the events
and as the React key, so it must be unique and stable.

The board keeps an internal copy of the cards and replaces it whenever `data` or `normalizeRow`
changes identity. Pass a stable `normalizeRow` (declared at module level or memoized) so a re-render
of your component does not rebuild the cards.

### Fields

`fields` is an array of `ColumnDefinition<TData>`, the same type the table uses for its columns. On
the board a field feeds search, filtering, sorting and the default card. These properties have an
effect:

| Property | Effect on the board |
|---|---|
| `id` | Identifies the field in filters and sorting. |
| `header` | Label of the filter trigger and of the value lines on the default card. |
| `accessor` | Value used to search, filter, sort and fill the default card. Arrays are joined with `", "` on the card. |
| `type` | `"date"` swaps the value filter for a date filter, and the first date field adds the date line to the default card. It also picks the sort comparator. Default `"text"`. |
| `searchable` | Default `true`. Set `false` to exclude the field from the toolbar search. |
| `filterable` | Adds a filter trigger for the field under the toolbar. Default `false`. |
| `filterOptions` | Declared `{ value, label }` options for the value filter. Without them the options are the distinct values found in the cards, sorted alphabetically. |
| `sortable` | Default `true`. Set `false` to remove the sort buttons from the field's filter menu. |

`cell`, `width`, `inlineEditOptions`, `onInlineEdit` and `valueHighlights` only apply to the table and
are ignored by the board; use `renderCard` for custom markup. The full field reference is in
[table.md](table.md#columns).

### Groups

`groups` lists the ways the user can split the cards into columns. Each entry is a
`KanbanGroupOption<TData>`:

| Property | Type | Description |
|---|---|---|
| `id` | `string` | Identifier used by `defaultGroupId`, `onGroupChange` and the events. |
| `label` | `string` | Text of the option in the group selector and of the tag on the default card. |
| `accessor` | `(card: TData) => Primitive \| Primitive[]` | Reads the grouping value. An array contributes its first non-empty entry; `null`, `undefined` and blank strings count as empty. |
| `setValue` | `(card: TData, nextValue: string) => TData` | Returns the card with its grouping value set to `nextValue`. Called on drop. |
| `values` | `FilterOption[]` | Optional fixed columns, in this order, with their labels. |

With `values`, the board renders one column per entry in the given order, including the ones without
cards. A visible card whose value is not listed adds a column after them, labelled with the raw value.

Without `values`, the columns are the distinct values of every card on the board (not only the ones
that pass the search and filters), labelled with the value itself and sorted alphabetically by label.

A card with an empty value goes to a column labelled `"Sin valor"`. To name that column, add an entry
with `value: ""` and your own `label` to `values`. A column without cards shows `"Sin cards"`, and
when no card passes the search, the filters and the archived view, the board shows `emptyMessage`
instead of the columns. `"Sin valor"` and `"Sin cards"` are fixed texts.

The board throws while rendering when the grouping configuration is unusable:

- `groups` is empty: ``KanbanBoard requiere al menos una configuración de agrupación en `groups`.``
- `defaultGroupId` matches no group:
  ``KanbanBoard requiere que `defaultGroupId` exista dentro de `groups`.``

## Features

`features` turns whole capabilities on or off. Every flag defaults to `true`.

| Flag | Default | Effect when `false` |
|---|---|---|
| `search` | `true` | Hides the search box and skips the search. |
| `sorting` | `true` | Removes the sort buttons from the filter menus; no sort is applied. |
| `filtering` | `true` | Hides the filter row and the clear-filters button; filters are not applied. |
| `createButton` | `true` | Hides the create button even when `onCreate` is set. |
| `rowActions` | `true` | Hides the card menu even when `rowActions` is set. |
| `groupSelector` | `true` | Hides the group selector; the board stays on its current group. |
| `dragAndDrop` | `true` | Cards are not draggable. |

### Columns and grouping

The toolbar renders a selector with one option per group, labelled `"<prefix>: <label>"`.
`groupSelectorLabel` sets the prefix and the accessible name of the selector; it defaults to the
Spanish `"Agrupar por"`. There is no "none" option: the board is always grouped. Picking a group
calls `onGroupChange(groupId)` and regroups the cards.

`defaultGroupId` is only the initial selection. When `groups` changes and no longer contains the
selected id, the board falls back to the first group without calling `onGroupChange`.

Each column has a header with its label (truncated with an ellipsis, full text in the `title`
attribute) and the number of cards it shows. The board scrolls horizontally, and each column body
scrolls vertically past `columnBodyMaxHeight` pixels (default `480`).

### Drag and drop

With `features.dragAndDrop` every card is draggable. Dropping a card on another column calls the
active group's `setValue(card, columnValue)`, moves the result in the board's internal copy and calls
`onCardMove` with a `KanbanMoveEvent<TData>`:

| Field | Description |
|---|---|
| `card` | The card as it was before the drop. |
| `updatedCard` | The card returned by `setValue`. |
| `cardId` | Result of `getCardId` for the card. |
| `groupId` | Id of the active group. |
| `fromValue` | Grouping value before the drop. |
| `toValue` | Value of the column the card was dropped on. |

Dropping a card on its own column does nothing. The board does not change the data you passed:
store `updatedCard` in your state, as in the quick example, or the move is lost the next time `data`
changes. While dragging, the card carries `data-dragging` and the column under the pointer carries
`data-drop-target`.

### Card click

`onCardClick` receives a `KanbanCardClickEvent<TData>`: `{ card, cardId, groupId, value }`, where
`value` is the grouping value of the column that shows the card. It does not fire for the click that
ends a drag, nor when the user opens the card menu or picks one of its actions. Inside `renderCard`,
call `event.stopPropagation()` on your own buttons and inputs to keep them from triggering it.

### Search

The toolbar search box (`searchPlaceholder`, default `"Buscar cards..."`) keeps the cards where any
searchable field contains the query, case-insensitive, over the values returned by `accessor`. The
search box is described in [toolbar.md](toolbar.md).

### Filtering

Under the toolbar the board renders one trigger per `filterable` field, labelled with its `header`.
Text and number fields open a searchable checklist of values; date fields open a menu with the
operators greater than, less than and between, with a calendar. Several values of one field match any
of them, and filters on different fields must all match. A trigger carries `data-filtered` while its
field has a filter, and the toolbar shows a clear-filters button. The menus, date inputs and calendar
options are shared with the table and documented in [toolbar.md](toolbar.md).

### Sorting

The sort buttons live in each field's filter menu, so only `filterable` fields can be sorted by the
user. One field is sorted at a time. In a text or number field menu, clicking the active direction
again clears the sort; in a date field menu, `"Limpiar"` clears the sort together with the filter.

The board sorts the filtered cards before splitting them into columns, so the order applies inside
every column while the columns keep their place. `type` picks the comparator: `"text"` is
locale-aware (`es`), ignores case and accents and compares digit runs numerically; `"number"`
compares `Number(value)`; `"date"` compares the first ten characters of the value, so ISO strings
sort by day. Without an active sort the cards keep the order of `data`.

### Custom cards

The default card is built from `fields`, in order:

- **Title**: the value of the first field, or `"Card"` when it is empty.
- **Subtitle**: the value of the second field, when present.
- **Card menu**: next to the title, while `features.rowActions` is on and `rowActions` yields at
  least one action.
- **Tag**: `"<group label>: <value>"`, with the raw grouping value (not the column label) or
  `"Sin valor"` when it is empty.
- **Value lines**: the third and fourth fields as `Header: value`, skipped when empty.
- **Date line**: the first field with `type: "date"`, formatted `dd/mm/yyyy` from an ISO
  `yyyy-mm-dd` value. It is shown even when the value is empty. When that field is also the third or
  fourth one, its raw value line shows as well, so place date fields from the fifth position on.

`renderCard(card, context)` replaces the card content with your own markup. `context` is a
`KanbanCardRenderContext<TData>`: `{ card, groupId, groupValue }`. The card element, its drag
behaviour and `onCardClick` stay the same. While `features.rowActions` is on, the card menu is
rendered under your markup, inside `gdy-kanban-card-actions`.

```tsx
<KanbanBoard
  {...boardProps}
  renderCard={(task, { groupValue }) => (
    <div className="task-card">
      <strong>{task.title}</strong>
      <span>{task.owner} · {groupValue}</span>
    </div>
  )}
/>
```

### Archived view and card actions

`archivedView` adds the active/archived/all selector to the toolbar and `rowActions` fills the card
menu with the built-in edit, archive, remove and history actions plus your own. Both are shared with
the table and documented in [toolbar.md](toolbar.md).

## Events

| Callback | Signature | Fires |
|---|---|---|
| `onCardMove` | `(event: KanbanMoveEvent<TData>) => void` | A card is dropped on a column other than its own. |
| `onCardClick` | `(event: KanbanCardClickEvent<TData>) => void` | A card is clicked (not at the end of a drag, not from its menu). |
| `onGroupChange` | `(groupId: string) => void` | The user picks another group in the selector. Not on mount. |
| `onCreate` | `() => void` | The create button is clicked. The button renders only when this is set. |
| `rowActions.onEdit`, `onArchive`, `onArchiveToggle`, `onRemove`, `onHistory` | `(row: TData) => void` | The matching built-in action is picked in the card menu. |
| `rowActions.customActions[].onClick` | `(row: TData) => void` | A custom action is picked in the card menu. |
| `archivedView.onChange` | `(mode: ArchivedViewMode) => void` | The user changes the archived view selector. |
| `viewSwitch.onChange` | `(view: ViewMode) => void` | The user clicks a view in the table/kanban switch. |
| `aiButton.onClick` | `() => void` | The AI button is clicked. |
| `toggleGroups[].onChange`, `headerSelectors[].onChange` | `(value: string) => void` | A custom toolbar control changes. |

The callbacks after `onGroupChange` belong to `DataViewProps`; see [toolbar.md](toolbar.md).

## Toolbar and card actions

The toolbar above the board (search box, clear-filters button, archived view selector, group
selector, AI button, table/kanban switch, create button, custom toggle groups and header selectors,
and the `toolbarLayout` that orders them) and the card menu (built-in edit, archive, remove and
history actions plus `customActions` and `menuActions`) are shared with the table. They are
configured through `DataViewProps` and documented in [toolbar.md](toolbar.md). Two differences on
the board: the group selector has no "none" option, and there is no pagination, so every card that
passes the search, the filters and the archived view is rendered.

## Styling

The root element is `div.gdy-kanban`, which also carries `gdy-thin-scroll` while `thinScrollbars` is
on (the default). Inside it, `div.gdy-scope.gdy-card` wraps the toolbar, the filter row and the board
viewport `div.gdy-kanban-board-wrap.gdy-scroll`. When no card is visible the viewport holds a single
`gdy-empty` element with `emptyMessage`.

| Hook | Element | State attributes |
|---|---|---|
| `gdy-kanban-filter-row` | Row of filter triggers under the toolbar. | — |
| `gdy-kanban-filter-trigger` | Filter trigger of a field, with `gdy-kanban-filter-trigger-label`. | `data-filtered` while the field has a filter. |
| `gdy-kanban-board` | Flex row of columns inside the viewport. | — |
| `gdy-kanban-column` | Column (`section`), with its header `gdy-kanban-column-head`. | `data-drop-target` while a card is dragged over it. |
| `gdy-kanban-column-title` | Column label. | — |
| `gdy-kanban-column-count` | Card count badge. | — |
| `gdy-kanban-column-body` | Scrolling list of cards; `gdy-kanban-empty-col` is its `"Sin cards"` placeholder. | — |
| `gdy-kanban-card` | Card (`article`). | `data-dragging` while it is dragged. |
| `gdy-kanban-card-title` | Title of the default card; `gdy-kanban-card-subtitle` is its subtitle. | — |
| `gdy-kanban-tag` | Group tag of the default card. | — |
| `gdy-kanban-card-value` | `Header: value` and date lines of the default card. | — |
| `gdy-kanban-card-actions` | Menu slot under a custom `renderCard`. | — |

The board reads these tokens. None is declared by default and each falls back to a base token, so
declaring them on `:root`, on your dark theme scope or on any ancestor of the board is enough:

| Token | Fallback | Paints |
|---|---|---|
| `--gdy-kanban-column-bg` | `--gdy-muted` | Column background. |
| `--gdy-kanban-column-border` | `--gdy-border` | Column border and header divider. |
| `--gdy-kanban-card-bg` | `--gdy-card` | Card and empty-column placeholder background. |
| `--gdy-kanban-card-border` | `--gdy-border` | Card border. |
| `--gdy-kanban-drop-bg` | A tint of `--gdy-muted` | Column background while it is a drop target. |
| `--gdy-kanban-drop-outline` | `--gdy-muted-foreground` | Dashed outline of the drop target. |

`boardWrapClassName` appends your own classes to the viewport. `boardMinHeightClassName` (default
`"gdy-kanban-min-h-md"`) sets its minimum height with one of the built-in utilities,
`gdy-kanban-min-h-sm` (240px), `gdy-kanban-min-h-md` (360px) and `gdy-kanban-min-h-lg` (520px), or
with any class of your own. `scrollbarColor` and `optionHoverColor` set `--gdy-scrollbar-thumb` and
`--gdy-option-hover-bg` on the root (see [toolbar.md](toolbar.md)).

A rule with the same selector in your CSS, loaded after `gridory/styles.css`, overrides the
library's:

```css
:root {
  --gdy-kanban-column-bg: #f4f4f5;
  --gdy-kanban-drop-outline: #6366f1;
}

.gdy-kanban-card {
  border-radius: 6px;
}
```

The style contract, the base tokens and the light/dark themes are in [theming.md](theming.md); the
full catalog of classes, state attributes and tokens is in [style-hooks.md](style-hooks.md).

## Props reference

Own props of `KanbanBoardProps<TData>`, in source order.

| Prop | Type | Default | Description |
|---|---|---|---|
| `fields` | `ColumnDefinition<TData>[]` | — | Fields used to search, filter, sort and render the cards (required). |
| `data` | `DataInput<TData>` | — | Cards: an array or an API envelope (required). |
| `groups` | `KanbanGroupOption<TData>[]` | — | Available groupings; must not be empty (required). |
| `defaultGroupId` | `string` | — | Initial group; must exist in `groups` (required). |
| `normalizeRow` | `(row: unknown, index: number) => TData` | — | Maps each record of an envelope to `TData`. |
| `getCardId` | `(card: TData, index: number) => string` | — | Unique, stable card id (required). |
| `features` | `KanbanBoardFeatures` | all `true` | Capability flags. |
| `renderCard` | `(card: TData, context: KanbanCardRenderContext<TData>) => ReactNode` | — | Custom card content. |
| `onCardMove` | `(event: KanbanMoveEvent<TData>) => void` | — | Card dropped on another column. |
| `onCardClick` | `(event: KanbanCardClickEvent<TData>) => void` | — | Card clicked. |
| `onGroupChange` | `(groupId: string) => void` | — | Group selector change. |
| `groupSelectorLabel` | `string` | `"Agrupar por"` | Prefix of every group option and accessible name of the selector. |
| `boardWrapClassName` | `string` | — | Extra classes for the board viewport. |
| `boardMinHeightClassName` | `string` | `"gdy-kanban-min-h-md"` | Minimum height class of the board viewport. |
| `columnBodyMaxHeight` | `number` | `480` | Maximum height in pixels of each column body before it scrolls. |

`KanbanBoardProps` also accepts every `DataViewProps` prop (`searchPlaceholder`, `createLabel`,
`onCreate`, `emptyMessage`, `rowActions`, `archivedView`, `viewSwitch`, `aiButton`, `toggleGroups`,
`headerSelectors`, `toolbarLayout`, `selectTheme`, `thinScrollbars`, `scrollbarColor`,
`optionHoverColor`, `dateFilterRequireOperator`, `dateInputFormat`, `calendarMonthYearDropdown`,
`calendarFromYear`, `calendarToYear`), documented in [toolbar.md](toolbar.md). On the board
`searchPlaceholder` defaults to `"Buscar cards..."`, `createLabel` to `"Nuevo"` and `emptyMessage` to
`"No se encontraron resultados"`.

### Types

- `KanbanGroupOption<TData>`: one grouping, `{ id, label, accessor, setValue, values? }`.
- `KanbanBoardFeatures`: the optional boolean flags of `features` (`search`, `sorting`, `filtering`,
  `createButton`, `rowActions`, `groupSelector`, `dragAndDrop`).
- `KanbanMoveEvent<TData>`: `{ card, updatedCard, cardId, groupId, fromValue, toValue }`, the payload
  of `onCardMove`.
- `KanbanCardClickEvent<TData>`: `{ card, cardId, groupId, value }`, the payload of `onCardClick`.
- `KanbanCardRenderContext<TData>`: `{ card, groupId, groupValue }`, the second argument of
  `renderCard`.
- `KanbanSortingState`: `{ id: string; direction: SortDirection }`, the active sort of a field.
- `KanbanFiltersState`: `Record<string, string[]>`, the selected values per field id.
- `KanbanDateFiltersState`: `Record<string, DateFilterState>`, the date filter per field id.
