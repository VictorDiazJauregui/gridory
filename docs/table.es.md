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
| `align` | `"left" \| "center" \| "right"` | Alinea las celdas y el encabezado. Ver [Alineación](#alineación). Solo la tabla. |
| `headerAlign` | `"left" \| "center" \| "right"` | Alinea el encabezado aparte de las celdas. Por defecto copia `align`. Solo la tabla. |
| `ignoreRowClick` | `boolean` | Ningún gesto que empiece en esta columna dispara la fila. Ver [Clic en fila y filas como enlace](#clic-en-fila-y-filas-como-enlace). Solo la tabla. |
| `overflow` | `"ellipsis" \| "wrap" \| "visible"` | Qué hacen las celdas con un contenido más ancho que la columna. Por defecto `"ellipsis"`. Ver [Recorte de celdas](#recorte-de-celdas). Solo la tabla. |
| `footer` | `(context: ColumnFooterContext<TData>) => ReactNode` | Contenido de esta columna en la fila de totales. Ver [Fila de totales](#fila-de-totales). Solo la tabla. |
| `printValue` | `(row: TData) => string` | Con `printMode`, el texto que imprime la celda en lugar de su contenido. Ver [Impresión](#impresión). Solo la tabla. |
| `hideable` | `boolean` | Con `responsiveColumns`, la columna puede ocultarse cuando no entra. Ver [Visibilidad de columnas](#visibilidad-de-columnas). Solo la tabla. |
| `priority` | `number` | Con `responsiveColumns`, el número más bajo se oculta primero; implica `hideable`. Solo la tabla. |
| `headerTooltip` | `string` | Texto de ayuda detrás de un "?" junto al título. Ver [Ayuda y contenido en el encabezado](#ayuda-y-contenido-en-el-encabezado). Solo la tabla. |
| `headerTooltipPlacement` | `"before" \| "after" \| "edge"` | Dónde va el "?". Por defecto `"after"` (`"before"` con un encabezado alineado a la derecha). Solo la tabla. |
| `headerContent` | `ReactNode` | Reemplaza el título visible; `header` sigue siendo el nombre accesible y el texto de los menús. Solo la tabla. |
| `pin` | `"left" \| "right"` | Deja la columna en ese borde mientras las filas se desplazan de costado. Requiere `width`. Ver [Columnas fijas](#columnas-fijas). Solo la tabla. |

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
| `toolbar` | `true` | `false` no pinta la barra (con su búsqueda, slots y botones), para una tabla anidada en el detalle de una fila. |

### Búsqueda

La caja de búsqueda de la toolbar (`searchPlaceholder`, por defecto `"Buscar..."`) conserva las filas en
las que alguna columna buscable contiene el texto buscado, sin distinguir mayúsculas ni acentos (`peru`
encuentra `Perú`), sobre los valores que devuelve `accessor`. Todas las columnas son buscables salvo las
que declaran `searchable: false`. Cada cambio también llama a `onSearchChange` con el texto tal cual lo
escribió el usuario (tras una pausa con `searchDebounceMs`). Con `manualPagination` no se filtra en
local y la búsqueda solo se notifica. Para manejar el texto desde tu app, mira
[Búsqueda](#búsqueda-1) en Estado controlado.

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
agrupado y la vista de archivados se siguen aplicando en local sobre las filas de la página actual;
para ordenar o filtrar en el servidor, usa `manualSorting` y `manualFiltering`
([Estado controlado](#estado-controlado)).

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

### Estado controlado

Parte del estado de la tabla puede manejarlo tu app. El patrón es el de un input de React: pasa el valor
y su manejador `on…Change`, y la tabla muestra exactamente ese valor y solo avisa lo que hace el
usuario; deja el valor en `undefined` y la tabla guarda el estado por su cuenta, como hasta ahora. `null`
es un valor ("sin orden"), no "no controlado". Elige un modo para toda la vida de la tabla: cambiarlo
después de montarla deja un aviso en consola en las builds de desarrollo.

#### Orden

- `sorting` (`ColumnSortingState | null`) fija el orden activo.
- `onSortChange(sorting)` se dispara en cada cambio de orden que hace el usuario, controlado o no: clic
  en el encabezado (ascendente, descendente, nada), los botones "Ordenar" de un menú de filtro y el botón
  "Limpiar" de un filtro de fecha. No se dispara cuando cambia la prop `sorting`.
- `manualSorting` (por defecto `false`) indica que ordena el servidor: la tabla nunca reordena `data` y
  solo avisa el orden. Al cambiarlo vuelve a la primera página; `onPaginationChange({ pageIndex: 0, pageSize })`
  se dispara solo si no estaba ya en la primera página, así un único pedido cubre los dos cambios.

```tsx
const [sorting, setSorting] = useState<ColumnSortingState | null>(null);
const [page, setPage] = useState({ pageIndex: 0, pageSize: 25 });

// Un solo efecto pide lo que haya cambiado: el orden, la página o los dos.
useEffect(() => {
  fetchInvoices({ ...page, sort: sorting }).then(setResult);
}, [sorting, page]);

<DataTable
  columns={columns}
  data={result.rows}
  manualPagination
  manualSorting
  serverRowCount={result.total}
  defaultPageSize={25}
  sorting={sorting}
  onSortChange={setSorting}
  onPaginationChange={setPage}
/>;
```

#### Filtros controlados

- `columnFilters` (`ColumnFiltersState`) fija los filtros de valores y de fecha:
  `{ values: { status: ["Activa"] }, dates: { createdAt: { op: "gt", date: "2026-01-01", dateFrom: "", dateTo: "" } } }`.
- `onFiltersChange(filters)` se dispara cuando el usuario cambia los filtros activos, controlado o no: un
  menú de valores, el botón "Aplicar" o "Limpiar" de un menú de fecha y "Limpiar filtros", que avisa
  `{ values: {}, dates: {} }`. Recibe **solo los filtros activos**: ninguna columna con la selección
  vacía ni un filtro de fecha incompleto (un operador sin su fecha), así que se puede mandar tal cual al
  servidor. No se dispara si no cambió nada activo, ni cuando cambia la prop `columnFilters`.
- `manualFiltering` (por defecto `false`) indica que filtra el servidor: la tabla nunca filtra `data` y
  solo avisa los filtros. Al cambiarlos vuelve a la primera página; `onPaginationChange` se dispara solo
  si no estaba ya en la primera página.
- Los menús de valores listan las `filterOptions` de la columna cuando las tiene. Si no, listan los
  valores de las filas cargadas, que con `manualFiltering` ya vienen filtradas (y con
  `manualPagination`, son una sola página): la tabla suma los valores marcados para que siempre se
  puedan desmarcar, pero faltan los demás valores del servidor. **Pasa las `filterOptions` de cada
  columna filtrable cuando filtra el servidor.**

```tsx
const [filters, setFilters] = useState<ColumnFiltersState>({ values: {}, dates: {} });

useEffect(() => {
  fetchInvoices({ ...page, sort: sorting, filters }).then(setResult);
}, [sorting, filters, page]);

<DataTable
  columns={columns} // cada columna filtrable con sus filterOptions
  data={result.rows}
  manualPagination
  manualSorting
  manualFiltering
  serverRowCount={result.total}
  columnFilters={filters}
  onFiltersChange={setFilters}
  sorting={sorting}
  onSortChange={setSorting}
  onPaginationChange={setPage}
/>;
```

#### Página y tamaño de página

- `pageIndex` (desde 0) y `pageSize` se controlan por separado; `onPaginationChange` mantiene su firma
  y siempre trae los dos valores. `pageIndex={0}` vuelve a la primera página sin remontar la tabla (la
  búsqueda, los filtros y el orden se mantienen).
- Mientras `pageIndex` está controlado, cada página que la tabla elige por su cuenta se avisa con
  `onPaginationChange` para que tu estado la siga: la primera página después de un cambio de búsqueda,
  filtro, orden, agrupado o vista de archivados, y la última cuando la que pasas está fuera de rango (se
  muestra al instante, se avisa una vez y nunca mientras `loading`). Sin `pageIndex` esos cambios siguen
  en silencio, como hasta ahora.
- Un `pageSize` cambiado desde fuera vuelve a la primera página, igual que el select de tamaño. Un
  tamaño que no está en `pageSizeOptions` (por ejemplo `13`) aparece en el select mientras está activo.

#### Búsqueda

- `search` fija el texto de la caja de búsqueda. `onSearchChange(query)` mantiene su firma y solo avisa
  lo que escribe el usuario, nunca los cambios de la prop.
- `searchDebounceMs` espera esa cantidad de milisegundos sin escribir antes de llamar a
  `onSearchChange`. La caja y la búsqueda local responden al instante: solo espera el aviso. Con
  `manualPagination`, la vuelta a la primera página también espera y llega junto con la búsqueda, así
  un único pedido cubre los dos. Con `search` controlada, la caja conserva lo que escribe el usuario
  mientras espera el aviso, y toma cualquier otro valor que fije tu app (el aviso pendiente se
  descarta). También se descarta si la tabla se desmonta. Sin la prop se avisa cada tecla, como hasta
  ahora.

```tsx
const [query, setQuery] = useState("");
const [page, setPage] = useState({ pageIndex: 0, pageSize: 25 });

<button onClick={() => setPage({ ...page, pageIndex: 0 })}>Primera página</button>
<DataTable
  columns={columns}
  data={result.rows}
  manualPagination
  serverRowCount={result.total}
  search={query}
  searchDebounceMs={300}
  onSearchChange={setQuery}
  pageIndex={page.pageIndex}
  pageSize={page.pageSize}
  onPaginationChange={setPage}
/>;
```

#### Receta: tamaño de página según la altura del contenedor

La tabla no calcula sola el tamaño de sus páginas. Con `pageSize` controlado, mide el contenedor y
divide por el alto de fila (usa el alto de tus filas, con o sin acciones):

```tsx
const ROW_HEIGHT = 40;
const CHROME_HEIGHT = 140; // barra + encabezado + paginación

const usePageSizeByHeight = (element: HTMLElement | null) => {
  const [pageSize, setPageSize] = useState(10);
  useEffect(() => {
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      setPageSize(Math.max(1, Math.floor((entry.contentRect.height - CHROME_HEIGHT) / ROW_HEIGHT)));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);
  return pageSize;
};
```

Pasa el resultado como `pageSize`: cada cambio vuelve a la primera página, y el tamaño aparece en el
select aunque no esté en `pageSizeOptions`.

### Impresión

`printMode` imprime una tabla limpia. Con la prop, la vista de impresión (Ctrl+P, `window.print()`)
oculta la toolbar, la paginación y la columna de acciones entera (encabezado y celdas), deja crecer el
área de filas hasta su contenido (sin scroll interno que corte filas ni encabezado fijo), repite el
encabezado en cada hoja y nunca parte una fila entre dos hojas. La raíz lleva `data-print-mode`.

- `"page"` imprime la página que está en pantalla.
- `"all"` imprime todas las filas que pasan la búsqueda, los filtros y la vista de archivados, en el
  orden de la pantalla. **Los grupos se imprimen desplegados, incluso los que están plegados en
  pantalla.** Al terminar de imprimir, la tabla vuelve a la página y a los grupos plegados que tenía;
  ni `onPaginationChange` ni `onVisibleRowsChange` se disparan por imprimir. La tabla pinta las filas
  extra en el momento en que el navegador anuncia la impresión (`beforeprint`, o la media query
  `print`), así que llegan a la hoja. Miles de filas tardan un momento en pintarse.
- Con `manualPagination` la tabla solo tiene la página actual, así que `"all"` imprime esa página: si
  necesitas todas en papel, carga antes todas las filas.

Sin `printMode` no cambia nada: la tabla se imprime como hasta ahora. Para imprimir a tu manera, deja
la prop afuera y escribe una hoja `@media print` sobre los [ganchos de estilo](style-hooks.es.md).

```tsx
<DataTable columns={columns} data={invoices} printMode="all" />
```

**Controles en papel.** Una casilla o un interruptor no dicen nada en papel, así que con `printMode`:

- La columna de [selección de filas](#selección-de-filas) imprime `"Sí"` o `"No"` en cada fila
  (`labels.printSelected`, `labels.printNotSelected`) y `"Seleccionada"` en el encabezado
  (`labels.printSelectionHeader`). Las filas seleccionadas se imprimen sin su fondo, y en papel la columna
  pasa de 44 a 112 px para que entre ese encabezado.
- Una columna con `printValue` imprime ese texto en lugar de su contenido. La tabla no puede leer los
  controles que dibuja tu `cell`, así que le dices qué significa cada uno:

```tsx
const columns: ColumnDefinition<Company>[] = [
  {
    id: "active",
    header: "Activo",
    accessor: (row) => row.active,
    cell: (row) => <Switch checked={row.active} onCheckedChange={(next) => setActive(row, next)} />,
    printValue: (row) => (row.active ? "Sí" : "No"),
  },
];

<DataTable columns={columns} data={companies} printMode="page" />;
```

El texto impreso va en `span.gdy-table-print-value`, antes del contenido que reemplaza; en pantalla está
oculto y solo existe con `printMode`. Una columna sin `printValue` imprime su contenido, como en pantalla.

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

### Alineación

`align` (`"left"`, `"center"` o `"right"`) alinea una columna: sus celdas y su encabezado, donde el
título y su ícono de orden o de filtro se mueven juntos y conservan su orden (`Monto ↑↓`). Pinta
`data-align` en el `th`, en el disparador del encabezado y en cada `td`; sin él, la columna sigue
alineada a la izquierda y el markup no cambia. `headerAlign` alinea el encabezado aparte de las celdas
y por defecto copia `align`.

La columna de acciones de fila no tiene definición propia, así que se configura desde `rowActions`:

- `columnLabel`: texto del encabezado (por defecto ninguno, el encabezado vacío).
- `pinned`: deja la columna de acciones en el borde derecho mientras las filas se desplazan de costado. Ver
  [Columnas fijas](#columnas-fijas).
- `align`: alineación de ese encabezado y del botón ⋯ (por defecto `"right"`).
- `triggerLabel`: nombre accesible y tooltip del botón ⋯ (por defecto `"Opciones"`). El menú de la
  tarjeta del kanban también lo usa.

```tsx
const columns: ColumnDefinition<Quote>[] = [
  { id: "client", header: "Cliente", accessor: (quote) => quote.client },
  { id: "amount", header: "Monto", accessor: (quote) => quote.amount, type: "number", align: "right" },
];

<DataTable
  columns={columns}
  data={quotes}
  rowActions={{ ...rowActions, columnLabel: "Acciones", align: "center", triggerLabel: "Acciones de la cotización" }}
/>;
```

```css
/* Antes: por posición, y el título del encabezado no se movía (el disparador es una caja flex) */
.gdy-table-grid tr > :nth-child(2) {
  text-align: right;
}

/* Antes: un título falso para la columna de acciones */
.gdy-table-head-row > th:last-child::after {
  content: "Acciones";
}

/* Después: nada, lo hacen `align` y `rowActions.columnLabel` */
```

### Recorte de celdas

Por defecto, cada celda corta su contenido en una línea con puntos suspensivos. `overflow` lo cambia
por columna:

| Valor | Qué hace la celda |
|---|---|
| `"ellipsis"` (por defecto) | Una línea, cortada con `…`. |
| `"wrap"` | Parte el texto en varias líneas (`white-space: normal` y `overflow-wrap: anywhere`). La fila crece en alto; el ancho sigue siendo el de `width` (la grilla usa `table-layout: fixed`). |
| `"visible"` | Deja que el contenido sobresalga de la celda (`overflow: visible`). Pensado para una insignia o un control que sobresale, no para texto: el texto sigue en una línea y se dibuja encima de la celda vecina. |

Pinta `data-overflow` en el `gdy-table-cell-content` de cada celda de la columna; sin la prop no hay
atributo y el CSS es el mismo de antes.

```tsx
const columns: ColumnDefinition<Company>[] = [
  { id: "name", header: "Empresa", accessor: (company) => company.name, width: 200 },
  { id: "notes", header: "Notas", accessor: (company) => company.notes, width: 280, overflow: "wrap" },
];
```

```css
/* Antes: se partían todas las celdas de todas las tablas */
.gdy-table-cell-content {
  white-space: normal;
}

/* Después: nada, `overflow: "wrap"` en la columna que lo necesita */
```

Un combobox o un menú dentro de una celda no necesita `"visible"` cuando su lista se abre en un
portal, como el select de edición en línea: la lista se dibuja fuera de la tabla y nada la corta.
`"visible"` llega solo hasta el borde del contenedor de filas (`gdy-table-wrap`), que tiene scroll: lo
que pase ese borde se corta o suma una barra de scroll.

### Clic en fila y filas como enlace

`onRowClick(row, event)` se dispara al hacer clic en una fila de datos. `event` es el evento de React de
la fila: un clic de mouse, o una tecla cuando la fila es enfocable (ver abajo), con el tipo
`RowClickEvent`. Un handler que solo recibe `row` sigue funcionando. En ese caso las filas llevan
`data-clickable`, que la hoja de estilos usa para el cursor de puntero y el fondo en hover.

`getRowHref(row)` convierte las filas en enlaces sin envolverlas en un `<a>` (el HTML no permite un
`<a>` alrededor de un `<tr>`). La fila lleva `data-href` y:

| Gesto | Con `onRowClick` | Sin `onRowClick` |
|---|---|---|
| Clic | `onRowClick(row, event)`, así decide tu router | Navega al enlace en la misma pestaña |
| Ctrl/Cmd + clic, clic con la rueda | Abre el enlace en otra pestaña (`noopener`) | Igual |
| Enter (fila enfocada) | Igual que un clic | Igual que un clic |
| Ctrl/Cmd + Enter | Abre el enlace en otra pestaña | Igual |

Los destinos `javascript:`, `data:` y `vbscript:` se ignoran: la fila se comporta como si no tuviera
enlace. Devuelve `undefined` en las filas que no deben enlazar.

**Teclado.** `focusableRows` permite que las filas reciban el foco con Tab y se disparen con Enter, con
un anillo de foco visible (`--gdy-table-row-focus-ring`). Por defecto es `false`, así una tabla que ya
usa `onRowClick` conserva el comportamiento de la 1.0.1. Las filas con `getRowHref` son enfocables salvo
que pases `focusableRows={false}`: un enlace al que no se llega con el teclado no sirve. Las filas sin
`onRowClick` ni `getRowHref` nunca son enfocables.

**Qué no dispara la fila.** El menú de acciones de fila y el select en línea, nunca. Una columna con
`ignoreRowClick: true` tampoco, con ningún gesto: úsala para columnas de selects, enlaces o texto para
copiar. Tus propios botones y enlaces en otras columnas siguen llegando a `onRowClick` con un clic
simple, como en la 1.0.1; los gestos que abren el enlace de la fila (Ctrl/Cmd + clic, rueda, Enter) los
saltean y se los dejan al navegador.

```tsx
const navigate = useNavigate();

<DataTable
  columns={columns}
  data={companies}
  getRowId={(company) => company.id}
  getRowHref={(company) => `/companies/${company.id}`}
  onRowClick={(company) => navigate(`/companies/${company.id}`)}
/>;
```

### Ganchos de fila

Cada fila de datos lleva `data-row-id` con su id: el valor de `getRowId` o, si no se pasa, la posición
de la fila en la página actual (`"0"`, `"1"`…, que se repite en cada página y cambia con el orden).
Pasa `getRowId` cuando necesites un id estable.

`getRowClassName(row)` agrega clases después de `gdy-table-row`, y `getRowAttributes(row)` agrega
atributos `data-*` y `aria-*`. Las dos se llaman una vez por fila y render, así que deben ser baratas.

- `undefined` omite el atributo; `false` también lo omite en un `data-*`, pero en un `aria-*` se pinta
  como `"false"`, porque ahí es un estado.
- Los demás nombres, y los que escribe la tabla (`data-row-id`, `data-clickable`, `data-href`), se ignoran. La tabla
  puede sumar atributos propios en versiones siguientes: conviene usar nombres de tu dominio
  (`data-archived`, `data-priority`).

```tsx
<DataTable
  columns={columns}
  data={quotes}
  getRowId={(quote) => quote.id}
  getRowAttributes={(quote) => ({ "data-archived": quote.archived })}
/>
```

```css
/* Antes: llega a la fila a través de una marca dentro de una de sus celdas */
tr:has([data-quote-archived]) {
  opacity: 0.6;
}

/* Después */
.gdy-table-row[data-archived] {
  opacity: 0.6;
}
```

### Fila de totales

Una columna con `footer` agrega una fila de totales: un `tfoot.gdy-table-foot` con un
`tr.gdy-table-foot-row` y un `td.gdy-table-foot-cell` por columna visible (la de acciones incluida,
vacía), cada uno con el `data-column-id` y el `data-align` de su columna, así cada total queda debajo de
su columna y sigue su alineación. La fila solo se pinta si alguna columna visible tiene `footer`; sin
eso no hay `tfoot`.

- `footer(context)` devuelve el contenido de su celda. `context` es el mismo objeto que avisa
  `onVisibleRowsChange` (`ColumnFooterContext<TData>`: `pageRows`, `filteredRows` y `totalRows`, ver
  [Filas visibles](#filas-visibles)), así un total puede cubrir la página o todas las filas filtradas,
  y sigue a la búsqueda, los filtros, el orden, el agrupado y la página. La tabla no suma nada: lo hace
  la función.
- Con `stickyHeader` y un scroll interno (`fillHeight` o `tableMaxHeightClassName`) la fila queda fija
  abajo del área de filas mientras las filas se desplazan. Sin scroll interno, sigue a la última fila.
- Mientras `loading`, las celdas con `footer` muestran una barra fantasma y `footer` no se llama.
- Con `printMode` la fila se imprime una sola vez, después de la última fila (no al pie de cada hoja).
- Se ve como el encabezado (`--gdy-table-foot-bg`, que cae en `--gdy-table-head-bg`) con una línea
  arriba; `classNames.foot` y `classNames.footCell` suman tus clases.

```tsx
// Antes: totales pintados fuera de la tabla, alineados a mano
<DataTable
  columns={columns}
  data={quotes}
  onVisibleRowsChange={({ filteredRows }) => setTotals(sumByCurrency(filteredRows))}
/>
<div className="totals" style={{ paddingLeft: 412 }}>{formatTotals(totals)}</div>

// Después
const columns: ColumnDefinition<Quote>[] = [
  { id: "client", header: "Cliente", accessor: (row) => row.client, footer: () => "Total" },
  {
    id: "amount",
    header: "Monto",
    accessor: (row) => row.amount,
    align: "right",
    footer: ({ filteredRows }) => formatTotals(sumByCurrency(filteredRows)),
  },
];
```

### Selección de filas

`rowSelection` agrega una columna de casillas antes de las columnas de datos: una casilla por fila y una
en el encabezado que marca todas las filas de su alcance. La tabla solo informa los ids seleccionados;
qué hacer con ellos (exportar, borrar, mover) lo decide tu app, por ejemplo con un slot de la toolbar.

```tsx
const [selectedIds, setSelectedIds] = useState<string[]>([]);

<DataTable
  columns={columns}
  data={invoices}
  getRowId={(row) => row.id}
  rowSelection={{ selectedIds, onChange: setSelectedIds, selectAllScope: "filtered" }}
  toolbarSlots={[
    {
      id: "export",
      content: (
        <button type="button" disabled={selectedIds.length === 0} onClick={() => exportInvoices(selectedIds)}>
          Exportar ({selectedIds.length})
        </button>
      ),
    },
  ]}
/>;
```

| Campo | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `selectedIds` | `string[]` | — | Selección controlada; `undefined` la deja a la tabla. |
| `defaultSelectedIds` | `string[]` | `[]` | Selección inicial cuando no es controlada. |
| `onChange` | `(selectedIds: string[]) => void` | — | Cada cambio que hace el usuario, y la limpieza de ids que salieron de `data`. |
| `selectAllScope` | `"page" \| "filtered"` | `"page"` | Qué marca la casilla del encabezado: las filas de la página actual (con los grupos plegados), o todas las que pasan la búsqueda, los filtros y la vista de archivados. |
| `isRowSelectable` | `(row: TData) => boolean` | — | `false` deshabilita la casilla de la fila y la deja fuera de la casilla del encabezado. |

- **`getRowId` es obligatorio.** La selección guarda ids; sin `getRowId` las filas se identifican por
  índice, que cambia con cada orden o página, así que la tabla lanza `MissingRowIdError`. El id no puede
  depender del índice.
- **La casilla del encabezado** está marcada cuando todas las filas seleccionables de su alcance están
  seleccionadas, con `aria-checked="mixed"` cuando solo algunas lo están, y deshabilitada cuando el alcance
  no tiene ninguna. Un clic en una parcial selecciona todo el alcance; un clic en una completa lo limpia.
- **Páginas y `data`.** La selección se conserva al cambiar de página, ordenar y filtrar. Cuando una fila
  seleccionada sale de `data`, su id se quita y `onChange` lo informa.
- **Modo servidor.** Con `manualPagination`, `data` es solo la página actual: la tabla no puede distinguir
  una fila borrada de una que está en otra página, así que conserva todos los ids y tu app quita los que ya
  no existen. Ahí `"filtered"` actúa como `"page"` (la tabla no tiene otras filas), con un aviso en
  desarrollo.
- **Clics y teclado.** Un clic en cualquier parte de la columna de casillas nunca dispara `onRowClick` ni
  el enlace de la fila. A las casillas se llega con Tab y se alternan con Espacio; Espacio sobre una fila
  enfocada ([`focusableRows`](#clic-en-fila-y-filas-como-enlace) o `getRowHref`) también la alterna.
  `rowSelection` no vuelve enfocables las filas.
- **Marcado.** Las filas seleccionadas llevan `data-selected` y `aria-selected="true"`, y las demás
  `aria-selected="false"`; `getRowAttributes` no puede pisarlos. Sin `rowSelection` no se pinta nada de
  esto. Las casillas son `button.gdy-table-select[role="checkbox"]`, con `data-state` (`checked`,
  `unchecked`, `indeterminate`).
- **Textos:** `labels.selectRow`, `labels.selectPageRows` y `labels.selectFilteredRows` (nombres
  accesibles), y los tres textos de impresión de arriba.

Antes, una columna de casillas era un `cell` más tu propio estado, y el clic en la casilla abría la fila:

```diff
- const [selected, setSelected] = useState(new Set<string>());
- const selectColumn = {
-   id: "select",
-   header: "",
-   accessor: () => "",
-   ignoreRowClick: true,
-   cell: (row) => <input type="checkbox" checked={selected.has(row.id)} onChange={() => toggle(row.id)} />,
- };
- <DataTable columns={[selectColumn, ...columns]} data={invoices} />
+ <DataTable columns={columns} data={invoices} getRowId={(row) => row.id} rowSelection={{ onChange: setSelectedIds }} />
```

### Filas expandibles

`renderExpandedRow` agrega una columna con un botón de expandir y, debajo de cada fila abierta, un detalle de
ancho completo con lo que devuelva: contactos, un formulario, un gráfico u otra `DataTable`. La tabla recuerda
qué filas están abiertas; el contenido, y cómo se carga, lo resuelve tu app.

```tsx
<DataTable
  columns={columns}
  data={companies}
  getRowId={(row) => row.id}
  renderExpandedRow={(company) => (
    <DataTable
      columns={contactColumns}
      data={company.contacts}
      getRowId={(contact) => contact.id}
      features={{ toolbar: false, filtering: false, pagination: false }}
      tableMinHeightClassName=""
    />
  )}
  canExpandRow={(company) => company.contacts.length > 0}
/>;
```

| Prop | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `renderExpandedRow` | `(row: TData) => ReactNode` | — | Contenido del detalle de una fila. Sin ella no se pinta nada de esto. |
| `expandedRowIds` | `string[]` | — | Filas abiertas controladas; `undefined` las deja a la tabla. |
| `defaultExpandedRowIds` | `string[]` | `[]` | Filas abiertas al montar cuando no se controlan. |
| `onExpandedChange` | `(expandedRowIds: string[]) => void` | — | Cada apertura o cierre que hace el usuario, controlado o no. |
| `canExpandRow` | `(row: TData) => boolean` | todas las filas | `false` deja la fila sin botón y sin detalle. |

- **`getRowId` es obligatorio.** Las filas abiertas se guardan por id; sin `getRowId` las filas se
  identifican por índice, que cambia con cada orden o página, así que la tabla lanza `MissingRowIdError`.
  Los ids de filas que salen de `data` se conservan (un id sin fila no pinta nada); si controlás la lista,
  limpialos en tu app.
- **La columna del botón** (`_expand`, 40px) va después de la columna de casillas y antes de las columnas
  de datos. El botón es `button.gdy-table-expand-toggle`, con `aria-expanded` y, mientras está abierto,
  `aria-controls` con el id del detalle. Su nombre accesible es `labels.expandRow` (`"Mostrar detalle"`). Un
  clic en él, o Enter y Espacio, nunca dispara `onRowClick` ni el enlace de la fila; el resto de la fila sí.
- **El detalle no es una fila.** Es un `tr.gdy-table-expanded-row` hermano, con una celda que ocupa las
  columnas en pantalla. La paginación, su resumen, la fila de totales, la selección y `onVisibleRowsChange`
  lo ignoran, y los clics y teclas dentro de él no llegan a la fila de arriba. El detalle se monta al
  abrirse, así que una fila cerrada no cuesta nada.
- **Páginas y grupos.** Las filas abiertas siguen abiertas al cambiar de página, de orden o de filtro. Un
  grupo colapsado esconde sus filas con sus detalles, y vuelven abiertas al desplegarlo.
- **Desplazamiento de costado.** Cuando la tabla es más ancha que su contenedor, el detalle toma el ancho
  visible y queda quieto mientras las filas se desplazan, así que siempre se ve entero.
- **Marcado.** La fila abierta lleva `data-expanded`; `getRowAttributes` no lo puede pisar mientras haya
  `renderExpandedRow`. Mientras carga, el esqueleto mantiene la columna del botón y no muestra detalles.
- **Movimiento.** El detalle crece de cero a su alto y el chevron gira (200 ms, fijados por
  `--gdy-table-expand-duration`); con `prefers-reduced-motion: reduce` abre y cierra en el acto. Ver
  [theming.es.md](theming.es.md#animaciones).
- **Impresión** (`printMode`): los detalles abiertos se imprimen enteros debajo de su fila, y la columna del
  botón queda afuera, como la de acciones.
- **Una `DataTable` anidada** funciona tal cual; `features={{ toolbar: false }}` le quita la barra, que si no
  quedaría vacía.

Antes, un detalle era una `cell` con su propio estado, y solo podía vivir dentro de una celda de la fila:

```diff
- const [openId, setOpenId] = useState<string | null>(null);
- const nameColumn = {
-   ...columns[0],
-   cell: (row) => (
-     <>
-       <button onClick={() => setOpenId(openId === row.id ? null : row.id)}>{row.name}</button>
-       {openId === row.id && <Contacts company={row} />}
-     </>
-   ),
- };
- <DataTable columns={[nameColumn, ...columns.slice(1)]} data={companies} />
+ <DataTable columns={columns} data={companies} getRowId={(row) => row.id} renderExpandedRow={(row) => <Contacts company={row} />} />
```

### Visibilidad de columnas

Dos capas deciden qué columnas están en pantalla:

1. **Tu app**, con `columnVisibility`: `false` quita una columna (encabezado, celdas, totales y marcadores
   de carga salen del marcado), `true` la fija para que la prioridad nunca la oculte. Una columna que no
   figura se muestra. Siempre gana.
2. **El lugar que queda**, con `responsiveColumns`: a medida que el contenedor de filas se angosta, la tabla
   oculta las columnas marcadas `hideable` o con `priority` hasta que el resto entra sin scroll horizontal,
   y las vuelve a mostrar cuando se ensancha.

```tsx
const columns: ColumnDefinition<Invoice>[] = [
  { id: "customer", header: "Cliente", accessor: (row) => row.customer, width: 220 },
  { id: "total", header: "Total", accessor: (row) => row.total, width: 120, priority: 3 },
  { id: "status", header: "Estado", accessor: (row) => row.status, width: 140, priority: 2 },
  { id: "notes", header: "Notas", accessor: (row) => row.notes, width: 280, hideable: true },
];

<DataTable
  columns={columns}
  data={invoices}
  responsiveColumns
  columnVisibility={{ notes: showNotes }}
  onColumnVisibilityChange={(visibility, { hiddenByPriority }) => setHiddenCount(hiddenByPriority.length)}
/>;
```

- **Qué columnas se ocultan y en qué orden.** Una columna sin `hideable` y sin `priority` nunca se oculta,
  y tampoco las columnas de casillas y de acciones. Cuando falta lugar, primero caen las ocultables sin
  número, de derecha a izquierda; después las numeradas, el número más bajo primero (si empatan, la de más
  a la derecha). En el ejemplo, al angostar cae Notas, después Estado y después Total; Cliente siempre
  queda.
- **Qué cuenta una columna.** Su `width`; sin él, el ancho medido de su título con sus íconos de orden y de
  filtro (las celdas ya cortan el texto largo con "…"). La medida se guarda mientras la columna está
  oculta. Dale `width` a las columnas cuyo contenido necesita más que el título.
- **Ocultas por la prioridad, no quitadas.** Esas celdas quedan en el marcado con
  `data-hidden-by="priority"` y `display: none`, así puedes mostrarlas en otro medio, por ejemplo en papel:
  `@media print { .gdy-table-cell[data-hidden-by="priority"] { display: table-cell; } }` (y lo mismo para
  `.gdy-table-head-cell` y `.gdy-table-foot-cell`). Las columnas que tu app oculta con `columnVisibility`
  salen del marcado.
- **`onColumnVisibilityChange(visibility, { hiddenByPriority })`** se dispara al montar y cada vez que
  cambian las columnas en pantalla: `true` o `false` por id de columna (una columna agrupada es `false`: no
  está en pantalla) y los ids que ocultó la prioridad, en el orden en que cayeron. Sirve para mostrar
  "3 columnas ocultas" o los valores que faltan en una vista de detalle. **No lo devuelvas a
  `columnVisibility`**: fijaría las columnas ocultas.
- **Rendimiento.** La tabla observa el contenedor de filas con un solo `ResizeObserver`, calcula como mucho
  una vez por frame (la primera antes de pintar, así nunca parpadea la tabla completa) y se desconecta al
  desmontar. Sin `responsiveColumns` no se observa nada.
- Un panel de filtro abierto en una columna que se oculta se cierra.

Antes, cada app medía el contenedor por su cuenta y rearmaba `columns`:

```diff
- const width = useContainerWidth(ref);
- const shown = width < 600 ? columns.filter((column) => column.id !== "notes") : columns;
- <div ref={ref}><DataTable columns={shown} data={invoices} /></div>
+ <DataTable columns={columns} data={invoices} responsiveColumns />
```

### Columnas fijas

`pin: "left"` o `pin: "right"` deja una columna en ese borde mientras las filas se desplazan de costado, así el
nombre de la fila y sus acciones siguen a la vista en una tabla ancha.

```tsx
const columns: ColumnDefinition<Invoice>[] = [
  { id: "customer", header: "Cliente", accessor: (row) => row.customer, width: 220, pin: "left" },
  { id: "notes", header: "Notas", accessor: (row) => row.notes, width: 400 },
  { id: "total", header: "Total", accessor: (row) => row.total, width: 140, pin: "right" },
];

<DataTable columns={columns} data={invoices} getRowId={(row) => row.id} rowActions={{ ...rowActions, columnLabel: "Acciones" }} />;
```

- **`width` es obligatorio.** Una columna fija se pega a la suma de los anchos de las fijas anteriores, así
  que sin `width` la tabla lanza `PinnedColumnWidthError`. Los desplazamientos usan los anchos declarados:
  cuando la tabla es más angosta que su contenedor no hay desplazamiento de costado, y nada se mueve.
- **Orden.** Las columnas fijas van a su borde, cada lado en el orden en que se declararon: en el ejemplo
  Cliente queda primera y Total última, estén donde estén en `columns`. El resto mantiene su orden.
- **Las columnas de la tabla.** Con cualquier fija a la izquierda, las columnas de casilla (`rowSelection`) y
  de expandir (`renderExpandedRow`) se fijan primero, o la columna fija las taparía. Con cualquier fija a la
  derecha, la de acciones se fija al final; `rowActions.pinned: true` la fija sola. Fijada, la columna de
  acciones mide 56px, o 96px con `rowActions.columnLabel`; sin fijar no tiene ancho, como antes.
- **Pantallas chicas.** Una columna fija nunca se oculta por prioridad (`responsiveColumns`). Cuando las fijas
  ocupan más de la mitad del contenedor (un celular, una ventana angosta), se sueltan y se desplazan como las
  demás hasta que haya lugar: el contenedor lleva `data-pinning-suspended`.
- **Fondo.** Una celda fija pinta su propia superficie opaca, `--gdy-table-pinned-bg` (con `--gdy-card` de
  respaldo), para que no se vean las celdas que pasan por debajo. Un fondo o una `opacity` puestos en la fila
  (`tr`) no le llegan: la celda tapa el primero y no forma parte de la segunda. Dale a la fila un token, o
  estilá las celdas:

  ```diff
  - .invoice-row-overdue { background: #fef2f2; }
  + .invoice-row-overdue { --gdy-table-pinned-bg: #fef2f2; }
  + .invoice-row-overdue > .gdy-table-cell { background: #fef2f2; }
  ```

  Las filas seleccionadas y con el mouse encima siguen pintando sobre las celdas fijas.
- **Bordes y apilado.** La última celda fija de cada lado lleva `data-pinned-edge` y proyecta una sombra
  (`--gdy-table-pinned-shadow`) mientras hay contenido debajo: el contenedor lleva `data-scrolled-start`
  cuando hay contenido debajo de las fijas de la izquierda y `data-scrolled-end` cuando lo hay debajo de las de
  la derecha. Con el encabezado fijo, las celdas fijas del encabezado y de los totales son las esquinas y
  tapan en las dos direcciones. Las celdas fijas se apilan en `--gdy-table-pinned-z` (`1`), las esquinas en
  `--gdy-table-pinned-corner-z` (`3`) y un encabezado con su filtro abierto en `--gdy-table-open-menu-z`
  (`4`); los menús, el globo del "?" y los selects abren en un portal por encima de todos.
- **Filas de grupo, vacía, de carga y de detalle** ocupan todas las columnas, así que se desplazan con la
  tabla; con columnas fijas, el rótulo del grupo queda quieto en el borde izquierdo, y un detalle siempre toma
  el ancho visible ([Filas expandibles](#filas-expandibles)).
- **Marcado.** Cada celda de una columna fija (encabezado, filas, totales y esqueletos de carga) lleva
  `data-pinned="left"` o `"right"` y su desplazamiento como `--gdy-table-pin-offset`; el contenedor de filas
  lleva `data-has-pinned`. Sin `pin` ni `rowActions.pinned` no se pinta nada de esto.
- **La impresión** convierte las fijas en columnas comunes: sin sticky, sin superficie propia y sin sombra.
- **Límites.** `left` y `right` son bordes físicos (sin diseño de derecha a izquierda), y en vertical solo se
  fijan el encabezado y la fila de totales. El estado del desplazamiento se escribe directo en el contenedor,
  una vez por cuadro, sin render de React.

Antes, una columna pegada llevaba una clase por celda, desplazamientos a mano y su propio apilado:

```diff
- const stickyCell = { position: "sticky", left: 0, zIndex: 1, background: "white" };
- { id: "customer", cell: (row) => <div style={stickyCell}>{row.customer}</div> }
+ { id: "customer", width: 220, pin: "left" }
```

### Ayuda y contenido en el encabezado

Dos campos de columna enriquecen el encabezado sin tocar `header`:

- **`headerTooltip`** agrega un "?" junto al título (`button.gdy-table-head-help`, con el nombre "Ayuda sobre
  Monto" que arma `labels.columnHelp`). Su texto se abre en un globo con el mouse encima, con el foco del
  teclado y con un toque o un clic, así que también funciona en el celular; Escape, un toque afuera o un
  segundo toque lo cierran. El ícono es un botón propio, fuera del disparador del encabezado, así que nunca
  ordena ni abre el filtro. Los lectores de pantalla además escuchan el texto justo después del título
  (`aria-describedby` en el disparador), esté abierto o no el globo.
- **`headerTooltipPlacement`** elige dónde va el ícono: `"before"` (a la izquierda del título), `"after"` (a
  la derecha del título y de su ícono de orden) o `"edge"` (contra el borde de la celda opuesto al título).
  Sin él es `"after"`, salvo con un encabezado alineado a la derecha, donde es `"before"` para que el título
  y su ícono de orden sigan en el borde derecho, como los números de abajo.
- **`headerContent`** reemplaza el título visible (un ícono más texto, una etiqueta). `header` sigue siendo
  el nombre accesible del disparador y el texto del selector de agrupado, los menús de filtro, el `title` y
  el kanban, que solo pueden mostrar texto. Los íconos de orden y de filtro siguen ahí.

```tsx
const columns: ColumnDefinition<Invoice>[] = [
  {
    id: "amount",
    header: "Monto",
    accessor: (row) => row.amount,
    align: "right",
    headerTooltip: "Suma de los contratos vigentes, en su moneda",
  },
  {
    id: "country",
    header: "País",
    accessor: (row) => row.country,
    headerContent: (
      <>
        <Globe size={14} aria-hidden="true" /> País
      </>
    ),
  },
];
```

**Por qué `header` sigue siendo texto.** El selector de agrupado, los menús y las tarjetas del kanban lo
repiten como texto plano; un `ReactNode` libre ahí no tendría qué mostrar. Un `header` más rico está previsto
para la próxima versión mayor; mientras tanto `headerContent` cubre la parte visible.

Con `printMode` el "?" no se imprime. Sin estos campos el marcado del encabezado es exactamente el de
antes. El globo lee `--gdy-table-tooltip-bg`, `--gdy-table-tooltip-fg` y `--gdy-table-tooltip-z`, y el
ícono `--gdy-table-head-help-fg`.

Antes, el "?" tenía que vivir dentro de `header`, que solo acepta texto, así que las apps lo agregaban con CSS:

```diff
- .my-table th:nth-child(4) .gdy-table-head-label::after { content: " ⓘ"; }
+ { id: "amount", header: "Monto", accessor: (row) => row.amount, headerTooltip: "Suma de los contratos vigentes" }
```

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

### Textos e idioma

Cualquier texto de la tabla se reemplaza con `labels`, y `calendarLocale` cambia el idioma del
calendario de los filtros. Los defaults están en español (decisión de producto); pasá solo las claves
que quieras cambiar y el resto queda igual. Los textos con valores son funciones.

```tsx
import { enUS } from "date-fns/locale";

<DataTable
  columns={columns}
  data={invoices}
  labels={{
    searchPlaceholder: "Search...",
    clearFilters: "Clear filters",
    showing: ({ from, to, total, itemsName }) =>
      total === 0 ? `0 ${itemsName}` : `Showing ${from}–${to} of ${total} ${itemsName}`,
    pageOf: (page, count) => `Page ${page} of ${count}`,
    itemsName: "invoices",
  }}
  calendarLocale={enUS}
/>;
```

- **Prioridad.** Las props sueltas de antes (`searchPlaceholder`, `createLabel`, `emptyMessage`,
  `label`, `groupSelectorLabel`, `groupNoneLabel`, `groupEmptyValueLabel`, los `*Label` de
  `rowActions`, `archivedView.label` y `optionLabels`, `viewSwitch.tableLabel` y `kanbanLabel`,
  `aiButton.label`) siguen funcionando y ganan sobre su clave.
- **Memorizalo.** Guardá `labels` en una constante o en un `useMemo`: un objeto nuevo en cada render
  rearma las columnas y los menús cada vez.
- **Los contenidos son tuyos.** Los títulos de columna, los valores de las celdas y tus propios
  controles de la barra son textos de tu app: traducilos ahí.
- **`calendarLocale`** recibe un locale de `date-fns` y cambia los nombres de meses y días, el primer
  día de la semana y el desplegable de meses. Sin la prop, el calendario queda en español. Un locale de
  `react-day-picker/locale` (`import { enUS } from "react-day-picker/locale"`) traduce además los
  nombres accesibles del calendario ("mes anterior", "elegir el año"), que si no quedan en inglés.
- Los campos de fecha muestran como placeholder la máscara de `dateInputFormat` (`"dd/mm/yyyy"`);
  elegí la que esperan tus usuarios.

Claves comunes a la tabla y al kanban (`DataViewLabels`):

| Clave | Default | Qué es | Prop suelta que gana |
|---|---|---|---|
| `searchPlaceholder` | `"Buscar..."` (kanban: `"Buscar cards..."`) | Placeholder del buscador | `searchPlaceholder` |
| `createButton` | `"Nuevo"` | Botón de crear | `createLabel` |
| `emptyMessage` | `"No se encontraron resultados"` | Ninguna fila o card coincide | `emptyMessage` |
| `groupSelector` | `"Agrupar por"` | Prefijo y nombre accesible del selector de agrupar | `groupSelectorLabel` |
| `clearFilters` | `"Limpiar filtros"` | Botón que limpia todos los filtros | — |
| `archivedView` | `"Mostrar"` | Prefijo y nombre accesible del selector de archivados | `archivedView.label` |
| `archivedActive` | `"Activos"` | Opción de archivados: activos | `archivedView.optionLabels.active` |
| `archivedArchived` | `"Archivados"` | Opción de archivados: archivados | `archivedView.optionLabels.archived` |
| `archivedAll` | `"Todos"` | Opción de archivados: todos | `archivedView.optionLabels.all` |
| `viewSwitchTable` | `"Tabla"` | Cambio de vista: tabla | `viewSwitch.tableLabel` |
| `viewSwitchKanban` | `"Kanban"` | Cambio de vista: kanban | `viewSwitch.kanbanLabel` |
| `aiButton` | `"AI"` | Botón de IA | `aiButton.label` |
| `rowActionsTrigger` | `"Opciones"` | Tooltip y nombre accesible del botón ⋯ | `rowActions.triggerLabel` |
| `editAction` | `"Editar"` | Acción de editar | `rowActions.editLabel` |
| `archiveAction` | `"Archivar"` | Acción de archivar | `rowActions.archiveLabel` |
| `unarchiveAction` | `"Desarchivar"` | Acción de desarchivar | `rowActions.unarchiveLabel` |
| `deleteAction` | `"Eliminar"` | Acción de eliminar | `rowActions.deleteLabel` |
| `historyAction` | `"Ver historial"` | Acción de historial | `rowActions.historyLabel` |
| `sortTitle` | `"Ordenar"` | Sección de orden de los menús | — |
| `sortAscending` | `"Ascendente (A → Z)"` | Orden ascendente de una columna de valores | — |
| `sortDescending` | `"Descendente (Z → A)"` | Orden descendente de una columna de valores | — |
| `filterTitle` | `"Filtrar"` | Sección de filtro del menú de valores | — |
| `selectAll(count)` | `"Seleccionar todo (n)"` | Marca todas las opciones listadas; `count` es cuántas hay | — |
| `clearSelection` | `"Limpiar"` | Limpia la selección del menú de valores | — |
| `filterSearchPlaceholder` | `"Buscar..."` | Buscador del menú de valores | — |
| `valuesTitle` | `"Valores"` | Sección de valores del menú | — |
| `noResults` | `"Sin resultados"` | Menú de valores sin opciones para la búsqueda | — |
| `dateSortAscending` | `"Ascendente (antigua → reciente)"` | Orden ascendente de una fecha | — |
| `dateSortDescending` | `"Descendente (reciente → antigua)"` | Orden descendente de una fecha | — |
| `operatorTitle` | `"Operador"` | Sección de operador del menú de fecha | — |
| `operatorAfter` | `"Mayor que (fecha posterior)"` | Operador "mayor que" | — |
| `operatorBefore` | `"Menor que (fecha anterior)"` | Operador "menor que" | — |
| `operatorBetween` | `"Entre (rango)"` | Operador "entre" | — |
| `datesTitle` | `"Fechas"` | Sección de fechas del menú de fecha | — |
| `dateClear` | `"Limpiar"` | Limpia el filtro de fecha | — |
| `dateApply` | `"Aplicar"` | Aplica el filtro de fecha | — |
| `pickDate` | `"Seleccionar fecha"` | Nombre accesible del botón del calendario (una fecha) | — |
| `pickRange` | `"Seleccionar rango"` | Nombre accesible del botón del calendario (rango) | — |
| `labeledValue(label, value)` | `` `${label}: ${value}` `` | Une un prefijo y su valor: "Agrupar por: Ninguno", "Mostrar: Activos", los selectores propios y la etiqueta de la card | — |

Claves propias de la tabla (`DataTableLabels`):

| Clave | Default | Qué es | Prop suelta que gana |
|---|---|---|---|
| `itemsName` | `"elementos"` | Sustantivo del resumen de paginación | `label` |
| `showing({ from, to, total, itemsName })` | `"Mostrando 1–25 de 53 elementos"`; `"0 elementos"` sin filas | Resumen de paginación | — |
| `pageSize` | `"Elementos por página"` | Texto y nombre accesible del selector de tamaño | — |
| `pageOf(page, count)` | `"Página 1 de 3"` | Posición; `page` es `0` sin filas | — |
| `previousPage` | `"Página anterior"` | Nombre accesible de la flecha anterior | — |
| `nextPage` | `"Página siguiente"` | Nombre accesible de la flecha siguiente | — |
| `inlineSelectPlaceholder` | `"Seleccionar..."` | Celda editable sin valor | — |
| `groupNone` | `"Ninguno"` | Opción "sin agrupar" | `groupNoneLabel` |
| `groupEmptyValue` | `"Sin valor"` | Grupo de las filas sin valor | `groupEmptyValueLabel` |
| `selectRow` | `"Seleccionar fila"` | Nombre accesible de la casilla de una fila | — |
| `selectPageRows` | `"Seleccionar las filas de la página"` | Nombre accesible de la casilla del encabezado (`"page"`) | — |
| `selectFilteredRows` | `"Seleccionar todas las filas filtradas"` | Nombre accesible de la casilla del encabezado (`"filtered"`) | — |
| `printSelected` | `"Sí"` | Se imprime en una fila seleccionada (`printMode`) | — |
| `printNotSelected` | `"No"` | Se imprime en una fila no seleccionada (`printMode`) | — |
| `printSelectionHeader` | `"Seleccionada"` | Se imprime en el encabezado de la columna de casillas (`printMode`) | — |
| `columnHelp(header)` | `"Ayuda sobre Monto"` | Nombre accesible del ícono de ayuda del encabezado (`headerTooltip`) | — |
| `expandRow` | `"Mostrar detalle"` | Nombre accesible del botón de expandir de una fila (`renderExpandedRow`) | — |

## Eventos

| Callback | Firma | Se dispara |
|---|---|---|
| `onRowClick` | `(row: TData, event: RowClickEvent) => void` | Al hacer clic en una fila de datos, o con Enter en una fila enfocable (no en el menú de acciones de fila, el select en línea ni una columna con `ignoreRowClick`). |
| `onGroupChange` | `(groupBy: string \| null) => void` | Cuando el usuario cambia el selector de agrupado; `null` significa "ninguno". No se dispara al montar. |
| `onPaginationChange` | `(state: ManualPaginationState) => void` | Al pasar a la página anterior o siguiente, o al cambiar el tamaño de página, en los dos modos de paginación. Con `pageIndex` controlado, también cada página que la tabla elige por su cuenta ([Página y tamaño de página](#página-y-tamaño-de-página)). |
| `onSearchChange` | `(query: string) => void` | En cada cambio de la caja de búsqueda, en los dos modos de paginación; con `searchDebounceMs`, cuando el usuario deja de escribir. |
| `onSortChange` | `(sorting: ColumnSortingState \| null) => void` | En cada cambio de orden que hace el usuario, controlado o no ([Estado controlado](#estado-controlado)). |
| `onFiltersChange` | `(filters: ColumnFiltersState) => void` | En cada cambio de los filtros activos que hace el usuario, controlado o no ([Filtros controlados](#filtros-controlados)). |
| `onVisibleRowsChange` | `(state: VisibleRowsState<TData>) => void` | Al montar, y cada vez que la búsqueda, los filtros, el orden, el agrupado o la página cambian las filas visibles ([Filas visibles](#filas-visibles)). |
| `ColumnDefinition.onInlineEdit` | `(row: TData, value: string) => void` | Al elegir una opción en una celda editable en línea. |

`onCreate`, los callbacks de `rowActions` (`onEdit`, `onArchive`, `onArchiveToggle`, `onRemove`,
`onHistory`, acciones personalizadas), `archivedView.onChange`, `viewSwitch.onChange`, `aiButton.onClick`
y el `onChange` de los toggles y de los selectores del encabezado pertenecen a `DataViewProps`; consulta
[toolbar.es.md](toolbar.es.md).

### Filas visibles

`onVisibleRowsChange` te entrega lo que el usuario está viendo, para mostrar totales o exportar la lista
filtrada sin leer el DOM. Un solo evento trae los dos alcances:

| Campo | En el cliente (por defecto) | `manualPagination` |
|---|---|---|
| `pageRows` | Las filas de la página actual, en el orden de pantalla. Las filas de un grupo plegado cuentan: siguen ocupando un lugar en la página. | La página que pasaste, después de los filtros y el orden de columna que la tabla le aplica. |
| `filteredRows` | Todas las filas que pasan la búsqueda, la vista de archivados y los filtros, ordenadas (y en el orden de los grupos), antes de paginar. Con `features.pagination: false` es igual a `pageRows`. | Igual a `pageRows`: el resto lo tiene el servidor. |
| `totalRows` | `filteredRows.length`. | `serverRowCount`, o `filteredRows.length` si no se pasa. |

Se dispara al montar y después de cada cambio, y nunca dos veces por el mismo resultado: compara las
filas una por una con el último aviso, así que unas `columns` o un handler inline no lo vuelven a
disparar. Un `data` con objetos nuevos en cada render sí: memoiza `data` (o guarda las filas en un
estado).

```tsx
// Antes: observar el DOM para saber qué filas se pintaron
const observer = new MutationObserver(() => {
  const ids = [...document.querySelectorAll("[data-quote-id]")].map((row) => row.dataset.quoteId);
  setTotals(sumByCurrency(quotes.filter((quote) => ids.includes(quote.id))));
});

// Después
<DataTable
  columns={columns}
  data={quotes}
  onVisibleRowsChange={({ filteredRows }) => setTotals(sumByCurrency(filteredRows))}
  toolbarSlots={[{ id: "totals", content: <Totals value={totals} /> }]}
/>;
```

## Toolbar y acciones de fila

La toolbar que hay sobre las filas (caja de búsqueda, botón de limpiar filtros, selector de vista de
archivados, selector de agrupado, botón de IA, selector tabla/kanban, botón de crear, grupos de toggles
personalizados y selectores del encabezado, y el `toolbarLayout` que los ordena) y el menú de acciones al
final de cada fila (acciones integradas de editar, archivar, eliminar e historial, más `customActions` y
`menuActions`) se comparten con el kanban. Se configuran con `DataViewProps` y están documentados en
[toolbar.es.md](toolbar.es.md).

### Una acción por estado, y submenús

El `label` y el `icon` de una acción pueden depender de la fila, y una entrada con `items` abre un
submenú (`RowActionSubmenu`), en `customActions` y en `menuActions`. El par de acciones con `hidden`
opuestos pasa a ser una sola acción:

```tsx
// Antes: dos acciones, una oculta en cada fila
customActions: [
  { id: "favorite", label: "Marcar favorito", icon: <Star />, onClick: toggle, hidden: (deal) => deal.favorite },
  { id: "unfavorite", label: "Quitar favorito", icon: <StarOff />, onClick: toggle, hidden: (deal) => !deal.favorite },
]

// Después: una acción, y los estados agrupados en un submenú
customActions: [
  {
    id: "favorite",
    label: (deal) => (deal.favorite ? "Quitar favorito" : "Marcar favorito"),
    icon: (deal) => (deal.favorite ? <StarOff /> : <Star />),
    onClick: toggle,
  },
  { id: "status", label: "Cambiar estado", items: STATUSES.map((status) => moveTo(status)) },
]
```

Detalles, teclado y reglas de ids: [Texto e icono por fila, y submenús](toolbar.es.md#texto-e-icono-por-fila-y-submenús).

## Estilos

El elemento raíz es `div.gdy-table`, que además lleva las clases `gdy-table-fill` (con `fillHeight`),
`gdy-table-sticky` (cuando el encabezado sticky tiene efecto) y `gdy-thin-scroll` (con `thinScrollbars`).
Dentro, `div.gdy-scope.gdy-card` envuelve la toolbar, el contenedor de filas `div.gdy-table-wrap.gdy-scroll`
y el pie de paginación. Casi todas las reglas de la hoja de estilos usan una sola clase, así que una regla
con la misma clase en tu CSS, cargada después de `gridory/styles.css`, la sobrescribe. Las pocas reglas
con más de una clase siguen el contrato de especificidad de [theming.es.md](theming.es.md), y
[style-hooks.es.md](style-hooks.es.md) lista cada una con su especificidad: para pisarlas, escribe el
mismo selector.

| Gancho | Elemento | Atributos de estado |
|---|---|---|
| `gdy-table-head-cell` | Celda de encabezado (`th`). | `data-column-id` con el `id` de su columna; `data-align` con `headerAlign` o `align`; `data-hidden-by="priority"` (también en `gdy-table-cell` y `gdy-table-foot-cell`) mientras `responsiveColumns` la oculta. |
| `gdy-table-head-trigger` | Botón dentro de la celda de encabezado que abre el menú de filtro o alterna el orden. | `data-filtered` mientras la columna tiene un filtro activo; `data-align` igual que su celda. |
| `gdy-table-row` | Fila de datos (`tr`). | `data-row-id` con el id de la fila; `data-clickable` cuando se pasa `onRowClick` o `getRowHref`; `data-href` con el enlace; con `rowSelection`, `data-selected` y `aria-selected`; más lo que devuelve `getRowAttributes`. Las filas enfocables toman `:focus-visible`. |
| `gdy-table-select` | Casilla de la columna de selección (`rowSelection`); `gdy-table-select-indicator` contiene su tilde o guion. | `data-state` (`checked`, `unchecked`, `indeterminate`), `aria-checked`, `disabled`. |
| `gdy-table-print-value` | Texto que imprime una celda en lugar de su contenido con `printMode` (selección, `printValue`). Oculto en pantalla. | — |
| `gdy-table-head-help` | Ícono de ayuda de un encabezado con `headerTooltip`; su globo es `div.gdy-table-head-tooltip`, en un portal. `gdy-table-head-inner` lleva `data-help-placement`. | `data-state` (`closed`, `delayed-open`, `instant-open`). |
| `gdy-table-cell` | Celda de datos (`td`); `gdy-table-cell-content` envuelve su contenido. | `data-column-id` con el `id` de su columna; `data-align` con `align`. `gdy-table-cell-content` lleva `data-overflow` con `overflow`. |
| `gdy-table-actions-cell` | Caja del botón ⋯ en la columna de acciones; `gdy-table-actions-head-label` es el texto de su encabezado (`rowActions.columnLabel`). | `data-align` cuando se pasa `rowActions.align` o `columnLabel`. |
| `gdy-table-expand-toggle` | Botón de expandir de una fila (`renderExpandedRow`), con su chevron `gdy-table-expand-chevron`. | `aria-expanded`; `aria-controls` mientras está abierto. |
| `gdy-table-expanded-row` | Fila de detalle debajo de una fila abierta; su única celda es `gdy-table-expanded-cell`, que contiene `gdy-table-expanded-panel` (la caja animada), `gdy-table-expanded-content` y `gdy-table-expanded-body` (el margen interno). | `data-state` (`open`, `closed`) en el panel; `data-expanded` en la `gdy-table-row` abierta. |
| `gdy-table-wrap` | Contenedor de desplazamiento de las filas. | Con columnas fijas, `data-has-pinned`, más `data-scrolled-start`, `data-scrolled-end` y `data-pinning-suspended` mientras aplican. Cada celda de una columna fija lleva `data-pinned` (`left`, `right`), `--gdy-table-pin-offset` y, en la última de su lado, `data-pinned-edge`. |
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
| `--gdy-table-row-focus-ring` | `--gdy-ring` | Anillo de foco de teclado de una fila enfocable. |
| `--gdy-table-row-selected-bg` | `--gdy-accent` | Fondo de una fila seleccionada (`rowSelection`). |
| `--gdy-table-select-border` | `--gdy-muted-foreground` | Borde de una casilla sin marcar. |
| `--gdy-table-select-bg` | `--gdy-background` | Relleno de una casilla sin marcar. |
| `--gdy-table-select-checked-bg` | `--gdy-primary` | Relleno y borde de una casilla marcada o parcial. |
| `--gdy-table-select-check-fg` | `--gdy-primary-foreground` | Tilde y guion. |
| `--gdy-table-select-focus-ring` | `--gdy-ring` | Anillo de foco de teclado de una casilla. |
| `--gdy-table-head-help-fg` | `--gdy-muted-foreground` | Ícono de ayuda del encabezado. |
| `--gdy-table-tooltip-bg` | `--gdy-foreground` | Fondo del globo del encabezado. |
| `--gdy-table-tooltip-fg` | `--gdy-background` | Texto del globo del encabezado. |
| `--gdy-table-tooltip-z` | `60` | Apilado del globo, sobre el encabezado fijo y los menús. |
| `--gdy-table-group-bg` | `--gdy-accent` | Fondo de la fila de grupo. |
| `--gdy-table-expanded-bg` | `--gdy-background` | Fondo del detalle de una fila. |
| `--gdy-table-expanded-padding` | `12px 14px` | Margen interno del detalle de una fila. |
| `--gdy-table-expand-focus-ring` | `--gdy-ring` | Anillo de foco de teclado del botón de expandir. |
| `--gdy-table-expand-duration` | `200ms` | Apertura y cierre de un detalle, y el giro de su chevron. |
| `--gdy-table-pinned-bg` | `--gdy-card` | Superficie de una celda fija del cuerpo. |
| `--gdy-table-pinned-shadow` | 14% de `--gdy-foreground` | Sombra después de la última celda fija de un lado. |
| `--gdy-table-pinned-z` | `1` | Apilado de las celdas fijas. |
| `--gdy-table-pinned-corner-z` | `3` | Apilado de las celdas fijas del encabezado y de los totales, sobre el encabezado fijo (2). |
| `--gdy-table-open-menu-z` | `4` | Apilado de una celda del encabezado con su panel de filtro abierto, sobre las esquinas. |

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

### Clases por parte

`className` suma clases a la raíz y `classNames` suma una clase por parte, siempre después del gancho
`gdy-*` de esa parte, así que las dos se ven en el DOM y el gancho no desaparece nunca:

| Clave de `classNames` | Elemento | Gancho al que se suma |
|---|---|---|
| `root` | `div` raíz (igual que `className`, que va antes) | `gdy-table` |
| `toolbar` | Barra de herramientas | `gdy-toolbar` |
| `wrap` | Contenedor de filas con scroll | `gdy-table-wrap` |
| `table` | `table` | `gdy-table-grid` |
| `headRow` | Fila de encabezado | `gdy-table-head-row` |
| `headCell` | Cada celda de encabezado, también la de acciones | `gdy-table-head-cell` |
| `row` | Cada fila de datos | `gdy-table-row` |
| `cell` | Cada celda de datos, también la de acciones | `gdy-table-cell` |
| `pagination` | Pie de paginación | `gdy-table-pagination` |
| `empty` | Celda del estado vacío (no recibe `cell`) | `gdy-empty` |
| `foot` | Grupo de la fila de totales (`tfoot`) | `gdy-table-foot` |
| `footCell` | Cada celda de la fila de totales | `gdy-table-foot-cell` |

Las filas de grupo conservan sus propios ganchos y no reciben ni `row` ni `cell`.
`tableMinHeightClassName`, `tableMaxHeightClassName` y `tableWrapClassName` siguen funcionando:
`classNames.wrap` va después de ellas. `getRowClassName(row)` va después de `classNames.row`, porque es
la más específica de las dos.

```tsx
<DataTable
  columns={columns}
  data={companies}
  className="shadow-sm"
  classNames={{ row: "even:bg-slate-50", pagination: "bg-slate-50", empty: "italic" }}
/>
```

Una clase del consumidor pesa lo mismo que la regla `gdy-*` de su parte (una clase, 0-1-0), así que
para una propiedad que la hoja ya define, como un fondo, gana la hoja que se carga última. Cargá la
tuya después de `gridory/styles.css`, o cambiá desde la clase el token de esa parte: con el encabezado
fijo, las celdas de encabezado pintan su propio fondo, así que una clase en `headRow` define
`--gdy-table-head-bg` (`[--gdy-table-head-bg:theme(colors.sky.100)]` en Tailwind).

### Seleccionar una columna

Cada celda de encabezado y cada celda de datos lleva `data-column-id` con el `id` de la definición de
su columna, incluida la columna de acciones (`_actions`). Las filas de grupo y la celda del estado vacío
ocupan toda la fila y no lo llevan. El atributo sigue a la columna, no a su posición, así que una regla
sobre él sigue funcionando cuando las columnas se reordenan, se ocultan o se agrupan (para alinear una
columna, usa [`align`](#alineación)):

```css
/* Antes: se rompe apenas una columna cambia de lugar */
.gdy-table-grid tr > :nth-child(5) {
  background: #f8fafc;
}

/* Después */
.gdy-table-head-cell[data-column-id="amount"],
.gdy-table-cell[data-column-id="amount"] {
  background: #f8fafc;
}

.gdy-table-cell[data-column-id="_actions"] {
  width: 64px;
}
```

El contrato de estilos, los tokens base y los temas claro y oscuro están en [theming.es.md](theming.es.md);
el catálogo completo de clases, atributos de estado y tokens está en [style-hooks.es.md](style-hooks.es.md).

## Referencia de props

Props propias de `DataTableProps<TData>`, en el orden del código fuente.

| Prop | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `labels` | `Partial<DataTableLabels>` | textos en español | Reemplaza cualquier texto. Ver [Textos e idioma](#textos-e-idioma). |
| `columns` | `ColumnDefinition<TData>[]` | — | Definiciones de columna (obligatoria). |
| `data` | `DataInput<TData>` | — | Filas: un array o un envoltorio de API (obligatoria). |
| `normalizeRow` | `(row: unknown, index: number) => TData` | — | Convierte cada registro del envoltorio en `TData`. |
| `getRowId` | `(row: TData, index: number) => string` | — | Clave estable de la fila. Sin ella, las filas se identifican por índice. |
| `features` | `DataTableFeatures` | todos `true` | Flags de capacidades. |
| `rowSelection` | `RowSelectionConfig<TData>` | — | Columna de casillas e ids seleccionados. Exige `getRowId`. Ver [Selección de filas](#selección-de-filas). |
| `columnVisibility` | `Record<string, boolean>` | — | Columnas que la app quita (`false`) o fija (`true`). Ver [Visibilidad de columnas](#visibilidad-de-columnas). |
| `onColumnVisibilityChange` | `(visibility: Record<string, boolean>, details: ColumnVisibilityDetails) => void` | — | Columnas en pantalla, al montar y en cada cambio. |
| `renderExpandedRow` | `(row: TData) => ReactNode` | — | Botón de expandir y detalle de ancho completo. Requiere `getRowId`. Ver [Filas expandibles](#filas-expandibles). |
| `expandedRowIds` | `string[]` | — | Filas abiertas controladas. |
| `defaultExpandedRowIds` | `string[]` | `[]` | Filas abiertas al montar. |
| `onExpandedChange` | `(expandedRowIds: string[]) => void` | — | Apertura o cierre que hace el usuario. |
| `canExpandRow` | `(row: TData) => boolean` | — | `false` deja la fila sin botón. |
| `responsiveColumns` | `boolean` | `false` | Oculta las columnas `hideable` y con `priority` hasta que el resto entra. |
| `onRowClick` | `(row: TData, event: RowClickEvent) => void` | — | Callback del clic en fila; marca las filas con `data-clickable`. |
| `getRowHref` | `(row: TData) => string \| undefined` | — | Convierte la fila en un enlace (`data-href`). |
| `focusableRows` | `boolean` | `false` (`true` con `getRowHref`) | Las filas reciben el foco con Tab y se disparan con Enter. |
| `getRowClassName` | `(row: TData) => string \| undefined` | — | Clases extra para una fila, después de `gdy-table-row`. |
| `getRowAttributes` | `(row: TData) => RowAttributes` | — | Atributos `data-*` y `aria-*` extra para una fila. |
| `label` | `string` | `"elementos"` | Sustantivo que usa el resumen de paginación. |
| `pageSizeOptions` | `number[]` | `[15, 25, 50, 100]` | Opciones del select de tamaño de página. |
| `defaultPageSize` | `number` | `50` | Tamaño de página inicial. |
| `manualPagination` | `boolean` | `false` | Modo servidor: `data` es la página actual. |
| `serverRowCount` | `number` | — | Total de filas en el servidor; de él salen el número de páginas y el total del resumen. |
| `serverPageCount` | `number` | — | Total de páginas en el servidor; tiene prioridad sobre `serverRowCount`. |
| `onPaginationChange` | `(state: ManualPaginationState) => void` | — | Cambio de página o de tamaño de página. |
| `pageIndex` | `number` | — | Página controlada (desde 0); `undefined` la deja en manos de la tabla. |
| `pageSize` | `number` | — | Tamaño de página controlado; prevalece sobre `defaultPageSize`. |
| `search` | `string` | — | Texto de búsqueda controlado. |
| `searchDebounceMs` | `number` | — | Retrasa `onSearchChange` hasta que el usuario deja de escribir. |
| `sorting` | `ColumnSortingState \| null` | — | Orden controlado; `undefined` lo deja en manos de la tabla. |
| `onSortChange` | `(sorting: ColumnSortingState \| null) => void` | — | Cambio de orden hecho por el usuario. |
| `manualSorting` | `boolean` | `false` | Ordena el servidor: `data` nunca se reordena. |
| `columnFilters` | `ColumnFiltersState` | — | Filtros controlados; `undefined` los deja en manos de la tabla. |
| `onFiltersChange` | `(filters: ColumnFiltersState) => void` | — | Cambio de los filtros activos hecho por el usuario. |
| `manualFiltering` | `boolean` | `false` | Filtra el servidor: `data` nunca se filtra. |
| `onSearchChange` | `(query: string) => void` | — | Cambio en la caja de búsqueda. |
| `onVisibleRowsChange` | `(state: VisibleRowsState<TData>) => void` | — | Filas visibles al montar y después de cada cambio. |
| `tableWrapClassName` | `string` | — | Clases extra para el contenedor de filas. |
| `printMode` | `"page" \| "all"` | — | Impresión limpia de la página o de todas las filas filtradas. Ver [Impresión](#impresión). |
| `className` | `string` | — | Clases extra para la raíz, después de `gdy-table` y sus flags. |
| `classNames` | `DataTableClassNames` | — | Una clase por parte. Ver [Clases por parte](#clases-por-parte). |
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
`onCreate`, `emptyMessage`, `loading`, `loadingRowCount`, `renderLoading`, `rowActions`, `archivedView`,
`viewSwitch`, `aiButton`, `toggleGroups`,
`headerSelectors`, `toolbarLayout`, `selectTheme`, `thinScrollbars`, `scrollbarColor`,
`optionHoverColor`, `dateFilterRequireOperator`, `dateInputFormat`, `calendarMonthYearDropdown`,
`calendarFromYear`, `calendarToYear`, `calendarLocale`), documentadas en [toolbar.es.md](toolbar.es.md).

### Tipos

Todos se exportan desde `gridory/table` y `gridory`.

- `DataTableLabels`: todos los textos de la tabla, la forma de `labels` ([Textos e idioma](#textos-e-idioma)).
  Extiende `DataViewLabels`, los textos que la tabla comparte con el kanban.
- `DataTableFeatures`: los flags booleanos opcionales de `features` (`search`, `sorting`, `filtering`,
  `pagination`, `rowActions`, `createButton`, `grouping`, `toolbar`).
- `GroupHeader`: `{ value: string; label: string; count: number }`, una fila de grupo.
- `RowGroupingResult<TData>`: `{ flatRows: TData[]; headers: Map<number, GroupHeader> }`, las filas
  agrupadas, con cada encabezado indexado por el índice de su primera fila.
- `ManualPaginationState`: `{ pageIndex: number; pageSize: number }`, el payload de
  `onPaginationChange`.
- `ColumnSortingState`: `{ id: string; direction: SortDirection }`, el orden activo de una columna.
- `ColumnFiltersState`: `{ values: Record<string, string[]>; dates: Record<string, DateFilterState> }`,
  los filtros por id de columna.
- `VisibleRowsState<TData>`: `{ pageRows: TData[]; filteredRows: TData[]; totalRows: number }`, el
  payload de `onVisibleRowsChange`.
- `ColumnFooterContext<TData>`: los mismos tres campos, el argumento del `footer` de una columna.
- `RowClickEvent`: `MouseEvent<HTMLTableRowElement> | KeyboardEvent<HTMLTableRowElement>`, el segundo
  argumento de `onRowClick`.
- `RowAttributes`: el objeto que devuelve `getRowAttributes`, solo con nombres `data-*` y `aria-*` y
  valores `string | number | boolean | undefined`.
- `DataTableClassNames`: las clases opcionales por parte de `classNames`.
- `RowSelectionConfig<TData>`: la forma de `rowSelection` ([Selección de filas](#selección-de-filas)).
- `SelectAllScope`: `"page" | "filtered"`, lo que marca la casilla del encabezado.
- `ColumnVisibilityDetails`: `{ hiddenByPriority: string[] }`, el segundo argumento de `onColumnVisibilityChange`.
- `HeaderTooltipPlacement`: `"before" | "after" | "edge"`, el valor de `headerTooltipPlacement`.
- `ColumnPin`: `"left" | "right"`, el valor del `pin` de una columna.
- `PinnedColumnWidthError` (una clase, también exportada): se lanza cuando una columna tiene `pin` y no `width`.
- `MissingRowIdError` (una clase, también exportada): se lanza cuando `rowSelection` o `renderExpandedRow` no
  tienen `getRowId`; su mensaje nombra la prop.
