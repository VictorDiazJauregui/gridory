# Toolbar, filters and row actions

[English](toolbar.md) · [Español](toolbar.es.md)

`DataTable` and `KanbanBoard` share one set of props, `DataViewProps<TData>`: the toolbar, the
column filters, the archived view and the actions menu of each record. This guide covers them once
for both components ([table.md](table.md), [kanban.md](kanban.md)). Where it says "row", read "card"
in the kanban; a table "column" is a kanban "field". The built-in texts are Spanish; each section
names the prop that replaces a text. The labels inside the filter menus and the calendar, the
clear-filters button and the tooltip of the actions button have no override prop.

## What the toolbar contains

The toolbar has a left group and a right group. Each built-in control has a slot id and renders only
when its condition holds:

| Slot id | Side | Control | Renders when |
|---|---|---|---|
| `search` | left | Search box | `features.search` is on (the default). |
| `clearFilters` | left | `"Limpiar filtros"` button | `features.filtering` is on and a filter is active. |
| `archived` | right | Archived view select | `archivedView` and `rowActions.getIsArchived` are both set. |
| `group` | right | Group selector | Table: `groupableColumnIds` names a column and `features.grouping` is on. Kanban: `features.groupSelector` is on. |
| `ai` | right | AI button | `aiButton` is set. |
| `viewSwitch` | right | Table/kanban switch | `viewSwitch` is set. |
| `create` | right | Create button | `onCreate` is set and `features.createButton` is on. |

