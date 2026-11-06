# Migrating to 2.0

2.0.0 only breaks what this guide lists. Everything else (markup, classes, styles and events) is the same
as in 1.5.0. Each section says who is affected, what to change, and how to check that nothing was missed.

## Tailwind preset

**Who is affected:** apps that use the default export of `gridory/tailwind-preset` and write its unprefixed
utilities in their own markup (`bg-primary`, `text-muted-foreground`, `rounded-lg`…). Apps that do not use
Tailwind, that use `createGridoryPreset()`, or that do not use a preset (shadcn projects) need no change.

The default export is now `createGridoryPreset()`: the same colors and radii, under the `gdy` prefix.

```js
// tailwind.config.js — the config itself does not change
import gridoryPreset from "gridory/tailwind-preset";

export default { presets: [gridoryPreset] };
```

```tsx
// 1.x
<span className="rounded-md bg-muted/40 text-muted-foreground hover:bg-muted">Pending</span>
// 2.0
<span className="rounded-gdy-md bg-gdy-muted/40 text-gdy-muted-foreground hover:bg-gdy-muted">Pending</span>
```

**Tailwind does not warn** about a class it no longer generates: it just stops painting it. Replace every
utility of the old preset, keeping variants (`hover:`, `dark:`) and opacity modifiers (`/40`):

| 1.x | 2.0 |
|---|---|
| `<utility>-<color>`, for `background`, `foreground`, `card`, `popover`, `primary`, `secondary`, `muted`, `accent`, `destructive` (and their `-foreground`), `border`, `input` and `ring` | `<utility>-gdy-<color>`: `bg-gdy-card`, `text-gdy-primary-foreground`, `border-gdy-border`, `outline-gdy-ring` |
| `rounded-lg`, `rounded-md`, `rounded-sm` (and `rounded-t-lg`…) | `rounded-gdy-lg`, `rounded-gdy-md`, `rounded-gdy-sm` (and `rounded-t-gdy-lg`…) |

`rounded-lg`, `rounded-md` and `rounded-sm` still exist without the preset, with Tailwind's own sizes, so
leaving them changes the corners by a few pixels instead of breaking. Replace them too to keep the library's
radius (`--gdy-radius`).

To find what is left, search your sources (add the folders your Tailwind `content` scans):

```bash
grep -rnE "(bg|text|border|ring|outline|fill|stroke|divide|from|via|to)-(background|foreground|card|popover|primary|secondary|muted|accent|destructive|border|input|ring)\b|rounded(-[a-z]{1,2})?-(lg|md|sm)\b" src
```

**shadcn projects:** if your config already defines `primary`, `muted` and the rest, those utilities are
yours, not the preset's; remove the preset, as the [theming guide](theming.md#tailwind-preset) recommends,
and nothing changes.

## Tables on narrow screens

**Who is affected:** tables with columns without `width` or with `rowActions`, without `responsiveColumns`.
Nothing in your code has to change; what changes is how the table looks:

- **The actions column keeps 56px** (96px with `rowActions.columnLabel`) instead of sharing the room left with
  the columns without `width`. On a wide screen it gets narrower and those columns get wider.
- **A column without `width` never gets narrower than its `minWidth`** (`120` by default). On a phone, where
  1.x squeezed those columns to about 25px and their content disappeared, the rows now scroll sideways inside
  the table, and the page does not.

```tsx
// 1.x, iPhone: Country, Status, Revenue and Created at were 25px wide each
// 2.0, iPhone: 120px each, and the rows scroll sideways
const columns = [
  { id: "name", header: "Company", accessor: (row) => row.name, width: 220 },
  { id: "country", header: "Country", accessor: (row) => row.country },
  { id: "notes", header: "Notes", accessor: (row) => row.notes, minWidth: 200 }, // a floor of your own
];
```

Printed without `printMode`, the actions column keeps its 56px on paper too.

To hide columns on a phone instead of scrolling, use `responsiveColumns` with `priority` (it already existed
and does not change). To keep the 1.x layout, add these two rules after the library's stylesheet:

```css
.gdy-table-grid { min-width: 0; }
.gdy-table-head-cell[data-column-id="_actions"] { width: auto; }
```

If your tests compare the table markup, the `table` element now carries its minimum width:
`<table class="gdy-table-grid" style="--gdy-table-min-width: 476px;">`.

## Calendar

**Who is affected:** apps that pass a locale from `react-day-picker/locale` to `calendarLocale`, apps that import
`date-fns` or `react-day-picker` without having them in their own `package.json`, and tests that look for the
calendar's English accessible names ("Go to the Previous Month"). Apps that pass nothing, or a `date-fns`
locale, need no change.

The date filter calendar is now Gridory's own, written with the browser's `Intl.DateTimeFormat` instead of
`react-day-picker` and `date-fns`. It looks the same to the pixel, keeps every `gdy-calendar-*` class and state
attribute, and keeps the keyboard: arrows, Home/End, PageUp/PageDown, and Shift for a whole year.

**No language is lost.** `Intl` knows every language the browser knows, so any BCP 47 tag works without
installing anything. A `date-fns` locale still compiles and works too: the calendar reads its `code` and its
`weekStartsOn`. What changes is this:

- **The language is a tag.** `calendarLocale` is now `string | { code?: string; options?: { weekStartsOn?:
  number } }`. Prefer `"en-US"`; an `enUS` from `date-fns/locale` keeps working.
