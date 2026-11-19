# Phone input

[English](phone-input.md) · [Español](phone-input.es.md)

`PhoneInput` pairs a dial code picker with a number field. It keeps no business state: it emits the
country's ISO code and the number, and your app decides what to do with them.

## Contents

- [Import](#import)
- [Quick example](#quick-example)
- [Value and dial code](#value-and-dial-code)
- [Allowed characters](#allowed-characters)
- [Maximum length](#maximum-length)
- [Pasting an international number](#pasting-an-international-number)
- [Input and output examples](#input-and-output-examples)
- [Label, required and errors](#label-required-and-errors)
- [id and name](#id-and-name)
- [Disabled](#disabled)
- [Inside a modal](#inside-a-modal)
- [Inside the auth forms](#inside-the-auth-forms)
- [Keyboard and accessibility](#keyboard-and-accessibility)
- [Styling](#styling)
- [Texts](#texts)
- [Reference](#reference)

## Import

```ts
import { PhoneInput } from "gridory/phone-input";
```

Import `gridory/styles.css` once in your app, before any override (see [theming.md](theming.md)). The
root `gridory` entry re-exports the same names.

To load only this module's styles, import `gridory/base.css` and then `gridory/phone-input.css`
instead (see [Per-module stylesheets](theming.md#per-module-stylesheets)).

## Quick example

```tsx
const [phone, setPhone] = useState<PhoneInputValue>({ country: "PE", number: "" });

<PhoneInput value={phone} onValueChange={setPhone} required placeholder="999 111 222" />
```

## Value and dial code

The value is `{ country, number }`. `country` is the ISO 3166-1 alpha-2 code in uppercase, or `null`
while none is chosen; the dial code is derived from it. Canada and the United States share `+1`, but
they are `"CA"` and `"US"`, so the value never mixes them up.

| Mode | Props |
|---|---|
| Controlled | `value` and `onValueChange`. The field shows `value` until your app changes it. |
| Uncontrolled | `defaultValue`, or `defaultCountry` to start on a country with an empty number. |

There is no country by default: the prefix shows "País" until one is chosen. `onValueChange` fires
with a new object when the country or the number change, never with the object it received. Picking
the country already chosen only closes the list.

```tsx
<PhoneInput defaultCountry="UY" onValueChange={(value) => save(value)} />
```

The list shows every country that has a dial code, with its flag, and searches by name, ISO code
and dial code, accents aside: "peru", "PE", "51" and "+51" find Peru. A dial code matches from its
start, so "51" never finds Portugal (+351). On reopening, the chosen country is marked and in view.

## Allowed characters

The number is an `<input type="tel">` with `inputMode="tel"` and `autoComplete="tel-national"`: the
country goes in the prefix, so the browser suggests the national number. `numberCharacters` decides
which characters it keeps:

| `numberCharacters` | Keeps | `98a7-65 4/3` becomes |
|---|---|---|
| `"phone"` (default, the 2.2.0 rule) | digits, spaces, hyphens and `+` | `987-65 43` |
| `"digits"` | digits only | `9876543` |

Letters, with or without accents, other symbols and emoji are dropped as they are typed and when text
is pasted: pasting `abc 999-111` leaves ` 999-111`. A change made only of dropped characters emits
nothing.

The rule applies to what is **typed or pasted**. The initial value (`value` or `defaultValue`) is shown
as given, even when it breaks the rule, so you see what your database holds. Mind that the rule
filters the whole value on every change: editing an old `987654321 / 912345678` with `"digits"` joins
both numbers. Clean dirty legacy data before you show it.

The field does not validate the number format of each country: that check belongs to your app.

## Maximum length

`maxNumberLength` limits the length of the number, counted **after** the character rule (with
`"digits"`, digits). Without it there is no limit. It must be a whole number from 1; any other value
throws `InvalidMaxNumberLengthError` on render.

- Typing past the maximum does nothing.
- Pasting something longer cuts it to the maximum.
- Deleting always works, even when an old value is already longer than the maximum; adding to such a
  value does not.

```tsx
<PhoneInput numberCharacters="digits" maxNumberLength={9} />
```

## Pasting an international number

With `splitPastedDialCode`, pasting a number that starts with `+` and a known dial code over the
**whole** field (empty or fully selected) splits it: the country goes to the prefix and the local
number to the box, in a single `onValueChange`. It is off by default: without the prop, pasting works
as in 2.2.0.

- The longest known dial code after the `+` wins: `+598 99…` is Uruguay, not `+59`.
- A chosen country that has that dial code stays: with Canada chosen, pasting `+1 …` keeps Canada.
  Otherwise the dial code's representative is chosen (see
  [countries.md](countries.md#shared-dial-codes)): `+1` is the United States.
- The local number goes through the character rule and the maximum length, and loses its leading
  spaces and hyphens.
- Nothing is split when the dial code is unknown (`+999`), when it does not start with `+` (`0051…`),
  or when the paste lands in the middle of a typed number: those are plain pastes.
- Area codes are not read: a Dominican `+1 809…` picks the United States unless a `+1` country was
  chosen.

```tsx
<PhoneInput numberCharacters="digits" splitPastedDialCode />
```

## Input and output examples

| # | Props | Action | Country before | Emitted value |
|---|---|---|---|---|
| E-1 | none (2.2.0) | pastes `+51 987 654 321` | — | `{ country: null, number: "+51 987 654 321" }` |
| E-2 | none | types `98a7-65 4/3` | PE | `"987-65 43"` |
| E-3 | `digits` | types `98a7-65 4/3` | PE | `"9876543"` |
| E-4 | `digits` | pastes `+51 987 654 321` | PE | `"51987654321"` (the dial code stays in the number) |
| E-5 | `splitPastedDialCode` | pastes `+51 987 654 321` | — | `{ country: "PE", number: "987 654 321" }` |
| E-6 | `digits` + split | pastes `+51 987 654 321` | — | `{ country: "PE", number: "987654321" }` |
| E-7 | `digits` + split | pastes `+1 (416) 555-0100` | CA | `{ country: "CA", number: "4165550100" }` |
| E-8 | `digits` + split | pastes `+1 416 555 0100` | PE | `{ country: "US", number: "4165550100" }` |
| E-9 | `digits` + split | pastes `+999 123` (unknown code) | PE | not split: `"999123"` |
| E-10 | `digits` + split | pastes `+51 987` inside typed text | PE | plain paste, filtered |
| E-11 | `digits`, max 9 | pastes `987 654 321 000` | PE | `"987654321"` |
| E-12 | `digits` + split, max 9 | pastes `+51 987 654 321 000` | — | `{ country: "PE", number: "987654321" }` |
| E-13 | `digits`, max 9 | initial value `987654321 / 912345678` | PE | shown as given; emits nothing |
| E-14 | `digits`, max 9 | E-13, then types `0` at the end | PE | refused; emits nothing |
| E-15 | `digits`, max 9 | E-13, then deletes the last character | PE | `"98765432191234567"` |
| E-16 | split | pastes `0051 987…` | — | not split: only `+` counts |

## Label, required and errors

| Prop | Effect |
|---|---|
| `label` | Visible label. "Teléfono" by default. |
| `aria-label` / `aria-labelledby` | Names the number without a visible label. |
| `labelPosition` | `"top"` (default) or `"start"`, beside the field. |
| `required` | Adds the "*" and `aria-required` to the number. |
| `error` | Your error, under the field. It sets `aria-invalid` and paints the border. |

The field never shows an error of its own: `required` marks it, and your app decides when it is
wrong and passes `error`.

```tsx
<PhoneInput labelPosition="start" required error={isInvalid ? "Ingresa un teléfono válido" : undefined} />
```

## id and name

`id` and `name` go to the number's `<input>`. Without them the id is generated and the number has no
name, as in 2.2.0.

- `id`: a `<label htmlFor>` of your app focuses the number, and the field's own label points at the
  same id. It moves the focus to the first error: `document.getElementById(id)?.focus()`.
- `name`: the number travels in the native form submit and in `FormData`, and `form.elements[name]`
  finds it. The country does not travel: it is in `onValueChange`.

```tsx
<PhoneInput id="whatsapp" name="whatsapp" label="WhatsApp" />
```

## Disabled

`disabled` disables the prefix and the number with the native attribute: they do not open, take no
typing and leave the Tab order. An open list closes, and it stays closed when the field is enabled
again. The box carries `data-disabled` and takes its look from the
`--gdy-phone-input-disabled-opacity` and `--gdy-phone-input-disabled-bg` tokens.

```tsx
<PhoneInput disabled={isSaving} value={phone} onValueChange={setPhone} />
```

## Inside a modal

The list scrolls with the mouse wheel and with a finger inside any modal that locks the page scroll:
Radix `Dialog`, `AlertDialog` and `Sheet` (shadcn's included), or `react-remove-scroll`. Nothing to
set up. Those locks cancel the wheel and touch moves that start outside the dialog, and the panel
renders in a portal under `<body>`, so it keeps its own: the wheel and touch moves that start over the
open panel stop there and do not reach `document`. A `wheel` or `touchmove` listener on `document`,
or a React `onWheel`/`onTouchMove` on an ancestor, does not receive them.

## Inside the auth forms

A `tel` field of `LoginForm` or `SignUpForm` renders this same control, with the form's own label,
error and input tokens, and emits `{ country, number }`. See
[auth-forms.md](auth-forms.md#extra-fields).

## Keyboard and accessibility

The prefix is a `<button role="combobox">` named after the chosen country, "Prefijo: Canadá +1",
because the dial code alone does not tell countries apart. It opens a dialog with a search box and
the list, following the [WAI-ARIA combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/).
The number carries the label, `aria-required`, `aria-invalid` and the error as its description.

| Key | Action |
|---|---|
| Tab / Shift+Tab | Goes from the prefix to the number and back. |
| Enter or Space, on the prefix | Opens the list and moves the focus to the search box. |
| Typing | Filters the list. The first match becomes the active option. |
| ↓ / ↑, Home / End | Move through the options. |
| Enter | Picks the active country, closes the list and returns the focus to the prefix. |
| Escape | Closes the list and returns the focus to the prefix. |

## Styling

Tokens and light/dark themes are covered in [theming.md](theming.md), and every hook, state
selector and token is listed in [style-hooks.md](style-hooks.md#phone-input). The field is one
piece: the box draws the border, the background and the focus, and the prefix and the number
stretch to its height with no line or background between them, only the space and the arrow. The
focus is an inset ring over the whole box and the border never changes its width, so focusing a
part never moves anything. The number shrinks with the box and never spills past its edge.

| Part | Hook | `classNames` slot |
|---|---|---|
| Frame that holds the width | `gdy-phone-input-frame` | — |
| Field box (the root, anchor of the list) | `gdy-phone-input` | `root` |
| Prefix (`<button role="combobox">`) | `gdy-phone-input-prefix` | `prefix` |
| Dial code or placeholder | `gdy-phone-input-dial-code` | — |
| Arrow | `gdy-phone-input-chevron` | — |
| Number (`<input type="tel">`) | `gdy-phone-input-number` | `number` |
| Floating panel (`role="dialog"`) | `gdy-phone-input-panel` | `panel` |

`className` goes on the root, next to `classNames.root`. The rest comes from shared hooks: the
label, the "*" and the error are `gdy-field-label`, `gdy-field-required` and `gdy-field-error`; the
flags, `gdy-country-flag`; and the list, `gdy-listbox-*`.

| Element | State attribute | Values |
|---|---|---|
| `gdy-phone-input` | `data-invalid` | present with an error |
| `gdy-phone-input` | `data-disabled` | present with `disabled` |
| `gdy-phone-input-prefix` | `aria-expanded` | `"true"` while the list is open |
| `gdy-phone-input-dial-code` | `data-placeholder` | present while no country is chosen |

| Token | Default | Use |
|---|---|---|
| `--gdy-phone-input-width` | `280px` | Field width. The `width` prop writes it. |
| `--gdy-phone-input-height` | `--gdy-field-control-height` (40px) | Box height. |
| `--gdy-phone-input-gap` | `8px` | Space between the prefix and the number. |
| `--gdy-phone-input-border` | `--gdy-input` | Box border. |
| `--gdy-phone-input-radius` | `--gdy-radius` | Box radius. |
| `--gdy-phone-input-bg` / `--gdy-phone-input-color` | `--gdy-background` / `--gdy-foreground` | Box background and text. |
| `--gdy-phone-input-focus-ring` | `--gdy-ring` | Border and inset ring on focus. |
| `--gdy-phone-input-error-color` | `--gdy-destructive` | Border with an error. |
| `--gdy-phone-input-disabled-opacity` | `0.5` | Opacity of the disabled box. |
| `--gdy-phone-input-disabled-bg` | `--gdy-muted` | Background of the disabled box. |
| `--gdy-phone-input-placeholder-color` | `--gdy-muted-foreground` | "País", the arrow and the number placeholder. |
| `--gdy-phone-input-prefix-focus-color` | `--gdy-ring` | Prefix text while it has the keyboard focus. |
| `--gdy-phone-input-panel-min-width` | `280px` | Smallest list width; it is never narrower than the field. |
| `--gdy-phone-input-option-hover-bg` / `--gdy-phone-input-option-hover-color` | listbox tokens | Active option. |
| `--gdy-phone-input-option-selected-bg`, `--gdy-phone-input-check-color` | listbox tokens | Chosen option and its check. |

```tsx
<div style={{ "--gdy-phone-input-height": "48px", "--gdy-phone-input-radius": "9999px" } as CSSProperties}>
  <PhoneInput label="Celular" />
</div>
```

## Texts

Every text can be replaced through `texts`; `{country}` is filled in at runtime.

| Key | Default | Where |
|---|---|---|
| `countryPlaceholder` | `"País"` | Prefix with no country. |
| `prefixButton` | `"Prefijo: {country}"` | Name of the prefix; `{country}` is the country and its dial code, or the placeholder. |
| `prefixList` | `"Prefijos por país"` | Name of the panel and the list. |
| `searchLabel` | `"Buscar prefijo"` | Name of the search box. |
| `searchPlaceholder` | `"Buscar país o prefijo..."` | Search box placeholder. |
| `noResults` | `"No se encontró el país"` | Empty search. |

The label is the `label` prop, "Teléfono" by default.

## Reference

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `PhoneInputValue` | — | Value, controlled. |
| `defaultValue` | `PhoneInputValue` | — | Initial value, uncontrolled. |
| `defaultCountry` | `CountryCode` | none | Country of an uncontrolled field without `defaultValue`. |
| `onValueChange` | `(value: PhoneInputValue) => void` | — | The country or the number changed. |
| `id` | `string` | generated | Id of the number. |
| `name` | `string` | — | Form name of the number. |
| `disabled` | `boolean` | `false` | Disables the prefix and the number. |
| `numberCharacters` | `"phone" \| "digits"` | `"phone"` | Characters the number keeps. |
| `maxNumberLength` | `number` | no limit | Longest number, after the character rule. |
| `splitPastedDialCode` | `boolean` | `false` | Splits the dial code off a pasted international number. |
| `label` | `ReactNode` | `"Teléfono"` | Visible label. |
| `aria-label` / `aria-labelledby` | `string` | — | Name without a visible label. Each excludes the others. |
| `labelPosition` | `"top" \| "start"` | `"top"` | Label above or beside the field. |
| `required` | `boolean` | `false` | "*" and `aria-required`. |
| `error` | `ReactNode` | — | Your error, under the field. |
| `placeholder` | `string` | — | Placeholder of the number. |
| `width` | `number \| string` | `--gdy-phone-input-width` (280px) | Field width; a number means pixels. Never wider than the container. |
| `locale` | `string` | `"es"` | Language of the country names and their order. |
| `showFlags` | `boolean` | `true` | Flags in the prefix and the list. |
| `flagUrl` | `FlagUrlResolver` | flagcdn.com | Builds the URL of each flag. |
| `thinScrollbars` | `boolean` | `true` | Thin scrollbar in the list. |
| `scrollbarColor` | `string` | — | Scrollbar color; falls back to `--gdy-scrollbar-thumb`. |
| `texts` | `Partial<PhoneInputTexts>` | `DEFAULT_PHONE_INPUT_TEXTS` | Replaces the UI texts. |
| `className` | `string` | — | Your class on the root. |
| `classNames` | `PhoneInputClassNames` | — | Your class on each part. |

### Types

- `PhoneInputValue`: `{ country: CountryCode | null; number: string }`.
- `PhoneNumberCharacters`: `"phone" | "digits"`.
- `PhoneInputProps`: `PhoneInputNaming` combined with `PhoneInputSettings` and `labelPosition`,
  `required` and `error`.
- `PhoneInputSettings`: the value, prefix, list and styling props.
- `PhoneInputNaming`: exactly one of `label`, `aria-label` or `aria-labelledby` (or none, for the
  default label).
- `PhoneInputTexts`: the keys in [Texts](#texts), each a `string`.
- `PhoneInputClassNames`: `{ root?; prefix?; number?; panel? }`, each a `string`.
- `CountryCode` and `FlagUrlResolver`: the same types as the country select.

### Values

- `DEFAULT_PHONE_INPUT_TEXTS`: the default texts.
- `DEFAULT_PHONE_INPUT_LABEL`: `"Teléfono"`.

### Errors

- `InvalidMaxNumberLengthError`: `maxNumberLength` is not a whole number from 1.
