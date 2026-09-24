# Toolbar, filtros y acciones de fila

[English](toolbar.md) · [Español](toolbar.es.md)

`DataTable` y `KanbanBoard` comparten un mismo conjunto de props, `DataViewProps<TData>`: la toolbar,
los filtros por columna, la vista de archivados y el menú de acciones de cada registro. Esta guía los
documenta una sola vez para los dos componentes ([table.es.md](table.es.md), [kanban.es.md](kanban.es.md)).
Donde dice "fila", en el kanban lee "tarjeta"; una "columna" de la tabla es un "campo" del kanban. Los
textos por defecto están en español y cada sección indica la prop que reemplaza cada uno. Las etiquetas
de los menús de filtro y del calendario, el botón de limpiar filtros y el tooltip del botón de acciones
no tienen prop para cambiarlos.

## Qué contiene la toolbar

La toolbar tiene un grupo izquierdo y uno derecho. Cada control integrado tiene un slot id y solo se
renderiza cuando se cumple su condición:

| Slot id | Lado | Control | Se renderiza cuando |
|---|---|---|---|
| `search` | izquierda | Caja de búsqueda | `features.search` está activo (lo está por defecto). |
| `clearFilters` | izquierda | Botón `"Limpiar filtros"` | `features.filtering` está activo y hay algún filtro aplicado. |
| `archived` | derecha | Select de vista de archivados | Están definidos tanto `archivedView` como `rowActions.getIsArchived`. |
| `group` | derecha | Selector de agrupado | Tabla: `groupableColumnIds` nombra una columna y `features.grouping` está activo. Kanban: `features.groupSelector` está activo. |
| `ai` | derecha | Botón de IA | `aiButton` está definido. |
| `viewSwitch` | derecha | Selector tabla/kanban | `viewSwitch` está definido. |
| `create` | derecha | Botón de crear | `onCreate` está definido y `features.createButton` está activo. |

El selector de agrupado se describe en [table.es.md](table.es.md) y [kanban.es.md](kanban.es.md). Tus
propios controles (`toggleGroups`, `headerSelectors`) se renderizan siempre y usan su `id` como slot id.
Por defecto, el lado izquierdo contiene `search`, `clearFilters` y los controles personalizados con
`position` `"left"`; el derecho, los controles personalizados con `position` `"right"` (el valor por
defecto) y después `archived`, `group`, `ai`, `viewSwitch` y `create`. Los grupos de toggles van antes
que los selectores del encabezado, cada uno en el orden de su array.

`toolbarLayout` (`{ left?: string[]; right?: string[] }`) reemplaza la disposición por defecto. Si lo
defines, solo se renderizan los ids listados, en el lado y el orden que indiques. Los ids que no
aparecen no se renderizan, la `position` de los controles personalizados se ignora, los ids
desconocidos también, y un control listado cuya condición no se cumple (por ejemplo, `create` sin
`onCreate`) se omite. Aquí `scope` es el `id` de un grupo de toggles:

```tsx
<DataTable {...tableProps} toolbarLayout={{ left: ["scope", "search"], right: ["create"] }} />
```

## Búsqueda

La caja de búsqueda filtra mientras escribes. `searchPlaceholder` define su placeholder: `"Buscar..."`
en la tabla y `"Buscar cards..."` en el kanban.

Una fila coincide cuando el valor de alguna columna buscable contiene el texto buscado. Participan todas
las columnas salvo las que declaran `searchable: false`. Al texto se le quitan los espacios de los
extremos y se compara en minúsculas con los valores que devuelve `accessor` (si el valor es un array, se
prueba cada elemento); la salida de `cell` no entra en la búsqueda. Los acentos no se normalizan, así
que `"peru"` no coincide con `"Perú"`. Las filas pasan primero por la búsqueda y después por la vista de
archivados, los filtros por columna y el orden. En la tabla, `manualPagination` omite la coincidencia
local y solo notifica el texto por `onSearchChange` ([table.es.md](table.es.md)).

## Botón de crear

`onCreate` añade un botón primario con un icono de más, por defecto el último a la derecha. Llama a
`onCreate()` sin argumentos; lo que abra o agregue depende de ti. `createLabel` define su texto (por
defecto `"Nuevo"`). `features.createButton: false` lo oculta aunque `onCreate` esté definido.

