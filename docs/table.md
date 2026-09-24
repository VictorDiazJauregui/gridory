# DataTable

[English](table.md) · [Español](table.es.md)

`DataTable` renders typed rows from a list of column definitions and adds global search, sorting,
column filters, row grouping, pagination, inline editing and a row actions menu. It never mutates your
data: every change is emitted through a callback and your app decides what to do with it.

## Import

```ts
import { DataTable, type ColumnDefinition } from "gridory/table";
```

Import `gridory/styles.css` once in your app, before any override (see [theming.md](theming.md)). The
root `gridory` entry re-exports the same names.

## Quick example

```tsx
import { DataTable, type ColumnDefinition } from "gridory/table";

interface Invoice {
  id: string;
  customer: string;
  status: "draft" | "sent" | "paid";
  amount: number;
  issuedAt: string;
}

const columns: ColumnDefinition<Invoice>[] = [
  { id: "customer", header: "Customer", accessor: (row) => row.customer, sortable: true, width: 220 },
  {
    id: "status",
    header: "Status",
    accessor: (row) => row.status,
    searchable: false,
    filterable: true,
    filterOptions: [
      { value: "draft", label: "Draft" },
      { value: "sent", label: "Sent" },
      { value: "paid", label: "Paid" },
    ],
  },
  {
    id: "amount",
    header: "Amount",
    accessor: (row) => row.amount,
    type: "number",
    sortable: true,
    cell: (row) => `$${row.amount.toFixed(2)}`,
  },
  { id: "issuedAt", header: "Issued", accessor: (row) => row.issuedAt, type: "date", filterable: true },
];

const invoices: Invoice[] = [
  { id: "1", customer: "Acme", status: "paid", amount: 1200, issuedAt: "2026-03-01" },
  { id: "2", customer: "Globex", status: "sent", amount: 450.5, issuedAt: "2026-03-12" },
];

const openInvoice = (invoice: Invoice) => window.open(`/invoices/${invoice.id}`);

export const InvoicesTable = () => (
  <DataTable columns={columns} data={invoices} getRowId={(row) => row.id} onRowClick={openInvoice} />
);
```

## Data model

### Rows

`data` accepts a plain array or an API envelope (`DataInput<TData>`): an object with one of `data`,
`items`, `results`, `records` or `payload.data` / `payload.items` / `payload.results`. The first of
those keys that is defined, in that order, is used; if it does not hold an array the table renders no
rows. `normalizeRow(raw, index)` maps every record of an envelope to `TData`. A plain array is used as
is, so `normalizeRow` is not applied to it.

`getRowId(row, index)` gives each row a stable key. Without it, rows are keyed by their index in the
current page, so pass it whenever rows are inserted, removed or reordered.

### Columns

Each entry of `columns` is a `ColumnDefinition<TData>`.

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique id. Referenced by `groupableColumnIds` and `defaultGroupBy`. |
| `header` | `string` | Header text. Also the label of the column in the group selector. |
| `accessor` | `(row: TData) => Primitive \| Primitive[]` | Value used by search, filters, sorting, grouping and the default cell text. Arrays are joined with `", "` in the cell; sorting, grouping and highlights use the first element. Empty values render as `—`. |
| `cell` | `(row: TData) => ReactNode` | Custom cell rendering. Search, filters and sorting keep reading `accessor`. |
| `type` | `"text" \| "number" \| "date"` | Picks the sort comparator. `"date"` also replaces the value filter with a date filter. Default `"text"`. |
| `sortable` | `boolean` | Default `true`. Set `false` to exclude the column from sorting. |
| `searchable` | `boolean` | Default `true`. Set `false` to exclude the column from the global search. |
| `filterable` | `boolean` | Adds a filter menu to the header. Default `false`. |
| `filterOptions` | `FilterOption[]` | Declared `{ value, label }` options for the filter menu. Without them the options are the distinct values found in `data`, sorted alphabetically. Also labels and orders the groups when grouping by this column. |
| `width` | `number` | Column width in pixels. The grid uses `table-layout: fixed`. |
| `inlineEditOptions` | `FilterOption[]` | Together with `onInlineEdit`, renders the cell as a select with these options. |
| `onInlineEdit` | `(row: TData, value: string) => void` | Fires with the chosen option value. |
| `valueHighlights` | `Record<string, CellHighlight>` | `{ className?, style? }` keyed by cell value. `className` is added to the cell content; `style` is applied to the inline select trigger, so it only shows on inline-editable cells. |

