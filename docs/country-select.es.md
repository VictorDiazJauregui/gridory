# Selector de país

[English](country-select.md) · [Español](country-select.es.md)

`CountrySelect` elige un país, o varios, de una lista con búsqueda y banderas. No guarda estado de
negocio: emite el código ISO y tu app decide qué hacer con él.

## Contenido

- [Import](#import)
- [Ejemplo rápido](#ejemplo-rápido)
- [Selección simple](#selección-simple)
- [Selección múltiple](#selección-múltiple)
- [Obligatorio y errores](#obligatorio-y-errores)
- [Ancho y contenedores angostos](#ancho-y-contenedores-angostos)
- [Banderas y nombres de países](#banderas-y-nombres-de-países)
- [Eventos](#eventos)
- [Teclado y accesibilidad](#teclado-y-accesibilidad)
- [Estilos](#estilos)
- [Textos](#textos)
- [Referencia](#referencia)

## Import

```ts
import { CountrySelect } from "gridory/country-select";
```

Importa `gridory/styles.css` una vez en tu app, antes de cualquier override (ver
[theming.es.md](theming.es.md)). La entrada raíz `gridory` reexporta los mismos nombres.

## Ejemplo rápido

```tsx
import { CountrySelect } from "gridory/country-select";

export const ResidenceCountry = () => <CountrySelect onValueChange={saveResidenceCountry} />;
```

Eso muestra el label "País", el placeholder "Selecciona un país" y una lista con los 249 países de
ISO 3166-1, con sus nombres en español y sus banderas. Elegir Perú informa `"PE"`. El label y todos
los textos se pueden reemplazar (ver [Textos](#textos)). En el repositorio de la librería,
`npm run dev` sirve todos los ejemplos de esta página en `/mocks/controls`, junto a un registro de
eventos.

## Selección simple

Sin `multiple`, el control guarda un solo país. El valor es un `CountryCode`, la unión de los 249
códigos ISO 3166-1 alfa-2 en mayúsculas, o `null` cuando no hay ninguno elegido: `"XX"` o `"pe"` no
compilan.

- **No controlado.** Pasa `defaultValue`, o nada para arrancar vacío. El control guarda el país por
  su cuenta y igual informa cada cambio con `onValueChange`.
- **Controlado.** Pasa `value` y actualízalo en `onValueChange`. El control muestra el valor que le
  pasas: hasta que lo actualices, el país elegido no cambia.

```tsx
import { useState } from "react";
import { CountrySelect, type CountryCode } from "gridory/country-select";

export const BillingCountry = () => {
  const [country, setCountry] = useState<CountryCode | null>("PE");
  return <CountrySelect required value={country} onValueChange={setCountry} />;
};
```

Elegir un país cierra la lista, devuelve el foco al campo y emite el código. Elegir el país que ya
estaba elegido solo cierra la lista: no se emite nada. El campo cerrado muestra la bandera y el
nombre; un nombre largo termina en puntos suspensivos y el `title` del campo lo tiene completo.

Al abrir la lista, el país elegido es la opción activa y la lista se desplaza hasta él, así que
reabrir con Uruguay elegido no arranca en Afganistán.

**La "×" vacía.** Cuando el control no es `required` y hay un país elegido, un botón "×" aparece al
final del campo. Vacía la selección y emite `null`, sin abrir la lista. Un control `required` no
tiene "×".

**Códigos que llegan como texto.** Un valor de tu servidor o de una URL es un `string`.
`isCountryCode` lo acota antes de pasarlo:

```ts
import { isCountryCode, type CountryCode } from "gridory/country-select";

const toCountryCode = (value: string): CountryCode | null => (isCountryCode(value) ? value : null);
```

La comprobación es exacta: los códigos van en mayúsculas, así que `isCountryCode("pe")` es `false`.

## Selección múltiple

`multiple` pasa el control a varios países. El valor pasa a ser `CountryCode[]`, y `minSelected` y
`maxSelected` fijan el rango válido: el mínimo es 1 y el máximo no tiene tope, salvo que pases uno.

```tsx
<CountrySelect
  multiple
  minSelected={1}
  maxSelected={3}
  defaultValue={["PE", "UY"]}
  onValueChange={saveShippingCountries}
/>
```

- **Elegir alterna.** Un clic, o Enter sobre la opción activa, agrega el país o lo quita, y la
  lista **sigue abierta** para elegir más.
- **Orden.** El valor conserva el orden en que se eligieron los países: uno nuevo va al final.
  `onValueChange` recibe un arreglo nuevo cada vez; el que pasaste nunca se muta.
- **En el máximo.** Los países no elegidos quedan deshabilitados (`aria-disabled`): se ven en gris,
  un clic no hace nada y las flechas los saltean. Debajo de la lista, "Alcanzaste el máximo
  permitido (3)" explica el motivo, en una región `role="status"` que anuncian los lectores de pantalla.
  Quitar un país los vuelve a habilitar.
- **Chips.** El campo cerrado muestra un chip por país, en el orden en que se eligieron: bandera,
  nombre y una "×" que quita solo ese país, sin abrir la lista, y devuelve el foco al campo. Un
  nombre largo se corta en `--gdy-country-select-chip-max-width` (8rem) y el `title` del campo tiene
  todos los nombres elegidos completos.
- **"+N".** Los chips van en una sola línea. Los que no entran se esconden y un distintivo "+N" los
  cuenta, con el nombre "2 más" para los lectores de pantalla. La "×" de un chip escondido no se alcanza:
  ese país se quita desde la lista. Cuántos entran se mide con un
  `ResizeObserver`, así la fila acompaña al ancho del contenedor y al tamaño de letra.
- **Vacío.** El campo muestra el placeholder "Selecciona países".

Un clic en cualquier parte del campo, chips incluidos, abre la lista; solo la "×" de un chip no. Con la lista abierta, un
clic en la "×" de un chip cierra la lista y quita ese país.

La forma controlada funciona igual que en la selección simple, con un arreglo:

```tsx
const [countries, setCountries] = useState<CountryCode[]>(["PE", "UY"]);

<CountrySelect multiple maxSelected={3} value={countries} onValueChange={setCountries} />;
```

**Rango inválido.** Un `minSelected` mayor que `maxSelected` es un error de programación: el render
lanza `InvalidSelectionRangeError`, con los dos valores en el mensaje. Otros valores no se validan.

## Obligatorio y errores

`required` suma el "*" rojo al label y `aria-required` al campo y, en la selección simple, quita la
"×".

El control muestra su propio error **al cerrarse la lista**, y al quitar un chip con la lista
cerrada. Nunca interrumpe mientras la persona todavía está eligiendo:

| Caso | Error (clave de `texts`) |
|---|---|
| `required` y nada elegido, en cualquiera de los dos modos | "Selecciona un país" (`required`) |
| `multiple` con menos países que `minSelected`, pero al menos uno | "Selecciona al menos 2 países" (`belowMinimum`) |

Sin `required`, una selección vacía no es error. Con el mínimo por defecto de 1, solo `required`
hace que una selección múltiple vacía sea error. El error aparece la primera vez que la lista
se cierra (o que se quita un chip con la lista cerrada); desde ahí sigue a la selección en vivo, así
que desaparece apenas la selección vuelve a ser válida.

Pasa `error` para mostrar tu propio mensaje, por ejemplo después de enviar o desde tu servidor. Se
muestra debajo del campo y **siempre gana** al error propio del control:

```tsx
<CountrySelect
  required
  value={country}
  onValueChange={setCountry}
  error={serverErrors.country}
/>
```

Cualquiera de los dos errores va debajo del campo, y el combobox recibe `aria-invalid="true"` y un
`aria-describedby` que apunta a él, así el lector de pantalla lo lee cuando el foco vuelve al campo.
El texto del error no es una región viva: un error que aparece sin mover el foco no se anuncia solo.

## Ancho y contenedores angostos

El campo mide 240 px de ancho por defecto. `width` lo cambia: un número se toma en píxeles y un
texto como cualquier longitud CSS. El control lo escribe en línea como `--gdy-country-select-width`
en su raíz.

```tsx
<CountrySelect width={140} defaultValue="CD" />
<CountrySelect width={360} />
<CountrySelect width="100%" />
```

- **Angosto.** En 140 px, "República Democrática del Congo" termina en puntos suspensivos y el
  `title` del campo muestra el nombre completo.
- **Nunca más ancho que su contenedor.** El ancho vive en una grilla de una columna,
  `gdy-country-select-frame`, con la columna en `minmax(0, ancho)`: el campo toma su ancho cuando
  hay lugar y, en una columna más angosta, aun dentro de layouts flex o grid, se achica y trunca en
  lugar de salirse, así la página no scrollea de costado en un teléfono.
- **El panel.** La lista abre en un panel flotante tan ancho como el campo entero, con la "×" y los
  chips incluidos, y nunca más angosto que 240 px (`--gdy-country-select-panel-min-width`). Abre
  debajo del campo y da vuelta hacia arriba cuando no hay lugar, sigue al campo cuando un contenedor
  scrollea y nunca crece más que el alto visible.

## Banderas y nombres de países

**Banderas.** Cada país muestra su bandera en el campo, en los chips y en la lista. Son decorativas
(`alt=""`), porque el nombre siempre va al lado, y cargan en diferido. Por defecto vienen de
[flagcdn.com](https://flagcdn.com), así que tu Content Security Policy tiene que permitirlo en
`img-src`. `flagUrl` recibe un `FlagUrlResolver` que arma la URL a partir del código y del ancho en
píxeles. El control pide 20 px para `src` y 40 px para el `srcSet` `2x`:

```tsx
import { CountrySelect, type FlagUrlResolver } from "gridory/country-select";

const resolveOwnFlagUrl: FlagUrlResolver = (code, width) =>
  `https://cdn.example.com/flags/w${width}/${code.toLowerCase()}.png`;

export const HostedFlagsCountry = () => <CountrySelect flagUrl={resolveOwnFlagUrl} />;
```

`showFlags={false}` las quita de todas partes.

**Nombres de países.** `locale` fija el idioma de los nombres, que salen de `Intl.DisplayNames`, y
su orden alfabético. Por defecto es `"es"`. Los textos de la interfaz van aparte: se cambian con
`texts` (ver [Textos](#textos)).

```tsx
<CountrySelect
  locale="en"
  label="Country"
  texts={ENGLISH_COUNTRY_SELECT_TEXTS}
  onValueChange={saveResidenceCountry}
/>
```

Los nombres dependen de los datos ICU del navegador; todos los navegadores actuales los traen.

**Búsqueda.** El buscador encuentra un país por:

- su nombre, sin importar tildes ni mayúsculas: "peru" encuentra Perú;
- su código ISO exacto: "pe" encuentra Perú;
- el comienzo de su prefijo telefónico: "51" o "+51" encuentra Perú, pero no Portugal (+351). La
  lista no muestra prefijos; la búsqueda los acepta porque la gente los escribe.

## Eventos

| Callback | Firma | Se dispara |
|---|---|---|
| `onValueChange` (simple) | `(value: CountryCode \| null) => void` | Cuando cambia el país elegido. `null` cuando la "×" lo vacía. |
| `onValueChange` (`multiple`) | `(value: CountryCode[]) => void` | Cuando se agrega o se quita un país, desde la lista o desde la "×" de un chip. Un arreglo nuevo, en el orden en que se eligió. |

Solo lo dispara un cambio: elegir el país que ya estaba elegido en la selección simple no lo
dispara, y tampoco un clic en una opción deshabilitada en el máximo.

El control nunca cambia tus datos: informa el valor nuevo y tu app decide qué hacer con él.

## Teclado y accesibilidad

El campo cerrado es un combobox que abre un diálogo con un buscador y la lista, según el
[patrón de combobox de WAI-ARIA](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/):

| Tecla | Acción |
|---|---|
| Tab / Shift+Tab | Llega al campo. En la selección simple sigue la "×"; en la múltiple, la "×" de cada chip visible. |
| Enter o Espacio, en el campo | Abre la lista y lleva el foco al buscador. |
| Escribir | Filtra la lista. La primera coincidencia pasa a ser la opción activa. |
| ↓ / ↑ | Va a la opción siguiente o anterior, salteando las deshabilitadas. Se detiene en los dos extremos. |
| Inicio / Fin | Va a la primera o a la última opción. |
| Enter | Elige la opción activa. En la selección simple cierra la lista; en la múltiple, alterna el país y la lista sigue abierta. |
| Escape | Cierra la lista y devuelve el foco al campo. |
| Tab, en la lista | Cierra la lista y devuelve el foco al campo; el siguiente Tab sigue desde ahí. |

Un clic afuera también cierra la lista. Un clic en el label la abre, porque el label apunta al
combobox.

- **Nombre.** El campo se llama "País" por defecto. `label` lo reemplaza; `aria-label` o
  `aria-labelledby` nombran el campo sin un label visible. Los tipos admiten exactamente uno de los
  tres, así que combinarlos no compila.
- **El campo** es un `<button role="combobox">` con `aria-expanded`, `aria-haspopup="dialog"` y
  `aria-controls`. El label está asociado a él (`for`), y lleva `aria-required`, `aria-invalid` y
  `aria-describedby` cuando corresponden. En la selección múltiple lee un resumen oculto ("Países
  seleccionados: 3"), porque los chips quedan fuera de él.
- **El panel** es un `role="dialog"` con el mismo nombre que el campo. Adentro, el buscador es el
  combobox de la lista: tiene `aria-controls`, `aria-autocomplete="list"` y
  `aria-activedescendant` apuntando a la opción activa, así el foco se queda en el buscador mientras
  las flechas mueven. Se llama "Buscar país".
- **La lista** es un `role="listbox"` (con `aria-multiselectable` en la selección múltiple). Cada
  opción tiene `aria-selected` y un check, y las deshabilitadas `aria-disabled`. Cuando la búsqueda
  no encuentra nada, "No se encontró el país" se anuncia por una región `role="status"`, como el
  aviso de máximo.
- **Ningún botón dentro de otro.** La "×" y los chips son hermanos del combobox, nunca hijos, así
  cada uno es un control propio. La "×" se llama "Quitar selección"; la de un chip, "Quitar Perú";
  el distintivo "+N", "2 más".
- **Foco.** El anillo se dibuja por dentro del campo entero (`box-shadow: inset`, en
  `--gdy-country-select-focus-ring`) cuando el combobox tiene foco visible. La caja no crece, así
  que nada se mueve. Queda un `outline` transparente para el modo de alto contraste
  (`forced-colors`), que lo pinta visible, y ahí los chips conservan su contorno.

Para nombrar el campo con un título visible en lugar del label:

```tsx
<h3 id="shipping-countries-title">Países de envío</h3>
<CountrySelect multiple aria-labelledby="shipping-countries-title" />
```

## Estilos

Los tokens y el tema claro/oscuro están en [theming.es.md](theming.es.md), y cada gancho, selector
de estado y token figura en [style-hooks.es.md](style-hooks.es.md#selector-de-país). El control
sigue el tema que pones en `<html>` (`.dark` o `data-theme="dark"`). Tiene el mismo alto, borde,
radio y fondo que los inputs de los formularios de autenticación, así los dos conviven en un mismo
formulario.

`className` va en la raíz y `classNames` agrega tu clase a cada parte, junto a su gancho:

| Parte | Gancho | Slot de `classNames` |
|---|---|---|
| Marco que guarda el ancho | `gdy-country-select-frame` | — |
| Caja del campo (la raíz, ancla del panel) | `gdy-country-select` | `root` |
| Combobox (`<button role="combobox">`) | `gdy-country-select-trigger` | `trigger` |
| Nombre elegido o placeholder | `gdy-country-select-value` | `value` |
| "×" que vacía la selección simple | `gdy-country-select-clear` | `clear` |
| Flecha | `gdy-country-select-chevron` | — |
| Fila de chips | `gdy-country-select-chips` | `chips` |
| Cada chip | `gdy-country-select-chip` | `chip` |
| Nombre dentro de un chip | `gdy-country-select-chip-label` | — |
| "×" de un chip | `gdy-country-select-chip-remove` | — |
| Distintivo "+N" | `gdy-country-select-more` | — |
| Resumen oculto del combobox, en la selección múltiple | `gdy-country-select-summary` | — |
| Panel flotante (`role="dialog"`) | `gdy-country-select-panel` | `panel` |
| Aviso de máximo (`role="status"`) | `gdy-country-select-status` | — |

La raíz también lleva `gdy-scope`, la clase del reset de la librería (ver
[theming.es.md](theming.es.md#la-hoja-de-estilos)). El resto viene de ganchos compartidos: el label,
el "*" y el error son `gdy-field-label`, `gdy-field-required` y `gdy-field-error`; las banderas,
`gdy-country-flag`; y la lista dentro del panel, `gdy-listbox-search`, `gdy-listbox-options`,
`gdy-listbox-option`, `gdy-listbox-check` y `gdy-listbox-empty`.

| Elemento | Atributo de estado | Valores |
|---|---|---|
| `gdy-country-select` | `data-multiple` | Presente en la selección múltiple: el combobox cubre la caja por detrás de los chips |
| `gdy-country-select-trigger` | `aria-expanded` | `"true"` mientras la lista está abierta (la flecha gira), `"false"` si no |
| `gdy-country-select-trigger` | `aria-invalid` | `"true"` con un error (borde rojo); ausente si no |
| `gdy-country-select-value` | `data-placeholder` | Presente mientras no hay nada elegido |
| `gdy-country-select-chip`, `gdy-country-select-more` | `hidden` | Un chip que no entra; el distintivo "+N" mientras entran todos los chips |
| `gdy-listbox-option` | `aria-selected`, `aria-disabled`, `data-active` | Elegida; deshabilitada en el máximo; activa (teclado o puntero) |

Un estado pesa dos clases (0-2-0), así que gana a una clase suelta que pases por `classNames`. Para
darle estilo a un estado, escribe su selector:

```css
.gdy-country-select-trigger[aria-expanded="true"] {
  font-weight: 500;
}
```

La librería no define los tokens de componente: cada uno se lee con un fallback, así que define
solo los que necesites, en cualquier ancestro: `:root` para toda la app, `.dark` para el tema
oscuro o un contenedor para una sola pantalla. El panel se renderiza en un portal bajo `<body>`, así
que los tokens del panel y de sus opciones (`--gdy-country-select-panel-min-width` y
`--gdy-country-select-option-*`, más `--gdy-country-select-check-color`) solo se aplican desde
`:root` o `.dark`.

| Token | Fallback | Lo usa |
|---|---|---|
| `--gdy-country-select-width` | `240px` | Ancho por defecto del campo. |
| `--gdy-country-select-height` | `--gdy-field-control-height` y después `40px` | Alto del campo. |
| `--gdy-country-select-bg` | `--gdy-background` | Fondo del campo. |
| `--gdy-country-select-border` | `--gdy-input` | Borde del campo. |
| `--gdy-country-select-radius` | `--gdy-radius` | Esquinas del campo. |
| `--gdy-country-select-color` | `--gdy-foreground` | Texto del campo. |
| `--gdy-country-select-placeholder-color` | `--gdy-muted-foreground` | Placeholder y flecha. |
| `--gdy-country-select-hover-bg` | `--gdy-foreground` al 4% (`color-mix`) | Fondo sutil del campo con el mouse encima. |
| `--gdy-country-select-focus-ring` | `--gdy-ring` | Anillo de foco interior. |
| `--gdy-country-select-error-color` | `--gdy-destructive` | Borde con error. |
| `--gdy-country-select-option-hover-bg` | `--gdy-listbox-option-hover-bg`, después `--gdy-option-hover-bg` y después `--gdy-accent` | Opción activa de la lista. |
| `--gdy-country-select-option-hover-color` | `--gdy-listbox-option-hover-text` y después `--gdy-accent-foreground` | Texto de la opción activa. |
| `--gdy-country-select-option-selected-bg` | `--gdy-listbox-option-selected-bg` y después `transparent` | Opción elegida. |
| `--gdy-country-select-check-color` | `--gdy-listbox-check-color` y después `--gdy-primary` | Check de la opción elegida. |
| `--gdy-country-select-panel-min-width` | `240px` | Ancho mínimo del panel. |
| `--gdy-country-select-chip-bg` | `--gdy-muted` | Fondo del chip. |
| `--gdy-country-select-chip-color` | `--gdy-foreground` | Texto del chip. |
| `--gdy-country-select-chip-max-width` | `8rem` | Ancho a partir del cual se trunca el nombre de un chip. |

Los tokens de las opciones caen en los de la lista (`--gdy-listbox-*`), así el selector de país se
puede pintar distinto de otras listas sin declarar tokens de otro componente. Las banderas leen
`--gdy-country-flag-width` (`20px`), `--gdy-country-flag-radius` (`2px`) y
`--gdy-country-flag-outline` (`--gdy-border`), el contorno fino que mantiene visible una bandera
blanca sobre una superficie blanca.

**Barra de scroll.** La lista tiene una barra de scroll fina con el color de
`--gdy-scrollbar-thumb`, como la tabla y el kanban. `thinScrollbars={false}` deja la nativa, y
`scrollbarColor` fija el color para un control.

Con los tokens alcanza para un aspecto distinto. Esta versión los define en el contenedor de un
formulario, y como sus colores apuntan a tokens base, sigue el tema claro y el oscuro sin declarar
nada más:

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

## Textos

Los textos de la interfaz vienen en español por defecto y todos se pueden reemplazar con `texts`;
las claves que no pases conservan su valor por defecto. Los valores por defecto se exportan como
`DEFAULT_COUNTRY_SELECT_TEXTS`. Los marcadores `{…}` se completan al mostrar el texto.

| Clave | Por defecto | Se usa en |
|---|---|---|
| `placeholder` | `"Selecciona un país"` | Campo vacío, selección simple. |
| `multiplePlaceholder` | `"Selecciona países"` | Campo vacío, selección múltiple. |
| `searchLabel` | `"Buscar país"` | Nombre accesible del buscador. |
| `searchPlaceholder` | `"Buscar país..."` | Placeholder del buscador. |
| `noResults` | `"No se encontró el país"` | La búsqueda no encuentra nada. |
| `clearSelection` | `"Quitar selección"` | Nombre de la "×" que vacía la selección simple. |
| `removeCountry` | `"Quitar {country}"` | Nombre de la "×" de un chip. `{country}` es el nombre del país. |
| `moreCountries` | `"{count} más"` | Nombre accesible del distintivo "+N". `{count}` es N. |
| `selectedCountries` | `"Países seleccionados: {count}"` | Resumen oculto del combobox en la selección múltiple. |
| `maxReached` | `"Alcanzaste el máximo permitido ({max})"` | Aviso mientras se está en el máximo. `{max}` es `maxSelected`. |
| `belowMinimum` | `"Selecciona al menos {min} países"` | Error por debajo del mínimo. `{min}` es `minSelected`. |
| `required` | `"Selecciona un país"` | Error de un control `required` que quedó vacío. |

El label "País" no es un texto: es la prop `label`, exportada como `DEFAULT_COUNTRY_SELECT_LABEL`.
El juego completo en inglés, para el ejemplo de
[Banderas y nombres de países](#banderas-y-nombres-de-países):

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

## Referencia

| Prop | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `multiple` | `boolean` | `false` | Pasa a la selección múltiple. Fija el tipo de `value`, `defaultValue` y `onValueChange`. |
| `value` | `CountryCode \| null`; `CountryCode[]` con `multiple` | — | Valor elegido, controlado. |
| `defaultValue` | `CountryCode \| null`; `CountryCode[]` con `multiple` | — | Valor inicial, no controlado. |
| `onValueChange` | `(value: CountryCode \| null) => void`; `(value: CountryCode[]) => void` con `multiple` | — | Cambió el valor. |
| `minSelected` | `number` | `1` | Solo con `multiple`. Selección válida más chica. |
| `maxSelected` | `number` | sin tope | Solo con `multiple`. Selección más grande; al llegar, el resto de las opciones se deshabilita. |
| `required` | `boolean` | `false` | Suma el "*" y `aria-required`, quita la "×" y hace que una selección vacía sea error al cerrarse la lista. |
| `error` | `ReactNode` | — | Tu error, debajo del campo. Siempre gana al propio del control. |
| `label` | `ReactNode` | `"País"` | Label visible que nombra al campo. |
| `aria-label` | `string` | — | Nombra el campo sin label visible. Excluye `label` y `aria-labelledby`. |
| `aria-labelledby` | `string` | — | Id del elemento que nombra al campo. Excluye `label` y `aria-label`. |
| `width` | `number \| string` | `--gdy-country-select-width` (240 px) | Ancho del campo; un número son píxeles. Nunca más ancho que el contenedor. |
| `locale` | `string` | `"es"` | Idioma de los nombres de países y de su orden. |
| `showFlags` | `boolean` | `true` | Muestra las banderas en el campo, en los chips y en la lista. |
| `flagUrl` | `FlagUrlResolver` | flagcdn.com | Arma la URL de cada bandera. |
| `thinScrollbars` | `boolean` | `true` | Barra de scroll fina en la lista. |
| `scrollbarColor` | `string` | — | Color de la barra de scroll; si falta, se usa `--gdy-scrollbar-thumb`. |
| `texts` | `Partial<CountrySelectTexts>` | `DEFAULT_COUNTRY_SELECT_TEXTS` | Reemplaza los textos de la interfaz. |
| `className` | `string` | — | Tu clase en la raíz. |
| `classNames` | `CountrySelectClassNames` | — | Tu clase en cada parte. |

### Tipos

- `CountrySelectProps`: las props de arriba, como `CountrySelectNaming` combinado con
  `SingleCountrySelectProps | MultipleCountrySelectProps`.
- `SingleCountrySelectProps`: `multiple?: false`, con `value`, `defaultValue` y `onValueChange`
  sobre `CountryCode | null`.
- `MultipleCountrySelectProps`: `multiple: true`, `minSelected`, `maxSelected`, y `value`,
  `defaultValue` y `onValueChange` sobre `CountryCode[]`.
- `CountrySelectNaming`: exactamente uno de `label`, `aria-label` o `aria-labelledby` (o ninguno,
  para el label por defecto).
- `CountryCode`: la unión de los 249 códigos oficiales ISO 3166-1 alfa-2, en mayúsculas (`"PE"`,
  `"UY"`). Kosovo (`XK`) es un código asignado por usuarios y no está incluido.
- `FlagUrlResolver`: `(code: CountryCode, width: number) => string`.
- `CountrySelectTexts`: las claves de [Textos](#textos), cada una un `string`.
- `CountrySelectClassNames`: `{ root?; trigger?; value?; clear?; chips?; chip?; panel? }`, cada uno
  un `string`.

### Valores y funciones

- `isCountryCode(value: string): value is CountryCode`: `true` cuando `value` es uno de los 249
  códigos, tal como está escrito.
- `DEFAULT_COUNTRY_SELECT_TEXTS`: los textos por defecto.
- `DEFAULT_COUNTRY_SELECT_LABEL`: `"País"`.

### Errores

- `InvalidSelectionRangeError`: se lanza al renderizar cuando `minSelected` es mayor que
  `maxSelected`. Su `name` es `"InvalidSelectionRangeError"` y su mensaje incluye los dos valores.
  Extiende `Error`, así que un error boundary lo atrapa.
