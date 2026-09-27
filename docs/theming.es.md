# Temas y estilos

[English](theming.md) · [Español](theming.es.md)

Esta página explica cómo está construida la hoja de estilos de Gridory y cómo cambiar su aspecto desde tu
app. El catálogo generado [style-hooks.es.md](style-hooks.es.md) lista todas las clases, los selectores de
estado y los tokens.

## La hoja de estilos

Importa la hoja de estilos compilada una sola vez, en la entrada de tu app y antes de tu propio CSS. Los
puntos de entrada de JavaScript no la importan por ti, y un único archivo cubre todos los módulos.

```ts
import "gridory/styles.css";
import "./app.css";
```

El orden importa porque casi todas las reglas de la librería usan una sola clase. Una regla de tu CSS con el
mismo selector, cargada después, gana sin `!important`.

El archivo contiene, en este orden:

1. **Tokens**: las variables CSS base `--gdy-*` de los temas claro y oscuro.
2. **Reset**: un preflight pequeño que solo se aplica dentro de Gridory (se describe más abajo).
3. **Primitivos**: botón, popover, menú desplegable, select, grupo de toggles y calendario.
4. **Capa compartida**: tarjeta, toolbar, botones, inputs, paneles de filtro y barras de scroll.
5. **Animaciones**: las de apertura, cierre y deslizamiento, condicionadas a `prefers-reduced-motion`.
6. **Hojas de los módulos**: el asistente, la tabla, el kanban, los formularios de autenticación, el
   control segmentado, el selector de país y el teléfono con prefijo.

El reset está acotado a la clase `gdy-scope`. Gridory la pone en la tarjeta de la tabla y del kanban, en el
panel del asistente, en su overlay y en su botón de apertura, en la tarjeta de los formularios de
autenticación, en el control segmentado, en el campo del selector de país, en la caja del teléfono con prefijo y en cada menú, select y popover
que renderiza en un portal. El ámbito va envuelto en `:where()`, así que no suma especificidad: las reglas del reset pesan
lo mismo que un selector de elemento simple y cualquier clase de componente las sobrescribe. Aplican
`border-box` como modelo de caja, bordes sólidos de ancho cero con el color `--gdy-border`, márgenes a cero
en encabezados y párrafos, listas y enlaces sin estilos, controles de formulario que heredan la fuente,
botones transparentes con cursor de puntero, elementos multimedia en bloque y bordes de tabla colapsados.

