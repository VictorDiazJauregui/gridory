# KanbanBoard

Componente Kanban reutilizable y migrable del sistema UI.

- Ruta: `src/components/kanban`
- Export principal: `KanbanBoard`
- Archivos: en la raíz `index.tsx` (`KanbanBoard`), `board-view.ts` (defaults y validación de `groups`),
  `types.ts`, `constants.ts` y `styles.css`; el resto se agrupa por área, y cada carpeta reúne los hooks,
  la lógica pura y los componentes de esa parte del tablero: `model/` (`use-kanban-board-state.ts` con
  `use-board-controls.ts`, `use-kanban-cards.ts`, `use-selected-group.ts`, `use-visible-cards.ts`,
  `use-group-columns.ts` y `use-card-drag.ts`; `group-columns.ts` y `card-move.ts`), `toolbar/`
  (`KanbanToolbar.tsx`, `group-select-options.ts`, `KanbanFilterRow.tsx`, `KanbanFilterItem.tsx`,
  `KanbanFilterTrigger.tsx`, `KanbanDateFilterMenu.tsx`, `KanbanValueFilterMenu.tsx`, `filter-item.ts`),
  `board/` (`KanbanBoardBody.tsx`, `KanbanColumns.tsx`, `KanbanColumn.tsx`, `KanbanColumnBody.tsx`,
  `column-settings.ts`, `drag-handlers.ts`) y `card/` (`KanbanCard.tsx`, `KanbanCardContent.tsx`,
  `KanbanCustomCard.tsx`, `DefaultKanbanCard.tsx`, `DefaultKanbanCardHead.tsx`, `DefaultKanbanCardFields.tsx`,
  `KanbanCardMenu.tsx`, `card-summary.ts`)
- Estilos propios: `styles.css` (clases `gdy-kanban-*`); toolbar, filtros, fechas y botones
  vienen de `src/styles/shared.css` y `src/components/shared/toolbar/`, compartidos con la tabla;
  los primitivos (select, menú, popover, calendario, toggle) llevan clases `gdy-*` desde
  `src/components/ui/styles.css`

---

## Qué resuelve

- Visualización por columnas basada en un campo agrupador.
- Búsqueda global de cards por campos configurables.
- Filtros por valores y por fecha con operadores.
- Ordenado asc/desc por campo.
- Drag & drop entre columnas (actualiza el valor del agrupador).
- Acciones por card (editar, archivar, eliminar, historial).
- Card default o render personalizado.
- Scroll vertical por columna.
- Sin paginado (todas las cards visibles, respetando filtros/ordenado).

---

## API (Props)

```ts
interface KanbanBoardProps<TData> {
  fields: ColumnDefinition<TData>[];
  data: DataInput<TData>;
  groups: KanbanGroupOption<TData>[];
  defaultGroupId: string;
  normalizeRow?: (row: unknown, index: number) => TData;
  getCardId: (card: TData, index: number) => string;
  features?: KanbanBoardFeatures;
  rowActions?: RowActions<TData>;
  renderCard?: (
    card: TData,
    context: KanbanCardRenderContext<TData>,
  ) => ReactNode;
  onCardMove?: (event: KanbanMoveEvent<TData>) => void;
  onCardClick?: (event: KanbanCardClickEvent<TData>) => void;
  onGroupChange?: (groupId: string) => void;
  groupSelectorLabel?: string;
  searchPlaceholder?: string;
  createLabel?: string;
  onCreate?: () => void;
  emptyMessage?: string;
  boardWrapClassName?: string;
  boardMinHeightClassName?: string;
  columnBodyMaxHeight?: number;
  archivedView?: ArchivedViewConfig;
  toggleGroups?: ToggleGroupConfig[];
  headerSelectors?: HeaderSelectConfig[];
  toolbarLayout?: ToolbarLayout;
  selectTheme?: SelectTheme;
}
```

> Desde **v1.12.0**, `rowActions` admite `customActions` (acciones de menú
> personalizables) y `menuActions` (menú completamente componible con separadores y
> encabezados); la barra admite `toggleGroups` y `headerSelectors` (con `position`
> configurable) y `toolbarLayout` para componer sus slots; y `selectTheme` tematiza
> globalmente los selectores. Todas son props opcionales y retrocompatibles; ver las
> secciones finales de v1.12.0.

### Props obligatorias

- `fields`
- `data`
- `groups`
- `defaultGroupId`
- `getCardId`

### Validaciones de seguridad internas

- Si `groups` está vacío: el componente lanza error.
- Si `defaultGroupId` no existe en `groups`: el componente lanza error.

---

## Configuración de campos (`fields`)

`fields` controla búsqueda, filtrado y ordenado.

Campos relevantes:

- `id`: identificador del campo.
- `header`: etiqueta visible.
- `accessor`: valor desde la card.
- `type`: `"text" | "number" | "date"`.
- `searchable`: incluye/excluye del buscador global.
- `filterable`: habilita filtro para el campo.
- `sortable`: habilita ordenado asc/desc.

### Búsqueda de cards por campo

La búsqueda global (`search`) solo considera campos con:

- `searchable !== false`

Si quieres excluir un campo del buscador, define:

```ts
searchable: false;
```

---

## Configuración de agrupación (`groups`)

```ts
interface KanbanGroupOption<TData> {
  id: string;
  label: string;
  accessor: (card: TData) => Primitive | Primitive[];
  setValue: (card: TData, nextValue: string) => TData;
  values?: FilterOption[];
}
```

### Descripción

- `id`: key de la agrupación.
- `label`: etiqueta en selector.
- `accessor`: obtiene el valor actual de agrupación de la card.
- `setValue`: define cómo actualizar la card al moverla de columna.
- `values` (opcional): columnas fijas y ordenadas manualmente.

Si `values` no existe, las columnas se calculan desde los valores presentes en los datos.

---

