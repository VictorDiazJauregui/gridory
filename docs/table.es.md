# DataTable

[English](table.md) · [Español](table.es.md)

`DataTable` renderiza filas tipadas a partir de una lista de definiciones de columna y añade búsqueda
global, ordenamiento, filtros por columna, agrupado de filas, paginación, edición en línea y un menú de
acciones por fila. Nunca modifica tus datos: cada cambio se emite por un callback y tu app decide qué
hacer con él.

## Importación

```ts
import { DataTable, type ColumnDefinition } from "gridory/table";
```

Importa `gridory/styles.css` una sola vez en tu app, antes de sobrescribir cualquier estilo (consulta
[theming.es.md](theming.es.md)). La entrada raíz `gridory` reexporta los mismos nombres.

## Ejemplo rápido

```tsx
import { DataTable, type ColumnDefinition } from "gridory/table";

interface Invoice {
  id: string;
  customer: string;
  status: "draft" | "sent" | "paid";
  amount: number;
  issuedAt: string;
}

const columns: ColumnDefinition<Invoice>[] = [
  { id: "customer", header: "Customer", accessor: (row) => row.customer, sortable: true, width: 220 },
  {
    id: "status",
    header: "Status",
    accessor: (row) => row.status,
    searchable: false,
    filterable: true,
    filterOptions: [
      { value: "draft", label: "Draft" },
      { value: "sent", label: "Sent" },
      { value: "paid", label: "Paid" },
    ],
  },
  {
    id: "amount",
    header: "Amount",
    accessor: (row) => row.amount,
    type: "number",
    sortable: true,
    cell: (row) => `$${row.amount.toFixed(2)}`,
  },
  { id: "issuedAt", header: "Issued", accessor: (row) => row.issuedAt, type: "date", filterable: true },
];

const invoices: Invoice[] = [
  { id: "1", customer: "Acme", status: "paid", amount: 1200, issuedAt: "2026-03-01" },
  { id: "2", customer: "Globex", status: "sent", amount: 450.5, issuedAt: "2026-03-12" },
];

const openInvoice = (invoice: Invoice) => window.open(`/invoices/${invoice.id}`);

export const InvoicesTable = () => (
  <DataTable columns={columns} data={invoices} getRowId={(row) => row.id} onRowClick={openInvoice} />
);
```

## Modelo de datos

### Filas

`data` acepta un array plano o un envoltorio de API (`DataInput<TData>`): un objeto con alguna de las
claves `data`, `items`, `results`, `records` o `payload.data` / `payload.items` / `payload.results`. Se
usa la primera de esas claves que esté definida, en ese orden; si no contiene un array, la tabla no
renderiza filas. `normalizeRow(raw, index)` convierte cada registro del envoltorio en `TData`. Un array
plano se usa tal cual, así que `normalizeRow` no se le aplica.

`getRowId(row, index)` da a cada fila una clave estable. Sin él, las filas se identifican por su índice
en la página actual, así que pásalo siempre que se inserten, eliminen o reordenen filas.

### Columnas

Cada entrada de `columns` es un `ColumnDefinition<TData>`.

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `string` | Id único. Lo usan `groupableColumnIds` y `defaultGroupBy` para referirse a la columna. |
| `header` | `string` | Texto del encabezado. También es la etiqueta de la columna en el selector de agrupado. |
| `accessor` | `(row: TData) => Primitive \| Primitive[]` | Valor que usan la búsqueda, los filtros, el ordenamiento, el agrupado y el texto por defecto de la celda. Los arrays se unen con `", "` en la celda; el ordenamiento, el agrupado y los resaltados usan el primer elemento. Los valores vacíos se muestran como `—`. |
| `cell` | `(row: TData) => ReactNode` | Render personalizado de la celda. La búsqueda, los filtros y el ordenamiento siguen leyendo `accessor`. |
| `type` | `"text" \| "number" \| "date"` | Elige el comparador de ordenamiento. `"date"` además cambia el filtro de valores por un filtro de fechas. Por defecto `"text"`. |
| `sortable` | `boolean` | Por defecto `true`. Ponlo en `false` para excluir la columna del ordenamiento. |
| `searchable` | `boolean` | Por defecto `true`. Ponlo en `false` para excluir la columna de la búsqueda global. |
| `filterable` | `boolean` | Añade un menú de filtro al encabezado. Por defecto `false`. |
| `filterOptions` | `FilterOption[]` | Opciones `{ value, label }` declaradas para el menú de filtro. Sin ellas, las opciones son los valores distintos que aparecen en `data`, en orden alfabético. También dan etiqueta y orden a los grupos al agrupar por esta columna. |
| `width` | `number` | Ancho de la columna en píxeles. La tabla usa `table-layout: fixed`. |
| `inlineEditOptions` | `FilterOption[]` | Junto con `onInlineEdit`, renderiza la celda como un select con estas opciones. |
| `onInlineEdit` | `(row: TData, value: string) => void` | Se dispara con el valor de la opción elegida. |
| `valueHighlights` | `Record<string, CellHighlight>` | `{ className?, style? }` indexado por valor de celda. `className` se añade al contenido de la celda; `style` se aplica al botón que abre el select en línea, así que solo se ve en celdas editables en línea. |

