<h1 align="center">Gridory</h1>

<p align="center">
  Componentes React para aplicaciones con muchos datos: tabla, kanban y asistente de IA<br/>
  que emiten eventos en lugar de mutar tus datos.
</p>

> **Estado**: repositorio privado, versión `1.0.0`. La publicación en npm está pendiente;
> hasta entonces el paquete se consume desde este repositorio.

## Por qué Gridory

El mismo conjunto de datos, renderizado como la vista que la tarea necesite: una tabla, un
tablero y, próximamente, una línea de tiempo. Los componentes **emiten eventos** y nunca
mutan tus datos; tu aplicación sigue siendo la única fuente de verdad.

- **Un modelo de datos, varias vistas.** Alterna tabla ↔ kanban sin reestructurar tus filas.
- **Orientado a eventos.** Cada acción es un callback: tú decides qué llega a tu backend.
- **IA que pregunta antes.** El asistente propone acciones de crear, actualizar o mover; el usuario confirma.
- **Tipado de punta a punta.** Genérico sobre el tipo de tus filas, sin `any` en la API pública.

## Módulos

| Importación | Qué incluye |
|---|---|
| `gridory` | Todo el kit: componentes, hooks, helpers y tipos de los tres módulos. |
| `gridory/table` | `DataTable`: búsqueda global, filtros por columna y fecha, orden tri-estado, paginación client o server-side, edición inline, agrupado de filas, acciones por fila componibles, barra de herramientas configurable y cabecera fija con scroll interno. |
| `gridory/kanban` | `KanbanBoard`: tablero sobre el mismo modelo de datos, columnas por campo de agrupación, arrastrar y soltar, filtros, orden y render de tarjeta personalizado. |
| `gridory/ai` | `AIChatSidebar`, `AIChatButton` y `useAIChat`: asistente lateral para cualquier proveedor compatible con la API de OpenAI, con tool-calling que propone acciones que el usuario confirma. |
| `gridory/styles.css` | CSS compilado de tabla, kanban, asistente y primitivos (`dist/gridory.css`). |

## Instalación

Dependencias peer: React 18.2+ o 19 y `react-dom`. No hace falta Tailwind en la aplicación
consumidora: `gridory/styles.css` es autocontenido (tokens de tema, reset acotado y las hojas
`gdy-*` de cada módulo).

```bash
npm install gridory
```

> Mientras el paquete no esté publicado en npm, instálalo desde el repositorio o enlázalo
> localmente con `npm link` después de ejecutar `npm run build`.

Importa el CSS compilado una sola vez en tu aplicación:

```ts
import "gridory/styles.css";
```

## Tema y tokens

Colores, radio y sombras salen de variables CSS con prefijo `--gdy-*` incluidas en
`gridory/styles.css`. Traen un **tema claro por defecto** y un **tema oscuro** que se activa con la
clase `dark` o el atributo `data-theme="dark"` en un ancestro. Ponlo en `<html>`: los menús,
selects y calendarios se montan en portales bajo `<body>`, así que un envoltorio intermedio no
los alcanza.

```html
<html class="dark">
```

- **Puente con shadcn/ui.** Cada token base lee la variable shadcn del mismo nombre si la app la
  define (`--gdy-primary: var(--primary, …)`), tanto en claro como en oscuro: una app con tokens
  shadcn en colores completos (`oklch(…)`, `hsl(…)`, hex) tematiza Gridory sin configurar nada.
  Si tus variables guardan canales sueltos (`--primary: 222 47% 11%`), declara los `--gdy-*`.
- **Sobrescribir.** Declara el token en `:root` (claro) y en `.dark` (oscuro); las reglas de la
  librería tienen especificidad cero, así que siempre ganas:

```css
:root { --gdy-primary: #0f766e; --gdy-radius: 6px; }
.dark { --gdy-primary: #5eead4; }
```