## Features opcionales (on/off)

```ts
interface KanbanBoardFeatures {
  search?: boolean;
  sorting?: boolean;
  filtering?: boolean;
  createButton?: boolean;
  rowActions?: boolean;
  groupSelector?: boolean;
  dragAndDrop?: boolean;
}
```

Valores default:

```ts
{
  search: true,
  sorting: true,
  filtering: true,
  createButton: true,
  rowActions: true,
  groupSelector: true,
  dragAndDrop: true
}
```

Ejemplo:

```tsx
features={{
  search: true,
  filtering: true,
  sorting: true,
  createButton: false,
  rowActions: true,
  groupSelector: true,
  dragAndDrop: false,
}}
```

---

## Filtros soportados

### 1) Filtro por valores (campos no fecha)

- Selección múltiple de valores.
- Búsqueda dentro de opciones.
- Ordenado asc/desc desde el mismo menú (si `sorting` y `sortable` están activos).

### 2) Filtro por fecha (`type: "date"`)

Operadores:

- `gt`: mayor que
- `lt`: menor que
- `bt`: entre fechas

Para que un campo tenga filtro de fecha:

```ts
type: "date",
filterable: true
```

---

## Eventos del componente

### `onCreate`

Se dispara al hacer click en botón crear.

```ts
onCreate?: () => void
```

### `onGroupChange`

Se dispara al cambiar agrupación seleccionada.

```ts
onGroupChange?: (groupId: string) => void
```

### `groupSelectorLabel`

Prefijo de cada opción del selector de agrupación de la barra (`Agrupar por: Estado`) y su
`aria-label`. Por defecto `"Agrupar por"`.

```ts
groupSelectorLabel?: string
```

### `onCardMove`

Se dispara al mover una card entre columnas (drag & drop).

```ts
interface KanbanMoveEvent<TData> {
  card: TData; // card original
  updatedCard: TData; // card con valor de agrupación actualizado
  cardId: string;
  groupId: string;
  fromValue: string;
  toValue: string;
}
```

### `onCardClick`

Se dispara al hacer click sobre una card. Es opcional — si no se pasa, las
cards no son interactivas (comportamiento previo a `v1.2.0`).

```ts
interface KanbanCardClickEvent<TData> {
  card: TData;
  cardId: string;
  groupId: string;
  value: string;
}
```

`groupId` corresponde al `id` de la agrupación activa y `value` al valor de la
columna donde la card se está visualizando en el momento del clic.

**No se dispara cuando:**

- El usuario arrastra la card a otra columna (drag & drop). Solo `onCardMove`
  se ejecuta.
- El usuario interactúa con el menú de tres puntos (`rowActions`): apertura del
  dropdown o selección de una acción.

Si usas `renderCard` con elementos interactivos propios (botones, inputs,
toggles), envuélvelos en un contenedor con
`onClick={(event) => event.stopPropagation()}` para evitar que esos clics
disparen `onCardClick`. Es el mismo contrato que sigue `KanbanCardMenu`.

Ejemplo:

```tsx
<KanbanBoard
  // ...
  onCardClick={({ card, cardId, groupId, value }) => {
    openDetailDrawer(card);
  }}
/>
```

---

## Acciones por card (`rowActions`)

- `onEdit`
- `onArchiveToggle` o `onArchive`
- `onRemove`
- `onHistory`
- `getIsArchived` (para alternar etiqueta Archivar / Desarchivar)

Si no envías callback, esa acción no se ejecuta (y puede ocultarse según configuración).

Ejemplo:

```tsx
rowActions={{
  getIsArchived: (card) => card.status === "Archivada",
  onEdit: (card) => {},
  onArchiveToggle: (card) => {},
  onRemove: (card) => {},
  onHistory: (card) => {},
}}
```

---

## Selector de archivados (opcional)

Permite que el usuario alterne la vista entre **Activos**, **Archivados** y
**Todos** desde un selector en el toolbar. La feature es **opcional y
retrocompatible**: si no pasas `archivedView`, el selector no se renderiza
y el componente se comporta igual que en versiones anteriores.

### Activación

```tsx
<KanbanBoard
  // ...
  rowActions={{
    getIsArchived: (card) => card.status === "Archivada",
    onArchiveToggle: handleArchiveToggle,
  }}
  archivedView={{
    defaultValue: "active",
    onChange: (mode) => console.log("archivedMode", mode),
  }}
/>
```

Para que el selector aparezca se requieren **dos cosas**:

1. La prop `archivedView` (objeto, aunque sea vacío `{}`).
2. `rowActions.getIsArchived` definida.

### Forma del objeto `archivedView`

| Campo          | Tipo                              | Default                                                       | Descripción                                                                |
| -------------- | --------------------------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `value`        | `"all" \| "active" \| "archived"` | `undefined`                                                   | Modo controlado. Si se pasa, el componente delega el estado al consumidor. |
| `defaultValue` | `"all" \| "active" \| "archived"` | `"active"`                                                    | Estado inicial cuando se usa en modo no controlado.                        |
| `onChange`     | `(mode) => void`                  | `undefined`                                                   | Se dispara solo en cambios reales del usuario (no en mount).               |
| `label`        | `string`                          | `"Mostrar"`                                                   | Prefijo visible en cada opción.                                            |
| `optionLabels` | `Partial<Record<mode, string>>`   | `{ active: "Activos", archived: "Archivados", all: "Todos" }` | Override de los textos por modo.                                           |

### Comportamiento

- El filtro se aplica **antes** de la agrupación en columnas: las cards
  archivadas dejan de aparecer en cualquier columna (no solo en una columna
  "Archivada"), incluso si el agrupado activo es por país, marca, etc.
- El filtro se aplica **antes** de los filtros de campo y del ordenamiento.
- Cambiar el modo no rompe el drag & drop de las cards visibles.

### Casos borde