Filter options are computed from every row in `data` (before search and filters), not only from the
visible page. Columns with `type: "date"` never get a value list: their menu offers the operators
greater than, less than and between, with a calendar.

## Features

`features` turns whole capabilities on or off. Every flag defaults to `true`.

| Flag | Default | Effect when `false` |
|---|---|---|
| `search` | `true` | Hides the search box and skips the search pipeline. |
| `sorting` | `true` | No sort from headers or filter menus. |
| `filtering` | `true` | No filter menus, no clear-filters button; filters are not applied. |
| `pagination` | `true` | Hides the footer and renders every row. |
| `rowActions` | `true` | Hides the row actions column even when `rowActions` is set. |
| `createButton` | `true` | Hides the create button even when `onCreate` is set. |
| `grouping` | `true` | Hides the group selector and renders the rows ungrouped. |

### Search

The toolbar search box (`searchPlaceholder`, default `"Buscar..."`) keeps the rows where any searchable
column contains the query, case-insensitive, over the values returned by `accessor`. Every column is
searchable unless it sets `searchable: false`. Each change also calls `onSearchChange`. With
`manualPagination` the local matching is skipped and the query is only reported.

### Sorting

One sort is active at a time. On a sortable column without a filter menu the header click cycles
ascending, descending, none, and the header shows the matching arrow. On a filterable column the sort
lives in its filter menu, under "Ordenar": two buttons, ascending and descending, that carry
`aria-pressed`; clicking the active one clears the sort. The "Limpiar" button of a date filter menu
clears both the filter and the sort of that column.

The comparator follows `type`: `"text"` is locale-aware (`es`), ignores case and accents and compares
digit runs numerically; `"number"` compares `Number(value)`; `"date"` compares the first ten characters
of the value as text, so ISO strings such as `"2026-03-01"` or `"2026-03-01T10:00:00Z"` sort by day.
Array values sort by their first element.

### Filtering

The header of a `filterable` column opens a menu: a searchable checklist of values for text and number
columns, and a date filter with the operators greater than, less than and between for `type: "date"`.
The header trigger carries `data-filtered` while a filter is active and the toolbar shows a
clear-filters button. The filter menus, the date inputs and the calendar options are shared with the
kanban and documented in [toolbar.md](toolbar.md).

### Grouping

`groupableColumnIds` lists the ids of the columns the user can group by. The group selector appears in
the toolbar only when it resolves to at least one existing column and `features.grouping` is on; its
options read the column `header`. `defaultGroupBy` sets the initial column and is ignored when it is
not in `groupableColumnIds`. `onGroupChange` fires with the column id, or `null` for "none", on user
changes only.

Three texts are Spanish by default: `groupSelectorLabel` (`"Agrupar por"`, prefixed to every option of
the selector), `groupNoneLabel` (`"Ninguno"`) and `groupEmptyValueLabel` (`"Sin valor"`, the group of
rows whose value is empty).

While a column is grouped:

- That column disappears from the header and the cells; its value is shown by the group row.
- A group row precedes the first row of each group with a toggle: chevron, label and row count. Groups
  start expanded; the toggle collapses or expands the group and exposes `aria-expanded`.
- Groups listed in the column's `filterOptions` come first, in that order and with their `label`; then
  the values without an option, alphabetically and with the raw value as label; the empty group last.
- Grouping runs after search, filters and sort, so rows keep their sort order inside each group.
- Pagination works on the flat list: a collapsed group hides its rows but still counts in the page.
- Picking another column or "none" expands every group and returns to the first page.

```tsx
<DataTable
  columns={columns}
  data={invoices}
  getRowId={(row) => row.id}
  groupableColumnIds={["status"]}
  defaultGroupBy="status"
  onGroupChange={(groupBy) => setGroupBy(groupBy)}
  groupSelectorLabel="Group by"
  groupNoneLabel="None"
  groupEmptyValueLabel="No value"
/>
```