Las opciones de filtro se calculan con todas las filas de `data` (antes de la búsqueda y los filtros), no
solo con la página visible. Las columnas con `type: "date"` nunca reciben una lista de valores: su menú
ofrece los operadores mayor que, menor que y entre, con un calendario.

## Features

`features` activa o desactiva capacidades completas. Todos los flags son `true` por defecto.

| Flag | Por defecto | Efecto con `false` |
|---|---|---|
| `search` | `true` | Oculta la caja de búsqueda y omite la etapa de búsqueda. |
| `sorting` | `true` | No se puede ordenar desde los encabezados ni desde los menús de filtro. |
| `filtering` | `true` | Sin menús de filtro ni botón de limpiar filtros; los filtros no se aplican. |
| `pagination` | `true` | Oculta el pie y renderiza todas las filas. |
| `rowActions` | `true` | Oculta la columna de acciones de fila aunque `rowActions` esté definido. |
| `createButton` | `true` | Oculta el botón de crear aunque `onCreate` esté definido. |
| `grouping` | `true` | Oculta el selector de agrupado y renderiza las filas sin agrupar. |

### Búsqueda

La caja de búsqueda de la toolbar (`searchPlaceholder`, por defecto `"Buscar..."`) conserva las filas en
las que alguna columna buscable contiene el texto buscado, sin distinguir mayúsculas, sobre los valores
que devuelve `accessor`. Todas las columnas son buscables salvo las que declaran `searchable: false`.
Cada cambio también llama a `onSearchChange`. Con `manualPagination` no se filtra en local y la búsqueda
solo se notifica.

### Ordenamiento

Solo hay un orden activo a la vez. En una columna ordenable sin menú de filtro, el clic en el encabezado
alterna entre ascendente, descendente y sin orden, y el encabezado muestra la flecha correspondiente. En
una columna filtrable, el orden está en su menú de filtro, bajo "Ordenar": dos botones, ascendente y
descendente, con `aria-pressed`; si haces clic en el activo, se quita el orden. El botón "Limpiar" del
menú de filtro de fechas borra tanto el filtro como el orden de esa columna.

El comparador depende de `type`: `"text"` compara según el locale (`es`), ignora mayúsculas y acentos y
compara numéricamente las secuencias de dígitos; `"number"` compara `Number(value)`; `"date"` compara
como texto los diez primeros caracteres del valor, así que cadenas ISO como `"2026-03-01"` o
`"2026-03-01T10:00:00Z"` se ordenan por día. Los valores de tipo array se ordenan por su primer elemento.

### Filtros

El encabezado de una columna `filterable` abre un menú: una lista de valores con casillas y buscador para
las columnas de texto y número, y un filtro de fechas con los operadores mayor que, menor que y entre
para `type: "date"`. El botón del encabezado lleva `data-filtered` mientras hay un filtro activo, y la
toolbar muestra un botón para limpiar filtros. Los menús de filtro, los inputs de fecha y las opciones
del calendario se comparten con el kanban y están documentados en [toolbar.es.md](toolbar.es.md).

### Agrupado