The group selector is described in [table.md](table.md) and [kanban.md](kanban.md). Your own
controls (`toggleGroups`, `headerSelectors`) always render and use their `id` as slot id. By
default the left side holds `search`, `clearFilters` and the custom controls whose `position` is
`"left"`; the right side holds the custom controls with `position` `"right"` (the default), then
`archived`, `group`, `ai`, `viewSwitch` and `create`. Toggle groups come before header selectors,
each in array order. Your own slots (`toolbarSlots`) go last on their side ([Your own
slots](#your-own-slots)).

The toolbar is one row while everything fits. On a narrow screen, such as a phone, the groups and
their controls wrap to more rows (the right group stays aligned to the right) instead of making the
page wider than the screen. A page wider than the screen also breaks the menus and the calendar on
phones: their scroll lock measures a scrollbar as wide as the overflow and leaves the page with no
width.

`toolbarLayout` (`{ left?: string[]; right?: string[] }`) replaces the default layout. When it is
set, only the listed ids render, on the side and in the order given. Unlisted ids do not render, the
`position` of custom controls is ignored, unknown ids are ignored, and a listed control whose
condition does not hold (for example `create` without `onCreate`) is skipped. Here `scope` is the
`id` of a toggle group:

```tsx
<DataTable {...tableProps} toolbarLayout={{ left: ["scope", "search"], right: ["create"] }} />
```

## Search

The search box filters as you type. `searchPlaceholder` sets its placeholder: `"Buscar..."` in the
table, `"Buscar cards..."` in the kanban.

A row matches when the value of any searchable column contains the query. Every column takes part
unless it sets `searchable: false`. The query and the values returned by `accessor` (each element of
an array value is tested) are compared without case, accents or repeated spaces, so `"peru"` matches
`"Perú"`; the output of `cell` is not searched. Rows go through search first, then the archived view,
the column filters and the sort. In the table, `manualPagination` skips the local match and only
reports the query, exactly as typed, through `onSearchChange` ([table.md](table.md)).

## Create button

`onCreate` adds a primary button with a plus icon, last on the right by default. It calls
`onCreate()` with no arguments; what it opens or adds is up to you. `createLabel` sets its text
(default `"Nuevo"`). `features.createButton: false` hides it even when `onCreate` is set.

## Empty state

When no row or card passes the search, the filters and the archived view, the table and the kanban
show `emptyMessage`: the text `"No se encontraron resultados"` by default, your own text, or any node
(an icon, a link, a button). `null`, `false` or `""` leave the empty state without text. In the
table it renders inside `td.gdy-table-cell.gdy-empty`, which never fires `onRowClick`; in the kanban,
inside `div.gdy-empty`.

```tsx
<DataTable
  columns={columns}
  data={companies}
  onCreate={openCreateDialog}
  emptyMessage={
    <>
      No companies match. <button type="button" onClick={openCreateDialog}>Create one</button>
    </>
  }
/>
```

## Loading state

`loading` tells the view that its data is on the way. The table keeps its toolbar, header and
pagination, and paints `loadingRowCount` placeholder rows (default `5`) in place of the rows:
`tr.gdy-table-skeleton-row` with one `td.gdy-table-cell.gdy-table-skeleton` per visible column (the
actions column included), each holding a bar `span.gdy-skeleton`. They share the padding of a real cell,
so a placeholder row is as tall as a data row. The kanban keeps its toolbar and filter row and paints
the columns it already knows (from `group.values` or from the current data) with their real title and
without the count, each with `loadingRowCount` placeholder cards (`article.gdy-kanban-card-skeleton`);
before the first data, when no column is known, it paints three placeholder columns. The placeholders
carry `aria-hidden="true"`.

While loading, the root (`.gdy-table`, `.gdy-kanban`) carries `aria-busy="true"` and `data-loading`,
the empty state is never shown and the table does not report `onVisibleRowsChange`: the next report comes
with the new data, if it changed. With rows already on screen (a page change on the server, for
example) the placeholders replace them until `loading` is `false` again. `renderLoading` replaces the
placeholders with your own content, in the same place: a full-width `tr.gdy-table-loading-row` in the
table, the board viewport in the kanban. The bar takes its color from `--gdy-skeleton-bg` and its shine
from `--gdy-skeleton-shine` ([Theming](theming.md#component-tokens)); the shine only moves without
reduced motion.

```tsx
<DataTable
  columns={columns}
  data={page.rows}
  loading={isFetching}
  loadingRowCount={10}
  manualPagination
  serverRowCount={page.total}
/>
```

## Filters

A column gets a filter menu when it sets `filterable: true` and `features.filtering` is on. In the
table the menu opens from the column header. In the kanban a filter row under the toolbar shows one
trigger per filterable field, labelled with its `header`. The menu closes on a click outside it or a
second click on its trigger. Filters on different columns combine with AND.

The menu opens under its trigger, to the right. When it does not fit there (a trigger near the right
edge of a phone, or a header cell at the end of the table's scroll), it opens to the left, aligned with
the trigger's right edge, and its holder (`gdy-table-menu-holder`, `gdy-kanban-filter-menu-holder`)
carries `data-align="end"`; when not even that fits, it slides right just enough to keep 8px from the
edge.

### Value filter

Text and number columns get a checklist. Its options are the column's `filterOptions`, in their
order, when that array is not empty. Otherwise they are the distinct values found in `data` (each
element of an array value counts, empty values are skipped), sorted with Spanish collation and
computed from all rows, before search and filters. A row passes when any of its values is checked.
Each check applies at once; the value menu has no apply button.

- **"Ordenar"**: `"Ascendente (A → Z)"` and `"Descendente (Z → A)"`, when the column can be sorted.
  The active direction carries `aria-pressed="true"`.
- **"Filtrar"**: `"Seleccionar todo (n)"` checks every option matching the menu search; `"Limpiar"`
  unchecks all.
- **"Valores"**: a search input (`"Buscar..."`) that narrows the options by label or value, ignoring
  case and accents, and the checklist (`"Sin resultados"` when nothing matches).

### Date filter

A filterable column with `type: "date"` gets a date menu. Under `"Operador"` it offers
`"Mayor que (fecha posterior)"`, `"Menor que (fecha anterior)"` and `"Entre (rango)"`. Once an
operator is picked, `"Fechas"` shows one date input, or two for the range. Changes are a draft:
`"Aplicar"` applies them and closes the menu; `"Limpiar"` applies the empty filter and also removes
the sort of that column. When the column can be sorted the menu starts with `"Ordenar"`:
`"Ascendente (antigua → reciente)"` and `"Descendente (reciente → antigua)"`.

Row values are compared by their first ten characters as `YYYY-MM-DD` text, so pass ISO dates such
as `"2026-03-01"` or `"2026-03-01T10:00:00Z"`. "Greater than" and "less than" exclude the chosen
day; "between" includes both ends. Rows with an empty value never match an active date filter.

- `dateFilterRequireOperator` (default `true`) opens the menu with no operator selected and hides
  the date inputs until one is picked. `false` preselects "greater than".
- `dateInputFormat` is the mask of every date input: `"dd/mm/yyyy"` (default), `"dd-mm-yyyy"`,
  `"mm/dd/yyyy"` or `"mm-dd-yyyy"`. It sets the placeholder and the display format, and parses typed
  text, which applies once it forms a valid date. On blur the input shows the formatted value again.
- The calendar opens from the icon button next to the date input (the second input of a range) or
  with the Down arrow key in that input. The range calendar shows two months. It closes once a date,
  or a range of two different days, is picked.
- `calendarMonthYearDropdown` (default `true`) shows month and year dropdowns in the calendar
  header; `false` shows a static month label. The years run from `calendarFromYear` (default:
  current year minus 100) to `calendarToYear` (default: current year plus 10).
- The calendar uses the Spanish locale (month and weekday names, weeks starting on Monday) unless
  `calendarLocale` sets another `date-fns` locale. A locale from `react-day-picker/locale` also
  translates the calendar's accessible names.
- Every text of the toolbar and the menus (this page's "Limpiar filtros", "Ordenar", "Aplicar"…) is
  replaceable with `labels`: see [table.md](table.md#texts-and-language) and
  [kanban.md](kanban.md#texts-and-language).

### Clearing filters

While a filter is active the toolbar shows `"Limpiar filtros"`. A value filter is active when an
option is checked; a date filter when "greater than" or "less than" has a date, or "between" has
both. The button removes every value and date filter and keeps the search, the sort and the
archived view. The trigger of a filtered column (table header button, kanban field trigger) carries
`data-filtered` and shows a filter icon.

### Sorting from the menu

One sort is active at a time; sorting another column replaces it. The comparator follows the column
`type` (see [table.md](table.md)). `features.sorting: false` removes every sort button and
`sortable: false` removes them from one column. The components differ:

- Table: in both menus, clicking the active direction again removes the sort. A sortable column
  without a filter menu sorts from its header, cycling ascending, descending and none.
- Kanban: in the value menu, clicking the active direction again removes the sort. In the date menu
  a button sets its direction and clicking it again keeps it; `"Limpiar"` removes it. Sort buttons
  exist only in the field menus, so sorting needs `filterable: true` and `features.filtering`.

## Archived view

`archivedView` adds a select that shows active rows, archived rows or all of them. It needs
`rowActions.getIsArchived` to know whether a row is archived; without it the select does not render
and no row is hidden. `archivedView={{}}` is enough to turn it on.

The options read `"<label>: <option>"`, with `label` `"Mostrar"` and `optionLabels`
`{ active: "Activos", archived: "Archivados", all: "Todos" }` by default (`optionLabels` accepts any
subset). `"active"` keeps the rows where `getIsArchived` returns `false`, `"archived"` those where
it returns `true`, and `"all"` keeps every row. Uncontrolled, the component keeps the mode, starting
at `defaultValue` (default `"active"`). Controlled, pass `value` and update it from `onChange`,
which fires on every user change.

```tsx
<KanbanBoard {...boardProps} archivedView={{ value: mode, onChange: setMode, label: "Show" }} />
```

## View switch and AI button

`viewSwitch` renders a table button and a kanban button; the active one carries
`aria-pressed="true"` and clicking it does nothing. The component does not swap itself:
`onChange(view)` reports the picked view and you render the other component. `tableLabel` and
`kanbanLabel` set the texts (defaults `"Tabla"` and `"Kanban"`).

```tsx
const [view, setView] = useState<ViewMode>("table");
const viewSwitch = { active: view, onChange: setView, tableLabel: "Table", kanbanLabel: "Board" };

return view === "table" ? (
  <DataTable {...tableProps} viewSwitch={viewSwitch} />
) : (
  <KanbanBoard {...boardProps} viewSwitch={viewSwitch} />
);
```

`aiButton` renders a button with a sparkles icon; `label` sets its text and accessible name (default
`"AI"`). The button only calls `onClick()`: keep an open state in your app, set it there and pass it
to the `open` and `onClose` props of `AIChatSidebar` (see [ai-assistant.md](ai-assistant.md)).

## Toggle groups and header selectors

`toggleGroups` adds segmented controls and `headerSelectors` adds selects. The component does not
interpret them: each shows the `value` you pass and calls its `onChange`, and you decide what
changes (a dataset, a scope, a query).

In a toggle group, clicking the selected option does not deselect it. `display` sets what each
option shows: `"both"` (default), `"label"` or `"icon"`; an option without `icon` shows its label in
every mode. Each option uses its label as `aria-label` and tooltip; `ariaLabel` names the group.

A header selector with a `label` shows each option as `"<label>: <option>"` and uses the label as
accessible name. `placeholder` (default: the `label`) shows while `value` matches no option. Both
controls take `position` (`"left"` or `"right"`, default `"right"`), used only without
`toolbarLayout`.

```tsx
const [period, setPeriod] = useState("all");
const [country, setCountry] = useState("all");
const periodToggle: ToggleGroupConfig = {
  id: "period",
  ariaLabel: "Period",
  value: period,
  onChange: setPeriod,
  position: "left",
  options: [{ value: "all", label: "All years" }, { value: "current", label: "This year" }],
};
const countrySelector: HeaderSelectConfig = {
  id: "country",
  label: "Country",
  value: country,
  onChange: setCountry,
  options: [{ value: "all", label: "All" }, { value: "CL", label: "Chile" }],
};

<DataTable {...tableProps} toggleGroups={[periodToggle]} headerSelectors={[countrySelector]} />;
```

## Your own slots

`toolbarSlots` adds your own content to the toolbar (a counter, a button, a menu) without portals or
absolute positioning. Each slot has an `id` and a `content` (`ReactNode`), and renders inside
`div.gdy-toolbar-slot` with `data-slot-id` set to that id; `className` adds your class to that
wrapper. The wrapper lays its content in one row, centered and 8px apart, like the built-in controls.
On a narrow screen a whole slot moves to the next row of the toolbar; its content never splits.

- Without `toolbarLayout`, a slot goes at the **end** of its `position` side (`"left"` or `"right"`,
  default `"right"`): on the right, after `create`. Slots keep their array order.
- With `toolbarLayout`, a slot id is placed like any other id, and an unlisted slot does not render.
- The id must be unique: one that repeats another slot, or is taken by a built-in slot (`search`,
  `clearFilters`, `archived`, `group`, `ai`, `viewSwitch`, `create`), a toggle group or a header
  selector, throws `DuplicateToolbarSlotError` with the id in its message.

```tsx
const slots: ToolbarCustomSlot[] = [
  { id: "seats", content: <Badge>Seats 7/10</Badge> },
  { id: "newContact", content: <NewContactMenuButton /> },
];

<DataTable
  {...tableProps}
  toolbarSlots={slots}
  features={{ createButton: false }}
  toolbarLayout={{ left: ["search", "clearFilters"], right: ["seats", "newContact"] }}
/>;
```

The kanban takes the same prop. A slot is a regular React child: its state and handlers stay in your
component, and the toolbar only decides where it goes.

## Row and card actions

`rowActions` fills a menu opened from a "more" button (tooltip and accessible name `triggerLabel`, default `"Opciones"`): in an extra last
column of the table, and in the card header of the kanban (below your markup with `renderCard`).
`features.rowActions: false` removes it. The menu opens in a portal and repositions itself to stay
on screen; clicks inside it do not trigger `onRowClick` or `onCardClick`. When no action resolves
for a row, the button is not rendered.

A built-in action shows when its callback is set, unless its flag (`edit`, `archive`, `remove`,
`history`) is `false`. Every callback receives the row.

| Action | Callback | Label prop (default) |
|---|---|---|
| `edit` | `onEdit` | `editLabel` (`"Editar"`) |
| `archive` | `onArchiveToggle` (wins) or `onArchive` | `archiveLabel` (`"Archivar"`); `unarchiveLabel` (`"Desarchivar"`) with a restore icon when `getIsArchived(row)` is `true` |
| `remove` | `onRemove` | `deleteLabel` (`"Eliminar"`); styled as destructive |
| `history` | `onHistory` | `historyLabel` (`"Ver historial"`) |

`customActions` adds `RowAction` items: `placement: "top"` before the built-ins, `"bottom"`
(default) after them, in array order within each group. `hidden(row)` drops an item for that row,
`disabled(row)` disables it and `variant: "destructive"` styles it like remove. No separators are
added.

```tsx
import { DataTable, type ColumnDefinition, type RowActions } from "gridory/table";

interface Invoice {
  id: string;
  customer: string;
  archived: boolean;
}

const columns: ColumnDefinition<Invoice>[] = [
  { id: "customer", header: "Customer", accessor: (invoice) => invoice.customer },
];
const invoices: Invoice[] = [{ id: "1", customer: "Acme", archived: false }];
const post = (invoice: Invoice, action: string) =>
  fetch(`/api/invoices/${invoice.id}/${action}`, { method: "POST" });

const rowActions: RowActions<Invoice> = {
  onEdit: (invoice) => window.location.assign(`/invoices/${invoice.id}/edit`),
  onArchiveToggle: (invoice) => post(invoice, "archive"),
  getIsArchived: (invoice) => invoice.archived,
  onRemove: (invoice) => post(invoice, "delete"),
  editLabel: "Edit",
  archiveLabel: "Archive",
  unarchiveLabel: "Restore",
  deleteLabel: "Delete",
  customActions: [
    { id: "remind", label: "Send reminder", onClick: (invoice) => post(invoice, "remind") },
  ],
};

export const InvoicesTable = () => (
  <DataTable columns={columns} data={invoices} getRowId={(row) => row.id} rowActions={rowActions} />
);
```

`menuActions` composes the whole menu from [`MenuItem`](#menuitem) entries: custom actions,
built-in references, separators and headings. A non-empty array replaces `customActions` and the
default order. A built-in reference uses the callback and label from `rowActions` and is skipped
when that built-in is not available. Continuing the example (`MenuItem` comes from `gridory/table`):

```tsx
const menuActions: MenuItem<Invoice>[] = [
  { kind: "label", id: "quick", label: "Quick actions" },
  { id: "remind", label: "Send reminder", onClick: (invoice) => post(invoice, "remind") },
  { kind: "separator", id: "main" },
  { kind: "builtin", id: "edit" },
  { kind: "builtin", id: "archive" },
  { kind: "separator", id: "danger" },
  { kind: "builtin", id: "remove" },
];

<DataTable columns={columns} data={invoices} rowActions={{ ...rowActions, menuActions }} />;
```

Ids are checked when a menu renders. A custom action may not use a built-in id
(`BUILT_IN_ROW_ACTION_IDS`: `"edit"`, `"archive"`, `"remove"`, `"history"`), custom action ids must
be unique, and every `menuActions` item id (separators and labels included) must be unique. A
collision throws `DuplicateRowActionError`, exported like the types below.

### Text and icon per row, and submenus

`label` and `icon` take a function of the row, so one action can read differently on each row
instead of two actions with opposite `hidden`:

```tsx
const toggleFavorite: RowAction<Invoice> = {
  id: "favorite",
  label: (invoice) => (invoice.favorite ? "Remove favorite" : "Mark favorite"),
  icon: (invoice) => (invoice.favorite ? <StarOff /> : <Star />),
  onClick: (invoice) => post(invoice, "favorite"),
};
```

An entry with `items` instead of `onClick` (`RowActionSubmenu`) opens a submenu with those actions.
`items` can also be a function of the row. It goes in `customActions` or in `menuActions` like any
action, takes `label`, `icon`, `placement`, `disabled` and `hidden`, and holds plain actions only (one
level). A submenu with no visible action is not rendered. The arrow keys move between the levels:
right opens the submenu, left closes it and Escape closes the whole menu. The panel opens on the side
with room and stays on screen, also on a phone.

```tsx
const changeStatus: RowActionSubmenu<Invoice> = {
  id: "status",
  label: "Change status",
  items: ["draft", "sent", "paid"].map((status) => ({
    id: `status-${status}`,
    label: status,
    onClick: (invoice) => post(invoice, `status/${status}`),
    hidden: (invoice) => invoice.status === status,
  })),
};

const rowActions: RowActions<Invoice> = { customActions: [toggleFavorite, changeStatus] };
```

The ids inside a submenu share the menu's namespace: they are checked with the rest and a repeated
one, or a built-in id, throws `DuplicateRowActionError` too. Code that reads `action.label` of a
`RowAction` as text has to handle the function form.

## Select styling and scrollbars

`selectTheme` styles every select of the component: the toolbar selects (archived view, group
selector, header selectors) and, in the table, the inline edit and page-size selects. Each color and
`radius` key is written as an inline `--gdy-select-*` custom property on the select trigger and its
dropdown, so it wins over the same token in your stylesheet (see [SelectTheme](#selecttheme)).
`triggerClassName`, `contentClassName` and `itemClassName` add classes to the trigger, the dropdown
and each option.

`thinScrollbars` (default `true`) adds the class `gdy-thin-scroll` to the root, which thins the
scrollbars of every internal scroll area (rows or board viewport, option lists, capped regions);
`false` keeps the native ones. `scrollbarColor` sets the thumb through `--gdy-scrollbar-thumb`
(fallback: the `--gdy-input` token). `optionHoverColor` sets the hover background of the value
filter options through `--gdy-option-hover-bg` (fallback: a tint of `--gdy-muted`). Tokens and
themes are described in [theming.md](theming.md).

## Reference

Every type below is exported from `gridory`, `gridory/table` and `gridory/kanban`.

### DataViewProps

| Prop | Type | Default | Description |
|---|---|---|---|
| `searchPlaceholder` | `string` | `"Buscar..."` | Search box placeholder. Kanban default: `"Buscar cards..."`. |
| `createLabel` | `string` | `"Nuevo"` | Create button text. |
| `onCreate` | `() => void` | — | Create button handler; the button renders only when it is set. |
| `emptyMessage` | `ReactNode` | `"No se encontraron resultados"` | Shown when no row or card matches. See [Empty state](#empty-state). |
| `loading` | `boolean` | `false` | Shows the placeholders instead of the data. See [Loading state](#loading-state). |
| `loadingRowCount` | `number` | `5` | Placeholder rows of the table, or placeholder cards per kanban column. |
| `renderLoading` | `() => ReactNode` | — | Your own content in place of the placeholders. |
| `rowActions` | `RowActions<TData>` | — | Actions menu of each row or card. |
| `archivedView` | `ArchivedViewConfig` | — | Active/archived/all select. |
| `viewSwitch` | `ViewSwitchConfig` | — | Table/kanban switch. |
| `aiButton` | `AiButtonConfig` | — | AI assistant button. |
| `toggleGroups` | `ToggleGroupConfig[]` | — | Custom segmented controls. |
| `headerSelectors` | `HeaderSelectConfig[]` | — | Custom selects. |
| `toolbarLayout` | `ToolbarLayout` | — | Explicit toolbar composition. |
| `toolbarSlots` | `ToolbarCustomSlot[]` | — | Your own content in the toolbar ([Your own slots](#your-own-slots)). |
| `selectTheme` | `SelectTheme` | — | Styling of every select. |
| `thinScrollbars` | `boolean` | `true` | Thin scrollbars on internal scroll areas. |
| `scrollbarColor` | `string` | — | Scrollbar thumb color; falls back to `--gdy-input`. |
| `optionHoverColor` | `string` | — | Value filter option hover; falls back to a tint of `--gdy-muted`. |
| `dateFilterRequireOperator` | `boolean` | `true` | Date menus open with no operator selected. |
| `dateInputFormat` | `DateInputFormat` | `"dd/mm/yyyy"` | Mask of the date inputs. |
| `calendarMonthYearDropdown` | `boolean` | `true` | Month and year dropdowns in the calendar header. |
| `calendarFromYear` | `number` | current year minus 100 | First year of the year dropdown. |
| `calendarToYear` | `number` | current year plus 10 | Last year of the year dropdown. |
| `calendarLocale` | `Locale` (`date-fns`) | Spanish (`es`) | Language of the filter calendar. |

### ToolbarLayout

| Field | Type | Description |
|---|---|---|
| `left` | `string[]` | Slot ids of the left group, in order. |
| `right` | `string[]` | Slot ids of the right group, in order. |

### ToolbarCustomSlot

| Field | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | — | Unique slot id, also used in `toolbarLayout` and written as `data-slot-id`. |
| `content` | `ReactNode` | — | What the slot renders. |
| `position` | `"left" \| "right"` | `"right"` | Side without `toolbarLayout`; the slot goes at its end. |
| `className` | `string` | — | Extra class(es) for the `gdy-toolbar-slot` wrapper. |

`DuplicateToolbarSlotError` is exported as a value from the same entries.

### ToggleGroupConfig

| Field | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | — | Slot id, unique in the toolbar. |
| `options` | `ToggleOption[]` | — | Options, in order. |
| `value` | `string` | — | Selected option value. |
| `onChange` | `(value: string) => void` | — | Called with the picked value. |
| `display` | `ToggleDisplay` | `"both"` | `"label" \| "icon" \| "both"`. |
| `ariaLabel` | `string` | — | Accessible name of the group. |
| `position` | `ToolbarSide` | `"right"` | `"left" \| "right"`; ignored with `toolbarLayout`. |

### ToggleOption

| Field | Type | Description |
|---|---|---|
| `value` | `string` | Option value. |
| `label` | `string` | Text, accessible name and tooltip. |
| `icon` | `ReactNode` | Optional icon. |

### HeaderSelectConfig

| Field | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | — | Slot id, unique in the toolbar. |
| `label` | `string` | — | Option prefix and accessible name. |
| `options` | `SelectOption[]` | — | Options, in order. |
| `value` | `string` | — | Selected option value. |
| `onChange` | `(value: string) => void` | — | Called with the picked value. |
| `placeholder` | `string` | the `label` | Shown while `value` matches no option. |
| `position` | `ToolbarSide` | `"right"` | `"left" \| "right"`; ignored with `toolbarLayout`. |

### SelectOption

| Field | Type | Description |
|---|---|---|
| `value` | `string` | Option value. |
| `label` | `string` | Option text. |

### ArchivedViewConfig

| Field | Type | Default | Description |
|---|---|---|---|
| `value` | `ArchivedViewMode` | — | Controlled mode: `"all" \| "active" \| "archived"`. |
| `defaultValue` | `ArchivedViewMode` | `"active"` | Initial mode when uncontrolled. |
| `onChange` | `(mode: ArchivedViewMode) => void` | — | Called on user changes. |
| `label` | `string` | `"Mostrar"` | Prefix of every option. |
| `optionLabels` | `Partial<Record<ArchivedViewMode, string>>` | `{ active: "Activos", archived: "Archivados", all: "Todos" }` | Option texts. |

### ViewSwitchConfig

| Field | Type | Default | Description |
|---|---|---|---|
| `active` | `ViewMode` | — | Current view: `"table" \| "kanban"`. |
| `onChange` | `(view: ViewMode) => void` | — | Called with the picked view. |
| `tableLabel` | `string` | `"Tabla"` | Table button text. |
| `kanbanLabel` | `string` | `"Kanban"` | Kanban button text. |

### AiButtonConfig

| Field | Type | Default | Description |
|---|---|---|---|
| `onClick` | `() => void` | — | Click handler. |
| `label` | `string` | `"AI"` | Button text and accessible name. |

### RowActions

| Field | Type | Default | Description |
|---|---|---|---|
| `edit`, `archive`, `remove`, `history` | `boolean` | — | `false` hides the built-in even when its callback is set. |
| `onEdit`, `onRemove`, `onHistory` | `(row: TData) => void` | — | Enable the edit, remove and history actions. |
| `onArchive` | `(row: TData) => void` | — | Enables the archive action. |
| `onArchiveToggle` | `(row: TData) => void` | — | Enables the archive action; wins over `onArchive`. |
| `getIsArchived` | `(row: TData) => boolean` | — | Archived state: archive label and archived view. |
| `archiveLabel`, `unarchiveLabel`, `deleteLabel`, `editLabel`, `historyLabel` | `string` | Spanish | Built-in texts; defaults in [Row and card actions](#row-and-card-actions). |
| `customActions` | `RowActionEntry<TData>[]` | — | Extra actions (`RowAction`) and submenus (`RowActionSubmenu`) around the built-ins. |
| `menuActions` | `MenuItem<TData>[]` | — | Full menu composition; overrides `customActions`. |
| `triggerLabel` | `string` | `"Opciones"` | Accessible name and tooltip of the ⋯ button, in the table and the kanban. |
| `columnLabel` | `string` | — | Table only. Header text of the actions column. See [Alignment](table.md#alignment). |
| `align` | `"left" \| "center" \| "right"` | `"right"` | Table only. Alignment of the actions column header and button. |

### RowAction

| Field | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | — | Unique id, not a built-in id. |
| `label` | `string \| ((row: TData) => string)` | — | Item text, fixed or per row. |
| `icon` | `ReactNode \| ((row: TData) => ReactNode)` | — | Item icon, fixed or per row. |
| `onClick` | `(row: TData) => void` | — | Called with the row. |
| `placement` | `RowActionPlacement` | `"bottom"` | `"top" \| "bottom"`; used by `customActions` only. |
| `variant` | `RowActionVariant` | `"default"` | `"default" \| "destructive"`. |
| `disabled` | `(row: TData) => boolean` | — | Disables the item for that row. |
| `hidden` | `(row: TData) => boolean` | — | Drops the item for that row. |

### RowActionSubmenu

| Field | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | — | Unique id, not a built-in id. |
| `label` | `string \| ((row: TData) => string)` | — | Text of the submenu entry. |
| `icon` | `ReactNode \| ((row: TData) => ReactNode)` | — | Icon of the submenu entry. |
| `items` | `RowAction<TData>[] \| ((row: TData) => RowAction<TData>[])` | — | Actions of the submenu. |
| `placement` | `RowActionPlacement` | `"bottom"` | `"top" \| "bottom"`; used by `customActions` only. |
| `disabled` | `(row: TData) => boolean` | — | Disables the entry for that row. |
| `hidden` | `(row: TData) => boolean` | — | Drops the entry for that row. |

`RowActionEntry<TData>` is `RowAction<TData> | RowActionSubmenu<TData>`.

### MenuItem

| Variant | Shape | Renders |
|---|---|---|
| Custom action | `RowAction<TData> & { kind?: "action" }` | A menu item. |
| Submenu | `RowActionSubmenu<TData> & { kind?: "submenu" }` | An entry that opens its actions in a submenu. |
| `BuiltInMenuRef` | `{ kind: "builtin"; id: BuiltInActionId }` | The built-in, when available. `BuiltInActionId` is `"edit" \| "archive" \| "remove" \| "history"` (`BUILT_IN_ROW_ACTION_IDS`). |
| `MenuSeparator` | `{ kind: "separator"; id: string }` | A divider. |
| `MenuLabel` | `{ kind: "label"; id: string; label: string; className?: string }` | A heading. |

### SelectTheme

| Key | Type | Writes |
|---|---|---|
| `background` | `string` | `--gdy-select-bg` |
| `hoverBackground` | `string` | `--gdy-select-trigger-hover-bg` |
| `border` | `string` | `--gdy-select-border` |
| `text` | `string` | `--gdy-select-text` |
| `radius` | `string \| number` | `--gdy-select-radius` (numbers in pixels) |
| `contentBackground` | `string` | `--gdy-select-content-bg` |
| `optionText` | `string` | `--gdy-select-item-text` |
| `optionHoverBackground` | `string` | `--gdy-select-item-hover-bg` |
| `optionActiveBackground` | `string` | `--gdy-select-item-active-bg` |
| `triggerClassName` | `string` | Class on each select trigger. |
| `contentClassName` | `string` | Class on each dropdown. |
| `itemClassName` | `string` | Class on each option. |

### DateFilterState

| Field | Type | Description |
|---|---|---|
| `op` | `DateFilterOp \| ""` | Operator; `""` means none picked yet. |
| `date` | `string` | `YYYY-MM-DD` date of "greater than" and "less than". |
| `dateFrom` | `string` | `YYYY-MM-DD` start of "between". |
| `dateTo` | `string` | `YYYY-MM-DD` end of "between". |

### DateFilterOp

`"gt"` (after `date`), `"lt"` (before `date`) or `"bt"` (`dateFrom` to `dateTo`, both included).

### DateInputFormat

`"dd/mm/yyyy" | "dd-mm-yyyy" | "mm/dd/yyyy" | "mm-dd-yyyy"`: `dd` day, `mm` month, `yyyy` year.

### FilterOption

| Field | Type | Description |
|---|---|---|
| `value` | `string` | Value matched against the column values. |
| `label` | `string` | Text shown in the checklist. |