- **Sin `getIsArchived`**: el selector no se renderiza.
- **Modo `"archived"` con datos sin archivados**: las columnas se muestran
  vacías con su mensaje "Sin cards".
- **Modo controlado**: pasá `value` y manejá el estado con `onChange`,
  igual que en `DataTable`.

---

## Switch de vista Tabla/Kanban (opcional)

Renderiza un control segmentado en el toolbar para alternar entre una vista de
tabla y la de kanban. La feature es **opcional y retrocompatible**: si no pasas
`viewSwitch`, el control no se renderiza y el componente se comporta igual que
en versiones anteriores. El componente no decide qué vista mostrar: solo emite
el cambio mediante `onChange` para que el consumidor controle el estado.

### Forma del objeto `viewSwitch`

```ts
type ViewMode = "table" | "kanban";

interface ViewSwitchConfig {
  active: ViewMode;
  onChange: (view: ViewMode) => void;
  tableLabel?: string;
  kanbanLabel?: string;
}
```

| Campo         | Tipo                              | Default    | Descripción                                            |
| ------------- | --------------------------------- | ---------- | ------------------------------------------------------ |
| `active`      | `"table" \| "kanban"`             | —          | Vista activa (controlada por el consumidor).           |
| `onChange`    | `(view) => void`                  | —          | Se dispara solo al seleccionar una vista distinta.     |
| `tableLabel`  | `string`                          | `"Tabla"`  | Texto del botón de tabla.                              |
| `kanbanLabel` | `string`                          | `"Kanban"` | Texto del botón de kanban.                             |

### Comportamiento

- Hacer click en la vista ya activa **no** dispara `onChange`.
- Cada botón expone `aria-pressed` según la vista activa.
- El botón IA y el switch se renderizan en la zona derecha del toolbar,
  **inmediatamente a la izquierda del botón de creación**, de modo que su
  posición no varía aunque una vista muestre los selectores de archivado o
  agrupado y la otra no.

### Activación

```tsx
const [view, setView] = useState<ViewMode>("kanban");

<KanbanBoard
  // ...
  viewSwitch={{ active: view, onChange: setView }}
/>;
```

---

## Botón de asistente IA (opcional)

Renderiza un botón en el toolbar para abrir un asistente de IA. La feature es
**opcional y retrocompatible**: si no pasas `aiButton`, el botón no se renderiza.

### Forma del objeto `aiButton`

```ts
interface AiButtonConfig {
  onClick: () => void;
  label?: string;
}
```

| Campo     | Tipo         | Default | Descripción                          |
| --------- | ------------ | ------- | ------------------------------------ |
| `onClick` | `() => void` | —       | Se dispara al hacer click.           |
| `label`   | `string`     | `"AI"`  | Texto y `aria-label` del botón.      |

### Activación

```tsx
<KanbanBoard
  // ...
  aiButton={{ onClick: () => openAssistant() }}
/>
```

### Personalización de estilos (switch y botón IA)

Por defecto el botón IA comparte el estilo neutro de los botones del toolbar
(tokens `--gdy-btn-bg` y `--gdy-btn-fg`), idéntico en tabla y kanban. Ambos
controles exponen clases CSS estables con especificidad de una sola clase,
pensadas como puntos de extensión:

- `gdy-btn-ai` — botón IA.
- `gdy-view-switch` — contenedor del switch.
- `gdy-view-switch-btn` — cada segmento del switch.
- `gdy-view-switch-btn[aria-pressed="true"]` — segmento activo (estado por atributo).
- `gdy-view-switch-icon` / `gdy-btn-ai-icon` — iconos de cada control.

El consumidor puede sobreescribir los valores por defecto declarando las
mismas clases en su propio CSS, cargado después del CSS del paquete:

```css
/* Ejemplo: botón IA con acento de marca */
.gdy-btn-ai {
  border-color: #c7d2fe;
  color: #4f46e5;
  background: #ffffff;
}
```

### Tokens de color

Los colores salen de los tokens base `--gdy-*` (ver "Tema y tokens" en el README raíz), que
traen tema claro y oscuro. Además el kanban lee estos tokens de componente opcionales, que se
declaran en `:root` o `.dark` de la app:

| Token | Por defecto | Qué pinta |
|---|---|---|
| `--gdy-kanban-column-bg` / `--gdy-kanban-column-border` | `--gdy-muted` / `--gdy-border` | columnas |
| `--gdy-kanban-card-bg` / `--gdy-kanban-card-border` | `--gdy-card` / `--gdy-border` | tarjetas y columna vacía |
| `--gdy-kanban-drop-bg` / `--gdy-kanban-drop-outline` | tinte de `--gdy-muted` / `--gdy-muted-foreground` | columna destino durante el arrastre |
| `--gdy-toolbar-border` | `--gdy-border` | borde de la toolbar y de la fila de filtros |
| `--gdy-btn-bg` / `--gdy-btn-fg` / `--gdy-btn-hover-bg` | `--gdy-muted` / `--gdy-foreground` / tinte | botones de la toolbar |
| `--gdy-btn-primary-bg` / `--gdy-btn-primary-fg` | `--gdy-primary` / `--gdy-primary-foreground` | botón primario (crear) |
| `--gdy-input-bg` / `--gdy-input-border` | `--gdy-muted` / `--gdy-input` | buscador, inputs de fecha, disparadores de filtro |
| `--gdy-panel-bg` / `--gdy-panel-border` / `--gdy-panel-shadow` | `--gdy-popover` / `--gdy-border` / `--gdy-shadow-md` | paneles de filtro |
| `--gdy-option-hover-bg` | tinte de `--gdy-muted` | hover del checklist (prop `optionHoverColor`) |
| `--gdy-scrollbar-thumb` | `--gdy-input` | scrollbars finas (prop `scrollbarColor`) |

---

## Sort en campos de fecha (opcional)