`groupableColumnIds` lista los ids de las columnas por las que el usuario puede agrupar. El selector de
agrupado aparece en la toolbar solo cuando apunta al menos a una columna existente y `features.grouping`
está activo; sus opciones muestran el `header` de cada columna. `defaultGroupBy` fija la columna inicial
y se ignora si no está en `groupableColumnIds`. `onGroupChange` se dispara con el id de la columna, o
`null` para "ninguno", solo cuando el cambio lo hace el usuario.

Tres textos vienen en español por defecto: `groupSelectorLabel` (`"Agrupar por"`, antepuesto a cada
opción del selector), `groupNoneLabel` (`"Ninguno"`) y `groupEmptyValueLabel` (`"Sin valor"`, el grupo
de las filas con valor vacío).

Mientras una columna está agrupada:

- Esa columna desaparece del encabezado y de las celdas; su valor lo muestra la fila de grupo.
- Antes de la primera fila de cada grupo va una fila de grupo con un botón de plegado: chevron, etiqueta
  y número de filas. Los grupos empiezan expandidos; el botón contrae o expande el grupo y expone
  `aria-expanded`.
- Primero van los grupos que figuran en las `filterOptions` de la columna, en ese orden y con su
  `label`; después, los valores sin opción, en orden alfabético y con el valor tal cual como etiqueta; el
  grupo vacío va al final.
- El agrupado se aplica después de la búsqueda, los filtros y el orden, así que las filas mantienen su
  orden dentro de cada grupo.
- La paginación trabaja sobre la lista plana: un grupo contraído oculta sus filas, pero siguen contando
  en la página.
- Elegir otra columna o "ninguno" expande todos los grupos y vuelve a la primera página.

```tsx
<DataTable
  columns={columns}
  data={invoices}
  getRowId={(row) => row.id}
  groupableColumnIds={["status"]}
  defaultGroupBy="status"
  onGroupChange={(groupBy) => setGroupBy(groupBy)}
  groupSelectorLabel="Group by"
  groupNoneLabel="None"
  groupEmptyValueLabel="No value"
/>
```

### Paginación

Por defecto, la tabla pagina en memoria. `pageSizeOptions` (por defecto `[15, 25, 50, 100]`) alimenta el
select de tamaño de página y `defaultPageSize` (por defecto `50`) elige el tamaño inicial. El pie muestra
un resumen, `Mostrando 1–50 de 120 elementos` (o `0 elementos` si nada coincide), el select
`Elementos por página` y `Página 1 de 3` con botones de anterior y siguiente. `label` reemplaza la
palabra `"elementos"`. Cualquier cambio de búsqueda, filtro, orden, agrupado o vista de archivados vuelve
a la primera página. `features.pagination: false` oculta el pie y renderiza todas las filas.

Con `manualPagination`, la tabla renderiza `data` como la página actual, sin recortarla ni contarla. El
número de páginas sale de `serverPageCount`, o de `ceil(serverRowCount / pageSize)`; si no llega ninguno
de los dos, se calcula con la longitud de `data`, así que pasa siempre uno de ellos. `serverRowCount` es
además el total que muestra el resumen. `onPaginationChange({ pageIndex, pageSize })` se dispara cuando
el usuario cambia de página o de tamaño de página; `onSearchChange(query)` se dispara en cada cambio de
búsqueda, que además devuelve la tabla a la primera página. Los filtros por columna, el orden, el
agrupado y la vista de archivados se siguen aplicando en local sobre las filas de la página actual.

```tsx
<DataTable
  columns={columns}
  data={page.rows}
  getRowId={(row) => row.id}
  manualPagination
  serverRowCount={page.total}
  defaultPageSize={25}
  pageSizeOptions={[25, 50]}
  onPaginationChange={({ pageIndex, pageSize }) => fetchPage({ pageIndex, pageSize, query })}
  onSearchChange={(nextQuery) => fetchPage({ pageIndex: 0, pageSize, query: nextQuery })}
/>
```

### Edición en línea