### Pagination

By default the table paginates in memory. `pageSizeOptions` (default `[15, 25, 50, 100]`) feeds the
page-size select and `defaultPageSize` (default `50`) picks the initial size. The footer shows a
summary, `Mostrando 1–50 de 120 elementos` (or `0 elementos` when nothing matches), the
`Elementos por página` select and `Página 1 de 3` with previous and next buttons. `label` replaces the
word `"elementos"`. Any search, filter, sort, grouping or archived-view change returns to the first
page. `features.pagination: false` hides the footer and renders every row.

With `manualPagination` the table renders `data` as the current page, without slicing or counting it.
The page count comes from `serverPageCount`, or from `ceil(serverRowCount / pageSize)`; when neither
is given it falls back to the length of `data`, so always pass one of them. `serverRowCount` is also
the total shown in the summary. `onPaginationChange({ pageIndex, pageSize })` fires when the user
changes page or page size; `onSearchChange(query)` fires on each search change, which also moves the
table back to the first page. Column filters, sorting, grouping and the archived view still apply
locally to the rows of the current page.

```tsx
<DataTable
  columns={columns}
  data={page.rows}
  getRowId={(row) => row.id}
  manualPagination
  serverRowCount={page.total}
  defaultPageSize={25}
  pageSizeOptions={[25, 50]}
  onPaginationChange={({ pageIndex, pageSize }) => fetchPage({ pageIndex, pageSize, query })}
  onSearchChange={(nextQuery) => fetchPage({ pageIndex: 0, pageSize, query: nextQuery })}
/>
```

### Inline editing

A column with a non-empty `inlineEditOptions` and an `onInlineEdit` callback renders its cells as a
select. The select shows the current value when it matches one of the options and the placeholder
`"Seleccionar..."` otherwise. Choosing an option calls `onInlineEdit(row, value)`; the table does not
change the row, so update your data and the cell re-renders. Clicks inside the select do not trigger
`onRowClick`. The select follows `selectTheme` like every other select of the component.

```tsx
{
  id: "status",
  header: "Status",
  accessor: (row) => row.status,
  inlineEditOptions: [
    { value: "draft", label: "Draft" },
    { value: "sent", label: "Sent" },
  ],
  onInlineEdit: (row, value) => updateStatus(row.id, value),
  valueHighlights: {
    paid: { style: { background: "#dcfce7", color: "#166534" } },
  },
}
```

### Row click

`onRowClick(row)` fires when a data row is clicked. Rows then carry `data-clickable`, which the
stylesheet uses for the pointer cursor and the hover background. The row actions menu and the inline
select stop the click, so they never trigger it.

### Layout and scrolling

By default the rows container (`gdy-table-wrap`) scrolls horizontally and grows with its content, with
a minimum height from `tableMinHeightClassName` (default `"gdy-table-min-h-md"`). Two props create an
internal vertical scroll region:

- `tableMaxHeightClassName` caps the rows container and lets it scroll on its own; it needs no
  height-constrained parent.
- `fillHeight` makes the table fill its parent: the root and the card become a flex column and the rows
  container takes the remaining height. The parent must have a bounded height.

The built-in utilities are `gdy-table-min-h-sm` (240px), `gdy-table-min-h-md` (360px),
`gdy-table-min-h-lg` (520px), `gdy-table-max-h-sm` (320px), `gdy-table-max-h-md` (480px) and
`gdy-table-max-h-lg` (640px). Any class of your own works too; an empty `tableMinHeightClassName`
removes the minimum height. `tableWrapClassName` appends extra classes to the rows container, after the
min and max height classes.

`stickyHeader` (default `true`) pins the header to the top of the rows container. It only takes effect
together with `fillHeight` or `tableMaxHeightClassName`, so a table that scrolls with the page is not
affected. `scrollResetOnPageChange` (default `true`) scrolls the rows container back to the top on
every page or page-size change and whenever a search, filter, sort, grouping or archived-view change
returns to the first page. `thinScrollbars` (default `true`) renders thin scrollbars on every internal
scroll area; `scrollbarColor` sets their thumb color (see [toolbar.md](toolbar.md)).

