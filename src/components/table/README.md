# DataTable

Componente de tabla reusable, migrable y orientado a eventos.

Ruta recomendada de import:

```tsx
import {
  DataTable,
  type ColumnDefinition,
} from "@/components/table";
```

---

## 1) ¿Qué resuelve?

`DataTable` centraliza en un solo componente:

- búsqueda global
- filtros por columna (texto/opciones)
- filtros de fecha (`gt`, `lt`, `bt`)
- ordenamiento por tipo (`text`, `number`, `date`)
- paginación (client-side por defecto; server-side opcional, ver sección 15)
- acciones por fila orientadas a eventos
- edición inline en columnas configurables
- agrupado de filas opcional por columna (con headers expandibles/colapsables)

No contiene lógica de negocio específica; solo emite eventos para que cada proyecto implemente su comportamiento.

---

## 2) Arquitectura interna

Directorio: `src/components/table/`. Los archivos se agrupan por área de responsabilidad: cada carpeta reúne
los hooks, la lógica pura y los componentes de una misma parte de la tabla.

- Raíz: `index.tsx` (`DataTable`, que compone el modelo y los tres bloques: toolbar, área de scroll y
  paginación), `types.ts` (contratos públicos e internos), `constants.ts` (defaults y constantes),
  `settings.ts` (props con defaults aplicados y flags de features, `TableSettings`), `toolbar-props.ts`
  (props del `Toolbar` derivadas del modelo) y `styles.css` (estilos propios del módulo, `.gdy-table-*`).
- `model/`: `use-table-core.ts` (`useTableCore` compone el estado, las filas y la paginación),
  `use-table-state.ts` (búsqueda, orden, filtros, agrupado y archivados), `use-table-rows.ts` (normalización,
  `use-searched-table-rows.ts`, `use-filtered-table-rows.ts`, `use-grouped-rows.ts`), el agrupado
  (`row-grouping.ts`, `use-row-grouping-state.ts`, `use-collapsed-groups.ts`) y la instancia de TanStack
  (`use-table-options.ts`, `use-table-columns.tsx`).
- `header/`: `TableHead.tsx`, `TableHeaderCell.tsx`, `TableHeaderTrigger.tsx`, `TableHeaderIcons.tsx`,
  `SortIcon.tsx`, los menús de filtro por valores y por fecha (`TableColumnFilterMenu.tsx`,
  `TableValueFilterMenu.tsx`, `TableDateFilterMenu.tsx`), `header-action.ts` y `sort-menu-props.ts`.
- `body/`: `TableScrollArea.tsx`, `TableBody.tsx`, `body-rows.tsx`, `TableGroupRow.tsx`,
  `GroupToggleButton.tsx`, `TableDataRow.tsx`, `TableCellContent.tsx`, `InlineSelectCell.tsx`,
  `RowActionsMenu.tsx`, `RowActionsTrigger.tsx`.
- `pagination/`: `TablePagination.tsx`, `PaginationSummary.tsx`, `PaginationControls.tsx`, `PageStepButton.tsx`,
  `pagination-props.ts` y el modelo de página (`use-table-paging.ts`, `use-table-pagination.ts`,
  `use-paged-rows.ts`, `page-range.ts`, `use-view-snapshot.ts`, `use-reset-page-on-change.ts`,
  `use-scroll-reset-on-page-change.ts`).

Compartido con el kanban, en `src/components/shared/`:

- `toolbar/`: `Toolbar` (barra superior, la misma para tabla y kanban), `FilterMenu`,
  `DateFilterMenu`, `DatePickerWithInput`, `DateRangePicker`, `ToolbarAiButton`,
  `ToolbarViewSwitch`.
- `row-pipeline.ts`: normalización de filas, búsqueda global, filtros por columna y fecha,
  orden y vista de archivados.
- `data-view-props.ts`: `DataViewProps`, las props comunes a tabla y kanban (toolbar, selects,
  calendario, scroll) de las que extienden `DataTableProps` y `KanbanBoardProps`.
- `date-filter.ts`: estado vacío del filtro de fecha, comparación y máscara de fechas.
- `hooks.ts`: `useClickOutside`, `useActiveFilters`.
- Estado compartido: `use-column-sorting.ts`, `use-column-filters.ts`, `use-filter-menu-anchor.ts`,
  `use-archived-mode.ts`; etapas del pipeline como hooks (`use-searched-rows.ts`, `use-archived-rows.ts`,
  `use-filtered-rows.ts`, `use-sorted-rows.ts`); `column-filters.ts` (estado vacío, clave del menú de fecha,
  ajustes de calendario), `prop-defaults.ts`, `root-style.ts`, `stop-propagation.ts` y
  `toolbar/toolbar-props.ts` (props de archivados y de paso directo al `Toolbar`).
- `src/styles/shared.css`: estilos compartidos (`.gdy-toolbar`, `.gdy-btn`, `.gdy-input`,
  `.gdy-panel`, `.gdy-date-*`, `.gdy-view-switch`, scroll fino).

---

## 3) API principal (resumen)

`DataTableProps<TData>` (resumen de props más relevantes):

- `columns`: definición de columnas.
- `data`: arreglo o contenedor (`results`, `items`, `data`, etc.).
- `getRowId`: identificador estable de fila.
- `features`: flags (`search`, `filtering`, `sorting`, `pagination`, `rowActions`, `createButton`, `grouping`).
- `onCreate`: callback del botón crear.
- `rowActions`: callbacks de acciones por fila.
- `rowActions.customActions`: acciones de menú personalizables además de las built-in (ver sección 22).
- `rowActions.menuActions`: menú de acciones completamente componible que reemplaza el orden por defecto (separadores/encabezados incluidos, ver sección 22).
- `toggleGroups`: segmented-controls personalizados en la barra; por defecto a la derecha, con `position` configurable (ver sección 23).
- `headerSelectors`: selectores desplegables generales adicionales en la barra; por defecto a la derecha, con `position` configurable (ver sección 24).
- `toolbarLayout`: composición explícita de los slots del toolbar (lados y orden, ver sección 26).
- `selectTheme`: theming global de todos los selectores estilizados del componente (ver sección 25).
- `pageSizeOptions`, `defaultPageSize`: paginación.
- `manualPagination`, `serverRowCount`, `serverPageCount`, `onPaginationChange`, `onSearchChange`: paginación/búsqueda server-side opcional (ver sección 15).
- `label`, `emptyMessage`: textos.
- `groupableColumnIds`: IDs de columnas por las que el usuario puede agrupar (ver sección 10).
- `defaultGroupBy`: ID de columna inicial agrupada o `null` (sin agrupar).
- `onGroupChange`: callback emitido al cambiar el agrupado activo.
- `groupSelectorLabel`, `groupNoneLabel`, `groupEmptyValueLabel`: textos del selector y el grupo de valores vacíos.
- `archivedView`: configuración del selector de visualización de archivados (ver sección 11).

---

## 4) Contrato de eventos (acciones por fila)

El componente es **event-driven**:

- `onEdit(row)`
- `onArchiveToggle(row)` o `onArchive(row)`
- `onRemove(row)`
- `onHistory(row)`

Comportamiento del componente:

- **Editar** solo dispara evento.
- **Archivar/Desarchivar** solo dispara evento.
- **Eliminar** solo dispara evento.
- No muta datos internamente para estas acciones.

Ejemplo:

```tsx
rowActions={{
  getIsArchived: (row) => row.status === "Archivada",
  onEdit: (row) => console.log("onEdit", row),
  onArchiveToggle: (row) => console.log("onArchiveToggle", row),
  onRemove: (row) => console.log("onRemove", row),
  onHistory: (row) => console.log("onHistory", row),
}}
```

---

## 5) Ejemplo de uso mínimo

```tsx
import {
  DataTable,
  type ColumnDefinition,
} from "@/components/table";

interface Row {
  id: string;
  name: string;
  status: "Activa" | "Archivada";
  createdAt: string;
}

const columns: ColumnDefinition<Row>[] = [
  {
    id: "name",
    header: "Nombre",
    accessor: (row) => row.name,
    searchable: true,
    filterable: true,
    sortable: true,
  },
  {
    id: "status",
    header: "Estado",
    accessor: (row) => row.status,
    filterable: true,
    sortable: true,
  },
  {
    id: "createdAt",
    header: "Alta",
    accessor: (row) => row.createdAt,
    type: "date",
    filterable: true,
    sortable: true,
  },
];

<DataTable
  columns={columns}
  data={{ results: rows }}
  getRowId={(row) => row.id}
  label="registros"
  rowActions={{
    onEdit: (row) => console.log("onEdit", row),
    onArchiveToggle: (row) => console.log("onArchiveToggle", row),
    onRemove: (row) => console.log("onRemove", row),
  }}
/>;
```

---

## 6) Dependencias requeridas

Dependencias funcionales del módulo:

- `@tanstack/react-table`
- `date-fns`
- `react-day-picker`
- `lucide-react`
- primitivos propios de `src/components/ui/` (`select`, `dropdown-menu`, `popover`, `calendar`,
  `toggle-group`) sobre `radix-ui` y `react-day-picker`, con sus clases `gdy-*` en
  `src/components/ui/styles.css`

En este proyecto ya están instaladas en `package.json`.

---

## 7) Estilos

- Estilos propios del módulo: `src/components/table/styles.css`, con clases `gdy-table-*`. Cada
  elemento lleva su gancho: `gdy-table` (raíz, con los flags `gdy-table-fill`, `gdy-table-sticky`,
  `gdy-thin-scroll`), `gdy-table-wrap`, `gdy-table-grid`, `gdy-table-head`, `gdy-table-head-row`,
  `gdy-table-head-cell` (el `th`), `gdy-table-head-inner`, `gdy-table-head-trigger`,
  `gdy-table-head-label`, `gdy-table-head-filter-icon`, `gdy-table-head-arrow`,
  `gdy-table-head-sort-icon`, `gdy-table-menu-holder`, `gdy-table-body`, `gdy-table-row`,
  `gdy-table-cell`, `gdy-table-cell-content`, `gdy-table-inline-select-wrap`,
  `gdy-table-actions-cell`, `gdy-table-actions-icon`, `gdy-table-empty-row` (+ `gdy-empty` en la
  celda), `gdy-table-group-row`, `gdy-table-group-cell`, `gdy-table-group-toggle`,
  `gdy-table-group-chevron`, `gdy-table-group-label`, `gdy-table-group-count`,
  `gdy-table-pagination`, `gdy-table-pagination-left|right|text`, `gdy-table-page-size`,
  `gdy-table-pagination-icon`.
- Estilos compartidos con el kanban: `src/styles/shared.css`, con clases `gdy-*` sin módulo
  (`gdy-card`, `gdy-toolbar`, `gdy-btn`, `gdy-input`, `gdy-panel`, `gdy-option-item`,
  `gdy-date-input`, `gdy-view-switch`).
- Primitivos (selects de la toolbar, de paginación e inline, menú de fila, popover y calendario
  del filtro de fecha, toggles): clases `gdy-select-*`, `gdy-menu-*`, `gdy-popover-content`,
  `gdy-calendar-*` y `gdy-toggle-*` en `src/components/ui/styles.css`. El select inline de la
  celda añade `gdy-table-inline-select` (regla `.gdy-select-trigger.gdy-table-inline-select`).
- Estados por atributo, no por clase: `data-filtered` en `gdy-table-head-trigger`,
  `data-clickable` en `gdy-table-row` (cuando hay `onRowClick`), `aria-expanded` en
  `gdy-table-group-toggle` (el chevron gira con `[aria-expanded="false"]`), y en el panel
  compartido `data-selected` / `data-checked` en el checklist y `aria-pressed="true"` en los
  botones de orden y operador. Se estilizan con selectores de atributo:
  `.gdy-table-row[data-clickable]:hover .gdy-table-cell { background: … }`.
- Cada regla es de una sola clase, salvo el flag de raíz más clase (`.gdy-table-sticky
  .gdy-table-head-cell`, `.gdy-table-fill .gdy-table-wrap`) y el hover de fila. Una regla con el
  mismo selector en tu CSS, cargado después de `gridory/styles.css`, gana. Los ganchos sin
  estilos por defecto (`gdy-table-head`, `gdy-table-body`, iconos) están listados como `hookOnly`
  en `scripts/audit-allowlist.json`.
- Utilidades públicas para props: `gdy-table-min-h-sm|md|lg` (`tableMinHeightClassName`) y
  `gdy-table-max-h-sm|md|lg` (`tableMaxHeightClassName`).
- Los colores salen de los tokens base `--gdy-*` (ver "Tema y tokens" en el README raíz), que
  traen tema claro y oscuro. Además la tabla lee estos tokens de componente opcionales, que se
  declaran en `:root` o `.dark` de la app:

| Token | Por defecto | Qué pinta |
|---|---|---|
| `--gdy-table-head-bg` | `--gdy-muted` | fondo de la cabecera (también fija) |
| `--gdy-table-head-fg` | `--gdy-muted-foreground` | texto de la cabecera |
| `--gdy-table-border` | `--gdy-border` | bordes de celdas y paginación |
| `--gdy-table-row-hover-bg` | `--gdy-muted` | hover de filas clicables |
| `--gdy-table-group-bg` | `--gdy-accent` | fila de grupo |
| `--gdy-toolbar-border` | `--gdy-border` | borde inferior de la toolbar |
| `--gdy-btn-bg` / `--gdy-btn-fg` / `--gdy-btn-hover-bg` | `--gdy-muted` / `--gdy-foreground` / tinte | botones de la toolbar |
| `--gdy-btn-primary-bg` / `--gdy-btn-primary-fg` | `--gdy-primary` / `--gdy-primary-foreground` | botón primario (crear) |
| `--gdy-input-bg` / `--gdy-input-border` | `--gdy-muted` / `--gdy-input` | buscador e inputs de fecha |
| `--gdy-panel-bg` / `--gdy-panel-border` / `--gdy-panel-shadow` | `--gdy-popover` / `--gdy-border` / `--gdy-shadow-md` | paneles de filtro |
| `--gdy-option-hover-bg` | tinte de `--gdy-muted` | hover del checklist (prop `optionHoverColor`) |
| `--gdy-scrollbar-thumb` | `--gdy-input` | scrollbars finas (prop `scrollbarColor`) |

