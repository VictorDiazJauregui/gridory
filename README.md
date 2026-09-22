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
| `gridory/table` | `ReusableDataTable`: búsqueda global, filtros por columna y fecha, orden tri-estado, paginación client o server-side, edición inline, agrupado de filas, acciones por fila componibles, barra de herramientas configurable y cabecera fija con scroll interno. |
| `gridory/kanban` | `ReusableKanban`: tablero sobre el mismo modelo de datos, columnas por campo de agrupación, arrastrar y soltar, filtros, orden y render de tarjeta personalizado. |
| `gridory/ai` | `AIChatSidebar`, `AIChatButton` y `useAIChat`: asistente lateral para cualquier proveedor compatible con la API de OpenAI, con tool-calling que propone acciones que el usuario confirma. |
| `gridory/styles.css` | CSS compilado de tabla, kanban y selectores (`dist/gridory.css`). |

## Instalación

Dependencias peer: React 18.2+ o 19 y `react-dom`. La aplicación consumidora debe usar Tailwind CSS v3.

```bash
npm install gridory
```

> Mientras el paquete no esté publicado en npm, instálalo desde el repositorio o enlázalo
> localmente con `npm link` después de ejecutar `npm run build`.

Importa el CSS compilado una sola vez en tu aplicación:

```ts
import "gridory/styles.css";
```

## Inicio rápido

### Tabla

```tsx
import { ReusableDataTable, type ReusableColumn } from "gridory/table";

type Lead = { id: string; name: string; status: string };

const columns: ReusableColumn<Lead>[] = [
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

<ReusableDataTable columns={columns} data={leads} getRowId={(row) => row.id} />;
```

### Kanban

```tsx
import { ReusableKanban } from "gridory/kanban";
```

Usa las mismas definiciones de columna que la tabla (`fields`) y añade `groups`,
`defaultGroupId` y `getCardId`. Ejemplos completos en la
[documentación del kanban](src/components/kanban/README.md).

### Asistente de IA

```tsx
import { AIChatButton, AIChatSidebar, useAIChat } from "gridory/ai";
```

Funciona en modo `chatbot`, `table` o `kanban`, con presets para OpenAI, Gemini,
OpenRouter, Groq, Together, DeepSeek y Ollama. Configuración de proveedor, prompts,
memoria y eventos en la [guía del asistente](src/components/ai/docs/ai-assistant.md).

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