Una columna con `inlineEditOptions` no vacío y un callback `onInlineEdit` renderiza sus celdas como un
select. El select muestra el valor actual cuando coincide con alguna de las opciones y, si no, el
placeholder `"Seleccionar..."`. Al elegir una opción se llama a `onInlineEdit(row, value)`; la tabla no
modifica la fila, así que actualiza tus datos y la celda se vuelve a renderizar. Los clics dentro del
select no disparan `onRowClick`. El select sigue a `selectTheme`, igual que el resto de selects del
componente.

```tsx
{
  id: "status",
  header: "Status",
  accessor: (row) => row.status,
  inlineEditOptions: [
    { value: "draft", label: "Draft" },
    { value: "sent", label: "Sent" },
  ],
  onInlineEdit: (row, value) => updateStatus(row.id, value),
  valueHighlights: {
    paid: { style: { background: "#dcfce7", color: "#166534" } },
  },
}
```

### Clic en fila

`onRowClick(row)` se dispara al hacer clic en una fila de datos. En ese caso las filas llevan
`data-clickable`, que la hoja de estilos usa para el cursor de puntero y el fondo en hover. El menú de
acciones de fila y el select en línea detienen el clic, así que nunca lo disparan.

### Layout y scroll

Por defecto, el contenedor de filas (`gdy-table-wrap`) hace scroll horizontal y crece con su contenido,
con una altura mínima que define `tableMinHeightClassName` (por defecto `"gdy-table-min-h-md"`). Dos
props crean una región de scroll vertical interna:

- `tableMaxHeightClassName` limita la altura del contenedor de filas y le da scroll propio; no necesita
  un padre con altura acotada.
- `fillHeight` hace que la tabla ocupe su padre: la raíz y la tarjeta pasan a ser una columna flex y el
  contenedor de filas toma la altura restante. El padre debe tener una altura acotada.

Las utilidades incluidas son `gdy-table-min-h-sm` (240px), `gdy-table-min-h-md` (360px),
`gdy-table-min-h-lg` (520px), `gdy-table-max-h-sm` (320px), `gdy-table-max-h-md` (480px) y
`gdy-table-max-h-lg` (640px). También sirve cualquier clase propia; un `tableMinHeightClassName` vacío
quita la altura mínima. `tableWrapClassName` añade clases extra al contenedor de filas, después de las
clases de altura mínima y máxima.

`stickyHeader` (por defecto `true`) fija el encabezado en la parte superior del contenedor de filas. Solo
tiene efecto junto con `fillHeight` o `tableMaxHeightClassName`, así que no afecta a una tabla que hace
scroll con la página. `scrollResetOnPageChange` (por defecto `true`) lleva el scroll del contenedor de
filas arriba en cada cambio de página o de tamaño de página, y siempre que un cambio de búsqueda, filtro,
orden, agrupado o vista de archivados vuelve a la primera página. `thinScrollbars` (por defecto `true`)
muestra barras de scroll finas en todas las áreas de scroll internas; `scrollbarColor` define el color
del thumb (consulta [toolbar.es.md](toolbar.es.md)).

```tsx
<div style={{ height: "calc(100vh - 120px)" }}>
  <DataTable columns={columns} data={invoices} getRowId={(row) => row.id} fillHeight />
</div>
```

## Eventos

| Callback | Firma | Se dispara |
|---|---|---|
| `onRowClick` | `(row: TData) => void` | Al hacer clic en una fila de datos (no en el menú de acciones de fila ni en el select en línea). |
| `onGroupChange` | `(groupBy: string \| null) => void` | Cuando el usuario cambia el selector de agrupado; `null` significa "ninguno". No se dispara al montar. |
| `onPaginationChange` | `(state: ManualPaginationState) => void` | Al pasar a la página anterior o siguiente, o al cambiar el tamaño de página, en los dos modos de paginación. |
| `onSearchChange` | `(query: string) => void` | En cada cambio de la caja de búsqueda, en los dos modos de paginación. |
| `ColumnDefinition.onInlineEdit` | `(row: TData, value: string) => void` | Al elegir una opción en una celda editable en línea. |

`onCreate`, los callbacks de `rowActions` (`onEdit`, `onArchive`, `onArchiveToggle`, `onRemove`,
`onHistory`, acciones personalizadas), `archivedView.onChange`, `viewSwitch.onChange`, `aiButton.onClick`
y el `onChange` de los toggles y de los selectores del encabezado pertenecen a `DataViewProps`; consulta
[toolbar.es.md](toolbar.es.md).