Cuando un field tiene `type: "date"` **y** `sortable: true`, el
`DateFilterMenu` incluye una sección **"Ordenar"** arriba del selector de
operador, con dos botones:

- `Ascendente (antigua → reciente)`
- `Descendente (reciente → antigua)`

La feature es **opcional y retrocompatible**: si el field no es `sortable`
o `features.sorting` está en `false`, la sección no aparece y el menú se
comporta como en versiones previas.

### Activación

No requiere props nuevas. Basta con marcar el field como `sortable`:

```tsx
{
  id: "createdAt",
  header: "Alta",
  accessor: (card) => card.createdAt,
  type: "date",
  filterable: true,
  sortable: true, // ← habilita la sección "Ordenar" en el DateFilterMenu
}
```

### Comportamiento

- El orden se aplica **dentro de cada columna** del kanban (estado, país,
  marca, etc., según el grupo activo). Las columnas en sí no cambian.
- **Convive con el filtro** (`gt`/`lt`/`bt`): el filtro recorta el set y el
  orden se aplica sobre el resultado.
- El sort por fecha **reemplaza** el sort de otros fields (modelo
  single-field sort ya existente).
- El botón **"Limpiar"** del menú resetea filtro **y** sort en una sola
  acción.
- Drag & drop sigue funcionando con o sin sort activo.

### Casos borde

- **`features.sorting === false`**: la sección "Ordenar" no se renderiza
  aunque el field sea `sortable`. Útil para feature flags globales.
- **`sortable: false`**: la sección no se renderiza; el menú queda como
  antes (solo operador + fechas).
- **Sin cards en una columna**: el sort opera sobre el set vacío sin
  efectos visibles; al volver a tener cards (drag o cambio de filtro) el
  orden vuelve a aplicarse.

---

## Localización del calendario de fechas (español por defecto)

El calendario emergente (popover) que abre el `DateFilterMenu` de los fields
`type: "date"` se renderiza en **español** (locale `es`) por defecto: el
encabezado del mes aparece capitalizado (`Junio 2026`) y la semana inicia en
**lunes**. Antes de `v1.8.0` el calendario caía al locale `en-US` de
react-day-picker (`June 2026`, `Su Mo Tu...`, semana iniciando en domingo).

La localización vive en el wrapper compartido `src/components/ui/calendar/calendar.tsx`,
el mismo que usa la tabla reusable, por lo que el comportamiento es idéntico en
ambos componentes.

### Comportamiento

- Por defecto el calendario ya no depende del idioma del navegador: renderiza en
  español con el mes capitalizado y la semana iniciando en lunes.
- El locale es **sobreescribible**: si el consumidor pasa un `locale` propio al
  wrapper `Calendar`, ese tiene prioridad y el `es` solo actúa como fallback
  (`const activeLocale = locale ?? es`).
- El cambio es **presentacional**: solo afecta el idioma, la capitalización del
  mes y el día de inicio de semana mostrados. El valor de fecha seleccionado y
  guardado no cambia.

### Retrocompatibilidad

- No se añaden ni modifican props de `KanbanBoard`; el arreglo es
  transparente para el componente.
- No afecta la persistencia ni las fechas ya guardadas: los filtros de fecha
  (`gt`/`lt`/`bt`) y el sort por fecha operan exactamente igual que antes.

---

## Personalización de cards

### Opción A: Card default

Si no envías `renderCard`, se usa la card base del sistema.

Incluye:

- título/subtítulo
- badge de grupo
- campos extra
- fecha (si existe campo `type: "date"`)
- menú de acciones

### Opción B: Card custom

```tsx
renderCard={(card, context) => {
  return <div>...</div>;
}}
```

`context`:

```ts
interface KanbanCardRenderContext<TData> {
  card: TData;
  groupId: string;
  groupValue: string;
}
```

---

## Estilos y clases útiles

Archivos: `src/components/kanban/styles.css` (propios, `gdy-kanban-*`) y
`src/styles/shared.css` (compartidos con la tabla: `gdy-card`, `gdy-toolbar`, `gdy-btn`,
`gdy-input`, `gdy-panel`, `gdy-option-item`, `gdy-date-input`, `gdy-view-switch`). Los estados van
por atributo, no por clase: `data-filtered` en el trigger de filtro, `data-dragging` en la tarjeta
arrastrada, `data-drop-target` en la columna destino, y en el panel compartido `data-selected` /
`data-checked` (checklist) y `aria-pressed="true"` (orden y operador). Cada regla es de una sola
clase (o flag de raíz más clase, como `.gdy-thin-scroll .gdy-scroll`), así que una regla con el
mismo selector en tu CSS, cargado después de `gridory/styles.css`, gana.

Clases principales:

- `.gdy-kanban`, `.gdy-card`
- `.gdy-kanban-filter-row`, `.gdy-kanban-filter-item`, `.gdy-kanban-filter-trigger`
  (`[data-filtered]`), `.gdy-kanban-filter-trigger-label`, `.gdy-kanban-filter-icon`,
  `.gdy-kanban-filter-arrow`, `.gdy-kanban-filter-menu-holder`
- `.gdy-kanban-board-wrap`, `.gdy-kanban-board`, `.gdy-kanban-column` (`[data-drop-target]`),
  `.gdy-kanban-column-head`, `.gdy-kanban-column-title`, `.gdy-kanban-column-count`,
  `.gdy-kanban-column-body`, `.gdy-kanban-empty-col`
- `.gdy-kanban-card` (`[data-dragging]`), `.gdy-kanban-card-head`, `.gdy-kanban-card-main`,
  `.gdy-kanban-card-title`, `.gdy-kanban-card-subtitle`, `.gdy-kanban-card-meta`, `.gdy-kanban-tag`,
  `.gdy-kanban-card-value`, `.gdy-kanban-card-value-label`, `.gdy-kanban-card-actions`,
  `.gdy-kanban-card-menu-icon`
