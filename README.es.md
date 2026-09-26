# Gridory

[English](README.md) · [Español](README.es.md)

Componentes de React para aplicaciones con muchos datos: una tabla, un tablero kanban, un asistente
de IA y formularios de inicio de sesión y de registro que emiten eventos en lugar de modificar tus
datos.

> Repositorio privado, versión 1.0.0. La publicación en npm está pendiente; mientras tanto, el
> paquete se consume desde este repositorio.

## Por qué Gridory

- **Un modelo de datos, varias vistas.** La tabla y el kanban leen las mismas filas y las mismas definiciones de campos.
- **Orientado a eventos.** Los cambios te llegan como callbacks; los datos que pasas nunca se modifican.
- **El asistente pregunta antes de actuar.** `onAction` solo se dispara cuando el usuario confirma una propuesta.
- **Tipado de principio a fin.** Los componentes son genéricos sobre tu tipo de fila, y la API pública no usa `any`.

## Módulos

| Import | Qué incluye |
|---|---|
| `gridory` | Todo lo de abajo salvo la hoja de estilos y el preset: componentes, hooks, helpers, constantes y tipos. |
| `gridory/table` | `DataTable` y sus tipos, más los exports compartidos del modelo de datos, la toolbar y las acciones de fila. |
| `gridory/kanban` | `KanbanBoard` y sus tipos, más los mismos exports compartidos. |
| `gridory/ai` | `AIChatSidebar`, `AIChatButton`, `useAIChat`, los presets de proveedor, los constructores de prompts, los textos por defecto y los tipos del asistente. |
| `gridory/auth` | `LoginForm`, `SignUpForm`, sus textos y campos por defecto, los errores de configuración y los tipos de autenticación. |
| `gridory/styles.css` | La hoja de estilos compilada de todos los módulos, con los tokens del tema claro y del oscuro. |
| `gridory/tailwind-preset` | Preset opcional de Tailwind que mapea los tokens `--gdy-*` a claves de tema al estilo de shadcn (`bg-primary`, `border-border`) para usarlas en tu propio markup. |

## Instalación

```bash
npm install gridory
```

`react` y `react-dom` (18.2 o posterior, o 19) son peer dependencies. Mientras el paquete no esté en
npm, genera el build desde un clon con `npm run build`. Después, ejecuta ahí `npm link` y luego
`npm link gridory` en tu app, o bien ejecuta `npm pack` e instala el tarball generado.

Importa la hoja de estilos una sola vez y antes de tu propio CSS. Así, si una regla tuya usa el mismo
selector que una de la librería, gana la tuya. No necesitas Tailwind.

```ts
import "gridory/styles.css";
```

Los textos que trae la interfaz están en español (`"Buscar..."`, `"Nuevo"`, las etiquetas de los
menús, los mensajes del asistente). Puedes reemplazar cualquiera de ellos con props; cada guía las
enumera.

## Inicio rápido

### Tabla

```tsx
import { DataTable, type ColumnDefinition } from "gridory/table";

type Lead = { id: string; name: string; status: string };

const leads: Lead[] = [
  { id: "1", name: "Acme", status: "new" },
  { id: "2", name: "Globex", status: "won" },
];

const columns: ColumnDefinition<Lead>[] = [
  { id: "name", header: "Name", accessor: (row) => row.name, searchable: true, sortable: true },
  { id: "status", header: "Status", accessor: (row) => row.status, filterable: true },
];

export const LeadsTable = () => (
  <DataTable columns={columns} data={leads} getRowId={(row) => row.id} />
);
```

Guía: [docs/table.es.md](docs/table.es.md).

### Kanban

```tsx
import { KanbanBoard, type ColumnDefinition, type KanbanGroupOption } from "gridory/kanban";

type Task = { id: string; title: string; status: string };

const tasks: Task[] = [
  { id: "1", title: "Write the brief", status: "todo" },
  { id: "2", title: "Review the design", status: "done" },
];

const fields: ColumnDefinition<Task>[] = [
  { id: "title", header: "Title", accessor: (card) => card.title, searchable: true },
];

const statusGroup: KanbanGroupOption<Task> = {
  id: "status",
  label: "Status",
  accessor: (card) => card.status,
  setValue: (card, status) => ({ ...card, status }),
  values: [{ value: "todo", label: "To do" }, { value: "done", label: "Done" }],
};

const saveTask = (task: Task) =>
  fetch(`/api/tasks/${task.id}`, { method: "PATCH", body: JSON.stringify(task) });

export const TasksBoard = () => (
  <KanbanBoard
    fields={fields}
    data={tasks}
    groups={[statusGroup]}
    defaultGroupId="status"
    getCardId={(card) => card.id}
    onCardMove={({ updatedCard }) => saveTask(updatedCard)}
  />
);
```

