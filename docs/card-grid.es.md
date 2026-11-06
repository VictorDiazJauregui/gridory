# CardGrid

[English](card-grid.md) · [Español](card-grid.es.md)

`CardGrid` muestra las filas de un `DataTable` como una grilla de tarjetas que se adapta al ancho. Recibe
los mismos datos, columnas, búsqueda, filtros, orden y paginación que la tabla, y sus tarjetas se ven como
las del kanban. Nunca modifica tus datos: cada cambio sale por un callback y tu app decide qué guardar.

## Importación

```ts
import { CardGrid, type ColumnDefinition } from "gridory/card-grid";
```

Importa `gridory/styles.css` una sola vez en tu app, antes de cualquier regla que lo sobrescriba
(consulta [theming.es.md](theming.es.md)). La entrada raíz `gridory` reexporta los mismos nombres.

Para cargar solo los estilos que usas, importa `gridory/base.css`, `gridory/card-grid.css`,
`gridory/table.css` y `gridory/kanban.css`, en ese orden: `card-grid.css` trae solo la grilla, mientras
que las tarjetas y la fila de filtros son las del kanban y la paginación la de la tabla (ver
[Hojas por módulo](theming.es.md#hojas-por-módulo)).

## Ejemplo rápido

```tsx
import { CardGrid, type ColumnDefinition } from "gridory/card-grid";

interface Company {
  id: string;
  name: string;
  country: string;
  status: string;
  createdAt: string;
}

const columns: ColumnDefinition<Company>[] = [
  { id: "name", header: "Empresa", accessor: (row) => row.name, searchable: true, sortable: true, filterable: true },
  { id: "country", header: "País", accessor: (row) => row.country, filterable: true },
  { id: "status", header: "Estado", accessor: (row) => row.status, filterable: true },
  { id: "createdAt", header: "Alta", accessor: (row) => row.createdAt, type: "date", filterable: true },
];

export const Companies = ({ rows }: { rows: Company[] }) => (
  <CardGrid
    columns={columns}
    data={rows}
    getRowId={(row) => row.id}
    getRowHref={(row) => `/empresas/${row.id}`}
    rowActions={{ onEdit: (row) => openEditor(row) }}
  />
);
```

## Alternar entre tabla, tarjetas y kanban

`CardGrid` no tiene selector de vista propio. Ármalo con `toggleGroups` y guarda la búsqueda, los filtros y
el orden en tu app: las tres vistas los aceptan controlados con las mismas props (`search` /
`onSearchChange`, `sorting` / `onSortChange`, `columnFilters` / `onFiltersChange`), así que cambiar de vista
conserva lo que el usuario buscó, filtró y ordenó.

```tsx
const [view, setView] = useState("cards");
const [search, setSearch] = useState("");
const [sorting, setSorting] = useState<ColumnSortingState | null>(null);
const [filters, setFilters] = useState<ColumnFiltersState>({ values: {}, dates: {} });

const shared = {
  data: rows,
  search, onSearchChange: setSearch,
  sorting, onSortChange: setSorting,
  columnFilters: filters, onFiltersChange: setFilters,
  toggleGroups: [{
    id: "view",
    ariaLabel: "Vista",
    value: view,
    onChange: setView,
    position: "left" as const,
    options: [
      { value: "table", label: "Tabla" },
      { value: "cards", label: "Tarjetas" },
      { value: "kanban", label: "Kanban" },
    ],
  }],
};

{view === "table" && <DataTable {...shared} columns={columns} />}
{view === "cards" && <CardGrid {...shared} columns={columns} />}
{view === "kanban" && <KanbanBoard {...shared} fields={columns} groups={groups} defaultGroupId="status" getCardId={(row) => row.id} />}
```

La página de la demo `/mocks/card-grid` hace exactamente esto con las filas de empresas.

## Modelo de datos

`data`, `normalizeRow`, `columns` y `getRowId` son los de `DataTable` ([Modelo de datos](table.es.md#modelo-de-datos)).
La misma `ColumnDefinition<TData>[]` sirve para las tres vistas.

- La primera columna es el título de la tarjeta (`labels.untitledCard`, `"Card"`, si está vacía) y la
  segunda su subtítulo.
- La tercera y la cuarta columna se muestran debajo como `Encabezado: valor`, y la primera columna
  `type: "date"` como fecha formateada (`labels.formatCardDate`), igual que en el kanban.
- `getRowId` da a cada tarjeta su key y su `data-row-id`; sin él se usa la posición en `data`.

## Features

`features` apaga cada una: `search`, `sorting`, `filtering`, `pagination`, `rowActions` y `createButton`,
todas en `true` por defecto.

### Búsqueda, filtros y orden

El buscador de la barra deja las tarjetas en las que alguna columna `searchable` contiene el texto, sin
distinguir mayúsculas ni acentos. Debajo de la barra, un botón por columna `filterable` abre su menú de
valores o de fecha, que también trae los botones de orden, como en el kanban ([Filtros](kanban.es.md#filtros),
[Ordenamiento](kanban.es.md#ordenamiento)). La búsqueda, los filtros y el orden se pueden controlar; ver
[Alternar entre tabla, tarjetas y kanban](#alternar-entre-tabla-tarjetas-y-kanban) y las reglas de
[Estado controlado](table.es.md#estado-controlado). Todo corre sobre las filas de `data`: no hay modo de
servidor.

### Paginación

La barra de paginación es la de la tabla. `pageSizeOptions` vale `[15, 25, 50, 100]` y `defaultPageSize`
`25` por defecto. `pageIndex` y `pageSize` se pueden controlar, junto con `onPaginationChange`, como en la
tabla ([Página y tamaño de página](table.es.md#página-y-tamaño-de-página)). Un cambio de búsqueda, filtro,
orden o vista de archivados vuelve a la primera página.

### Clic en la tarjeta y tarjetas como enlace

- `onRowClick(row, event)` se dispara con un clic en la tarjeta o con Enter sobre una tarjeta con foco.
  `event` es un `CardClickEvent`. Nunca se dispara desde un botón, un enlace u otro control dentro de la
  tarjeta, como el menú ⋯.
- `getRowHref(row)` convierte la tarjeta en un enlace (`data-href`): Ctrl/Cmd + clic, el clic del medio y
  Ctrl/Cmd + Enter lo abren en otra pestaña; un clic simple o Enter llaman a `onRowClick`, o navegan al
  enlace si no hay `onRowClick`. Los destinos `javascript:`, `data:` y `vbscript:` se ignoran.
- Una tarjeta con `onRowClick` o con enlace lleva `data-clickable` y toma el foco con Tab.

### Tarjetas personalizadas

`renderCard(row)` reemplaza el contenido de cada tarjeta. El menú ⋯ de `rowActions` se agrega debajo, en
`div.gdy-kanban-card-actions`. Tus botones e inputs no necesitan `event.stopPropagation()`: un clic en un
control dentro de la tarjeta nunca llega a `onRowClick`.

### Acciones de la tarjeta y vista de archivados

`rowActions` agrega el menú ⋯ a cada tarjeta, con las acciones incluidas y propias de la tabla y el kanban
([toolbar.es.md](toolbar.es.md)). `archivedView` agrega el selector de archivados a la barra. La entrada
"Mover a…" del kanban no existe aquí.

### Carga y estado vacío

- `loading` reemplaza las tarjetas por `loadingRowCount` tarjetas de relleno (`5` por defecto) y pone
  `aria-busy="true"` y `data-loading` en la raíz. `renderLoading` reemplaza el relleno, dentro de
  `div.gdy-card-grid-loading`.
- Si ninguna tarjeta coincide, un elemento `gdy-empty` muestra `emptyMessage` (por defecto
  `"No se encontraron resultados"`).

### Tarjetas visibles

`onVisibleRowsChange(state)` recibe el mismo `VisibleRowsState<TData>` que la tabla: `pageRows` (las
tarjetas de la página), `filteredRows` (todas las que pasan la búsqueda, la vista de archivados y los
filtros, ordenadas) y `totalRows`. Se dispara al montar y cada vez que cambian, nunca dos veces con el mismo
resultado y nunca mientras `loading`.

### Teclado y lectores de pantalla

La grilla es una lista (`ul.gdy-card-grid-list`, `role="list"`) y cada tarjeta un elemento de lista. Una
tarjeta clicable toma el foco (`tabIndex=0`) y Tab recorre las tarjetas en orden de lectura; Enter la abre
como un clic. El anillo de foco usa `--gdy-card-grid-focus-ring` y, si no está, `--gdy-ring`.

### Textos e idioma

`labels` reemplaza cualquier texto; las claves que no pases conservan su valor en español. `CardGridLabels`
extiende `DataViewLabels` (barra, menús y filtros, compartidos con la tabla y el kanban) con los textos de
paginación de la tabla (`itemsName`, `showing`, `pageSize`, `pageOf`, `previousPage`, `nextPage`) y los de
tarjeta del kanban (`untitledCard`, `cardFieldLabel`, `formatCardDate`). Las props de un solo texto
`searchPlaceholder`, `createLabel` y `emptyMessage` ganan sobre su clave.

## Eventos

| Callback | Firma | Se dispara |
|---|---|---|
| `onRowClick` | `(row: TData, event: CardClickEvent) => void` | Clic en una tarjeta, o Enter sobre una tarjeta con foco. |
| `onVisibleRowsChange` | `(state: VisibleRowsState<TData>) => void` | Al montar y cada vez que cambian las tarjetas visibles. |
| `onPaginationChange` | `(state: ManualPaginationState) => void` | El usuario cambia la página o el tamaño de página. |
| `onSearchChange` | `(query: string) => void` | El usuario escribe en el buscador. |
| `onSortChange` | `(sorting: ColumnSortingState \| null) => void` | El usuario cambia el orden en un menú de filtro. |
| `onFiltersChange` | `(filters: ColumnFiltersState) => void` | El usuario cambia los filtros activos. |
| `onCreate` | `() => void` | Clic en el botón de crear. El botón solo aparece si está definido. |
| `rowActions.*`, `archivedView.onChange`, `aiButton.onClick`, `toggleGroups[].onChange`, `headerSelectors[].onChange` | — | Como en la tabla y el kanban; ver [toolbar.es.md](toolbar.es.md). |

## Estilos

El elemento raíz es `div.gdy-card-grid`, que también lleva `gdy-thin-scroll` mientras `thinScrollbars` está
activo (por defecto). Dentro, `div.gdy-scope.gdy-card` envuelve la barra, la fila de filtros, la grilla y la
barra de paginación.

| Gancho | Elemento | Atributos de estado |
|---|---|---|
| `gdy-card-grid-list` | La grilla (`ul`, `role="list"`). | — |
| `gdy-card-grid-card` | Una tarjeta (`li`); lleva además `gdy-kanban-card`, así la tarjeta por defecto se ve como la del kanban. | `data-clickable` con `onRowClick` o enlace; `data-href` con enlace; `data-row-id` con `getRowId`. |
| `gdy-kanban-card-head`, `gdy-kanban-card-title`, `gdy-kanban-card-subtitle`, `gdy-kanban-card-value` | Partes de la tarjeta por defecto, compartidas con el kanban. | — |
| `gdy-kanban-card-actions` | Lugar del menú debajo de un `renderCard` propio. | — |
| `gdy-card-grid-skeleton` | Una tarjeta de relleno mientras `loading`; lleva además `gdy-kanban-card-skeleton`. | — |
| `gdy-card-grid-loading` | Contenedor de `renderLoading`. | — |
| `gdy-kanban-filter-row` | Fila de botones de filtro, la del kanban. | `data-filtered` en un botón mientras su columna tiene filtro. |
| `gdy-table-pagination` | Barra de paginación, la de la tabla. | — |

Una regla sobre `.gdy-kanban-card` también alcanza a las tarjetas de la grilla; apunta a
`.gdy-card-grid-card` para darles estilo solo a estas.

La grilla lee estos tokens. Ninguno está declarado por defecto y cada uno tiene su fallback:

| Token | Fallback | Define |
|---|---|---|
| `--gdy-card-grid-min` | `260px` | Columna más angosta: `repeat(auto-fill, minmax(var(--gdy-card-grid-min), 1fr))`. Una pantalla más angosta que eso muestra una columna de su mismo ancho, sin scroll horizontal. |
| `--gdy-card-grid-gap` | `12px` | Espacio entre tarjetas. |
| `--gdy-card-grid-padding` | `12px` | Espacio alrededor de la grilla. |
| `--gdy-card-grid-focus-ring` | `--gdy-ring` | Anillo de foco de una tarjeta. |
| `--gdy-kanban-card-bg`, `--gdy-kanban-card-border` | `--gdy-card`, `--gdy-border` | Fondo y borde de la tarjeta, como en el kanban. |

### Clases por parte

`className` agrega clases a la raíz, después de `gdy-card-grid` y sus marcas. `classNames`
(`CardGridClassNames`) agrega una clase por parte, después de su gancho:

| Clave | Gancho |
|---|---|
| `root` | `gdy-card-grid` |
| `toolbar` | `gdy-toolbar` |
| `filterRow` | `gdy-kanban-filter-row`, solo si alguna columna es filtrable |
| `list` | `gdy-card-grid-list` |
| `card` | `gdy-card-grid-card`, tanto la tarjeta por defecto como la propia |
| `pagination` | `gdy-table-pagination` |
| `empty` | `gdy-empty` |

## Referencia de props

Props propias de `CardGridProps<TData>`, en el orden del código.

| Prop | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `labels` | `Partial<CardGridLabels>` | textos en español | Reemplaza cualquier texto. Ver [Textos e idioma](#textos-e-idioma). |
| `columns` | `ColumnDefinition<TData>[]` | — | Columnas para buscar, filtrar, ordenar y dibujar las tarjetas (obligatoria). |
| `data` | `DataInput<TData>` | — | Filas: un array o un sobre de API (obligatoria). |
| `normalizeRow` | `(row: unknown, index: number) => TData` | — | Convierte cada registro de un sobre a `TData`. |
| `getRowId` | `(row: TData, index: number) => string` | posición en `data` | Key y `data-row-id` de cada tarjeta. |
| `features` | `CardGridFeatures` | todas `true` | Interruptores de funciones. |
| `renderCard` | `(row: TData) => ReactNode` | — | Contenido propio de cada tarjeta. |
| `onRowClick` | `(row: TData, event: CardClickEvent) => void` | — | Clic en una tarjeta, o Enter con foco. |
| `getRowHref` | `(row: TData) => string \| undefined` | — | Convierte una tarjeta en enlace. |
| `pageSizeOptions` | `number[]` | `[15, 25, 50, 100]` | Opciones del selector de tamaño de página. |
| `defaultPageSize` | `number` | `25` | Tamaño de página inicial. |
| `pageIndex` | `number` | — | Página controlada (desde 0). |
| `pageSize` | `number` | — | Tamaño de página controlado. |
| `onPaginationChange` | `(state: ManualPaginationState) => void` | — | Cambió la página o el tamaño de página. |
| `onVisibleRowsChange` | `(state: VisibleRowsState<TData>) => void` | — | Tarjetas visibles al montar y después de cada cambio. |
| `search`, `onSearchChange` | `string`, `(query: string) => void` | — | Búsqueda controlada. |
| `sorting`, `onSortChange` | `ColumnSortingState \| null`, `(sorting) => void` | — | Orden controlado. |
| `columnFilters`, `onFiltersChange` | `ColumnFiltersState`, `(filters) => void` | — | Filtros controlados. |
| `className` | `string` | — | Clases extra para la raíz. |
| `classNames` | `CardGridClassNames` | — | Una clase por parte. Ver [Clases por parte](#clases-por-parte). |

`CardGridProps` acepta además todas las props de `DataViewProps` salvo `viewSwitch` (`searchPlaceholder`,
`createLabel`, `onCreate`, `emptyMessage`, `loading`, `loadingRowCount`, `renderLoading`, `rowActions`,
`archivedView`, `aiButton`, `toggleGroups`, `headerSelectors`, `toolbarLayout`, `toolbarSlots`,
`selectTheme`, `thinScrollbars`, `scrollbarColor`, `optionHoverColor`, `dateFilterRequireOperator`,
`dateInputFormat`, `calendarMonthYearDropdown`, `calendarFromYear`, `calendarToYear`, `calendarLocale`),
documentadas en [toolbar.es.md](toolbar.es.md).

### Tipos

- `CardGridLabels`: todos los textos de la grilla, la forma de `labels`.
- `CardGridFeatures`: los interruptores opcionales de `features`.
- `CardClickEvent`: `MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>`, el segundo argumento de `onRowClick`.
- `CardGridClassNames`: las clases opcionales por parte de `classNames`.
- `VisibleRowsState<TData>`, `ManualPaginationState`, `ColumnSortingState` y `ColumnFiltersState`: los
  mismos tipos que en `DataTable`, exportados también desde `gridory/card-grid`.