```tsx
<div style={{ height: "calc(100vh - 120px)" }}>
  <DataTable columns={columns} data={invoices} getRowId={(row) => row.id} fillHeight />
</div>
```

## Events

| Callback | Signature | Fires |
|---|---|---|
| `onRowClick` | `(row: TData) => void` | A data row is clicked (not the row actions menu or the inline select). |
| `onGroupChange` | `(groupBy: string \| null) => void` | The user changes the group selector; `null` means "none". Not on mount. |
| `onPaginationChange` | `(state: ManualPaginationState) => void` | Previous or next page, or a page-size change, in both pagination modes. |
| `onSearchChange` | `(query: string) => void` | Every change of the search box, in both pagination modes. |
| `ColumnDefinition.onInlineEdit` | `(row: TData, value: string) => void` | An option is chosen in an inline-editable cell. |

`onCreate`, the `rowActions` callbacks (`onEdit`, `onArchive`, `onArchiveToggle`, `onRemove`,
`onHistory`, custom actions), `archivedView.onChange`, `viewSwitch.onChange`, `aiButton.onClick` and
the `onChange` of toggles and header selectors belong to `DataViewProps`; see
[toolbar.md](toolbar.md).

## Toolbar and row actions

The toolbar above the rows (search box, clear-filters button, archived view selector, group selector,
AI button, table/kanban switch, create button, custom toggle groups and header selectors, and the
`toolbarLayout` that orders them) and the row actions menu at the end of each row (built-in edit,
archive, remove and history actions plus `customActions` and `menuActions`) are shared with the kanban.
They are configured through `DataViewProps` and documented in [toolbar.md](toolbar.md).

## Styling

The root element is `div.gdy-table`, which also carries the flags `gdy-table-fill` (with `fillHeight`),
`gdy-table-sticky` (when the sticky header is effective) and `gdy-thin-scroll` (with `thinScrollbars`).
Inside it, `div.gdy-scope.gdy-card` wraps the toolbar, the rows container `div.gdy-table-wrap.gdy-scroll`
and the pagination footer. Every rule of the stylesheet uses a single class, so a rule with the same
class in your CSS, loaded after `gridory/styles.css`, overrides it.

| Hook | Element | State attributes |
|---|---|---|
| `gdy-table-head-cell` | Header cell (`th`). | — |
| `gdy-table-head-trigger` | Button inside the header cell that opens the filter menu or cycles the sort. | `data-filtered` while the column has an active filter. |
| `gdy-table-row` | Data row (`tr`). | `data-clickable` when `onRowClick` is set. |
| `gdy-table-cell` | Data cell (`td`); `gdy-table-cell-content` wraps its content. | — |
| `gdy-table-group-row` | Group row; `gdy-table-group-cell` is its single cell. | — |
| `gdy-table-group-toggle` | Collapse button of a group, with `gdy-table-group-label` and `gdy-table-group-count`. | `aria-expanded`. |
| `gdy-table-empty-row` | Row shown when no row matches; its cell is `gdy-table-cell gdy-empty`. | — |
| `gdy-table-pagination` | Footer, with `gdy-table-pagination-left`, `gdy-table-pagination-right`, `gdy-table-pagination-text` and `gdy-table-page-size`. | — |

The sort buttons inside a filter menu carry `aria-pressed` on the active direction. The table reads
these tokens, each with a fallback to a base token, so declaring them on `:root` or on your dark theme
scope is enough:

| Token | Fallback | Paints |
|---|---|---|
| `--gdy-table-head-bg` | `--gdy-muted` | Header row background, sticky header included. |
| `--gdy-table-head-fg` | `--gdy-muted-foreground` | Header text. |
| `--gdy-table-border` | `--gdy-border` | Cell, group cell and footer borders. |
| `--gdy-table-row-hover-bg` | `--gdy-muted` | Hover of clickable rows. |
| `--gdy-table-group-bg` | `--gdy-accent` | Group row background. |

```css
:root {
  --gdy-table-head-bg: #f1f5f9;
  --gdy-table-row-hover-bg: #eef2ff;
}

.gdy-table-row[data-clickable]:hover .gdy-table-cell {
  background: var(--gdy-table-row-hover-bg);
}

.gdy-table-group-toggle[aria-expanded="false"] .gdy-table-group-label {
  opacity: 0.7;
}
```