Guía: [docs/kanban.es.md](docs/kanban.es.md). Lo que comparten las dos vistas: [docs/toolbar.es.md](docs/toolbar.es.md).

### Asistente de IA

```tsx
import { useState } from "react";
import { AIChatButton, AIChatSidebar, resolveProviderConfig } from "gridory/ai";
import type { AIActionEvent, AIDataSchema } from "gridory/ai";

const dataSchema: AIDataSchema = {
  entityName: "leads",
  entityNameSingular: "lead",
  fields: [{ id: "name", label: "Name", type: "text", required: true }],
};

const createLead = (lead: Record<string, unknown>) =>
  fetch("/api/leads", { method: "POST", body: JSON.stringify(lead) });

export const LeadsAssistant = ({ apiKey }: { apiKey: string }) => {
  const [open, setOpen] = useState(false);
  const handleAction = (event: AIActionEvent) => {
    if (event.type === "create-row") createLead(event.payload);
  };
  return (
    <>
      <AIChatButton onClick={() => setOpen(true)} />
      <AIChatSidebar
        open={open}
        onClose={() => setOpen(false)}
        providerConfig={resolveProviderConfig("openai", { apiKey })}
        mode="table"
        dataSchema={dataSchema}
        onAction={handleAction}
      />
    </>
  );
};
```

Las llamadas al proveedor salen del navegador con esa API key. Usa una key restringida o apunta
`baseURL` a un proxy que controles. Guía: [docs/ai-assistant.es.md](docs/ai-assistant.es.md).

### Formularios de autenticación

```tsx
import { LoginForm } from "gridory/auth";

const signIn = (values: { email: string; password: string }) =>
  fetch("/api/login", { method: "POST", body: JSON.stringify(values) });

export const SignIn = () => (
  <LoginForm
    onSubmit={signIn}
    forgotPassword={{ href: "/recuperar" }}
    signUpLink={{ href: "/registro" }}
  />
);
```

`SignUpForm` suma los campos de nombre, los requisitos de contraseña y tus propios campos. Guía:
[docs/auth-forms.es.md](docs/auth-forms.es.md).

## Temas y estilos

Los colores, el radio de los bordes y las sombras salen de los tokens `--gdy-*` de
`gridory/styles.css`. El tema claro es el predeterminado; el oscuro se activa con la clase `dark` o
con `data-theme="dark"` en `<html>`. Los tokens base leen la variable de shadcn/ui del mismo nombre
cuando tu app la define. Para sobrescribir tokens, hazlo en `:root`/`.dark`:

```css
:root { --gdy-primary: #0f766e; --gdy-radius: 6px; }
.dark { --gdy-primary: #5eead4; }
```

Cada elemento lleva una clase `gdy-*` y atributos de estado. Consulta [docs/theming.es.md](docs/theming.es.md)
y el catálogo completo en [docs/style-hooks.es.md](docs/style-hooks.es.md).

## Documentación

| English | Español | Contenido |
|---|---|---|
| [Table](docs/table.md) | [Tabla](docs/table.es.md) | `DataTable`: columnas, ordenamiento, paginación, agrupado, edición en línea, modo servidor. |
| [Kanban](docs/kanban.md) | [Kanban](docs/kanban.es.md) | `KanbanBoard`: campos, grupos, drag and drop, renderizado de tarjetas, eventos. |
| [Toolbar](docs/toolbar.md) | [Toolbar, filtros y acciones](docs/toolbar.es.md) | Lo que comparten las dos vistas: toolbar, búsqueda, filtros, vista de archivados, cambio de vista, acciones de fila y de tarjeta. |
| [AI assistant](docs/ai-assistant.md) | [Asistente de IA](docs/ai-assistant.es.md) | Proveedor, modos, acciones, memoria, interfaz, `useAIChat` y eventos. |
| [Auth forms](docs/auth-forms.md) | [Formularios de autenticación](docs/auth-forms.es.md) | `LoginForm` y `SignUpForm`: campos, validación, zod, Google, textos y estilos. |
| [Theming](docs/theming.md) | [Temas y estilos](docs/theming.es.md) | Tokens, tema claro/oscuro, sobrescrituras, contrato de estilos, animaciones, preset de Tailwind. |
| [Style hooks](docs/style-hooks.md) | [Ganchos de estilo](docs/style-hooks.es.md) | Catálogo generado de todas las clases, atributos de estado y tokens. |