- Los ganchos sin estilos por defecto (iconos, `gdy-kanban-card-value-label`) están listados como
  `hookOnly` en `scripts/audit-allowlist.json`.
- Primitivos (selects de la toolbar, menú de tarjeta, popover y calendario del filtro de fecha,
  toggles): `gdy-select-*`, `gdy-menu-*` (`[data-disabled]` en las acciones deshabilitadas),
  `gdy-popover-content`, `gdy-calendar-*` y `gdy-toggle-*` en `src/components/ui/styles.css`.

Tamaños de alto sugeridos:

- `gdy-kanban-min-h-sm`
- `gdy-kanban-min-h-md`
- `gdy-kanban-min-h-lg`

Popover de fecha sobre capas:

- `.gdy-kanban-filter-menu-holder` usa z-index alto.
- popovers internos de fecha quedan por encima para evitar bloqueo visual.

---

## Ejemplo completo de uso

```tsx
<KanbanBoard
  fields={fields}
  data={{ results: rows }}
  groups={groups}
  defaultGroupId="status"
  getCardId={(card) => card.id}
  createLabel="Nueva empresa"
  searchPlaceholder="Buscar empresa..."
  emptyMessage="Sin resultados"
  boardMinHeightClassName="gdy-kanban-min-h-lg"
  columnBodyMaxHeight={520}
  features={{
    search: true,
    filtering: true,
    sorting: true,
    createButton: true,
    rowActions: true,
    groupSelector: true,
    dragAndDrop: true,
  }}
  onCreate={() => {}}
  onGroupChange={(groupId) => {}}
  onCardMove={({ updatedCard }) => {}}
  rowActions={{
    getIsArchived: (card) => card.status === "Archivada",
    onEdit: (card) => {},
    onArchiveToggle: (card) => {},
    onRemove: (card) => {},
    onHistory: (card) => {},
  }}
/>
```

---

## Migración desde tabla reusable

1. Reutiliza columnas existentes en `fields`.
2. Define qué campos son buscables (`searchable`) y filtrables (`filterable` + `type`).
3. Define `groups` y su `setValue` para mover cards.
4. Define `defaultGroupId`.
5. Migra `getRowId` a `getCardId`.
6. Reutiliza callbacks de `rowActions`.
7. Opcional: reemplaza card default con `renderCard`.

---

## Mock de referencia

- `src/components/mocks/KanbanBoard.mock.tsx`
- `src/components/mocks/data/mockCompanyRows.ts`

---

## Filtros de fecha, scrollbars finos y hover de checklist (opcional, v1.10.0)

Seis mejoras de UX **opcionales y retrocompatibles**, equivalentes a las de
`DataTable` (los filtros del kanban comparten componentes y clases `gdy-*` con la tabla).
Sin estas props, el filtrado/orden es idéntico a v1.9.0; el único diff por defecto es
cosmético/intencional.

### Props nuevas

| Prop | Tipo | Default | Descripción |
| ---- | ---- | ------- | ----------- |
| `thinScrollbars` | `boolean` | `true` | Scrollbars finos gris claro en tablero, columnas y listas de opciones. `false` = nativos. |
| `scrollbarColor` | `string` | token `--gdy-input` | Color del thumb, vía `--gdy-scrollbar-thumb`. |
| `optionHoverColor` | `string` | tinte de `--gdy-muted` | Fondo hover de las filas del checklist, vía `--gdy-option-hover-bg`. |
| `dateFilterRequireOperator` | `boolean` | `true` | Submenú de fecha sin operador preseleccionado ni input hasta elegir uno; "Limpiar" lo retira. `false` = legacy (`gt`). |
| `dateInputFormat` | `DateInputFormat` | `"dd/mm/yyyy"` | Máscara de placeholder/display/parseo. Valores: `dd/mm/yyyy`, `dd-mm-yyyy`, `mm/dd/yyyy`, `mm-dd-yyyy`. |
| `calendarMonthYearDropdown` | `boolean` | `true` | Selector de mes+año en el calendario. `false` = etiqueta. |
| `calendarFromYear` | `number` | año − 100 | Primer año del desplegable. |
| `calendarToYear` | `number` | año + 10 | Último año del desplegable. |

### Comportamiento

- **Scrollbars (1)**: `scrollbar-width: thin` + `scrollbar-color` + `::-webkit-scrollbar`
  bajo la clase-gate `.gdy-thin-scroll`, parametrizados por CSS variables.
- **Submenú de fecha (2)**: `op` admite `""`; sin operador no se muestra el input y no
  se filtra. "Limpiar" resetea al estado sin operador.
- **Separadores/rango (3)**: `.gdy-panel-date .gdy-panel-section { width: 100% }`
  (scopeado; el checklist de valores no se ve afectado). El rango se ingresa por dos
  campos "Desde/Hasta" o por el calendario de rango.
- **Formato/entrada manual (4)**: helpers `parseInputToDate`/`formatDateToInput`
  (date-fns); el valor almacenado sigue siendo ISO `yyyy-MM-dd`.
- **Mes/año (5)**: `captionLayout="dropdown"` con `startMonth`/`endMonth`, pasado desde
  los pickers (no se toca el wrapper `Calendar` compartido).
- **Hover (6)**: `.gdy-option-item:hover` con fondo configurable.

### Retrocompatibilidad

- Las 8 props son opcionales; sin ellas, el comportamiento efectivo es el de v1.9.0.
- `DateFilterState.op` se amplía a `DateFilterOp | ""` (aditivo). El calendario
  compartido `ui/calendar/calendar.tsx` no se modifica.

---

## Tooltips de filtro, ancho del panel y calendario de rango (v1.11.0)