- **`date-fns` no longer comes installed with Gridory**, and neither do `react-day-picker` and `@date-fns/tz`. If
  your app imports any of them, add it to your own `package.json` (`npm install date-fns`), or switch to the tag.
- **The accessible names are `labels`, in Spanish by default.** A locale from `react-day-picker/locale` no longer
  translates them. Without `labels`, a screen reader now hears "Mes anterior" instead of "Go to the Previous
  Month", in line with the rest of the Spanish interface.

```tsx
// 1.x
import { enUS } from "react-day-picker/locale"; // came installed with gridory
<DataTable calendarLocale={enUS} … />;           // also translated "Go to the Previous Month"

// 2.0
<DataTable
  calendarLocale="en-US"
  labels={{
    calendarNavigation: "Calendar navigation",
    calendarPreviousMonth: "Previous month",
    calendarNextMonth: "Next month",
    calendarChooseMonth: "Choose the month",
    calendarChooseYear: "Choose the year",
    calendarToday: "Today",
  }}
  …
/>;
```

The same props and keys work on `KanbanBoard` and `CardGrid`.

**If you type a full labels object** (`const labels: DataTableLabels = { … }`, or `DataViewLabels`,
`KanbanBoardLabels`, `CardGridLabels`), add these keys: `calendarNavigation`, `calendarPreviousMonth`,
`calendarNextMonth`, `calendarChooseMonth`, `calendarChooseYear` and `calendarToday`. TypeScript reports the ones
missing. A partial object passed to `labels` needs nothing: the keys you leave out keep their Spanish default.

**Smaller differences:**

- A day's accessible name no longer ends in ", selected": the cell's `aria-selected` already says it.
- The first day of the week comes from the browser (`Intl.Locale#getWeekInfo`). Firefox does not have it, and
  there a tag starts the week on Monday; a `date-fns` locale or `{ code: "en-US", options: { weekStartsOn: 0 } }`
  sets it everywhere.

To find what is left, search your sources and check what your app installs on its own:

```bash
grep -rnE "from \"(react-day-picker|date-fns|@date-fns/tz)" src
grep -rnE "Go to the (Previous|Next) Month|Choose the (Month|Year)" src
npm ls date-fns react-day-picker
```

## Selects

**Who is affected:** apps that pass the option keys of `selectTheme`, style the open list of a select from
their CSS, or test the selects of the table, the kanban, the card grid or `SignUpForm` by opening the list.
The closed box looks the same as in 1.5.0: same size, colors, icon and placeholder, and `valueHighlights`
still paints the whole box of an inline edit select.

Every select of the library (archived view, group selector, header selectors, page size, inline edit and the
`select` field of `SignUpForm`) is now the browser's own `<select>`. Gridory styles the closed box; the open
list is the system one: a native menu on a desktop, a sheet or a wheel on a phone. It takes its colors from
the box and follows the dark theme through `color-scheme`.

```html
<!-- 1.x -->
<button type="button" role="combobox" class="gdy-select-trigger" aria-label="Group by">
  <span data-slot="select-value">Group by: Status</span><svg class="gdy-select-icon"></svg>
</button>
<!-- 2.0 -->
<span class="gdy-select">
  <select class="gdy-select-trigger" aria-label="Group by">
    <option value="__gdy_group_none__">Group by: None</option>
    <option value="status">Group by: Status</option>
  </select>
  <svg class="gdy-select-icon" aria-hidden="true"></svg>
</span>
```

**Removed from `SelectTheme`**, because the list they styled no longer exists: `contentBackground`,
`optionText`, `optionHoverBackground`, `optionActiveBackground`, `contentClassName` and `itemClassName`.
TypeScript flags them; delete them. `background`, `hoverBackground`, `border`, `text`, `radius` and
`triggerClassName` work as before.

**Removed from the stylesheet:** the classes `gdy-select-content`, `gdy-select-viewport`, `gdy-select-item`
(and its `-indicator`, `-check` and `-text`), `gdy-select-scroll-button`, `gdy-select-scroll-icon` and
`gdy-select-value`, and the tokens `--gdy-select-content-bg`, `--gdy-select-content-text`,
`--gdy-select-item-text`, `--gdy-select-item-hover-bg`, `--gdy-select-item-hover-text` and
`--gdy-select-item-active-bg`. A rule on them now matches nothing. `.gdy-select-trigger[data-state="open"]`
matches nothing either: a native select has no open state.

**Tests:** pick an option with `user.selectOptions` instead of opening the list and clicking the option, and
read the chosen option with `toHaveDisplayValue`. The options are always in the DOM, inside the select.

```tsx
const groupBy = screen.getByRole("combobox", { name: "Group by" });
// 1.x
await user.click(groupBy);
await user.click(await screen.findByRole("option", { name: "Group by: Status" }));
expect(groupBy).toHaveTextContent("Group by: Status");
// 2.0
await user.selectOptions(groupBy, "Group by: Status");
expect(groupBy).toHaveDisplayValue("Group by: Status");
```

`toHaveTextContent` on a select still passes, but against the text of every option, so it no longer proves
which one is chosen. If your tests compare the markup, each select now looks like the 2.0 example above, and
the Radix ids of the other menus shift because the selects no longer take one.

To find what is left, search your sources:

```bash
grep -rnE "contentBackground|optionText|optionHoverBackground|optionActiveBackground|contentClassName|itemClassName|gdy-select-(content|viewport|item|scroll|value)|--gdy-select-(content|item)" src
```
