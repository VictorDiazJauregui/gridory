# Migrar a la 2.0

La 2.0.0 solo rompe lo que lista esta guía. Todo lo demás (marcado, clases, estilos y eventos) es igual que
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
  apretaba esas columnas a unos 25 px y su contenido desaparecía, ahora las filas se desplazan de costado dentro
  de la tabla, y la página no.

```tsx
// 1.x, iPhone: País, Estado, Ingresos y Alta medían 25 px cada una
// 2.0, iPhone: 120 px cada una, y las filas se desplazan de costado
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