Correcciones visuales de los submenús de filtro y del tablero, **sin cambios de
API** y retrocompatibles con v1.10.0. No hay props nuevas: aplican por defecto
(equivalentes a las de `DataTable`; los filtros del kanban comparten componentes
y clases `gdy-*` con la tabla).

### Comportamiento

- **Tooltip nativo en textos truncados**: el título de columna del tablero
  (`gdy-kanban-column-title`), el disparador del filtro por campo
  (`gdy-kanban-filter-trigger-label`) y los valores del checklist (`gdy-option-label`)
  exponen el atributo `title` con su texto completo, que el navegador muestra al
  pasar el cursor. No se usa un tooltip a medida.
- **Ancho del panel acotado**: `.gdy-panel` recibe `max-width: 280px` y
  `.gdy-option-label` `max-width: 210px`; los valores largos truncan con ellipsis
  en vez de ensanchar el submenú. El disparador del filtro usa
  `.gdy-kanban-filter-trigger-label` (`max-width: 140px` + ellipsis).
- **Opciones de "Ordenar" apiladas**: la sección "Ordenar" usa
  `gdy-panel-section-stack`, que apila "Ascendente"/"Descendente" en columna a
  ancho completo.
- **Calendario de rango lado a lado**: al elegir "Entre (rango)", los dos meses
  se muestran en fila a partir de `768px` vía
  `@media (min-width: 768px) { .gdy-calendar-months { flex-direction: row } }`.

### Por qué CSS plano para el rango

El calendario no usa utilidades: `src/components/ui/styles.css` declara
`.gdy-calendar-months` en columna y, desde 768px, en fila, así que el rango se ve
igual en cualquier app sin depender de su Tailwind. `ui/calendar/calendar.tsx` solo asigna
los ganchos `gdy-calendar-*` y deja los estados del día en atributos
(`data-today`, `data-selected`, `data-range-start|middle|end`).

---

## Orden por campo deseleccionable (tri-estado, v1.12.0)

El orden por campo pasa a ciclar **ascendente → descendente → sin orden**. Es un
cambio de **comportamiento, sin props nuevas ni cambios de API**, aplicado por
defecto y retrocompatible con v1.11.0.

### Comportamiento

- Dentro del menú de filtro, volver a hacer clic en la dirección ya activa
  ("Ascendente"/"Descendente") la deselecciona y restaura el orden natural de las
  cards dentro de cada columna.
- Antes el orden quedaba fijo alternando asc ↔ desc y solo se "soltaba" ordenando
  por otro campo. Se mantiene el modelo single-field sort: solo hay un orden
  activo a la vez.
- El drag & drop sigue funcionando con o sin orden activo.

---

## Menú de acciones con auto-posicionamiento (v1.12.0)

El menú de tres puntos de la card (`KanbanCardMenu`) deja de ser un contenedor
absoluto con posición fija y pasa a `DropdownMenu` (Radix) renderizado en un
`Portal` con detección de colisión. Es un cambio de **comportamiento, sin cambios
de API**.

### Comportamiento

- El menú **se auto-posiciona**: se abre hacia arriba cuando la card está cerca
  del borde inferior del área con scroll interno de la columna, por lo que ya no
  queda recortado en las últimas tarjetas.
- Cierre por clic-fuera, `Escape` y navegación por teclado incluidos de forma
  nativa por Radix. Sigue vigente el contrato de `onCardClick`: abrir el menú o
  elegir una acción **no** dispara el clic de la card.

---

## Acciones de menú personalizables (`rowActions.customActions`, v1.12.0)

Nueva prop **opcional** `customActions` dentro de `rowActions`. Las acciones por
defecto (editar, archivar/desarchivar, eliminar, ver historial) se conservan; las
personalizadas se añaden con icono, nombre, evento, posición y estado. La feature
es **opcional y retrocompatible**: sin `customActions`, el menú es idéntico al de
v1.11.0.

### Contrato TS

```ts
export interface RowAction<TData> {
  id: string;                         // único; validado contra los built-ins
  label: string;
  icon?: ReactNode;
  onClick: (row: TData) => void;      // recibe la card
  placement?: "top" | "bottom";       // antes/después de las built-in (default "bottom")
  variant?: "default" | "destructive";
  disabled?: (row: TData) => boolean;
  hidden?: (row: TData) => boolean;
}
```

`RowAction`, `ToggleGroupConfig` y `HeaderSelectConfig`
viven en un módulo compartido consumido por tabla y kanban, así que el contrato es
idéntico en ambos (en el kanban `TData` es la card).

### Comportamiento

- **Orden por defecto (sin `menuActions`)**: primero las acciones `placement: "top"`,
  luego las built-in en orden `edit → archive → remove → history` y, por último, las
  `placement: "bottom"`, preservando el orden del array dentro de cada grupo.
- **Sin separadores automáticos**: el menú ya **no** dibuja líneas divisorias entre
  grupos. Los separadores solo aparecen si el consumidor los agrega vía `menuActions`
  (ver más abajo).
- **`variant: "destructive"`** aplica el estilo de acción peligrosa (como
  "Eliminar"); `disabled(card)` y `hidden(card)` se evalúan por card.
- **Validación de `id` duplicado**: los `id` se validan en tiempo de ejecución. Si
  uno colisiona con un built-in (`edit`, `archive`, `remove`, `history`) o se
  repite entre las personalizadas, se lanza `DuplicateRowActionError` con un
  mensaje descriptivo.

### Activación

```tsx
import { Copy, Send } from "lucide-react";

<KanbanBoard
  // ...
  rowActions={{
    onEdit: (card) => {},
    onRemove: (card) => {},
    customActions: [
      {
        id: "duplicate",
        label: "Duplicar",
        icon: <Copy size={16} />,
        placement: "top",
        onClick: (card) => duplicateCard(card),
      },
      {
        id: "send",
        label: "Enviar",
        icon: <Send size={16} />,
        onClick: (card) => sendCard(card),
        disabled: (card) => card.status === "Archivada",
      },
    ],
  }}
/>;
```