| Token base | Claro | Oscuro | Uso |
|---|---|---|---|
| `--gdy-background` / `--gdy-foreground` | `oklch(1 0 0)` / `oklch(0.145 0 0)` | `oklch(0.145 0 0)` / `oklch(0.985 0 0)` | fondo y texto |
| `--gdy-card` / `--gdy-card-foreground` | `oklch(1 0 0)` / `oklch(0.145 0 0)` | `oklch(0.205 0 0)` / `oklch(0.985 0 0)` | contenedor de tabla y kanban, tarjetas |
| `--gdy-popover` / `--gdy-popover-foreground` | `oklch(1 0 0)` / `oklch(0.145 0 0)` | `oklch(0.205 0 0)` / `oklch(0.985 0 0)` | paneles de filtro, menús, selects, calendario |
| `--gdy-primary` / `--gdy-primary-foreground` | `oklch(0.205 0 0)` / `oklch(0.985 0 0)` | `oklch(0.922 0 0)` / `oklch(0.205 0 0)` | botón primario, acento del asistente |
| `--gdy-secondary` / `--gdy-secondary-foreground` | `oklch(0.97 0 0)` / `oklch(0.205 0 0)` | `oklch(0.269 0 0)` / `oklch(0.985 0 0)` | títulos de columna, etiquetas |
| `--gdy-muted` / `--gdy-muted-foreground` | `oklch(0.97 0 0)` / `oklch(0.556 0 0)` | `oklch(0.269 0 0)` / `oklch(0.708 0 0)` | cabecera de tabla, columnas, botones, texto secundario |
| `--gdy-accent` / `--gdy-accent-foreground` | `oklch(0.97 0 0)` / `oklch(0.205 0 0)` | `oklch(0.269 0 0)` / `oklch(0.985 0 0)` | hover, filas de grupo |
| `--gdy-destructive` / `--gdy-destructive-foreground` | `oklch(0.577 0.245 27.325)` / `oklch(0.985 0 0)` | `oklch(0.704 0.191 22.216)` / `oklch(0.985 0 0)` | acciones destructivas |
| `--gdy-border` / `--gdy-input` / `--gdy-ring` | `oklch(0.922 0 0)` / `oklch(0.922 0 0)` / `oklch(0.708 0 0)` | `oklch(1 0 0 / 10%)` / `oklch(1 0 0 / 15%)` / `oklch(0.556 0 0)` | bordes, bordes de inputs, foco |
| `--gdy-radius` | `0.625rem` | igual | radio base |
| `--gdy-link` | `oklch(0.546 0.245 262.881)` | `oklch(0.707 0.165 254.624)` | enlaces de los paneles de filtro |
| `--gdy-overlay` | `rgb(0 0 0 / 0.3)` | `rgb(0 0 0 / 0.6)` | fondo del asistente en móvil |
| `--gdy-shadow-sm` / `--gdy-shadow-md` / `--gdy-shadow-lg` | sombras suaves | sombras más densas | switch de vista, paneles y menús, panel del asistente |

Sobre esos tokens base cada componente lee **tokens de componente** opcionales, con el mismo
mecanismo de sobrescritura: `--gdy-table-*` (cabecera, bordes, hover de fila, filas de grupo),
`--gdy-kanban-*` (columnas, tarjetas, zona de soltado), `--gdy-select-*` (equivalentes a la prop
`selectTheme`), `--gdy-btn-*`, `--gdy-input-*`, `--gdy-panel-*`, `--gdy-option-hover-bg`,
`--gdy-scrollbar-thumb`, en los primitivos `--gdy-menu-*`, `--gdy-popover-*`, `--gdy-toggle-*` y
`--gdy-calendar-*`, y en el asistente `--gdy-ai-*` (acento, fondo del panel y burbujas). La lista de
cada módulo está en su README o en su guía.

### Clases

Todo lo que pinta la librería lleva una clase con prefijo `gdy-`, pensada como punto de
extensión estable:

- `gdy-<módulo>-<parte>` para lo propio de cada módulo: `gdy-table-head-trigger`,
  `gdy-table-pagination`, `gdy-kanban-column`, `gdy-kanban-card`.
- `gdy-<parte>` para lo que comparten tabla y kanban: `gdy-card`, `gdy-toolbar`, `gdy-btn`,
  `gdy-input`, `gdy-panel`, `gdy-option-item`, `gdy-date-input`, `gdy-view-switch`.