## Filtros

Una columna tiene menú de filtro cuando declara `filterable: true` y `features.filtering` está activo.
En la tabla, el menú se abre desde el encabezado de la columna. En el kanban, una fila de filtros bajo la
toolbar muestra un botón por cada campo filtrable, con su `header` como texto. El menú se cierra con un
clic fuera de él o con un segundo clic en su botón. Los filtros de columnas distintas se combinan con AND.

### Filtro de valores

Las columnas de texto y número tienen una lista de casillas. Sus opciones son las `filterOptions` de la
columna, en su orden, cuando ese array no está vacío. Si lo está, son los valores distintos que aparecen
en `data` (cuenta cada elemento de un valor array y se omiten los vacíos), ordenados según el locale
español y calculados sobre todas las filas, antes de la búsqueda y los filtros. Una fila pasa cuando
alguno de sus valores está marcado. Cada casilla se aplica al momento; el menú de valores no tiene botón
de aplicar.

- **"Ordenar"**: `"Ascendente (A → Z)"` y `"Descendente (Z → A)"`, cuando la columna se puede ordenar.
  La dirección activa lleva `aria-pressed="true"`.
- **"Filtrar"**: `"Seleccionar todo (n)"` marca todas las opciones que coinciden con la búsqueda del
  menú; `"Limpiar"` las desmarca todas.
- **"Valores"**: un buscador (`"Buscar..."`) que acota las opciones por etiqueta o por valor, y la lista
  de casillas (`"Sin resultados"` cuando nada coincide).

### Filtro de fecha

Una columna filtrable con `type: "date"` tiene un menú de fechas. En `"Operador"` ofrece
`"Mayor que (fecha posterior)"`, `"Menor que (fecha anterior)"` y `"Entre (rango)"`. Cuando eliges un
operador, `"Fechas"` muestra un input de fecha, o dos para el rango. Los cambios quedan como borrador:
`"Aplicar"` los aplica y cierra el menú; `"Limpiar"` aplica el filtro vacío y además quita el orden de
esa columna. Si la columna se puede ordenar, el menú empieza con `"Ordenar"`:
`"Ascendente (antigua → reciente)"` y `"Descendente (reciente → antigua)"`.

Los valores de las filas se comparan por sus diez primeros caracteres como texto `YYYY-MM-DD`, así que
pasa fechas ISO como `"2026-03-01"` o `"2026-03-01T10:00:00Z"`. "Mayor que" y "menor que" excluyen el
día elegido; "entre" incluye los dos extremos. Las filas con el valor vacío nunca pasan un filtro de
fecha activo.

- `dateFilterRequireOperator` (por defecto `true`) abre el menú sin operador seleccionado y oculta los
  inputs de fecha hasta que se elige uno. Con `false`, "mayor que" viene preseleccionado.
- `dateInputFormat` es la máscara de todos los inputs de fecha: `"dd/mm/yyyy"` (por defecto),
  `"dd-mm-yyyy"`, `"mm/dd/yyyy"` o `"mm-dd-yyyy"`. Define el placeholder y el formato en pantalla, e
  interpreta el texto escrito, que se aplica en cuanto forma una fecha válida. Al perder el foco, el
  input vuelve a mostrar el valor formateado.
- El calendario se abre con el botón de icono que hay junto al input de fecha (el segundo input en un
  rango) o con la flecha abajo dentro de ese input. El calendario de rango muestra dos meses. Se cierra
  al elegir una fecha, o un rango de dos días distintos.
- `calendarMonthYearDropdown` (por defecto `true`) muestra desplegables de mes y año en la cabecera del
  calendario; con `false`, el mes aparece como texto fijo. Los años van de `calendarFromYear` (por
  defecto, el año actual menos 100) a `calendarToYear` (por defecto, el año actual más 10).
- El calendario usa el locale español (nombres de meses y de días, semanas que empiezan el lunes).
  Ninguna prop lo cambia.

### Limpiar filtros