- Si migras el componente, copia este archivo junto con el módulo.

---

## 8) Migración a otro proyecto

Copiar:

1. `src/components/table/` completo.
2. `src/components/ui/` (`select.tsx`, `dropdown-menu.tsx`, `popover.tsx`, `calendar.tsx`,
   `toggle-group.tsx` y `styles.css`).
3. Archivo puente opcional `src/components/DataTable.tsx` si quieres compatibilidad de import legado.

Configurar:

1. Alias `@/` apuntando a `src`.
2. Estilos globales/tema requeridos por los componentes UI (si aplica en tu stack).
3. Dependencias listadas arriba.

---

## 9) Changelog relevante (resumen)

- v1.14.0: el **agrupado de filas** usa el `label` de las `filterOptions` de la
  columna agrupada en cada encabezado de grupo y respeta su orden (valores sin
  opción después, alfabéticos; vacío al final). Sin `filterOptions` el agrupado es
  idéntico a v1.13.0. Sin cambios de API (ver sección 10).
- v1.12.0: orden por columna **deseleccionable** (tri-estado ascendente →
  descendente → sin orden), **menú de acciones (kebab) auto-posicionado** (Radix
  `DropdownMenu` con `Portal` + detección de colisión; se abre hacia arriba cerca
  del borde inferior), **acciones de menú personalizables**
  (`rowActions.customActions`) —ahora **sin separadores automáticos** entre
  grupos— y **menú completamente componible** (`rowActions.menuActions`: orden,
  separadores y encabezados definidos por el consumidor), **toggles/segmented-controls**
  (`toggleGroups`) y **selectores generales** (`headerSelectors`) en la barra —por
  defecto a la **derecha** y con `position` configurable—, **composición explícita
  del toolbar** (`toolbarLayout`), y **selectores estilizados** (no nativos) en
  "Mostrar", "Agrupar por", tamaño de página y edición inline en celda con **theming
  global** (`selectTheme` + variables CSS `--gdy-select-*`), **desplegable nunca más
  estrecho que el trigger** y **menos redondeo**. Todo opcional y retrocompatible con
  v1.11.0; las únicas diferencias por defecto son intencionales de UX (3.er clic de
  orden limpia el orden, el menú se reposiciona y ya no dibuja separadores
  automáticos, y el desplegable de los selects no baja del ancho del trigger y lleva menos
  redondeo). Ver secciones 20–26.
- v1.11.0: tooltip nativo (`title`) en textos truncados de los filtros (cabecera
  de columna y valores del checklist), ancho del panel de filtro acotado
  (`max-width`) para que los valores largos trunquen en vez de ensanchar el
  submenú, opciones de "Ordenar" apiladas verticalmente y calendario del filtro
  de rango con los dos meses lado a lado. Sin cambios de API; solo visual y
  retrocompatible con v1.10.0 (ver sección 19).
- v1.10.0: filtros de fecha (submenú sin operador preseleccionado, formato de
  entrada configurable con parseo manual, rango por dos campos, calendario con
  selector de mes/año) + scrollbars finos configurables + hover en el checklist
  de valores (`thinScrollbars`, `scrollbarColor`, `optionHoverColor`,
  `dateFilterRequireOperator`, `dateInputFormat`, `calendarMonthYearDropdown`,
  `calendarFromYear`, `calendarToYear`). Retrocompatible: sin estas props el
  filtrado/orden/paginación son idénticos a v1.9.0 (ver sección 18).
- v1.9.0: scroll interno de filas con header/toolbar fijos y reset de scroll al
  paginar (`scrollResetOnPageChange`, `stickyHeader`, `fillHeight`,
  `tableMaxHeightClassName`). Retrocompatible: sin estas props la tabla se comporta
  igual que en v1.8.0 (ver sección 17).
- v1.8.0: locale español por defecto en el calendario de los filtros de fecha
  (mes capitalizado, semana en lunes); sobreescribible. Aplica vía el wrapper
  `Calendar` compartido con el kanban (ver sección 16).
- v1.7.0: paginación server-side / manual opcional (`manualPagination`,
  `serverRowCount`/`serverPageCount`, `onPaginationChange`, `onSearchChange`).
  Retrocompatible: sin estas props la tabla sigue paginando client-side (ver
  sección 15).
- v1.4.0: orden opcional asc/desc para columnas `type: "date"` integrado al
  `DateFilterMenu` (ver sección 12). Convive con los operadores `gt`/`lt`/`bt`
  sin cambios en la API de columnas.
- v1.3.0: selector "Mostrar" para visualización de archivados (Activos / Archivados / Todos), con evento opcional `onChange` (ver sección 11).
- v1.1.0: agrupado opcional de filas por columna (selector en toolbar, headers expandibles/colapsables).
- v2.0.0: date pickers migrados a componentes de calendario (mejor UX y rango de fechas).
- v2.0.1: fixes de popovers, timezone, selección de rango y aplicación controlada de filtros de fecha.
- Refactor modular: separación en `types/utils/hooks/subcomponentes/index`.
- Ajuste de acciones: modelo event-driven para editar/archivar/eliminar.

---

## 10) Agrupado de filas (opcional)

Permite que el usuario agrupe las filas por una de las columnas seleccionadas
desde un selector en el toolbar. La feature es **opcional y retrocompatible**:
si no pasas `groupableColumnIds`, el componente se renderiza idéntico a versiones
anteriores.

### Activación

```tsx
<DataTable
  columns={columns}
  data={{ results: rows }}
  getRowId={(row) => row.id}
  groupableColumnIds={["status", "country", "brand"]}
  defaultGroupBy={null}
  onGroupChange={(groupBy) => console.log("activeGroupBy", groupBy)}
/>
```

`groupableColumnIds` recibe los `id` de columnas ya definidas en `columns`.
La tabla reusa el `header` y el `accessor` de esas columnas, así que no se
duplica configuración.

### Comportamiento

- En el toolbar aparece un selector "Agrupar por: Ninguno / Estado / País / ...".
- Al elegir una opción distinta de "Ninguno":
  - La columna agrupada **desaparece** del thead y de las celdas (queda
    implícita en el encabezado de cada grupo).
  - Por cada valor distinto se renderiza una fila de **encabezado de grupo**
    (chevron, label del valor y conteo total del grupo).
  - Los grupos arrancan **expandidos**. El chevron de la izquierda colapsa o
    expande el grupo correspondiente.
  - Sort, filtros, búsqueda y acciones por fila siguen aplicando sobre las
    filas dentro de cada grupo.
- La paginación opera sobre las filas planas. Si un grupo cruza dos páginas,
  su encabezado se vuelve a mostrar al inicio de la página siguiente.