- `gdy-<primitivo>-<parte>` para los primitivos sobre Radix y react-day-picker
  (`src/components/ui`, hoja `src/components/ui/styles.css`): `gdy-button` (con `data-variant` y
  `data-size`), `gdy-select-trigger|content|item`, `gdy-menu-content|item|label|separator`,
  `gdy-popover-content`, `gdy-toggle-group|item` y `gdy-calendar-*` (raíz, meses, navegación,
  cabecera con desplegables, celda `gdy-calendar-day` y botón `gdy-calendar-day-button`). Los
  `data-slot` de shadcn se conservan como segundo gancho.
- `gdy-ai-<parte>` para el asistente (`src/components/ai`, hoja `src/components/ai/styles.css`):
  `gdy-ai-button` (lanzador, sobre `gdy-button`), `gdy-ai-overlay`, `gdy-ai-sidebar`,
  `gdy-ai-header|title|subtitle|reset|close`, `gdy-ai-body`, `gdy-ai-empty|chips|chip`,
  `gdy-ai-message|avatar|bubble|text`, `gdy-ai-thinking`, `gdy-ai-action-card|kicker|title|field`,
  `gdy-ai-footer|input-wrapper|textarea|send` y `gdy-ai-markdown|md-heading|md-item|md-paragraph`.
  Los slots de `classNames` se añaden detrás del gancho del elemento que nombran.
- Estados por atributo, nunca por clase: booleanos presentes o ausentes (`data-filtered`,
  `data-selected`, `data-checked`, `data-dragging`, `data-drop-target`, `data-clickable`) y ARIA
  cuando ya existe (`aria-pressed="true"` en el switch de vista y en los botones de orden y operador
  del panel, `aria-expanded="false"` en el toggle de un grupo colapsado). En los primitivos valen
  los atributos que ponen Radix y react-day-picker (`data-state`, `data-highlighted`,
  `data-disabled`, `data-placeholder`, `data-today`, `data-outside`, `data-selected`) más los de
  rango del calendario (`data-range-start|middle|end`, `data-selected-single`). En el asistente,
  `data-state="open|closed"` en el panel, `data-empty` en el cuerpo, `data-role="user|assistant"`
  en mensajes y burbujas, `data-streaming` y `data-thinking` en las filas transitorias,
  `data-action-type` en la tarjeta de acción y `data-list` en los ítems del markdown. Se estilizan
  como `.gdy-kanban-card[data-dragging]`, `.gdy-view-switch-btn[aria-pressed="true"]`,
  `.gdy-menu-item[data-disabled]` o `.gdy-ai-sidebar[data-state="open"]`.
- Ganchos estructurales sin estilos por defecto (`gdy-table-head`, `gdy-table-body`,
  `gdy-table-empty-row`, los iconos `gdy-*-icon`…): existen para que los apuntes desde tu CSS. La
  lista completa es `hookOnly` en `scripts/audit-allowlist.json`.
- Utilidades que se pasan por props: `gdy-table-min-h-sm|md|lg`, `gdy-table-max-h-sm|md|lg` y
  `gdy-kanban-min-h-sm|md|lg`.

Las reglas de la librería usan una sola clase, o un flag de raíz más una clase
(`.gdy-thin-scroll .gdy-scroll`, `.gdy-table-sticky .gdy-table-head-cell`, el hover de fila
`.gdy-table-row[data-clickable]:hover .gdy-table-cell`), así que una regla con el mismo selector en
tu CSS, cargado después de `gridory/styles.css`, la sobrescribe. Las variantes (`data-variant` y
`data-size` de los primitivos, `data-role` de las burbujas del asistente) van dentro de `:where()`
y pesan como la base, así que una clase que pases por `className`, `triggerClassName` o los slots
de `classNames` también las sobrescribe; los estados van planos y ganan a la base. Cuando un módulo
ajusta un primitivo lo hace a dos clases (`.gdy-button.gdy-ai-send`,
`.gdy-select-trigger.gdy-table-inline-select`), nunca por orden de carga. Las únicas reglas por etiqueta son `.gdy-menu-item svg` y `.gdy-toggle-item svg`, para
los iconos que trae tu app. `npm run audit:styles` comprueba que cada clase emitida tenga su regla
o esté declarada como gancho, que ninguna regla quede huérfana, que no sobreviva ningún nombre
heredado ni clase de estado, que cada selector de atributo se emita de verdad y que en `ui`,
`table`, `kanban`, `shared` y `ai` ningún literal de clase sea otra cosa que un gancho `gdy-`.