Mientras hay un filtro activo, la toolbar muestra `"Limpiar filtros"`. Un filtro de valores está activo
cuando hay alguna opción marcada; uno de fecha, cuando "mayor que" o "menor que" tiene fecha, o "entre"
tiene las dos. El botón quita todos los filtros de valores y de fecha, y conserva la búsqueda, el orden
y la vista de archivados. El botón de una columna filtrada (el del encabezado en la tabla, el del campo
en el kanban) lleva `data-filtered` y muestra un icono de filtro.

### Ordenar desde el menú

Solo hay un orden activo a la vez; ordenar por otra columna lo reemplaza. El comparador depende del
`type` de la columna (consulta [table.es.md](table.es.md)). `features.sorting: false` quita todos los
botones de orden y `sortable: false` los quita de una columna. Los dos componentes se comportan distinto:

- Tabla: en los dos menús, un nuevo clic en la dirección activa quita el orden. Una columna ordenable
  sin menú de filtro se ordena desde su encabezado, alternando entre ascendente, descendente y sin orden.
- Kanban: en el menú de valores, un nuevo clic en la dirección activa quita el orden. En el menú de
  fechas, un botón fija su dirección y otro clic la mantiene; `"Limpiar"` la quita. Los botones de orden
  solo existen en los menús de los campos, así que para ordenar hacen falta `filterable: true` y
  `features.filtering`.

## Vista de archivados

`archivedView` añade un select que muestra las filas activas, las archivadas o todas. Necesita
`rowActions.getIsArchived` para saber si una fila está archivada; sin él, el select no se renderiza y no
se oculta ninguna fila. Basta con `archivedView={{}}` para activarlo.

El texto de cada opción es `"<label>: <option>"`, con `label` `"Mostrar"` y `optionLabels`
`{ active: "Activos", archived: "Archivados", all: "Todos" }` por defecto (`optionLabels` acepta
cualquier subconjunto). `"active"` conserva las filas en las que `getIsArchived` devuelve `false`,
`"archived"` las filas en las que devuelve `true`, y `"all"` las conserva todas. En modo no controlado,
el componente guarda el modo y empieza en `defaultValue` (por defecto `"active"`). En modo controlado,
pasa `value` y actualízalo desde `onChange`, que se dispara con cada cambio del usuario.

```tsx
<KanbanBoard {...boardProps} archivedView={{ value: mode, onChange: setMode, label: "Show" }} />
```

## Selector de vista y botón de IA

`viewSwitch` renderiza un botón de tabla y otro de kanban; el activo lleva `aria-pressed="true"` y hacer
clic en él no hace nada. El componente no se cambia solo: `onChange(view)` notifica la vista elegida y
tú renderizas el otro componente. `tableLabel` y `kanbanLabel` definen los textos (por defecto `"Tabla"`
y `"Kanban"`).

```tsx
const [view, setView] = useState<ViewMode>("table");
const viewSwitch = { active: view, onChange: setView, tableLabel: "Table", kanbanLabel: "Board" };

return view === "table" ? (
  <DataTable {...tableProps} viewSwitch={viewSwitch} />
) : (
  <KanbanBoard {...boardProps} viewSwitch={viewSwitch} />
);
```

`aiButton` renderiza un botón con un icono de destellos; `label` define su texto y su nombre accesible
(por defecto `"AI"`). El botón solo llama a `onClick()`: guarda en tu app un estado de apertura,
cámbialo ahí y pásalo a las props `open` y `onClose` de `AIChatSidebar` (consulta
[ai-assistant.es.md](ai-assistant.es.md)).

## Grupos de toggles y selectores del encabezado

`toggleGroups` añade controles segmentados y `headerSelectors` añade selects. El componente no los
interpreta: cada uno muestra el `value` que le pasas y llama a su `onChange`, y tú decides qué cambia
(un dataset, un alcance, una consulta).

En un grupo de toggles, hacer clic en la opción seleccionada no la deselecciona. `display` define qué
muestra cada opción: `"both"` (por defecto), `"label"` o `"icon"`; una opción sin `icon` muestra su
etiqueta en cualquier modo. Cada opción usa su etiqueta como `aria-label` y como tooltip; `ariaLabel`
da nombre al grupo.

