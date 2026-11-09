# CardGrid

[English](card-grid.md) · [Español](card-grid.es.md)

`CardGrid` shows the rows of a `DataTable` as a responsive grid of cards. It takes the same data,
columns, search, filters, sort and pagination as the table, and the cards look like kanban cards. It
never mutates your data: every change is emitted through a callback and your app decides what to store.

## Import

```ts
import { CardGrid, type ColumnDefinition } from "gridory/card-grid";
```

Import `gridory/styles.css` once in your app, before any override (see [theming.md](theming.md)). The
root `gridory` entry re-exports the same names.

To load only the styles you use, import `gridory/base.css`, `gridory/card-grid.css`,
`gridory/table.css` and `gridory/kanban.css`, in that order: `card-grid.css` holds only the grid,
while the cards and the filter row are the kanban's and the pagination is the table's (see
[Per-module stylesheets](theming.md#per-module-stylesheets)).

## Quick example

```tsx
import { CardGrid, type ColumnDefinition } from "gridory/card-grid";

interface Company {
  id: string;
  name: string;
  country: string;
  status: string;
  createdAt: string;
}

const columns: ColumnDefinition<Company>[] = [
  { id: "name", header: "Company", accessor: (row) => row.name, searchable: true, sortable: true, filterable: true },
  { id: "country", header: "Country", accessor: (row) => row.country, filterable: true },
  { id: "status", header: "Status", accessor: (row) => row.status, filterable: true },
  { id: "createdAt", header: "Created", accessor: (row) => row.createdAt, type: "date", filterable: true },
];

export const Companies = ({ rows }: { rows: Company[] }) => (
  <CardGrid
    columns={columns}
    data={rows}
    getRowId={(row) => row.id}
    getRowHref={(row) => `/companies/${row.id}`}
    rowActions={{ onEdit: (row) => openEditor(row) }}
  />
);
```

## Switching between table, cards and kanban

`CardGrid` has no view switch of its own. Build the selector with `toggleGroups` and keep the search,
the filters and the sort in your app: the three views accept them controlled with the same props
(`search` / `onSearchChange`, `sorting` / `onSortChange`, `columnFilters` / `onFiltersChange`), so
switching views keeps what the user searched, filtered and sorted.

```tsx
const [view, setView] = useState("cards");
const [search, setSearch] = useState("");
const [sorting, setSorting] = useState<ColumnSortingState | null>(null);
const [filters, setFilters] = useState<ColumnFiltersState>({ values: {}, dates: {} });

const shared = {
  data: rows,
  search, onSearchChange: setSearch,
  sorting, onSortChange: setSorting,
  columnFilters: filters, onFiltersChange: setFilters,
  toggleGroups: [{
    id: "view",
    ariaLabel: "View",
    value: view,
    onChange: setView,
    position: "left" as const,
    options: [
      { value: "table", label: "Table" },
      { value: "cards", label: "Cards" },
      { value: "kanban", label: "Kanban" },
    ],
  }],
};

{view === "table" && <DataTable {...shared} columns={columns} />}
{view === "cards" && <CardGrid {...shared} columns={columns} />}
{view === "kanban" && <KanbanBoard {...shared} fields={columns} groups={groups} defaultGroupId="status" getCardId={(row) => row.id} />}
```

The demo page `/mocks/card-grid` does exactly this with the company rows.

## Data model

`data`, `normalizeRow`, `columns` and `getRowId` are the ones of `DataTable` ([Data model](table.md#data-model)).
The same `ColumnDefinition<TData>[]` serves the three views.

- The first column is the card title (`labels.untitledCard`, `"Card"`, when it is empty) and the second
  its subtitle.
- The third and fourth columns are shown under it as `Header: value`, and the first `type: "date"` column
  as a formatted date (`labels.formatCardDate`), as in the kanban.
- `getRowId` gives each card its key and `data-row-id`; without it the position in `data` is used.

## Features

`features` turns each one off: `search`, `sorting`, `filtering`, `pagination`, `rowActions` and
`createButton`, all `true` by default.

### Search, filters and sort

The toolbar search box keeps the cards where any `searchable` column contains the query, ignoring case
and accents. Under the toolbar, one trigger per `filterable` column opens its value or date menu, which
also holds the sort buttons, as in the kanban ([Filtering](kanban.md#filtering), [Sorting](kanban.md#sorting)).
Search, filters and sort can be controlled; see [Switching between table, cards and kanban](#switching-between-table-cards-and-kanban)
and the rules of [Controlled state](table.md#controlled-state). Everything runs over the rows in `data`:
there is no server-side mode.

### Pagination

The pagination bar is the table's. `pageSizeOptions` defaults to `[15, 25, 50, 100]` and
`defaultPageSize` to `25`. `pageIndex` and `pageSize` can be controlled, paired with
`onPaginationChange`, as in the table ([Page and page size](table.md#page-and-page-size)). A search,
filter, sort or archived-view change goes back to the first page.

### Card click and card links

- `onRowClick(row, event)` fires on a card click, or Enter on a focused card. `event` is a
  `CardClickEvent`. It never fires from a button, link or other control inside the card, such as the ⋯
  menu.
- `getRowHref(row)` turns the card into a link (`data-href`): Ctrl/Cmd + click, middle click and
  Ctrl/Cmd + Enter open it in a new tab; a plain click or Enter call `onRowClick`, or navigate to it when
  there is no `onRowClick`. `javascript:`, `data:` and `vbscript:` destinations are ignored.
- A card with `onRowClick` or a link carries `data-clickable` and takes the focus with Tab.
- `ignoreTextSelectionClick` makes the card skip the click that ends dragging over its text, so the text
  stays selected to copy it. Defaults to `false`. Same rules and limits as the table: see
  [Row click and row links](table.md#row-click-and-row-links).

### Custom cards

`renderCard(row)` replaces the content of each card. The ⋯ menu of `rowActions` is added under it, in
`div.gdy-kanban-card-actions`. Your own buttons and inputs need no `event.stopPropagation()`: a click on
a control inside the card never reaches `onRowClick`.

### Card actions and archived view

`rowActions` adds the ⋯ menu to each card, with the built-in and custom actions of the table and the
kanban ([toolbar.md](toolbar.md)). `archivedView` adds the archived selector to the toolbar. The kanban's
"Mover a…" entry does not exist here.

### Loading and empty states

- `loading` replaces the cards with `loadingRowCount` placeholder cards (default `5`) and sets
  `aria-busy="true"` and `data-loading` on the root. `renderLoading` replaces the placeholders, inside
  `div.gdy-card-grid-loading`.
- When no card matches, a `gdy-empty` element shows `emptyMessage` (default `"No se encontraron resultados"`).

### Visible rows

`onVisibleRowsChange(state)` receives the same `VisibleRowsState<TData>` as the table: `pageRows` (the
cards of the page), `filteredRows` (every card that passes search, archived view and filters, sorted)
and `totalRows`. It fires on mount and whenever they change, never twice for the same result and never
while `loading`.

### Keyboard and screen readers

The grid is a list (`ul.gdy-card-grid-list`, `role="list"`) and each card a list item. A clickable card
is focusable (`tabIndex=0`) and Tab moves through the cards in reading order; Enter opens it like a
click. The focus ring uses `--gdy-card-grid-focus-ring`, falling back to `--gdy-ring`.

### Texts and language

`labels` replaces any text; the keys you leave out keep their Spanish default. `CardGridLabels` extends
`DataViewLabels` (toolbar, menus and filters, shared with the table and the kanban) with the pagination
texts of the table (`itemsName`, `showing`, `pageSize`, `pageOf`, `previousPage`, `nextPage`) and the card
texts of the kanban (`untitledCard`, `cardFieldLabel`, `formatCardDate`). The older single-text props
`searchPlaceholder`, `createLabel` and `emptyMessage` win over their key.

## Events

| Callback | Signature | Fires |
|---|---|---|
| `onRowClick` | `(row: TData, event: CardClickEvent) => void` | A card is clicked, or Enter on a focused card. |
| `onVisibleRowsChange` | `(state: VisibleRowsState<TData>) => void` | On mount and whenever the visible cards change. |
| `onPaginationChange` | `(state: ManualPaginationState) => void` | The user changes the page or the page size. |
| `onSearchChange` | `(query: string) => void` | The user types in the search box. |
| `onSortChange` | `(sorting: ColumnSortingState \| null) => void` | The user changes the sort in a filter menu. |
| `onFiltersChange` | `(filters: ColumnFiltersState) => void` | The user changes the active filters. |
| `onCreate` | `() => void` | The create button is clicked. The button renders only when this is set. |
| `rowActions.*`, `archivedView.onChange`, `aiButton.onClick`, `toggleGroups[].onChange`, `headerSelectors[].onChange` | — | As in the table and the kanban; see [toolbar.md](toolbar.md). |

## Styling

The root element is `div.gdy-card-grid`, which also carries `gdy-thin-scroll` while `thinScrollbars` is on
(the default). Inside it, `div.gdy-scope.gdy-card` wraps the toolbar, the filter row, the grid and the
pagination bar.

| Hook | Element | State attributes |
|---|---|---|
| `gdy-card-grid-list` | The grid (`ul`, `role="list"`). | — |
| `gdy-card-grid-card` | A card (`li`); it also carries `gdy-kanban-card`, so the default card looks like a kanban card. | `data-clickable` with `onRowClick` or a link; `data-href` with a link; `data-row-id` with `getRowId`. |
| `gdy-kanban-card-head`, `gdy-kanban-card-title`, `gdy-kanban-card-subtitle`, `gdy-kanban-card-value` | Parts of the default card, shared with the kanban. | — |
| `gdy-kanban-card-actions` | Menu slot under a custom `renderCard`. | — |
| `gdy-card-grid-skeleton` | A placeholder card while `loading`; it also carries `gdy-kanban-card-skeleton`. | — |
| `gdy-card-grid-loading` | Wrapper of `renderLoading`. | — |
| `gdy-kanban-filter-row` | Row of filter triggers, the kanban's. | `data-filtered` on a trigger while its column has a filter. |
| `gdy-table-pagination` | Pagination bar, the table's. | — |

A rule on `.gdy-kanban-card` also reaches the cards of the grid; target `.gdy-card-grid-card` to style
only these.

The grid reads these tokens. None is declared by default and each has a fallback:

| Token | Fallback | Sets |
|---|---|---|
| `--gdy-card-grid-min` | `260px` | Narrowest column: `repeat(auto-fill, minmax(var(--gdy-card-grid-min), 1fr))`. A screen narrower than that shows one column as wide as it is, without horizontal scroll. |
| `--gdy-card-grid-gap` | `12px` | Space between cards. |
| `--gdy-card-grid-padding` | `12px` | Space around the grid. |
| `--gdy-card-grid-focus-ring` | `--gdy-ring` | Focus ring of a card. |
| `--gdy-kanban-card-bg`, `--gdy-kanban-card-border` | `--gdy-card`, `--gdy-border` | Card background and border, as in the kanban. |

### Class names per part

`className` adds classes to the root, after `gdy-card-grid` and its flags. `classNames`
(`CardGridClassNames`) adds one class per part, after its hook:

| Key | Hook |
|---|---|
| `root` | `gdy-card-grid` |
| `toolbar` | `gdy-toolbar` |
| `filterRow` | `gdy-kanban-filter-row`, rendered only when some column is filterable |
| `list` | `gdy-card-grid-list` |
| `card` | `gdy-card-grid-card`, default and custom cards alike |
| `pagination` | `gdy-table-pagination` |
| `empty` | `gdy-empty` |

## Props reference

Own props of `CardGridProps<TData>`, in source order.

| Prop | Type | Default | Description |
|---|---|---|---|
| `labels` | `Partial<CardGridLabels>` | Spanish texts | Replaces any text. See [Texts and language](#texts-and-language). |
| `columns` | `ColumnDefinition<TData>[]` | — | Columns to search, filter, sort and render the cards (required). |
| `data` | `DataInput<TData>` | — | Rows: an array or an API envelope (required). |
| `normalizeRow` | `(row: unknown, index: number) => TData` | — | Maps each record of an envelope to `TData`. |
| `getRowId` | `(row: TData, index: number) => string` | position in `data` | Key and `data-row-id` of each card. |
| `features` | `CardGridFeatures` | all `true` | Capability flags. |
| `renderCard` | `(row: TData) => ReactNode` | — | Own content of each card. |
| `onRowClick` | `(row: TData, event: CardClickEvent) => void` | — | Card clicked, or Enter on a focused card. |
| `getRowHref` | `(row: TData) => string \| undefined` | — | Turns a card into a link. |
| `ignoreTextSelectionClick` | `boolean` | `false` | A click that ends selecting text inside a card does not fire it. |
| `pageSizeOptions` | `number[]` | `[15, 25, 50, 100]` | Options of the page size select. |
| `defaultPageSize` | `number` | `25` | First page size. |
| `pageIndex` | `number` | — | Controlled page (0-based). |
| `pageSize` | `number` | — | Controlled page size. |
| `onPaginationChange` | `(state: ManualPaginationState) => void` | — | Page or page size changed. |
| `onVisibleRowsChange` | `(state: VisibleRowsState<TData>) => void` | — | Visible cards on mount and after each change. |
| `search`, `onSearchChange` | `string`, `(query: string) => void` | — | Controlled search. |
| `sorting`, `onSortChange` | `ColumnSortingState \| null`, `(sorting) => void` | — | Controlled sort. |
| `columnFilters`, `onFiltersChange` | `ColumnFiltersState`, `(filters) => void` | — | Controlled filters. |
| `className` | `string` | — | Extra classes for the root. |
| `classNames` | `CardGridClassNames` | — | One class per part. See [Class names per part](#class-names-per-part). |

`CardGridProps` also accepts every `DataViewProps` prop except `viewSwitch` (`searchPlaceholder`,
`createLabel`, `onCreate`, `emptyMessage`, `loading`, `loadingRowCount`, `renderLoading`, `rowActions`,
`archivedView`, `aiButton`, `toggleGroups`, `headerSelectors`, `toolbarLayout`, `toolbarSlots`,
`selectTheme`, `thinScrollbars`, `scrollbarColor`, `optionHoverColor`, `dateFilterRequireOperator`,
`dateInputFormat`, `calendarMonthYearDropdown`, `calendarFromYear`, `calendarToYear`, `calendarLocale`),
documented in [toolbar.md](toolbar.md).

### Types

- `CardGridLabels`: every text of the grid, the shape of `labels`.
- `CardGridFeatures`: the optional boolean flags of `features`.
- `CardClickEvent`: `MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>`, the second argument of `onRowClick`.
- `CardGridClassNames`: the optional classes per part of `classNames`.
- `VisibleRowsState<TData>`, `ManualPaginationState`, `ColumnSortingState` and `ColumnFiltersState`: the
  same types as in `DataTable`, also exported from `gridory/card-grid`.
