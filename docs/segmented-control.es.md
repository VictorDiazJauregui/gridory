# Control segmentado

[English](segmented-control.md) · [Español](segmented-control.es.md)

`SegmentedControl` alterna entre unas pocas vistas excluyentes, como "Mes · Semana · Día". Funciona
como un grupo de radio: un solo tab stop, las flechas mueven y eligen, y un indicador se desliza
hasta la opción elegida. No guarda estado de negocio: emite el cambio y tu app decide qué mostrar.

## Contenido

- [Import](#import)
- [Ejemplo rápido](#ejemplo-rápido)
- [Opciones y valor](#opciones-y-valor)
- [Iconos](#iconos)
- [Eventos](#eventos)
- [Teclado y accesibilidad](#teclado-y-accesibilidad)
- [Estilos](#estilos)
- [Animación](#animación)
- [Contenedores angostos](#contenedores-angostos)
- [Referencia](#referencia)

## Import

```ts
import { SegmentedControl } from "gridory/segmented-control";
```

Importa `gridory/styles.css` una vez en tu app, antes de cualquier override (ver
[theming.es.md](theming.es.md)). La entrada raíz `gridory` reexporta los mismos nombres.

## Ejemplo rápido

```tsx
import { Briefcase, Layers, User } from "lucide-react";
import { SegmentedControl, type SegmentedOption } from "gridory/segmented-control";

const COMPANY_VIEW_OPTIONS: SegmentedOption[] = [
  { value: "companies", label: "Mis empresas", icon: <Briefcase /> },
  { value: "team", label: "Equipo", icon: <User /> },
  { value: "services", label: "Servicios", icon: <Layers /> },
];

export const CompanyViewSwitch = () => (
  <SegmentedControl
    options={COMPANY_VIEW_OPTIONS}
    defaultValue="companies"
    onValueChange={showCompanyView}
    aria-label="Vista de empresa"
  />
);
```

Los iconos son de `lucide-react`, pero sirve cualquier icono (ver [Iconos](#iconos)). En el
repositorio de la librería, `npm run dev` sirve todos los ejemplos de esta página en
`/mocks/controls`, junto a un registro de eventos.

## Opciones y valor

Cada opción tiene un `value`, que es lo que informa `onValueChange`, y un `label`, que es el texto
visible y el nombre que anuncian los lectores de pantalla.

- **Controlado.** Pasa `value` y actualízalo en `onValueChange`. El control muestra el valor que le
  pasas: hasta que lo actualices, la opción elegida no cambia.
- **No controlado.** Pasa `defaultValue`. El control guarda la opción elegida por su cuenta y
  igual informa cada cambio con `onValueChange`.

```tsx
import { useState } from "react";
import { SegmentedControl, type SegmentedOption } from "gridory/segmented-control";

const CALENDAR_VIEW_OPTIONS: SegmentedOption[] = [
  { value: "month", label: "Mes" },
  { value: "week", label: "Semana" },
  { value: "day", label: "Día" },
  { value: "assigned", label: "Designados" },
];

export const CalendarViewSwitch = () => {
  const [view, setView] = useState("month");
  return (
    <SegmentedControl
      options={CALENDAR_VIEW_OPTIONS}
      value={view}
      onValueChange={setView}
      aria-label="Vista del calendario"
    />
  );
};
```

Si el valor no coincide con ninguna opción, ninguna queda marcada y no hay indicador. El tab stop
cae en la primera opción, así el grupo sigue siendo alcanzable con el teclado.

## Iconos

`icon` acepta cualquier `ReactNode`: un icono de `lucide-react` como en los ejemplos, el componente
de otra librería o tu propio SVG. El icono es decorativo: lleva `aria-hidden` y la opción se nombra
por su `label`, que es obligatorio aunque haya icono.

`iconPosition` pone el icono de todas las opciones antes del label (`"start"`, por defecto) o
después (`"end"`):

```tsx
<SegmentedControl
  options={COMPANY_VIEW_OPTIONS}
  defaultValue="companies"
  iconPosition="end"
  aria-label="Vista de empresa"
/>
```

El icono se mide en `em` (`--gdy-segmented-icon-size`, 1.077em: 14 px junto a texto de 13 px), así
acompaña al texto cuando cambias `--gdy-segmented-font-size`. `--gdy-segmented-icon-gap` fija el
espacio entre el icono y el label.

## Eventos

| Callback | Firma | Se dispara |
|---|---|---|
| `onValueChange` | `(value: string) => void` | Cuando cambia la opción elegida, con un clic o con el teclado. |

Elegir la opción que ya está elegida no lo dispara. Las flechas, Inicio y Fin eligen a medida que
mueven, como en un grupo de radio nativo, así que `onValueChange` se dispara en cada paso: ir de
"Mes" a "Día" con → dos veces informa `"week"` y después `"day"`.

El control nunca cambia tus datos: informa el valor nuevo y tu app decide qué mostrar.

## Teclado y accesibilidad

El teclado sigue el [patrón de grupo de radio de WAI-ARIA](https://www.w3.org/WAI/ARIA/apg/patterns/radio/):

| Tecla | Acción |
|---|---|
| Tab / Shift+Tab | Entra al grupo una sola vez, en la opción elegida (en la primera si no hay ninguna elegida). La siguiente pulsación sale del grupo. |
| ← o ↑ | Va a la opción anterior y la elige. Desde la primera, pasa a la última. |
| → o ↓ | Va a la opción siguiente y la elige. Desde la última, pasa a la primera. |
| Inicio | Va a la primera opción y la elige. |
| Fin | Va a la última opción y la elige. |

- La raíz tiene `role="radiogroup"` y necesita un nombre: pasa `aria-label` o `aria-labelledby`.
  Los tipos exigen exactamente uno de los dos, así que no compila si falta el nombre o si pasas
  los dos.
- Cada opción es un `<button role="radio">` con `aria-checked`, nombrado por su label. El icono
  lleva `aria-hidden`.
- El anillo de foco se dibuja por dentro de la opción (`box-shadow: inset`, en
  `--gdy-segmented-focus-ring`). No hay anillo exterior y la caja no crece, así que nada se mueve y
  la pista nunca lo recorta. Queda un `outline` transparente para el modo de alto contraste
  (`forced-colors`), que lo pinta visible.

Para nombrar el grupo con un título visible, apunta `aria-labelledby` a él:

```tsx
<h3 id="calendar-view-title">Vista del calendario</h3>
<SegmentedControl
  options={CALENDAR_VIEW_OPTIONS}
  defaultValue="month"
  aria-labelledby="calendar-view-title"
/>
```

## Estilos

Los tokens y el tema claro/oscuro están en [theming.es.md](theming.es.md), y cada gancho, selector
de estado y token figura en [style-hooks.es.md](style-hooks.es.md#control-segmentado). El control
sigue el tema que pones en `<html>` (`.dark` o `data-theme="dark"`).

`className` va en la raíz y `classNames` agrega tu clase a cada parte, junto a su gancho:

| Parte | Gancho | Slot de `classNames` |
|---|---|---|
| Pista (la raíz, `role="radiogroup"`) | `gdy-segmented` | `root` |
| Indicador que se desliza | `gdy-segmented-indicator` | `indicator` |
| Cada opción (`<button role="radio">`) | `gdy-segmented-item` | `item` |
| Icono de una opción | `gdy-segmented-icon` | `icon` |
| Label de una opción | `gdy-segmented-label` | `label` |

| Elemento | Atributo de estado | Valores |
|---|---|---|
| `gdy-segmented` | `data-animated` | `"true"`, `"false"` (sigue a `animated`) |
| `gdy-segmented-item` | `aria-checked` | `"true"` en la opción elegida, `"false"` en las demás |

Un estado pesa dos clases (0-2-0), así que gana a una clase suelta que pases por `classNames`. Para
darle estilo a la opción elegida, escribe su selector de estado:

```css
.gdy-segmented-item[aria-checked="true"] {
  font-weight: 600;
}
```

La librería no define los tokens de componente: cada uno se lee con un fallback, así que defines
solo los que necesitas, en cualquier ancestro: `:root` para toda la app, `.dark` para el tema oscuro
o un contenedor para una sola pantalla.

| Token | Fallback | Lo usa |
|---|---|---|
| `--gdy-segmented-bg` | `--gdy-muted` | Fondo de la pista. |
| `--gdy-segmented-border` | `--gdy-border` | Borde de la pista. |
| `--gdy-segmented-radius` | `9px` | Esquinas de la pista. |
| `--gdy-segmented-padding` | `4px` | Aire entre la pista y las opciones. |
| `--gdy-segmented-gap` | `4px` | Separación entre opciones. |
| `--gdy-segmented-font-size` | `0.8125rem` (13 px) | Texto. |
| `--gdy-segmented-item-padding` | `4px 12px` | Aire de cada opción. |
| `--gdy-segmented-item-radius` | `7px` | Esquinas de las opciones y del indicador. |
| `--gdy-segmented-item-color` | `--gdy-muted-foreground` | Texto de la opción en reposo. |
| `--gdy-segmented-item-hover-bg` | `--gdy-foreground` al 6% | Fondo sutil de la opción con el mouse encima. |
| `--gdy-segmented-item-hover-color` | `--gdy-foreground` | Texto de la opción con el mouse encima. |
| `--gdy-segmented-item-active-color` | `--gdy-foreground` | Texto de la opción elegida. |
| `--gdy-segmented-indicator-bg` | `--gdy-background` | Fondo del indicador. |
| `--gdy-segmented-indicator-shadow` | `--gdy-shadow-sm` | Sombra del indicador. |
| `--gdy-segmented-icon-size` | `1.077em` (14 px junto a texto de 13 px) | Icono, en `em` para acompañar al texto. |
| `--gdy-segmented-icon-gap` | `6px` | Espacio entre icono y label. |
| `--gdy-segmented-focus-ring` | `--gdy-ring` | Anillo de foco interior. |
| `--gdy-segmented-duration` | `220ms` | Duración del deslizamiento del indicador. |

El componente escribe en línea `--gdy-segmented-indicator-x`, `-y`, `-width` y `-height` para
ubicar el indicador. No son tokens: no los definas.

Con los tokens alcanza para un aspecto distinto. Esta versión en forma de píldora los define en un
contenedor, y como sus colores apuntan a tokens base, sigue el tema claro y el oscuro sin declarar
nada más:

```css
.pill-segmented {
  --gdy-segmented-radius: 9999px;
  --gdy-segmented-item-radius: 9999px;
  --gdy-segmented-indicator-bg: var(--gdy-primary);
  --gdy-segmented-item-active-color: var(--gdy-primary-foreground);
  --gdy-segmented-font-size: 0.9375rem;
}
```

```tsx
<div className="pill-segmented">
  <SegmentedControl
    options={COMPANY_VIEW_OPTIONS}
    defaultValue="companies"
    aria-label="Vista de empresa"
  />
</div>
```

## Animación

El indicador se desliza hasta la opción elegida en 220 ms. Solo se anima lo que cambia después del
primer render: al cargar, el indicador ya está en su lugar en vez de entrar deslizándose desde la
izquierda. También sigue a su opción cuando cambia el tamaño de letra o el ancho.

Hay dos formas de apagar el deslizamiento, y en las dos el cambio es instantáneo:

- **`animated={false}`**, para un control. La raíz lleva `data-animated="false"`.
- **`prefers-reduced-motion: reduce`**, que el usuario activa en su sistema operativo. No necesita
  ninguna prop: el deslizamiento vive en la hoja de animaciones de la librería junto a las demás,
  detrás de `prefers-reduced-motion: no-preference` (ver
  [theming.es.md](theming.es.md#animaciones)).

```tsx
<SegmentedControl
  options={CALENDAR_VIEW_OPTIONS}
  defaultValue="month"
  animated={false}
  aria-label="Vista del calendario"
/>
```

`--gdy-segmented-duration` cambia la duración, para toda la app o para un contenedor:

```css
:root {
  --gdy-segmented-duration: 150ms;
}
```

## Contenedores angostos

La pista nunca es más ancha que su contenedor (`max-width: 100%`). Cuando las opciones no entran,
la pista tiene su propio scroll horizontal, con una barra fina: los labels no se parten y la página
no scrollea de costado. Al elegir una opción con el teclado, se trae a la vista.

## Referencia

| Prop | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `options` | `SegmentedOption[]` | obligatoria | Las opciones, en el orden en que se muestran. |
| `value` | `string` | — | Valor elegido, controlado. |
| `defaultValue` | `string` | — | Valor inicial, no controlado. |
| `onValueChange` | `(value: string) => void` | — | Cambió la opción elegida, con un clic o con el teclado. |
| `iconPosition` | `SegmentedIconPosition` | `"start"` | Lado del label en el que van los iconos. |
| `animated` | `boolean` | `true` | Desliza el indicador. `prefers-reduced-motion: reduce` también lo apaga. |
| `aria-label` | `string` | obligatoria, o `aria-labelledby` | Nombre accesible del grupo. |
| `aria-labelledby` | `string` | obligatoria, o `aria-label` | Id del elemento que nombra al grupo. |
| `className` | `string` | — | Tu clase en la raíz. |
| `classNames` | `SegmentedControlClassNames` | — | Tu clase en cada parte. |

### Tipos

- `SegmentedControlProps`: las props de arriba. `aria-label` y `aria-labelledby` son excluyentes.
- `SegmentedOption`: `{ value: string; label: string; icon?: ReactNode }`.
- `SegmentedIconPosition`: `"start" | "end"`.
- `SegmentedControlClassNames`: `{ root?; indicator?; item?; icon?; label? }`, cada uno un `string`.
