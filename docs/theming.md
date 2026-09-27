# Theming and styling

[English](theming.md) · [Español](theming.es.md)

This page explains how the Gridory stylesheet is built and how to change its look from your app.
The generated catalog [style-hooks.md](style-hooks.md) lists every class, state selector and token.

## The stylesheet

Import the compiled stylesheet once, at the entry of your app and before your own CSS. The
JavaScript entry points do not import it for you, and the one file covers every module.

```ts
import "gridory/styles.css";
import "./app.css";
```

The order matters because almost every library rule is a single class. A rule in your CSS with the
same selector, loaded later, wins without `!important`.

The file contains, in this order:

1. **Tokens**: the base `--gdy-*` custom properties for the light and dark themes.
2. **Reset**: a small preflight that applies only inside Gridory (described below).
3. **Primitives**: button, popover, dropdown menu, select, toggle group and calendar.
4. **Shared layer**: card, toolbar, buttons, inputs, filter panels and scrollbars.
5. **Motion**: the open, close and slide animations, gated by `prefers-reduced-motion`.
6. **Module sheets**: the assistant, the table, the kanban, the auth forms, the segmented control
   and the country select.

The reset is scoped to the `gdy-scope` class. Gridory puts it on the card of the table and the
kanban, on the assistant panel, overlay and launcher, on the auth form card, on the segmented
control, on the country select field, and on every menu, select and popover it renders in a portal. The scope is wrapped in `:where()`, so it adds no
specificity: the reset rules weigh as little as plain element selectors and any component class
overrides them. They set border-box sizing, solid zero-width borders colored with `--gdy-border`,
zero margins on headings and paragraphs, unstyled lists and links, form controls that inherit the
font, transparent buttons with a pointer cursor, block-level media and collapsed table borders.

