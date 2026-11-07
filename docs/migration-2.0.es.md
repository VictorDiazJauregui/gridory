# Migrar a la 2.0

La 2.0.0 solo cambia lo que lista esta guía. Todo lo demás (marcado, clases, estilos y eventos) es igual que
en la 1.5.0. Cada sección dice a quién afecta, qué cambiar y cómo comprobar que no quedó nada.

## Preset de Tailwind

**A quién afecta:** a las apps que usan el export por defecto de `gridory/tailwind-preset` y escriben sus
utilidades sin prefijo en su propio markup (`bg-primary`, `text-muted-foreground`, `rounded-lg`…). Las apps
que no usan Tailwind, que usan `createGridoryPreset()` o que no usan preset (proyectos shadcn) no cambian nada.

El export por defecto ahora es `createGridoryPreset()`: los mismos colores y radios, bajo el prefijo `gdy`.

```js
// tailwind.config.js: la configuración no cambia
import gridoryPreset from "gridory/tailwind-preset";

export default { presets: [gridoryPreset] };
```

```tsx
// 1.x
<span className="rounded-md bg-muted/40 text-muted-foreground hover:bg-muted">Pendiente</span>
// 2.0
<span className="rounded-gdy-md bg-gdy-muted/40 text-gdy-muted-foreground hover:bg-gdy-muted">Pendiente</span>
```

**Tailwind no avisa** de una clase que ya no genera: simplemente deja de pintarla. Reemplaza cada utilidad
del preset anterior y conserva las variantes (`hover:`, `dark:`) y los modificadores de opacidad (`/40`):

| 1.x | 2.0 |
|---|---|
| `<utilidad>-<color>`, para `background`, `foreground`, `card`, `popover`, `primary`, `secondary`, `muted`, `accent`, `destructive` (y sus `-foreground`), `border`, `input` y `ring` | `<utilidad>-gdy-<color>`: `bg-gdy-card`, `text-gdy-primary-foreground`, `border-gdy-border`, `outline-gdy-ring` |
| `rounded-lg`, `rounded-md`, `rounded-sm` (y `rounded-t-lg`…) | `rounded-gdy-lg`, `rounded-gdy-md`, `rounded-gdy-sm` (y `rounded-t-gdy-lg`…) |

`rounded-lg`, `rounded-md` y `rounded-sm` siguen existiendo sin el preset, con los tamaños propios de
Tailwind: si los dejas, las esquinas cambian unos píxeles en lugar de romperse. Reemplázalos también para
conservar el radio de la librería (`--gdy-radius`).

Para encontrar lo que falta, busca en tu código (agrega las carpetas que lee el `content` de Tailwind):

```bash
grep -rnE "(bg|text|border|ring|outline|fill|stroke|divide|from|via|to)-(background|foreground|card|popover|primary|secondary|muted|accent|destructive|border|input|ring)\b|rounded(-[a-z]{1,2})?-(lg|md|sm)\b" src
```

