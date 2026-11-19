# Countries

[English](countries.md) · [Español](countries.es.md)

`gridory/countries` is the country catalog that `CountrySelect` and `PhoneInput` use: flags, names, dial
codes and the reverse lookup by dial code. It shows countries **outside** the selects (a table, a card, a
filter) without loading them: it imports neither Radix, nor the icons, nor the selects' code, and weighs
about 2.5 KB gzip.

## Contents

- [Import](#import)
- [Flag](#flag)
- [Name and dial code](#name-and-dial-code)
- [Finding the country of a dial code](#finding-the-country-of-a-dial-code)
- [Shared dial codes](#shared-dial-codes)
- [Examples](#examples)
- [Reference](#reference)

## Import

```ts
import { CountryFlag, findCountryByDialCode, getCountryName, getDialCode } from "gridory/countries";
```

The flag uses the `gdy-country-flag` class, shipped in `gridory/base.css` (or `gridory/styles.css`): no
select stylesheet is needed. Without styles it looks the same, at 20 × 15, without the outline and the
radius.

## Flag

```tsx
<CountryFlag code="PE" />                          // alt="": next to the name it is decoration
<CountryFlag code="PE" label="Perú" />             // on its own, with alternative text
<CountryFlag code="PE" flagUrl={resolveOwnFlagUrl} className="my-flag" />
```

By default the image comes from [flagcdn.com](https://flagcdn.com) at 20 px, with a 40 px version for
`2x` screens, and loads lazily. `flagUrl` is the same `FlagUrlResolver` the selects take.

## Name and dial code

```ts
getCountryName("PE");        // "Perú": Spanish by default, from Intl.DisplayNames
getCountryName("PE", "en");  // "Peru"
getDialCode("PE");           // "+51"
getDialCode("BV");           // undefined: Bouvet Island, HM and TF have no dial code
listCountries("es");         // the 249 countries { code, name, dialCode? }, sorted by name
```

Names come from the browser; for a code it does not know, `getCountryName` returns the code.
`listCountries` returns the same array on every call for one locale: use it for your own filters.
`isCountryCode` is here too, to check codes that come from your database.

## Finding the country of a dial code

`findCountryByDialCode` takes the dial code with or without `+` and with spaces: `"+51"`, `"51"` and
`" + 51 "` return `"PE"`. A dial code that does not exist, or is not a number, returns `undefined`.

## Shared dial codes

Fourteen dial codes are shared by several countries. For them `findCountryByDialCode` always returns
**the most populous country or territory among those that share it**. The table is written by hand, not
computed: the answer never changes between versions or browsers.

| Dial code | Returns | Also used by |
|---|---|---|
| +1 | US | 25 more: CA, PR, DO, JM, … |
| +7 | RU | KZ |
| +39 | IT | VA |
| +44 | GB | GG, IM, JE |
| +47 | NO | SJ |
| +61 | AU | CC, CX |
| +64 | NZ | PN |
| +212 | MA | EH |
| +262 | RE | YT |
| +358 | FI | AX |
| +500 | FK | GS |
| +590 | GP | BL, MF |
| +599 | CW | BQ |
| +672 | NF | AQ |

So if your system stores the dial code instead of the country, a `+1` always comes back as the United
States: store the country code if you need to tell Canada apart.

## Examples

**A table with flag and name**, without loading the select:

```tsx
import { CountryFlag, getCountryName, isCountryCode } from "gridory/countries";

const CountryCell = ({ code }: { code: string }) => {
  if (!isCountryCode(code)) return <span>{code === "" ? "Not applicable" : code}</span>;
  return (
    <span className="country-cell">
      <CountryFlag code={code} />
      {getCountryName(code)}
    </span>
  );
};
```

**A system that stores the dial code (`"+51"`) instead of the country**:

```tsx
import { findCountryByDialCode, getDialCode } from "gridory/countries";
import type { PhoneInputValue } from "gridory/phone-input";

const toPhoneValue = (stored: { dialCode: string; number: string }): PhoneInputValue => ({
  country: findCountryByDialCode(stored.dialCode) ?? null,
  number: stored.number,
});

const toStored = (value: PhoneInputValue) => ({
  dialCode: value.country ? getDialCode(value.country) ?? "" : "",
  number: value.number,
});
```

## Reference

| Symbol | Signature |
|---|---|
| `CountryFlag` | `(props: CountryFlagProps) => JSX.Element` |
| `getCountryName` | `(code: CountryCode, locale?: string) => string` |
| `getDialCode` | `(code: CountryCode) => string \| undefined` |
| `findCountryByDialCode` | `(dialCode: string) => CountryCode \| undefined` |
| `listCountries` | `(locale?: string) => readonly Country[]` |
| `isCountryCode` | `(value: string) => value is CountryCode` |

- `CountryFlagProps`: `{ code: CountryCode; label?: string; flagUrl?: FlagUrlResolver; className?: string }`.
- `Country`: `{ code: CountryCode; name: string; dialCode?: string }`.
- `CountryCode` and `FlagUrlResolver`: the same types as `gridory/country-select`.