- Cambiar de columna agrupada o volver a "Ninguno" resetea el estado de
  colapso y la paginación a la primera página.

### Etiquetas y orden de los grupos (desde v1.14.0)

Desde **v1.14.0** el encabezado de cada grupo usa el `label` de las
`filterOptions` de la columna agrupada y respeta el orden en que están
declaradas. **Para ver etiquetas legibles en los grupos hay que declarar
`filterOptions` en cada columna agrupable**: la tabla no toma las etiquetas de
ninguna otra fuente (ni de `cell` ni de `inlineEditOptions`).

- **Sin `filterOptions`** (o con un array vacío): igual que antes. La etiqueta es
  el valor crudo del `accessor` y los grupos se ordenan alfabéticamente
  (`localeCompare` en `es`, sin distinguir mayúsculas ni acentos).
- **Con `filterOptions`**:
  - La etiqueta es el `label` de la opción cuyo `value` coincide exactamente con
    el valor de la fila (si hay `value` repetidos, cuenta la primera aparición).
  - Primero van los grupos con opción, **en el orden del array** `filterOptions`.
  - Después, los valores **sin opción** declarada, con su valor crudo como
    etiqueta y en orden alfabético.
- **Valores vacíos / null**: siempre bajo `groupEmptyValueLabel` y al final.
- Solo se renderizan grupos para valores presentes en las filas: una opción sin
  filas no genera encabezado.
- `GroupHeader.value` sigue siendo el valor crudo (lo usa el colapso de
  grupos); solo cambian la etiqueta y el orden.
- `filterOptions` se aplica al agrupado aunque la columna no sea `filterable`; si
  lo es, las mismas opciones alimentan su menú de filtro.

```tsx
const columns: ColumnDefinition<Lead>[] = [
  {
    id: "stage",
    header: "Etapa",
    accessor: (row) => row.stage,
    filterable: true,
    filterOptions: [
      { value: "backlog", label: "Pendiente" },
      { value: "demo", label: "Demo" },
      { value: "quotation", label: "Cotización" },
      { value: "follow_up", label: "Seguimiento" },
      { value: "won", label: "Ganado" },
      { value: "lost", label: "Perdido" },
    ],
  },
];

<DataTable
  columns={columns}
  data={{ results: leads }}
  getRowId={(row) => row.id}
  groupableColumnIds={["stage"]}
/>;
```

Al agrupar por "Etapa" los grupos se muestran como Pendiente, Demo, Cotización,
Seguimiento, Ganado y Perdido (solo los que tengan filas), luego cualquier valor
no declarado con su valor crudo y, al final, "Sin valor".

### Props nuevas

| Prop                   | Tipo                                | Default         | Descripción                                                                                                             |
| ---------------------- | ----------------------------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `groupableColumnIds`   | `string[]`                          | `undefined`     | IDs de columnas existentes por las que el usuario puede agrupar. Si está vacío o no se pasa, el selector no se muestra. |
| `defaultGroupBy`       | `string \| null`                    | `null`          | Columna inicial agrupada. Si no está en `groupableColumnIds`, se ignora.                                                |
| `onGroupChange`        | `(groupBy: string \| null) => void` | `undefined`     | Callback emitido solo en cambios reales del usuario (no en mount).                                                      |
| `groupSelectorLabel`   | `string`                            | `"Agrupar por"` | Prefijo de cada opción del selector.                                                                                    |
| `groupNoneLabel`       | `string`                            | `"Ninguno"`     | Etiqueta de la opción "sin agrupar".                                                                                    |
| `groupEmptyValueLabel` | `string`                            | `"Sin valor"`   | Etiqueta del grupo que contiene filas con valor vacío/null.                                                             |
| `features.grouping`    | `boolean`                           | `true`          | Permite ocultar el selector aunque hayas pasado `groupableColumnIds` (útil para feature flags).                         |

### Notas y casos borde

- **Accessor multivaluado**: si la columna agrupada tiene un `accessor` que
  devuelve un array, se agrupa por el primer valor (mismo criterio que el
  ordenamiento). Para casos de agrupado por todos los valores, divide la
  columna en una columna derivada.
- **Valores vacíos / null**: se agrupan bajo `groupEmptyValueLabel` y este
  grupo se renderiza al final.
- **Filtros activos sobre la columna oculta**: el filtro sigue aplicándose,
  aunque el header desaparezca. Para acceder al menú del filtro, vuelve a
  "Agrupar por: Ninguno" o usa "Limpiar filtros".
- **Diferencias por mayúsculas/minúsculas**: dos valores que difieren solo en
  case quedan en grupos separados; consistente con el comportamiento del
  Kanban. Normaliza en el `accessor` si quieres unificar.

---

## 11) Selector de archivados (opcional)

Permite que el usuario alterne la vista entre **Activos**, **Archivados** y
**Todos** desde un selector en el toolbar. La feature es **opcional y
retrocompatible**: si no pasas `archivedView`, el selector no se renderiza
y el componente se comporta igual que en versiones anteriores.

### Activación

```tsx
<DataTable
  columns={columns}
  data={{ results: rows }}
  rowActions={{
    getIsArchived: (row) => row.status === "Archivada",
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
2. `rowActions.getIsArchived` definida (sin ella el componente no sabe qué
   filas son archivadas y el selector se oculta).

### Forma del objeto `archivedView`

| Campo          | Tipo                              | Default                                                       | Descripción                                                                |
| -------------- | --------------------------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `value`        | `"all" \| "active" \| "archived"` | `undefined`                                                   | Modo controlado. Si se pasa, el componente delega el estado al consumidor. |
| `defaultValue` | `"all" \| "active" \| "archived"` | `"active"`                                                    | Estado inicial cuando se usa en modo no controlado.                        |
| `onChange`     | `(mode) => void`                  | `undefined`                                                   | Se dispara solo en cambios reales del usuario (no en mount).               |
| `label`        | `string`                          | `"Mostrar"`                                                   | Prefijo visible en cada opción del selector.                               |
| `optionLabels` | `Partial<Record<mode, string>>`   | `{ active: "Activos", archived: "Archivados", all: "Todos" }` | Override de los textos por modo.                                           |

### Comportamiento

- El filtro se aplica **antes** de los filtros de columna y del ordenamiento.
  Una fila con `status === "Archivada"` queda fuera del set total cuando el
  modo es `"active"`.
- Cambiar el modo **resetea la paginación** a la página 1.
- Sigue funcionando junto con búsqueda, filtros de columna, fecha, agrupado
  y acciones por fila.

### Modo controlado

Si necesitás reflejar el estado externamente (por ejemplo, sincronizar con la
URL), pasá `value` y manejalo en `onChange`:

```tsx
const [archivedMode, setArchivedMode] = useState<ArchivedViewMode>("active");

<DataTable
  // ...
  archivedView={{
    value: archivedMode,
    onChange: setArchivedMode,
  }}