### Menú completamente componible (`rowActions.menuActions`)

Cuando necesitás controlar el **orden y la visibilidad completos** del menú
—intercalar separadores, encabezados de sección o mezclar acciones personalizadas
con las built-in en cualquier orden—, usá `menuActions`. Al proveerla, **define por
completo** el menú: fija el orden y la visibilidad e **ignora `customActions`** y el
orden por defecto.

Cada ítem es una unión discriminada por `kind` (en el kanban `TData` es la card):

```ts
export type MenuItem<TData> =
  | MenuActionItem<TData>
  | MenuBuiltinItem
  | MenuSeparatorItem
  | MenuLabelItem;

interface MenuActionItem<TData> {
  kind?: "action";                     // opcional; es el valor por defecto
  id: string;
  label: string;
  icon?: ReactNode;
  onClick: (card: TData) => void;
  variant?: "default" | "destructive";
  disabled?: (card: TData) => boolean;
  hidden?: (card: TData) => boolean;
}

interface MenuBuiltinItem {
  kind: "builtin";
  id: "edit" | "archive" | "remove" | "history";
}

interface MenuSeparatorItem {
  kind: "separator";
  id: string;
}

interface MenuLabelItem {
  kind: "label";
  id: string;
  label: string;
  className?: string;
}
```

Semántica de cada `kind`:

- **`action`** (o sin `kind`): acción personalizada; misma firma que un
  `RowAction` (icono, evento, `variant`, `disabled`, `hidden`).
- **`builtin`**: referencia a una acción por defecto por su `id`
  (`edit`/`archive`/`remove`/`history`); reutiliza el callback y la etiqueta
  definidos en `rowActions`. Si ese built-in no está disponible (sin callback), el
  ítem se omite.
- **`separator`**: línea divisoria en la posición exacta donde el consumidor la
  coloca (los separadores dejaron de ser automáticos).
- **`label`**: texto de sección/encabezado estilizado (con `className` opcional).

**Validación**: los `id` deben ser únicos y una acción personalizada **no** puede
reutilizar un `id` reservado (`edit`, `archive`, `remove`, `history`); si colisiona
se lanza `DuplicateRowActionError`.

```tsx
import { Copy, Download } from "lucide-react";

<KanbanBoard
  // ...
  rowActions={{
    onEdit: (card) => editCard(card),
    onArchiveToggle: (card) => archiveCard(card),
    onRemove: (card) => removeCard(card),
    onHistory: (card) => showHistory(card),
    menuActions: [
      { kind: "label", id: "quick", label: "Acciones rápidas" },
      { id: "duplicate", label: "Duplicar", icon: <Copy size={16} />, onClick: (card) => duplicate(card) },
      { kind: "separator", id: "sep-1" },
      { kind: "builtin", id: "edit" },
      { kind: "builtin", id: "archive" },
      { kind: "builtin", id: "history" },
      { kind: "separator", id: "sep-2" },
      { kind: "builtin", id: "remove" },
      { id: "export", label: "Exportar", icon: <Download size={16} />, onClick: (card) => exportCard(card) },
    ],
  }}
/>;
```

---

## Toggles/segmented-controls en la barra (`toggleGroups`, v1.12.0)

Nueva prop **opcional** `toggleGroups`. Cada grupo es un segmented-control con
mínimo dos opciones (icono opcional + etiqueta) que emite su propio evento; útil
para alternar datasets/vistas más allá del switch Tabla/Kanban. Es **opcional y
retrocompatible**: sin `toggleGroups`, la barra no cambia.

Por defecto se ubican en el grupo **derecho** de la barra, como **primeros
elementos** (a la izquierda de los controles fijos), sin alterar la posición de los
controles fijos. Con `position: "left"` cada grupo pasa al lado izquierdo (junto al
buscador). Para el control total de lados y orden del toolbar, usá `toolbarLayout`
(ver la sección de layout del toolbar).

### Contrato TS

```ts
export interface ToggleGroupConfig {
  id: string;
  options: { value: string; label: string; icon?: ReactNode }[]; // >= 2
  value: string;
  onChange: (value: string) => void;
  display?: "label" | "icon" | "both";   // default "both"
  position?: "left" | "right";           // default "right"
  ariaLabel?: string;
}
```

### Activación

```tsx
import { LayoutGrid, List } from "lucide-react";

<KanbanBoard
  // ...
  toggleGroups={[
    {
      id: "density",
      value: density,
      onChange: setDensity,
      display: "both",
      ariaLabel: "Densidad",
      options: [
        { value: "comfortable", label: "Cómoda", icon: <LayoutGrid size={16} /> },
        { value: "compact", label: "Compacta", icon: <List size={16} /> },
      ],
    },
  ]}
/>;
```

---

## Selectores generales en la barra (`headerSelectors`, v1.12.0)

Nueva prop **opcional** `headerSelectors`: selectores desplegables genéricos
adicionales (además de "Agrupar por" y "Mostrar"), cada uno con su propio evento
para actuar sobre la lista de cards. Es **opcional y retrocompatible**: sin
`headerSelectors`, la barra no cambia.

Igual que `toggleGroups`, por defecto se ubican en el grupo **derecho** (como
primeros elementos, a la izquierda de los controles fijos) y aceptan
`position: "left"` para pasar al lado izquierdo. Para componer los lados y el orden
de todo el toolbar, usá `toolbarLayout` (ver la sección de layout del toolbar).

### Contrato TS

```ts
export interface HeaderSelectConfig {
  id: string;
  label?: string;                      // prefijo/placeholder
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  position?: "left" | "right";         // default "right"
}
```

### Activación