Las pautas para contribuir están en [CONTRIBUTING.es.md](CONTRIBUTING.es.md). Las notas de cada
versión se publican en las [releases de GitHub](https://github.com/VictorDiazJauregui/gridory/releases).

## Demo local

Ejecuta `npm install` y `npm run dev`, y abre `http://localhost:5173/mocks/table`, `/mocks/kanban`,
`/mocks/ai` (tabla, kanban y asistente juntos, con un registro de eventos) o `/mocks/auth` (ejemplos
de inicio de sesión y de registro, con un registro de eventos). Añade `?theme=dark` o
`?theme=light` para forzar un tema. La app de demo usa Tailwind solo para sí misma; nada de eso llega
al paquete.

Para chatear con un proveedor real, copia las variables con `cp .env.example .env.local`, define
`VITE_AI_API_KEY` y reinicia `npm run dev`. Los valores de ejemplo apuntan a Gemini:
`VITE_AI_BASE_URL=/api/google-openai` (un proxy de Vite que evita CORS) y
`VITE_AI_MODEL=gemini-2.5-flash`. Sin key, el mock se renderiza, pero no hace ninguna llamada.

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo de Vite con la demo. |
| `npm run build` | Comprobación de tipos, bundle ESM en `dist/` y declaraciones de tipos en `dist/types/`. |
| `npm run lint` | ESLint sobre el código fuente y `scripts/`, con las reglas de estilo del proyecto: funciones como expresiones `const`, retornos tempranos (sin `else` después de `return`), sin ternarios anidados, profundidad de anidamiento de 2, y como máximo 3 parámetros y 20 líneas por función. |
| `npm run typecheck` | `tsc -b` sin generar archivos. |
| `npm test` / `npm run test:watch` | Vitest y Testing Library sobre jsdom, con los tests de `src/test/`; la variante watch los vuelve a ejecutar con cada cambio. |
| `npm run audit:styles` | Después de `npm run build`: contrasta las hojas de estilos con las clases y los atributos de estado que emiten los componentes, y comprueba que `docs/style-hooks.md` está al día. |
| `npm run docs:hooks` | Regenera `docs/style-hooks.md` y `docs/style-hooks.es.md` a partir del código fuente. |

## Estructura del código

Cada módulo vive en `src/components/<module>/`. La raíz contiene la superficie pública y los
contratos (`index.tsx`, o `index.ts` en `ai/` y `auth/`, más `types.ts`, `constants.ts` y `styles.css`). El
resto se reparte en carpetas por área, nunca por tipo de archivo, con entre 3 y 12 archivos cada una
y sin barrel files dentro.

| Carpeta | Áreas |
|---|---|
| `table/` | `model/`, `header/`, `body/`, `pagination/` |
| `kanban/` | `model/`, `toolbar/`, `board/`, `card/` |
| `ai/` | `chat/`, `completion/`, `sidebar/`, `transcript/`, `actions/` |
| `auth/` | `config/`, `model/`, `fields/`, `password/`, `validation/`, `layout/`, `actions/` |
| `shared/` | Contratos comunes en la raíz; `controls/`, `rows/`, `toolbar/`, `filter-menu/`, `date-filter-menu/`, `date-pickers/`, `menu/` |
| `ui/` | Primitivos sobre Radix y react-day-picker: `select/`, `toggle-group/`, `calendar/` |
| `mocks/` | Datos y configuración de la demo |

La app de demo está en `src/demo/`, los tests en `src/test/` y las guías en `docs/`. La demo, los
mocks y los tests quedan fuera del paquete y de la auditoría de estilos.

## Contribuir

Los issues y los pull requests son bienvenidos. Antes, lee [CONTRIBUTING.es.md](CONTRIBUTING.es.md).

## Hoja de ruta

- Vista de Gantt / línea de tiempo
- Constructor de formularios
- Barra lateral y navegación

## Licencia

MIT © Victor Díaz Jáuregui. Puedes usar, copiar, modificar, fusionar, publicar, distribuir,
sublicenciar y vender el software, en proyectos personales o comerciales, siempre que conserves el
aviso de copyright y el texto de la licencia en todas las copias. Se ofrece sin ninguna garantía.
Consulta [LICENSE](LICENSE).
