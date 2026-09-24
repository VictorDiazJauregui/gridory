# KanbanBoard

[English](kanban.md) · [Español](kanban.es.md)

`KanbanBoard` muestra registros tipados como tarjetas repartidas en columnas según el valor de una
agrupación. Busca, filtra y ordena las tarjetas, y deja que el usuario las arrastre de una columna a
otra. Nunca modifica tus datos: cada cambio sale por un callback y tu app decide qué guardar.

## Importación

```ts
import { KanbanBoard, type ColumnDefinition, type KanbanGroupOption } from "gridory/kanban";
```

Importa `gridory/styles.css` una sola vez en tu app, antes de cualquier regla que lo sobrescriba
(consulta [theming.es.md](theming.es.md)). La entrada raíz `gridory` reexporta los mismos nombres.

## Ejemplo rápido

```tsx
import { useState } from "react";
import { KanbanBoard, type ColumnDefinition, type KanbanGroupOption } from "gridory/kanban";

interface Task {
  id: string;
  title: string;
  owner: string;
  priority: "low" | "high";
  project: string;
  status: "todo" | "doing" | "done";
  dueDate: string;
}

const fields: ColumnDefinition<Task>[] = [
  { id: "title", header: "Title", accessor: (task) => task.title },
  { id: "owner", header: "Owner", accessor: (task) => task.owner, filterable: true },
  {
    id: "priority",
    header: "Priority",
    accessor: (task) => task.priority,
    searchable: false,
    filterable: true,
    filterOptions: [{ value: "low", label: "Low" }, { value: "high", label: "High" }],
  },
  { id: "project", header: "Project", accessor: (task) => task.project, filterable: true },
  { id: "dueDate", header: "Due date", accessor: (task) => task.dueDate, type: "date", filterable: true },
];

const groups: KanbanGroupOption<Task>[] = [
  {
    id: "status",
    label: "Status",
    accessor: (task) => task.status,
    setValue: (task, nextValue) => ({ ...task, status: nextValue as Task["status"] }),
    values: [
      { value: "todo", label: "To do" },
      { value: "doing", label: "In progress" },
      { value: "done", label: "Done" },
    ],
  },
];

const initialTasks: Task[] = [
  { id: "1", title: "Write the brief", owner: "Ana", priority: "high", project: "Website", status: "todo", dueDate: "2026-10-02" },
  { id: "2", title: "Review the design", owner: "Luis", priority: "low", project: "Mobile app", status: "doing", dueDate: "2026-10-05" },
];

export const TaskBoard = () => {
  const [tasks, setTasks] = useState(initialTasks);
  return (
    <KanbanBoard
      fields={fields}
      data={tasks}
      groups={groups}
      defaultGroupId="status"
      getCardId={(task) => task.id}
      onCardMove={(event) =>
        setTasks((previous) =>
          previous.map((task) => (task.id === event.cardId ? event.updatedCard : task)),
        )
      }
    />
  );
};
```

## Modelo de datos

### Tarjetas

`data` acepta un array plano o un envoltorio de API (`DataInput<TData>`): un objeto con una de las
claves `data`, `items`, `results`, `records` o `payload.data` / `payload.items` / `payload.results`.
Se usa la primera de esas claves que esté definida, en ese orden. Si no contiene un array, el tablero
se queda sin tarjetas. `normalizeRow(raw, index)` convierte cada registro del envoltorio a `TData`.
Un array plano se usa tal cual, así que `normalizeRow` no se le aplica.

`getCardId(card, index)` es obligatoria. Su resultado identifica la tarjeta en el drag and drop, en
los eventos y como key de React, así que tiene que ser único y estable.

El tablero guarda una copia interna de las tarjetas y la reemplaza cada vez que `data` o
`normalizeRow` cambian de identidad. Pasa un `normalizeRow` estable (declarado a nivel de módulo o
memoizado) para que un nuevo render de tu componente no reconstruya las tarjetas.

### Campos

`fields` es un array de `ColumnDefinition<TData>`, el mismo tipo que usa la tabla para sus columnas.
En el tablero, un campo alimenta la búsqueda, los filtros, el ordenamiento y la tarjeta por defecto.
Estas propiedades tienen efecto:

| Propiedad | Efecto en el tablero |
|---|---|
| `id` | Identifica el campo en los filtros y el ordenamiento. |
| `header` | Texto del botón de filtro y de las líneas de valor de la tarjeta por defecto. |
| `accessor` | Valor con el que se busca, se filtra, se ordena y se rellena la tarjeta por defecto. En la tarjeta, los arrays se unen con `", "`. |
| `type` | `"date"` cambia el filtro de valores por uno de fechas y el primer campo de fecha agrega la línea de fecha a la tarjeta por defecto. También elige el comparador de ordenamiento. Por defecto `"text"`. |
| `searchable` | Por defecto `true`. Ponlo en `false` para excluir el campo de la búsqueda de la toolbar. |
| `filterable` | Agrega un botón de filtro para el campo bajo la toolbar. Por defecto `false`. |
| `filterOptions` | Opciones `{ value, label }` declaradas para el filtro de valores. Sin ellas, las opciones son los valores distintos que aparecen en las tarjetas, en orden alfabético. |
| `sortable` | Por defecto `true`. Ponlo en `false` para quitar los botones de ordenamiento del menú de filtro del campo. |

`cell`, `width`, `inlineEditOptions`, `onInlineEdit` y `valueHighlights` solo aplican a la tabla y el
tablero los ignora. Para markup propio, usa `renderCard`. La referencia completa de campos está en
[table.es.md](table.es.md#columnas).

### Grupos

`groups` enumera las formas en que el usuario puede repartir las tarjetas en columnas. Cada entrada
es un `KanbanGroupOption<TData>`:

| Propiedad | Tipo | Descripción |
|---|---|---|
| `id` | `string` | Identificador que usan `defaultGroupId`, `onGroupChange` y los eventos. |
| `label` | `string` | Texto de la opción en el selector de grupo y de la etiqueta de grupo en la tarjeta por defecto. |
| `accessor` | `(card: TData) => Primitive \| Primitive[]` | Lee el valor de agrupación. Un array aporta su primera entrada no vacía; `null`, `undefined` y los strings en blanco cuentan como vacíos. |
| `setValue` | `(card: TData, nextValue: string) => TData` | Devuelve la tarjeta con su valor de agrupación cambiado a `nextValue`. Se llama al soltar la tarjeta. |
| `values` | `FilterOption[]` | Columnas fijas opcionales, en este orden, con sus títulos. |

Con `values`, el tablero renderiza una columna por entrada en el orden dado, incluidas las que no
tienen tarjetas. Si una tarjeta visible tiene un valor que no está en la lista, se agrega una columna
después de ellas, con el valor en bruto como título.

Sin `values`, las columnas son los valores distintos de todas las tarjetas del tablero (no solo de las
que pasan la búsqueda y los filtros), con el propio valor como título y en orden alfabético por título.

Una tarjeta con el valor vacío va a una columna titulada `"Sin valor"`. Para ponerle otro nombre,
agrega a `values` una entrada con `value: ""` y tu propio `label`. Una columna sin tarjetas muestra
`"Sin cards"`, y cuando ninguna tarjeta pasa la búsqueda, los filtros y la vista de archivados, el
tablero muestra `emptyMessage` en lugar de las columnas. `"Sin valor"` y `"Sin cards"` son textos fijos.

El tablero lanza un error durante el render cuando la configuración de agrupación no sirve:

- `groups` está vacío: ``KanbanBoard requiere al menos una configuración de agrupación en `groups`.``
- `defaultGroupId` no coincide con ningún grupo:
  ``KanbanBoard requiere que `defaultGroupId` exista dentro de `groups`.``

## Features

`features` activa o desactiva capacidades completas. Todos los flags valen `true` por defecto.

| Flag | Por defecto | Efecto con `false` |
|---|---|---|
| `search` | `true` | Oculta el buscador y no aplica la búsqueda. |
| `sorting` | `true` | Quita los botones de ordenamiento de los menús de filtro; no se aplica ningún orden. |
| `filtering` | `true` | Oculta la fila de filtros y el botón de limpiar filtros; los filtros no se aplican. |
| `createButton` | `true` | Oculta el botón de crear aunque `onCreate` esté definido. |
| `rowActions` | `true` | Oculta el menú de la tarjeta aunque `rowActions` esté definido. |
| `groupSelector` | `true` | Oculta el selector de grupo; el tablero se queda en el grupo actual. |
| `dragAndDrop` | `true` | Las tarjetas no se pueden arrastrar. |

### Columnas y agrupación

La toolbar renderiza un selector con una opción por grupo, con el texto `"<prefix>: <label>"`.
`groupSelectorLabel` define el prefijo y el nombre accesible del selector; por defecto es el texto en
español `"Agrupar por"`. No hay opción "ninguno": el tablero siempre está agrupado. Al elegir un grupo
se llama a `onGroupChange(groupId)` y las tarjetas se reagrupan.

`defaultGroupId` es solo la selección inicial. Si `groups` cambia y ya no contiene el id seleccionado,
el tablero vuelve al primer grupo sin llamar a `onGroupChange`.

Cada columna tiene una cabecera con su título (recortado con puntos suspensivos y con el texto
completo en el atributo `title`) y el número de tarjetas que muestra. El tablero hace scroll
horizontal, y el cuerpo de cada columna hace scroll vertical a partir de `columnBodyMaxHeight` píxeles
(por defecto `480`).

### Drag and drop

Con `features.dragAndDrop` todas las tarjetas se pueden arrastrar. Al soltar una tarjeta en otra
columna, el tablero llama al `setValue(card, columnValue)` del grupo activo, mueve el resultado en su
copia interna y llama a `onCardMove` con un `KanbanMoveEvent<TData>`:

| Campo | Descripción |
|---|---|
| `card` | La tarjeta tal como estaba antes de soltarla. |
| `updatedCard` | La tarjeta que devuelve `setValue`. |
| `cardId` | Resultado de `getCardId` para la tarjeta. |
| `groupId` | Id del grupo activo. |
| `fromValue` | Valor de agrupación antes de soltarla. |
| `toValue` | Valor de la columna donde se soltó la tarjeta. |

Soltar una tarjeta en su propia columna no hace nada. El tablero no cambia los datos que le pasaste:
guarda `updatedCard` en tu estado, como en el ejemplo rápido, o el movimiento se pierde la próxima vez
que cambie `data`. Durante el arrastre, la tarjeta lleva `data-dragging` y la columna que está bajo el
puntero lleva `data-drop-target`.

### Clic en la tarjeta

`onCardClick` recibe un `KanbanCardClickEvent<TData>`: `{ card, cardId, groupId, value }`, donde
`value` es el valor de agrupación de la columna que muestra la tarjeta. No se dispara con el clic que
termina un arrastre, ni cuando el usuario abre el menú de la tarjeta o elige una de sus acciones.
Dentro de `renderCard`, llama a `event.stopPropagation()` en tus propios botones e inputs para que no
lo disparen.

### Búsqueda

El buscador de la toolbar (`searchPlaceholder`, por defecto `"Buscar cards..."`) deja las tarjetas en
las que algún campo buscable contiene el texto, sin distinguir mayúsculas de minúsculas, sobre los
valores que devuelve `accessor`. El buscador está documentado en [toolbar.es.md](toolbar.es.md).

### Filtros

Bajo la toolbar, el tablero renderiza un botón por cada campo `filterable`, con su `header` como
texto. Los campos de texto y número abren una lista de valores con casillas y buscador; los de fecha
abren un menú con los operadores mayor que, menor que y entre, con un calendario. Si eliges varios
valores de un campo, basta con que coincida uno, y los filtros de campos distintos tienen que
cumplirse todos. Un botón lleva `data-filtered` mientras su campo tiene un filtro, y la toolbar
muestra un botón de limpiar filtros. Los menús, los inputs de fecha y las opciones del calendario se
comparten con la tabla y están documentados en [toolbar.es.md](toolbar.es.md).

### Ordenamiento

Los botones de ordenamiento están en el menú de filtro de cada campo, así que el usuario solo puede
ordenar por campos `filterable`. Se ordena por un solo campo a la vez. En el menú de un campo de texto
o número, volver a hacer clic en la dirección activa quita el orden; en el de un campo de fecha,
`"Limpiar"` quita el orden junto con el filtro.

El tablero ordena las tarjetas filtradas antes de repartirlas en columnas, así que el orden se aplica
dentro de cada columna y las columnas no se mueven de su sitio. `type` elige el comparador: `"text"`
compara según el locale (`es`), ignora mayúsculas y acentos y compara las secuencias de dígitos como
números; `"number"` compara `Number(value)`; `"date"` compara los diez primeros caracteres del valor,
así que los strings ISO se ordenan por día. Sin un orden activo, las tarjetas mantienen el orden de
`data`.

### Tarjetas personalizadas

La tarjeta por defecto se construye a partir de `fields`, en este orden:

- **Título**: el valor del primer campo, o `"Card"` si está vacío.
- **Subtítulo**: el valor del segundo campo, si existe.
- **Menú de la tarjeta**: junto al título, mientras `features.rowActions` esté activo y `rowActions`
  produzca al menos una acción.
- **Etiqueta de grupo**: `"<group label>: <value>"`, con el valor de agrupación en bruto (no el
  título de la columna) o `"Sin valor"` si está vacío.
- **Líneas de valor**: el tercer y el cuarto campo como `Header: value`; se omiten si están vacíos.
- **Línea de fecha**: el primer campo con `type: "date"`, en formato `dd/mm/yyyy` a partir de un valor
  ISO `yyyy-mm-dd`. Se muestra aunque el valor esté vacío. Si ese campo es además el tercero o el cuarto,
  también aparece su línea de valor sin formato, así que conviene ubicar los campos de fecha a partir
  del quinto.

`renderCard(card, context)` reemplaza el contenido de la tarjeta por tu propio markup. `context` es un
`KanbanCardRenderContext<TData>`: `{ card, groupId, groupValue }`. El elemento de la tarjeta, su
comportamiento de arrastre y `onCardClick` no cambian. Mientras `features.rowActions` esté activo, el
menú de la tarjeta se renderiza debajo de tu markup, dentro de `gdy-kanban-card-actions`.

```tsx
<KanbanBoard
  {...boardProps}
  renderCard={(task, { groupValue }) => (
    <div className="task-card">
      <strong>{task.title}</strong>
      <span>{task.owner} · {groupValue}</span>
    </div>
  )}
/>
```

### Vista de archivados y acciones de tarjeta

`archivedView` agrega a la toolbar el selector activos/archivados/todos, y `rowActions` llena el menú
de la tarjeta con las acciones predefinidas de editar, archivar, eliminar e historial, más las tuyas.
Las dos se comparten con la tabla y están documentadas en [toolbar.es.md](toolbar.es.md).

## Eventos

| Callback | Firma | Se dispara cuando |
|---|---|---|
| `onCardMove` | `(event: KanbanMoveEvent<TData>) => void` | Se suelta una tarjeta en una columna distinta de la suya. |
| `onCardClick` | `(event: KanbanCardClickEvent<TData>) => void` | Se hace clic en una tarjeta (no al terminar un arrastre ni desde su menú). |
| `onGroupChange` | `(groupId: string) => void` | El usuario elige otro grupo en el selector. No se dispara al montar. |
| `onCreate` | `() => void` | Se hace clic en el botón de crear. El botón solo se renderiza si defines este callback. |
| `rowActions.onEdit`, `onArchive`, `onArchiveToggle`, `onRemove`, `onHistory` | `(row: TData) => void` | Se elige la acción predefinida correspondiente en el menú de la tarjeta. |
| `rowActions.customActions[].onClick` | `(row: TData) => void` | Se elige una acción personalizada en el menú de la tarjeta. |
| `archivedView.onChange` | `(mode: ArchivedViewMode) => void` | El usuario cambia el selector de la vista de archivados. |
| `viewSwitch.onChange` | `(view: ViewMode) => void` | El usuario hace clic en una vista del selector tabla/kanban. |
| `aiButton.onClick` | `() => void` | Se hace clic en el botón de IA. |
| `toggleGroups[].onChange`, `headerSelectors[].onChange` | `(value: string) => void` | Cambia un control personalizado de la toolbar. |

Los callbacks que siguen a `onGroupChange` pertenecen a `DataViewProps`; consulta
[toolbar.es.md](toolbar.es.md).

## Toolbar y acciones de tarjeta

La toolbar que está sobre el tablero (buscador, botón de limpiar filtros, selector de vista de
archivados, selector de grupo, botón de IA, selector tabla/kanban, botón de crear, grupos de toggles y
selectores de cabecera personalizados, y el `toolbarLayout` que los ordena) y el menú de la tarjeta
(acciones predefinidas de editar, archivar, eliminar e historial, más `customActions` y `menuActions`)
se comparten con la tabla. Se configuran con `DataViewProps` y están documentados en
[toolbar.es.md](toolbar.es.md). En el tablero hay dos diferencias: el selector de grupo no tiene
opción "ninguno" y no hay paginación, así que se renderizan todas las tarjetas que pasan la búsqueda,
los filtros y la vista de archivados.

## Estilos

El elemento raíz es `div.gdy-kanban`, que además lleva `gdy-thin-scroll` mientras `thinScrollbars`
esté activo (lo está por defecto). Dentro, `div.gdy-scope.gdy-card` envuelve la toolbar, la fila de
filtros y el viewport del tablero, `div.gdy-kanban-board-wrap.gdy-scroll`. Cuando no hay ninguna
tarjeta visible, el viewport contiene un único elemento `gdy-empty` con `emptyMessage`.

| Clase | Elemento | Atributos de estado |
|---|---|---|
| `gdy-kanban-filter-row` | Fila de botones de filtro bajo la toolbar. | — |
| `gdy-kanban-filter-trigger` | Botón de filtro de un campo, con `gdy-kanban-filter-trigger-label`. | `data-filtered` mientras el campo tiene un filtro. |
| `gdy-kanban-board` | Fila flex de columnas dentro del viewport. | — |
| `gdy-kanban-column` | Columna (`section`), con su cabecera `gdy-kanban-column-head`. | `data-drop-target` mientras se arrastra una tarjeta encima. |
| `gdy-kanban-column-title` | Título de la columna. | — |
| `gdy-kanban-column-count` | Contador de tarjetas. | — |
| `gdy-kanban-column-body` | Lista de tarjetas con scroll; `gdy-kanban-empty-col` es su placeholder `"Sin cards"`. | — |
| `gdy-kanban-card` | Tarjeta (`article`). | `data-dragging` mientras se arrastra. |
| `gdy-kanban-card-title` | Título de la tarjeta por defecto; `gdy-kanban-card-subtitle` es su subtítulo. | — |
| `gdy-kanban-tag` | Etiqueta de grupo de la tarjeta por defecto. | — |
| `gdy-kanban-card-value` | Líneas `Header: value` y línea de fecha de la tarjeta por defecto. | — |
| `gdy-kanban-card-actions` | Slot del menú bajo un `renderCard` personalizado. | — |

El tablero lee estos tokens. Ninguno viene declarado por defecto y cada uno usa un token base como
fallback, así que basta con declararlos en `:root`, en el scope de tu tema oscuro o en cualquier
ancestro del tablero:

| Token | Fallback | Pinta |
|---|---|---|
| `--gdy-kanban-column-bg` | `--gdy-muted` | Fondo de la columna. |
| `--gdy-kanban-column-border` | `--gdy-border` | Borde de la columna y separador de la cabecera. |
| `--gdy-kanban-card-bg` | `--gdy-card` | Fondo de la tarjeta y del placeholder de columna vacía. |
| `--gdy-kanban-card-border` | `--gdy-border` | Borde de la tarjeta. |
| `--gdy-kanban-drop-bg` | Un tinte de `--gdy-muted` | Fondo de la columna mientras tiene una tarjeta arrastrada encima. |
| `--gdy-kanban-drop-outline` | `--gdy-muted-foreground` | Contorno discontinuo de la columna de destino. |

`boardWrapClassName` agrega tus propias clases al viewport. `boardMinHeightClassName` (por defecto
`"gdy-kanban-min-h-md"`) fija su altura mínima con una de las utilidades incluidas,
`gdy-kanban-min-h-sm` (240px), `gdy-kanban-min-h-md` (360px) y `gdy-kanban-min-h-lg` (520px), o con
cualquier clase tuya. `scrollbarColor` y `optionHoverColor` definen `--gdy-scrollbar-thumb` y
`--gdy-option-hover-bg` en la raíz (consulta [toolbar.es.md](toolbar.es.md)).

Una regla con el mismo selector en tu CSS, cargada después de `gridory/styles.css`, sobrescribe la de
la librería:

```css
:root {
  --gdy-kanban-column-bg: #f4f4f5;
  --gdy-kanban-drop-outline: #6366f1;
}

.gdy-kanban-card {
  border-radius: 6px;
}
```

El contrato de estilos, los tokens base y los temas claro y oscuro están en
[theming.es.md](theming.es.md); el catálogo completo de clases, atributos de estado y tokens está en
[style-hooks.es.md](style-hooks.es.md).

## Referencia de props

Props propias de `KanbanBoardProps<TData>`, en el orden del código fuente.

| Prop | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `fields` | `ColumnDefinition<TData>[]` | — | Campos con los que se busca, se filtra, se ordena y se renderizan las tarjetas (obligatoria). |
| `data` | `DataInput<TData>` | — | Tarjetas: un array o un envoltorio de API (obligatoria). |
| `groups` | `KanbanGroupOption<TData>[]` | — | Agrupaciones disponibles; el array no puede estar vacío (obligatoria). |
| `defaultGroupId` | `string` | — | Grupo inicial; tiene que existir en `groups` (obligatoria). |
| `normalizeRow` | `(row: unknown, index: number) => TData` | — | Convierte cada registro de un envoltorio a `TData`. |
| `getCardId` | `(card: TData, index: number) => string` | — | Id único y estable de la tarjeta (obligatoria). |
| `features` | `KanbanBoardFeatures` | todos `true` | Flags de capacidades. |
| `renderCard` | `(card: TData, context: KanbanCardRenderContext<TData>) => ReactNode` | — | Contenido personalizado de la tarjeta. |
| `onCardMove` | `(event: KanbanMoveEvent<TData>) => void` | — | Tarjeta soltada en otra columna. |
| `onCardClick` | `(event: KanbanCardClickEvent<TData>) => void` | — | Clic en una tarjeta. |
| `onGroupChange` | `(groupId: string) => void` | — | Cambio en el selector de grupo. |
| `groupSelectorLabel` | `string` | `"Agrupar por"` | Prefijo de cada opción de grupo y nombre accesible del selector. |
| `boardWrapClassName` | `string` | — | Clases extra para el viewport del tablero. |
| `boardMinHeightClassName` | `string` | `"gdy-kanban-min-h-md"` | Clase de altura mínima del viewport del tablero. |
| `columnBodyMaxHeight` | `number` | `480` | Altura máxima en píxeles del cuerpo de cada columna antes de hacer scroll. |

`KanbanBoardProps` también acepta todas las props de `DataViewProps` (`searchPlaceholder`,
`createLabel`, `onCreate`, `emptyMessage`, `rowActions`, `archivedView`, `viewSwitch`, `aiButton`,
`toggleGroups`, `headerSelectors`, `toolbarLayout`, `selectTheme`, `thinScrollbars`, `scrollbarColor`,
`optionHoverColor`, `dateFilterRequireOperator`, `dateInputFormat`, `calendarMonthYearDropdown`,
`calendarFromYear`, `calendarToYear`), documentadas en [toolbar.es.md](toolbar.es.md). En el tablero,
`searchPlaceholder` vale por defecto `"Buscar cards..."`, `createLabel` vale `"Nuevo"` y
`emptyMessage` vale `"No se encontraron resultados"`.

### Tipos

- `KanbanGroupOption<TData>`: una agrupación, `{ id, label, accessor, setValue, values? }`.
- `KanbanBoardFeatures`: los flags booleanos opcionales de `features` (`search`, `sorting`,
  `filtering`, `createButton`, `rowActions`, `groupSelector`, `dragAndDrop`).
- `KanbanMoveEvent<TData>`: `{ card, updatedCard, cardId, groupId, fromValue, toValue }`, el payload
  de `onCardMove`.
- `KanbanCardClickEvent<TData>`: `{ card, cardId, groupId, value }`, el payload de `onCardClick`.
- `KanbanCardRenderContext<TData>`: `{ card, groupId, groupValue }`, el segundo argumento de
  `renderCard`.
- `KanbanSortingState`: `{ id: string; direction: SortDirection }`, el orden activo de un campo.
- `KanbanFiltersState`: `Record<string, string[]>`, los valores seleccionados por id de campo.
- `KanbanDateFiltersState`: `Record<string, DateFilterState>`, el filtro de fecha por id de campo.