```tsx
<KanbanBoard
  // ...
  headerSelectors={[
    {
      id: "season",
      label: "Temporada",
      value: season,
      onChange: setSeason,
      placeholder: "Todas",
      options: [
        { value: "2025", label: "2025" },
        { value: "2026", label: "2026" },
      ],
    },
  ]}
/>;
```

---

## Selectores estilizados (no nativos, v1.12.0)

Los `<select>` nativos del navegador se sustituyen por un selector propio basado
en Radix (caja con borde, dropdown en `Portal`, flecha e indicador de selección,
estados focus/hover y soporte de tema claro/oscuro vía tokens). El contrato de
valor/evento se mantiene idéntico; el cambio es de markup/estilo y suma la prop
opcional `selectTheme` para tematizar todos los selectores a la vez (ver más abajo).

### Alcance en el kanban

- **"Mostrar"** (selector de archivados).
- **"Agrupar por"** (selector de agrupación).
- Los selectores adicionales de la barra (`headerSelectors`).

### Ajustes visuales (v1.12.0)

- **Ancho del desplegable ≥ ancho del trigger**: el panel de opciones nunca es más
  estrecho que el recuadro y crece hasta que cada opción quepa en una línea (antes
  igualaba el ancho exacto y las etiquetas largas se partían en dos líneas).
- **Menos redondeo**: las esquinas del trigger y del panel se redujeron para un look
  más sobrio.

### Theming global (`selectTheme`)

Nueva prop **opcional** `selectTheme` a nivel de componente. Es **global**: se aplica
a **todos** los selectores estilizados del kanban ("Mostrar", "Agrupar por" y los
`headerSelectors`) en una sola declaración. Es el mismo contrato que expone
`DataTable`.

```ts
export interface SelectTheme {
  background?: string;
  hoverBackground?: string;        // hover del recuadro (trigger)
  border?: string;
  text?: string;
  radius?: string | number;        // number = px
  contentBackground?: string;
  optionText?: string;
  optionHoverBackground?: string;  // hover de cada opción
  optionActiveBackground?: string; // opción seleccionada
  triggerClassName?: string;
  contentClassName?: string;
  itemClassName?: string;
}
```

**Precedencia** (de mayor a menor): el valor por código (prop `selectTheme`) gana;
si no, la variable CSS `--gdy-select-*` correspondiente; si no, el token por defecto
del tema (claro/oscuro).

También podés tematizar solo por CSS declarando las variables (sin tocar props):

| Variable CSS                    | Campo equivalente        |
| ------------------------------- | ------------------------ |
| `--gdy-select-bg`               | `background`             |
| `--gdy-select-trigger-hover-bg` | `hoverBackground`        |
| `--gdy-select-border`           | `border`                 |
| `--gdy-select-text`             | `text`                   |
| `--gdy-select-radius`           | `radius`                 |
| `--gdy-select-content-bg`       | `contentBackground`      |
| `--gdy-select-item-text`        | `optionText`             |
| `--gdy-select-item-hover-bg`    | `optionHoverBackground`  |
| `--gdy-select-item-active-bg`   | `optionActiveBackground` |

```tsx
<KanbanBoard
  // ...
  selectTheme={{
    background: "#f5f3ff",
    hoverBackground: "#ede9fe",
    border: "#c4b5fd",
    text: "#5b21b6",
    radius: 8,
    optionHoverBackground: "#ede9fe",
    optionActiveBackground: "#ddd6fe",
  }}
/>;
```

### Retrocompatibilidad

- `selectTheme` es opcional; sin ella, los selectores usan los tokens por defecto del
  tema (claro/oscuro). Las únicas diferencias visuales por defecto son intencionales:
  el desplegable nunca es más estrecho que el trigger y el redondeo es menor.

---

## Posición y layout del toolbar (`toolbarLayout`, v1.12.0)

El toolbar admite dos niveles de control sobre la ubicación de sus controles: la
prop `position` de cada `toggleGroups`/`headerSelectors` (ajuste puntual) y la prop
`toolbarLayout` a nivel de componente (composición explícita de todo el toolbar).
Ambas son **opcionales y retrocompatibles**.

### Layout por defecto

Sin `toolbarLayout`:

- **Izquierda**: el buscador y, cuando hay filtros activos, el botón "Limpiar filtros".
- **Derecha**: los controles personalizados (`toggleGroups`/`headerSelectors`) como
  primeros elementos, seguidos de los controles fijos ("Mostrar", "Agrupar por",
  botón IA, switch de vista, botón crear).
- Cada control personalizado respeta su `position` (`"right"` por defecto; `"left"`
  lo lleva junto al buscador).

### Composición explícita (`toolbarLayout`)

```ts
export interface ToolbarLayout {
  left?: string[];
  right?: string[];
}
```

Cuando se provee, la semántica es **exclusiva**: **solo** se renderizan los slots
listados, en el lado y el orden indicados. Un slot que no aparezca ni en `left` ni en
`right` no se muestra.

Ids de slots built-in: `"search"`, `"clearFilters"`, `"archived"`, `"group"`,
`"ai"`, `"viewSwitch"`, `"create"`; además del `id` de cada `toggleGroups` /
`headerSelectors`. (El kanban no pagina, por lo que no hay slot de tamaño de página.)

La visibilidad "dura" la siguen gobernando los feature flags: un slot apagado (por
`features` o porque su configuración no se pasó) **no** aparece aunque esté listado.

```tsx
<KanbanBoard
  // ...
  // "scope" es el id de un headerSelector y "brand" el id de un toggleGroup:
  toolbarLayout={{
    left: ["scope", "search", "clearFilters"],
    right: ["brand", "archived", "group", "ai", "viewSwitch", "create"],
  }}
/>;
```

### Retrocompatibilidad

- Sin `toolbarLayout` se usa el layout por defecto descrito arriba, respetando el
  `position` de cada control. Sin `toggleGroups`/`headerSelectors` ni `toolbarLayout`,
  la barra es idéntica a v1.11.0.
