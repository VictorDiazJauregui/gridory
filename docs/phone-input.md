# Phone input

[English](phone-input.md) · [Español](phone-input.es.md)

`PhoneInput` pairs a dial code picker with a number field. It keeps no business state: it emits the
country's ISO code and the number, and your app decides what to do with them.

## Contents

- [Import](#import)
- [Quick example](#quick-example)
- [Value and dial code](#value-and-dial-code)
- [Allowed characters](#allowed-characters)
- [Label, required and errors](#label-required-and-errors)
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
country goes in the prefix, so the browser suggests the national number. It keeps only digits,
spaces, hyphens and `+`. Letters, with or without accents, other symbols and emoji are dropped as
they are typed and when text is pasted: pasting `abc 999-111` leaves ` 999-111`. A change made only
of dropped characters emits nothing.

The field does not validate the length or the format of a number, which change from country to
country: that check belongs to your app.

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
