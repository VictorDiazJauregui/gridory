# Países

[English](countries.md) · [Español](countries.es.md)

`gridory/countries` es el catálogo de países que usan `CountrySelect` y `PhoneInput`: banderas, nombres,
prefijos telefónicos y la búsqueda inversa por prefijo. Sirve para mostrar países **fuera** de los
selectores (una tabla, una ficha, un filtro) sin cargarlos: no importa Radix, ni los íconos, ni el
código de los selectores, y pesa unos 2,5 KB gzip.

## Contenido

- [Import](#import)
- [Bandera](#bandera)
- [Nombre y prefijo](#nombre-y-prefijo)
- [Buscar el país de un prefijo](#buscar-el-país-de-un-prefijo)
- [Prefijos compartidos](#prefijos-compartidos)
- [Ejemplos](#ejemplos)
- [Referencia](#referencia)

## Import

```ts
import { CountryFlag, findCountryByDialCode, getCountryName, getDialCode } from "gridory/countries";
```

La bandera usa la clase `gdy-country-flag`, que viene en `gridory/base.css` (o en `gridory/styles.css`): no
hace falta la hoja de ningún selector. Sin estilos se ve igual, a 20 × 15, sin el borde ni el radio.

## Bandera

```tsx
<CountryFlag code="PE" />                          // alt="": junto al nombre es decoración
<CountryFlag code="PE" label="Perú" />             // sola, con texto alternativo
<CountryFlag code="PE" flagUrl={resolveOwnFlagUrl} className="my-flag" />
```

Por defecto la imagen viene de [flagcdn.com](https://flagcdn.com) a 20 px, con una versión de 40 px para
pantallas `2x`, y carga en diferido. `flagUrl` es el mismo `FlagUrlResolver` de los selectores.

## Nombre y prefijo

```ts
getCountryName("PE");        // "Perú": español por defecto, con Intl.DisplayNames
getCountryName("PE", "en");  // "Peru"
getDialCode("PE");           // "+51"
getDialCode("BV");           // undefined: la isla Bouvet, HM y TF no tienen prefijo
listCountries("es");         // los 249 países { code, name, dialCode? }, ordenados por nombre
```

Los nombres salen del navegador; si no conoce un código, `getCountryName` devuelve el código.
`listCountries` devuelve el mismo arreglo en cada llamada para un mismo idioma: sirve para tus propios
filtros. `isCountryCode` también está acá, para validar códigos que vienen de tu base de datos.

## Buscar el país de un prefijo

`findCountryByDialCode` acepta el prefijo con o sin `+` y con espacios: `"+51"`, `"51"` y `" + 51 "`
devuelven `"PE"`. Un prefijo que no existe, o que no es un número, devuelve `undefined`.

## Prefijos compartidos

Catorce prefijos los comparten varios países. Para ellos `findCountryByDialCode` devuelve siempre **el
país o territorio más poblado de los que lo comparten**. La tabla está escrita a mano, no se calcula:
la respuesta no cambia entre versiones ni navegadores.

| Prefijo | Devuelve | También lo usan |
|---|---|---|
| +1 | US | 25 más: CA, PR, DO, JM, … |
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

Por eso, si tu sistema guarda el prefijo en lugar del país, un `+1` siempre vuelve como EE. UU.: si
necesitas distinguir Canadá, guarda el código del país.

## Ejemplos

**Una tabla con bandera y nombre**, sin cargar el selector:

```tsx
import { CountryFlag, getCountryName, isCountryCode } from "gridory/countries";

const CountryCell = ({ code }: { code: string }) => {
  if (!isCountryCode(code)) return <span>{code === "" ? "No aplica" : code}</span>;
  return (
    <span className="country-cell">
      <CountryFlag code={code} />
      {getCountryName(code)}
    </span>
  );
};
```

**Un sistema que guarda el prefijo (`"+51"`) en lugar del país**:

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

## Referencia

| Símbolo | Firma |
|---|---|
| `CountryFlag` | `(props: CountryFlagProps) => JSX.Element` |
| `getCountryName` | `(code: CountryCode, locale?: string) => string` |
| `getDialCode` | `(code: CountryCode) => string \| undefined` |
| `findCountryByDialCode` | `(dialCode: string) => CountryCode \| undefined` |
| `listCountries` | `(locale?: string) => readonly Country[]` |
| `isCountryCode` | `(value: string) => value is CountryCode` |

- `CountryFlagProps`: `{ code: CountryCode; label?: string; flagUrl?: FlagUrlResolver; className?: string }`.
- `Country`: `{ code: CountryCode; name: string; dialCode?: string }`.
- `CountryCode` y `FlagUrlResolver`: los mismos tipos de `gridory/country-select`.