El markup que queda fuera de esas raíces no se toca nunca. El contenido que renderizas dentro de un
componente (la `cell` de una columna, lo que devuelve `renderCard`) queda dentro del ámbito y también recibe
el reset, así que dale estilos propios a las listas y los encabezados que pongas ahí. Gridory no define
ninguna familia tipográfica; los componentes heredan la tuya. La hoja de estilos no usa Tailwind y tu app no
lo necesita. No emite clases utilitarias, ni variables `--tw-*`, ni directivas de Tailwind. El
[preset de Tailwind](#preset-de-tailwind) es opcional.

## Tema claro y oscuro

El tema claro es el predeterminado. El oscuro se aplica bajo cualquier elemento con la clase `dark` o el
atributo `data-theme="dark"`, como en `<html class="dark">`. Pon esa marca en `<html>`. Los menús, los
selects, los popovers y el calendario del selector de fechas se renderizan en portales justo debajo de
`<body>`, así que una clase puesta en un contenedor interior no les llega. Si tu app ya alterna `.dark` en
`<html>` (la convención de shadcn/ui), no tienes que añadir nada.

Gridory no lee `prefers-color-scheme`. Pon la clase tú mismo, a partir de un ajuste del usuario o de la
preferencia del sistema operativo:

```ts
const root = document.documentElement;
root.classList.toggle("dark", window.matchMedia("(prefers-color-scheme: dark)").matches);
export const toggleTheme = () => root.classList.toggle("dark");
```

## Tokens base

Los tokens base contienen toda la paleta. Cada uno lee primero la variable de shadcn/ui con el mismo nombre y
usa el valor de Gridory como fallback: `--gdy-primary: var(--primary, oklch(0.205 0 0))`. Gracias a este
puente, una app que define los tokens de shadcn como colores completos (`oklch(…)`, `hsl(…)`, hex) aplica su
tema a Gridory en claro y en oscuro sin configurar nada. Si tus variables guardan canales sueltos, como
`--primary: 222 47% 11%`, el puente produce un color inválido: en ese caso declara tú los tokens
`--gdy-*`.

La librería declara sus tokens dentro de `:where()`, que tiene especificidad cero. Una regla `:root` o
`.dark` normal en tu CSS siempre gana, sea cual sea el orden de carga:

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

Un valor declarado solo en `:root` también se aplica en el tema oscuro, porque pesa más que el bloque oscuro
de la librería sobre el mismo elemento `<html>`. Declara el valor oscuro en `.dark`, después de la regla
`:root`.

Cada token hace de puente con la variable de shadcn que se llama igual sin la parte `gdy-` (`--gdy-card` lee `--card`):

| Token | Claro | Oscuro |
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
| `--gdy-radius` | `0.625rem` | igual que en claro |

Estos tokens no tienen equivalente en shadcn:

| Token | Claro | Oscuro | Se usa en |
|---|---|---|---|
| `--gdy-link` | `oklch(0.546 0.245 262.881)` | `oklch(0.707 0.165 254.624)` | botones de enlace de los paneles de filtro |
| `--gdy-overlay` | `rgb(0 0 0 / 0.3)` | `rgb(0 0 0 / 0.6)` | fondo detrás del asistente en pantallas pequeñas |
| `--gdy-shadow-sm` | `0 1px 2px rgb(0 0 0 / 0.12)` | `0 1px 2px rgb(0 0 0 / 0.5)` | botón activo del selector de vista, ítem de toggle e indicador del control segmentado |
| `--gdy-shadow-md` | `0 8px 24px rgb(0 0 0 / 0.12)` | `0 8px 24px rgb(0 0 0 / 0.6)` | paneles de filtro, menús, selects y popovers |
| `--gdy-shadow-lg` | `0 25px 50px -12px rgb(0 0 0 / 0.25)` | `0 25px 50px -12px rgb(0 0 0 / 0.6)` | panel del asistente |
| `--gdy-font-mono` | `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace` | igual que en claro | `code`, `kbd`, `samp` y `pre` dentro del ámbito |
| `--gdy-google-blue` / `-green` / `-yellow` / `-red` | `#4285f4` / `#34a853` / `#fbbc05` / `#ea4335` | igual que en claro | Logo de Google en los formularios de autenticación. Las guías de marca de Google prohíben recolorearlo: déjalos como están |

## Tokens de componente

La librería nunca declara los tokens de componente. Sus reglas los leen con un fallback a un token base, como
en `background: var(--gdy-table-head-bg, var(--gdy-muted))`. Como nada los declara, puedes definirlos en
cualquier ancestro: `:root` para toda la app, `.dark` para el tema oscuro o una clase contenedora para una sola
pantalla. Los menús, los selects, los popovers y el calendario se renderizan en portales bajo `<body>`, así
que declara los tokens que les dan estilo (`--gdy-menu-*`, `--gdy-select-*`, `--gdy-popover-*`,
`--gdy-calendar-*`) en `:root` o en `.dark`. Lo mismo vale para el panel del selector de país:
`--gdy-country-select-panel-min-width`, `--gdy-country-select-option-*` y
`--gdy-country-select-check-color`, y para el panel del teléfono: `--gdy-phone-input-panel-min-width`,
`--gdy-phone-input-option-*` y `--gdy-phone-input-check-color`. El cajón móvil del menú lateral y sus
tooltips también son portales: declara los tokens `--gdy-sidebar-*` en `:root` o en `.dark` cuando
tengan que alcanzarlos.

| Familia | Ejemplos (fallback) |
|---|---|
| `--gdy-table-*` | `--gdy-table-head-bg` (`--gdy-muted`), `--gdy-table-border` (`--gdy-border`), `--gdy-table-row-hover-bg` (`--gdy-muted`) |
| `--gdy-kanban-*` | `--gdy-kanban-column-bg` (`--gdy-muted`), `--gdy-kanban-card-bg` (`--gdy-card`), `--gdy-kanban-drop-outline` (`--gdy-muted-foreground`) |
| `--gdy-ai-*` | `--gdy-ai-accent` (`--gdy-primary`), `--gdy-ai-bg` (`--gdy-background`), `--gdy-ai-user-bubble-bg` (`--gdy-ai-accent` y después `--gdy-primary`) |
| `--gdy-auth-*` | `--gdy-auth-bg` (`--gdy-card`), `--gdy-auth-submit-bg` (`--gdy-primary`), `--gdy-auth-input-focus-border` (`--gdy-ring`), `--gdy-auth-rule-met` (`--gdy-success`) |
| `--gdy-segmented-*` | `--gdy-segmented-bg` (`--gdy-muted`), `--gdy-segmented-indicator-bg` (`--gdy-background`), `--gdy-segmented-item-active-color` (`--gdy-foreground`), `--gdy-segmented-focus-ring` (`--gdy-ring`), `--gdy-segmented-duration` (`220ms`) |
| `--gdy-country-select-*` | `--gdy-country-select-width` (`240px`), `--gdy-country-select-border` (`--gdy-input`), `--gdy-country-select-focus-ring` (`--gdy-ring`), `--gdy-country-select-option-hover-bg` (`--gdy-listbox-option-hover-bg` y después `--gdy-accent`), `--gdy-country-select-chip-bg` (`--gdy-muted`) |
| `--gdy-phone-input-*` | `--gdy-phone-input-width` (`280px`), `--gdy-phone-input-height` (`--gdy-field-control-height`, y luego `40px`), `--gdy-phone-input-border` (`--gdy-input`), `--gdy-phone-input-focus-ring` (`--gdy-ring`), `--gdy-phone-input-gap` (`8px`) |
| `--gdy-sidebar-*` | `--gdy-sidebar-width` (`280px`), `--gdy-sidebar-rail-width` (`80px`), `--gdy-sidebar-height` (`100dvh`), `--gdy-sidebar-bg` (`--gdy-card`), `--gdy-sidebar-item-active-bg` (`--gdy-primary`), `--gdy-sidebar-separator-color` (`--gdy-border`), `--gdy-sidebar-duration` (`200ms`) |
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

La lista completa, con todos los fallbacks, está en [style-hooks.es.md](style-hooks.es.md#tokens-de-componente).
Un ejemplo que cambia un token en los dos temas y otro solo en una pantalla:

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

## Sobrescribir por clase

Cada elemento que renderiza la librería lleva una clase `gdy-*` pensada como gancho estable:

- `gdy-<module>-<part>` para las piezas propias de un módulo: `gdy-table-head-cell`, `gdy-kanban-card`.
- `gdy-<part>` para lo que comparten la tabla y el kanban: `gdy-card`, `gdy-toolbar`, `gdy-btn`,
  `gdy-input`, `gdy-panel`, `gdy-option-item`.
- Los primitivos: `gdy-button`, `gdy-select-*` (`trigger`, `content`, `item`), `gdy-menu-*`
  (`content`, `item`, `label`, `separator`), `gdy-popover-content`, `gdy-toggle-*` (`group`,
  `item`) y `gdy-calendar-*` (por ejemplo `gdy-calendar-day` y `gdy-calendar-day-button`).
- `gdy-ai-<part>` para el asistente: `gdy-ai-button`, `gdy-ai-sidebar`, `gdy-ai-bubble`,
  `gdy-ai-action-card`, `gdy-ai-send`.
- `gdy-auth-<part>` para los formularios de autenticación: `gdy-auth`, `gdy-auth-input`,
  `gdy-auth-submit`, `gdy-auth-google`, `gdy-auth-rule`.
- `gdy-segmented-<part>` para el control segmentado: `gdy-segmented` (raíz),
  `gdy-segmented-indicator`, `gdy-segmented-item`, `gdy-segmented-icon`, `gdy-segmented-label`.
- `gdy-country-select-<part>` para el selector de país: `gdy-country-select` (raíz),
  `gdy-country-select-trigger`, `gdy-country-select-value`, `gdy-country-select-chip`,
  `gdy-country-select-panel`. Sus banderas conservan el `gdy-country-flag` compartido.
- `gdy-phone-input-<part>` para el teléfono con prefijo: `gdy-phone-input` (raíz),
  `gdy-phone-input-prefix`, `gdy-phone-input-dial-code`, `gdy-phone-input-number`,
  `gdy-phone-input-panel`. Dentro de los formularios de auth su raíz lleva además `gdy-auth-phone`.
- `gdy-sidebar-<part>` para el menú lateral: `gdy-sidebar-layout`, `gdy-sidebar` (el raíl),
  `gdy-sidebar-panel`, `gdy-sidebar-header`, `gdy-sidebar-content`, `gdy-sidebar-footer`,
  `gdy-sidebar-item`, `gdy-sidebar-separator`, `gdy-sidebar-pin`, y en celular
  `gdy-sidebar-mobile-bar` y `gdy-sidebar-drawer`.

Las reglas de la librería siguen un contrato de especificidad fijo:

| Regla | Ejemplo | Especificidad |
|---|---|---|
| Base | `.gdy-kanban-card` | una clase (0-1-0) |
| Variante (`data-variant`, `data-size`, `data-role`) | `.gdy-button:where([data-variant="outline"])` | una clase (0-1-0) |
| Estado (atributo o pseudoclase) | `.gdy-kanban-card[data-dragging]`, `.gdy-select-trigger:hover` | 0-2-0 |
| Ajuste de un primitivo desde un módulo | `.gdy-select-trigger.gdy-table-inline-select`, `.gdy-button.gdy-ai-send` | dos clases (0-2-0) |
| Clase de la raíz más una clase | `.gdy-thin-scroll .gdy-scroll`, `.gdy-table-sticky .gdy-table-head-cell` | dos clases (0-2-0) |
| Icono dentro de un ítem | `.gdy-menu-item svg`, `.gdy-toggle-item svg` | 0-1-1 |

Una regla con el mismo selector que la de la librería, cargada después de `gridory/styles.css`, reemplaza sus
declaraciones ([style-hooks.es.md](style-hooks.es.md) lista los selectores que admite cada clase). Una sola
clase tuya, cargada después y pasada por `className`, por los nombres de clase de `selectTheme` o por un slot
de `classNames`, gana a las reglas base y a las variantes, pero no a los estados. Para un estado, escribe su
selector. La librería nunca depende del orden de sus propias hojas; cuando un módulo ajusta un primitivo,
añade una segunda clase. Los únicos selectores de etiqueta dan tamaño a los iconos que pasas como `ReactNode`
(los de las acciones de fila, los de las opciones de toggle y los del control segmentado), que llegan sin clase.

Algunas clases no tienen regla por defecto, así que puedes apuntarles sin pelearte con un estilo previo:
`gdy-table-head`, `gdy-table-body`, `gdy-table-group-row`, `gdy-table-empty-row`,
`gdy-toolbar-create`, `gdy-select-value`, `gdy-ai-close`. El catálogo las marca como "solo gancho".
Los primitivos también conservan un atributo `data-slot` como segundo gancho (`data-slot="button"`,
`"select-trigger"`, `"dropdown-menu-item"`, `"popover-content"`, `"calendar"` y otros); la hoja de estilos
no tiene reglas sobre él.

```css
/* app.css, cargado después de gridory/styles.css */
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

## Atributos de estado

Los estados son atributos, nunca clases. Los atributos booleanos están presentes o ausentes: selecciónalos
por su presencia (`[data-dragging]`), no por su valor. El resto toma los valores que se indican.

| Atributo | Clase | Lo pone | Significado |
|---|---|---|---|
| `data-filtered` | `gdy-table-head-trigger`, `gdy-kanban-filter-trigger` | Gridory | la columna o el campo tiene un filtro activo |
| `data-selected`, `data-checked` | `gdy-option-item`, `gdy-option-check` | Gridory | una opción marcada en un filtro por valores |
| `data-dragging`, `data-drop-target` | `gdy-kanban-card`, `gdy-kanban-column` | Gridory | la tarjeta que se arrastra; la columna que tiene debajo |
| `data-clickable` | `gdy-table-row` | Gridory | la tabla tiene `onRowClick` |
| `aria-pressed="true"` | `gdy-view-switch-btn`, `gdy-link-btn` | Gridory | vista activa, orden activo u operador activo en un panel de filtro |
| `aria-expanded` | `gdy-table-group-toggle` | Gridory | `"false"` cuando el grupo está plegado |
| `data-state` | `gdy-menu-content`, `gdy-popover-content`, `gdy-select-*`, `gdy-toggle-item` | Radix | `"open"` o `"closed"` en menú, popover y select; `"checked"` en un ítem de select; `"on"` en un ítem de toggle |
| `data-highlighted` | `gdy-select-item` | Radix | el ítem bajo el puntero o con el foco del teclado |
| `data-disabled` | `gdy-menu-item`, `gdy-select-item`, `gdy-calendar-day` | Radix, react-day-picker | un ítem o un día deshabilitado |
| `data-placeholder` | `gdy-select-trigger` | Radix | no hay ningún valor seleccionado |
| `data-side` | `gdy-menu-content`, `gdy-popover-content`, `gdy-select-content` | Radix | `"top"`, `"right"`, `"bottom"` o `"left"` respecto al ancla |
| `data-today`, `data-outside`, `data-selected` | `gdy-calendar-day` | react-day-picker | hoy, un día de otro mes, un día seleccionado |
| `data-range-start`, `data-range-middle`, `data-range-end` | `gdy-calendar-day`, `gdy-calendar-day-button` | Gridory | posición dentro de un rango seleccionado |
| `data-selected-single` | `gdy-calendar-day-button` | Gridory | un día seleccionado fuera de un rango |
| `data-state` | `gdy-ai-sidebar` | Gridory | `"open"` o `"closed"` |
| `data-empty` | `gdy-ai-body` | Gridory | la conversación no tiene mensajes |
| `data-role` | `gdy-ai-message`, `gdy-ai-bubble` | Gridory | `"user"` o `"assistant"` |
| `data-streaming`, `data-thinking` | `gdy-ai-message` | Gridory | la respuesta que llega en streaming; la fila visible hasta que llega el primer token |
| `data-action-type` | `gdy-ai-action-card` | Gridory | `"create-row"`, `"create-card"`, `"update-row"`, `"move-card"` o `"custom"` |
| `data-list` | `gdy-ai-md-item` | Gridory | `"ordered"` o `"unordered"` |
| `data-form` | `gdy-auth` | Gridory | `"login"` o `"signup"` |
| `aria-invalid`, `aria-required` | `gdy-auth-input`, `gdy-auth-select`, `gdy-auth-checkbox-input` | Gridory | un campo inválido; un campo obligatorio |
| `data-status` | `gdy-auth-rule` | Gridory | requisito de contraseña `"pending"`, `"met"` o `"unmet"` |
| `data-animated` | `gdy-segmented` | Gridory | `"true"` o `"false"`: si el indicador se desliza (la prop `animated`) |
| `aria-checked` | `gdy-segmented-item` | Gridory | `"true"` en la opción elegida, `"false"` en las demás |
| `aria-expanded`, `aria-invalid` | `gdy-country-select-trigger` | Gridory | `"true"` mientras la lista está abierta, `"false"` si no; `"true"` con un error |
| `data-placeholder` | `gdy-country-select-value` | Gridory | no hay ningún país elegido |
| `hidden` | `gdy-country-select-chip`, `gdy-country-select-more` | Gridory | un chip que no entra; el distintivo "+N" mientras entran todos los chips |
| `data-invalid` | `gdy-phone-input` | Gridory | presente con un error |
| `aria-expanded` | `gdy-phone-input-prefix` | Gridory | `"true"` mientras la lista de prefijos está abierta |
| `data-placeholder` | `gdy-phone-input-dial-code` | Gridory | no hay ningún país elegido |
| `data-state` | `gdy-sidebar` | Gridory | `"collapsed"` (raíl de iconos) o `"expanded"` |
| `data-pinned`, `data-hover-expand`, `data-animated` | `gdy-sidebar` | Gridory | `"true"` o `"false"`: fijado, despliegue por hover activo, ancho animado |
| `data-mobile` | `gdy-sidebar-layout` | Gridory | `"true"` por debajo del corte de celular |
| `aria-current` | `gdy-sidebar-item` | Gridory | `"page"` en el ítem activo |

Para dar estilo a un estado, añade el atributo a la clase. La regla pesa 0-2-0, así que también gana a una
clase suelta que pases por una prop:

```css
.gdy-table-head-trigger[data-filtered] {
  font-weight: 600;
}

.gdy-ai-action-card[data-action-type="move-card"] {
  border-style: dashed;
}
```

## Estilos por props

La tabla añade `tableMinHeightClassName`, `tableMaxHeightClassName` y `tableWrapClassName`, en ese orden, a
su contenedor de scroll de filas (`gdy-table-wrap`). El kanban añade `boardMinHeightClassName` y
`boardWrapClassName` al viewport del tablero (`gdy-kanban-board-wrap`). La librería trae utilidades para
estas props:

| Clase | Efecto |
|---|---|
| `gdy-table-min-h-sm`, `gdy-table-min-h-md`, `gdy-table-min-h-lg` | `min-height` de 240px, 360px, 520px |
| `gdy-table-max-h-sm`, `gdy-table-max-h-md`, `gdy-table-max-h-lg` | `max-height` de 320px, 480px, 640px, con `overflow-y: auto` |
| `gdy-kanban-min-h-sm`, `gdy-kanban-min-h-md`, `gdy-kanban-min-h-lg` | `min-height` de 240px, 360px, 520px |

Pasar `tableMaxHeightClassName` da a las filas su propia zona de scroll, y eso también activa el encabezado
sticky (consulta [table.es.md](table.es.md)). Los dos componentes comparten estas props de estilo (las
opciones del select se describen en [toolbar.es.md](toolbar.es.md)):

| Prop | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `selectTheme` | `SelectTheme` | — | Colores, radio y nombres de clase para todos los selects; los colores y el radio se aplican como tokens `--gdy-select-*` sobre el propio select |
| `thinScrollbars` | `boolean` | `true` | Añade `gdy-thin-scroll` a la raíz, así que cada zona `gdy-scroll` recibe una barra de scroll fina |
| `scrollbarColor` | `string` | — | Define `--gdy-scrollbar-thumb` en la raíz; si falta, se usa `--gdy-input` |
| `optionHoverColor` | `string` | — | Define `--gdy-option-hover-bg` en la raíz, el fondo en hover de las opciones de filtro |

El panel del asistente acepta estas (el resto de sus props está en [ai-assistant.es.md](ai-assistant.es.md)):

| Prop | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `className` | `string` | — | Se añade a la raíz del panel, después de `gdy-ai-sidebar` |
| `classNames` | `AIChatClassNames` | — | Una clase por slot; los slots se detallan abajo |
| `width` | `number \| string` | `380` | Ancho del panel, aplicado como estilo inline; un número son píxeles |

Cada slot de `classNames` se añade a un gancho: `root` a `gdy-ai-sidebar` (después de `className`),
`header` a `gdy-ai-header`, `body` a `gdy-ai-body`, `footer` a `gdy-ai-footer`, `inputWrapper` a
`gdy-ai-input-wrapper`, `textarea` a `gdy-ai-textarea`, `chip` a cada mensaje sugerido (`gdy-ai-chip`), y
`userBubble` y `assistantBubble` al `gdy-ai-bubble` de cada rol, incluida la respuesta en streaming.
`AIChatButton` también acepta `className`, que va después de `gdy-ai-button`.

Los formularios de autenticación aceptan `className`, `width` (ancho de la tarjeta, fijado en línea
como `--gdy-auth-width`) y un objeto `classNames` con un slot por parte; ver
[auth-forms.es.md](auth-forms.es.md#estilos).

El control segmentado acepta `className`, en su raíz (`gdy-segmented`), y un objeto `classNames` con
un slot por parte: `root`, `indicator`, `item`, `icon` y `label`; ver
[segmented-control.es.md](segmented-control.es.md#estilos).

El selector de país acepta `className`, en su raíz (`gdy-country-select`), un objeto `classNames` con
los slots `root`, `trigger`, `value`, `clear`, `chips`, `chip` y `panel`, y `width` (ancho del campo,
fijado en línea como `--gdy-country-select-width`; un número son píxeles). Sus `thinScrollbars` (por
defecto `true`) y `scrollbarColor` funcionan como en la tabla y el kanban, sobre la lista de su panel;
ver [country-select.es.md](country-select.es.md#estilos).

El teléfono con prefijo acepta `className`, en su raíz (`gdy-phone-input`), un objeto `classNames` con
los slots `root`, `prefix`, `number` y `panel`, y `width` (fijado en línea como
`--gdy-phone-input-width`). `thinScrollbars` y `scrollbarColor` funcionan como en el selector de país;
ver [phone-input.es.md](phone-input.es.md#estilos).

El menú lateral acepta `className` en `SidebarLayout` y en cada zona, y en `Sidebar` un objeto
`classNames` con los slots `root`, `panel`, `mobileBar` y `drawer`; ver
[sidebar.es.md](sidebar.es.md#estilos).

Los nombres de clase que llegan por props se concatenan tras el gancho tal como vienen. Nada los fusiona ni
quita duplicados, así que una clase que pases nunca elimina una declaración de la librería; solo gana por las
reglas de la cascada que se explican en [Sobrescribir por clase](#sobrescribir-por-clase).

## Animaciones

Las animaciones de apertura, cierre y deslizamiento viven en `@media (prefers-reduced-motion: no-preference)`.
Con `prefers-reduced-motion: reduce` no se ejecuta ninguna.

- El contenido de popovers, menús y selects (incluido el popover del calendario) aparece con un fundido y
  crece desde su ancla al abrirse (`gdy-pop-in`, 150 ms). El atributo `data-side` de Radix fija la
  dirección: la superficie parte 8px desplazada hacia su ancla y se mueve hasta su sitio.
- El contenido de popovers y menús se desvanece al cerrarse (`gdy-pop-out`, 100 ms). El contenido del
  select se desmonta en cuanto se cierra, así que no tiene animación de salida.
- El panel del asistente entra deslizándose desde el borde derecho (una transición de `transform` de 0.3 s).
- El indicador del control segmentado se desliza hasta la opción elegida (220 ms, fijados por
  `--gdy-segmented-duration`). Solo se animan los cambios posteriores al primer render.
  `animated={false}` lo apaga en un control (`data-animated="false"` en `gdy-segmented`); ver
  [segmented-control.es.md](segmented-control.es.md#animación).
- El menú lateral solo cambia su ancho (200 ms, fijados por `--gdy-sidebar-duration`) y desvanece los
  rótulos al mismo ritmo; `animated={false}` en `SidebarLayout` lo apaga. Su cajón móvil entra
  deslizándose desde el borde inicial y el velo aparece con un fundido (`gdy-sidebar-drawer-in`,
  `gdy-fade-in`).

El spinner de "Pensando..." del asistente (`gdy-ai-thinking-icon`, keyframes `gdy-ai-spin`) gira siempre,
porque indica progreso. Para cambiar o desactivar una animación, apunta al mismo selector desde tu CSS (lo
mismo vale para `.gdy-ai-thinking-icon`):

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

## Preset de Tailwind

Gridory no necesita Tailwind. El preset es para apps que usan Tailwind y quieren la paleta de la librería en
su propio markup, por ejemplo dentro de la `cell` de una columna o en lo que devuelve `renderCard`.

```js
// tailwind.config.js
import gridoryPreset from "gridory/tailwind-preset";

export default {
  presets: [gridoryPreset],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
};
```

Asocia a los tokens base las claves de tema al estilo de shadcn: los colores `background`, `foreground`,
`card`, `popover`, `primary`, `secondary`, `muted`, `accent` y `destructive` (cada uno con su tono
`foreground`), `border`, `input` y `ring` (`bg-card`, `text-muted-foreground`, `border-border`,
`outline-ring` y el resto), y los radios `lg` (`var(--gdy-radius)`), `md`
(`calc(var(--gdy-radius) - 2px)`) y `sm` (`calc(var(--gdy-radius) - 4px)`). Las utilidades apuntan a los
tokens, así que siguen el tema claro u oscuro y los tokens que sobrescribas, sin variantes `dark:`. Los
modificadores de opacidad como `bg-primary/10` funcionan: el preset mezcla el token con `color-mix()`. El
preset no añade rutas en `content`; las pone tu propia configuración.

## Auditoría de estilos

El repositorio de la librería comprueba este contrato con `npm run audit:styles`, que lee
`dist/gridory.css` y por eso se ejecuta después de un build. Falla cuando una clase que emite un componente
no tiene regla y no está declarada como gancho, cuando una regla apunta a una clase que ningún componente
emite, cuando un selector de atributo no coincide con nada de lo que escriben los componentes, cuando aparece
un color literal fuera de `src/styles/tokens.css`, cuando queda algún resto de Tailwind o cuando
[style-hooks.es.md](style-hooks.es.md) está desactualizado. `npm run docs:hooks` regenera ese catálogo desde
el código fuente, sin necesidad de build.