/>;
```

### Casos borde

- **Sin `getIsArchived`**: el selector no se renderiza (no tiene cómo
  distinguir filas archivadas).
- **`archivedView` vacío `{}`**: usa los defaults (`"active"` y label
  `"Mostrar"`).
- **Datos cambiantes en modo no controlado**: el estado del selector vive en
  el componente; remontarlo lo reinicia a `defaultValue`.

---

## 12) Sort de columnas de fecha (opcional)

Cuando una columna tiene `type: "date"` **y** `sortable: true`, el
`DateFilterMenu` incluye una sección **"Ordenar"** arriba del selector de
operador, con dos botones:

- `Ascendente (antigua → reciente)`
- `Descendente (reciente → antigua)`

La feature es **opcional y retrocompatible**: si la columna no es `sortable`,
la sección no aparece y el menú se comporta como en versiones previas.

### Activación

No requiere props nuevas. Basta con marcar la columna como `sortable`:

```tsx
{
  id: "createdAt",
  header: "Alta",
  accessor: (row) => row.createdAt,
  type: "date",
  filterable: true,
  sortable: true, // ← habilita la sección "Ordenar" en el DateFilterMenu
}
```

### Comportamiento

- El orden se aplica sobre las fechas comparándolas como cadenas
  `YYYY-MM-DD` (`toComparableDate`). Valores vacíos/null quedan al inicio
  en orden ascendente.
- **Convive con el filtro** (`gt`/`lt`/`bt`): el filtro recorta el set y el
  orden se aplica sobre el resultado. Cambiar entre operadores no afecta el
  sort activo.
- El sort por fecha **reemplaza** el sort de otras columnas (modelo
  single-column sort ya existente). Activar asc o desc en otra columna
  desactiva la dirección en la columna fecha y viceversa.
- El botón **"Limpiar"** del menú resetea filtro **y** sort en una sola
  acción (decisión consciente para que el reset del menú sea predecible).
- El sort se aplica también desde el botón del header cuando la columna no
  es `filterable` — comportamiento previo intacto.

### Casos borde

- **`features.sorting === false`**: la sección "Ordenar" no se renderiza
  aunque la columna sea `sortable`. Útil para feature flags globales.
- **`sortable: false`**: la sección no se renderiza; el menú queda como
  antes (solo operador + fechas).
- **Mismo `id` con sort activo en otra columna**: al hacer click en asc/desc
  desde el menú de la columna fecha, el sort de la otra columna se reemplaza
  automáticamente. Solo hay un sort activo a la vez.

---

## 13) Switch de vista Tabla/Kanban (opcional)

Renderiza en el toolbar un switch segmentado para alternar entre la vista de
tabla y la vista kanban. La feature es **opcional y retrocompatible**: si no
pasas `viewSwitch`, el switch no se renderiza y el componente se comporta igual
que en versiones anteriores.

El componente no cambia de vista por sí mismo: solo emite `onChange` con la
vista seleccionada para que el consumidor decida qué renderizar. La misma API
la expone el módulo Kanban, así que ambos comparten el contrato.

### Activación

```tsx
const [view, setView] = useState<ViewMode>("table");

<DataTable
  columns={columns}
  data={{ results: rows }}
  viewSwitch={{ active: view, onChange: setView }}
/>;
```

### Forma del objeto `viewSwitch`

| Campo         | Tipo                              | Default    | Descripción                                              |
| ------------- | --------------------------------- | ---------- | -------------------------------------------------------- |
| `active`      | `"table" \| "kanban"`             | requerido  | Vista activa. El switch resalta el botón correspondiente. |
| `onChange`    | `(view: ViewMode) => void`| requerido  | Se dispara solo al pasar a una vista distinta de la activa. |
| `tableLabel`  | `string`                          | `"Tabla"`  | Texto del botón de tabla.                                |
| `kanbanLabel` | `string`                          | `"Kanban"` | Texto del botón de kanban.                               |

### Contrato TS

```ts
export type ViewMode = "table" | "kanban";

export interface ViewSwitchConfig {
  active: ViewMode;
  onChange: (view: ViewMode) => void;
  tableLabel?: string;
  kanbanLabel?: string;
}
```

### Comportamiento

- Hacer click en la vista **ya activa** no dispara `onChange` (guard clause).
- Cada botón expone `aria-pressed` según sea o no la vista activa.
- El estado de la vista vive en el consumidor; el componente es controlado.
- El botón IA y el switch se renderizan en la zona derecha del toolbar,
  **inmediatamente a la izquierda del botón de creación**, de modo que su
  posición no varía aunque una vista muestre los selectores de archivado o
  agrupado y la otra no.

---

## 14) Botón de asistente IA (opcional)

Renderiza en el toolbar un botón de asistente IA. La feature es **opcional y
retrocompatible**: si no pasas `aiButton`, el botón no se renderiza y el
componente se comporta igual que en versiones anteriores.

El botón solo emite el evento `onClick`; no ejecuta ninguna lógica de IA por sí
mismo. La misma API la expone el módulo Kanban.

### Activación

```tsx
<DataTable
  columns={columns}
  data={{ results: rows }}
  aiButton={{ onClick: () => openAiAssistant() }}
/>
```

### Forma del objeto `aiButton`

| Campo     | Tipo         | Default | Descripción                                  |
| --------- | ------------ | ------- | -------------------------------------------- |
| `onClick` | `() => void` | requerido | Se dispara al pulsar el botón.             |
| `label`   | `string`     | `"AI"`  | Texto y `aria-label` del botón.              |

### Contrato TS

```ts
export interface AiButtonConfig {
  onClick: () => void;
  label?: string;
}
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

---

## 15) Paginación server-side / manual (opcional)

Por defecto la tabla pagina, busca y ordena **en memoria** sobre el `data`
recibido (client-side). Cuando el backend ya devuelve la página y el total,
podés delegar la paginación y la búsqueda al servidor con props **opcionales y
100% retrocompatibles**: si no las pasás, el comportamiento es idéntico al de
versiones anteriores.

### Activación

```tsx
const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 15 });
const [search, setSearch] = useState("");
const { rows, total } = useServerPage(pagination, search); // tu fetch

<DataTable
  columns={columns}
  data={rows} // SOLO la página actual
  getRowId={(row) => row.id}
  manualPagination
  serverRowCount={total} // total real en el servidor
  defaultPageSize={15}
  pageSizeOptions={[15, 25, 50]}
  onPaginationChange={({ pageIndex, pageSize }) =>
    setPagination({ pageIndex, pageSize })
  }
  onSearchChange={(query) => setSearch(query)}
/>;
```

### Props nuevas

| Prop                 | Tipo                                     | Default     | Descripción                                                                                                          |
| -------------------- | ---------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------ |
| `manualPagination`   | `boolean`                                | `false`     | Activa el modo server-side: la tabla no recorta ni cuenta filas localmente; renderiza el `data` tal cual (la página). |
| `serverRowCount`     | `number`                                 | `undefined` | Total de filas en el servidor; se usa para derivar el número de páginas.                                            |
| `serverPageCount`    | `number`                                 | `undefined` | Total de páginas en el servidor; tiene prioridad sobre `serverRowCount`.                                            |
| `onPaginationChange` | `(state: ManualPaginationState) => void` | `undefined` | Notifica cambios de página o de `pageSize` para que el consumidor haga refetch.                                     |
| `onSearchChange`     | `(query: string) => void`                | `undefined` | Notifica cambios de búsqueda para ejecutar una query server-side.                                                  |