Un selector del encabezado con `label` muestra cada opción como `"<label>: <option>"` y usa la etiqueta
como nombre accesible. `placeholder` (por defecto, el `label`) se muestra mientras `value` no coincide
con ninguna opción. Los dos controles aceptan `position` (`"left"` o `"right"`, por defecto `"right"`),
que solo se usa sin `toolbarLayout`.

```tsx
const [period, setPeriod] = useState("all");
const [country, setCountry] = useState("all");
const periodToggle: ToggleGroupConfig = {
  id: "period",
  ariaLabel: "Period",
  value: period,
  onChange: setPeriod,
  position: "left",
  options: [{ value: "all", label: "All years" }, { value: "current", label: "This year" }],
};
const countrySelector: HeaderSelectConfig = {
  id: "country",
  label: "Country",
  value: country,
  onChange: setCountry,
  options: [{ value: "all", label: "All" }, { value: "CL", label: "Chile" }],
};

<DataTable {...tableProps} toggleGroups={[periodToggle]} headerSelectors={[countrySelector]} />;
```

## Acciones de fila y de tarjeta

`rowActions` llena un menú que se abre desde un botón "más" (tooltip `"Opciones"`): en una columna extra
al final de la tabla y en la cabecera de la tarjeta en el kanban (debajo de tu markup si usas
`renderCard`). `features.rowActions: false` lo quita. El menú se abre en un portal y se reposiciona para
no salirse de la pantalla; los clics dentro de él no disparan `onRowClick` ni `onCardClick`. Si ninguna
acción aplica a una fila, el botón no se renderiza.

Una acción integrada aparece cuando su callback está definido, salvo que su flag (`edit`, `archive`,
`remove`, `history`) sea `false`. Todos los callbacks reciben la fila.

| Acción | Callback | Prop del texto (por defecto) |
|---|---|---|
| `edit` | `onEdit` | `editLabel` (`"Editar"`) |
| `archive` | `onArchiveToggle` (tiene prioridad) u `onArchive` | `archiveLabel` (`"Archivar"`); `unarchiveLabel` (`"Desarchivar"`) con un icono de restaurar cuando `getIsArchived(row)` es `true` |
| `remove` | `onRemove` | `deleteLabel` (`"Eliminar"`); con estilo destructivo |
| `history` | `onHistory` | `historyLabel` (`"Ver historial"`) |

`customActions` añade elementos `RowAction`: con `placement: "top"` van antes de las integradas y con
`"bottom"` (por defecto) después, en el orden del array dentro de cada grupo. `hidden(row)` quita un
elemento para esa fila, `disabled(row)` lo deshabilita y `variant: "destructive"` le da el estilo de
eliminar. No se añaden separadores.

```tsx
import { DataTable, type ColumnDefinition, type RowActions } from "gridory/table";

interface Invoice {
  id: string;
  customer: string;
  archived: boolean;
}

const columns: ColumnDefinition<Invoice>[] = [
  { id: "customer", header: "Customer", accessor: (invoice) => invoice.customer },
];
const invoices: Invoice[] = [{ id: "1", customer: "Acme", archived: false }];
const post = (invoice: Invoice, action: string) =>
  fetch(`/api/invoices/${invoice.id}/${action}`, { method: "POST" });

const rowActions: RowActions<Invoice> = {
  onEdit: (invoice) => window.location.assign(`/invoices/${invoice.id}/edit`),
  onArchiveToggle: (invoice) => post(invoice, "archive"),
  getIsArchived: (invoice) => invoice.archived,
  onRemove: (invoice) => post(invoice, "delete"),
  editLabel: "Edit",
  archiveLabel: "Archive",
  unarchiveLabel: "Restore",
  deleteLabel: "Delete",
  customActions: [
    { id: "remind", label: "Send reminder", onClick: (invoice) => post(invoice, "remind") },
  ],
};

export const InvoicesTable = () => (
  <DataTable columns={columns} data={invoices} getRowId={(row) => row.id} rowActions={rowActions} />
);
```