## Toolbar y acciones de fila

La toolbar que hay sobre las filas (caja de búsqueda, botón de limpiar filtros, selector de vista de
archivados, selector de agrupado, botón de IA, selector tabla/kanban, botón de crear, grupos de toggles
personalizados y selectores del encabezado, y el `toolbarLayout` que los ordena) y el menú de acciones al
final de cada fila (acciones integradas de editar, archivar, eliminar e historial, más `customActions` y
`menuActions`) se comparten con el kanban. Se configuran con `DataViewProps` y están documentados en
[toolbar.es.md](toolbar.es.md).

## Estilos

El elemento raíz es `div.gdy-table`, que además lleva las clases `gdy-table-fill` (con `fillHeight`),
`gdy-table-sticky` (cuando el encabezado sticky tiene efecto) y `gdy-thin-scroll` (con `thinScrollbars`).
Dentro, `div.gdy-scope.gdy-card` envuelve la toolbar, el contenedor de filas `div.gdy-table-wrap.gdy-scroll`
y el pie de paginación. Cada regla de la hoja de estilos usa una sola clase, así que una regla con la
misma clase en tu CSS, cargada después de `gridory/styles.css`, la sobrescribe.

| Gancho | Elemento | Atributos de estado |
|---|---|---|
| `gdy-table-head-cell` | Celda de encabezado (`th`). | — |
| `gdy-table-head-trigger` | Botón dentro de la celda de encabezado que abre el menú de filtro o alterna el orden. | `data-filtered` mientras la columna tiene un filtro activo. |
| `gdy-table-row` | Fila de datos (`tr`). | `data-clickable` cuando se pasa `onRowClick`. |
| `gdy-table-cell` | Celda de datos (`td`); `gdy-table-cell-content` envuelve su contenido. | — |
| `gdy-table-group-row` | Fila de grupo; `gdy-table-group-cell` es su única celda. | — |
| `gdy-table-group-toggle` | Botón de plegado de un grupo, con `gdy-table-group-label` y `gdy-table-group-count`. | `aria-expanded`. |
| `gdy-table-empty-row` | Fila que aparece cuando ninguna fila coincide; su celda es `gdy-table-cell gdy-empty`. | — |
| `gdy-table-pagination` | Pie, con `gdy-table-pagination-left`, `gdy-table-pagination-right`, `gdy-table-pagination-text` y `gdy-table-page-size`. | — |

Los botones de orden de un menú de filtro llevan `aria-pressed` en la dirección activa. La tabla lee
estos tokens, cada uno con un fallback a un token base, así que basta con declararlos en `:root` o en el
ámbito de tu tema oscuro:

| Token | Fallback | Se aplica a |
|---|---|---|
| `--gdy-table-head-bg` | `--gdy-muted` | Fondo de la fila de encabezado, incluido el encabezado sticky. |
| `--gdy-table-head-fg` | `--gdy-muted-foreground` | Texto del encabezado. |
| `--gdy-table-border` | `--gdy-border` | Bordes de las celdas, de las celdas de grupo y del pie. |
| `--gdy-table-row-hover-bg` | `--gdy-muted` | Hover de las filas clicables. |
| `--gdy-table-group-bg` | `--gdy-accent` | Fondo de la fila de grupo. |

```css
:root {
  --gdy-table-head-bg: #f1f5f9;
  --gdy-table-row-hover-bg: #eef2ff;
}

.gdy-table-row[data-clickable]:hover .gdy-table-cell {
  background: var(--gdy-table-row-hover-bg);
}

.gdy-table-group-toggle[aria-expanded="false"] .gdy-table-group-label {
  opacity: 0.7;
}
```

El contrato de estilos, los tokens base y los temas claro y oscuro están en [theming.es.md](theming.es.md);
el catálogo completo de clases, atributos de estado y tokens está en [style-hooks.es.md](style-hooks.es.md).

## Referencia de props

Props propias de `DataTableProps<TData>`, en el orden del código fuente.