`ManualPaginationState` = `{ pageIndex: number; pageSize: number }`.

### Comportamiento

- En modo manual, `data` debe contener **solo la página actual**. La tabla la
  renderiza sin recortarla y calcula "Página X de Y" con `serverPageCount` o
  `ceil(serverRowCount / pageSize)`.
- La **búsqueda global** se delega al servidor: el input del toolbar emite
  `onSearchChange` y, al cambiar la búsqueda, la tabla vuelve a la página 1. El
  filtrado global en memoria queda desactivado (el servidor ya filtró).
- **Orden y filtros por columna** siguen operando sobre la página actual (no
  disparan refetch). Para orden/filtro server-side, mapealos desde tus propios
  controles.
- `onPaginationChange` se dispara al usar prev/next o cambiar "Elementos por
  página". La tabla mantiene su propio `pageIndex`/`pageSize` y lo sincroniza
  con el consumidor vía el callback.

### Casos borde

- **Sin `serverRowCount` ni `serverPageCount`**: el conteo cae al largo del
  `data` recibido (la página), por lo que el paginador mostrará una sola página.
  Pasá siempre el total del servidor.
- **`features.pagination === false`**: no se renderiza el footer y `data` se
  muestra completo, igual que en client-side.
- **Retrocompatibilidad**: omitir `manualPagination` (o pasarlo `false`) deja la
  tabla en modo client-side clásico, sin cambios de comportamiento.

---

## 16) Localización del calendario de fechas (español por defecto)

El calendario emergente (popover) que abre el `DateFilterMenu` de las columnas
`type: "date"` se renderiza en **español** (locale `es`) por defecto: el
encabezado del mes aparece capitalizado (`Junio 2026`) y la semana inicia en
**lunes**. Antes de v1.8.0 el calendario caía al locale `en-US` de
react-day-picker (`June 2026`, `Su Mo Tu...`, semana iniciando en domingo).

La localización vive en el wrapper compartido `src/components/ui/calendar.tsx`,
el mismo que usa el Kanban, por lo que el comportamiento es idéntico en ambos
componentes.

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

- No se añaden ni modifican props de `DataTable`; el arreglo es
  transparente para el componente.
- No afecta la persistencia ni las fechas ya guardadas: los filtros de fecha
  (`gt`/`lt`/`bt`) y el sort por fecha operan exactamente igual que antes.

---

## 17) Scroll interno, header fijo y reset de scroll al paginar (opcional)

Mejora la experiencia en tablas largas: el buscador, el agrupador y la cabecera
quedan **fijos arriba**, solo las **filas** scrollean dentro de un contenedor
propio y, al cambiar de página, el scroll **vuelve al inicio** automáticamente
(antes quedaba abajo y había que subir a mano). Todo es **opcional y
retrocompatible**: sin estas props, la tabla se comporta igual que en v1.8.0.

### Activación

```tsx
// Scroll interno autosuficiente (no depende del alto del padre) + header fijo:
<DataTable columns={columns} data={rows} tableMaxHeightClassName="gdy-table-max-h-md" />

// Llenar el alto del contenedor padre (padre con alto acotado) + header fijo:
<div style={{ height: "calc(100vh - 120px)" }}>
  <DataTable columns={columns} data={rows} fillHeight />
</div>
```

### Props nuevas

| Prop | Tipo | Default | Descripción |
| ---- | ---- | ------- | ----------- |
| `scrollResetOnPageChange` | `boolean` | `true` | Lleva el contenedor de filas a `top` al cambiar de página, tamaño de página, o al volver a la página 1 por búsqueda/filtro/orden/agrupación/archivados. No-op si las filas no scrollean internamente. |
| `stickyHeader` | `boolean` | `true` | Fija el `<thead>` con `position: sticky`. Con **gating**: solo se activa junto a `fillHeight` o `tableMaxHeightClassName`, para no alterar a quien scrollea la página. |
| `fillHeight` | `boolean` | `false` | `.gdy-table`/`.gdy-card` pasan a columna flex y `.gdy-table-wrap` es el scroller interno (`flex:1; min-height:0; overflow-y:auto`). Requiere un padre con alto acotado. |
| `tableMaxHeightClassName` | `string` | — | Clase de tope de alto sobre el contenedor de filas (utilidades `gdy-table-max-h-sm\|md\|lg`); scroll interno autosuficiente. Se aplica antes de `tableWrapClassName`. |

### Comportamiento

- **Scroll interno**: con `fillHeight` o `tableMaxHeightClassName`, solo el área de
  filas scrollea; buscador, agrupador y paginación quedan fijos.
- **Header fijo**: la cabecera se pega arriba del contenedor de filas; su borde
  inferior se preserva con `box-shadow` (porque `border-collapse: collapse`
  descarta el borde en celdas sticky) y con fondo opaco para no transparentar filas.
- **Reset de scroll**: se usa `useLayoutEffect` (antes del paint) para evitar
  parpadeo; cubre next/prev, tamaño de página y todo salto a la página 1.

### Casos borde

- Sin `fillHeight` ni `tableMaxHeightClassName`, `stickyHeader` no emite ninguna
  clase (gating) y el layout es idéntico a v1.8.0.
- Si un consumidor ya resuelve el scroll/sticky con su propio CSS (contenedor flex
  + `tableWrapClassName="... overflow-y-auto ..."`), sus reglas tienen mayor
  especificidad y siguen ganando; el reset de scroll opera igual sobre ese
  contenedor.
- Con `tableWrapClassName` que fuerza `overflow: visible` o sin paginación, el
  reset de scroll es un no-op inofensivo.

### Retrocompatibilidad

- Las cuatro props son opcionales; sin ellas, el comportamiento y el layout son
  idénticos a v1.8.0.
- No cambia el DOM del `<thead>`, por lo que los overrides de ancho por
  `nth-child` de los consumidores siguen funcionando.

---

## 18) Filtros de fecha, scrollbars finos y hover de checklist (opcional)

Seis mejoras de UX **opcionales y retrocompatibles**. Sin estas props, el filtrado
efectivo, el orden y la paginación son idénticos a v1.9.0; el único diff por
defecto es cosmético/intencional.

### Activación

```tsx
// Todo por defecto (scrollbars finos ON, calendario con mes/año ON, hover ON,
// submenú de fecha sin operador preseleccionado, formato dd/mm/yyyy):
<DataTable columns={columns} data={rows} getRowId={(r) => r.id} />

// Personalización:
<DataTable
  columns={columns}
  data={rows}
  getRowId={(r) => r.id}
  dateInputFormat="mm/dd/yyyy"      // formato inglés
  scrollbarColor="#94a3b8"          // color del thumb
  optionHoverColor="#e2e8f0"        // color del hover del checklist
/>

// Opt-out del comportamiento nuevo:
<DataTable
  columns={columns}
  data={rows}
  getRowId={(r) => r.id}
  thinScrollbars={false}
  calendarMonthYearDropdown={false}
  dateFilterRequireOperator={false}
/>
```

