# Gridory

[English](README.md) · [Español](README.es.md)

Componentes de React + TypeScript para aplicaciones con muchos datos. Emiten eventos; tu aplicación
conserva los datos.

## Por qué Gridory

- **Un modelo de datos, varias vistas.** La tabla y el kanban leen las mismas filas y las mismas definiciones de campos.
- **Orientado a eventos.** Los cambios te llegan como callbacks; los datos que pasas nunca se modifican.
- **El asistente pregunta antes de actuar.** `onAction` solo se dispara cuando el usuario confirma una propuesta.
- **Tipado de principio a fin.** Los componentes son genéricos sobre tu tipo de fila, y la API pública no usa `any`.

## Instalación

```bash
npm install gridory
```

`react` y `react-dom` (18.2 o posterior, o 19) son peer dependencies. Importa la hoja de estilos una
sola vez y antes de tu propio CSS. No necesitas Tailwind.

```ts
import "gridory/styles.css";
```

Los textos de la interfaz vienen en español, y puedes reemplazar cualquiera de ellos con props.

## Inicio rápido

```tsx
import { DataTable, type ColumnDefinition } from "gridory/table";

type Lead = { id: string; name: string; status: string };

const leads: Lead[] = [
  { id: "1", name: "Acme", status: "new" },
  { id: "2", name: "Globex", status: "won" },
];

const columns: ColumnDefinition<Lead>[] = [
  { id: "name", header: "Nombre", accessor: (row) => row.name, searchable: true, sortable: true },
  { id: "status", header: "Estado", accessor: (row) => row.status, filterable: true },
];

export const LeadsTable = () => (
  <DataTable columns={columns} data={leads} getRowId={(row) => row.id} />
);
```

## Componentes

Cada componente tiene su propia guía con todas sus props, eventos y ganchos de estilo. Consúltala
cuando necesites el detalle.

### Datos

| Componente | Import | Guía |
|---|---|---|
| `DataTable`: orden, filtros, paginación, agrupado, edición en línea y modo servidor. | `gridory/table` | [Tabla](docs/table.es.md) |
| `KanbanBoard`: los mismos datos como tarjetas, con arrastrar y soltar entre columnas. | `gridory/kanban` | [Kanban](docs/kanban.es.md) |
| Barra de herramientas, búsqueda, filtros y acciones de fila que comparten las dos vistas. | `gridory/table`, `gridory/kanban` | [Toolbar, filtros y acciones](docs/toolbar.es.md) |

### IA

| Componente | Import | Guía |
|---|---|---|
| `AIChatSidebar` y `useAIChat`: un asistente que propone cambios sobre tus datos y espera tu confirmación. Funciona con proveedores compatibles con OpenAI. | `gridory/ai` | [Asistente de IA](docs/ai-assistant.es.md) |

El asistente necesita el SDK `openai`, una peer dependency opcional: ejecuta `npm install openai` solo
si lo usas.

### Formularios

| Componente | Import | Guía |
|---|---|---|
| `LoginForm` y `SignUpForm`: inicio de sesión y registro con validación. | `gridory/auth` | [Formularios de autenticación](docs/auth-forms.es.md) |
| `SegmentedControl`: una elección única entre pocas opciones. | `gridory/segmented-control` | [Control segmentado](docs/segmented-control.es.md) |
| `CountrySelect`: uno o varios países, con búsqueda y banderas. | `gridory/country-select` | [Selector de país](docs/country-select.es.md) |
| `PhoneInput`: un teléfono con su prefijo internacional. | `gridory/phone-input` | [Teléfono con prefijo](docs/phone-input.es.md) |

### Navegación

| Componente | Import | Guía |
|---|---|---|
| `SidebarLayout` y `Sidebar`: un menú lateral con modos al pasar el cursor y fijado, y un panel para móvil. | `gridory/sidebar` | [Menú lateral](docs/sidebar.es.md) |

### Contenido

| Componente | Import | Guía |
|---|---|---|
| `MarkdownEditor`: escribe Markdown con vista previa HTML en vivo y sanitizada, barra de herramientas configurable y guía de sintaxis. | `gridory/markdown-editor` | [Editor Markdown](docs/markdown-editor.es.md) |

Los diagramas y las fórmulas usan `mermaid` y `katex`, peer dependencies opcionales: instálalas solo
si las usas, y pasa `mermaidDiagrams` de `gridory/markdown-editor/mermaid` o `katexFormulas` de
`gridory/markdown-editor/katex`. Cada una se descarga recién cuando un documento muestra su primer
diagrama o fórmula.

Todo, salvo el asistente de IA, también se puede importar desde `gridory`.

## Temas y estilos

Los colores, radios y sombras salen de tokens `--gdy-*`, con un tema claro y uno oscuro. Puedes
sobrescribirlos en tu CSS o apuntar a las clases `gdy-*` que lleva cada elemento. Consulta
[Temas y estilos](docs/theming.es.md) y el [catálogo de ganchos de estilo](docs/style-hooks.es.md).

## Contribuir

Los issues y los pull requests son bienvenidos. En [CONTRIBUTING.es.md](CONTRIBUTING.es.md) se
explica cómo correr la demo y los chequeos en local. Las notas de cada versión están en las
[releases de GitHub](https://github.com/VictorDiazJauregui/gridory/releases).

## Licencia

[MIT](LICENSE) © Victor Díaz Jáuregui.