**Proyectos shadcn:** si tu configuración ya define `primary`, `muted` y el resto, esas utilidades son
tuyas, no del preset; quita el preset, como recomienda la [guía de temas](theming.es.md#preset-de-tailwind),
y no cambia nada.

## Tablas en pantallas angostas

**A quién afecta:** a las tablas con columnas sin `width` o con `rowActions`, sin `responsiveColumns`. Tu código
no tiene que cambiar; lo que cambia es cómo se ve la tabla:

- **La columna de acciones conserva 56 px** (96 px con `rowActions.columnLabel`) en lugar de repartirse el lugar
  que queda con las columnas sin `width`. En una pantalla ancha se angosta y esas columnas se ensanchan.
- **Una columna sin `width` nunca baja de su `minWidth`** (`120` por defecto). En un celular, donde la 1.x
  apretaba esas columnas a unos 25 px y su contenido desaparecía, ahora las filas se desplazan en horizontal dentro
  de la tabla, y la página no.

```tsx
// 1.x, iPhone: País, Estado, Ingresos y Alta medían 25 px cada una
// 2.0, iPhone: 120 px cada una, y las filas se desplazan en horizontal
const columns = [
  { id: "name", header: "Empresa", accessor: (row) => row.name, width: 220 },
  { id: "country", header: "País", accessor: (row) => row.country },
  { id: "notes", header: "Notas", accessor: (row) => row.notes, minWidth: 200 }, // un piso propio
];
```

Al imprimir sin `printMode`, la columna de acciones también conserva sus 56 px en el papel.

Para ocultar columnas en un celular en lugar de desplazarse, usa `responsiveColumns` con `priority` (ya existía
y no cambia). Para conservar la disposición de la 1.x, agrega estas dos reglas después de la hoja de estilos de
la librería:

```css
.gdy-table-grid { min-width: 0; }
.gdy-table-head-cell[data-column-id="_actions"] { width: auto; }
```

Si tus tests comparan el marcado de la tabla, el elemento `table` ahora lleva su ancho mínimo:
`<table class="gdy-table-grid" style="--gdy-table-min-width: 476px;">`.

## Ayuda del encabezado y casilla

**A quién afecta:** a las apps cuyos tests o CSS buscan la envoltura de Radix del tooltip de ayuda del encabezado
(`[data-radix-popper-content-wrapper]`), sus variables `--radix-popper-*` y `--radix-tooltip-*` o los atributos que
escribía Radix. Las demás no cambian nada: el "?" y la casilla de las filas se ven igual, están en el mismo lugar y
responden a las mismas teclas.

El tooltip de ayuda del encabezado ahora es propio de Gridory, y él y la casilla de las filas vienen con la tabla
desde el primer render en lugar de descargarse después. El marcado de la casilla no cambia. El del tooltip abierto,
sí:

```html
<!-- 1.x -->
<div data-radix-popper-content-wrapper style="position: fixed; transform: translate(…); z-index: 60; --radix-popper-…">
  <div data-side="top" data-align="center" data-state="delayed-open" role="tooltip" id="radix-…"
    class="gdy-scope gdy-table-head-tooltip" style="--radix-tooltip-…">Ingresos del último año</div>
</div>
<!-- 2.0 -->
<div role="tooltip" class="gdy-scope gdy-table-head-tooltip" data-side="top" style="position: fixed; top: …; left: …">
  Ingresos del último año
</div>
```

- El tooltip conserva `role="tooltip"`, la clase `gdy-table-head-tooltip` y `data-side` (`top`, o `bottom` cuando no
  entra arriba), y pierde `data-align`, `data-state` y su `id`.
- El "?" (`gdy-table-head-help`) conserva `data-state` (termina en `open` mientras se ve el tooltip), y ya no lleva
  `aria-describedby` ni `data-radix-popper-*` mientras está abierto. Los lectores de pantalla siguen oyendo el
  texto: el encabezado de la columna lo enlaza con `aria-describedby`, como en la 1.5.0.
- Un test puede leer el tooltip con `getByRole("tooltip")` justo después del clic; `findByRole` sigue sirviendo.

```css
/* 1.x */
[data-radix-popper-content-wrapper]:has(.gdy-table-head-tooltip) { z-index: 100 !important; }
/* 2.0: el tooltip se dibuja dentro de <body>, así que el token va donde se hereda */
:root { --gdy-table-tooltip-z: 100; }
```

Para encontrar lo que quede, busca en tus fuentes:

```bash
grep -rnE "data-radix-popper-content-wrapper|--radix-(popper|tooltip)-|gdy-table-head-tooltip\[data-(state|align)" src
```

## Calendario

**A quién afecta:** a las apps que pasan a `calendarLocale` un locale de `react-day-picker/locale`, a las que
importan `date-fns` o `react-day-picker` sin tenerlos en su propio `package.json` y a los tests que buscan los
nombres accesibles del calendario en inglés ("Go to the Previous Month"). Si tu app no pasa nada, o pasa un
locale de `date-fns`, no tienes que cambiar nada.

El calendario del filtro de fecha ahora es propio de Gridory y está hecho con el `Intl.DateTimeFormat` del
navegador en lugar de `react-day-picker` y `date-fns`. Se ve igual al píxel, conserva todas las clases
`gdy-calendar-*` y sus atributos de estado, y también el teclado: flechas, Inicio/Fin, RePág/AvPág y Mayús para
saltar un año entero.

**No se pierde ningún idioma.** `Intl` conoce todos los idiomas que conoce el navegador, así que cualquier
etiqueta BCP 47 funciona sin instalar nada. Un locale de `date-fns` también sigue compilando y funcionando: el
calendario lee su `code` y su `weekStartsOn`. Lo que cambia es esto:

- **El idioma es una etiqueta.** `calendarLocale` ahora es `string | { code?: string; options?: { weekStartsOn?:
  number } }`. Usa `"en-US"` de preferencia; un `enUS` de `date-fns/locale` sigue funcionando.
- **`date-fns` ya no se instala junto con Gridory**, y tampoco `react-day-picker` ni `@date-fns/tz`. Si tu app
  importa alguno, agrégalo a tu propio `package.json` (`npm install date-fns`) o cambia a la etiqueta.
- **Los nombres accesibles son `labels`, en español por defecto.** Un locale de `react-day-picker/locale` ya no
  los traduce. Sin `labels`, un lector de pantalla ahora dice "Mes anterior" en lugar de "Go to the Previous
  Month", igual que el resto de la interfaz en español.

```tsx
// 1.x
import { enUS } from "react-day-picker/locale"; // llegaba instalado con gridory
<DataTable calendarLocale={enUS} … />;           // también traducía "Go to the Previous Month"

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

Las mismas props y claves sirven en `KanbanBoard` y `CardGrid`.

**Si tipas un objeto de labels completo** (`const labels: DataTableLabels = { … }`, o `DataViewLabels`,
`KanbanBoardLabels`, `CardGridLabels`), agrega estas claves: `calendarNavigation`, `calendarPreviousMonth`,
`calendarNextMonth`, `calendarChooseMonth`, `calendarChooseYear` y `calendarToday`. TypeScript te avisa cuáles
faltan. Un objeto parcial en `labels` no necesita nada: las claves que no pases conservan su texto en español.

**Diferencias menores:**

- El nombre accesible de un día ya no termina en ", selected": el `aria-selected` de la celda ya lo indica.
- El primer día de la semana lo da el navegador (`Intl.Locale#getWeekInfo`). Firefox no lo tiene, y ahí una
  etiqueta empieza la semana el lunes; un locale de `date-fns` o `{ code: "en-US", options: { weekStartsOn: 0 } }`
  lo fija en todos los navegadores.

Para encontrar lo que quede, busca en tu código y revisa qué instala tu app por su cuenta:

```bash
grep -rnE "from \"(react-day-picker|date-fns|@date-fns/tz)" src
grep -rnE "Go to the (Previous|Next) Month|Choose the (Month|Year)" src
npm ls date-fns react-day-picker
```

## Selects

**A quién afecta:** a las apps que pasan las claves de opciones de `selectTheme`, dan estilo a la lista abierta
de un select desde su CSS o prueban los selects de la tabla, el kanban, la vista de tarjetas o `SignUpForm`
abriendo la lista. La caja cerrada se ve igual que en la 1.5.0: mismo tamaño, colores, ícono y placeholder, y
`valueHighlights` sigue pintando toda la caja del select de edición en línea.

Todos los selects de la librería (vista de archivados, selector de agrupado, selectores del encabezado, tamaño
de página, edición en línea y el campo `select` de `SignUpForm`) ahora son el `<select>` del navegador. Gridory
da estilo a la caja cerrada; la lista abierta es la del sistema: un menú nativo en el escritorio, una hoja o una
rueda en el celular. Toma sus colores de la caja y sigue el tema oscuro mediante `color-scheme`.

```html
<!-- 1.x -->
<button type="button" role="combobox" class="gdy-select-trigger" aria-label="Agrupar por">
  <span data-slot="select-value">Agrupar por: Estado</span><svg class="gdy-select-icon"></svg>
</button>
<!-- 2.0 -->
<span class="gdy-select">
  <select class="gdy-select-trigger" aria-label="Agrupar por">
    <option value="__gdy_group_none__">Agrupar por: Ninguno</option>
    <option value="status">Agrupar por: Estado</option>
  </select>
  <svg class="gdy-select-icon" aria-hidden="true"></svg>
</span>
```

**Se quitaron de `SelectTheme`**, porque la lista a la que daban estilo ya no existe: `contentBackground`,
`optionText`, `optionHoverBackground`, `optionActiveBackground`, `contentClassName` e `itemClassName`.
TypeScript los marca; bórralos. `background`, `hoverBackground`, `border`, `text`, `radius` y `triggerClassName`
funcionan como antes.

**Se quitaron de la hoja de estilos:** las clases `gdy-select-content`, `gdy-select-viewport`, `gdy-select-item`
(y sus `-indicator`, `-check` y `-text`), `gdy-select-scroll-button`, `gdy-select-scroll-icon` y
`gdy-select-value`, y los tokens `--gdy-select-content-bg`, `--gdy-select-content-text`,
`--gdy-select-item-text`, `--gdy-select-item-hover-bg`, `--gdy-select-item-hover-text` y
`--gdy-select-item-active-bg`. Una regla sobre ellos ya no coincide con nada. Tampoco
`.gdy-select-trigger[data-state="open"]`: un select nativo no tiene estado abierto.

**Tests:** elige una opción con `user.selectOptions` en lugar de abrir la lista y hacer clic en la opción, y lee
la opción elegida con `toHaveDisplayValue`. Las opciones están siempre en el DOM, dentro del select.

```tsx
const groupBy = screen.getByRole("combobox", { name: "Agrupar por" });
// 1.x
await user.click(groupBy);
await user.click(await screen.findByRole("option", { name: "Agrupar por: Estado" }));
expect(groupBy).toHaveTextContent("Agrupar por: Estado");
// 2.0
await user.selectOptions(groupBy, "Agrupar por: Estado");
expect(groupBy).toHaveDisplayValue("Agrupar por: Estado");
```

`toHaveTextContent` sobre un select sigue pasando, pero contra el texto de todas las opciones, así que ya no
prueba cuál está elegida. Si tus tests comparan el marcado, cada select ahora se ve como el ejemplo 2.0 de
arriba, y los ids de Radix de los demás menús se corren porque los selects ya no toman uno.

Para encontrar lo que quede, busca en tus fuentes:

```bash
grep -rnE "contentBackground|optionText|optionHoverBackground|optionActiveBackground|contentClassName|itemClassName|gdy-select-(content|viewport|item|scroll|value)|--gdy-select-(content|item)" src
```
