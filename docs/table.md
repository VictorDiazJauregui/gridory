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
| `align` | `"left" \| "center" \| "right"` | Aligns the cells and the header. See [Alignment](#alignment). Table only. |
| `headerAlign` | `"left" \| "center" \| "right"` | Aligns the header apart from the cells. Defaults to `align`. Table only. |
| `ignoreRowClick` | `boolean` | No gesture that starts in this column fires the row. See [Row click and row links](#row-click-and-row-links). Table only. |
| `overflow` | `"ellipsis" \| "wrap" \| "visible"` | What the cells do with content wider than the column. Default `"ellipsis"`. See [Cell overflow](#cell-overflow). Table only. |

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
column contains the query, ignoring case and accents (`peru` finds `Perú`), over the values returned by
`accessor`. Every column is searchable unless it sets `searchable: false`. Each change also calls
`onSearchChange` with the query exactly as typed. With `manualPagination` the local matching is skipped
and the query is only reported.

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
locally to the rows of the current page; to sort on the server, use `manualSorting`
([Controlled state](#controlled-state)).

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

### Controlled state

Some table state can be owned by your app. The pattern is the same as a React input: pass the value
and its `on…Change` handler and the table shows exactly that value and only reports what the user does;
leave the value `undefined` and the table keeps the state itself, as before. `null` is a value ("no
sort"), not "uncontrolled". Pick one mode for the whole lifetime of the table: switching after mounting
logs a warning in development builds.

#### Sort

- `sorting` (`ColumnSortingState | null`) sets the active sort.
- `onSortChange(sorting)` fires on every sort change made by the user, controlled or not: header click
  (ascending, descending, none), the "Ordenar" buttons of a filter menu and the "Limpiar" button of a
  date filter. It does not fire when the `sorting` prop changes.
- `manualSorting` (default `false`) means the server sorts: the table never reorders `data` and only
  reports the sort. Changing it returns to the first page; `onPaginationChange({ pageIndex: 0, pageSize })`
  fires only when the page was not already the first one, so one request covers both changes.

```tsx
const [sorting, setSorting] = useState<ColumnSortingState | null>(null);
const [page, setPage] = useState({ pageIndex: 0, pageSize: 25 });

// One effect fetches whatever changed: the sort, the page or both.
useEffect(() => {
  fetchInvoices({ ...page, sort: sorting }).then(setResult);
}, [sorting, page]);

<DataTable
  columns={columns}
  data={result.rows}
  manualPagination
  manualSorting
  serverRowCount={result.total}
  defaultPageSize={25}
  sorting={sorting}
  onSortChange={setSorting}
  onPaginationChange={setPage}
/>;
```

### Printing

`printMode` prints a clean table. With it, the print view (Ctrl+P, `window.print()`) hides the
toolbar, the pagination and the whole row actions column (header and cells), lets the rows area grow
to its content (no internal scroll cutting rows, no sticky header), repeats the header on every sheet
and never splits a row between two sheets. The root carries `data-print-mode`.

- `"page"` prints the page on screen.
- `"all"` prints every row that passes the search, the filters and the archived view, in screen
  order. **Groups print expanded, even the ones collapsed on screen.** When printing ends the table is
  back on the page and the collapsed groups it had; neither `onPaginationChange` nor
  `onVisibleRowsChange` fire for printing. The table renders the extra rows on the spot when the
  browser announces the print (`beforeprint`, or the `print` media query), so they are in the printed
  page. Thousands of rows take a moment to render.
- With `manualPagination` the table only has the current page, so `"all"` prints that page: load every
  row first if you need them all on paper.

Without `printMode` nothing changes: the table prints as before. To print your own way instead, leave
the prop out and write an `@media print` stylesheet over the [style hooks](style-hooks.md).

```tsx
<DataTable columns={columns} data={invoices} printMode="all" />
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

### Alignment

`align` (`"left"`, `"center"` or `"right"`) aligns a column: its cells and its header, where the
title and its sort or filter icon move together and keep their order (`Monto ↑↓`). It renders
`data-align` on the `th`, on the header trigger and on every `td`; without it the column stays left
aligned and the markup is unchanged. `headerAlign` aligns the header apart from the cells and
defaults to `align`.

The row actions column has no definition of its own, so `rowActions` configures it:

- `columnLabel`: header text (default none, an empty header).
- `align`: alignment of that header and of the ⋯ button (default `"right"`).
- `triggerLabel`: accessible name and tooltip of the ⋯ button (default `"Opciones"`). The kanban
  card menu takes it too.

```tsx
const columns: ColumnDefinition<Quote>[] = [
  { id: "client", header: "Cliente", accessor: (quote) => quote.client },
  { id: "amount", header: "Monto", accessor: (quote) => quote.amount, type: "number", align: "right" },
];

<DataTable
  columns={columns}
  data={quotes}
  rowActions={{ ...rowActions, columnLabel: "Acciones", align: "center", triggerLabel: "Acciones de la cotización" }}
/>;
```

```css
/* Before: by position, and the header title never moved (the trigger is a flex box) */
.gdy-table-grid tr > :nth-child(2) {
  text-align: right;
}

/* Before: a fake title for the actions column */
.gdy-table-head-row > th:last-child::after {
  content: "Acciones";
}

/* After: nothing, `align` and `rowActions.columnLabel` do it */
```

### Cell overflow

By default every cell cuts its content on one line with an ellipsis. `overflow` changes it per
column:

| Value | What the cell does |
|---|---|
| `"ellipsis"` (default) | One line, cut with `…`. |
| `"wrap"` | Breaks the text over several lines (`white-space: normal` and `overflow-wrap: anywhere`). The row grows in height; the width is still the one set by `width` (the grid uses `table-layout: fixed`). |
| `"visible"` | Lets the content overflow the cell (`overflow: visible`). Meant for a badge or a control that sticks out, not for text: the text stays on one line and is drawn over the next cell. |

It renders `data-overflow` on the `gdy-table-cell-content` of every cell of the column; without it
there is no attribute and the CSS is the same as before.

```tsx
const columns: ColumnDefinition<Company>[] = [
  { id: "name", header: "Empresa", accessor: (company) => company.name, width: 200 },
  { id: "notes", header: "Notas", accessor: (company) => company.notes, width: 280, overflow: "wrap" },
];
```

```css
/* Before: every cell of every table wrapped */
.gdy-table-cell-content {
  white-space: normal;
}

/* After: nothing, `overflow: "wrap"` on the column that needs it */
```

A combobox or a menu inside a cell does not need `"visible"` when its list opens in a portal, as the
inline-edit select does: the list is rendered outside the table and nothing cuts it. `"visible"` only
reaches the edge of the rows container (`gdy-table-wrap`), which scrolls: what goes past that edge is
cut or adds a scroll bar.

### Row click and row links

`onRowClick(row, event)` fires when a data row is clicked. `event` is the React event of the row: a
mouse click, or a key press when the row is focusable (see below), typed as `RowClickEvent`. A
handler that only takes `row` keeps working. Rows then carry `data-clickable`, which the stylesheet
uses for the pointer cursor and the hover background.

`getRowHref(row)` turns rows into links without wrapping them in `<a>` (HTML does not allow an `<a>`
around a `<tr>`). The row carries `data-href` and:

| Gesture | With `onRowClick` | Without `onRowClick` |
|---|---|---|
| Click | `onRowClick(row, event)`, so your router decides | Navigates to the link in the same tab |
| Ctrl/Cmd + click, middle click | Opens the link in a new tab (`noopener`) | Same |
| Enter (focused row) | Same as a click | Same as a click |
| Ctrl/Cmd + Enter | Opens the link in a new tab | Same |

`javascript:`, `data:` and `vbscript:` destinations are ignored: the row behaves as if it had no
link. Return `undefined` for rows that should not link.

**Keyboard.** `focusableRows` lets the rows take the focus with Tab and fire with Enter, with a
visible focus ring (`--gdy-table-row-focus-ring`). It defaults to `false`, so a table that already
uses `onRowClick` keeps the 1.0.1 behavior. Rows with `getRowHref` are focusable unless you pass
`focusableRows={false}`: a link you cannot reach with the keyboard is no link. Rows with neither
`onRowClick` nor `getRowHref` are never focusable.

**What does not fire the row.** The row actions menu and the inline select never do. A column with
`ignoreRowClick: true` never does, with any gesture: use it for columns of selects, links or text
meant to be copied. Your own buttons and links in other columns still reach `onRowClick` with a
plain click, as in 1.0.1; the gestures that open the row link (Ctrl/Cmd + click, middle click, Enter)
skip them and leave them to the browser.

```tsx
const navigate = useNavigate();

<DataTable
  columns={columns}
  data={companies}
  getRowId={(company) => company.id}
  getRowHref={(company) => `/companies/${company.id}`}
  onRowClick={(company) => navigate(`/companies/${company.id}`)}
/>;
```

### Row hooks

Every data row carries `data-row-id` with its id: the value of `getRowId`, or, without it, the
position of the row in the current page (`"0"`, `"1"`…, repeated on every page and changing with the
sort). Pass `getRowId` when you need a stable id.

`getRowClassName(row)` adds class(es) after `gdy-table-row`, and `getRowAttributes(row)` adds `data-*`
and `aria-*` attributes. Both run once per row and render, so keep them cheap.

- `undefined` omits an attribute; `false` omits a `data-*` one too, but renders `"false"` on an
  `aria-*` one, where it is a state.
- Other names, and the ones the table writes itself (`data-row-id`, `data-clickable`, `data-href`), are ignored.
  The table may write more of its own attributes in later versions; prefer names of your domain
  (`data-archived`, `data-priority`).

```tsx
<DataTable
  columns={columns}
  data={quotes}
  getRowId={(quote) => quote.id}
  getRowAttributes={(quote) => ({ "data-archived": quote.archived })}
/>
```

```css
/* Before: reaches the row through a marker inside one of its cells */
tr:has([data-quote-archived]) {
  opacity: 0.6;
}

/* After */
.gdy-table-row[data-archived] {
  opacity: 0.6;
}
```

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
| `onRowClick` | `(row: TData, event: RowClickEvent) => void` | A data row is clicked, or Enter on a focusable row (not the row actions menu, the inline select or an `ignoreRowClick` column). |
| `onGroupChange` | `(groupBy: string \| null) => void` | The user changes the group selector; `null` means "none". Not on mount. |
| `onPaginationChange` | `(state: ManualPaginationState) => void` | Previous or next page, or a page-size change, in both pagination modes. |
| `onSearchChange` | `(query: string) => void` | Every change of the search box, in both pagination modes. |
| `onSortChange` | `(sorting: ColumnSortingState \| null) => void` | Every sort change made by the user, controlled or not ([Controlled state](#controlled-state)). |
| `onVisibleRowsChange` | `(state: VisibleRowsState<TData>) => void` | On mount, and whenever search, filters, sort, grouping or the page change the visible rows ([Visible rows](#visible-rows)). |
| `ColumnDefinition.onInlineEdit` | `(row: TData, value: string) => void` | An option is chosen in an inline-editable cell. |

`onCreate`, the `rowActions` callbacks (`onEdit`, `onArchive`, `onArchiveToggle`, `onRemove`,
`onHistory`, custom actions), `archivedView.onChange`, `viewSwitch.onChange`, `aiButton.onClick` and
the `onChange` of toggles and header selectors belong to `DataViewProps`; see
[toolbar.md](toolbar.md).

### Visible rows

`onVisibleRowsChange` hands you what the user is looking at, so you can show totals or export the
filtered list without reading the DOM. One event carries both scopes:

| Field | Client-side (default) | `manualPagination` |
|---|---|---|
| `pageRows` | The rows of the current page, in screen order. Rows of a collapsed group count: they still take a place in the page. | The page you passed, after the column filters and sort the table applies to it. |
| `filteredRows` | Every row that passes search, archived view and filters, sorted (and in group order), before paging. With `features.pagination: false` it equals `pageRows`. | Equals `pageRows`: the server has the rest. |
| `totalRows` | `filteredRows.length`. | `serverRowCount`, or `filteredRows.length` without it. |

It fires on mount and after each change, and never twice for the same result: it compares the rows
one by one with the last report, so inline `columns` or an inline handler do not re-trigger it.
Passing `data` with new row objects on every render does: memoize `data` (or keep the rows in state).

```tsx
// Before: watching the DOM for rendered rows
const observer = new MutationObserver(() => {
  const ids = [...document.querySelectorAll("[data-quote-id]")].map((row) => row.dataset.quoteId);
  setTotals(sumByCurrency(quotes.filter((quote) => ids.includes(quote.id))));
});

// After
<DataTable
  columns={columns}
  data={quotes}
  onVisibleRowsChange={({ filteredRows }) => setTotals(sumByCurrency(filteredRows))}
  toolbarSlots={[{ id: "totals", content: <Totals value={totals} /> }]}
/>;
```

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
and the pagination footer. Almost every rule of the stylesheet uses a single class, so a rule with the
same class in your CSS, loaded after `gridory/styles.css`, overrides it. The few rules with more than
one class follow the specificity contract of [theming.md](theming.md), and
[style-hooks.md](style-hooks.md) lists each one with its specificity: to override them, write the same
selector.

| Hook | Element | State attributes |
|---|---|---|
| `gdy-table-head-cell` | Header cell (`th`). | `data-column-id` with the `id` of its column; `data-align` with `headerAlign` or `align`. |
| `gdy-table-head-trigger` | Button inside the header cell that opens the filter menu or cycles the sort. | `data-filtered` while the column has an active filter; `data-align` like its cell. |
| `gdy-table-row` | Data row (`tr`). | `data-row-id` with the row id; `data-clickable` when `onRowClick` or `getRowHref` is set; `data-href` with the link; plus what `getRowAttributes` returns. Focusable rows take `:focus-visible`. |
| `gdy-table-cell` | Data cell (`td`); `gdy-table-cell-content` wraps its content. | `data-column-id` with the `id` of its column; `data-align` with `align`. `gdy-table-cell-content` takes `data-overflow` with `overflow`. |
| `gdy-table-actions-cell` | Box of the ⋯ button in the actions column; `gdy-table-actions-head-label` is the text of its header (`rowActions.columnLabel`). | `data-align` when `rowActions.align` or `columnLabel` is set. |
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
| `--gdy-table-row-focus-ring` | `--gdy-ring` | Keyboard focus ring of a focusable row. |
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

### Class names per part

`className` adds classes to the root and `classNames` adds one class per part, always after the
`gdy-*` hook of that part, so both are visible in the DOM and the hook never goes away:

| `classNames` key | Element | Hook it joins |
|---|---|---|
| `root` | Root `div` (same as `className`, which goes first) | `gdy-table` |
| `toolbar` | Toolbar | `gdy-toolbar` |
| `wrap` | Rows scroll container | `gdy-table-wrap` |
| `table` | `table` | `gdy-table-grid` |
| `headRow` | Header row | `gdy-table-head-row` |
| `headCell` | Every header cell, the actions column included | `gdy-table-head-cell` |
| `row` | Every data row | `gdy-table-row` |
| `cell` | Every data cell, the actions column included | `gdy-table-cell` |
| `pagination` | Pagination footer | `gdy-table-pagination` |
| `empty` | Cell of the empty state (it does not take `cell`) | `gdy-empty` |

Group rows keep their own hooks and take neither `row` nor `cell`. `tableMinHeightClassName`,
`tableMaxHeightClassName` and `tableWrapClassName` keep working: `classNames.wrap` goes after them.
`getRowClassName(row)` goes after `classNames.row`, since it is the more specific of the two.

```tsx
<DataTable
  columns={columns}
  data={companies}
  className="shadow-sm"
  classNames={{ row: "even:bg-slate-50", pagination: "bg-slate-50", empty: "italic" }}
/>
```

A consumer class weighs the same as the `gdy-*` rule of its part (one class, 0-1-0), so for a
property the stylesheet already sets, such as a background, the stylesheet loaded last wins. Load
yours after `gridory/styles.css`, or change the token of that part from the class: the header cells
paint the header background themselves when the header is sticky, so a class on `headRow` sets
`--gdy-table-head-bg` instead (`[--gdy-table-head-bg:theme(colors.sky.100)]` in Tailwind).

### Selecting a column

Every header cell and every data cell carries `data-column-id` with the `id` of its column
definition, the row actions column included (`_actions`). The group rows and the empty-state cell
span the whole row and carry none. The attribute follows the column, not its position, so a rule on
it keeps working when the columns are reordered, hidden or grouped (to align a column, use
[`align`](#alignment)):

```css
/* Before: breaks as soon as a column moves */
.gdy-table-grid tr > :nth-child(5) {
  background: #f8fafc;
}

/* After */
.gdy-table-head-cell[data-column-id="amount"],
.gdy-table-cell[data-column-id="amount"] {
  background: #f8fafc;
}

.gdy-table-cell[data-column-id="_actions"] {
  width: 64px;
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
| `onRowClick` | `(row: TData, event: RowClickEvent) => void` | — | Row click handler; marks rows with `data-clickable`. |
| `getRowHref` | `(row: TData) => string \| undefined` | — | Turns the row into a link (`data-href`). |
| `focusableRows` | `boolean` | `false` (`true` with `getRowHref`) | Rows take the focus with Tab and fire with Enter. |
| `getRowClassName` | `(row: TData) => string \| undefined` | — | Extra class(es) for a row, after `gdy-table-row`. |
| `getRowAttributes` | `(row: TData) => RowAttributes` | — | Extra `data-*` and `aria-*` attributes for a row. |
| `label` | `string` | `"elementos"` | Noun used by the pagination summary. |
| `pageSizeOptions` | `number[]` | `[15, 25, 50, 100]` | Options of the page-size select. |
| `defaultPageSize` | `number` | `50` | Initial page size. |
| `manualPagination` | `boolean` | `false` | Server-side mode: `data` is the current page. |
| `serverRowCount` | `number` | — | Total rows on the server; derives the page count and the summary total. |
| `serverPageCount` | `number` | — | Total pages on the server; wins over `serverRowCount`. |
| `onPaginationChange` | `(state: ManualPaginationState) => void` | — | Page or page-size change. |
| `sorting` | `ColumnSortingState \| null` | — | Controlled sort; `undefined` leaves it to the table. |
| `onSortChange` | `(sorting: ColumnSortingState \| null) => void` | — | Sort change made by the user. |
| `manualSorting` | `boolean` | `false` | The server sorts: `data` is never reordered. |
| `onSearchChange` | `(query: string) => void` | — | Search box change. |
| `onVisibleRowsChange` | `(state: VisibleRowsState<TData>) => void` | — | Visible rows on mount and after each change. |
| `tableWrapClassName` | `string` | — | Extra classes for the rows container. |
| `printMode` | `"page" \| "all"` | — | Clean print of the page or of every filtered row. See [Printing](#printing). |
| `className` | `string` | — | Extra classes for the root, after `gdy-table` and its flags. |
| `classNames` | `DataTableClassNames` | — | One class per part. See [Class names per part](#class-names-per-part). |
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
`onCreate`, `emptyMessage`, `loading`, `loadingRowCount`, `renderLoading`, `rowActions`, `archivedView`,
`viewSwitch`, `aiButton`, `toggleGroups`,
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
- `VisibleRowsState<TData>`: `{ pageRows: TData[]; filteredRows: TData[]; totalRows: number }`, the
  payload of `onVisibleRowsChange`.
- `RowClickEvent`: `MouseEvent<HTMLTableRowElement> | KeyboardEvent<HTMLTableRowElement>`, the second
  argument of `onRowClick`.
- `RowAttributes`: the object `getRowAttributes` returns, with `data-*` and `aria-*` names only and
  `string | number | boolean | undefined` values.
- `DataTableClassNames`: the optional classes per part of `classNames`.