## Inicio rápido

### Tabla

```tsx
import { DataTable, type ColumnDefinition } from "gridory/table";

type Lead = { id: string; name: string; status: string };

const columns: ColumnDefinition<Lead>[] = [
  { id: "name", header: "Nombre", accessor: (row) => row.name, searchable: true },
  {
    id: "status",
    header: "Estado",
    accessor: (row) => row.status,
    filterable: true,
    filterOptions: [
      { value: "new", label: "Nuevo" },
      { value: "won", label: "Ganado" },
    ],
  },
];

<DataTable columns={columns} data={leads} getRowId={(row) => row.id} />;
```

### Kanban

```tsx
import { KanbanBoard } from "gridory/kanban";
```

Usa las mismas definiciones de columna que la tabla (`fields`) y añade `groups`,
`defaultGroupId` y `getCardId`. Ejemplos completos en la
[documentación del kanban](src/components/kanban/README.md).

### Asistente de IA

```tsx
import { AIChatButton, AIChatSidebar, useAIChat } from "gridory/ai";
```

Funciona en modo `chatbot`, `table` o `kanban`, con presets para OpenAI, Gemini,
OpenRouter, Groq, Together, DeepSeek y Ollama. Pinta con clases `gdy-ai-*` y tokens
`--gdy-ai-*` propios, sin Tailwind. Configuración de proveedor, prompts, memoria, eventos y
estilos en la [guía del asistente](src/components/ai/docs/ai-assistant.md).

## Demo local

El repositorio incluye una aplicación de demo con mocks de cada módulo:

```bash
npm install
npm run dev
```

- `http://localhost:5173/mocks/table` — tabla
- `http://localhost:5173/mocks/kanban` — kanban
- `http://localhost:5173/mocks/ai` — tabla + kanban + asistente de IA con panel de eventos

Para probar el chat con un proveedor real:

1. Copia las variables: `cp .env.example .env.local`.
2. Completa `VITE_AI_API_KEY`. Para Gemini en desarrollo usa `VITE_AI_BASE_URL=/api/google-openai`
   (proxy de Vite que evita CORS) y `VITE_AI_MODEL=gemini-2.5-flash`.
3. Levanta la demo con `npm run dev`.

Sin `VITE_AI_API_KEY` el mock se muestra igual, pero no hace llamadas reales al proveedor.

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con la demo. |
| `npm run build` | Chequeo de tipos, bundle ESM en `dist/` y declaraciones en `dist/types/`. |
| `npm run lint` | ESLint sobre todo el proyecto. |
| `npm run typecheck` | `tsc -b` sin emitir archivos. |
| `npm run audit:styles` | Tras `npm run build`: sin nombres heredados ni colores literales fuera de `tokens.css`, tokens de componente con fallback, y cada clase `gdy-*` con su regla (y viceversa). |

## Documentación

- Tabla: [`src/components/table/README.md`](src/components/table/README.md)
- Kanban: [`src/components/kanban/README.md`](src/components/kanban/README.md)
- Asistente de IA: [`src/components/ai/docs/ai-assistant.md`](src/components/ai/docs/ai-assistant.md)
  y [`ai-assistant-events.md`](src/components/ai/docs/ai-assistant-events.md)
- Notas de versión: en las [releases de GitHub](https://github.com/VictorDiazJauregui/gridory/releases)

## Roadmap

- [ ] Vista Gantt / línea de tiempo
- [ ] Constructor de formularios
- [ ] Sidebar y navegación

## Licencia

MIT © Victor Díaz Jáuregui