| Prop | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `columns` | `ColumnDefinition<TData>[]` | — | Definiciones de columna (obligatoria). |
| `data` | `DataInput<TData>` | — | Filas: un array o un envoltorio de API (obligatoria). |
| `normalizeRow` | `(row: unknown, index: number) => TData` | — | Convierte cada registro del envoltorio en `TData`. |
| `getRowId` | `(row: TData, index: number) => string` | — | Clave estable de la fila. Sin ella, las filas se identifican por índice. |
| `features` | `DataTableFeatures` | todos `true` | Flags de capacidades. |
| `onRowClick` | `(row: TData) => void` | — | Callback del clic en fila; marca las filas con `data-clickable`. |
| `label` | `string` | `"elementos"` | Sustantivo que usa el resumen de paginación. |
| `pageSizeOptions` | `number[]` | `[15, 25, 50, 100]` | Opciones del select de tamaño de página. |
| `defaultPageSize` | `number` | `50` | Tamaño de página inicial. |
| `manualPagination` | `boolean` | `false` | Modo servidor: `data` es la página actual. |
| `serverRowCount` | `number` | — | Total de filas en el servidor; de él salen el número de páginas y el total del resumen. |
| `serverPageCount` | `number` | — | Total de páginas en el servidor; tiene prioridad sobre `serverRowCount`. |
| `onPaginationChange` | `(state: ManualPaginationState) => void` | — | Cambio de página o de tamaño de página. |
| `onSearchChange` | `(query: string) => void` | — | Cambio en la caja de búsqueda. |
| `tableWrapClassName` | `string` | — | Clases extra para el contenedor de filas. |
| `tableMinHeightClassName` | `string` | `"gdy-table-min-h-md"` | Clase de altura mínima del contenedor de filas. |
| `tableMaxHeightClassName` | `string` | — | Clase de altura máxima del contenedor de filas; activa el scroll interno. |
| `scrollResetOnPageChange` | `boolean` | `true` | Lleva el scroll del contenedor de filas arriba al cambiar de página. |
| `stickyHeader` | `boolean` | `true` | Fija el encabezado cuando las filas hacen scroll interno. |
| `fillHeight` | `boolean` | `false` | Ocupa la altura del padre; el contenedor de filas hace scroll. |
| `groupableColumnIds` | `string[]` | — | Columnas que ofrece el selector de agrupado. |
| `defaultGroupBy` | `string \| null` | `null` | Columna agrupada al inicio. |
| `onGroupChange` | `(groupBy: string \| null) => void` | — | Cambio en el selector de agrupado. |
| `groupSelectorLabel` | `string` | `"Agrupar por"` | Prefijo de cada opción del selector de agrupado. |
| `groupNoneLabel` | `string` | `"Ninguno"` | Etiqueta de la opción "sin agrupar". |
| `groupEmptyValueLabel` | `string` | `"Sin valor"` | Etiqueta del grupo de valores vacíos. |

`DataTableProps` también acepta todas las props de `DataViewProps` (`searchPlaceholder`, `createLabel`,
`onCreate`, `emptyMessage`, `rowActions`, `archivedView`, `viewSwitch`, `aiButton`, `toggleGroups`,
`headerSelectors`, `toolbarLayout`, `selectTheme`, `thinScrollbars`, `scrollbarColor`,
`optionHoverColor`, `dateFilterRequireOperator`, `dateInputFormat`, `calendarMonthYearDropdown`,
`calendarFromYear`, `calendarToYear`), documentadas en [toolbar.es.md](toolbar.es.md).

### Tipos

Todos se exportan desde `gridory/table` y `gridory`.

- `DataTableFeatures`: los flags booleanos opcionales de `features` (`search`, `sorting`, `filtering`,
  `pagination`, `rowActions`, `createButton`, `grouping`).
- `GroupHeader`: `{ value: string; label: string; count: number }`, una fila de grupo.
- `RowGroupingResult<TData>`: `{ flatRows: TData[]; headers: Map<number, GroupHeader> }`, las filas
  agrupadas, con cada encabezado indexado por el índice de su primera fila.
- `ManualPaginationState`: `{ pageIndex: number; pageSize: number }`, el payload de
  `onPaginationChange`.
- `ColumnSortingState`: `{ id: string; direction: SortDirection }`, el orden activo de una columna.
