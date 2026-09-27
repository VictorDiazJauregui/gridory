# Country select

[English](country-select.md) · [Español](country-select.es.md)

`CountrySelect` picks one country, or several, from a searchable list with flags. It keeps no
business state: it emits the ISO code and your app decides what to do with it.

## Contents

- [Import](#import)
- [Quick example](#quick-example)
- [Single selection](#single-selection)
- [Multiple selection](#multiple-selection)
- [Required and errors](#required-and-errors)
- [Width and narrow containers](#width-and-narrow-containers)
- [Flags and country names](#flags-and-country-names)
- [Events](#events)
- [Keyboard and accessibility](#keyboard-and-accessibility)
- [Styling](#styling)
- [Texts](#texts)
- [Reference](#reference)

## Import

```ts
import { CountrySelect } from "gridory/country-select";
```

Import `gridory/styles.css` once in your app, before any override (see [theming.md](theming.md)). The
root `gridory` entry re-exports the same names.

## Quick example

```tsx
import { CountrySelect } from "gridory/country-select";

export const ResidenceCountry = () => <CountrySelect onValueChange={saveResidenceCountry} />;
```

That renders the "País" label, the "Selecciona un país" placeholder and a list of the 249 ISO
3166-1 countries, with their names in Spanish and their flags. Picking Peru reports `"PE"`. The
label and every text can be replaced (see [Texts](#texts)). In the library repository,
`npm run dev` serves every example on this page at `/mocks/controls`, next to an event log.

## Single selection

Without `multiple`, the control holds one country. The value is a `CountryCode`, the union of the
249 uppercase ISO 3166-1 alpha-2 codes, or `null` when nothing is chosen: `"XX"` or `"pe"` do not
compile.

- **Uncontrolled.** Pass `defaultValue`, or nothing to start empty. The control keeps the country
  itself and still reports every change through `onValueChange`.
- **Controlled.** Pass `value` and update it in `onValueChange`. The control shows the value you
  pass: until you update it, the chosen country does not change.

```tsx
import { useState } from "react";
import { CountrySelect, type CountryCode } from "gridory/country-select";

export const BillingCountry = () => {
  const [country, setCountry] = useState<CountryCode | null>("PE");
  return <CountrySelect required value={country} onValueChange={setCountry} />;
};
```

Picking a country closes the list, returns the focus to the field and emits the code. Picking the
country that is already chosen only closes the list: nothing is emitted. The closed field shows
the flag and the name; a long name ends in an ellipsis and the field's `title` holds it in full.

When the list opens, the chosen country is the active option and the list scrolls to it, so
reopening with Uruguay chosen does not start at Afghanistan.

**The "×" clears.** When the control is not `required` and a country is chosen, a "×" button sits
at the end of the field. It empties the selection and emits `null`, without opening the list. A
`required` control has no "×".

**Codes that arrive as text.** A value from your server or a URL is a `string`. `isCountryCode`
narrows it before you pass it on:

```ts
import { isCountryCode, type CountryCode } from "gridory/country-select";

const toCountryCode = (value: string): CountryCode | null => (isCountryCode(value) ? value : null);
```

The check is exact: codes are uppercase, so `isCountryCode("pe")` is `false`.

## Multiple selection

`multiple` switches the control to several countries. The value becomes `CountryCode[]`, and
`minSelected` and `maxSelected` set the valid range: the minimum is 1 and the maximum has no limit
unless you pass one.

```tsx
<CountrySelect
  multiple
  minSelected={1}
  maxSelected={3}
  defaultValue={["PE", "UY"]}
  onValueChange={saveShippingCountries}
/>
```

- **Picking toggles.** A click, or Enter on the active option, adds the country or removes it, and
  the list **stays open** to pick more.
- **Order.** The value keeps the order in which the countries were picked: a new one goes to the
  end. `onValueChange` receives a new array every time; the one you passed is never mutated.
- **At the maximum.** The countries not chosen are disabled (`aria-disabled`): they show greyed
  out, a click does nothing and the arrow keys skip them. Under the list, "Alcanzaste el máximo
  permitido (3)" explains why, in a `role="status"` region that screen readers announce.
  Removing a country enables them again.
- **Chips.** The closed field shows one chip per country, in the order picked: flag, name and a
  "×" that removes only that country, without opening the list, and returns the focus to the
  field. A long name is cut at `--gdy-country-select-chip-max-width` (8rem); the field's `title` lists
  every chosen name in full.
- **"+N".** The chips stay on one line. Those that do not fit are hidden and a "+N" badge counts
  them, named "2 más" for screen readers. The "×" of a hidden chip is out of reach: remove that
  country from the list instead. How many fit is measured with a
  `ResizeObserver`, so the row follows the width of the container and the font size.
- **Empty.** The field shows the "Selecciona países" placeholder.

A click anywhere on the field, chips included, opens the list; only a chip's "×" does not. With the list open, a click on a
chip's "×" closes the list and removes that country.

The controlled form works as in single selection, with an array:

```tsx
const [countries, setCountries] = useState<CountryCode[]>(["PE", "UY"]);

<CountrySelect multiple maxSelected={3} value={countries} onValueChange={setCountries} />;
```

**Invalid range.** A `minSelected` greater than `maxSelected` is a programming error: the render
throws `InvalidSelectionRangeError`, with both values in the message. Other values are not
validated.

## Required and errors

`required` adds the red "*" to the label and `aria-required` to the field and, in single
selection, removes the "×".

The control shows its own error **when the list closes**, and when a chip is removed while the
list is closed. It never interrupts while the person is still picking:

| Case | Error (`texts` key) |
|---|---|
| `required` and nothing chosen, in either mode | "Selecciona un país" (`required`) |
| `multiple` with fewer countries than `minSelected`, but at least one | "Selecciona al menos 2 países" (`belowMinimum`) |

Without `required`, an empty selection is not an error. With the default minimum of 1, only
`required` makes an empty multiple selection an error. The error appears the first time the list
closes (or a chip is removed with the list closed); from then on it follows the selection live, so
it goes away as soon as the selection is valid.

Pass `error` to show your own message, for example after a submit or from your server. It is
shown under the field and **always wins** over the control's own error:

```tsx
<CountrySelect
  required
  value={country}
  onValueChange={setCountry}
  error={serverErrors.country}
/>
```

Either error goes under the field and the combobox gets `aria-invalid="true"` and an
`aria-describedby` that points at it, so a screen reader reads it when the focus returns to the
field. The error text is not a live region: an error that appears without moving the focus is not
announced on its own.

## Width and narrow containers

The field is 240px wide by default. `width` changes it: a number is taken as pixels and a string
as any CSS length. The control writes it inline as `--gdy-country-select-width` on its root.

```tsx
<CountrySelect width={140} defaultValue="CD" />
<CountrySelect width={360} />
<CountrySelect width="100%" />
```

- **Narrow.** At 140px, "República Democrática del Congo" ends in an ellipsis and the field's
  `title` shows the whole name.
- **Never wider than its container.** The width lives in a one-column grid,
  `gdy-country-select-frame`, whose column is `minmax(0, width)`: the field takes its width when
  there is room and, in a narrower column, even inside flex or grid layouts, shrinks and truncates
  instead of overflowing, so the page does not scroll sideways on a phone.
- **The panel.** The list opens in a floating panel as wide as the whole field, "×" and chips
  included, and never narrower than 240px (`--gdy-country-select-panel-min-width`). It opens below
  the field and flips above it when there is no room, follows the field when a container scrolls
  and never grows past the visible height.

## Flags and country names

**Flags.** Each country shows its flag in the field, the chips and the list. They are decorative
(`alt=""`), because the name is always next to them, and they load lazily. By default they come
from [flagcdn.com](https://flagcdn.com), so your Content Security Policy has to allow it in
`img-src`. `flagUrl` takes a `FlagUrlResolver` that builds the URL from the code and the width in
pixels. The control asks for 20px for `src` and 40px for the `2x` `srcSet`:

```tsx
import { CountrySelect, type FlagUrlResolver } from "gridory/country-select";

const resolveOwnFlagUrl: FlagUrlResolver = (code, width) =>
  `https://cdn.example.com/flags/w${width}/${code.toLowerCase()}.png`;

export const HostedFlagsCountry = () => <CountrySelect flagUrl={resolveOwnFlagUrl} />;
```

`showFlags={false}` removes them everywhere.

**Country names.** `locale` sets the language of the names, which come from
`Intl.DisplayNames`, and of their alphabetical order. It is `"es"` by default. The UI texts are
separate: change them with `texts` (see [Texts](#texts)).

```tsx
<CountrySelect
  locale="en"
  label="Country"
  texts={ENGLISH_COUNTRY_SELECT_TEXTS}
  onValueChange={saveResidenceCountry}
/>
```

The names depend on the ICU data of the browser; every current browser ships them.

**Search.** The search box finds a country by:

- its name, ignoring accents and case: "peru" finds Perú;
- its exact ISO code: "pe" finds Perú;
- the start of its dialing code: "51" or "+51" finds Perú, but not Portugal (+351). The list does
  not show dialing codes; the search accepts them because people type them.

## Events

| Callback | Signature | Fires |
|---|---|---|
| `onValueChange` (single) | `(value: CountryCode \| null) => void` | The chosen country changes. `null` when the "×" clears it. |
| `onValueChange` (`multiple`) | `(value: CountryCode[]) => void` | A country is added or removed, from the list or from a chip's "×". A new array, in the order picked. |

Only a change fires it: picking the country that is already chosen in single selection does not,
and neither does a click on a disabled option at the maximum.

The control never changes your data: it reports the new value and your app decides what to do
with it.

## Keyboard and accessibility

The closed field is a combobox that opens a dialog with a search box and the list, following the
[WAI-ARIA combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/):

| Key | Action |
|---|---|
| Tab / Shift+Tab | Reaches the field. In single selection the "×" comes next; in multiple, the "×" of each visible chip. |
| Enter or Space, on the field | Opens the list and moves the focus to the search box. |
| Typing | Filters the list. The first match becomes the active option. |
| ↓ / ↑ | Moves to the next or previous option, skipping disabled ones. It stops at both ends. |
| Home / End | Moves to the first or last option. |
| Enter | Picks the active option. In single selection it closes the list; in multiple, it toggles the country and the list stays open. |
| Escape | Closes the list and returns the focus to the field. |
| Tab, in the list | Closes the list and returns the focus to the field; the next Tab continues from there. |

A click outside also closes the list. A click on the label opens it, since the label points at
the combobox.

- **Name.** The field is named "País" by default. `label` replaces it; `aria-label` or
  `aria-labelledby` name the field without a visible label. The types allow exactly one of the
  three, so combining them does not compile.
- **The field** is a `<button role="combobox">` with `aria-expanded`, `aria-haspopup="dialog"`
  and `aria-controls`. The label is associated with it (`for`), and it carries `aria-required`,
  `aria-invalid` and `aria-describedby` when they apply. In multiple selection it reads a hidden
  summary ("Países seleccionados: 3"), because the chips sit outside it.
- **The panel** is a `role="dialog"` with the same name as the field. Inside, the search box is
  the combobox of the list: it has `aria-controls`, `aria-autocomplete="list"` and
  `aria-activedescendant` pointing at the active option, so the focus stays in the box while the
  arrows move. Its name is "Buscar país".
- **The list** is a `role="listbox"` (with `aria-multiselectable` in multiple selection). Each
  option has `aria-selected` and a check, and the disabled ones `aria-disabled`. When the search
  finds nothing, "No se encontró el país" is announced through a `role="status"` region, like the
  maximum notice.
- **No button inside another.** The "×" and the chips are siblings of the combobox, never
  children, so each one is its own control. The "×" is named "Quitar selección"; a chip's, "Quitar
  Perú"; the "+N" badge, "2 más".
- **Focus.** The ring is drawn inside the whole field (`box-shadow: inset`, in
  `--gdy-country-select-focus-ring`) when the combobox has visible focus. The box does not grow,
  so nothing moves. A transparent `outline` stays in place for high contrast mode
  (`forced-colors`), which paints it visible, and the chips stay outlined there.

To name the field with a visible heading instead of the label:

```tsx
<h3 id="shipping-countries-title">Shipping countries</h3>
<CountrySelect multiple aria-labelledby="shipping-countries-title" />
```

## Styling

Tokens and light/dark themes are covered in [theming.md](theming.md), and every hook, state
selector and token is listed in [style-hooks.md](style-hooks.md#country-select). The control
follows the theme set on `<html>` (`.dark` or `data-theme="dark"`). It has the same height, border,
radius and background as the auth form inputs, so both fit in one form.

`className` goes on the root and `classNames` adds your class to each part, next to its hook:

| Part | Hook | `classNames` slot |
|---|---|---|
| Frame that holds the width | `gdy-country-select-frame` | — |
| Field box (the root, anchor of the panel) | `gdy-country-select` | `root` |
| Combobox (`<button role="combobox">`) | `gdy-country-select-trigger` | `trigger` |
| Chosen name or placeholder | `gdy-country-select-value` | `value` |
| "×" that clears the single selection | `gdy-country-select-clear` | `clear` |
| Arrow | `gdy-country-select-chevron` | — |
| Row of chips | `gdy-country-select-chips` | `chips` |
| Each chip | `gdy-country-select-chip` | `chip` |
| Name inside a chip | `gdy-country-select-chip-label` | — |
| "×" of a chip | `gdy-country-select-chip-remove` | — |
| "+N" badge | `gdy-country-select-more` | — |
| Hidden summary of the combobox, in multiple selection | `gdy-country-select-summary` | — |
| Floating panel (`role="dialog"`) | `gdy-country-select-panel` | `panel` |
| Maximum notice (`role="status"`) | `gdy-country-select-status` | — |

The root also carries `gdy-scope`, the class of the library reset (see
[theming.md](theming.md#the-stylesheet)). The rest comes from shared hooks: the label, the "*" and
the error are `gdy-field-label`, `gdy-field-required` and `gdy-field-error`; the flags,
`gdy-country-flag`; and the list inside the panel, `gdy-listbox-search`, `gdy-listbox-options`,
`gdy-listbox-option`, `gdy-listbox-check` and `gdy-listbox-empty`.

| Element | State attribute | Values |
|---|---|---|
| `gdy-country-select` | `data-multiple` | Present in multiple selection: the combobox covers the box behind the chips |
| `gdy-country-select-trigger` | `aria-expanded` | `"true"` while the list is open (the arrow turns), `"false"` otherwise |
| `gdy-country-select-trigger` | `aria-invalid` | `"true"` with an error (red border); absent otherwise |
| `gdy-country-select-value` | `data-placeholder` | Present while nothing is chosen |
| `gdy-country-select-chip`, `gdy-country-select-more` | `hidden` | A chip that does not fit; the "+N" badge while every chip fits |
| `gdy-listbox-option` | `aria-selected`, `aria-disabled`, `data-active` | Chosen; disabled at the maximum; active (keyboard or pointer) |

A state weighs two classes (0-2-0), so it beats a single class passed through `classNames`. To
style a state, write its selector:

```css
.gdy-country-select-trigger[aria-expanded="true"] {
  font-weight: 500;
}
```

The library does not define the component tokens: each one is read with a fallback, so set only the
ones you need, on any ancestor: `:root` for the whole app, `.dark` for the dark theme, or a wrapper
for a single screen. The panel renders in a portal under `<body>`, so the tokens of the panel and
its options (`--gdy-country-select-panel-min-width` and `--gdy-country-select-option-*`, plus
`--gdy-country-select-check-color`) only apply from `:root` or `.dark`.

| Token | Fallback | Used by |
|---|---|---|
| `--gdy-country-select-width` | `240px` | Default width of the field. |
| `--gdy-country-select-height` | `--gdy-field-control-height`, then `40px` | Height of the field. |
| `--gdy-country-select-bg` | `--gdy-background` | Field background. |
| `--gdy-country-select-border` | `--gdy-input` | Field border. |
| `--gdy-country-select-radius` | `--gdy-radius` | Field corners. |
| `--gdy-country-select-color` | `--gdy-foreground` | Field text. |
| `--gdy-country-select-placeholder-color` | `--gdy-muted-foreground` | Placeholder and arrow. |
| `--gdy-country-select-hover-bg` | `--gdy-foreground` at 4% (`color-mix`) | Subtle field background on hover. |
| `--gdy-country-select-focus-ring` | `--gdy-ring` | Inset focus ring. |
| `--gdy-country-select-error-color` | `--gdy-destructive` | Border with an error. |
| `--gdy-country-select-option-hover-bg` | `--gdy-listbox-option-hover-bg`, then `--gdy-option-hover-bg`, then `--gdy-accent` | Active option of the list. |
| `--gdy-country-select-option-hover-color` | `--gdy-listbox-option-hover-text`, then `--gdy-accent-foreground` | Text of the active option. |
| `--gdy-country-select-option-selected-bg` | `--gdy-listbox-option-selected-bg`, then `transparent` | Chosen option. |
| `--gdy-country-select-check-color` | `--gdy-listbox-check-color`, then `--gdy-primary` | Check of the chosen option. |
| `--gdy-country-select-panel-min-width` | `240px` | Minimum width of the panel. |
| `--gdy-country-select-chip-bg` | `--gdy-muted` | Chip background. |
| `--gdy-country-select-chip-color` | `--gdy-foreground` | Chip text. |
| `--gdy-country-select-chip-max-width` | `8rem` | Width from which a chip's name is truncated. |

The option tokens fall back to the list's own (`--gdy-listbox-*`), so the country select can be
painted apart from other lists without declaring tokens of another component. The flags read
`--gdy-country-flag-width` (`20px`), `--gdy-country-flag-radius` (`2px`) and
`--gdy-country-flag-outline` (`--gdy-border`), the thin outline that keeps a white flag visible on
a white surface.

**Scrollbar.** The list has a thin scrollbar colored with `--gdy-scrollbar-thumb`, as in the table
and the kanban. `thinScrollbars={false}` leaves the native one, and `scrollbarColor` sets the color
for one control.

Tokens alone are enough for a different look. This version sets them on a form wrapper, and since
its colors point at base tokens, it follows the light and dark themes with nothing else to declare:

```css
.checkout-form {
  --gdy-country-select-width: 100%;
  --gdy-country-select-radius: 6px;
  --gdy-country-select-chip-bg: color-mix(in oklab, var(--gdy-primary) 12%, transparent);
}

:root {
  --gdy-country-select-check-color: var(--gdy-success);
}
```

## Texts

UI texts default to Spanish and every one can be replaced through `texts`; the keys you leave out
keep their default. The defaults are exported as `DEFAULT_COUNTRY_SELECT_TEXTS`. `{…}` marks are
filled in when the text is shown.

| Key | Default | Used for |
|---|---|---|
| `placeholder` | `"Selecciona un país"` | Empty field, single selection. |
| `multiplePlaceholder` | `"Selecciona países"` | Empty field, multiple selection. |
| `searchLabel` | `"Buscar país"` | Accessible name of the search box. |
| `searchPlaceholder` | `"Buscar país..."` | Placeholder of the search box. |
| `noResults` | `"No se encontró el país"` | The search finds nothing. |
| `clearSelection` | `"Quitar selección"` | Name of the "×" that clears the single selection. |
| `removeCountry` | `"Quitar {country}"` | Name of a chip's "×". `{country}` is the country name. |
| `moreCountries` | `"{count} más"` | Accessible name of the "+N" badge. `{count}` is N. |
| `selectedCountries` | `"Países seleccionados: {count}"` | Hidden summary of the combobox in multiple selection. |
| `maxReached` | `"Alcanzaste el máximo permitido ({max})"` | Notice while the maximum is reached. `{max}` is `maxSelected`. |
| `belowMinimum` | `"Selecciona al menos {min} países"` | Error below the minimum. `{min}` is `minSelected`. |
| `required` | `"Selecciona un país"` | Error of a `required` control left empty. |

The "País" label is not a text: it is the `label` prop, exported as `DEFAULT_COUNTRY_SELECT_LABEL`.
The whole set in English, for the example in [Flags and country names](#flags-and-country-names):

```ts
import type { CountrySelectTexts } from "gridory/country-select";

const ENGLISH_COUNTRY_SELECT_TEXTS: CountrySelectTexts = {
  placeholder: "Select a country",
  multiplePlaceholder: "Select countries",
  searchLabel: "Search country",
  searchPlaceholder: "Search country...",
  noResults: "No country found",
  clearSelection: "Clear selection",
  removeCountry: "Remove {country}",
  moreCountries: "{count} more countries",
  selectedCountries: "{count} countries selected",
  maxReached: "You reached the maximum of {max} countries",
  belowMinimum: "Select at least {min} countries",
  required: "Select a country",
};
```

## Reference

| Prop | Type | Default | Description |
|---|---|---|---|
| `multiple` | `boolean` | `false` | Switches to multiple selection. It sets the type of `value`, `defaultValue` and `onValueChange`. |
| `value` | `CountryCode \| null`; `CountryCode[]` with `multiple` | — | Chosen value, controlled. |
| `defaultValue` | `CountryCode \| null`; `CountryCode[]` with `multiple` | — | Initial value, uncontrolled. |
| `onValueChange` | `(value: CountryCode \| null) => void`; `(value: CountryCode[]) => void` with `multiple` | — | The value changed. |
| `minSelected` | `number` | `1` | Only with `multiple`. Smallest valid selection. |
| `maxSelected` | `number` | no limit | Only with `multiple`. Largest selection; at it, the other options are disabled. |
| `required` | `boolean` | `false` | Adds the "*" and `aria-required`, removes the "×", and makes an empty selection an error when the list closes. |
| `error` | `ReactNode` | — | Your error, under the field. It always wins over the control's own. |
| `label` | `ReactNode` | `"País"` | Visible label that names the field. |
| `aria-label` | `string` | — | Names the field without a visible label. Excludes `label` and `aria-labelledby`. |
| `aria-labelledby` | `string` | — | Id of the element that names the field. Excludes `label` and `aria-label`. |
| `width` | `number \| string` | `--gdy-country-select-width` (240px) | Field width; a number means pixels. Never wider than the container. |
| `locale` | `string` | `"es"` | Language of the country names and their order. |
| `showFlags` | `boolean` | `true` | Shows the flags in the field, the chips and the list. |
| `flagUrl` | `FlagUrlResolver` | flagcdn.com | Builds the URL of each flag. |
| `thinScrollbars` | `boolean` | `true` | Thin scrollbar in the list. |
| `scrollbarColor` | `string` | — | Scrollbar color; falls back to `--gdy-scrollbar-thumb`. |
| `texts` | `Partial<CountrySelectTexts>` | `DEFAULT_COUNTRY_SELECT_TEXTS` | Replaces the UI texts. |
| `className` | `string` | — | Your class on the root. |
| `classNames` | `CountrySelectClassNames` | — | Your class on each part. |

### Types

- `CountrySelectProps`: the props above, as `CountrySelectNaming` combined with
  `SingleCountrySelectProps | MultipleCountrySelectProps`.
- `SingleCountrySelectProps`: `multiple?: false`, with `value`, `defaultValue` and
  `onValueChange` over `CountryCode | null`.
- `MultipleCountrySelectProps`: `multiple: true`, `minSelected`, `maxSelected`, and `value`,
  `defaultValue` and `onValueChange` over `CountryCode[]`.
- `CountrySelectNaming`: exactly one of `label`, `aria-label` or `aria-labelledby` (or none, for
  the default label).
- `CountryCode`: the union of the 249 official ISO 3166-1 alpha-2 codes, in uppercase (`"PE"`,
  `"UY"`). Kosovo (`XK`) is a user-assigned code and is not included.
- `FlagUrlResolver`: `(code: CountryCode, width: number) => string`.
- `CountrySelectTexts`: the keys in [Texts](#texts), each a `string`.
- `CountrySelectClassNames`: `{ root?; trigger?; value?; clear?; chips?; chip?; panel? }`, each a
  `string`.

### Values and functions

- `isCountryCode(value: string): value is CountryCode`: `true` when `value` is one of the 249
  codes, exactly as written.
- `DEFAULT_COUNTRY_SELECT_TEXTS`: the default texts.
- `DEFAULT_COUNTRY_SELECT_LABEL`: `"País"`.

### Errors

- `InvalidSelectionRangeError`: thrown while rendering when `minSelected` is greater than
  `maxSelected`. Its `name` is `"InvalidSelectionRangeError"` and its message includes both
  values. It extends `Error`, so an error boundary catches it.