Markup outside those roots is never touched. Content you render inside a component (a column
`cell`, a `renderCard` output) sits inside the scope and gets the reset too, so give lists and
headings there their own styles. Gridory sets no font family; the components inherit yours. The
stylesheet does not use Tailwind and your app does not need it. It emits no utility classes, no
`--tw-*` variables and no Tailwind directives. The [Tailwind preset](#tailwind-preset) is optional.

## Light and dark theme

The light theme is the default. The dark theme applies under any element with the `dark` class or
the `data-theme="dark"` attribute, as in `<html class="dark">`. Put the switch on `<html>`. Menus,
selects, popovers and the date picker calendar render in portals directly under `<body>`, so a
class on an inner wrapper does not reach them. If your app already toggles `.dark` on `<html>`
(the shadcn/ui convention), there is nothing to add.

Gridory does not read `prefers-color-scheme`. Set the class yourself, from a user setting or from
the operating system preference:

```ts
const root = document.documentElement;
root.classList.toggle("dark", window.matchMedia("(prefers-color-scheme: dark)").matches);
export const toggleTheme = () => root.classList.toggle("dark");
```

## Base tokens

Base tokens carry the whole palette. Each one reads the shadcn/ui variable of the same name first
and falls back to the Gridory value: `--gdy-primary: var(--primary, oklch(0.205 0 0))`. With this
bridge, an app that defines shadcn tokens as full colors (`oklch(…)`, `hsl(…)`, hex) themes Gridory
in light and dark with no setup. If your variables hold bare channels, such as
`--primary: 222 47% 11%`, the bridge produces an invalid color: declare the `--gdy-*` tokens
yourself.

The library declares its tokens inside `:where()`, which has zero specificity. A plain `:root` or
`.dark` rule in your CSS always wins, whatever the load order:

```css
:root {
  --gdy-primary: #0f766e;
  --gdy-primary-foreground: #ffffff;
  --gdy-radius: 6px;
}

.dark {
  --gdy-primary: #5eead4;
  --gdy-primary-foreground: #042f2e;
}
```

A value declared only in `:root` also applies in the dark theme, because it outweighs the library
dark block on the same `<html>` element. Declare the dark value in `.dark`, after the `:root` rule.

Each token bridges to the shadcn variable without the `gdy-` part (`--gdy-card` reads `--card`):

| Token | Light | Dark |
|---|---|---|
| `--gdy-background` / `--gdy-foreground` | `oklch(1 0 0)` / `oklch(0.145 0 0)` | `oklch(0.145 0 0)` / `oklch(0.985 0 0)` |
| `--gdy-card` / `--gdy-card-foreground` | `oklch(1 0 0)` / `oklch(0.145 0 0)` | `oklch(0.205 0 0)` / `oklch(0.985 0 0)` |
| `--gdy-popover` / `--gdy-popover-foreground` | `oklch(1 0 0)` / `oklch(0.145 0 0)` | `oklch(0.205 0 0)` / `oklch(0.985 0 0)` |
| `--gdy-primary` / `--gdy-primary-foreground` | `oklch(0.205 0 0)` / `oklch(0.985 0 0)` | `oklch(0.922 0 0)` / `oklch(0.205 0 0)` |
| `--gdy-secondary` / `--gdy-secondary-foreground` | `oklch(0.97 0 0)` / `oklch(0.205 0 0)` | `oklch(0.269 0 0)` / `oklch(0.985 0 0)` |
| `--gdy-muted` / `--gdy-muted-foreground` | `oklch(0.97 0 0)` / `oklch(0.556 0 0)` | `oklch(0.269 0 0)` / `oklch(0.708 0 0)` |
| `--gdy-accent` / `--gdy-accent-foreground` | `oklch(0.97 0 0)` / `oklch(0.205 0 0)` | `oklch(0.269 0 0)` / `oklch(0.985 0 0)` |
| `--gdy-destructive` / `--gdy-destructive-foreground` | `oklch(0.577 0.245 27.325)` / `oklch(0.985 0 0)` | `oklch(0.704 0.191 22.216)` / `oklch(0.985 0 0)` |
| `--gdy-success` | `oklch(0.527 0.154 150.069)` | `oklch(0.792 0.209 151.711)` |
| `--gdy-border` / `--gdy-input` / `--gdy-ring` | `oklch(0.922 0 0)` / `oklch(0.922 0 0)` / `oklch(0.708 0 0)` | `oklch(1 0 0 / 10%)` / `oklch(1 0 0 / 15%)` / `oklch(0.556 0 0)` |
| `--gdy-radius` | `0.625rem` | same as light |

These tokens have no shadcn counterpart:

| Token | Light | Dark | Used by |
|---|---|---|---|
| `--gdy-link` | `oklch(0.546 0.245 262.881)` | `oklch(0.707 0.165 254.624)` | link buttons in the filter panels |
| `--gdy-overlay` | `rgb(0 0 0 / 0.3)` | `rgb(0 0 0 / 0.6)` | backdrop behind the assistant on small screens |
| `--gdy-shadow-sm` | `0 1px 2px rgb(0 0 0 / 0.12)` | `0 1px 2px rgb(0 0 0 / 0.5)` | active view switch button, toggle item and segmented control indicator |
| `--gdy-shadow-md` | `0 8px 24px rgb(0 0 0 / 0.12)` | `0 8px 24px rgb(0 0 0 / 0.6)` | filter panels, menus, selects, popovers |
| `--gdy-shadow-lg` | `0 25px 50px -12px rgb(0 0 0 / 0.25)` | `0 25px 50px -12px rgb(0 0 0 / 0.6)` | assistant panel |
| `--gdy-font-mono` | `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace` | same as light | `code`, `kbd`, `samp` and `pre` inside the scope |
| `--gdy-google-blue` / `-green` / `-yellow` / `-red` | `#4285f4` / `#34a853` / `#fbbc05` / `#ea4335` | same as light | Google logo in the auth forms. Google's brand guidelines forbid recoloring it: leave them as they are |

## Component tokens

Component tokens are never declared by the library. Its rules read them with a fallback to a base
token, as in `background: var(--gdy-table-head-bg, var(--gdy-muted))`. Because nothing declares
them, an override on any ancestor applies: `:root` for the whole app, `.dark` for the dark theme,
or a wrapper class for one screen. Menus, selects, popovers and the calendar render in portals
under `<body>`, so declare the tokens that style them (`--gdy-menu-*`, `--gdy-select-*`,
`--gdy-popover-*`, `--gdy-calendar-*`) on `:root` or `.dark`. The same goes for the country select
panel: `--gdy-country-select-panel-min-width`, `--gdy-country-select-option-*` and
`--gdy-country-select-check-color`.

| Family | Examples (fallback) |
|---|---|
| `--gdy-table-*` | `--gdy-table-head-bg` (`--gdy-muted`), `--gdy-table-border` (`--gdy-border`), `--gdy-table-row-hover-bg` (`--gdy-muted`) |
| `--gdy-kanban-*` | `--gdy-kanban-column-bg` (`--gdy-muted`), `--gdy-kanban-card-bg` (`--gdy-card`), `--gdy-kanban-drop-outline` (`--gdy-muted-foreground`) |
| `--gdy-ai-*` | `--gdy-ai-accent` (`--gdy-primary`), `--gdy-ai-bg` (`--gdy-background`), `--gdy-ai-user-bubble-bg` (`--gdy-ai-accent`, then `--gdy-primary`) |
| `--gdy-auth-*` | `--gdy-auth-bg` (`--gdy-card`), `--gdy-auth-submit-bg` (`--gdy-primary`), `--gdy-auth-input-focus-border` (`--gdy-ring`), `--gdy-auth-rule-met` (`--gdy-success`) |
| `--gdy-segmented-*` | `--gdy-segmented-bg` (`--gdy-muted`), `--gdy-segmented-indicator-bg` (`--gdy-background`), `--gdy-segmented-item-active-color` (`--gdy-foreground`), `--gdy-segmented-focus-ring` (`--gdy-ring`), `--gdy-segmented-duration` (`220ms`) |
| `--gdy-country-select-*` | `--gdy-country-select-width` (`240px`), `--gdy-country-select-border` (`--gdy-input`), `--gdy-country-select-focus-ring` (`--gdy-ring`), `--gdy-country-select-option-hover-bg` (`--gdy-listbox-option-hover-bg`, then `--gdy-accent`), `--gdy-country-select-chip-bg` (`--gdy-muted`) |
| `--gdy-btn-*` | `--gdy-btn-bg` (`--gdy-muted`), `--gdy-btn-primary-bg` (`--gdy-primary`), `--gdy-btn-hover-bg` (`color-mix(in oklab, var(--gdy-foreground) 8%, var(--gdy-muted))`) |
| `--gdy-input-*` | `--gdy-input-bg` (`--gdy-muted`), `--gdy-input-border` (`--gdy-input`) |
| `--gdy-panel-*` | `--gdy-panel-bg` (`--gdy-popover`), `--gdy-panel-border` (`--gdy-border`), `--gdy-panel-shadow` (`--gdy-shadow-md`) |
| `--gdy-toolbar-*` | `--gdy-toolbar-border` (`--gdy-border`) |
| `--gdy-option-hover-bg` | `color-mix(in oklab, var(--gdy-foreground) 6%, var(--gdy-muted))` |
| `--gdy-scrollbar-thumb` | `--gdy-input` |
| `--gdy-select-*` | `--gdy-select-bg` (`--gdy-background`), `--gdy-select-border` (`--gdy-border`), `--gdy-select-radius` (`calc(var(--gdy-radius) - 2px)`) |
| `--gdy-menu-*` | `--gdy-menu-bg` (`--gdy-popover`), `--gdy-menu-fg` (`--gdy-popover-foreground`), `--gdy-menu-item-hover-bg` (`--gdy-accent`) |
| `--gdy-popover-*` | `--gdy-popover-bg` (`--gdy-popover`), `--gdy-popover-fg` (`--gdy-popover-foreground`) |
| `--gdy-toggle-*` | `--gdy-toggle-bg` (`color-mix(in oklab, var(--gdy-muted) 50%, transparent)`), `--gdy-toggle-active-bg` (`--gdy-background`) |
| `--gdy-calendar-*` | `--gdy-calendar-selected-bg` (`--gdy-primary`), `--gdy-calendar-selected-fg` (`--gdy-primary-foreground`), `--gdy-calendar-range-bg` (`--gdy-muted`) |

The exhaustive list, with every fallback, is in [style-hooks.md](style-hooks.md#component-tokens).
An override for both themes, plus one scoped to a single screen:

```css
:root {
  --gdy-table-head-bg: #f8fafc;
}

.dark {
  --gdy-table-head-bg: #1e293b;
}

.reports-page {
  --gdy-table-row-hover-bg: color-mix(in oklab, var(--gdy-primary) 8%, transparent);
}
```

## Overriding by class

Every element the library renders carries a `gdy-*` class meant as a stable hook:

- `gdy-<module>-<part>` for a module's own parts: `gdy-table-head-cell`, `gdy-kanban-card`.
- `gdy-<part>` for what the table and the kanban share: `gdy-card`, `gdy-toolbar`, `gdy-btn`,
  `gdy-input`, `gdy-panel`, `gdy-option-item`.
- The primitives: `gdy-button`, `gdy-select-*` (`trigger`, `content`, `item`), `gdy-menu-*`
  (`content`, `item`, `label`, `separator`), `gdy-popover-content`, `gdy-toggle-*` (`group`,
  `item`) and `gdy-calendar-*` (such as `gdy-calendar-day` and `gdy-calendar-day-button`).
- `gdy-ai-<part>` for the assistant: `gdy-ai-button`, `gdy-ai-sidebar`, `gdy-ai-bubble`,
  `gdy-ai-action-card`, `gdy-ai-send`.
- `gdy-auth-<part>` for the auth forms: `gdy-auth`, `gdy-auth-input`, `gdy-auth-submit`,
  `gdy-auth-google`, `gdy-auth-rule`.
- `gdy-segmented-<part>` for the segmented control: `gdy-segmented` (root),
  `gdy-segmented-indicator`, `gdy-segmented-item`, `gdy-segmented-icon`, `gdy-segmented-label`.
- `gdy-country-select-<part>` for the country select: `gdy-country-select` (root),
  `gdy-country-select-trigger`, `gdy-country-select-value`, `gdy-country-select-chip`,
  `gdy-country-select-panel`. Its flags keep the shared `gdy-country-flag`.

The library rules follow a fixed specificity contract:

| Rule | Example | Specificity |
|---|---|---|
| Base | `.gdy-kanban-card` | one class (0-1-0) |
| Variant (`data-variant`, `data-size`, `data-role`) | `.gdy-button:where([data-variant="outline"])` | one class (0-1-0) |
| State (attribute or pseudo-class) | `.gdy-kanban-card[data-dragging]`, `.gdy-select-trigger:hover` | 0-2-0 |
| Module override of a primitive | `.gdy-select-trigger.gdy-table-inline-select`, `.gdy-button.gdy-ai-send` | two classes (0-2-0) |
| Root flag plus one class | `.gdy-thin-scroll .gdy-scroll`, `.gdy-table-sticky .gdy-table-head-cell` | two classes (0-2-0) |
| Icon inside an item | `.gdy-menu-item svg`, `.gdy-toggle-item svg` | 0-1-1 |

A rule with the same selector as the library rule, loaded after `gridory/styles.css`, replaces its
declarations ([style-hooks.md](style-hooks.md) lists the selectors each class takes). A single class
of yours, loaded later and passed through `className`, the `selectTheme` class names or a
`classNames` slot, beats base rules and variants but not states. For a state, write its selector.
The library never depends on the order of its own sheets; when a module adjusts a primitive it adds
a second class. The only tag selectors size the icons you pass as `ReactNode` (row action, toggle
option and segmented control option icons), which arrive without a class.

Some classes have no default rule, so you can target them without fighting a default:
`gdy-table-head`, `gdy-table-body`, `gdy-table-group-row`, `gdy-table-empty-row`,
`gdy-toolbar-create`, `gdy-select-value`, `gdy-ai-close`. The catalog marks them as "hook only".
The primitives also keep a `data-slot` attribute as a second hook (`data-slot="button"`,
`"select-trigger"`, `"dropdown-menu-item"`, `"popover-content"`, `"calendar"` and others); the
stylesheet has no rules on it.

```css
/* app.css, loaded after gridory/styles.css */
.gdy-kanban-card {
  border-radius: 6px;
  box-shadow: var(--gdy-shadow-sm);
}

.gdy-table-head-trigger {
  text-transform: uppercase;
}

.gdy-kanban-card[data-dragging] {
  outline: 2px solid var(--gdy-ring);
}

.gdy-select-trigger.gdy-table-inline-select {
  height: 32px;
}
```

## State attributes

States are attributes, never classes. Boolean attributes are present or absent: select them by
presence (`[data-dragging]`), not by value. The others take the values listed.

| Attribute | Class | Set by | Meaning |
|---|---|---|---|
| `data-filtered` | `gdy-table-head-trigger`, `gdy-kanban-filter-trigger` | Gridory | the column or field has an active filter |
| `data-selected`, `data-checked` | `gdy-option-item`, `gdy-option-check` | Gridory | a checked option in a value filter |
| `data-dragging`, `data-drop-target` | `gdy-kanban-card`, `gdy-kanban-column` | Gridory | the card being dragged; the column under it |
| `data-clickable` | `gdy-table-row` | Gridory | the table has `onRowClick` |
| `aria-pressed="true"` | `gdy-view-switch-btn`, `gdy-link-btn` | Gridory | active view, active sort or operator in a filter panel |
| `aria-expanded` | `gdy-table-group-toggle` | Gridory | `"false"` when the group is collapsed |
| `data-state` | `gdy-menu-content`, `gdy-popover-content`, `gdy-select-*`, `gdy-toggle-item` | Radix | `"open"` or `"closed"` on menu, popover and select; `"checked"` on a select item; `"on"` on a toggle item |
| `data-highlighted` | `gdy-select-item` | Radix | the item under the pointer or keyboard focus |
| `data-disabled` | `gdy-menu-item`, `gdy-select-item`, `gdy-calendar-day` | Radix, react-day-picker | a disabled item or day |
| `data-placeholder` | `gdy-select-trigger` | Radix | no value selected |
| `data-side` | `gdy-menu-content`, `gdy-popover-content`, `gdy-select-content` | Radix | `"top"`, `"right"`, `"bottom"` or `"left"` of the anchor |
| `data-today`, `data-outside`, `data-selected` | `gdy-calendar-day` | react-day-picker | today, a day of another month, a selected day |
| `data-range-start`, `data-range-middle`, `data-range-end` | `gdy-calendar-day`, `gdy-calendar-day-button` | Gridory | position inside a selected range |
| `data-selected-single` | `gdy-calendar-day-button` | Gridory | a selected day outside a range |
| `data-state` | `gdy-ai-sidebar` | Gridory | `"open"` or `"closed"` |
| `data-empty` | `gdy-ai-body` | Gridory | the conversation has no messages |
| `data-role` | `gdy-ai-message`, `gdy-ai-bubble` | Gridory | `"user"` or `"assistant"` |
| `data-streaming`, `data-thinking` | `gdy-ai-message` | Gridory | the reply being streamed; the row shown until the first token arrives |
| `data-action-type` | `gdy-ai-action-card` | Gridory | `"create-row"`, `"create-card"`, `"update-row"`, `"move-card"` or `"custom"` |
| `data-list` | `gdy-ai-md-item` | Gridory | `"ordered"` or `"unordered"` |
| `data-form` | `gdy-auth` | Gridory | `"login"` or `"signup"` |
| `aria-invalid`, `aria-required` | `gdy-auth-input`, `gdy-auth-select`, `gdy-auth-checkbox-input` | Gridory | an invalid field; a required field |
| `data-status` | `gdy-auth-rule` | Gridory | `"pending"`, `"met"` or `"unmet"` password requirement |
| `data-animated` | `gdy-segmented` | Gridory | `"true"` or `"false"`: whether the indicator slides (the `animated` prop) |
| `aria-checked` | `gdy-segmented-item` | Gridory | `"true"` on the chosen option, `"false"` on the others |
| `aria-expanded`, `aria-invalid` | `gdy-country-select-trigger` | Gridory | `"true"` while the list is open, `"false"` otherwise; `"true"` with an error |
| `data-placeholder` | `gdy-country-select-value` | Gridory | no country chosen |
| `hidden` | `gdy-country-select-chip`, `gdy-country-select-more` | Gridory | a chip that does not fit; the "+N" badge while every chip fits |

Style a state by adding the attribute to the class. The rule weighs 0-2-0, so it also beats a single
class you pass through a prop:

```css
.gdy-table-head-trigger[data-filtered] {
  font-weight: 600;
}

.gdy-ai-action-card[data-action-type="move-card"] {
  border-style: dashed;
}
```

## Styling through props

The table appends `tableMinHeightClassName`, `tableMaxHeightClassName` and `tableWrapClassName`,
in that order, to its rows scroll container (`gdy-table-wrap`). The kanban appends
`boardMinHeightClassName` and `boardWrapClassName` to its board viewport (`gdy-kanban-board-wrap`).
The library ships utilities for these props:

| Class | Effect |
|---|---|
| `gdy-table-min-h-sm`, `gdy-table-min-h-md`, `gdy-table-min-h-lg` | `min-height` of 240px, 360px, 520px |
| `gdy-table-max-h-sm`, `gdy-table-max-h-md`, `gdy-table-max-h-lg` | `max-height` of 320px, 480px, 640px, with `overflow-y: auto` |
| `gdy-kanban-min-h-sm`, `gdy-kanban-min-h-md`, `gdy-kanban-min-h-lg` | `min-height` of 240px, 360px, 520px |

Passing `tableMaxHeightClassName` gives the rows their own scroll region, which also turns on the
sticky header (see [table.md](table.md)). Both components share these styling props (the select
options are described in [toolbar.md](toolbar.md)):

| Prop | Type | Default | Description |
|---|---|---|---|
| `selectTheme` | `SelectTheme` | — | Colors, radius and class names for every select; colors and radius are set as `--gdy-select-*` tokens on the select itself |
| `thinScrollbars` | `boolean` | `true` | Adds `gdy-thin-scroll` to the root, so every `gdy-scroll` area gets a thin scrollbar |
| `scrollbarColor` | `string` | — | Sets `--gdy-scrollbar-thumb` on the root; falls back to `--gdy-input` |
| `optionHoverColor` | `string` | — | Sets `--gdy-option-hover-bg` on the root, the hover background of filter options |

The assistant panel takes these (its other props are in [ai-assistant.md](ai-assistant.md)):

| Prop | Type | Default | Description |
|---|---|---|---|
| `className` | `string` | — | Appended to the panel root, after `gdy-ai-sidebar` |
| `classNames` | `AIChatClassNames` | — | One class per slot, listed below |
| `width` | `number \| string` | `380` | Panel width, set inline; a number means pixels |

Each `classNames` slot is appended to one hook: `root` to `gdy-ai-sidebar` (after `className`),
`header` to `gdy-ai-header`, `body` to `gdy-ai-body`, `footer` to `gdy-ai-footer`, `inputWrapper`
to `gdy-ai-input-wrapper`, `textarea` to `gdy-ai-textarea`, `chip` to each suggested message
(`gdy-ai-chip`), and `userBubble` and `assistantBubble` to the `gdy-ai-bubble` of each role,
including the reply being streamed. `AIChatButton` accepts `className` too, after `gdy-ai-button`.

The auth forms take `className`, `width` (card width, set inline as `--gdy-auth-width`) and a
`classNames` object with one slot per part; see [auth-forms.md](auth-forms.md#styling).

The segmented control takes `className`, on its root (`gdy-segmented`), and a `classNames` object
with one slot per part: `root`, `indicator`, `item`, `icon` and `label`; see
[segmented-control.md](segmented-control.md#styling).

The country select takes `className`, on its root (`gdy-country-select`), a `classNames` object
with the slots `root`, `trigger`, `value`, `clear`, `chips`, `chip` and `panel`, and `width`
(field width, set inline as `--gdy-country-select-width`; a number means pixels). Its
`thinScrollbars` (default `true`) and `scrollbarColor` work as in the table and the kanban, on the
list inside its panel; see [country-select.md](country-select.md#styling).

Class names from props are concatenated after the hook as they come. Nothing merges or
deduplicates them, so a class you pass never removes a library declaration; it wins only through the
cascade rules in [Overriding by class](#overriding-by-class).

## Motion

The open, close and slide animations live in `@media (prefers-reduced-motion: no-preference)`.
With `prefers-reduced-motion: reduce` none of them runs.

- Popover, menu and select content (the calendar popover included) fade in and grow from their
  anchor when they open (`gdy-pop-in`, 150 ms). The Radix `data-side` attribute sets the
  direction: the surface starts 8px toward its anchor and moves into place.
- Popover and menu content fade out when they close (`gdy-pop-out`, 100 ms). The select content
  unmounts as soon as it closes, so it has no exit animation.
- The assistant panel slides in from the right edge (a `transform` transition of 0.3 s).
- The segmented control indicator slides to the chosen option (220 ms, set by
  `--gdy-segmented-duration`). Only changes after the first render are animated. `animated={false}`
  switches it off for one control (`data-animated="false"` on `gdy-segmented`); see
  [segmented-control.md](segmented-control.md#motion).

The "thinking" spinner of the assistant (`gdy-ai-thinking-icon`, keyframes `gdy-ai-spin`) always
runs, because it reports progress. To change or switch off an animation, target the same selector
from your CSS (the same works for `.gdy-ai-thinking-icon`):

```css
.gdy-menu-content[data-state],
.gdy-popover-content[data-state],
.gdy-select-content[data-state] {
  animation: none;
}

.gdy-ai-sidebar {
  transition: none;
}
```

## Tailwind preset

Gridory does not need Tailwind. The preset is for apps that use Tailwind and want the library
palette in their own markup, for example inside a column `cell` or a `renderCard` output.

```js
// tailwind.config.js
import gridoryPreset from "gridory/tailwind-preset";

export default {
  presets: [gridoryPreset],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
};
```

It maps the shadcn-style theme keys to the base tokens: the colors `background`, `foreground`,
`card`, `popover`, `primary`, `secondary`, `muted`, `accent` and `destructive` (each with a
`foreground` shade), `border`, `input` and `ring` (`bg-card`, `text-muted-foreground`,
`border-border`, `outline-ring` and the rest), and the radii `lg` (`var(--gdy-radius)`), `md`
(`calc(var(--gdy-radius) - 2px)`) and `sm` (`calc(var(--gdy-radius) - 4px)`). The utilities point
at the tokens, so they follow the light/dark theme and your token overrides without `dark:`
variants. Opacity modifiers such as `bg-primary/10` work: the preset blends the token with
`color-mix()`. The preset adds no `content` paths; your own config provides them.

## Style audit

The library repository checks this contract with `npm run audit:styles`, which reads
`dist/gridory.css` and so runs after a build. It fails when a class a component emits has no rule
and is not a declared hook, when a rule targets a class no component emits, when an attribute
selector matches nothing the components write, when a literal color appears outside
`src/styles/tokens.css`, when a Tailwind leftover appears, or when
[style-hooks.md](style-hooks.md) is out of date. `npm run docs:hooks` regenerates that catalog from
the sources, with no build needed.