`menuActions` compone el menú completo con entradas [`MenuItem`](#menuitem): acciones personalizadas,
referencias a acciones integradas, separadores y títulos. Un array no vacío reemplaza `customActions` y
el orden por defecto. Una referencia a una acción integrada usa el callback y el texto de `rowActions`,
y se omite cuando esa acción no está disponible. Siguiendo con el ejemplo (`MenuItem` se importa de
`gridory/table`):

```tsx
const menuActions: MenuItem<Invoice>[] = [
  { kind: "label", id: "quick", label: "Quick actions" },
  { id: "remind", label: "Send reminder", onClick: (invoice) => post(invoice, "remind") },
  { kind: "separator", id: "main" },
  { kind: "builtin", id: "edit" },
  { kind: "builtin", id: "archive" },
  { kind: "separator", id: "danger" },
  { kind: "builtin", id: "remove" },
];

<DataTable columns={columns} data={invoices} rowActions={{ ...rowActions, menuActions }} />;
```

Los ids se validan cuando se renderiza un menú. Una acción personalizada no puede usar un id integrado
(`BUILT_IN_ROW_ACTION_IDS`: `"edit"`, `"archive"`, `"remove"`, `"history"`), los ids de las acciones
personalizadas deben ser únicos, y también debe serlo el id de cada elemento de `menuActions`
(separadores y títulos incluidos). Una colisión lanza `DuplicateRowActionError`, que se exporta igual
que los tipos de abajo.

## Estilo de los selects y barras de scroll

`selectTheme` da estilo a todos los selects del componente: los de la toolbar (vista de archivados,
selector de agrupado, selectores del encabezado) y, en la tabla, los de edición en línea y de tamaño de
página. Cada clave de color y `radius` se escribe como una variable CSS `--gdy-select-*` inline en el
botón del select y en su desplegable, así que gana sobre el mismo token de tu hoja de estilos (consulta
[SelectTheme](#selecttheme)). `triggerClassName`, `contentClassName` e `itemClassName` añaden clases al
botón, al desplegable y a cada opción.

`thinScrollbars` (por defecto `true`) añade la clase `gdy-thin-scroll` a la raíz, que afina las barras
de scroll de todas las áreas de scroll internas (el viewport de las filas o del tablero, las listas de
opciones, las regiones con altura máxima); con `false` se mantienen las nativas. `scrollbarColor` define
el thumb con `--gdy-scrollbar-thumb` (fallback: el token `--gdy-input`). `optionHoverColor` define el
fondo de hover de las opciones del filtro de valores con `--gdy-option-hover-bg` (fallback: un tinte de
`--gdy-muted`). Los tokens y los temas se describen en [theming.es.md](theming.es.md).

## Referencia

Todos los tipos de esta sección se exportan desde `gridory`, `gridory/table` y `gridory/kanban`.

### DataViewProps

| Prop | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `searchPlaceholder` | `string` | `"Buscar..."` | Placeholder de la caja de búsqueda. En el kanban, por defecto `"Buscar cards..."`. |
| `createLabel` | `string` | `"Nuevo"` | Texto del botón de crear. |
| `onCreate` | `() => void` | — | Callback del botón de crear; el botón solo se renderiza si está definido. |
| `emptyMessage` | `string` | `"No se encontraron resultados"` | Se muestra cuando ninguna fila coincide. |
| `rowActions` | `RowActions<TData>` | — | Menú de acciones de cada fila o tarjeta. |
| `archivedView` | `ArchivedViewConfig` | — | Select activos/archivados/todos. |
| `viewSwitch` | `ViewSwitchConfig` | — | Selector tabla/kanban. |
| `aiButton` | `AiButtonConfig` | — | Botón del asistente de IA. |
| `toggleGroups` | `ToggleGroupConfig[]` | — | Controles segmentados personalizados. |
| `headerSelectors` | `HeaderSelectConfig[]` | — | Selects personalizados. |
| `toolbarLayout` | `ToolbarLayout` | — | Composición explícita de la toolbar. |
| `selectTheme` | `SelectTheme` | — | Estilo de todos los selects. |
| `thinScrollbars` | `boolean` | `true` | Barras de scroll finas en las áreas de scroll internas. |
| `scrollbarColor` | `string` | — | Color del thumb de la barra de scroll; fallback: `--gdy-input`. |
| `optionHoverColor` | `string` | — | Hover de las opciones del filtro de valores; fallback: un tinte de `--gdy-muted`. |
| `dateFilterRequireOperator` | `boolean` | `true` | Los menús de fecha se abren sin operador seleccionado. |
| `dateInputFormat` | `DateInputFormat` | `"dd/mm/yyyy"` | Máscara de los inputs de fecha. |
| `calendarMonthYearDropdown` | `boolean` | `true` | Desplegables de mes y año en la cabecera del calendario. |
| `calendarFromYear` | `number` | año actual menos 100 | Primer año del desplegable de años. |
| `calendarToYear` | `number` | año actual más 10 | Último año del desplegable de años. |

### ToolbarLayout

| Campo | Tipo | Descripción |
|---|---|---|
| `left` | `string[]` | Slot ids del grupo izquierdo, en orden. |
| `right` | `string[]` | Slot ids del grupo derecho, en orden. |

### ToggleGroupConfig

| Campo | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `id` | `string` | — | Slot id, único en la toolbar. |
| `options` | `ToggleOption[]` | — | Opciones, en orden. |
| `value` | `string` | — | Valor de la opción seleccionada. |
| `onChange` | `(value: string) => void` | — | Recibe el valor elegido. |
| `display` | `ToggleDisplay` | `"both"` | `"label" \| "icon" \| "both"`. |
| `ariaLabel` | `string` | — | Nombre accesible del grupo. |
| `position` | `ToolbarSide` | `"right"` | `"left" \| "right"`; se ignora con `toolbarLayout`. |

### ToggleOption

| Campo | Tipo | Descripción |
|---|---|---|
| `value` | `string` | Valor de la opción. |
| `label` | `string` | Texto, nombre accesible y tooltip. |
| `icon` | `ReactNode` | Icono opcional. |

### HeaderSelectConfig

| Campo | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `id` | `string` | — | Slot id, único en la toolbar. |
| `label` | `string` | — | Prefijo de las opciones y nombre accesible. |
| `options` | `SelectOption[]` | — | Opciones, en orden. |
| `value` | `string` | — | Valor de la opción seleccionada. |
| `onChange` | `(value: string) => void` | — | Recibe el valor elegido. |
| `placeholder` | `string` | el `label` | Se muestra mientras `value` no coincide con ninguna opción. |
| `position` | `ToolbarSide` | `"right"` | `"left" \| "right"`; se ignora con `toolbarLayout`. |

### SelectOption

| Campo | Tipo | Descripción |
|---|---|---|
| `value` | `string` | Valor de la opción. |
| `label` | `string` | Texto de la opción. |

### ArchivedViewConfig

| Campo | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `value` | `ArchivedViewMode` | — | Modo controlado: `"all" \| "active" \| "archived"`. |
| `defaultValue` | `ArchivedViewMode` | `"active"` | Modo inicial cuando no es controlado. |
| `onChange` | `(mode: ArchivedViewMode) => void` | — | Se llama cuando el usuario cambia el modo. |
| `label` | `string` | `"Mostrar"` | Prefijo de cada opción. |
| `optionLabels` | `Partial<Record<ArchivedViewMode, string>>` | `{ active: "Activos", archived: "Archivados", all: "Todos" }` | Textos de las opciones. |

### ViewSwitchConfig

| Campo | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `active` | `ViewMode` | — | Vista actual: `"table" \| "kanban"`. |
| `onChange` | `(view: ViewMode) => void` | — | Recibe la vista elegida. |
| `tableLabel` | `string` | `"Tabla"` | Texto del botón de tabla. |
| `kanbanLabel` | `string` | `"Kanban"` | Texto del botón de kanban. |

### AiButtonConfig

| Campo | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `onClick` | `() => void` | — | Callback del clic. |
| `label` | `string` | `"AI"` | Texto del botón y nombre accesible. |

### RowActions

| Campo | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `edit`, `archive`, `remove`, `history` | `boolean` | — | `false` oculta la acción integrada aunque su callback esté definido. |
| `onEdit`, `onRemove`, `onHistory` | `(row: TData) => void` | — | Activan las acciones de editar, eliminar e historial. |
| `onArchive` | `(row: TData) => void` | — | Activa la acción de archivar. |
| `onArchiveToggle` | `(row: TData) => void` | — | Activa la acción de archivar; tiene prioridad sobre `onArchive`. |
| `getIsArchived` | `(row: TData) => boolean` | — | Estado de archivado: texto de la acción de archivar y vista de archivados. |
| `archiveLabel`, `unarchiveLabel`, `deleteLabel`, `editLabel`, `historyLabel` | `string` | en español | Textos de las acciones integradas; los valores por defecto están en [Acciones de fila y de tarjeta](#acciones-de-fila-y-de-tarjeta). |
| `customActions` | `RowAction<TData>[]` | — | Acciones extra alrededor de las integradas. |
| `menuActions` | `MenuItem<TData>[]` | — | Composición completa del menú; reemplaza `customActions`. |

### RowAction

| Campo | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `id` | `string` | — | Id único, distinto de los ids integrados. |
| `label` | `string` | — | Texto del elemento. |
| `icon` | `ReactNode` | — | Icono del elemento. |
| `onClick` | `(row: TData) => void` | — | Recibe la fila. |
| `placement` | `RowActionPlacement` | `"bottom"` | `"top" \| "bottom"`; solo lo usa `customActions`. |
| `variant` | `RowActionVariant` | `"default"` | `"default" \| "destructive"`. |
| `disabled` | `(row: TData) => boolean` | — | Deshabilita el elemento para esa fila. |
| `hidden` | `(row: TData) => boolean` | — | Quita el elemento para esa fila. |

### MenuItem

| Variante | Forma | Renderiza |
|---|---|---|
| Acción personalizada | `RowAction<TData> & { kind?: "action" }` | Un elemento del menú. |
| `BuiltInMenuRef` | `{ kind: "builtin"; id: BuiltInActionId }` | La acción integrada, si está disponible. `BuiltInActionId` es `"edit" \| "archive" \| "remove" \| "history"` (`BUILT_IN_ROW_ACTION_IDS`). |
| `MenuSeparator` | `{ kind: "separator"; id: string }` | Un separador. |
| `MenuLabel` | `{ kind: "label"; id: string; label: string; className?: string }` | Un título. |

### SelectTheme

| Clave | Tipo | Escribe |
|---|---|---|
| `background` | `string` | `--gdy-select-bg` |
| `hoverBackground` | `string` | `--gdy-select-trigger-hover-bg` |
| `border` | `string` | `--gdy-select-border` |
| `text` | `string` | `--gdy-select-text` |
| `radius` | `string \| number` | `--gdy-select-radius` (los números, en píxeles) |
| `contentBackground` | `string` | `--gdy-select-content-bg` |
| `optionText` | `string` | `--gdy-select-item-text` |
| `optionHoverBackground` | `string` | `--gdy-select-item-hover-bg` |
| `optionActiveBackground` | `string` | `--gdy-select-item-active-bg` |
| `triggerClassName` | `string` | Clase en el botón de cada select. |
| `contentClassName` | `string` | Clase en cada desplegable. |
| `itemClassName` | `string` | Clase en cada opción. |

### DateFilterState

| Campo | Tipo | Descripción |
|---|---|---|
| `op` | `DateFilterOp \| ""` | Operador; `""` significa que todavía no hay ninguno elegido. |
| `date` | `string` | Fecha `YYYY-MM-DD` de "mayor que" y "menor que". |
| `dateFrom` | `string` | Inicio `YYYY-MM-DD` de "entre". |
| `dateTo` | `string` | Fin `YYYY-MM-DD` de "entre". |

### DateFilterOp

`"gt"` (posterior a `date`), `"lt"` (anterior a `date`) o `"bt"` (de `dateFrom` a `dateTo`, ambos incluidos).

### DateInputFormat

`"dd/mm/yyyy" | "dd-mm-yyyy" | "mm/dd/yyyy" | "mm-dd-yyyy"`: `dd` es el día, `mm` el mes y `yyyy` el año.

### FilterOption

| Campo | Tipo | Descripción |
|---|---|---|
| `value` | `string` | Valor que se compara con los valores de la columna. |
| `label` | `string` | Texto que se muestra en la lista de casillas. |