The style contract, the base tokens and the light/dark themes are in [theming.md](theming.md); the
full catalog of classes, state attributes and tokens is in [style-hooks.md](style-hooks.md).

## Props reference

Own props of `DataTableProps<TData>`, in source order.

| Prop | Type | Default | Description |
|---|---|---|---|
| `columns` | `ColumnDefinition<TData>[]` | — | Column definitions (required). |
| `data` | `DataInput<TData>` | — | Rows: an array or an API envelope (required). |
| `normalizeRow` | `(row: unknown, index: number) => TData` | — | Maps each record of an envelope to `TData`. |
| `getRowId` | `(row: TData, index: number) => string` | — | Stable row key. Without it rows are keyed by index. |
| `features` | `DataTableFeatures` | all `true` | Capability flags. |
| `onRowClick` | `(row: TData) => void` | — | Row click handler; marks rows with `data-clickable`. |
| `label` | `string` | `"elementos"` | Noun used by the pagination summary. |
| `pageSizeOptions` | `number[]` | `[15, 25, 50, 100]` | Options of the page-size select. |
| `defaultPageSize` | `number` | `50` | Initial page size. |
| `manualPagination` | `boolean` | `false` | Server-side mode: `data` is the current page. |
| `serverRowCount` | `number` | — | Total rows on the server; derives the page count and the summary total. |
| `serverPageCount` | `number` | — | Total pages on the server; wins over `serverRowCount`. |
| `onPaginationChange` | `(state: ManualPaginationState) => void` | — | Page or page-size change. |
| `onSearchChange` | `(query: string) => void` | — | Search box change. |
| `tableWrapClassName` | `string` | — | Extra classes for the rows container. |
| `tableMinHeightClassName` | `string` | `"gdy-table-min-h-md"` | Minimum height class of the rows container. |
| `tableMaxHeightClassName` | `string` | — | Maximum height class of the rows container; enables internal scrolling. |
| `scrollResetOnPageChange` | `boolean` | `true` | Scroll the rows container to the top on page changes. |
| `stickyHeader` | `boolean` | `true` | Pin the header when the rows scroll internally. |
| `fillHeight` | `boolean` | `false` | Fill the parent height; the rows container scrolls. |
| `groupableColumnIds` | `string[]` | — | Columns offered in the group selector. |
| `defaultGroupBy` | `string \| null` | `null` | Initial grouped column. |
| `onGroupChange` | `(groupBy: string \| null) => void` | — | Group selector change. |
| `groupSelectorLabel` | `string` | `"Agrupar por"` | Prefix of every group selector option. |
| `groupNoneLabel` | `string` | `"Ninguno"` | Label of the "no grouping" option. |
| `groupEmptyValueLabel` | `string` | `"Sin valor"` | Label of the group of empty values. |

`DataTableProps` also accepts every `DataViewProps` prop (`searchPlaceholder`, `createLabel`,
`onCreate`, `emptyMessage`, `rowActions`, `archivedView`, `viewSwitch`, `aiButton`, `toggleGroups`,
`headerSelectors`, `toolbarLayout`, `selectTheme`, `thinScrollbars`, `scrollbarColor`,
`optionHoverColor`, `dateFilterRequireOperator`, `dateInputFormat`, `calendarMonthYearDropdown`,
`calendarFromYear`, `calendarToYear`), documented in [toolbar.md](toolbar.md).

### Types

All of them are exported from `gridory/table` and `gridory`.

- `DataTableFeatures`: the optional boolean flags of `features` (`search`, `sorting`, `filtering`,
  `pagination`, `rowActions`, `createButton`, `grouping`).
- `GroupHeader`: `{ value: string; label: string; count: number }`, one group row.
- `RowGroupingResult<TData>`: `{ flatRows: TData[]; headers: Map<number, GroupHeader> }`, the grouped
  rows with each header keyed by the index of its first row.
- `ManualPaginationState`: `{ pageIndex: number; pageSize: number }`, the payload of
  `onPaginationChange`.
- `ColumnSortingState`: `{ id: string; direction: SortDirection }`, the active sort of a column.
