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
(text or any node, see [Empty state](toolbar.md#empty-state)) instead of the columns. `"Sin valor"` and `"Sin cards"` are fixed texts.

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
changes. While drag and drop is on, every card carries `data-draggable`, which is what gives it the
`grab` cursor. While dragging, the card carries `data-dragging` and the column under the pointer
carries `data-drop-target`, or `data-drop-disabled` when [`canDrop`](#columns-a-card-cannot-go-to)
rejects it.

### Rejecting a move

`onCardMove` can say no. What it returns decides what the board does:

| `onCardMove` returns | The board |
|---|---|
| Nothing (`void`) or `true` | Keeps the move, as before. |
| `false` | Does not move the card at all. |
| A promise | Moves the card and waits. While waiting the card carries `data-pending` and `aria-busy="true"`, looks dimmed and cannot be dragged again. If the promise resolves to `false` or rejects, the card goes back to its column and its place; otherwise it stays. |

Search, filters, sorting and the active group are kept: nothing remounts. When a promise rejects,
`onCardMoveError(error, event)` receives the error after the card is back. Without
`onCardMoveError` the error is thrown again, as an unhandled rejection, so the console and your
error monitoring still see it; catching it in the app and returning `false` is the quiet way.

```tsx
<KanbanBoard
  {...boardProps}
  onCardMove={async ({ cardId, toValue, updatedCard }) => {
    const saved = await api.moveDeal(cardId, toValue);
    if (saved) setDeals((deals) => replaceDeal(deals, updatedCard));
    return saved;
  }}
  onCardMoveError={(error) => toast.error(String(error))}
/>
```

Before, the only way to undo a move was to force a new `data` reference or to remount the board with
a new `key`, which also lost the search and the filters:

```tsx
// Before: the remount throws away the search, the filters and the sort
<KanbanBoard key={revision} {...boardProps} onCardMove={(event) => save(event).catch(() => setRevision((r) => r + 1))} />
```

New `data` wins over a revert: if `data` changes while the promise is pending, the board shows the
new data and does not move the card back. The board compares the cards it gets from `data` (and
`normalizeRow`) by reference, so an inline `data={{ results: rows }}` or an inline `normalizeRow`
counts as new data on every render of the parent, and also resyncs the board on every render.
Memoize them (`useMemo`, `useCallback`) when the parent re-renders while a move is pending.

A promise that never settles leaves its card pending: the app owns the timeout. The rest of the
board keeps working.

### Columns a card cannot go to

`canDrop` is **optional**. Without it every column accepts every card and no column is ever marked
as not allowed, exactly as before. With it, the board asks before a card lands:

```ts
canDrop?: (context: KanbanDropContext<TData>) => boolean;
```

`KanbanDropContext<TData>` is `{ card, cardId, groupId, fromValue, toValue }`: the dragged card as the
board holds it, its id, the active group and the two column values. Return `false` to forbid that
column for that card. The board asks:

| When | What happens with `false` |
|---|---|
| The drag starts | Every column on screen that rejects the card gets `data-drop-disabled` right away, so the user sees where the card cannot go before getting there. The marks stay until the drag ends (drop or cancel). |
| The pointer is over a column (`dragover`) | The board does not call `preventDefault`: the browser shows its "not allowed" cursor, the column carries `data-drop-disabled` and never `data-drop-target`, and dropping there is impossible. |
| The card is dropped | It asks again, and moves nothing if the answer is `false`: `onCardMove` is not called. |
| The "Mover a…" menu opens, and a column is picked | The column is disabled in the menu ([Moving without dragging](#moving-without-dragging)); picking asks again, as a drop does. |

The card's own column is never asked: dropping there does nothing anyway, so it behaves as always.
The rejected style reads `--gdy-kanban-drop-disabled-outline` (a dashed outline, falling back to
`--gdy-destructive`) and `--gdy-kanban-drop-disabled-bg` (a tint of `--gdy-destructive`); set them, or
write your own `.gdy-kanban-column[data-drop-disabled]` rule, to change it.

```tsx
<KanbanBoard
  {...boardProps}
  // A deal cannot jump from "lead" straight to "won": it has to go through "proposal".
  canDrop={({ fromValue, toValue }) => !(fromValue === "lead" && toValue === "won")}
  onCardMove={async ({ cardId, toValue }) => (await api.moveDeal(cardId, toValue)).ok}
/>
```

`canDrop` is synchronous on purpose: it runs on every `dragover`, many times per second, so it should
only read what the app already has. A rule that needs the server goes in `onCardMove`, which can still
send the card back ([Rejecting a move](#rejecting-a-move)). Together: `canDrop` stops the moves the app
already knows are wrong, with no round trip and no flicker, and `onCardMove` handles the ones only the
server can decide.

### Moving without dragging

Dragging uses the browser's native drag and drop, which does not work on phones and tablets, nor with
the keyboard or a screen reader. `moveMenu` adds **"Mover a…"** as the first entry of each card's ⋯
menu: a submenu with every other column on screen. Picking one moves the card exactly like a drop: the
same `canDrop`, the same `onCardMove` event, the same pending state and the same revert.

```ts
moveMenu?: "auto" | "always" | "never"; // default "auto"
moveMenuMediaQuery?: string;            // default "(pointer: coarse)"
```

| `moveMenu` | "Mover a…" shows |
|---|---|
| `"auto"` (default) | While `moveMenuMediaQuery` matches. The default `(pointer: coarse)` is a touch screen, so on a desktop with a mouse the card looks exactly as before. The board listens to the query: rotating a tablet or resizing a window shows or hides it. |
| `"always"` | Always. Use it when keyboard and screen reader users on a desktop need it too: with a mouse plugged in, `"auto"` does not show it. |
| `"never"` | Never. |

It never shows while `features.dragAndDrop` is off: if the app turned moving off, the menu does not
bring it back. `features.rowActions = false` only removes the app's actions. When a card had no menu
(no `rowActions`, or `features.rowActions` off), the ⋯ button appears with "Mover a…" alone, also under
a custom `renderCard`. "Mover a…" takes no action id: an action of your own with `id: "move"` keeps
working, with `customActions` and with `menuActions` alike.

```tsx
// Also on narrow windows, where dragging across columns is awkward.
<KanbanBoard {...boardProps} moveMenuMediaQuery="(pointer: coarse), (max-width: 768px)" />
```

In the submenu:

- The card's own column is left out, and so is any column that is not on screen.
- A column `canDrop` rejects is disabled. When the app gives a reason with `getDropDisabledReason`, it
  is shown under the column name and linked with `aria-describedby`; that column stays reachable with
  the arrow keys, so a screen reader reads why, but it cannot be picked.
- The choice is checked again with `canDrop` when it is picked, as a drop is.
- While the card waits for an `onCardMove` promise, "Mover a…" is disabled, as dragging is.

```tsx
<KanbanBoard
  {...boardProps}
  canDrop={({ fromValue, toValue }) => !(fromValue === "lead" && toValue === "won")}
  getDropDisabledReason={({ toValue }) => (toValue === "won" ? "It has to go through Proposal first" : undefined)}
/>
```

`getDropDisabledReason` gets the same context as `canDrop` and is asked only for the columns `canDrop`
rejected, only when the menu opens: never while dragging.

After a move from the menu, a polite live region (`div.gdy-kanban-live`, visible to screen readers
only) announces `labels.cardMovedTo(column)`, "Card movida a Ganado", and the focus goes to the card's ⋯
button in its new column, so a keyboard user keeps their place. If `onCardMove` then says no (`false`
or a rejected promise), it announces `labels.cardMoveReverted(column)`, "La card volvió a Activa", and
the focus follows the card back. The live region exists only while "Mover a…" is offered.

### Visible cards

`onVisibleCardsChange` hands you the cards the user is looking at, so the app can show a total or
export the list without reading the DOM or repeating the search and the filters:

| Field | Content |
|---|---|
| `cards` | Every card that passes the search, the archived view and the filters, in sort order. |
| `byColumn` | Those cards per column value, with one key for every column on screen; a column the search or the filters left empty comes with `[]`. |

It fires on mount and whenever a search, a filter, the archived view, the group or a move changes
which cards are shown, and never twice for the same result: it compares the cards one by one with the
last report, so an inline `data` that holds the same card objects does not re-trigger it. It never
fires while `loading`; when the load ends it fires once if the cards changed.

```tsx
// Before: repeating the board's search and filters outside it
const visible = deals.filter((deal) => matches(deal, search) && passes(deal, filters));

// After
<KanbanBoard
  {...boardProps}
  onVisibleCardsChange={({ cards, byColumn }) => {
    setTotal(sumAmounts(cards));
    setWonCount(byColumn.won?.length ?? 0);
  }}
/>;
```

A number that belongs inside one column header is better rendered there, with the column header
slot ([`renderColumnHeaderExtra`](#column-header-content)), than sent through the app state and back.

### Column header content

`renderColumnHeaderExtra` puts your own content in every column header, between the title and the
count, inside `span.gdy-kanban-column-extra`. It receives a `KanbanColumnHeaderContext<TData>`:

| Field | Content |
|---|---|
| `value` | Raw column value (`""` for the column of the cards without value). |
| `label` | Title shown in the header. |
| `groupId` | Id of the active group, as in `onCardMove` and `onCardClick`. |
| `cards` | The cards the column shows: after the search, the archived view, the filters and the sort. Its length is the count. |
| `allCards` | Every card of the column the board holds, in data order, including the ones the search, the filters or the archived view hide. |

Returning `null`, `undefined` or a boolean renders no container, so a column can go without content.
The content stays next to the count and does not shrink; a long title gives way with its ellipsis.
One line of content does not make the header taller. It is not called while `loading`: the loading
columns have no count either, and the content shows up with it when the data arrives. Without the
prop the header is exactly as before.

```tsx
<KanbanBoard
  {...boardProps}
  renderColumnHeaderExtra={({ cards, allCards }) => `${formatMoney(sum(cards))} · ${formatMoney(sum(allCards))}`}
/>
```

Before, an app had to find the header by its title and mount a portal into it, which breaks when the
title or the language changes:

```tsx
// Before: a portal into a header found by its text
const head = [...document.querySelectorAll(".gdy-kanban-column-title")].find((node) => node.textContent === "Ganado");
return head ? createPortal(<Total />, head.parentElement as HTMLElement) : null;
```

### Collapsible columns and footer

With many columns the board scrolls sideways. `collapsibleColumns` adds a button before each column
title that collapses the column into a narrow strip: the button, the count and the title written top
to bottom, as tall as the row. A collapsed column hides its cards, its header content and its footer,
and **still takes dropped cards** (and figures in [Moving without dragging](#moving-without-dragging)).

```ts
collapsibleColumns?: boolean;                        // default false
collapsedColumns?: string[];                         // controlled, by column value
defaultCollapsedColumns?: string[];                  // uncontrolled start
onCollapsedColumnsChange?: (values: string[]) => void;
```

- The button carries `aria-expanded` and its accessible name is `labels.collapseColumn(column)`,
  "Colapsar Activa", or `labels.expandColumn(column)`, "Expandir Activa". The collapsed column carries
  `data-collapsed`.
- Without `collapsedColumns` the board keeps the state (`defaultCollapsedColumns` sets the start) and
  reports every change; with it, the app owns the list and the button only asks for the change.
- The values are column values, whatever the active group: a value no column has, as when another
  group is active, changes nothing, and the column collapses again when its group comes back.
- While `loading`, a collapsed column stays a strip with no placeholder cards.
- The strip is `--gdy-kanban-column-collapsed-width` wide (44px by default).

```tsx
const [collapsed, setCollapsed] = useState<string[]>(["archived"]);

<KanbanBoard
  {...boardProps}
  collapsibleColumns
  collapsedColumns={collapsed}
  onCollapsedColumnsChange={(values) => {
    setCollapsed(values);
    savePreference("board-collapsed", values);
  }}
/>;
```

`renderColumnFooter` adds your own content at the bottom of each column, in
`div.gdy-kanban-column-footer`, under the cards and outside their scroll, so it stays in view. It gets
the same `{ value, label, groupId, cards, allCards }` as [`renderColumnHeaderExtra`](#column-header-content)
(`KanbanColumnFooterContext<TData>`). Returning `null`, `undefined` or a boolean renders no
container. It is not called while `loading`, so a footer never shows numbers of old data, nor for a
collapsed column.

The board does not page: a "Load more" per column is the app's, which passes the cards it has loaded
and adds more when asked.

```tsx
const PAGE = 10;
const [shown, setShown] = useState<Record<string, number>>({});
const visibleDeals = useMemo(() => limitPerStage(deals, shown, PAGE), [deals, shown]);

<KanbanBoard
  {...boardProps}
  data={visibleDeals}
  renderColumnFooter={({ value, cards }) =>
    cards.length < countByStage[value] ? (
      <button type="button" onClick={() => setShown((s) => ({ ...s, [value]: (s[value] ?? PAGE) + PAGE }))}>
        Load more ({cards.length} of {countByStage[value]})
      </button>
    ) : null
  }
/>;
```

### Card click

`onCardClick` receives a `KanbanCardClickEvent<TData>`: `{ card, cardId, groupId, value }`, where
`value` is the grouping value of the column that shows the card. It does not fire for the click that
ends a drag, nor when the user opens the card menu or picks one of its actions. Inside `renderCard`,
call `event.stopPropagation()` on your own buttons and inputs to keep them from triggering it.

### Search

The toolbar search box (`searchPlaceholder`, default `"Buscar cards..."`) keeps the cards where any
searchable field contains the query, ignoring case and accents (`peru` finds `Perú`), over the values
returned by `accessor`. The
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

### Texts and language

Every text of the board can be replaced with `labels`, and `calendarLocale` sets the language of the
filter calendar. The defaults are Spanish (a product decision); pass only the keys you want to
replace, the rest keep their default. Texts with values are functions.

```tsx
import { enUS } from "date-fns/locale";

const formatDate = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

<KanbanBoard
  {...boardProps}
  labels={{
    searchPlaceholder: "Search deals...",
    emptyColumn: "No deals",
    emptyValue: "No stage",
    formatCardDate: (value) => formatDate.format(new Date(`${value.slice(0, 10)}T00:00`)),
  }}
  calendarLocale={enUS}
/>;
```

- **Priority.** The older single-text props (`searchPlaceholder`, `createLabel`, `emptyMessage`,
  `groupSelectorLabel`, the `*Label` of `rowActions`, `archivedView.label` and `optionLabels`,
  `viewSwitch.tableLabel` and `kanbanLabel`, `aiButton.label`) still work and win over their key.
- **Memoize it.** Keep `labels` in a constant or a `useMemo`.
- **Contents are yours.** Field headers, group labels and card values are your texts.
- **`calendarLocale`** works as in the table ([table.md](table.md#texts-and-language)); a locale from
  `react-day-picker/locale` also translates the calendar's accessible names.

Keys shared with the table (`DataViewLabels`):

| Key | Default | Text | Single-text prop that wins |
|---|---|---|---|
| `searchPlaceholder` | `"Buscar..."` (kanban: `"Buscar cards..."`) | Search box placeholder | `searchPlaceholder` |
| `createButton` | `"Nuevo"` | Create button | `createLabel` |
| `emptyMessage` | `"No se encontraron resultados"` | No row or card matches | `emptyMessage` |
| `groupSelector` | `"Agrupar por"` | Group selector prefix and accessible name | `groupSelectorLabel` |
| `clearFilters` | `"Limpiar filtros"` | Button that clears every filter | — |
| `archivedView` | `"Mostrar"` | Archived view selector prefix and accessible name | `archivedView.label` |
| `archivedActive` | `"Activos"` | Archived view option: active | `archivedView.optionLabels.active` |
| `archivedArchived` | `"Archivados"` | Archived view option: archived | `archivedView.optionLabels.archived` |
| `archivedAll` | `"Todos"` | Archived view option: all | `archivedView.optionLabels.all` |
| `viewSwitchTable` | `"Tabla"` | View switch: table | `viewSwitch.tableLabel` |
| `viewSwitchKanban` | `"Kanban"` | View switch: kanban | `viewSwitch.kanbanLabel` |
| `aiButton` | `"AI"` | AI button | `aiButton.label` |
| `rowActionsTrigger` | `"Opciones"` | Tooltip and accessible name of the ⋯ button | `rowActions.triggerLabel` |
| `editAction` | `"Editar"` | Built-in edit action | `rowActions.editLabel` |
| `archiveAction` | `"Archivar"` | Built-in archive action | `rowActions.archiveLabel` |
| `unarchiveAction` | `"Desarchivar"` | Built-in unarchive action | `rowActions.unarchiveLabel` |
| `deleteAction` | `"Eliminar"` | Built-in delete action | `rowActions.deleteLabel` |
| `historyAction` | `"Ver historial"` | Built-in history action | `rowActions.historyLabel` |
| `sortTitle` | `"Ordenar"` | Sort section of the filter menus | — |
| `sortAscending` | `"Ascendente (A → Z)"` | Ascending sort of a value column | — |
| `sortDescending` | `"Descendente (Z → A)"` | Descending sort of a value column | — |
| `filterTitle` | `"Filtrar"` | Filter section of the value menu | — |
| `selectAll(count)` | `"Seleccionar todo (n)"` | Selects every listed option; `count` is how many are listed | — |
| `clearSelection` | `"Limpiar"` | Clears the value menu selection | — |
| `filterSearchPlaceholder` | `"Buscar..."` | Search box of the value menu | — |
| `valuesTitle` | `"Valores"` | Values section of the value menu | — |
| `noResults` | `"Sin resultados"` | Value menu with no option for the search | — |
| `dateSortAscending` | `"Ascendente (antigua → reciente)"` | Ascending sort of a date column | — |
| `dateSortDescending` | `"Descendente (reciente → antigua)"` | Descending sort of a date column | — |
| `operatorTitle` | `"Operador"` | Operator section of the date menu | — |
| `operatorAfter` | `"Mayor que (fecha posterior)"` | "After" operator | — |
| `operatorBefore` | `"Menor que (fecha anterior)"` | "Before" operator | — |
| `operatorBetween` | `"Entre (rango)"` | "Between" operator | — |
| `datesTitle` | `"Fechas"` | Dates section of the date menu | — |
| `dateClear` | `"Limpiar"` | Clears the date filter | — |
| `dateApply` | `"Aplicar"` | Applies the date filter | — |
| `pickDate` | `"Seleccionar fecha"` | Accessible name of the calendar button (one date) | — |
| `pickRange` | `"Seleccionar rango"` | Accessible name of the calendar button (range) | — |
| `labeledValue(label, value)` | `` `${label}: ${value}` `` | Joins a prefix and its value: "Agrupar por: Ninguno", "Mostrar: Activos", the header selectors and the kanban card tag | — |

Kanban keys (`KanbanBoardLabels`):

| Key | Default | Text | Single-text prop that wins |
|---|---|---|---|
| `emptyColumn` | `"Sin cards"` | Box of a column without cards | — |
| `emptyValue` | `"Sin valor"` | Column and card tag of the cards with an empty value | — |
| `untitledCard` | `"Card"` | Title of a default card whose first field is empty | — |
| `cardFieldLabel(header)` | `` `${header}:` `` | Bold label before each field of a default card | — |
| `formatCardDate(value)` | `"01/03/2026"` | Date field of a default card; gets the raw value (`"2026-03-01"`) and returns any value without a `yyyy-mm-dd` start as it is | — |
| `moveTo` | `"Mover a…"` | Card menu entry that opens the columns to move the card to | — |
| `cardMovedTo(column)` | `` `Card movida a ${column}` `` | Announced to screen readers after a move from the menu | — |
| `cardMoveReverted(column)` | `` `La card volvió a ${column}` `` | Announced when that move is undone | — |
| `collapseColumn(column)` | `` `Colapsar ${column}` `` | Accessible name and tooltip of the button that collapses a column | — |
| `expandColumn(column)` | `` `Expandir ${column}` `` | Accessible name and tooltip of the button that expands a collapsed column | — |

## Events

| Callback | Signature | Fires |
|---|---|---|
| `onCardMove` | `(event: KanbanMoveEvent<TData>) => void \| boolean \| Promise<void \| boolean>` | A card is dropped on a column other than its own, or moved there with "Mover a…". See [Rejecting a move](#rejecting-a-move). |
| `onCardMoveError` | `(error: unknown, event: KanbanMoveEvent<TData>) => void` | The promise `onCardMove` returned rejected; the card is already back. |
| `onCardClick` | `(event: KanbanCardClickEvent<TData>) => void` | A card is clicked (not at the end of a drag, not from its menu). |
| `onVisibleCardsChange` | `(state: KanbanVisibleCardsState<TData>) => void` | On mount, and whenever the visible cards change. See [Visible cards](#visible-cards). |
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

### One action per state, and submenus

An action's `label` and `icon` can depend on the card, and an entry with `items` opens a submenu
(`RowActionSubmenu`), in `customActions` and in `menuActions`. The pair of actions with opposite
`hidden` becomes one action:

```tsx
// Before: two actions, one of them hidden on each card
customActions: [
  { id: "favorite", label: "Mark favorite", icon: <Star />, onClick: toggle, hidden: (deal) => deal.favorite },
  { id: "unfavorite", label: "Remove favorite", icon: <StarOff />, onClick: toggle, hidden: (deal) => !deal.favorite },
]

// After: one action, and the statuses grouped in a submenu
customActions: [
  {
    id: "favorite",
    label: (deal) => (deal.favorite ? "Remove favorite" : "Mark favorite"),
    icon: (deal) => (deal.favorite ? <StarOff /> : <Star />),
    onClick: toggle,
  },
  { id: "status", label: "Change status", items: STATUSES.map((status) => moveTo(status)) },
]
```

Details, keyboard and id rules: [Text and icon per row, and submenus](toolbar.md#text-and-icon-per-row-and-submenus).

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
| `gdy-kanban-column` | Column (`section`), with its header `gdy-kanban-column-head`. | `data-column-value` with the column's raw value, always; `data-drop-target` while a card is dragged over it; `data-drop-disabled` while `canDrop` rejects the dragged card for it; `data-collapsed` while it is collapsed. |
| `gdy-kanban-column-title` | Column label. | — |
| `gdy-kanban-column-extra` | Own content of `renderColumnHeaderExtra`, between the title and the count; only rendered when there is content. | — |
| `gdy-kanban-column-toggle` | Button that collapses and expands the column, before the title; only with `collapsibleColumns`. | `aria-expanded`. |
| `gdy-kanban-column-count` | Card count badge. | — |
| `gdy-kanban-column-footer` | Own content of `renderColumnFooter`, under the cards; only rendered when there is content. | — |
| `gdy-kanban-column-body` | Scrolling list of cards; `gdy-kanban-empty-col` is its `"Sin cards"` placeholder. | — |
| `gdy-kanban-card` | Card (`article`). | `data-draggable` while it can be dragged; `data-dragging` while it is dragged; `data-pending` (with `aria-busy`) while its move waits for `onCardMove`. |
| `gdy-kanban-card-title` | Title of the default card; `gdy-kanban-card-subtitle` is its subtitle. | — |
| `gdy-kanban-tag` | Group tag of the default card. | — |
| `gdy-kanban-card-value` | `Header: value` and date lines of the default card. | — |
| `gdy-kanban-card-actions` | Menu slot under a custom `renderCard`. | — |
| `gdy-kanban-live` | Live region of the "Mover a…" menu, visible to screen readers only; rendered only while the menu is offered. | — |
| `gdy-menu-item-description` | Second line of a menu item, under its label: the reason a "Mover a…" column is disabled. | — |

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
| `--gdy-kanban-card-pending-opacity` | `0.6` | Opacity of a card whose move is pending. |
| `--gdy-kanban-drop-disabled-outline` | `--gdy-destructive` | Dashed outline of a column `canDrop` rejects. |
| `--gdy-kanban-drop-disabled-bg` | A tint of `--gdy-destructive` | Background of a column `canDrop` rejects. |
| `--gdy-kanban-column-collapsed-width` | `44px` | Width of a collapsed column. |

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

### Class names per part

`className` adds classes to the root and `classNames` adds one class per part, always after the
`gdy-*` hook of that part:

| `classNames` key | Element | Hook it joins |
|---|---|---|
| `root` | Root `div` (same as `className`, which goes first) | `gdy-kanban` |
| `toolbar` | Toolbar | `gdy-toolbar` |
| `filterRow` | Row of filter triggers (only when some field is filterable) | `gdy-kanban-filter-row` |
| `board` | Board viewport, the columns scroll container | `gdy-kanban-board-wrap` |
| `column` | Every column | `gdy-kanban-column` |
| `columnHead` | Header of every column | `gdy-kanban-column-head` |
| `columnBody` | Card list of every column | `gdy-kanban-column-body` |
| `card` | Every card, default or custom (`renderCard`) | `gdy-kanban-card` |
| `empty` | Message of an empty board (`emptyMessage`) | `gdy-empty` |

The `"Sin cards"` placeholder of an empty column has no key. `boardMinHeightClassName` and
`boardWrapClassName` keep working: `classNames.board` goes after them.

```tsx
<KanbanBoard
  {...boardProps}
  classNames={{ columnHead: "uppercase", card: "shadow-md", empty: "italic" }}
/>
```

A consumer class weighs the same as the `gdy-*` rule of its part, so for a property the stylesheet
already sets, such as the column background, the stylesheet loaded last wins. Load yours after
`gridory/styles.css`, or set the token of that part from the class
(`[--gdy-kanban-column-bg:theme(colors.sky.50)]` in Tailwind).

### One column apart from the rest

Every column carries `data-column-value` with its raw value (`""` for the column of the cards
without value), also while `loading` shows the columns it already knows. The placeholder columns
shown before the first data carry nothing. Two props reach a single column:

- `getColumnClassName(value)` returns a class for that column, added after `gdy-kanban-column` and
  `classNames.column`.
- `getColumnAttributes(value)` returns `data-*` and `aria-*` attributes (`KanbanColumnAttributes`).
  Any other name is dropped, `false` and `undefined` drop a `data-*` hook (an `aria-*` keeps `false`),
  and so are the names the board writes or will write: `data-drop-target`, `data-column-value`,
  `data-drop-disabled` and `data-collapsed`.

To paint one column, set its token from its value; no rule of the board changes:

```css
.gdy-kanban-column[data-column-value="won"] {
  --gdy-kanban-column-bg: #ecfdf5;
}
```

Before, the only way was the column's position, which breaks as soon as the order of the columns or
the active group changes:

```css
/* Before: depends on "won" being the fourth column */
.gdy-kanban-column:nth-child(4) {
  background: #ecfdf5;
}
```

## Props reference

Own props of `KanbanBoardProps<TData>`, in source order.

| Prop | Type | Default | Description |
|---|---|---|---|
| `labels` | `Partial<KanbanBoardLabels>` | Spanish texts | Replaces any text. See [Texts and language](#texts-and-language). |
| `fields` | `ColumnDefinition<TData>[]` | — | Fields used to search, filter, sort and render the cards (required). |
| `data` | `DataInput<TData>` | — | Cards: an array or an API envelope (required). |
| `groups` | `KanbanGroupOption<TData>[]` | — | Available groupings; must not be empty (required). |
| `defaultGroupId` | `string` | — | Initial group; must exist in `groups` (required). |
| `normalizeRow` | `(row: unknown, index: number) => TData` | — | Maps each record of an envelope to `TData`. |
| `getCardId` | `(card: TData, index: number) => string` | — | Unique, stable card id (required). |
| `features` | `KanbanBoardFeatures` | all `true` | Capability flags. |
| `renderCard` | `(card: TData, context: KanbanCardRenderContext<TData>) => ReactNode` | — | Custom card content. |
| `onCardMove` | `(event: KanbanMoveEvent<TData>) => void \| boolean \| Promise<void \| boolean>` | — | Card dropped on another column, or moved with "Mover a…"; `false` or a promise can send it back. |
| `onCardMoveError` | `(error: unknown, event: KanbanMoveEvent<TData>) => void` | — | Error of a rejected `onCardMove` promise. Without it the error is thrown again. |
| `canDrop` | `(context: KanbanDropContext<TData>) => boolean` | — | Optional rule of where a card may go. See [Columns a card cannot go to](#columns-a-card-cannot-go-to). |
| `getDropDisabledReason` | `(context: KanbanDropContext<TData>) => string \| undefined` | — | Why `canDrop` rejected a column, shown in the "Mover a…" menu. See [Moving without dragging](#moving-without-dragging). |
| `moveMenu` | `KanbanMoveMenuMode` | `"auto"` | When the card menu offers "Mover a…". |
| `moveMenuMediaQuery` | `string` | `"(pointer: coarse)"` | Media query of `moveMenu="auto"`. |
| `onCardClick` | `(event: KanbanCardClickEvent<TData>) => void` | — | Card clicked. |
| `onVisibleCardsChange` | `(state: KanbanVisibleCardsState<TData>) => void` | — | Visible cards on mount and after each change. |
| `onGroupChange` | `(groupId: string) => void` | — | Group selector change. |
| `renderColumnHeaderExtra` | `(context: KanbanColumnHeaderContext<TData>) => ReactNode` | — | Own content in each column header. See [Column header content](#column-header-content). |
| `renderColumnFooter` | `(context: KanbanColumnFooterContext<TData>) => ReactNode` | — | Own content at the bottom of each column. See [Collapsible columns and footer](#collapsible-columns-and-footer). |
| `collapsibleColumns` | `boolean` | `false` | Adds the button that collapses a column. |
| `collapsedColumns` | `string[]` | — | Collapsed columns, by value (controlled). |
| `defaultCollapsedColumns` | `string[]` | — | Columns collapsed at first (uncontrolled). |
| `onCollapsedColumnsChange` | `(values: string[]) => void` | — | The collapsed columns changed. |
| `groupSelectorLabel` | `string` | `"Agrupar por"` | Prefix of every group option and accessible name of the selector. |
| `boardWrapClassName` | `string` | — | Extra classes for the board viewport. |
| `className` | `string` | — | Extra classes for the root, after `gdy-kanban` and its flags. |
| `classNames` | `KanbanBoardClassNames` | — | One class per part. See [Class names per part](#class-names-per-part). |
| `getColumnClassName` | `(value: string) => string \| undefined` | — | Extra class for one column. See [One column apart from the rest](#one-column-apart-from-the-rest). |
| `getColumnAttributes` | `(value: string) => KanbanColumnAttributes` | — | Extra `data-*` and `aria-*` attributes for one column. |
| `boardMinHeightClassName` | `string` | `"gdy-kanban-min-h-md"` | Minimum height class of the board viewport. |
| `columnBodyMaxHeight` | `number` | `480` | Maximum height in pixels of each column body before it scrolls. |

`KanbanBoardProps` also accepts every `DataViewProps` prop (`searchPlaceholder`, `createLabel`,
`onCreate`, `emptyMessage`, `loading`, `loadingRowCount`, `renderLoading`, `rowActions`, `archivedView`,
`viewSwitch`, `aiButton`, `toggleGroups`,
`headerSelectors`, `toolbarLayout`, `selectTheme`, `thinScrollbars`, `scrollbarColor`,
`optionHoverColor`, `dateFilterRequireOperator`, `dateInputFormat`, `calendarMonthYearDropdown`,
`calendarFromYear`, `calendarToYear`, `calendarLocale`), documented in [toolbar.md](toolbar.md). On the board
`searchPlaceholder` defaults to `"Buscar cards..."`, `createLabel` to `"Nuevo"` and `emptyMessage` to
`"No se encontraron resultados"`.

### Types

- `KanbanBoardLabels`: every text of the board, the shape of `labels` ([Texts and language](#texts-and-language)).
  It extends `DataViewLabels`, the texts the board shares with the table.
- `KanbanGroupOption<TData>`: one grouping, `{ id, label, accessor, setValue, values? }`.
- `KanbanBoardFeatures`: the optional boolean flags of `features` (`search`, `sorting`, `filtering`,
  `createButton`, `rowActions`, `groupSelector`, `dragAndDrop`).
- `KanbanMoveEvent<TData>`: `{ card, updatedCard, cardId, groupId, fromValue, toValue }`, the payload
  of `onCardMove`.
- `KanbanDropContext<TData>`: `{ card, cardId, groupId, fromValue, toValue }`, the argument of `canDrop`
  and `getDropDisabledReason`.
- `KanbanMoveMenuMode`: `"auto" | "always" | "never"`, the type of `moveMenu`.
- `KanbanCardClickEvent<TData>`: `{ card, cardId, groupId, value }`, the payload of `onCardClick`.
- `KanbanVisibleCardsState<TData>`: `{ cards, byColumn }`, the payload of `onVisibleCardsChange`.
- `KanbanColumnHeaderContext<TData>`: `{ value, label, groupId, cards, allCards }`, the argument of
  `renderColumnHeaderExtra`.
- `KanbanColumnFooterContext<TData>`: the same as `KanbanColumnHeaderContext<TData>`, the argument of
  `renderColumnFooter`.
- `KanbanCardRenderContext<TData>`: `{ card, groupId, groupValue }`, the second argument of
  `renderCard`.
- `KanbanSortingState`: `{ id: string; direction: SortDirection }`, the active sort of a field.
- `KanbanFiltersState`: `Record<string, string[]>`, the selected values per field id.
- `KanbanDateFiltersState`: `Record<string, DateFilterState>`, the date filter per field id.
- `KanbanBoardClassNames`: the optional classes per part of `classNames`.
- `KanbanColumnAttributes`: the `data-*` and `aria-*` attributes `getColumnAttributes` returns.