### Props nuevas

| Prop | Tipo | Default | Descripción |
| ---- | ---- | ------- | ----------- |
| `thinScrollbars` | `boolean` | `true` | Scrollbars finos gris claro en todas las áreas de scroll (filas, listas de opciones, regiones de alto acotado). `false` = scrollbars nativos. |
| `scrollbarColor` | `string` | token `--gdy-input` | Color del thumb, vía la variable `--gdy-scrollbar-thumb`. |
| `optionHoverColor` | `string` | tinte de `--gdy-muted` | Fondo hover de las filas del checklist de valores, vía `--gdy-option-hover-bg`. |
| `dateFilterRequireOperator` | `boolean` | `true` | El submenú de fecha abre sin operador preseleccionado y sin input hasta elegir uno; "Limpiar" lo retira. `false` restaura el legacy (`gt` preseleccionado). |
| `dateInputFormat` | `DateInputFormat` | `"dd/mm/yyyy"` | Máscara del placeholder, del display y del parseo manual. Valores: `"dd/mm/yyyy"`, `"dd-mm-yyyy"`, `"mm/dd/yyyy"`, `"mm-dd-yyyy"`. |
| `calendarMonthYearDropdown` | `boolean` | `true` | Selector de mes+año en la fila de navegación del calendario. `false` = etiqueta estática. |
| `calendarFromYear` | `number` | año − 100 | Primer año del desplegable de año. |
| `calendarToYear` | `number` | año + 10 | Último año del desplegable de año. |

### Comportamiento

- **Scrollbars (1)**: `scrollbar-width: thin` + `scrollbar-color` + pseudo-elementos
  `::-webkit-scrollbar`, parametrizados por CSS variables bajo la clase-gate
  `.gdy-thin-scroll`.
- **Submenú de fecha (2)**: `op` admite `""` (sin operador). La condición de la
  sección "Fechas" no renderiza picker con `op===""`; `applyColumnFilters` no filtra
  sin operador/valor.
- **Separadores/rango (3)**: `.gdy-panel-date .gdy-panel-section { width: 100% }`
  (scopeado; el checklist de valores no se ve afectado).
- **Formato/entrada manual (4)**: helpers `parseInputToDate`/`formatDateToInput`
  (date-fns). El valor almacenado sigue siendo ISO `yyyy-MM-dd`. El rango se ingresa
  por dos campos "Desde/Hasta" o por el calendario.
- **Mes/año (5)**: `captionLayout="dropdown"` con `startMonth`/`endMonth` en el
  calendario, pasado desde los pickers (no se toca el wrapper `Calendar`).
- **Hover (6)**: `.gdy-option-item:hover` con fondo configurable.

### Casos borde

- Escribir una fecha inválida o parcial no dispara el filtro (se ignora hasta que el
  texto sea una fecha válida bajo la máscara); en `blur` el input vuelve al valor
  formateado.
- Rango invertido (Desde > Hasta) por entrada manual: el filtro `bt` simplemente no
  devuelve filas (comportamiento predecible, sin error).
- Una fecha fuera de `[calendarFromYear, calendarToYear]` se sigue mostrando en el
  input aunque el desplegable de año no la incluya.

### Retrocompatibilidad

- Las 8 props son opcionales; sin ellas, filtrado/orden/paginación son idénticos a
  v1.9.0. `DateFilterState.op` se amplía a `DateFilterOp | ""` (aditivo).
- El calendario compartido `ui/calendar.tsx` no se modifica.

---

## 19) Tooltips de filtro, ancho del panel y calendario de rango (v1.11.0)

Correcciones visuales de los submenús de filtro, **sin cambios de API** y
retrocompatibles con v1.10.0. No hay props nuevas: aplican por defecto.

### Comportamiento

- **Tooltip nativo en textos truncados**: la cabecera de columna
  (`gdy-table-head-label`) y los valores del checklist del filtro (`gdy-option-label`)
  exponen el atributo `title` con su texto completo, que el navegador muestra al
  pasar el cursor. No se usa un tooltip a medida.
- **Ancho del panel acotado**: `.gdy-panel` recibe `max-width: 280px` y
  `.gdy-option-label` `max-width: 210px`. Los valores largos truncan con ellipsis
  en lugar de ensanchar el submenú.
- **Opciones de "Ordenar" apiladas**: la sección "Ordenar" usa
  `gdy-panel-section-stack`, que apila "Ascendente"/"Descendente" en columna a
  ancho completo.
- **Calendario de rango lado a lado**: al elegir "Entre (rango)", los dos meses
  se muestran en fila a partir de `768px` vía
  `@media (min-width: 768px) { .gdy-calendar-months { flex-direction: row } }`.

### Por qué CSS plano para el rango

El calendario no usa utilidades: `src/components/ui/styles.css` declara
`.gdy-calendar-months` en columna y, desde 768px, en fila, así que el rango se ve
igual en cualquier app sin depender de su Tailwind. `ui/calendar.tsx` solo asigna
los ganchos `gdy-calendar-*` y deja los estados del día en atributos
(`data-today`, `data-selected`, `data-range-start|middle|end`).

---

## 20) Orden por columna deseleccionable (tri-estado, v1.12.0)

El orden por columna pasa a ciclar **ascendente → descendente → sin orden**. Es
un cambio de **comportamiento, sin props nuevas ni cambios de API**, aplicado por
defecto y retrocompatible con v1.11.0.

### Comportamiento

- En la cabecera (columnas `sortable` no `filterable`), el 3.er clic quita el
  orden y restaura el orden natural de las filas.
- Dentro del submenú de filtro, volver a hacer clic en la dirección ya activa
  ("Ascendente"/"Descendente") también la deselecciona.
- Antes el orden quedaba fijo alternando asc ↔ desc y solo se "soltaba" ordenando
  por otra columna. Se mantiene el modelo single-column sort: solo hay un orden
  activo a la vez.

### Retrocompatibilidad

- No se añaden props. La única diferencia observable es intencional: el 3.er
  estado "sin orden" ahora es alcanzable desde la propia columna.

---

## 21) Menú de acciones con auto-posicionamiento (v1.12.0)

El menú de tres puntos (kebab) deja de ser un contenedor absoluto con posición
fija (`top: 30px`) y pasa a `DropdownMenu` (Radix) renderizado en un `Portal` con
detección de colisión. Es un cambio de **comportamiento, sin cambios de API**.

### Comportamiento

- El menú **se auto-posiciona**: se abre hacia arriba cuando la fila está cerca
  del borde inferior del área con scroll interno, por lo que ya no queda recortado
  en las últimas filas ni provoca el "salto" de scroll al abrirlo.
- Cierre por clic-fuera, `Escape` y navegación por teclado incluidos de forma
  nativa por Radix.

### Retrocompatibilidad

- No hay props nuevas. La diferencia observable es intencional de UX: el menú se
  reposiciona para no recortarse.

---

## 22) Acciones de menú personalizables (`rowActions.customActions`, v1.12.0)

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
  onClick: (row: TData) => void;
  placement?: "top" | "bottom";       // antes/después de las built-in (default "bottom")
  variant?: "default" | "destructive";
  disabled?: (row: TData) => boolean;
  hidden?: (row: TData) => boolean;
}
```

### Comportamiento

- **Orden por defecto (sin `menuActions`)**: primero las acciones `placement: "top"`,
  luego las built-in en orden `edit → archive → remove → history` y, por último, las
  `placement: "bottom"`, preservando el orden del array dentro de cada grupo.
- **Sin separadores automáticos**: el menú ya **no** dibuja líneas divisorias entre
  grupos. Los separadores solo aparecen si el consumidor los agrega vía `menuActions`
  (ver más abajo).
- **`variant: "destructive"`** aplica el estilo de acción peligrosa (como
  "Eliminar"); `disabled(row)` y `hidden(row)` se evalúan por fila.
- **Validación de `id` duplicado**: los `id` se validan en tiempo de ejecución. Si
  uno colisiona con un built-in (`edit`, `archive`, `remove`, `history`) o se
  repite entre las personalizadas, se lanza `DuplicateRowActionError` con un
  mensaje descriptivo.

### Activación

```tsx
import { Copy, Send } from "lucide-react";

<DataTable
  columns={columns}
  data={{ results: rows }}
  getRowId={(row) => row.id}
  rowActions={{
    onEdit: (row) => console.log("onEdit", row),
    onRemove: (row) => console.log("onRemove", row),
    customActions: [
      {
        id: "duplicate",
        label: "Duplicar",
        icon: <Copy size={16} />,
        placement: "top",
        onClick: (row) => duplicateRow(row),
      },
      {
        id: "send",
        label: "Enviar",
        icon: <Send size={16} />,
        onClick: (row) => sendRow(row),
        disabled: (row) => row.status === "Archivada",
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

Cada ítem es una unión discriminada por `kind`:

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
  onClick: (row: TData) => void;
  variant?: "default" | "destructive";
  disabled?: (row: TData) => boolean;
  hidden?: (row: TData) => boolean;
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

<DataTable
  columns={columns}
  data={{ results: rows }}
  getRowId={(row) => row.id}
  rowActions={{
    onEdit: (row) => editRow(row),
    onArchiveToggle: (row) => archiveRow(row),
    onRemove: (row) => removeRow(row),
    onHistory: (row) => showHistory(row),
    menuActions: [
      { kind: "label", id: "quick", label: "Acciones rápidas" },
      { id: "duplicate", label: "Duplicar", icon: <Copy size={16} />, onClick: (row) => duplicate(row) },
      { kind: "separator", id: "sep-1" },
      { kind: "builtin", id: "edit" },
      { kind: "builtin", id: "archive" },
      { kind: "builtin", id: "history" },
      { kind: "separator", id: "sep-2" },
      { kind: "builtin", id: "remove" },
      { id: "export", label: "Exportar", icon: <Download size={16} />, onClick: (row) => exportRow(row) },
    ],
  }}
/>;
```

---

## 23) Toggles/segmented-controls en la barra (`toggleGroups`, v1.12.0)

Nueva prop **opcional** `toggleGroups`. Cada grupo es un segmented-control con
mínimo dos opciones (icono opcional + etiqueta) que emite su propio evento; útil
para alternar datasets/vistas más allá del switch Tabla/Kanban. Es **opcional y
retrocompatible**: sin `toggleGroups`, la barra no cambia.

Por defecto se ubican en el grupo **derecho** de la barra, como **primeros
elementos** (a la izquierda de los controles fijos), sin alterar la posición de los
controles fijos. Con `position: "left"` cada grupo pasa al lado izquierdo (junto al
buscador). Para el control total de lados y orden del toolbar, usá `toolbarLayout`
(ver sección 26).

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

<DataTable
  columns={columns}
  data={{ results: rows }}
  getRowId={(row) => row.id}
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

## 24) Selectores generales en la barra (`headerSelectors`, v1.12.0)

Nueva prop **opcional** `headerSelectors`: selectores desplegables genéricos
adicionales (además de "Agrupar por" y "Mostrar"), cada uno con su propio evento
para actuar sobre la lista. Es **opcional y retrocompatible**: sin
`headerSelectors`, la barra no cambia.

Igual que `toggleGroups`, por defecto se ubican en el grupo **derecho** (como
primeros elementos, a la izquierda de los controles fijos) y aceptan
`position: "left"` para pasar al lado izquierdo. Para componer los lados y el orden
de todo el toolbar, usá `toolbarLayout` (ver sección 26).

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
<DataTable
  columns={columns}
  data={{ results: rows }}
  getRowId={(row) => row.id}
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

## 25) Selectores estilizados (no nativos, v1.12.0)

Todos los `<select>` nativos del navegador se sustituyen por un selector propio
basado en Radix (caja con borde, dropdown en `Portal`, flecha e indicador de
selección, estados focus/hover y soporte de tema claro/oscuro vía tokens). El
contrato de valor/evento se mantiene idéntico; el cambio es de markup/estilo y suma
la prop opcional `selectTheme` para tematizar todos los selectores a la vez (ver más
abajo).

### Alcance en la tabla

- **"Mostrar"** (selector de archivados).
- **"Agrupar por"** (selector de agrupado).
- **Tamaño de página** en la paginación.
- **Edición inline en celda** (`inlineEditOptions`).

### Ajustes visuales (v1.12.0)

- **Ancho del desplegable ≥ ancho del trigger**: el panel de opciones nunca es más
  estrecho que el recuadro y crece hasta que cada opción quepa en una línea (antes
  igualaba el ancho exacto y las etiquetas largas se partían en dos líneas).
- **Menos redondeo**: las esquinas del trigger y del panel se redujeron para un look
  más sobrio.

### Theming global (`selectTheme`)

Nueva prop **opcional** `selectTheme` a nivel de componente. Es **global**: se aplica
a **todos** los selectores estilizados de la tabla (header, "Agrupar por", "Mostrar",
tamaño de página y edición inline en celda) en una sola declaración.

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
<DataTable
  columns={columns}
  data={{ results: rows }}
  getRowId={(row) => row.id}
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

## 26) Posición y layout del toolbar (`toolbarLayout`, v1.12.0)

El toolbar admite dos niveles de control sobre la ubicación de sus controles: la
prop `position` de cada `toggleGroups`/`headerSelectors` (ajuste puntual) y la prop
`toolbarLayout` a nivel de componente (composición explícita de todo el toolbar).
Ambas son **opcionales y retrocompatibles**.

### Layout por defecto

Sin `toolbarLayout`:

- **Izquierda**: buscador y "Limpiar filtros".
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
`headerSelectors`.

La visibilidad "dura" la siguen gobernando los feature flags: un slot apagado (por
`features` o porque su configuración no se pasó) **no** aparece aunque esté listado.

```tsx
<DataTable
  columns={columns}
  data={{ results: rows }}
  getRowId={(row) => row.id}
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
